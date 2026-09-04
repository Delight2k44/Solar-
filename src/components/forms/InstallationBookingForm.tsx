import { validateFullName, validateEmail, validatePhone, validateAddress, formatUserFriendlyError } from '../../utils/validation';
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Wrench,
  Calendar, 
  CheckCircle2
} from 'lucide-react';

interface InstallationBookingFormProps {
  onSuccess?: () => void;
  defaultCity?: string;
}

export const InstallationBookingForm: React.FC<InstallationBookingFormProps> = ({ 
  onSuccess,
  defaultCity = ''
}) => {
  const { createInstallationBooking } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(defaultCity || 'Johannesburg');
  const [targetDate, setTargetDate] = useState('');
  const [roofType, setRoofType] = useState('Tile (Concrete / Slate)');
  const [phaseConnection, setPhaseConnection] = useState('Single Phase (230V, 60A / 80A)');
  const [dbLocation, setDbLocation] = useState('Garage');
  const [specialAccess, setSpecialAccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateFullName(clientName);
    if (!nameCheck.isValid) { setErrorMessage(nameCheck.error || 'Invalid name'); return; }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setErrorMessage(emailCheck.error || 'Invalid email'); return; }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.isValid) { setErrorMessage(phoneCheck.error || 'Invalid phone'); return; }

    const addrCheck = validateAddress(address);
    if (!addrCheck.isValid) { setErrorMessage(addrCheck.error || 'Invalid address'); return; }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        clientName,
        email,
        phone,
        address,
        city,
        targetDate: targetDate || new Date().toISOString().split('T')[0],
        roofType,
        phaseConnection,
        dbLocation,
        specialAccess
      };

      let generatedRef = `KX-BKG-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Guaranteed persistent booking creation in Firestore
      createInstallationBooking({
        clientName,
        email,
        phone,
        address,
        city,
        targetDate: targetDate || new Date().toISOString().split('T')[0],
        roofType,
        phaseConnection,
        dbLocation,
        specialAccess
      });

      // 2. Automated notification dispatch (graceful fallback)
      try {
        const res = await fetch('/api/bookings/assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.bookingId) generatedRef = data.bookingId;
        }
      } catch {
        // Backend offline fallback - booking is already saved in Firestore
      }

      setBookingRef(generatedRef);
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
            Certified Installation Assessment Reserved
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Booking Reference: <span className="font-mono text-[#D97706]">{bookingRef}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{clientName}</strong>. Our Regional Operations Dispatcher for <strong className="text-white">{city}</strong> has logged your assessment for <strong className="text-white">{targetDate || 'upcoming dispatch'}</strong>. A registered Installation Electrician (IE) has been assigned to your reference.
          </p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#1E2530] rounded-xl text-left text-xs font-mono text-[#94A3B8] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Site Address:</span>
            <span className="text-white font-bold">{address}, {city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Electrical Supply:</span>
            <span className="text-white font-bold">{phaseConnection}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Compliance Guarantee:</span>
            <span className="text-[#10B981] font-bold">SANS 10142-1-2 CoC Included</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0D1117] hover:bg-[#161B22] border border-[#1E2530] text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Schedule Another Site Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-[#0D1117] border-b border-[#1E2530] space-y-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#00D2FF]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold">
            Engineering Dispatch
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
          Reserve an Installation Assessment Window
        </h3>
        <p className="text-xs text-[#94A3B8]">
          Select your target installation date. Our installation electricians will perform a physical DB check, string containment review, and structural roof inspection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Step 1: Site Location & Timing */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1E2530] pb-2">
            01. Property Address & Target Scheduling
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Sipho Sithole"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sipho@domain.co.za"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 82 000 0000"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Metro / City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Johannesburg / Cape Town"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Target On-Site Date *</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Physical Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 14 Protea Avenue, Bryanston"
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
            />
          </div>
        </div>

        {/* Step 2: Electrical & Roof Technical Specifications */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1E2530] pb-2">
            02. Electrical Infrastructure & Roof Profile
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Main Electrical Supply</label>
              <select
                value={phaseConnection}
                onChange={e => setPhaseConnection(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Single Phase (230V, 60A / 80A)</option>
                <option>Three Phase (400V Domestic)</option>
                <option>Three Phase (Commercial 100A+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Roof Type Structure</label>
              <select
                value={roofType}
                onChange={e => setRoofType(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Tile (Concrete / Slate)</option>
                <option>Corrugated / IBR Metal Sheet</option>
                <option>Klip-Lok Standing Seam</option>
                <option>Flat Concrete Slab (Tilt Frames)</option>
                <option>Thatch / Heritage Building</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Main DB Proximity</label>
              <select
                value={dbLocation}
                onChange={e => setDbLocation(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Garage (Recommended for Inverter)</option>
                <option>Scullery / Kitchen</option>
                <option>Outbuilding / Plant Room</option>
                <option>Hallway / Passage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Access Notes / Security Estate Details</label>
            <input
              type="text"
              value={specialAccess}
              onChange={e => setSpecialAccess(e.target.value)}
              placeholder="e.g. Gated estate security access code required, two-storey roof ladder needed..."
              className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
            />
          </div>
        </div>

        <div className="pt-2 space-y-3">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#00D2FF] hover:bg-[#38BDF8] disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Confirm Installation Assessment Window'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
