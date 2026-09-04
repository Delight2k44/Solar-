// Vercel Serverless Function: POST /api/orders/checkout
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'POST only' });

  const {
    customerName, customerEmail, customerPhone, shippingAddress,
    city, propertyType, roofType, items, paymentMethod, installationRequired
  } = req.body || {};

  const errors = [];
  if (!customerName || customerName.trim().length < 2) errors.push('Customer name is required');
  if (!customerEmail || !customerEmail.includes('@') || !customerEmail.includes('.')) errors.push('Valid email is required');
  if (!customerPhone || customerPhone.trim().length < 7) errors.push('Contact phone is required');
  if (!shippingAddress || shippingAddress.trim().length < 3) errors.push('Delivery address is required');
  if (!items || !Array.isArray(items) || items.length === 0) errors.push('Cart cannot be empty');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }

  const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));

  const safeName = escapeHtml(customerName.trim());
  const safeEmail = escapeHtml(customerEmail.trim());
  const safePhone = escapeHtml(customerPhone.trim());
  const safeAddress = escapeHtml(shippingAddress.trim());
  const safeCity = escapeHtml((city || 'Johannesburg').trim());
  const safePaymentMethod = escapeHtml((paymentMethod || 'Credit Card / Instant EFT').trim());

  // Calculate order totals
  let subtotalZAR = 0;
  items.forEach(item => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unitPriceZAR || item.priceZAR) || 0;
    subtotalZAR += price * qty;
  });

  const vatZAR = Math.round(subtotalZAR * 0.15);
  const totalCartZAR = subtotalZAR + vatZAR;
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `KX-ORD-${randNum}`;
  const waybillNumber = `TCG-ZA-${randNum}`;

  const ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];
  const FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const itemRowsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0;color:#FFF;border-bottom:1px solid #1E2530;">${escapeHtml(item.productName || item.title || 'Solar Hardware')} x ${item.quantity || 1}</td>
      <td style="padding:8px 0;color:#00D2FF;text-align:right;font-family:monospace;border-bottom:1px solid #1E2530;">R ${Number((item.unitPriceZAR || item.priceZAR) * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
      <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
        <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
        <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Official Order Confirmation & Dispatch Slip</p>
      </div>
      <div style="margin:24px 0;">
        <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:4px;">Order Confirmed: #${orderId}</h2>
        <p style="color:#10B981;font-size:13px;font-family:monospace;margin:0;">Waybill: ${waybillNumber} (The Courier Guy)</p>
      </div>
      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          ${itemRowsHtml}
          <tr>
            <td style="padding:10px 0 4px;color:#94A3B8;">Subtotal (excl. VAT)</td>
            <td style="padding:10px 0 4px;color:#FFF;text-align:right;font-family:monospace;">R ${subtotalZAR.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#94A3B8;">VAT (15%)</td>
            <td style="padding:4px 0;color:#FFF;text-align:right;font-family:monospace;">R ${vatZAR.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#FFF;font-weight:bold;font-size:15px;">Total Paid</td>
            <td style="padding:8px 0;color:#00D2FF;font-weight:bold;font-size:16px;text-align:right;font-family:monospace;">R ${totalCartZAR.toLocaleString()}</td>
          </tr>
        </table>
      </div>
      <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;">
        <p style="margin:4px 0;color:#94A3B8;"><strong>Customer:</strong> <span style="color:#FFF;">${safeName} (${safePhone})</span></p>
        <p style="margin:4px 0;color:#94A3B8;"><strong>Delivery To:</strong> <span style="color:#FFF;">${safeAddress}, ${safeCity}</span></p>
        <p style="margin:4px 0;color:#94A3B8;"><strong>Payment Method:</strong> <span style="color:#FFF;">${safePaymentMethod}</span></p>
      </div>
      <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
        <p style="margin:4px 0;">Orders Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Admin: <strong style="color:#00D2FF;">form@kinetixes.com</strong></p>
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
          subject: `🛒 [Order Confirmed] #${orderId} (R ${totalCartZAR.toLocaleString()}) — ${safeName}`,
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
    orderId,
    waybillNumber,
    totalCartZAR,
    vatZAR,
    subtotalZAR,
    message: 'Order created and processed successfully',
    recipients,
    mailer: mailerResult,
    timestamp: new Date().toISOString()
  });
}
