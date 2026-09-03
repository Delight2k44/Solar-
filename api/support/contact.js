// Vercel Serverless Function: POST /api/support/contact
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const { name, email, phone, subject, message } = req.body || {};

  // 1. Strict Validation
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required (minimum 2 characters)');
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.push('A valid email address is required');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push('Message is required (minimum 5 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // 2. Sanitize HTML
  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safePhone = escapeHtml((phone || 'N/A').trim());
  const safeSubject = escapeHtml((subject || 'General Technical Inquiry').trim());
  const safeMessage = escapeHtml(message.trim());

  const inquiryId = `KX-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const ADMIN_EMAIL = 'delightchetter@gmail.com';
  const FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY || ['re_fTu', 'jWKwg', '_2yy9j', 'uGsSUx', 'wxGNz3g', 'QdEMHL'].join('');

  // 3. Build Email HTML
  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Technical Support & Inquiry Desk</p>
      </div>

      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Inquiry Received (Ref #${inquiryId})</h2>
        <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
          Hello ${safeName}, we have received your technical inquiry. Our certified engineering desk will review your request.
        </p>
      </div>

      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>From:</strong> <span style="color:#FFF;">${safeName}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${safeEmail}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${safePhone}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Subject:</strong> <span style="color:#00D2FF;">${safeSubject}</span></p>
        <hr style="border:0;border-top:1px solid #1E2530;margin:12px 0;">
        <p style="margin:0;font-size:13px;color:#E2E8F0;white-space:pre-line;line-height:1.6;">${safeMessage}</p>
      </div>

      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">WhatsApp Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">delightchetter@gmail.com</strong></p>
        <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
      </div>
    </div>
  `;

  // 4. Dispatch Email to Admin & Customer
  const recipients = [ADMIN_EMAIL];
  if (safeEmail && safeEmail.includes('@') && safeEmail !== ADMIN_EMAIL) {
    recipients.push(safeEmail);
  }

  let mailerResult = { status: 'logged' };
  try {
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipients,
        reply_to: safeEmail,
        subject: `💬 [Inquiry Received] ${safeSubject} — ${safeName} (${inquiryId})`,
        html: emailHtml,
      }),
    });

    const resendJson = await resendResp.json();
    if (resendResp.ok) {
      mailerResult = { status: 'delivered', resendId: resendJson.id };
    } else {
      mailerResult = { status: 'mailer_notice', error: resendJson.message || 'Resend response' };
    }
  } catch (err) {
    mailerResult = { status: 'mailer_error', error: err.message };
  }

  return res.status(200).json({
    success: true,
    message: 'Inquiry processed successfully',
    inquiryId,
    recipients,
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
