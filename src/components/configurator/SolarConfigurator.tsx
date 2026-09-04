import { validateFullName, validateEmail, validatePhone, validateLocation } from '../../utils/validation';
import { useData } from '../../context/DataContext';
import { sendSolarQuoteEmail } from '../../services/emailService';
import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  Tractor, 
  Factory, 
  Zap, 
  BatteryCharging, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { EstimateDisclaimer } from '../common/EstimateDisclaimer';
import { PropertyType, SolarPriority, BackupDuration, ConfiguratorResult } from '../../types';

interface SolarConfiguratorProps {
  onQuoteRequested?: (data: any) => void;
  isStandalone?: boolean;
}

export const SolarConfigurator: React.FC<SolarConfiguratorProps> = ({ 
  onQuoteRequested, 
  isStandalone = true 
}) => {
  const { addLeadQuote } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [monthlyBillZAR, setMonthlyBillZAR] = useState(3800);
  const [occupants, setOccupants] = useState(4);
  const [appliances, setAppliances] = useState<string[]>(['geyser', 'pool_pump']);
  const [priority, setPriority] = useState<SolarPriority>('balanced');
  const [backupDuration, setBackupDuration] = useState<BackupDuration>('several-hours');
  
  // Submission details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [quoteRefId, setQuoteRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamic Calculation Engine
  const calculateResult = (): ConfiguratorResult => {
    // Average tariff in SA approx R3.40 / kWh
    const estimatedMonthlyKwh = Math.round(monthlyBillZAR / 3.40);
    const dailyKwh = estimatedMonthlyKwh / 30;

    let inverterKva = 5.0;
    let solarKwp = 3.3;
    let batteryKwh = 5.12;
    let priceMin = 85000;
    let priceMax = 110000;

    if (propertyType === 'commercial' || propertyType === 'industrial') {
      if (monthlyBillZAR > 15000) {
        inverterKva = 25.0;
        solarKwp = 22.0;
        batteryKwh = 30.0;
        priceMin = 320000;
        priceMax = 440000;
      } else {
        inverterKva = 12.0;
        solarKwp = 11.0;
        batteryKwh = 15.0;
        priceMin = 180000;
        priceMax = 245000;
      }
    } else {
      // Residential
      if (monthlyBillZAR < 2500) {
        inverterKva = 5.0;
        solarKwp = 2.75;
        batteryKwh = 5.12;
        priceMin = 75000;
        priceMax = 95000;
      } else if (monthlyBillZAR <= 5000) {
        inverterKva = 5.0;
        solarKwp = 4.4;
        batteryKwh = 5.12;
        priceMin = 89000;
        priceMax = 115000;
      } else if (monthlyBillZAR <= 9000) {
        inverterKva = 8.0;
        solarKwp = 6.6;
        batteryKwh = 10.24;
        priceMin = 135000;
        priceMax = 175000;
      } else {
        inverterKva = 12.0;
        solarKwp = 9.9;
        batteryKwh = 15.36;
        priceMin = 195000;
        priceMax = 255000;
      }
    }

    // Heavy appliance modifiers
    if (appliances.includes('geyser') && appliances.includes('pool_pump') && solarKwp < 5.5) {
      solarKwp = Math.min(solarKwp + 1.1, 9.9);
    }

    // Backup duration modifier
    if (backupDuration === 'overnight' && batteryKwh < 10) {
      batteryKwh = 10.24;
      priceMin += 22000;
      priceMax += 28000;
    } else if (backupDuration === 'full-24h') {
      batteryKwh = Math.max(batteryKwh * 1.5, 15.36);
      priceMin += 45000;
      priceMax += 60000;
    }

    const estimatedMonthlySavings = Math.round(monthlyBillZAR * 0.78);
    const estimatedPaybackYears = Number((priceMin / (estimatedMonthlySavings * 12)).toFixed(1));
    const co2SavedTonnes = Number(((solarKwp * 5.2 * 365 * 0.95) / 1000).toFixed(1));

    return {
      propertyType,
      monthlyBillZAR,
      monthlyKwh: estimatedMonthlyKwh,
      priority,
      backupDuration,
      recommendedInverterKva: inverterKva,
      recommendedSolarKwp: Number(solarKwp.toFixed(2)),
      recommendedBatteryKwh: Number(batteryKwh.toFixed(1)),
      estimatedPriceMinZAR: priceMin,
      estimatedPriceMaxZAR: priceMax,
      estimatedMonthlySavingsZAR: estimatedMonthlySavings,
      estimatedPaybackYears: Math.max(estimatedPaybackYears, 3.2),
      co2SavedTonnesPerYear: co2SavedTonnes,
    };
  };

  const results = calculateResult();

  const handleApplianceToggle = (id: string) => {
    setAppliances(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateFullName(contactName);
    if (!nameCheck.isValid) { setErrorMessage(nameCheck.error || 'Invalid name'); return; }

    const emailCheck = validateEmail(contactEmail);
    if (!emailCheck.isValid) { setErrorMessage(emailCheck.error || 'Invalid email'); return; }

    const phoneCheck = validatePhone(contactPhone);
    if (!phoneCheck.isValid) { setErrorMessage(phoneCheck.error || 'Invalid phone'); return; }

    const cityCheck = validateLocation(propertyCity, 'City / Suburb');
    if (!cityCheck.isValid) { setErrorMessage(cityCheck.error || 'Invalid city'); return; }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: contactName,
        email: contactEmail,
        phone: contactPhone,
        city: propertyCity,
        suburb: propertyCity,
        installTarget: preferredDate || 'Within 2-4 weeks',
        monthlyBillZAR: results.monthlyBillZAR,
        recommendedInverterKw: results.recommendedInverterKva,
        recommendedBatteryKwh: results.recommendedBatteryKwh,
        recommendedSolarKwp: results.recommendedSolarKwp,
      };

      const res = await fetch('/api/quotes/residential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const generatedId = data.quoteId || `KX-QT-${Math.floor(1000 + Math.random() * 9000)}`;
        setQuoteRefId(generatedId);

        // Save into Firebase Firestore
        addLeadQuote({
          fullName: contactName,
          email: contactEmail,
          phone: contactPhone,
          suburb: propertyCity,
          province: 'Gauteng',
          propertyType: 'Residential Single Family',
          monthlyBillZAR: results.monthlyBillZAR,
          recommendedInverterKw: results.recommendedInverterKva,
          recommendedBatteryKwh: results.recommendedBatteryKwh,
          recommendedSolarKwp: results.recommendedSolarKwp
        });

        setSubmitted(true);

        if (onQuoteRequested) {
          onQuoteRequested({
            ...results,
            contactName,
            contactEmail,
            contactPhone,
            propertyCity,
            preferredDate,
          });
        }
      } else {
        setErrorMessage(data.error || 'Failed to submit quote proposal. Please check your inputs.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error connecting to quote engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-[#0E1311] border border-[#24302A] rounded-lg overflow-hidden text-[#E6ECE8] ${isStandalone ? 'p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl' : 'p-4'}`}>
      {/* Step Header */}
      <div className="border-b border-[#24302A] pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Engineering Sizing Wizard • Step 0{currentStep} of 05
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              {currentStep === 1 && 'What are you powering?'}
              {currentStep === 2 && 'Tell us about your energy usage'}
              {currentStep === 3 && 'What are your primary goals?'}
              {currentStep === 4 && 'How much backup storage do you need?'}
              {currentStep === 5 && 'Your Recommended System Direction'}
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`h-2 rounded-sm transition-all ${
                  step === currentStep 
                    ? 'w-8 bg-[#1B4D3E] border border-[#286D58]' 
                    : step < currentStep 
                    ? 'w-4 bg-[#286D58]' 
                    : 'w-4 bg-[#1A221E] border border-[#24302A]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Property Type */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <p className="text-xs text-[#9EADA5] leading-relaxed">
            Select your property classification. System sizing rules, phase balancing, and municipal SSEG registration requirements differ between residential and commercial connections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'residential', title: 'Residential Home / Estate', desc: 'Single-phase or split 3-phase suburban homes, townhouses, and residential estates.', icon: Home },
              { id: 'commercial', title: 'Commercial Office / Retail', desc: '3-phase commercial properties, retail stores, medical suites, and professional offices.', icon: Building2 },
              { id: 'agricultural', title: 'Agricultural / Farm', desc: 'Borehole pumps, packing sheds, cold storage, and rural microgrids.', icon: Tractor },
              { id: 'industrial', title: 'Industrial / Light Manufacturing', desc: 'Heavy daytime loads, peak-demand shaving, and factory equipment.', icon: Factory },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = propertyType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPropertyType(item.id as PropertyType)}
                  className={`p-5 rounded border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141A17] border-[#286D58] ring-1 ring-[#286D58]'
                      : 'bg-[#141A17]/40 border-[#24302A] hover:border-[#31423A] hover:bg-[#141A17]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded ${isSelected ? 'bg-[#1B4D3E] text-white' : 'bg-[#0E1311] text-[#9EADA5]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-[#9EADA5] leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Energy Usage */}
      {currentStep === 2 && (
        <div className="space-y-8">
          {/* Bill Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono uppercase text-[#9EADA5] tracking-wider">
                Average Monthly Electricity Bill (ZAR)
              </label>
              <div className="px-3 py-1 bg-[#141A17] border border-[#24302A] rounded font-mono font-bold text-white text-base">
                R {monthlyBillZAR.toLocaleString()} <span className="text-[10px] text-[#6B7B73] font-normal">/ month</span>
              </div>
            </div>

            <input
              type="range"
              min={1500}
              max={35000}
              step={500}
              value={monthlyBillZAR}
              onChange={e => setMonthlyBillZAR(Number(e.target.value))}
              className="w-full h-2 bg-[#1A221E] rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
            />

            <div className="flex justify-between text-[11px] font-mono text-[#6B7B73] mt-2">
              <span>R 1,500 / mo (~440 kWh)</span>
              <span>R 15,000 / mo (~4,400 kWh)</span>
              <span>R 35,000+ / mo</span>
            </div>
          </div>

          {/* Occupants & Property Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1B2420]">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">Number of Occupants / Staff</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setOccupants(num)}
                    className={`py-2 rounded font-mono text-xs font-semibold border ${
                      occupants === num 
                        ? 'bg-[#1B4D3E] text-white border-[#286D58]' 
                        : 'bg-[#141A17] text-[#9EADA5] border-[#24302A]'
                    }`}
                  >
                    {num === 8 ? '8+' : `${num} pers`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">Heavy Load Appliances</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'geyser', label: 'Electric Geyser' },
                  { id: 'pool_pump', label: 'Swimming Pool Pump' },
                  { id: 'aircon', label: 'Air Conditioning' },
                  { id: 'borehole', label: 'Borehole / Irrigation' },
                ].map(app => (
                  <label 
                    key={app.id}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer select-none ${
                      appliances.includes(app.id) 
                        ? 'bg-[#141A17] border-[#286D58] text-white' 
                        : 'bg-[#0E1311] border-[#24302A] text-[#9EADA5]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={appliances.includes(app.id)}
                      onChange={() => handleApplianceToggle(app.id)}
                      className="rounded bg-[#0E1311] border-[#24302A] text-[#1B4D3E]"
                    />
                    <span className="text-[11px]">{app.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Priorities */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-[#9EADA5]">
            Clarifying your top objectives helps our algorithm optimize between panel array generation (kWh offset) and battery capacity (outage buffer).
          </p>

          <div className="space-y-3">
            {[
              { id: 'lower-bills', title: 'Lower Electricity Costs', desc: 'Maximize daytime solar generation to drastically cut municipal electricity purchases.', metric: 'High Solar PV Array' },
              { id: 'backup-power', title: 'Loadshedding & Outage Resilience', desc: 'Ensure continuous uninterrupted power for essential circuits, lights, Wi-Fi, and refrigeration.', metric: 'Expanded Battery Storage' },
              { id: 'energy-independence', title: 'Maximum Off-Grid Autonomy', desc: 'Minimize reliance on municipal grid power around the clock.', metric: 'Balanced High-Cap System' },
              { id: 'balanced', title: 'Balanced Hybrid Strategy (Recommended)', desc: 'Optimal ratio of daily bill reduction and dependable overnight outage buffer.', metric: 'Hybrid Standard' },
            ].map(item => {
              const isSelected = priority === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPriority(item.id as SolarPriority)}
                  className={`w-full p-4 rounded border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#141A17] border-[#286D58] ring-1 ring-[#286D58]'
                      : 'bg-[#141A17]/40 border-[#24302A] hover:border-[#31423A]'
                  }`}
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-[#9EADA5] mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#286D58] uppercase tracking-wider bg-[#0E1311] px-2.5 py-1 rounded border border-[#1B2420] shrink-0 ml-4 hidden sm:inline">
                    {item.metric}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Backup Duration */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <p className="text-xs text-[#9EADA5]">
            How long should your system sustain critical operations when municipal power drops?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'essential', title: 'Essential Circuits Only', desc: 'WiFi, security systems, laptops, TV, and LED lights (approx 2 - 4 hours).', spec: '5.12 kWh Battery' },
              { id: 'several-hours', title: 'Standard Loadshedding Window', desc: 'Sustains full Stage 2 to Stage 4 loadshedding slots without changing habits.', spec: '5.12 – 10.24 kWh' },
              { id: 'overnight', title: 'Full Overnight Resilience', desc: 'Powers lighting, refrigeration, and evening appliances until sunrise solar charging.', spec: '10.24 – 15.36 kWh' },
              { id: 'full-24h', title: '24-Hour Extended Autonomy', desc: 'Critical commercial operations or heavy estates requiring multi-day backup.', spec: '20.48+ kWh Storage' },
            ].map(item => {
              const isSelected = backupDuration === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setBackupDuration(item.id as BackupDuration)}
                  className={`p-4 rounded border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141A17] border-[#286D58] ring-1 ring-[#286D58]'
                      : 'bg-[#141A17]/40 border-[#24302A] hover:border-[#31423A]'
                  }`}
                >
                  <div className="mb-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white uppercase">{item.title}</h4>
                    <p className="text-xs text-[#9EADA5] mt-1">{item.desc}</p>
                  </div>
                  <div className="text-[10px] font-mono text-[#D97706] font-semibold bg-[#0E1311] px-2 py-0.5 rounded border border-[#1B2420] w-max">
                    {item.spec}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 5: Recommended Direction & Quote Capture */}
      {currentStep === 5 && (
        <div className="space-y-6">
          {/* Engineering Spec Matrix Card */}
          <div className="bg-[#141A17] border border-[#286D58]/60 rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#24302A] gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#286D58] font-bold tracking-wider">
                  Recommended Technical Configuration
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  {results.recommendedInverterKva}kW Hybrid + {results.recommendedBatteryKwh}kWh Storage + {results.recommendedSolarKwp}kWp Solar
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Estimated Turnkey Range</span>
                <span className="text-lg font-mono font-bold text-[#D97706]">
                  R {results.estimatedPriceMinZAR.toLocaleString()} – R {results.estimatedPriceMaxZAR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Spec Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#6B7B73] block text-[10px] uppercase">Inverter Capacity</span>
                <span className="text-white text-sm font-bold">{results.recommendedInverterKva} kVA</span>
                <span className="text-[10px] text-[#9EADA5] block mt-0.5">Pure Sine Wave IP65</span>
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#6B7B73] block text-[10px] uppercase">Solar PV Array</span>
                <span className="text-white text-sm font-bold">{results.recommendedSolarKwp} kWp</span>
                <span className="text-[10px] text-[#9EADA5] block mt-0.5">~{Math.round(results.recommendedSolarKwp / 0.55)}x 550W Panels</span>
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#6B7B73] block text-[10px] uppercase">Battery Storage</span>
                <span className="text-white text-sm font-bold">{results.recommendedBatteryKwh} kWh</span>
                <span className="text-[10px] text-[#9EADA5] block mt-0.5">LiFePO4 90% DoD</span>
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                <span className="text-[#6B7B73] block text-[10px] uppercase">Est. Monthly Offset</span>
                <span className="text-[#10B981] text-sm font-bold">~R {results.estimatedMonthlySavingsZAR.toLocaleString()}</span>
                <span className="text-[10px] text-[#9EADA5] block mt-0.5">~{results.estimatedPaybackYears} yr payback</span>
              </div>
            </div>

            {/* Mandatory Estimate Disclaimer */}
            <EstimateDisclaimer variant="inline" />
          </div>

          {/* Detailed Quote Request Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 bg-[#141A17] border border-[#24302A] rounded-lg space-y-4">
              <div className="border-b border-[#24302A] pb-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
                  Request Your Detailed System Proposal & Site Assessment
                </h4>
                <p className="text-xs text-[#9EADA5] mt-1">
                  We will prepare an engineered CAD single-line proposal and confirm site availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. David Nkosi"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="client@domain.co.za"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">City / Suburb *</label>
                  <input
                    type="text"
                    required
                    value={propertyCity}
                    onChange={e => setPropertyCity(e.target.value)}
                    placeholder="e.g. Sandton, JHB"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Preferred Install Target</label>
                  <input
                    type="text"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    placeholder="e.g. Within 2 weeks"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs text-white focus:border-[#286D58]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-red-300 text-xs font-mono">
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1B4D3E] hover:bg-[#286D58] disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? '⚡ Generating & Dispatching Proposal...' : 'Request My Detailed Quote & Engineering Proposal'}
              </button>
            </form>
          ) : (
            <div className="p-6 bg-[#141A17] border border-[#10B981]/40 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white uppercase">System Sizing Request Submitted</h4>
              <p className="text-xs text-[#9EADA5] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{contactName}</strong>. Reference: <span className="font-mono text-[#00D2FF] font-bold">{quoteRefId || 'KX-QT-STAGED'}</span>. A DoL certified engineering specialist will review your sizing profile and email your CAD single-line schematic and official proposal.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-[#24302A] flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] text-xs font-mono text-[#9EADA5] hover:text-white uppercase rounded flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < 5 && (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
            className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-xs font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-colors"
          >
            Continue Sizing <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
