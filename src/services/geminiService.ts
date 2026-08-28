/// <reference types="vite/client" />
// Gemini AI Integration Service — Kinetix Energy Technologies
import { Product } from '../types';

const DEFAULT_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

export interface ChatMessageContext {
  role: 'user' | 'model';
  parts: { text: string }[];
}

function buildSystemPrompt(products: Product[]): string {
  const catalogSummary = products
    .slice(0, 12)
    .map(p => `\u2022 ${p.name} (${p.brand}) \u2014 R ${p.priceZAR.toLocaleString()} excl. VAT | SKU: ${p.sku}`)
    .join('\n');

  return `You are Kinetix, a friendly, professional Solar & Electrical Engineering AI assistant for Kinetix Energy Technologies (Pty) Ltd \u2014 South Africa's premier turnkey solar and backup power provider.

YOUR PERSONALITY:
- Warm, helpful, and conversational. You respond naturally to greetings like "hey", "hi", "hello", "what's up", "hows it" etc.
- When someone greets you, greet them back naturally, introduce yourself briefly, and ask how you can help.
- You speak in South African English \u2014 you can say "lekker", "howzit" etc. when appropriate.
- You are knowledgeable about solar, backup power, loadshedding, Eskom, and South African electrical standards.
- Keep responses concise (3-5 sentences max for simple questions). Use bullet points only when listing specs or steps.

CORE KNOWLEDGE:
- Country: South Africa (ZAR). Prices exclude 15% VAT.
- Standards: SANS 10142-1-2, municipal SSEG grid registration (City Power, Eskom, CoCT, eThekwini).
- Hardware: Deye & Sunsynk hybrid inverters, Freedom Won & Dyness LiFePO4 batteries, JA Solar Tier-1 mono panels.
- Commercial incentive: Section 12B SARS 125% accelerated tax depreciation for solar.
- Payments: Visa/Mastercard (3D Secure), Apple Pay, Payflex (Pay in 4 interest-free), Instant EFT (Capitec Pay, Ozow), 70/30 milestone deposit, 12-60 month solar asset finance.
- Average residential payback: 3.5 to 5.2 years at current Eskom tariff escalation.

LIVE PRODUCT CATALOG:
${catalogSummary}

GUIDELINES:
1. Always respond to greetings warmly \u2014 never ignore "hey", "hi", "howzit", or casual openers.
2. For sizing questions, calculate: if monthly bill is given, estimate kWh usage (South Africa avg: R2.50/kWh), then recommend inverter kW and battery kWh.
3. If user wants to buy, direct them to the cart or suggest adding to checkout.
4. Never be robotic. Sound like a knowledgeable friend who works in solar.
5. If you don't know something specific, say so honestly and offer to connect them with the team.`;
}

export async function askGeminiSolarAssistant(
  userQuery: string,
  history: { sender: 'bot' | 'user'; text: string }[],
  products: Product[],
  customKey?: string
): Promise<{ text: string; source: 'gemini' | 'fallback' }> {
  const apiKey = customKey || DEFAULT_API_KEY;
  const systemPrompt = buildSystemPrompt(products);

  if (apiKey && apiKey.length > 5) {
    try {
      const formattedContents = [
        {
          role: 'user',
          parts: [{ text: `[SYSTEM]\n${systemPrompt}\n\nAcknowledge you understand your role.` }]
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I'm Kinetix, your solar energy assistant. I'm ready to help with anything from sizing a system to compliance questions. Let's go! \u2600\ufe0f" }]
        },
        ...history.slice(-8).map((h: { sender: string; text: string }) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userQuery }]
        }
      ];

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 512,
            topP: 0.9
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return { text: text.trim(), source: 'gemini' };
        }
      } else {
        const errorData = await response.json().catch(() => null);
        console.warn('Gemini API error:', response.status, errorData?.error?.message);
      }
    } catch (err) {
      console.warn('Gemini API request failed, using local intelligence:', err);
    }
  }

  return { text: getSmartFallbackResponse(userQuery, products), source: 'fallback' };
}

function getSmartFallbackResponse(query: string, products: Product[]): string {
  const lower = query.toLowerCase().trim();

  // Greetings
  if (
    /^(hey|hi|hello|howzit|hows it|how's it|sup|what's up|whats up|yo|morning|afternoon|evening|good day|sawubona|dumela|hola|howdy|ola|hi there|heya|hiya|greetings|lekker day|lekker)[\s!?.]*$/.test(lower) ||
    (lower.length < 20 && (lower.includes('hey') || lower.includes('hi ') || lower.startsWith('hi') || lower.includes('hello') || lower.includes('howzit')))
  ) {
    const greetings = [
      "Howzit! \ud83d\udc4b I'm Kinetix, your solar energy assistant. Whether you need help sizing a system, checking compliance, or finding the right inverter \u2014 I'm here. What can I help you with today?",
      "Hey there! \u2600\ufe0f Welcome to Kinetix Energy. I can help with solar sizing, product recommendations, ZAR pricing, or our installation process. What's on your mind?",
      "Hi! Great to chat with you. I'm the Kinetix solar assistant \u2014 think of me as your solar engineer friend who's always on call. What do you need help with?",
      "Hello! \ud83c\udf1e I'm here to help you with solar. Whether it's loadshedding backup, going grid-tied, or just getting a quote \u2014 ask away!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // What / how can you help
  if (lower.includes('what can you do') || lower.includes('how can you help') || lower === 'help' || lower === '?' || lower.includes('what do you do')) {
    return `I can help you with:\n\n\u2022 **Solar system sizing** \u2014 tell me your monthly bill or appliances\n\u2022 **Product recommendations** \u2014 inverters, batteries, panels\n\u2022 **Pricing** \u2014 live ZAR prices from our catalog\n\u2022 **Compliance** \u2014 SANS 10142-1-2, CoC, SSEG registration\n\u2022 **Payments** \u2014 Visa, Apple Pay, Payflex, Instant EFT\n\u2022 **ROI & savings** \u2014 payback period calculations\n\nWhat would you like to start with?`;
  }

  // Who / what are you
  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('are you ai') || lower.includes('are you a bot') || lower.includes('are you human')) {
    return "I'm Kinetix \u2014 the AI solar assistant for Kinetix Energy Technologies. Powered by AI and trained on South African solar standards, products, and pricing. I can answer most questions instantly \u2014 but if you need a human engineer, just ask! \ud83d\ude0a";
  }

  // Pricing
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rand') || lower.includes('zar') || lower.includes('quote')) {
    const featured = products.slice(0, 3).map(p => `\u2022 ${p.name}: R ${p.priceZAR.toLocaleString()} excl. VAT`).join('\n');
    return `Quick price overview:\n\n${featured || '\u2022 Entry 5kW Hybrid + 5.12kWh Battery: ~R 78,500 excl. VAT\n\u2022 Executive 8kW Hybrid + 10.24kWh Battery: ~R 138,900 excl. VAT\n\u2022 Commercial 3-Phase (12kW+): Custom quote'}\n\nAll include certified installation with SANS 10142 CoC. Want a tailored quote for your property?`;
  }

  // Savings / ROI
  if (lower.includes('save') || lower.includes('savings') || lower.includes('payback') || lower.includes('roi') || lower.includes('return on investment')) {
    return "Most South African homes see a **3.5 to 5.2 year payback** at current Eskom tariff increases (12-18% per year). After that, it's essentially free energy \u2600\ufe0f. A typical 8kW system offsets 75-85% of your monthly bill. What's your current monthly electricity spend? I can give you a more accurate calculation.";
  }

  // Battery / loadshedding
  if (lower.includes('battery') || lower.includes('backup') || lower.includes('loadshedding') || lower.includes('load shedding') || lower.includes('eskom') || lower.includes('blackout') || lower.includes('outage')) {
    return "For loadshedding backup, we recommend LiFePO4 lithium batteries (Freedom Won or Dyness) \u2014 6,000+ cycles at 90% depth of discharge with 10-year warranties. A 5kWh battery typically covers 4-6 hours for lights, fridge, WiFi, and TV. How many hours of backup do you need, and what stage loadshedding are you on?";
  }

  // Inverter
  if (lower.includes('inverter') || lower.includes('deye') || lower.includes('sunsynk') || lower.includes('hybrid') || lower.includes('mppt')) {
    return "We install **Deye** and **Sunsynk** hybrid inverters. They feature:\n\u2022 <10ms UPS transfer switching (you won't notice loadshedding)\n\u2022 Dual MPPT solar trackers\n\u2022 WiFi monitoring on your smartphone\n\u2022 Full grid-tie and battery backup capability\n\nWhat size property \u2014 residential or commercial?";
  }

  // Compliance
  if (lower.includes('coc') || lower.includes('compliance') || lower.includes('sans') || lower.includes('certificate') || lower.includes('sseg') || lower.includes('municipality')) {
    return "Every Kinetix installation includes:\n\n1. **SANS 10142-1-2** Certificate of Compliance (CoC)\n2. **Registered Installation Electrician** (IE) sign-off\n3. **Municipal SSEG registration** (City Power, Eskom, CoCT, eThekwini)\n4. AC/DC surge protection and isolator compliance\n\nWe handle all the paperwork \u2014 you don't lift a finger. \ud83d\udccb";
  }

  // Payment
  if (lower.includes('pay') || lower.includes('payment') || lower.includes('finance') || lower.includes('eft') || lower.includes('payflex') || lower.includes('apple pay') || lower.includes('visa') || lower.includes('mastercard')) {
    return "We accept:\n\n\u2022 **Visa / Mastercard** \u2014 3D Secure online\n\u2022 **Apple Pay** \u2014 one-touch checkout\n\u2022 **Payflex** \u2014 pay in 4 interest-free installments\n\u2022 **Instant EFT** \u2014 Capitec Pay, Ozow\n\u2022 **70/30 Milestone** \u2014 70% upfront, 30% on CoC handover\n\u2022 **Solar Asset Finance** \u2014 12 to 60-month terms\n\nWant me to open the checkout?";
  }

  // Sizing
  if (lower.includes('size') || lower.includes('sizing') || lower.includes('which system') || lower.includes('recommend') || lower.includes('what do i need') || lower.includes('my bill') || lower.includes('kw') || lower.includes('kwh')) {
    return "To recommend the right system, I need a few details:\n\n1. **Monthly electricity bill** in Rands (or avg kWh usage)\n2. **Appliances** you want to keep running during outages (geyser? pool pump? aircon?)\n3. **Residential or commercial?**\n\nShare those and I'll size you a perfect system! \ud83d\udd0b\u2600\ufe0f";
  }

  // Installation
  if (lower.includes('install') || lower.includes('process') || lower.includes('how long') || lower.includes('timeline') || lower.includes('when')) {
    return "Our process:\n\n1. **Site assessment** \u2014 engineer visits your property (5-7 business days)\n2. **Custom design** \u2014 CAD layout and load analysis\n3. **Installation day** \u2014 typically 1-2 days for residential\n4. **CoC & SSEG** \u2014 we register with your municipality\n5. **Handover** \u2014 full system walkthrough and app training\n\nWant to book a site assessment?";
  }

  // Thank you / bye
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('bye') || lower.includes('goodbye') || lower.includes('cheers') || lower.includes('dankie')) {
    return "Pleasure! \ud83d\ude0a Feel free to come back anytime you have solar questions. Go well! \u2600\ufe0f";
  }

  // Default — conversational, not robotic
  return `Good question! To point you in the right direction, could you tell me:\n\n\u2022 Is this for your **home or business**?\n\u2022 Do you need **loadshedding backup** or a full solar setup?\n\u2022 What's your **monthly electricity bill** roughly?\n\nThat'll help me give you the most useful answer. \ud83c\udf1e`;
}
