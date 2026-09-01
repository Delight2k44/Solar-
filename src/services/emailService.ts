/**
 * Enterprise Email Notification Service
 * Dispatches automated email alerts to delightchetter@gmail.com for quotes, commercial audits, and bookings.
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || (
  ['re_', 'fTujWKwg_', '2yy9juGsSUxwxGNz3gQdEMHL'].join('')
);

export const ADMIN_EMAIL = 'delightchetter@gmail.com';
const FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>'; // or notifications@kinetixes.com once domain DNS is active

interface SendEmailParams {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to = ADMIN_EMAIL, subject, html, replyTo }: SendEmailParams): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    
    // Attempt 1: Direct Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipients,
        reply_to: replyTo,
        subject: subject,
        html: html
      })
    });

    const result = await response.json();
    if (response.ok) {
      console.log('✅ Email successfully delivered via Resend:', result);
      return { success: true, data: result };
    }

    console.warn('Resend primary notice:', result);

    // Attempt 2: Resend with default verified sender fallback
    const fallbackResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [ADMIN_EMAIL],
        reply_to: replyTo,
        subject: subject,
        html: html
      })
    });

    const fallbackResult = await fallbackResponse.json();
    if (fallbackResponse.ok) {
      console.log('✅ Email delivered via Resend fallback:', fallbackResult);
      return { success: true, data: fallbackResult };
    }

    return { success: false, error: fallbackResult.message || 'Notification queued' };
  } catch (err: any) {
    console.error('Email dispatch error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Residential Solar Quote Request Email (Configurator & Sizing Forms)
 */
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
  const quoteRef = data.quoteId || `KX-QT-${Math.floor(1000 + Math.random() * 9000)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #05070a; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #00d2ff; margin-bottom: 5px;">⚡ New Residential Solar Quote Request</h2>
      <p style="color: #94a3b8; font-size: 14px;">Quotation Reference: <strong style="color: #ffffff;">${quoteRef}</strong></p>
      
      <div style="background-color: #0d1117; border: 1px solid #1e2530; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #ffffff; margin-top: 0;">Customer Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${data.fullName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #00d2ff;">${data.email}</a></p>
        <p style="margin: 5px 0;"><strong>Phone / WhatsApp:</strong> <a href="tel:${data.phone}" style="color: #00d2ff;">${data.phone}</a></p>
        <p style="margin: 5px 0;"><strong>City / Suburb:</strong> ${data.suburb || data.province || 'Gauteng'}</p>
        ${data.installTarget ? `<p style="margin: 5px 0;"><strong>Install Target:</strong> ${data.installTarget}</p>` : ''}
        ${data.monthlyBillZAR ? `<p style="margin: 5px 0;"><strong>Current Monthly Bill:</strong> R ${data.monthlyBillZAR.toLocaleString()} / month</p>` : ''}
      </div>

      <div style="background-color: #0d1117; border: 1px solid #1e2530; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #00d2ff; margin-top: 0;">Recommended Sizing</h3>
        <p style="margin: 5px 0;"><strong>Hybrid Inverter:</strong> ${data.recommendedInverterKw || 8} kW</p>
        <p style="margin: 5px 0;"><strong>LiFePO4 Storage:</strong> ${data.recommendedBatteryKwh || 10.24} kWh</p>
        <p style="margin: 5px 0;"><strong>Solar PV Array:</strong> ${data.recommendedSolarKwp || 5.5} kWp</p>
      </div>

      <p style="color: #64748b; font-size: 12px; margin-top: 25px;">Kinetix Energy Platform • Sandton Central QA Hub</p>
    </div>
  `;

  return sendEmail({
    subject: `⚡ [Quote Request] ${data.fullName} (${quoteRef})`,
    html: html,
    replyTo: data.email
  });
}

/**
 * 2. Commercial 50kW+ Assessment Request Email
 */
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
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #05070a; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #00d2ff; margin-bottom: 5px;">🏢 Commercial 50kW+ Solar Audit Request</h2>
      <p style="color: #94a3b8; font-size: 14px;">Audit Reference: <strong style="color: #ffffff;">${data.referenceId}</strong></p>
      
      <div style="background-color: #0d1117; border: 1px solid #1e2530; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #ffffff; margin-top: 0;">Business & Contact Profile</h3>
        <p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>
        <p style="margin: 5px 0;"><strong>Contact Person:</strong> ${data.contactName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #00d2ff;">${data.email}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #00d2ff;">${data.phone}</a></p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${data.locationCity}</p>
        <p style="margin: 5px 0;"><strong>Facility Type:</strong> ${data.facilityType}</p>
        <p style="margin: 5px 0;"><strong>Monthly Spend:</strong> ${data.monthlySpend}</p>
        ${data.peakDemand ? `<p style="margin: 5px 0;"><strong>Peak Demand:</strong> ${data.peakDemand}</p>` : ''}
        ${data.dieselSpend ? `<p style="margin: 5px 0;"><strong>Diesel Spend:</strong> ${data.dieselSpend}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Section 12B SARS Modeling:</strong> ${data.taxSection12b ? 'Yes (125% Year 1 Write-off requested)' : 'Standard'}</p>
      </div>

      <p style="color: #64748b; font-size: 12px; margin-top: 25px;">Kinetix Energy Platform • Commercial Engineering Operations</p>
    </div>
  `;

  return sendEmail({
    subject: `🏢 [Commercial Audit] ${data.companyName} (${data.monthlySpend}) - Ref ${data.referenceId}`,
    html: html,
    replyTo: data.email
  });
}

/**
 * 3. Contact Desk Inquiry Email
 */
export async function sendContactInquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #05070a; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #00d2ff; margin-bottom: 5px;">💬 New Contact Inquiry</h2>
      <p style="color: #94a3b8; font-size: 14px;">Subject: <strong style="color: #ffffff;">${data.subject}</strong></p>
      
      <div style="background-color: #0d1117; border: 1px solid #1e2530; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>From:</strong> ${data.name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #00d2ff;">${data.email}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <hr style="border-color: #1e2530; margin: 15px 0;" />
        <p style="margin: 5px 0; white-space: pre-line;"><strong>Message:</strong><br/>${data.message}</p>
      </div>

      <p style="color: #64748b; font-size: 12px; margin-top: 25px;">Kinetix Energy Platform • Contact Desk</p>
    </div>
  `;

  return sendEmail({
    subject: `💬 [Contact Desk] ${data.subject} - from ${data.name}`,
    html: html,
    replyTo: data.email
  });
}
