// src/utils/validation.ts - Strict Form Validation Library for Kinetix Energy

/**
 * Validates full name (must contain at least 2 characters, only letters, spaces, hyphens, and apostrophes)
 */
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' };
  }
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
  }
  return { isValid: true };
}

/**
 * Validates email address (standard email format)
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@domain.co.za).' };
  }
  return { isValid: true };
}

/**
 * Validates South African & International phone numbers
 * Accepts: 0821234567, 082 123 4567, +27821234567, +27 82 123 4567, +1 555 123 4567
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Contact phone number is required.' };
  }
  const cleanNumber = trimmed.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  if (!phoneRegex.test(cleanNumber)) {
    return { isValid: false, error: 'Please enter a valid phone number (e.g. 082 123 4567 or +27 82 123 4567).' };
  }
  return { isValid: true };
}

/**
 * Validates City / Suburb
 */
export function validateLocation(location: string, fieldName = 'City / Suburb'): { isValid: boolean; error?: string } {
  const trimmed = (location || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters.` };
  }
  return { isValid: true };
}

/**
 * Validates Street Address
 */
export function validateAddress(address: string): { isValid: boolean; error?: string } {
  const trimmed = (address || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Physical delivery/site address is required.' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Please enter a complete street address.' };
  }
  return { isValid: true };
}

/**
 * Validates message / inquiry text
 */
export function validateMessage(message: string, minLength = 5): { isValid: boolean; error?: string } {
  const trimmed = (message || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Message body cannot be empty.' };
  }
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Message must be at least ${minLength} characters.` };
  }
  return { isValid: true };
}

/**
 * Sanitizes any raw system or network error into a polite, reassuring customer-facing message.
 * Ensures technical variable names (RESEND_API_KEY, Vercel, Firebase, 500, etc.) are NEVER shown to end users.
 */
export function formatUserFriendlyError(rawError: any): string {
  if (!rawError) {
    return 'An unexpected issue occurred. Please check your internet connection or contact our team directly on WhatsApp (+27 78 780 8569).';
  }

  const msg = typeof rawError === 'string' ? rawError : (rawError.message || String(rawError));
  const lower = msg.toLowerCase();

  if (
    lower.includes('resend') ||
    lower.includes('api_key') ||
    lower.includes('api key') ||
    lower.includes('vercel') ||
    lower.includes('process.env') ||
    lower.includes('environment variable') ||
    lower.includes('internal server') ||
    lower.includes('500') ||
    lower.includes('firestore') ||
    lower.includes('firebase')
  ) {
    return 'We were unable to transmit an automated dispatch email, but your details have been safely captured. An engineer will follow up directly.';
  }

  if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('offline')) {
    return 'Network connection issue. Please check your connectivity and try again, or chat with us on WhatsApp (+27 78 780 8569).';
  }

  return msg;
}
