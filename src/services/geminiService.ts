/// <reference types="vite/client" />
// Gemini AI Integration Service for Kinetix Solar Energy Platform
import { Product } from '../types';

const DEFAULT_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

export interface ChatMessageContext {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function askGeminiSolarAssistant(
  userQuery: string,
  history: { sender: 'bot' | 'user'; text: string }[],
  products: Product[],
  customKey?: string
): Promise<{ text: string; source: 'gemini' | 'fallback' }> {
  const apiKey = customKey || DEFAULT_API_KEY;

  const catalogSummary = products
    .slice(0, 10)
    .map(p => `- ${p.name} (${p.brand}): R ${p.priceZAR.toLocaleString()} (SKU: ${p.sku})`)
    .join('\n');

  const systemInstruction = `You are the lead Solar & Electrical Engineering AI Assistant for "Kinetix Energy Technologies (Pty) Ltd", South Africa's premier turnkey solar and backup power provider.

CONTEXT & STANDARDS:
- Location & Currency: South Africa (ZAR / R). Prices in catalog are Excl. VAT. 15% VAT applies.
- Electrical Standards: SANS 10142-1-2 supplementary electrical Certificate of Compliance (CoC), municipal SSEG grid registration (City of Cape Town, City Power, eThekwini, Eskom).
- Hardware Brands: Deye & Sunsynk hybrid inverters, Freedom Won & Dyness LiFePO4 batteries, JA Solar Tier-1 mono panels.
- Commercial: Section 12B SARS accelerated 125% tax depreciation incentive for commercial & 3-phase solar.
- Payment Options: Capitec Pay / Ozow Instant EFT, Visa/Mastercard 3D Secure, 70/30 contractor milestone deposit, 12-60 month solar asset finance.

PRODUCT CATALOG EXCERPT:
${catalogSummary}

INSTRUCTIONS:
1. Provide accurate, professional, and friendly advice tailored to South African loadshedding, Eskom tariff increases, and solar sizing.
2. If the user asks for recommendations, calculate appropriate inverter (kW) and battery (kWh) sizing based on their monthly bill or appliances.
3. If they ask about buying or checkout, mention they can add items directly to their cart or pay instantly.
4. Keep answers concise, clear, and formatted nicely with bullet points where appropriate.`;

  if (!apiKey || apiKey.length < 5) {
    return { text: getSmartFallbackResponse(userQuery, products), source: 'fallback' };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemInstruction}` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am Kinetix Energy Technologies\' AI Solar Engineer ready to assist with sizing, products, SANS 10142 compliance, and checkout in South Africa.' }]
      },
      ...history.slice(-6).map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userQuery }]
      }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText && candidateText.trim().length > 0) {
        return { text: candidateText.trim(), source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn('Gemini API request failed, engaging local solar intelligence engine:', err);
  }

  return { text: getSmartFallbackResponse(userQuery, products), source: 'fallback' };
}

function getSmartFallbackResponse(query: string, products: Product[]): string {
  const lower = query.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('quote')) {
    return `For South African residential homes, our turnkey systems start from:
• **Entry 5kW Hybrid + 5.12kWh LiFePO4**: ~R 78,500 (Excl. VAT)
• **Executive 8kW Hybrid + 10.24kWh LiFePO4**: ~R 138,900 (Excl. VAT)
• **Commercial 3-Phase (12kW - 50kW)**: Tailored with Section 12B 125% tax write-offs.

All packages include Department of Labour certified electrician installation, SANS 10142-1-2 CoC, and municipal SSEG registration.`;
  }

  if (lower.includes('battery') || lower.includes('storage') || lower.includes('lithium') || lower.includes('loadshedding')) {
    return `We install Tier-1 LiFePO4 battery storage systems (Freedom Won, Dyness, Pylontech) rated for 6,000+ cycles at 90% Depth of Discharge with 10-year manufacturer warranties. 

A standard home uses 5kWh to 10kWh to maintain seamless power for refrigerators, lighting, WiFi, and entertainment during Eskom outages.`;
  }

  if (lower.includes('inverter') || lower.includes('deye') || lower.includes('sunsynk')) {
    return `Kinetix Energy is an accredited installer of **Deye** and **Sunsynk** intelligent hybrid inverters. They feature ultra-fast <10ms UPS transfer switching, dual MPPT solar trackers, and cloud WiFi telemetry monitoring on your smartphone.`;
  }

  if (lower.includes('sans') || lower.includes('coc') || lower.includes('legal') || lower.includes('compliance')) {
    return `Every Kinetix installation complies with **SANS 10142-1-2** regulations and includes:
1. Registered Installation Electrician (IE) sign-off
2. Municipal SSEG Grid-Tie application & approval
3. AC/DC surge protection and isolator compliance
4. Official Test Report & Supplementary Certificate of Compliance (CoC).`;
  }

  if (lower.includes('pay') || lower.includes('finance') || lower.includes('eft') || lower.includes('card')) {
    return `You can checkout securely online using:
• **Instant EFT**: Capitec Pay, Ozow, SiD (Instant clearing)
• **Credit/Debit Card**: 3D Secure 2.0 (Visa / Mastercard)
• **70/30 Milestone Terms**: 70% deposit on order, 30% on CoC handover
• **Solar Asset Financing**: 12 to 60-month terms offset by electricity savings.`;
  }

  return `Thank you for consulting Kinetix Energy! As your AI Solar Engineer, I can help you with:
• **Solar Sizing**: Recommend inverter kW & battery kWh for your property.
• **Equipment Specifications**: Details on Deye, Sunsynk & Freedom Won hardware.
• **Compliance & CoC**: SANS 10142-1-2 and SSEG municipal registration.
• **Instant Checkout**: Add hardware to cart with certified installation.

What specific appliances or monthly electricity bill are you looking to power?`;
}
