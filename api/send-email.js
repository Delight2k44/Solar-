// Vercel Serverless Function — Resend Email Proxy
// This runs server-side on Vercel, forwarding email requests to Resend API.

const ALLOWED_ORIGINS = ['https://kinetixes.com', 'https://www.kinetixes.com'];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ success: false, error: 'Email service is not configured' });
  }

  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Kinetix Energy <noreply@kinetixes.com>';
  const ADMIN_EMAIL = process.env.KINETIX_ADMIN_EMAIL || 'delightchetter@gmail.com';

  const { to, reply_to, subject, html } = req.body || {};

  if (!subject || !html) {
    return res.status(400).json({ success: false, error: 'Missing subject or html' });
  }

  const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const recipients = (Array.isArray(to) ? to : [to ?? ADMIN_EMAIL]).filter(isEmail);

  if (recipients.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid recipient' });
  }

  try {
    // The sender is fixed server-side so the endpoint cannot be used to spoof other domains.
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipients,
        reply_to: isEmail(reply_to) ? reply_to : undefined,
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data: result });
    }
    return res.status(response.status).json({ success: false, error: result.message || 'Resend error', code: response.status });
  } catch (err) {
    return res.status(502).json({ success: false, error: 'Upstream request failed' });
  }
}
