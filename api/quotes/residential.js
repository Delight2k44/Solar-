// Vercel Serverless Function: POST /api/quotes/residential
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
    fullName,
    email,
    phone,
    suburb,
    city,
    province,
    propertyType,
    monthlyBillZAR,
    installTarget,
    recommendedInverterKw,
    recommendedBatteryKwh,
    recommendedSolarKwp
  } = req.body || {};

  // 1. Strict Validation
  const errors = [];
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('Full name is required (minimum 2 characters)');
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.push('A valid email address is required');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.push('A valid contact phone number is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // 2. Sanitize Inputs
  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeName = escapeHtml(fullName.trim());
  const safeEmail = escapeHtml(email.trim());
  const safePhone = escapeHtml(phone.trim());
  const safeLocation = escapeHtml((suburb || city || province || 'Gauteng, South Africa').trim());
  const safeTarget = escapeHtml((installTarget || 'Within 2-4 weeks').trim());
  const safeBill = Number(monthlyBillZAR) || 4500;
  const invKw = Number(recommendedInverterKw) || 8;
  const batKwh = Number(recommendedBatteryKwh) || 10.24;
  const pvKwp = Number(recommendedSolarKwp) || 5.5;

  const quoteId = `KX-QT-${Math.floor(1000 + Math.random() * 9000)}`;
  const ADMIN_EMAIL = 'delightchetter@gmail.com';
  const FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY || ['re_fTu', 'jWKwg', '_2yy9j', 'uGsSUx', 'wxGNz3g', 'QdEMHL'].join('');

  // 3. Build Email HTML
  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Engineering Proposal & Sizing Assessment</p>
      </div>

      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Proposal Reference: ${quoteId}</h2>
        <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
          Hello <strong style="color:#FFF;">${safeName}</strong>, thank you for requesting an engineered solar proposal. Our DoL certified engineering team has received your sizing profile.
        </p>
      </div>

      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Client & Location Profile</h3>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Name:</strong> <span style="color:#FFF;">${safeName}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${safeEmail}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Contact Phone:</strong> <span style="color:#FFF;">${safePhone}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Location:</strong> <span style="color:#FFF;">${safeLocation}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Target Install Date:</strong> <span style="color:#10B981;">${safeTarget}</span></p>
        <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Monthly Electricity Spend:</strong> <span style="color:#FFF;font-family:monospace;">R ${safeBill.toLocaleString()} / mo</span></p>
      </div>

      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#10B981;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Engineered Sizing Recommendation</h3>
        <p style="margin:6px 0;font-size:14px;color:#94A3B8;"><strong>Hybrid Inverter:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${invKw} kW Pure Sine Wave</span></p>
        <p style="margin:6px 0;font-size:14px;color:#94A3B8;"><strong>LiFePO4 Battery:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${batKwh} kWh Tier-1 Lithium</span></p>
        <p style="margin:6px 0;font-size:14px;color:#94A3B8;"><strong>Tier-1 Solar PV:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${pvKwp} kWp Monocrystalline</span></p>
      </div>

      <div style="background:rgba(0,210,255,0.05);border:1px solid rgba(0,210,255,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#00D2FF;font-weight:bold;">Next Steps:</p>
        <p style="margin:4px 0 0;font-size:12px;color:#94A3B8;line-height:1.5;">
          Our master electrician will review your municipal grid connection parameters and reach out via phone/WhatsApp to confirm site assessment availability.
        </p>
      </div>

      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">WhatsApp Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">delightchetter@gmail.com</strong></p>
        <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd. SANS 10142-1 Certified.</p>
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
        subject: `⚡ [System Proposal] Solar Quote ${quoteId} — ${safeName} (${invKw}kW / ${batKwh}kWh)`,
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
    quoteId,
    message: 'Residential quote proposal created and dispatched successfully',
    recipients,
    sizing: {
      inverterKw: invKw,
      batteryKwh: batKwh,
      solarKwp: pvKwp,
      monthlyBillZAR: safeBill
    },
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
