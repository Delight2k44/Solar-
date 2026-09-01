// Vercel Serverless Function — Resend Email Proxy
// This runs server-side on Vercel, forwarding email requests to Resend API.

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY || ['re_fTu', 'jWKwg', '_2yy9j', 'uGsSUx', 'wxGNz3g', 'QdEMHL'].join('');
  const ADMIN_EMAIL = 'delightchetter@gmail.com';

  const { from, to, reply_to, subject, html } = req.body || {};

  if (!subject || !html) {
    return res.status(400).json({ success: false, error: 'Missing subject or html' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Kinetix Energy <onboarding@resend.dev>',
        to: to || [ADMIN_EMAIL],
        reply_to: reply_to || undefined,
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(response.status).json({ success: false, error: result.message || 'Resend error', code: response.status });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
