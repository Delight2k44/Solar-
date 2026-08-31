/**
 * PayFast South African Payment Gateway Service
 * Supports Visa, Mastercard, Instant EFT (All SA Banks), Mobicred, Masterpass, and Zapper.
 */

export interface PayFastOrderData {
  orderId: string;
  amountZAR: number;
  itemName: string;
  itemDescription?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
  isSandbox?: boolean;
}

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passPhrase?: string;
  isSandbox: boolean;
}

// Default to official PayFast Sandbox credentials for testing, or live credentials when provided
export const PAYFAST_CONFIG: PayFastConfig = {
  merchantId: '10000100', // PayFast default sandbox merchant ID
  merchantKey: '46f0cd694581a', // PayFast default sandbox merchant key
  isSandbox: true
};

/**
 * Generates the PayFast redirect form and submits to the secure PayFast engine
 */
export function initiatePayFastRedirect(data: PayFastOrderData, customConfig?: Partial<PayFastConfig>): void {
  const config = { ...PAYFAST_CONFIG, ...customConfig };
  const processUrl = config.isSandbox 
    ? 'https://sandbox.payfast.co.za/eng/process' 
    : 'https://www.payfast.co.za/eng/process';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kinetixes.com';
  const returnUrl = data.returnUrl || `${baseUrl}?payment=payfast_success&orderId=${encodeURIComponent(data.orderId)}`;
  const cancelUrl = data.cancelUrl || `${baseUrl}?payment=payfast_cancelled&orderId=${encodeURIComponent(data.orderId)}`;

  // Create invisible form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = processUrl;
  form.style.display = 'none';

  const fields: Record<string, string> = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: data.notifyUrl || `${baseUrl}/api/payfast-webhook`,
    name_first: data.customerName.split(' ')[0] || 'Client',
    name_last: data.customerName.split(' ').slice(1).join(' ') || 'Customer',
    email_address: data.customerEmail,
    cell_number: data.customerPhone || '0787808569',
    m_payment_id: data.orderId,
    amount: data.amountZAR.toFixed(2),
    item_name: data.itemName.substring(0, 100),
    item_description: data.itemDescription?.substring(0, 255) || 'Kinetix Energy Solar & Storage System',
    email_confirmation: '1',
    confirmation_address: data.customerEmail
  };

  // Append fields to form
  Object.entries(fields).forEach(([key, value]) => {
    if (value) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
}
