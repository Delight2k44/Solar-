// Vercel Serverless Function: POST /api/support/maintenance
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  const {
    clientName, clientEmail, clientPhone, siteAddress, city,
    tier, inverterBrand, systemAge, primaryReason, issueDetails
  } = req.body || {};

  const errors = [];
  if (!clientName || clientName.trim().length < 2) errors.push('Name is required');
  if (!clientEmail || !clientEmail.includes('@') || !clientEmail.includes('.')) errors.push('Valid email is required');
  if (!clientPhone || clientPhone.trim().length < 7) errors.push('Contact phone is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }

  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeName = escapeHtml(clientName.trim());
  const safeEmail = escapeHtml(clientEmail.trim());
  const safePhone = escapeHtml(clientPhone.trim());
  const safeAddress = escapeHtml((siteAddress || 'Site Address').trim());
  const safeCity = escapeHtml((city || 'Johannesburg').trim());
  const safeTier = escapeHtml((tier || 'Standard SLA').trim());
  const safeBrand = escapeHtml((inverterBrand || 'Hybrid Inverter').trim());
  const safeReason = escapeHtml((primaryReason || 'SANS Health Audit').trim());
  const safeDetails = escapeHtml((issueDetails || 'None provided').trim());

  const ticketId = `KX-SRV-${Math.floor(1000 + Math.random() * 9000)}`;
  const ADMIN_EMAIL = 'form@kinetixes.com';
  const FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Maintenance & SLA Technical Ticket</p>
      </div>
      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Service Ticket: #${ticketId}</h2>
        <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
          Hello <strong style="color:#FFF;">${safeName}</strong>, your maintenance request has been logged.
        </p>
      </div>
      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Service Tier:</strong> <span style="color:#00D2FF;font-weight:bold;">${safeTier}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Inverter Brand:</strong> <span style="color:#FFF;">${safeBrand}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Reason:</strong> <span style="color:#10B981;">${safeReason}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Location:</strong> <span style="color:#FFF;">${safeAddress}, ${safeCity}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Contact:</strong> <span style="color:#FFF;">${safeName} (${safePhone})</span></p>
        <hr style="border:0;border-top:1px solid #1E2530;margin:12px 0;">
        <p style="margin:0;font-size:13px;color:#E2E8F0;">${safeDetails}</p>
      </div>
      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">SLA Dispatch: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">form@kinetixes.com</strong></p>
      </div>
    </div>
  `;

  const recipients = [ADMIN_EMAIL];
  if (safeEmail && safeEmail.includes('@') && safeEmail !== ADMIN_EMAIL) recipients.push(safeEmail);

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
          subject: `🛠️ [Maintenance Ticket] #${ticketId} — ${safeBrand} (${safeName})`,
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
    ticketId,
    message: 'Maintenance ticket created successfully',
    recipients,
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
