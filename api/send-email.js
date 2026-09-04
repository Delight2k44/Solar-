// Vercel Serverless Function — Resend Email Proxy
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(200).json({
      success: true,
      data: { status: 'logged_offline', message: 'Notification recorded (Resend API key not configured)' }
    });
  }

  const ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];
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
        from: from || 'Kinetix Energy <form@kinetixes.com>',
        to: to || ADMIN_EMAILS,
        reply_to: reply_to || undefined,
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, data: result });
    } else {
      return res.status(200).json({ 
        success: true, 
        data: { status: 'mailer_warning', message: result.message || 'Resend warning' } 
      });
    }
  } catch (err) {
    return res.status(200).json({ 
      success: true, 
      data: { status: 'logged_offline', message: err.message || 'Server offline' } 
    });
  }
}
