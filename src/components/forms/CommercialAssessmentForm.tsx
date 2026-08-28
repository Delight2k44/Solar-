import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  FileSpreadsheet,
  Clock
} from 'lucide-react';

interface CommercialAssessmentFormProps {
  onSuccess?: () => void;
}

export const CommercialAssessmentForm: React.FC<CommercialAssessmentFormProps> = ({ onSuccess }) => {
  const { createCommercialLead } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = createCommercialLead({
      companyName: companyName || 'Commercial Client',
      industrySector: facilityType,
      monthlySpend: monthlySpend,
      peakKva: peakKva,
      dieselMonthly: dieselMonthly,
      taxSection12b: taxSection12b,
      contactName: contactName || 'Authorized Contact',
      designation: designation || 'Executive',
      email: email || 'commercial@client.co.za',
      phone: phone || '+27 11 000 0000',
      locationCity: locationCity || 'Gauteng'
    });
    setReferenceId(generatedRef);
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
            Commercial Energy Audit Registered
          </span>
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Audit Reference: <span className="font-mono text-[#D97706]">{referenceId}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9EADA5] max-w-md mx-auto leading-relaxed">
            Our Principal Electrical Engineer has received the commercial load profiling inquiry for <strong className="text-white">{companyName}</strong>. We will reach out to <strong className="text-white">{contactName}</strong> within 4 business hours to arrange interval data / bill analysis.
          </p>
        </div>

        <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl text-left text-xs font-mono text-[#9EADA5] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">Facility Classification:</span>
            <span className="text-white font-bold">{facilityType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">Estimated Monthly Spend:</span>
            <span className="text-white font-bold">{monthlySpend}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7B73]">SARS Section 12B Modeling:</span>
            <span className="text-[#10B981] font-bold">{taxSection12b ? 'Included in Feasibility' : 'Standard ROI'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase tracking-wider rounded transition-colors"
          >
            Submit Another Commercial Property
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
          <Building2 className="w-5 h-5 text-[#286D58]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
            Commercial & Industrial Feasibility
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
          Commercial 3-Phase Energy Assessment
        </h3>
        <p className="text-xs text-[#9EADA5]">
          Request a full single-line diagram (SLD), peak-demand shaving analysis, and SARS Section 12B cash flow model for your enterprise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Company & Facility Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
            01. Enterprise & Operational Profile
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Company / Enterprise Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Logistics (Pty) Ltd"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Facility Classification</label>
              <select
                value={facilityType}
                onChange={e => setFacilityType(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
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
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Monthly Electricity Spend</label>
              <select
                value={monthlySpend}
                onChange={e => setMonthlySpend(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>R 15,000 – R 35,000 / mo</option>
                <option>R 35,000 – R 75,000 / mo</option>
                <option>R 75,000 – R 150,000 / mo</option>
                <option>R 150,000 – R 350,000 / mo</option>
                <option>R 350,000+ / mo (Megawatt Scale)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Estimated Peak Demand</label>
              <select
                value={peakKva}
                onChange={e => setPeakKva(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>Under 100 kVA</option>
                <option>100 kVA – 250 kVA</option>
                <option>250 kVA – 500 kVA</option>
                <option>500 kVA – 1 MVA</option>
                <option>1 MVA+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Diesel Generator Spend</label>
              <select
                value={dieselMonthly}
                onChange={e => setDieselMonthly(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                <option>None / Infrequent</option>
                <option>R 10,000 – R 30,000 / mo</option>
                <option>R 30,000 – R 75,000 / mo</option>
                <option>R 75,000+ / mo</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-[#0E1311] border border-[#24302A] rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={taxSection12b}
                onChange={e => setTaxSection12b(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141A17] border-[#24302A] text-[#286D58] focus:ring-0"
              />
              <span className="text-xs text-white">
                Include <strong>SARS Section 12B Accelerated Depreciation</strong> tax write-off cash flow modeling in report.
              </span>
            </label>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
            02. Key Account Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Contact Person & Title *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="e.g. David Nkosi (Operations Director)"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="david.n@apexlogistics.co.za"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Direct Phone / Mobile *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 11 000 0000 / +27 83 000 0000"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Facility Suburb & Metro *</label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={e => setLocationCity(e.target.value)}
                placeholder="e.g. Midrand, Gauteng / Montague Gardens, Cape Town"
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Request Commercial Engineering Feasibility Study</span>
          </button>
        </div>
      </form>
    </div>
  );
};
