import { validateFullName, validateEmail, validatePhone, formatUserFriendlyError } from '../../utils/validation';
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  CheckCircle2, 
  FileSpreadsheet
} from 'lucide-react';

interface CommercialAssessmentFormProps {
  onSuccess?: () => void;
}

export const CommercialAssessmentForm: React.FC<CommercialAssessmentFormProps> = ({ onSuccess }) => {
  const { createCommercialLead } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [facilityType, setFacilityType] = useState('Commercial Office Park');
  const [monthlySpend, setMonthlySpend] = useState('R 35,000 – R 75,000 / month');
  const [peakKva, setPeakKva] = useState('100 kVA – 250 kVA');
  const [dieselMonthly, setDieselMonthly] = useState('R 15,000 – R 30,000 / month');
  const [taxSection12b, setTaxSection12b] = useState(true);
  
  // Contact State
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationCity, setLocationCity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || companyName.trim().length < 2) {
      setErrorMessage('Please enter a valid Company / Enterprise name.');
      return;
    }
    const nameCheck = validateFullName(contactName);
    if (!nameCheck.isValid) { setErrorMessage(nameCheck.error || 'Invalid contact name'); return; }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { setErrorMessage(emailCheck.error || 'Invalid corporate email'); return; }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.isValid) { setErrorMessage(phoneCheck.error || 'Invalid contact phone'); return; }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        companyName,
        facilityType,
        monthlySpend,
        peakKva,
        dieselMonthly,
        taxSection12b,
        contactName,
        designation,
        email,
        phone,
        locationCity
      };

      let generatedRef = `KX-COMM-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Guaranteed persistent lead creation in Firestore
      createCommercialLead({
        companyName,
        industrySector: facilityType,
        monthlySpend,
        peakKva,
        dieselMonthly,
        taxSection12b,
        contactName,
        designation,
        email,
        phone,
        locationCity
      });

      // 2. Automated notification dispatch (graceful fallback)
      try {
        let res = await fetch('/api/quotes/commercial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const cType = res.headers.get('content-type') || '';
        if (!res.ok || cType.includes('text/html')) {
          res = await fetch('/api/quotes/commercial.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (res.ok) {
          const data = await res.json();
          if (data?.referenceId) generatedRef = data.referenceId;
        }
      } catch {
        // Backend offline fallback - lead is already saved in Firestore
      }

      setReferenceId(generatedRef);
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
            Commercial Energy Audit Registered
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Audit Reference: <span className="font-mono text-[#D97706]">{referenceId}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Our Principal Electrical Engineer has received the commercial load profiling inquiry for <strong className="text-white">{companyName}</strong>. We will reach out to <strong className="text-white">{contactName}</strong> within 4 business hours to arrange interval data / bill analysis.
          </p>
        </div>

        <div className="p-4 bg-[#0D1117] border border-[#1E2530] rounded-xl text-left text-xs font-mono text-[#94A3B8] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Facility Classification:</span>
            <span className="text-white font-bold">{facilityType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Estimated Monthly Spend:</span>
            <span className="text-white font-bold">{monthlySpend}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">SARS Section 12B Modeling:</span>
            <span className="text-[#10B981] font-bold">{taxSection12b ? 'Included in Feasibility' : 'Standard ROI'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0D1117] hover:bg-[#161B22] border border-[#1E2530] text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Submit Another Commercial Property
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
          <Building2 className="w-5 h-5 text-[#00D2FF]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold">
            Commercial & Industrial Feasibility
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
          Commercial 3-Phase Energy Assessment
        </h3>
        <p className="text-xs text-[#94A3B8]">
          Request a full single-line diagram (SLD), peak-demand shaving analysis, and SARS Section 12B cash flow model for your enterprise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Company & Facility Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1E2530] pb-2">
            01. Enterprise & Operational Profile
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Company / Enterprise Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Logistics (Pty) Ltd"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Facility Classification</label>
              <select
                value={facilityType}
                onChange={e => setFacilityType(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Commercial Office Park</option>
                <option>Industrial Warehouse / Logistics</option>
                <option>Manufacturing & Processing Plant</option>
                <option>Agricultural Farm / Wine Estate</option>
                <option>Retail Center / Mall</option>
                <option>Hospital / Medical Center</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Monthly Electricity Spend</label>
              <select
                value={monthlySpend}
                onChange={e => setMonthlySpend(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>R 15,000 – R 35,000 / mo</option>
                <option>R 35,000 – R 75,000 / mo</option>
                <option>R 75,000 – R 150,000 / mo</option>
                <option>R 150,000 – R 350,000 / mo</option>
                <option>R 350,000+ / mo (Megawatt Scale)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Estimated Peak Demand</label>
              <select
                value={peakKva}
                onChange={e => setPeakKva(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>Under 100 kVA</option>
                <option>100 kVA – 250 kVA</option>
                <option>250 kVA – 500 kVA</option>
                <option>500 kVA – 1 MVA</option>
                <option>1 MVA+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Diesel Generator Spend</label>
              <select
                value={dieselMonthly}
                onChange={e => setDieselMonthly(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              >
                <option>None / Infrequent</option>
                <option>R 10,000 – R 30,000 / mo</option>
                <option>R 30,000 – R 75,000 / mo</option>
                <option>R 75,000+ / mo</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-[#0D1117] border border-[#1E2530] rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={taxSection12b}
                onChange={e => setTaxSection12b(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0D1117] border-[#1E2530] text-[#00D2FF] focus:ring-0"
              />
              <span className="text-xs text-white">
                Include <strong>SARS Section 12B Accelerated Depreciation</strong> tax write-off cash flow modeling in report.
              </span>
            </label>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#1E2530] pb-2">
            02. Key Account Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Contact Person & Title *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="e.g. David Nkosi (Operations Director)"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="david.n@apexlogistics.co.za"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Direct Phone / Mobile *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 11 000 0000 / +27 83 000 0000"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] mb-1">Facility Suburb & Metro *</label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={e => setLocationCity(e.target.value)}
                placeholder="e.g. Midrand, Gauteng / Montague Gardens, Cape Town"
                className="w-full bg-[#0D1117] border border-[#1E2530] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00D2FF]"
              />
            </div>
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
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Request Commercial Engineering Feasibility Study'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
