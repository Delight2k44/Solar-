import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  X, 
  Phone, 
  Check
} from 'lucide-react';
import { CommercialAssessmentForm } from '../components/forms/CommercialAssessmentForm';

interface BusinessPageProps {
  openConfigurator?: () => void;
  setCurrentRoute?: (route: string) => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ openConfigurator, setCurrentRoute }) => {
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [monthlySpendZAR, setMonthlySpendZAR] = useState(65000);

  // Section 12B & Savings calculation
  const estimatedAnnualSpend = monthlySpendZAR * 12;
  const estimatedSolarCapex = Math.round(monthlySpendZAR * 14.5);
  const section12bTaxDeduction = Math.round(estimatedSolarCapex * 1.25);
  const corporateTaxSavings = Math.round(section12bTaxDeduction * 0.27);
  const estimatedPaybackYears = (estimatedSolarCapex / (estimatedAnnualSpend * 0.72)).toFixed(1);

  const commercialTiers = [
    {
      name: '50kW Commercial Array',
      subtitle: 'Office Parks, Retail Centers & Warehouses',
      capacity: '50kW 3-Phase Inverters • 60kWh LiFePO4 Storage • 66kWp PV',
      specs: [
        'Dual 25kW / 50kW Deye/Sunsynk 3-Phase Synchronized Inverters',
        'High-Voltage 60kWh LiFePO4 Rack-Mount Storage',
        '120x 550W Tier-1 Mono-PERC High-Density Panels',
        'Automated Peak Demand Shaving (Reduce Eskom kVA Charges)',
        'Class-1 Remote SCADA Energy Dashboard',
        'Full Municipal SSEG Grid-Tie Approval & SANS CoC'
      ],
      idealFor: 'Light manufacturing, medical centres, shopping complexes, cold logistics'
    },
    {
      name: '150kW Industrial Microgrid',
      subtitle: 'Heavy Manufacturing, Agriculture & Cold Storage',
      capacity: '150kW 3-Phase Array • 180kWh Storage • 200kWp PV',
      specs: [
        'Cluster Architecture (Multi-Inverter Paralleling with Redundancy)',
        'Containerized 180kWh LiFePO4 Thermal-Controlled Battery Bank',
        '360x 550W High-Efficiency Anti-PID Panels',
        'Smart Generator Auto-Start (ATS) with 75% Diesel Displacement',
        'Real-Time Harmonic Filtering & Power Factor Correction',
        '24/7 Dedicated SCADA Telemetry & 2-Hour Response SLA'
      ],
      idealFor: 'Packhouses, factories, industrial plants, mining offices'
    },
    {
      name: '500kW+ Utility Microgrid',
      subtitle: 'Large Logistics Hubs, Estates & Agro-Processing',
      capacity: '500kW+ Modular Inverters • Custom MWh BESS Storage • MegaWatt PV',
      specs: [
        'High-Voltage Megawatt-Scale Battery Energy Storage (BESS)',
        'Custom Rooftop, Carport & Ground-Mount Engineering',
        'Direct Medium-Voltage (11kV / 22kV) Substation Integration',
        'Full PPA (Power Purchase Agreement) & CapEx Financing Options',
        'Turnkey EPC (Engineering, Procurement, Construction) Delivery',
        'Guaranteed Annual Kilowatt-Hour Yield Performance Warranty'
      ],
      idealFor: 'Distribution centres, food processing plants, private estates, solar farms'
    }
  ];

  return (
    <div className="space-y-24 text-white font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[660px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/commercial-solar-sa.jpg"
            alt="Large commercial solar microgrid installation on industrial warehouse in South Africa"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/80 sm:to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/30 lg:hidden" />
          <div className="absolute inset-0 subtle-grid opacity-10 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 relative z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-mono tracking-widest text-[#00D2FF] font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial & Industrial Energy Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
              Zero downtime. Controlled energy costs.
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Engineered for South African commercial facilities, factories, and agricultural operations. Eliminate load shedding losses, slash Eskom maximum demand penalties, and maximize <strong>125% Section 12B tax deductions</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 font-mono text-xs">
              <button
                onClick={() => setShowAssessmentModal(true)}
                className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Request Commercial Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+27118004500"
                className="px-8 py-4 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white font-semibold uppercase rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#00D2FF]" />
                <span>Call Commercial Desk</span>
              </a>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs font-mono text-[#94A3B8] flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                Section 12B SARS Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
                3-Phase Seamless Synchronisation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Section 12B Tax Calculator */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="bg-[#0D1117] border border-[#1E2530] rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E2530] pb-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
                SARS Incentive Modeling
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Section 12B Tax Deduction Calculator
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
                Under South African Tax legislation, qualifying commercial solar installations receive an immediate <strong>125% upfront tax deduction</strong> in Year 1.
              </p>
            </div>

            <span className="px-3 py-1 bg-[#00D2FF]/15 border border-[#00D2FF]/40 text-[#00D2FF] text-xs font-mono font-bold rounded-lg self-start md:self-auto">
              Corporate Tax Rate: 27%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-mono">
            {/* Left: Interactive Input Slider */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#94A3B8] uppercase">Monthly Electricity Bill (ZAR):</span>
                  <strong className="text-white text-base">R {monthlySpendZAR.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  aria-label="Monthly Electricity Bill in ZAR"
                  min="20000"
                  max="500000"
                  step="5000"
                  value={monthlySpendZAR}
                  onChange={(e) => setMonthlySpendZAR(Number(e.target.value))}
                  className="w-full h-2 bg-[#05070A] rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B] mt-1">
                  <span>R 20,000 /mo</span>
                  <span>R 250,000 /mo</span>
                  <span>R 500,000+ /mo</span>
                </div>
              </div>

              <div className="p-4 bg-[#05070A] border border-[#1E2530] rounded-2xl text-xs space-y-2 text-[#94A3B8]">
                <strong className="text-white block">Key Business Impact:</strong>
                <p>
                  Transitioning to high-efficiency solar replaces peak daytime tariff units and shields business operations against Stage 6 load shedding outages.
                </p>
              </div>
            </div>

            {/* Right: Real-time Output Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#05070A] border border-[#1E2530] rounded-2xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">125% Section 12B Write-Off</span>
                <span className="text-2xl font-extrabold text-[#00D2FF] block">
                  R {section12bTaxDeduction.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#94A3B8]">First-year taxable allowance</span>
              </div>

              <div className="p-5 bg-[#05070A] border border-[#1E2530] rounded-2xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Direct Cash Tax Saved</span>
                <span className="text-2xl font-extrabold text-emerald-400 block">
                  R {corporateTaxSavings.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#94A3B8]">At 27% corporate income tax</span>
              </div>

              <div className="p-5 bg-[#05070A] border border-[#1E2530] rounded-2xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Estimated Payback Period</span>
                <span className="text-2xl font-extrabold text-white block">
                  {estimatedPaybackYears} Years
                </span>
                <span className="text-[10px] text-[#94A3B8]">Accelerated ROI with incentives</span>
              </div>

              <div className="p-5 bg-[#05070A] border border-[#1E2530] rounded-2xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">25-Year Energy Savings</span>
                <span className="text-2xl font-extrabold text-[#00D2FF] block">
                  R {(estimatedAnnualSpend * 16).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#94A3B8]">Hedge against Eskom tariff hikes</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setShowAssessmentModal(true)}
              className="px-6 py-3.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <span>Download Formal Section 12B Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Commercial System Tiers Lineup */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Industrial Architectures
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pre-Engineered Commercial Microgrids
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Modular, scalable three-phase systems designed for harsh electrical environments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {commercialTiers.map((tier, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-[#0D1117] border border-[#1E2530] hover:border-white/20 flex flex-col justify-between space-y-8 transition-all relative"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                  <span className="text-xs text-[#94A3B8] font-mono block mt-0.5">{tier.subtitle}</span>
                  <span className="text-xs text-[#00D2FF] font-mono font-bold block mt-2">{tier.capacity}</span>
                </div>

                <div className="space-y-2.5 pt-2 text-xs font-mono border-t border-[#1E2530]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Engineering Specifications:</span>
                  {tier.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5 text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#1E2530]">
                <div className="p-3 bg-[#05070A] border border-[#1E2530] rounded-xl text-[11px] font-mono text-[#94A3B8]">
                  <strong className="text-white block mb-0.5">Ideal Deployment:</strong>
                  {tier.idealFor}
                </div>

                <button
                  onClick={() => setShowAssessmentModal(true)}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Engineering Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Commercial Assessment Form Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowAssessmentModal(false)}
              aria-label="Close commercial assessment modal"
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#131822] border border-[#1E2530] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CommercialAssessmentForm onSuccess={() => setTimeout(() => setShowAssessmentModal(false), 4000)} />
          </div>
        </div>
      )}

    </div>
  );
};
