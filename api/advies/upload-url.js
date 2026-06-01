// Vercel serverless function (CommonJS, no dependencies).
//
// Same-origin proxy for the Vercel Blob client-upload token handshake.
// The browser's @vercel/blob `upload()` POSTs a small JSON body here
// ({ type: 'blob.generate-client-token', payload }) and expects a signed
// clientToken back. We forward it to the Woonklasse monorepo's
// /api/advies/upload-url, which holds BLOB_READ_WRITE_TOKEN and mints the
// token. The actual photo bytes go browser → Vercel Blob directly (never
// through this function), so the 4.5 MB function body limit doesn't apply.
//
// Keeping it a proxy means no Blob secret is duplicated into this project.

const UPSTREAM =
  process.env.ADVIES_UPLOAD_UPSTREAM_URL ||
  'https://badkamerstijl.nl/api/advies/upload-url';

async function readRaw(req) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);
  return await new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => resolve(raw));
    req.on('error', () => resolve(''));
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = await readRaw(req);
  const clientIp =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) ||
    '';

  try {
    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      },
      body: raw || '{}',
      signal: AbortSignal.timeout(15000),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    console.error('[advies/upload-url proxy] upstream error:', err);
    return res.status(502).json({ error: 'Upload service tijdelijk niet bereikbaar.' });
  }
};
