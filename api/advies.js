// Vercel serverless function (CommonJS, no dependencies).
//
// Same-origin proxy for the homepage lead quiz (rooms + photos). Forwards the
// submission to the Woonklasse monorepo's working /api/advies, which validates,
// stores the lead, sends a push notification and emails it (with the Vercel
// Blob photo URLs) over SMTP. Photos themselves were already uploaded to Blob
// from the browser; this body only carries their URLs, so it stays small.
//
// Mirrors api/contact.js: forces brand=woonklasse and forwards the visitor IP
// so the upstream rate limiter keys per user, not per function egress IP.

const UPSTREAM =
  process.env.ADVIES_UPSTREAM_URL || 'https://badkamerstijl.nl/api/advies';

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body = await readJson(req);
  const payload = { ...body, brand: 'woonklasse' };

  const clientIp =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) ||
    '';

  // Fire-and-forget mirror to the Datareaches dashboard's Inquiries inbox.
  // Same secret as api/contact.js. Errors swallowed.
  (function () {
    const secret = process.env.INQUIRY_SECRET;
    if (!secret) return;
    const url = process.env.INQUIRY_SINK_URL ||
      'https://datareaches.com/api/inquiries/woonklasse';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-inquiry-secret': secret,
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      },
      body: JSON.stringify({
        name: payload.name || null,
        email: payload.email || null,
        phone: payload.phone || null,
        message: payload.message || payload.note || null,
        eventType: payload.type || 'Lead quiz (rooms+photos)',
        raw: payload,
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  })();

  try {
    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    console.error('[advies proxy] upstream error:', err);
    return res.status(502).json({
      success: false,
      message: 'Versturen mislukt. Probeer het later opnieuw of mail naar info@woonklasse.nl.',
    });
  }
};
