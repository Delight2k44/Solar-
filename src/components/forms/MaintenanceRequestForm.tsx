import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Layers,
  Zap
} from 'lucide-react';

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
  selectedTier?: string;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({ 
  onSuccess,
  selectedTier = 'Performance SLA'
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Johannesburg');
  const [packageTier, setPackageTier] = useState(selectedTier);
  const [inverterBrand, setInverterBrand] = useState('Deye Hybrid Inverter');
  const [systemAge, setSystemAge] = useState('1 – 3 Years');
  const [primaryReason, setPrimaryReason] = useState('Annual SANS 10142 Health Audit');
  const [issueDetails, setIssueDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `KX-SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketRef(ref);
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-2xl max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
            Maintenance Service Ticket Dispatched
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Service Reference: <span className="font-mono text-[#D97706]">{ticketRef}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9EADA5] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{clientName}</strong>. Your preventative service request has been logged under our <strong className="text-white">{packageTier}</strong> protocol. An SLA technical technician will contact you to confirm on-site arrival window.
          </p>
        </div>

        <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl text-left text-xs font-mono text-[#9EADA5] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">Hardware Profile:</span>
            <span className="text-white font-bold">{inverterBrand} ({systemAge})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">Primary Objective:</span>
            <span className="text-white font-bold">{primaryReason}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">Diagnostic Guarantee:</span>
            <span className="text-[#10B981] font-bold">Thermal Infrared & String Voltage Audit</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Submit Another Maintenance Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141A17] border border-[#24302A] rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-[#0E1311] border-b border-[#24302A] space-y-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#286D58]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
            Asset Lifecycle & Diagnostics
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
          Book Solar Maintenance & Diagnostic Service
        </h3>
        <p className="text-xs text-[#9EADA5]">
          Book certified electrical inspections, string testing, thermal infrared scans, and de-ionized solar panel cleaning across South African metros.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Contact Coordinates */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
            01. Client & Location Coordinates
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Ansie Visser"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ansie@domain.co.za"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 82 000 0000"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Metro / City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Pretoria / Cape Town / Durban"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Service SLA Tier</label>
              <select
                value={packageTier}
                onChange={e => setPackageTier(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Essential Care (Annual Audit)</option>
                <option>Performance SLA (Quarterly)</option>
                <option>Complete Asset Protection (Commercial)</option>
                <option>One-Off Emergency Fault Diagnostic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Site Physical Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 88 Waterfall Drive, Midrand"
              className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
            />
          </div>
        </div>

        {/* Existing Hardware Specs */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
            02. Existing Solar Equipment & Diagnostic Goals
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Installed Inverter Brand</label>
              <select
                value={inverterBrand}
                onChange={e => setInverterBrand(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Deye Hybrid Inverter</option>
                <option>Sunsynk Inverter</option>
                <option>Victron Energy MultiPlus / Quattro</option>
                <option>Growatt Hybrid</option>
                <option>Huawei SUN2000</option>
                <option>GoodWe / Solis</option>
                <option>Other / Unsure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Estimated System Age</label>
              <select
                value={systemAge}
                onChange={e => setSystemAge(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Under 1 Year</option>
                <option>1 – 3 Years</option>
                <option>3 – 5 Years</option>
                <option>5+ Years (Legacy System)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Primary Objective</label>
              <select
                value={primaryReason}
                onChange={e => setPrimaryReason(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Annual SANS 10142 Health Audit</option>
                <option>Panel De-soiling & Hydro-Wash</option>
                <option>Inverter Error Code / Fault Tripping</option>
                <option>Battery Capacity Loss / Not Charging</option>
                <option>Insurance Inspection & CoC Re-Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Issue Description / Error Codes (If Any)</label>
            <textarea
              rows={3}
              value={issueDetails}
              onChange={e => setIssueDetails(e.target.value)}
              placeholder="Describe any warning beeps, error numbers (e.g. F20 / E03), reduced solar production, or past weather damage..."
              className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2 text-xs text-white focus:border-[#286D58]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Book Certified Maintenance Diagnostic</span>
          </button>
        </div>
      </form>
    </div>
  );
};
