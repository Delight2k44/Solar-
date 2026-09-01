import { sendMaintenanceTicketEmail } from '../../services/emailService';
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Wrench, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles
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
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [ticketRef, setTicketRef] = useState('');

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
    setIsSending(true);
    const ref = createMaintenanceTicket({
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

    setTicketRef(ref);

    const result = await sendMaintenanceTicketEmail({
      ticketId: ref,
      clientName: clientName || 'Valued Client',
      clientEmail: clientEmail || 'client@domain.co.za',
      clientPhone: clientPhone || '+27 82 000 0000',
      siteAddress: siteAddress || 'Site Address',
      city: city || 'Johannesburg',
      tier: packageTier,
      inverterBrand: inverterBrand,
      primaryReason: primaryReason,
      issueDetails: issueDetails
    });

    if (!result.success) {
      console.error('Maintenance ticket email failed:', result.error);
      setEmailError(result.error || 'Ticket confirmation email could not be sent');
    }
    setIsSending(false);
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
            Thank you, <strong className="text-white">{clientName}</strong>. Your preventative service request has been logged under our <strong className="text-white">{packageTier}</strong> protocol. An SLA technician will contact you to confirm on-site arrival window.
          </p>
          {emailError && (
            <p className="text-xs text-[#F59E0B] max-w-md mx-auto leading-relaxed">
              We could not email your confirmation. Your ticket is logged — keep this reference and call +27 78 780 8569 if it is urgent.
            </p>
          )}
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
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white text-xs font-mono uppercase rounded-lg transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141A17] border border-[#24302A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl mx-auto">
      <div className="border-b border-[#24302A] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
            Certified Electrician Dispatch
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase">
            Book Preventative Care or System Audit
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#0E1311] border border-[#24302A] rounded text-[10px] font-mono text-[#10B981]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SANS 10142 Certified</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Customer & Location */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1B2420] pb-2">
            01. Contact & Site Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Contact Name *</label>
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
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
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
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
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
              value={siteAddress}
              onChange={e => setSiteAddress(e.target.value)}
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
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Inverter Brand</label>
              <select
                value={inverterBrand}
                onChange={e => setInverterBrand(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Deye Hybrid Inverter</option>
                <option>Sunsynk Parity Inverter</option>
                <option>Victron Energy MultiPlus</option>
                <option>GoodWe / Solis / Growatt</option>
                <option>Other / Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Approx System Age</label>
              <select
                value={systemAge}
                onChange={e => setSystemAge(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Under 1 Year (Warranty Audit)</option>
                <option>1 – 3 Years</option>
                <option>3 – 5 Years</option>
                <option>Over 5 Years (Legacy System)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Primary Inspection Goal</label>
              <select
                value={primaryReason}
                onChange={e => setPrimaryReason(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
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
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Additional Symptoms or Error Codes</label>
            <textarea
              rows={3}
              value={issueDetails}
              onChange={e => setIssueDetails(e.target.value)}
              placeholder="e.g. Earth fault indicator lighting up after rain, battery discharging faster than normal, breaker tripping on changeover..."
              className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
            />
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-4 bg-[#111827] dark:bg-[#1B4D3E] hover:bg-black dark:hover:bg-[#286D58] disabled:opacity-60 border border-[#374151] dark:border-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>{isSending ? 'Dispatching...' : 'Dispatch Maintenance Booking Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
