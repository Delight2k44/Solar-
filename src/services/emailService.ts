/**
 * Kinetix Energy — Email Notification Service
 * Sends via server-side PHP proxy (/api/send-email.php) which forwards to Resend API.
 * This avoids CORS issues since browser never calls Resend directly.
 */

export const ADMIN_EMAIL = 'delightchetter@gmail.com';
const FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';

interface SendEmailParams {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to = ADMIN_EMAIL, subject, html, replyTo }: SendEmailParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const recipients = Array.isArray(to) ? to : [to];

    const response = await fetch('/api/send-email.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipients,
        reply_to: replyTo || undefined,
        subject,
        html
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email delivered:', result.data);
      return { success: true, data: result.data };
    }

    console.warn('Email API notice:', result.error);
    return { success: false, error: result.error };
  } catch (err: any) {
    console.error('Email dispatch error:', err);
    return { success: false, error: err.message };
  }
}

// ─── 1. Order Confirmation ────────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(data: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmountZAR: number;
  paymentMethod: string;
  waybillNumber?: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPriceZAR: number;
    includeInstallation?: boolean;
    installationPriceZAR?: number;
  }>;
}) {
  const waybill = data.waybillNumber || `TCG-ZA-${data.orderId.replace(/[^0-9]/g, '')}`;

  const itemRows = data.items.map(i =>
    `<tr><td style="padding:8px 0;color:#fff">${i.quantity}x ${i.productName}${i.includeInstallation ? '<br><span style="color:#00d2ff;font-size:11px">+ SANS Installation</span>' : ''}</td><td style="padding:8px 0;text-align:right;color:#00d2ff;font-weight:bold">R ${((i.unitPriceZAR * i.quantity) + (i.includeInstallation ? (i.installationPriceZAR || 0) : 0)).toLocaleString()}</td></tr>`
  ).join('');

  return sendEmail({
    subject: `⚡ [New Order] ${data.orderId} — R ${data.totalAmountZAR.toLocaleString()} (${data.customerName})`,
    replyTo: data.customerEmail,
    html: `
      <div style="font-family:Arial,sans-serif;background:#05070a;color:#fff;padding:30px;border-radius:12px">
        <h2 style="color:#00d2ff">⚡ New Order Confirmed</h2>
        <p style="color:#94a3b8">Ref: <strong style="color:#fff">${data.orderId}</strong></p>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>
          <p><strong>Address:</strong> ${data.shippingAddress}, ${data.city}</p>
          <p><strong>Payment:</strong> ${data.paymentMethod.toUpperCase()}</p>
          <p><strong>TCG Waybill:</strong> <span style="color:#00d2ff">${waybill}</span></p>
        </div>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <h3 style="color:#fff;margin-top:0">Items</h3>
          <table style="width:100%;font-size:13px">${itemRows}
            <tr style="border-top:1px solid #1e2530"><td style="padding:12px 0;font-weight:bold">Total (incl. VAT):</td><td style="text-align:right;color:#00d2ff;font-size:16px;font-weight:900">R ${data.totalAmountZAR.toLocaleString()}</td></tr>
          </table>
        </div>
      </div>`
  });
}

// ─── 2. Solar Quote Request ───────────────────────────────────────────────────

export async function sendSolarQuoteEmail(data: {
  quoteId?: string;
  fullName: string;
  email: string;
  phone: string;
  suburb?: string;
  province?: string;
  monthlyBillZAR?: number;
  recommendedInverterKw?: number;
  recommendedBatteryKwh?: number;
  recommendedSolarKwp?: number;
  installTarget?: string;
}) {
  const ref = data.quoteId || `KX-QT-${Math.floor(1000 + Math.random() * 9000)}`;

  return sendEmail({
    subject: `⚡ [Quote] ${data.fullName} — ${ref}`,
    replyTo: data.email,
    html: `
      <div style="font-family:Arial,sans-serif;background:#05070a;color:#fff;padding:30px;border-radius:12px">
        <h2 style="color:#00d2ff">⚡ New Solar Quote Request</h2>
        <p style="color:#94a3b8">Ref: <strong style="color:#fff">${ref}</strong></p>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Location:</strong> ${data.suburb || data.province || 'Gauteng'}</p>
          ${data.installTarget ? `<p><strong>Install Target:</strong> ${data.installTarget}</p>` : ''}
          ${data.monthlyBillZAR ? `<p><strong>Monthly Bill:</strong> R ${data.monthlyBillZAR.toLocaleString()}/mo</p>` : ''}
        </div>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <h3 style="color:#00d2ff;margin-top:0">Recommended Sizing</h3>
          <p><strong>Inverter:</strong> ${data.recommendedInverterKw || 8} kW</p>
          <p><strong>Battery:</strong> ${data.recommendedBatteryKwh || 10.24} kWh</p>
          <p><strong>Solar PV:</strong> ${data.recommendedSolarKwp || 5.5} kWp</p>
        </div>
      </div>`
  });
}

// ─── 3. Commercial Audit ──────────────────────────────────────────────────────

export async function sendCommercialAuditEmail(data: {
  referenceId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  locationCity: string;
  facilityType: string;
  monthlySpend: string;
  taxSection12b: boolean;
  peakDemand?: string;
  dieselSpend?: string;
}) {
  return sendEmail({
    subject: `🏢 [Commercial Audit] ${data.companyName} (${data.monthlySpend}) — ${data.referenceId}`,
    replyTo: data.email,
    html: `
      <div style="font-family:Arial,sans-serif;background:#05070a;color:#fff;padding:30px;border-radius:12px">
        <h2 style="color:#00d2ff">🏢 Commercial 50kW+ Audit</h2>
        <p style="color:#94a3b8">Ref: <strong style="color:#fff">${data.referenceId}</strong></p>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Contact:</strong> ${data.contactName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Location:</strong> ${data.locationCity}</p>
          <p><strong>Facility:</strong> ${data.facilityType}</p>
          <p><strong>Monthly Spend:</strong> ${data.monthlySpend}</p>
          ${data.peakDemand ? `<p><strong>Peak Demand:</strong> ${data.peakDemand}</p>` : ''}
          ${data.dieselSpend ? `<p><strong>Diesel:</strong> ${data.dieselSpend}</p>` : ''}
          <p><strong>Section 12B:</strong> ${data.taxSection12b ? 'Yes (125% Write-off)' : 'Standard'}</p>
        </div>
      </div>`
  });
}

// ─── 4. Contact Desk ──────────────────────────────────────────────────────────

export async function sendContactInquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    subject: `💬 [Contact] ${data.subject} — ${data.name}`,
    replyTo: data.email,
    html: `
      <div style="font-family:Arial,sans-serif;background:#05070a;color:#fff;padding:30px;border-radius:12px">
        <h2 style="color:#00d2ff">💬 Contact Inquiry</h2>
        <div style="background:#0d1117;border:1px solid #1e2530;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>From:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <hr style="border-color:#1e2530">
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p style="white-space:pre-line">${data.message}</p>
        </div>
      </div>`
  });
}
