// Vercel Serverless Function: POST /api/bookings/assessment
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  const {
    clientName, email, phone, address, city, targetDate,
    roofType, phaseConnection, dbLocation, specialAccess
  } = req.body || {};

  const errors = [];
  if (!clientName || clientName.trim().length < 2) errors.push('Full name is required');
  if (!email || !email.includes('@') || !email.includes('.')) errors.push('Valid email is required');
  if (!phone || phone.trim().length < 7) errors.push('Valid contact phone is required');
  if (!address || address.trim().length < 3) errors.push('Site physical address is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }

  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeName = escapeHtml(clientName.trim());
  const safeEmail = escapeHtml(email.trim());
  const safePhone = escapeHtml(phone.trim());
  const safeAddress = escapeHtml(address.trim());
  const safeCity = escapeHtml((city || 'Johannesburg').trim());
  const safeDate = escapeHtml((targetDate || 'As soon as possible').trim());
  const safeRoof = escapeHtml((roofType || 'Tile / Corrugated').trim());
  const safePhase = escapeHtml((phaseConnection || 'Single Phase (230V)').trim());
  const safeDb = escapeHtml((dbLocation || 'Garage / Main DB').trim());
  const safeAccess = escapeHtml((specialAccess || 'None').trim());

  const bookingId = `KX-BKG-${Math.floor(1000 + Math.random() * 9000)}`;
  const ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];
  const FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">DoL Certified Site Assessment Booking</p>
      </div>
      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Inspection Scheduled: #${bookingId}</h2>
        <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
          Hello <strong style="color:#FFF;">${safeName}</strong>, your physical site inspection has been registered.
        </p>
      </div>
      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Client:</strong> <span style="color:#FFF;">${safeName}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${safePhone}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Site Address:</strong> <span style="color:#00D2FF;">${safeAddress}, ${safeCity}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Target Inspection Date:</strong> <span style="color:#10B981;font-weight:bold;">${safeDate}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Roof Profile:</strong> <span style="color:#FFF;">${safeRoof}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phase Supply:</strong> <span style="color:#FFF;">${safePhase}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>DB Board Location:</strong> <span style="color:#FFF;">${safeDb}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Access Notes:</strong> <span style="color:#FFF;">${safeAccess}</span></p>
      </div>
      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">Installation Desk: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">form@kinetixes.com</strong></p>
        <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd. SANS 10142-1 Certified Master Electricians.</p>
      </div>
    </div>
  `;

  const recipients = [...ADMIN_EMAILS];
  if (safeEmail && safeEmail.includes('@') && !ADMIN_EMAILS.includes(safeEmail)) recipients.push(safeEmail);

  let mailerResult = { status: 'logged' };
  if (RESEND_API_KEY) {
    try {
      const resendResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: recipients,
          reply_to: safeEmail,
          subject: `📅 [Site Inspection] #${bookingId} — ${safeName} (${safeCity} - ${safeDate})`,
          html: emailHtml,
        }),
      });
      const resendJson = await resendResp.json();
      if (resendResp.ok) mailerResult = { status: 'delivered', resendId: resendJson.id };
    } catch (err) {
      mailerResult = { status: 'mailer_error', error: err.message };
    }
  }

  return res.status(200).json({
    success: true,
    bookingId,
    message: 'Site assessment booking registered successfully',
    recipients,
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
