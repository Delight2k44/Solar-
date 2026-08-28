/**
 * Data-driven formatters and utilities for Kinetix Energy Asset Portal
 */

export function formatCurrency(amount: number | null | undefined, currency: string = 'ZAR'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'R 0.00';
  }
  
  const formatted = amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${currency === 'ZAR' ? 'R' : currency} ${formatted}`;
}

export function formatDate(dateInput: string | number | null | undefined): string {
  if (!dateInput) return 'Date Pending';
  
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    
    return d.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateInput);
  }
}

export function formatDateTime(dateInput: string | number | null | undefined): string {
  if (!dateInput) return 'N/A';
  
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    
    return d.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(dateInput);
  }
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function calculateCountdown(targetTimestamp: number | string | null | undefined): CountdownResult {
  if (!targetTimestamp) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Delivery Expected' };
  }

  const target = typeof targetTimestamp === 'string' ? new Date(targetTimestamp).getTime() : targetTimestamp;
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Delivery Expected' };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = days > 0 
    ? `${days}d : ${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m`
    : `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;

  return { days, hours, minutes, seconds, isExpired: false, formatted };
}

export function formatPower(kw: number | null | undefined): string {
  if (kw === null || kw === undefined || isNaN(kw)) return '0.0 kW';
  return `${kw.toFixed(1)} kW`;
}

export function formatEnergy(kwh: number | null | undefined): string {
  if (kwh === null || kwh === undefined || isNaN(kwh)) return '0.0 kWh';
  return `${kwh.toFixed(2)} kWh`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return 'KX';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
