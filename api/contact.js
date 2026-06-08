// Vercel serverless function (CommonJS, no dependencies).
//
// The redesign is a static site with no backend, so lead forms POST here.
// This is a thin same-origin proxy that forwards the submission to the
// Woonklasse monorepo's already-working /api/contact endpoint (which validates,
// stores the lead, sends the push notification and emails it over SMTP).
//
// Why proxy instead of calling the monorepo directly from the browser:
//  - same-origin for the browser (no CORS / CSP changes needed on a static site)
//  - no SMTP secrets duplicated into this project
//  - we can forward the real visitor IP so the upstream per-IP rate limiter
//    keys per user instead of per function egress IP.
//
// Override the upstream with the CONTACT_UPSTREAM_URL env var if the monorepo
// project/domain ever changes.

const UPSTREAM =
  process.env.CONTACT_UPSTREAM_URL || 'https://badkamerstijl.nl/api/contact';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return await new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

// Sends a copy of the lead to the Datareaches dashboard inquiry inbox.
// Same-origin path: /api/inquiries/woonklasse on datareaches.com. Auth via
// the INQUIRY_SECRET env var (shared with the dashboard project). Errors
// are swallowed so user-facing submission is never blocked by analytics.
function mirrorToDatareaches(payload, clientIp) {
  const secret = process.env.INQUIRY_SECRET;
  if (!secret) return;
  const url = process.env.INQUIRY_SINK_URL ||
    'https://datareaches.com/api/inquiries/woonklasse';
  // The dashboard's inquiry sink expects { name, email, phone, message }.
  // Map the lead-form fields onto that shape; pass everything else under
  // `raw` so nothing is lost.
  const out = {
    name: payload.name || null,
    email: payload.email || null,
    phone: payload.phone || null,
    message: payload.message || payload.note || null,
    eventType: payload.type || null,
    raw: payload,
  };
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-inquiry-secret': secret,
      ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
    },
    body: JSON.stringify(out),
    signal: AbortSignal.timeout(5000),
  }).catch(() => { /* analytics-grade; never throws */ });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = await readJson(req);

  // The redesign only ever generates Woonklasse leads; force the brand so the
  // upstream routes the notification to the Woonklasse recipient.
  const payload = { ...body, brand: 'woonklasse' };

  const clientIp =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) ||
    '';

  // Fire-and-forget mirror to the Datareaches dashboard's inquiry inbox so
  // the operator sees every submission there too (the upstream path still
  // sends the SMTP/push to the recipient). Failures here never block the
  // user-facing flow.
  mirrorToDatareaches(payload, clientIp);

  try {
    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    console.error('[contact proxy] upstream error:', err);
    return res.status(502).json({
      success: false,
      message: 'Versturen mislukt. Probeer het later opnieuw of mail naar info@woonklasse.nl.',
    });
  }
};
