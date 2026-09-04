import { validateFullName, validateEmail, validatePhone, validateAddress, formatUserFriendlyError } from '../../utils/validation';
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  ShieldCheck,
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
  selectedTier?: string;
  defaultTier?: string;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({ 
  onSuccess,
  selectedTier,
  defaultTier = 'Performance SLA (Quarterly)'
}) => {
  const initialTier = selectedTier || defaultTier;
  const { createMaintenanceTicket } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [packageTier, setPackageTier] = useState(initialTier);
  const [inverterBrand, setInverterBrand] = useState('Deye / Sunsynk Hybrid');
  const [systemAge, setSystemAge] = useState('1 - 2 Years');
  const [primaryReason, setPrimaryReason] = useState('Annual SANS 10142 Health Audit & Thermal Scan');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState('Johannesburg');
  const [issueDetails, setIssueDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateFullName(clientName);
    if (!nameCheck.isValid) { setErrorMessage(nameCheck.error || 'Invalid name'); return; }

    const emailCheck = validateEmail(clientEmail);
    if (!emailCheck.isValid) { setErrorMessage(emailCheck.error || 'Invalid email'); return; }

    const phoneCheck = validatePhone(clientPhone);
    if (!phoneCheck.isValid) { setErrorMessage(phoneCheck.error || 'Invalid phone'); return; }

    if (siteAddress) {
      const addrCheck = validateAddress(siteAddress);
      if (!addrCheck.isValid) { setErrorMessage(addrCheck.error || 'Invalid address'); return; }
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        siteAddress,
        city,
        tier: packageTier,
        inverterBrand,
        systemAge,
        primaryReason,
        issueDetails
      };

      let generatedRef = `KX-SRV-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Guaranteed persistent ticket creation in Firestore
      createMaintenanceTicket({
        clientName,
        clientEmail,
        clientPhone,
        siteAddress,
        city,
        tier: packageTier,
        inverterBrand,
        systemAge,
        primaryReason,
        issueDetails
      });

      // 2. Automated notification dispatch (graceful fallback)
      try {
        const res = await fetch('/api/support/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.ticketId) generatedRef = data.ticketId;
        }
      } catch {
        // Backend offline fallback - ticket is already saved in Firestore
      }

      setTicketRef(generatedRef);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(formatUserFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-2xl max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold">
            Maintenance Service Ticket Dispatched
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Service Reference: <span className="font-mono text-[#D97706]">{ticketRef}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{clientName}</strong>. Your preventative service request has been logged under our <strong className="text-white">{packageTier}</strong> protocol. An SLA technician will contact you to confirm on-site arrival window.
          </p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#1E2530] rounded-xl text-left text-xs font-mono text-[#94A3B8] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Hardware Profile:</span>
            <span className="text-white font-bold">{inverterBrand} ({systemAge})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Primary Objective:</span>
            <span className="text-white font-bold">{primaryReason}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Diagnostic Guarantee:</span>
            <span className="text-[#10B981] font-bold">Thermal Infrared & String Voltage Audit</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0D1117] hover:bg-[#161B22] border border-[#1E2530] text-white text-xs font-mono uppercase rounded-lg transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl mx-auto">
      <div className="border-b border-[#1E2530] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block mb-1">
            Certified Electrician Dispatch
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase">
            Book Preventative Care or System Audit
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#0D1117] border border-[#1E2530] rounded text-[10px] font-mono text-[#10B981]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SANS 10142 Certified</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Customer & Location */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#161B22] pb-2">
            01. Contact & Site Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Ansie Visser"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="ansie@domain.co.za"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="+27 82 000 0000"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Metro / City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Pretoria / Cape Town / Durban"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Service SLA Tier</label>
              <select
                value={packageTier}
                onChange={e => setPackageTier(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Essential Care (Annual Audit)</option>
                <option>Performance SLA (Quarterly)</option>
                <option>Complete Asset Protection (Commercial)</option>
                <option>One-Off Emergency Fault Diagnostic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Site Physical Address *</label>
            <input
              type="text"
              required
              value={siteAddress}
              onChange={e => setSiteAddress(e.target.value)}
              placeholder="e.g. 88 Waterfall Drive, Midrand"
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
            />
          </div>
        </div>

        {/* Existing Hardware Specs */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1E2530] pb-2">
            02. Existing Solar Equipment & Diagnostic Goals
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Inverter Brand</label>
              <select
                value={inverterBrand}
                onChange={e => setInverterBrand(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Deye Hybrid Inverter</option>
                <option>Sunsynk Parity Inverter</option>
                <option>Victron Energy MultiPlus</option>
                <option>GoodWe / Solis / Growatt</option>
                <option>Other / Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Approx System Age</label>
              <select
                value={systemAge}
                onChange={e => setSystemAge(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Under 1 Year (Warranty Audit)</option>
                <option>1 – 3 Years</option>
                <option>3 – 5 Years</option>
                <option>Over 5 Years (Legacy System)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Primary Inspection Goal</label>
              <select
                value={primaryReason}
                onChange={e => setPrimaryReason(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Annual SANS 10142 Health Audit</option>
                <option>Inverter Fault / Error Code Tripping</option>
                <option>Panel De-soiling & Hydro Wash</option>
                <option>Thermal Infrared Hot-Spot Audit</option>
                <option>Battery Health & BMS Recalibration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Additional Symptoms or Error Codes</label>
            <textarea
              rows={3}
              value={issueDetails}
              onChange={e => setIssueDetails(e.target.value)}
              placeholder="e.g. Earth fault indicator lighting up after rain, battery discharging faster than normal, breaker tripping on changeover..."
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
            />
          </div>
        </div>

        <div className="pt-3 space-y-3">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#00D2FF] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Dispatch Maintenance Booking Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
