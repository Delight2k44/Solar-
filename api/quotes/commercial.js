// Vercel Serverless Function: POST /api/quotes/commercial
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

  const {
    companyName,
    facilityType,
    monthlySpend,
    peakKva,
    dieselMonthly,
    taxSection12b,
    contactName,
    designation,
    email,
    phone,
    locationCity
  } = req.body || {};

  const errors = [];
  if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
    errors.push('Company / Enterprise name is required');
  }
  if (!contactName || typeof contactName !== 'string' || contactName.trim().length < 2) {
    errors.push('Authorized contact name is required');
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.push('A valid corporate email address is required');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.push('A valid contact phone number is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }

  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeCompany = escapeHtml(companyName.trim());
  const safeContact = escapeHtml(contactName.trim());
  const safeEmail = escapeHtml(email.trim());
  const safePhone = escapeHtml(phone.trim());
  const safeDesignation = escapeHtml((designation || 'Executive').trim());
  const safeFacility = escapeHtml((facilityType || 'Commercial / Industrial Facility').trim());
  const safeSpend = escapeHtml((monthlySpend || 'R 50,000 – R 100,000 / month').trim());
  const safePeak = escapeHtml((peakKva || '100 kVA – 250 kVA').trim());
  const safeDiesel = escapeHtml((dieselMonthly || 'None / Infrequent').trim());
  const safeLocation = escapeHtml((locationCity || 'Gauteng, South Africa').trim());
  const isSection12b = Boolean(taxSection12b);

  const referenceId = `KX-COMM-${Math.floor(1000 + Math.random() * 9000)}`;
  const ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];
  const FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Commercial & Industrial 50kW+ Solar Audit</p>
      </div>
      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Commercial Audit Reference: #${referenceId}</h2>
        <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
          Hello <strong style="color:#FFF;">${safeContact}</strong>, your enterprise load profile for <strong style="color:#00D2FF;">${safeCompany}</strong> has been registered.
        </p>
      </div>
      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Enterprise Profile</h3>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Enterprise:</strong> <span style="color:#FFF;">${safeCompany}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Contact Person:</strong> <span style="color:#FFF;">${safeContact} (${safeDesignation})</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${safeEmail}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${safePhone}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Location:</strong> <span style="color:#FFF;">${safeLocation}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Facility Type:</strong> <span style="color:#FFF;">${safeFacility}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Monthly Electricity Spend:</strong> <span style="color:#00D2FF;font-weight:bold;">${safeSpend}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Estimated Peak Demand:</strong> <span style="color:#FFF;">${safePeak}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Diesel Generator Spend:</strong> <span style="color:#FFF;">${safeDiesel}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>SARS Section 12B Depreciation:</strong> <span style="color:#10B981;font-weight:bold;">${isSection12b ? 'Enabled (125% Year-1 Write-Off)' : 'Standard'}</span></p>
      </div>
      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">Commercial Projects Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">form@kinetixes.com</strong></p>
        <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd. Commercial 3-Phase SANS Engineering.</p>
      </div>
    </div>
  `;

  const recipients = [...ADMIN_EMAILS];
  if (safeEmail && safeEmail.includes('@') && !ADMIN_EMAILS.includes(safeEmail)) {
    recipients.push(safeEmail);
  }

  let mailerResult = { status: 'logged' };
  if (RESEND_API_KEY) {
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
          subject: `🏢 [Commercial Audit] ${safeCompany} (${safeSpend}) — #${referenceId}`,
          html: emailHtml,
        }),
      });
      const resendJson = await resendResp.json();
      if (resendResp.ok) {
        mailerResult = { status: 'delivered', resendId: resendJson.id };
      }
    } catch (err) {
      mailerResult = { status: 'mailer_error', error: err.message };
    }
  }

  return res.status(200).json({
    success: true,
    referenceId,
    message: 'Commercial energy audit registered successfully',
    recipients,
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
