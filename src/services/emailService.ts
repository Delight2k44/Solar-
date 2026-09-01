/**
 * Kinetix Energy — Email Notification Service
 * Sends automated email notifications to BOTH Admin (delightchetter@gmail.com) and the Customer.
 * Logs all notifications to Firebase Firestore for permanent tracking.
 */
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ADMIN_EMAIL = 'delightchetter@gmail.com';

// Resolved server-side by the mail proxy; kept here only for the Firestore audit log.
const FROM_EMAIL = 'Kinetix Energy <noreply@kinetixes.com>';
const EMAIL_ENDPOINT = '/api/send-email.php';

/** Escapes user supplied values before they are interpolated into email HTML. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface SendEmailParams {
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  metadata?: Record<string, any>;
}

export interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

async function logToFirestore(recipients: string[], subject: string, replyTo: string | undefined, metadata: Record<string, any>, status: string, error?: string) {
  try {
    await addDoc(collection(db, 'email_notifications'), {
      to: recipients,
      from: FROM_EMAIL,
      replyTo: replyTo || null,
      subject,
      metadata,
      createdAt: new Date().toISOString(),
      status,
      error: error || null
    });
  } catch (e) {
    console.error('Failed to log email notification in Firestore:', e);
  }
}

async function dispatch(recipients: string[], subject: string, html: string, replyTo?: string): Promise<SendEmailResult> {
  let response: Response;
  try {
    response = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: recipients, reply_to: replyTo || undefined, subject, html })
    });
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    // The SPA fallback serves index.html when the endpoint is missing; treating that
    // as anything other than a failure is what previously hid broken deployments.
    return { success: false, error: `Email endpoint ${EMAIL_ENDPOINT} did not return JSON (HTTP ${response.status}) — is it deployed?` };
  }

  const result = await response.json();
  if (response.ok && result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error || `HTTP ${response.status}` };
}

/**
 * Sends to each recipient in a separate request so one rejected address
 * (unverified domain, typo) cannot suppress the whole notification.
 * Resolves successfully only if at least one message was accepted.
 */
export async function sendEmail({
  to = ADMIN_EMAIL,
  subject,
  html,
  replyTo,
  metadata = {}
}: SendEmailParams): Promise<SendEmailResult> {
  const rawList = Array.isArray(to) ? to : [to];
  const recipients = Array.from(new Set(rawList.map(e => (e || '').trim()).filter(Boolean)));

  if (recipients.length === 0) {
    return { success: false, error: 'No recipient' };
  }

  const results = await Promise.all(recipients.map(recipient => dispatch([recipient], subject, html, replyTo)));
  const delivered = recipients.filter((_, index) => results[index].success);
  const errors = results.filter(r => !r.success).map(r => r.error).filter(Boolean);

  await logToFirestore(
    recipients,
    subject,
    replyTo,
    metadata,
    delivered.length === recipients.length ? 'delivered' : delivered.length > 0 ? 'partial' : 'failed',
    errors.join('; ')
  );

  if (delivered.length === 0) {
    return { success: false, error: errors.join('; ') || 'Email dispatch failed' };
  }
  return { success: true, data: { delivered, errors } };
}

// ─── 1. Order Confirmation (Sent to Admin + Customer) ─────────────────────────

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
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #1E2530;color:#F1F5F9;">
        <strong>${esc(i.quantity)}x</strong> ${esc(i.productName)}
        ${i.includeInstallation ? '<br><span style="color:#00D2FF;font-size:11px;font-family:monospace;">+ SANS 10142 Certified Installation</span>' : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1E2530;text-align:right;color:#00D2FF;font-weight:bold;font-family:monospace;">
        R ${((i.unitPriceZAR * i.quantity) + (i.includeInstallation ? (i.installationPriceZAR || 0) : 0)).toLocaleString()}
      </td>
    </tr>`
  ).join('');

  // Recipients: Admin + Customer
  const recipients = [ADMIN_EMAIL];
  if (data.customerEmail && data.customerEmail.includes('@')) {
    recipients.push(data.customerEmail);
  }

  return sendEmail({
    to: recipients,
    subject: `⚡ [Order Confirmed] #${data.orderId} — R ${data.totalAmountZAR.toLocaleString()} | Kinetix Energy`,
    replyTo: data.customerEmail,
    metadata: {
      type: 'order_confirmation',
      orderId: data.orderId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      totalAmountZAR: data.totalAmountZAR,
      paymentMethod: data.paymentMethod,
      waybillNumber: waybill
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Order Confirmation & Hardware Staging</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Thank You, ${esc(data.customerName)}!</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            Your order <strong style="color:#00D2FF;">#${esc(data.orderId)}</strong> has been received and allocated at our Sandton logistics hub.
          </p>
        </div>

        <!-- Order Summary Card -->
        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Delivery & Logistics Details</h3>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Recipient:</strong> <span style="color:#FFF;">${esc(data.customerName)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Contact Phone:</strong> <span style="color:#FFF;">${esc(data.customerPhone)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Delivery Address:</strong> <span style="color:#FFF;">${esc(data.shippingAddress)}, ${esc(data.city)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Payment Method:</strong> <span style="color:#00D2FF;text-transform:uppercase;">${esc(data.paymentMethod)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>The Courier Guy (TCG) Tracking:</strong> <span style="color:#10B981;font-family:monospace;font-weight:bold;">${waybill}</span></p>
        </div>

        <!-- Items Table -->
        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:24px;">
          <h3 style="color:#FFFFFF;font-size:14px;margin-top:0;margin-bottom:12px;">Order Summary</h3>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            ${itemRows}
            <tr>
              <td style="padding:14px 0 0;font-size:15px;font-weight:bold;color:#FFFFFF;">Total Amount (incl. VAT):</td>
              <td style="padding:14px 0 0;text-align:right;color:#00D2FF;font-size:18px;font-weight:900;font-family:monospace;">
                R ${data.totalAmountZAR.toLocaleString()}
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer / Support Info -->
        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Need immediate assistance or have installation questions?</p>
          <p style="margin:4px 0;color:#94A3B8;">WhatsApp Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Email: <strong style="color:#00D2FF;">delightchetter@gmail.com</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd. SANS 10142 Certified Engineering.</p>
        </div>
      </div>`
  });
}

// ─── 2. Solar Quote Request (Sent to Admin + Customer) ─────────────────────────

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

  // Recipients: Admin + Customer
  const recipients = [ADMIN_EMAIL];
  if (data.email && data.email.includes('@')) {
    recipients.push(data.email);
  }

  return sendEmail({
    to: recipients,
    subject: `⚡ [System Proposal] Solar Quote ${ref} — ${data.fullName} | Kinetix Energy`,
    replyTo: data.email,
    metadata: {
      type: 'solar_quote',
      quoteId: ref,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      monthlyBillZAR: data.monthlyBillZAR,
      recommendedInverterKw: data.recommendedInverterKw,
      recommendedBatteryKwh: data.recommendedBatteryKwh,
      recommendedSolarKwp: data.recommendedSolarKwp
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Engineering Proposal & Sizing Assessment</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Hello ${esc(data.fullName)},</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            Thank you for requesting an engineering solar proposal. Reference: <strong style="color:#00D2FF;">${ref}</strong>.
            Our technical team is reviewing your load profile and preparing your CAD single-line schematic.
          </p>
        </div>

        <!-- Contact & Location Box -->
        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Contact & Property Profile</h3>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Name:</strong> <span style="color:#FFF;">${esc(data.fullName)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${esc(data.email)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${esc(data.phone)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Location:</strong> <span style="color:#FFF;">${esc(data.suburb || data.province || 'Gauteng, South Africa')}</span></p>
          ${data.installTarget ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Target Installation:</strong> <span style="color:#10B981;">${esc(data.installTarget)}</span></p>` : ''}
          ${data.monthlyBillZAR ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Monthly Electricity Spend:</strong> <span style="color:#FFF;font-family:monospace;">R ${data.monthlyBillZAR.toLocaleString()} / month</span></p>` : ''}
        </div>

        <!-- Recommended Sizing Box -->
        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:24px;">
          <h3 style="color:#10B981;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Calculated Recommended System</h3>
          <div style="display:grid;gap:8px;">
            <p style="margin:4px 0;font-size:14px;color:#94A3B8;"><strong>Hybrid Inverter:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${esc(data.recommendedInverterKw || 8)} kW Pure Sine Wave</span></p>
            <p style="margin:4px 0;font-size:14px;color:#94A3B8;"><strong>LiFePO4 Energy Storage:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${esc(data.recommendedBatteryKwh || 10.24)} kWh Tier-1 Lithium</span></p>
            <p style="margin:4px 0;font-size:14px;color:#94A3B8;"><strong>Tier-1 Solar PV Array:</strong> <span style="color:#00D2FF;font-weight:bold;font-family:monospace;">${esc(data.recommendedSolarKwp || 5.5)} kWp Monocrystalline</span></p>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="background:rgba(0,210,255,0.05);border:1px solid rgba(0,210,255,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#00D2FF;font-weight:bold;">Next Steps:</p>
          <p style="margin:4px 0 0;font-size:12px;color:#94A3B8;line-height:1.5;">
            Our certified engineering desk will verify your local grid connection requirements and reach out via WhatsApp/Phone to confirm site assessment availability.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Questions? Reach our Sandton Engineering Desk directly:</p>
          <p style="margin:4px 0;color:#94A3B8;">WhatsApp: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | Email: <strong style="color:#00D2FF;">delightchetter@gmail.com</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
        </div>
      </div>`
  });
}

// ─── 3. Commercial Audit (Sent to Admin + Customer) ────────────────────────────

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
  // Recipients: Admin + Customer
  const recipients = [ADMIN_EMAIL];
  if (data.email && data.email.includes('@')) {
    recipients.push(data.email);
  }

  return sendEmail({
    to: recipients,
    subject: `🏢 [Commercial Audit Confirmation] ${data.companyName} (${data.monthlySpend}) — Ref #${data.referenceId} | Kinetix Energy`,
    replyTo: data.email,
    metadata: {
      type: 'commercial_audit',
      referenceId: data.referenceId,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      monthlySpend: data.monthlySpend,
      taxSection12b: data.taxSection12b
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Commercial & Industrial 50kW+ Solar Audit</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Commercial Audit Staged: ${esc(data.companyName)}</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            Thank you ${esc(data.contactName)}. Your commercial load audit reference is <strong style="color:#00D2FF;">#${esc(data.referenceId)}</strong>.
          </p>
        </div>

        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Enterprise Audit Parameters</h3>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Enterprise Name:</strong> <span style="color:#FFF;">${esc(data.companyName)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Lead Contact:</strong> <span style="color:#FFF;">${esc(data.contactName)} (${esc(data.phone)})</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${esc(data.email)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Facility Classification:</strong> <span style="color:#FFF;">${esc(data.facilityType)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Location:</strong> <span style="color:#FFF;">${esc(data.locationCity)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Monthly Electricity Spend:</strong> <span style="color:#00D2FF;font-family:monospace;font-weight:bold;">${esc(data.monthlySpend)}</span></p>
          ${data.peakDemand ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Peak Demand:</strong> <span style="color:#FFF;">${esc(data.peakDemand)}</span></p>` : ''}
          ${data.dieselSpend ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Diesel Generator Spend:</strong> <span style="color:#FFF;">${esc(data.dieselSpend)}</span></p>` : ''}
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>SARS Section 12B Modeling:</strong> <span style="color:#10B981;font-weight:bold;">${data.taxSection12b ? 'Enabled (125% Year 1 Write-Off)' : 'Standard'}</span></p>
        </div>

        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Commercial Projects Desk: <strong style="color:#00D2FF;">+27 78 780 8569</strong> | <strong style="color:#00D2FF;">delightchetter@gmail.com</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
        </div>
      </div>`
  });
}

// ─── 4. Contact Desk (Sent to Admin + Customer) ────────────────────────────────

export async function sendContactInquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  // Recipients: Admin + Customer
  const recipients = [ADMIN_EMAIL];
  if (data.email && data.email.includes('@')) {
    recipients.push(data.email);
  }

  return sendEmail({
    to: recipients,
    subject: `💬 [Inquiry Received] ${data.subject} — ${data.name} | Kinetix Energy`,
    replyTo: data.email,
    metadata: {
      type: 'contact_inquiry',
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Engineering Support Desk</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Thank You, ${esc(data.name)},</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            We have received your technical inquiry. Our certified engineering desk will review your request and get back to you within 24 hours.
          </p>
        </div>

        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;">Inquiry Details</h3>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>From:</strong> <span style="color:#FFF;">${esc(data.name)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Email:</strong> <span style="color:#FFF;">${esc(data.email)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${esc(data.phone || 'N/A')}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Subject:</strong> <span style="color:#00D2FF;">${esc(data.subject)}</span></p>
          <hr style="border:0;border-top:1px solid #1E2530;margin:12px 0;">
          <p style="margin:0;font-size:13px;color:#E2E8F0;white-space:pre-line;line-height:1.6;">${esc(data.message)}</p>
        </div>

        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Direct WhatsApp Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
        </div>
      </div>`
  });
}

// ─── 5. Installation Booking (Sent to Admin + Customer) ───────────────────────

export async function sendInstallationBookingEmail(data: {
  bookingId: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  targetDate: string;
  roofType?: string;
  phaseConnection?: string;
  dbLocation?: string;
}) {
  const recipients = [ADMIN_EMAIL];
  if (data.email && data.email.includes('@')) {
    recipients.push(data.email);
  }

  return sendEmail({
    to: recipients,
    subject: `📅 [Site Assessment Booked] Ref #${data.bookingId} — ${data.clientName} | Kinetix Energy`,
    replyTo: data.email,
    metadata: {
      type: 'installation_booking',
      bookingId: data.bookingId,
      clientName: data.clientName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      targetDate: data.targetDate
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Installation Site Assessment Booking</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Booking Staged: #${esc(data.bookingId)}</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            Hello ${esc(data.clientName)}, your DoL certified site assessment request has been recorded.
          </p>
        </div>

        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Client:</strong> <span style="color:#FFF;">${esc(data.clientName)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Phone:</strong> <span style="color:#FFF;">${esc(data.phone)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Site Address:</strong> <span style="color:#FFF;">${esc(data.address)}, ${esc(data.city)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Target Assessment Date:</strong> <span style="color:#10B981;font-weight:bold;">${esc(data.targetDate)}</span></p>
          ${data.roofType ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Roof Type:</strong> <span style="color:#FFF;">${esc(data.roofType)}</span></p>` : ''}
          ${data.phaseConnection ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Electrical Connection:</strong> <span style="color:#FFF;">${esc(data.phaseConnection)}</span></p>` : ''}
          ${data.dbLocation ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>DB Board Location:</strong> <span style="color:#FFF;">${esc(data.dbLocation)}</span></p>` : ''}
        </div>

        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Installation Operations Hotline: <strong style="color:#00D2FF;">+27 78 780 8569</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
        </div>
      </div>`
  });
}

// ─── 6. Maintenance Ticket (Sent to Admin + Customer) ──────────────────────────

export async function sendMaintenanceTicketEmail(data: {
  ticketId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  siteAddress: string;
  city: string;
  tier: string;
  inverterBrand: string;
  primaryReason: string;
  issueDetails?: string;
}) {
  const recipients = [ADMIN_EMAIL];
  if (data.clientEmail && data.clientEmail.includes('@')) {
    recipients.push(data.clientEmail);
  }

  return sendEmail({
    to: recipients,
    subject: `🛠️ [Maintenance Ticket Logged] Ref #${data.ticketId} — ${data.clientName} | Kinetix Energy`,
    replyTo: data.clientEmail,
    metadata: {
      type: 'maintenance_ticket',
      ticketId: data.ticketId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      tier: data.tier,
      inverterBrand: data.inverterBrand,
      primaryReason: data.primaryReason
    },
    html: `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;">
        <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;">
          <h1 style="color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;">⚡ KINETIX ENERGY</h1>
          <p style="color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Technical Maintenance & Service Ticket</p>
        </div>

        <div style="margin:24px 0;">
          <h2 style="color:#FFFFFF;font-size:18px;margin-bottom:8px;">Service Ticket Logged: #${esc(data.ticketId)}</h2>
          <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0;">
            Hello ${esc(data.clientName)}, your service request has been logged with our certified technician queue.
          </p>
        </div>

        <div style="background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;">
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Service Tier:</strong> <span style="color:#00D2FF;">${esc(data.tier)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Client:</strong> <span style="color:#FFF;">${esc(data.clientName)} (${esc(data.clientPhone)})</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Site Location:</strong> <span style="color:#FFF;">${esc(data.siteAddress)}, ${esc(data.city)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Hardware:</strong> <span style="color:#FFF;">${esc(data.inverterBrand)}</span></p>
          <p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Primary Objective:</strong> <span style="color:#10B981;">${esc(data.primaryReason)}</span></p>
          ${data.issueDetails ? `<p style="margin:4px 0;font-size:13px;color:#94A3B8;"><strong>Details:</strong> <span style="color:#E2E8F0;">${esc(data.issueDetails)}</span></p>` : ''}
        </div>

        <div style="text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;">
          <p style="margin:4px 0;">Technical Service Desk: <strong style="color:#00D2FF;">+27 78 780 8569</strong></p>
          <p style="margin-top:12px;font-size:11px;">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
        </div>
      </div>`
  });
}
