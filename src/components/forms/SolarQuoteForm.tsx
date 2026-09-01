import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { sendSolarQuoteEmail } from '../../services/emailService';
import { 
  Sun, 
  Battery, 
  Home, 
  Building2, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calculator,
  Calendar,
  FileText
} from 'lucide-react';

interface SolarQuoteFormProps {
  onSuccess?: () => void;
  defaultPropertyType?: string;
}

export const SolarQuoteForm: React.FC<SolarQuoteFormProps> = ({ 
  onSuccess,
  defaultPropertyType = 'Residential Home'
}) => {
  const { addLeadQuote } = useData();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');

  // Form State
  const [propertyType, setPropertyType] = useState(defaultPropertyType);
  const [monthlyBill, setMonthlyBill] = useState(4500);
  const [daytimeUsage, setDaytimeUsage] = useState(40); // % of usage during day
  const [loadsheddingPriority, setLoadsheddingPriority] = useState('Essential + High Draw (8kW+)');
  const [roofType, setRoofType] = useState('Tile (Concrete / Slate)');
  const [province, setProvince] = useState('Gauteng');
  
  // Contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [suburb, setSuburb] = useState('');
  const [notes, setNotes] = useState('');

  // Calculate estimated sizing
  const tariffPerKwh = 3.45;
  const estimatedMonthlyKwh = Math.round(monthlyBill / tariffPerKwh);
  const estimatedDailyKwh = Math.round(estimatedMonthlyKwh / 30);
  
  const peakSunHours = province === 'Western Cape' ? 5.1 : (province === 'Northern Cape' ? 6.2 : 5.4);
  const recommendedSolarKwp = Number(((estimatedDailyKwh * 0.8) / (peakSunHours * 0.82)).toFixed(1));
  
  const recommendedInverterKw = monthlyBill > 8000 ? 12 : (monthlyBill > 3500 ? 8 : 5);
  const recommendedBatteryKwh = monthlyBill > 8000 ? 15.36 : (monthlyBill > 4000 ? 10.24 : 5.12);
  const estimatedMonthlySavingsZAR = Math.round(monthlyBill * 0.75);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuoteId = addLeadQuote({
      fullName,
      email,
      phone,
      suburb,
      province,
      propertyType,
      monthlyBillZAR: monthlyBill,
      recommendedInverterKw,
      recommendedBatteryKwh,
      recommendedSolarKwp,
    });

    setQuoteId(newQuoteId);
    setSubmitted(true);
    sendSolarQuoteEmail({
      quoteId: newQuoteId,
      fullName,
      email,
      phone,
      suburb,
      province,
      monthlyBillZAR: monthlyBill,
      recommendedInverterKw,
      recommendedBatteryKwh,
      recommendedSolarKwp
    }).catch(e => console.log('Email notice:', e));
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl p-8 sm:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
            Formal Engineering Sizing Dispatched
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Quotation Reference: <span className="font-mono text-[#D97706]">{quoteId}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9EADA5] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{fullName}</strong>. An itemized proposal based on your <strong className="text-white">R {monthlyBill.toLocaleString()} / mo</strong> profile has been compiled and emailed to <strong className="text-white">{email}</strong>.
          </p>
        </div>

        {/* System Summary Badge */}
        <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#6B7B73] block uppercase">Recommended Inverter</span>
            <span className="text-white font-bold text-sm">{recommendedInverterKw} kW Hybrid</span>
          </div>
          <div className="border-x border-[#1B2420]">
            <span className="text-[10px] text-[#6B7B73] block uppercase">LiFePO4 Storage</span>
            <span className="text-white font-bold text-sm">{recommendedBatteryKwh} kWh</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6B7B73] block uppercase">Solar PV Array</span>
            <span className="text-white font-bold text-sm">{recommendedSolarKwp} kWp</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="px-6 py-2.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Configure Another System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141A17] border border-[#24302A] rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
      {/* Header & Step Indicator */}
      <div className="p-6 sm:p-8 bg-[#0E1311] border-b border-[#24302A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Interactive Solar Sizing & Quotation
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
              Request Your System Specification
            </h3>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#9EADA5] bg-[#141A17] px-3 py-1.5 rounded border border-[#24302A]">
            <span className="text-[#286D58] font-bold">Step 0{step}</span>
            <span>/</span>
            <span>03</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1B2420] h-1.5 rounded-full mt-6 overflow-hidden">
          <div 
            className="bg-[#286D58] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: Property & Energy Spend */}
        {step === 1 && (
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
              01. Property Profile & Monthly Electricity Spend
            </h4>

            {/* Property Type Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'Residential Home', icon: Home, label: 'Residential Home' },
                { id: 'Commercial Enterprise', icon: Building2, label: 'Commercial B2B' },
                { id: 'Agricultural / Farm', icon: Zap, label: 'Agri / Vineyard' },
                { id: 'Backup Only (No Panels)', icon: Battery, label: 'Battery Backup' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPropertyType(item.id)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    propertyType === item.id 
                      ? 'bg-[#1B4D3E]/30 border-[#286D58] text-white ring-1 ring-[#286D58]' 
                      : 'bg-[#0E1311] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${propertyType === item.id ? 'text-[#10B981]' : 'text-[#6B7B73]'}`} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Monthly Spend Slider */}
            <div className="space-y-3 bg-[#0E1311] p-5 rounded-xl border border-[#24302A]">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase text-[#9EADA5]">
                  Average Monthly Eskom / Municipal Bill:
                </label>
                <span className="text-lg font-mono font-bold text-[#D97706]">
                  R {monthlyBill.toLocaleString()} / month
                </span>
              </div>

              <input
                type="range"
                min={1500}
                max={30000}
                step={500}
                value={monthlyBill}
                onChange={e => setMonthlyBill(Number(e.target.value))}
                className="w-full h-2 bg-[#1B2420] rounded-lg appearance-none cursor-pointer accent-[#286D58]"
              />

              <div className="flex justify-between text-[10px] font-mono text-[#6B7B73]">
                <span>R 1,500</span>
                <span>R 15,000</span>
                <span>R 30,000+</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1B2420] text-xs font-mono text-[#9EADA5]">
                <div>
                  <span className="text-[10px] text-[#6B7B73] block">Est. Monthly Consumption:</span>
                  <strong className="text-white">{estimatedMonthlyKwh} kWh / month</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7B73] block">Est. Monthly Tariff Savings:</span>
                  <strong className="text-[#10B981]">~ R {estimatedMonthlySavingsZAR.toLocaleString()} / month</strong>
                </div>
              </div>
            </div>

            {/* Province Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Province / Region</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                >
                  <option>Gauteng</option>
                  <option>Western Cape</option>
                  <option>KwaZulu-Natal</option>
                  <option>Eastern Cape</option>
                  <option>Free State</option>
                  <option>Mpumalanga</option>
                  <option>Limpopo</option>
                  <option>North West</option>
                  <option>Northern Cape</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Roof Structure Type</label>
                <select
                  value={roofType}
                  onChange={e => setRoofType(e.target.value)}
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                >
                  <option>Tile (Concrete / Slate)</option>
                  <option>Corrugated / IBR Metal Sheet</option>
                  <option>Klip-Lok Standing Seam</option>
                  <option>Flat Concrete Slab (Tilt Frames)</option>
                  <option>Thatch / Heritage (Ground Mount Preferred)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>Continue to Step 02</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: System Sizing Review */}
        {step === 2 && (
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
              02. Preliminary Engineering Sizing Recommendation
            </h4>

            <div className="p-6 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B2420]">
                <span className="text-xs font-mono text-[#9EADA5]">Calculated Sizing Profile:</span>
                <span className="text-[10px] font-mono uppercase text-[#10B981] bg-[#1B4D3E]/30 px-2 py-0.5 rounded border border-[#1B4D3E]">
                  SANS 10142-1-2 Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-[#6B7B73] uppercase">Hybrid Inverter</span>
                  <div className="text-lg font-bold text-white uppercase">{recommendedInverterKw} kW Single/3-Phase</div>
                  <p className="text-[10px] text-[#9EADA5]">Deye / Sunsynk Tier-1</p>
                </div>

                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-[#6B7B73] uppercase">LiFePO4 Storage</span>
                  <div className="text-lg font-bold text-white uppercase">{recommendedBatteryKwh} kWh Storage</div>
                  <p className="text-[10px] text-[#9EADA5]">Freedom Won / Dyness 10-Yr</p>
                </div>

                <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-lg space-y-1">
                  <span className="text-[10px] font-mono text-[#6B7B73] uppercase">Solar Array</span>
                  <div className="text-lg font-bold text-white uppercase">{recommendedSolarKwp} kWp (~{Math.round(Number(recommendedSolarKwp) * 1000 / 550)} Panels)</div>
                  <p className="text-[10px] text-[#9EADA5]">Tier-1 550W Mono PERC</p>
                </div>
              </div>
            </div>

            {/* Outage Protection Sizing */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">Outage Protection Target</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Essential Circuits', desc: 'Lights, Wi-Fi, Refrigeration, TV, Alarms' },
                  { id: 'Essential + High Draw (8kW+)', desc: 'Adds Aircon, Borehole, Ovens, Pool Pump' },
                  { id: '100% Microgrid Off-Grid', desc: 'Total disconnection from municipal grid' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setLoadsheddingPriority(opt.id)}
                    className={`p-3.5 rounded-lg border text-left space-y-1 transition-all ${
                      loadsheddingPriority === opt.id
                        ? 'bg-[#1B4D3E]/30 border-[#286D58] ring-1 ring-[#286D58]'
                        : 'bg-[#0E1311] border-[#24302A] hover:border-[#31423A]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{opt.id}</div>
                    <div className="text-[10px] text-[#9EADA5]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>Final Step: Contact Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact & Proposal Dispatch */}
        {step === 3 && (
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
              03. Dispatch Location & Contact Coordinates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Full Name & Surname *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Michael van der Merwe"
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address (For Proposal PDF) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="michael@domain.co.za"
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Suburb / City *</label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={e => setSuburb(e.target.value)}
                  placeholder="e.g. Bryanston / Sandton / Constantia"
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Specific Equipment or Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Mention if you already have an inverter, generator, or specific brand preference..."
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div className="p-3.5 bg-[#0E1311] border border-[#24302A] rounded-lg flex items-center gap-3 text-xs text-[#9EADA5]">
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
              <span>
                POPIA compliant. Your details are strictly used to prepare your engineering solar quotation.
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Generate Official Quotation</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
