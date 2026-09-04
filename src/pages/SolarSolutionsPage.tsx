import React, { useState } from 'react';
import { 
  ArrowRight, 
  X,
  Check
} from 'lucide-react';
import { CommercialAssessmentForm } from '../components/forms/CommercialAssessmentForm';
import { SolarQuoteForm } from '../components/forms/SolarQuoteForm';

interface SolarSolutionsPageProps {
  openConfigurator: () => void;
  setCurrentRoute: (route: string) => void;
}

export const SolarSolutionsPage: React.FC<SolarSolutionsPageProps> = ({ 
  openConfigurator,
  setCurrentRoute 
}) => {
  const [showCommercialForm, setShowCommercialForm] = useState(false);
  const [showResidentialForm, setShowResidentialForm] = useState(false);

  const turnkeyKits = [
    {
      name: 'Essential 5kW Hybrid Kit',
      subtitle: 'Townhouses & Medium Residential',
      capacity: '5kW Inverter • 5.12kWh Battery • 3.3kWp Solar',
      priceZAR: 'R 62,500',
      monthlyZAR: 'R 2,450 /mo',
      specs: [
        'Sunsynk / Deye 5kW Parity Hybrid Inverter',
        'Dyness / Freedom Won 5.12kWh LiFePO4 Battery',
        '6x 550W Tier-1 Mono-PERC Solar Panels',
        '< 20ms Seamless UPS Grid Switchover',
        'Pre-wired AC/DC Protection DB Box',
        'SANS 10142-1-2 CoC Certified Installation'
      ],
      idealFor: 'TV, WiFi, Lights, Fridge, Computers, Home Office',
      popular: false
    },
    {
      name: 'Executive 8kW Hybrid Kit',
      subtitle: 'Standard 3-4 Bedroom Family Homes',
      capacity: '8kW Inverter • 10.24kWh Battery • 5.5kWp Solar',
      priceZAR: 'R 99,931',
      monthlyZAR: 'R 3,890 /mo',
      specs: [
        'Deye 8kW High-Yield Hybrid Inverter',
        '2x 5.12kWh Freedom Won eTower Modules (10.24kWh)',
        '10x 550W Canadian Solar Tier-1 Panels',
        'Automated Smart Geyser & Pool Pump Relays',
        'Full 48V DC Surge & Lightning Arrestors',
        'Municipal SSEG Grid-Tied Application Included'
      ],
      idealFor: 'Full Home + Air Conditioning, Borehole, Microwave, Entertainment',
      popular: true
    },
    {
      name: 'Off-Grid 12kW 3-Phase Kit',
      subtitle: 'Luxury Estates & Commercial Operations',
      capacity: '12kW Inverter • 15.36kWh Battery • 8.8kWp Solar',
      priceZAR: 'R 158,000',
      monthlyZAR: 'R 6,150 /mo',
      specs: [
        'Deye 12kW 3-Phase Low-Voltage Hybrid Inverter',
        '3x 5.12kWh Dyness LiFePO4 Power Towers (15.36kWh)',
        '16x 550W JA Solar High-Efficiency Modules',
        'Industrial 1000V DC Isolators & Fuses',
        'Generator Auto-Start (ATS) Interface',
        '24/7 VIP Engineering Telemetry SLA'
      ],
      idealFor: 'Complete Off-Grid Capability + Heavy Machinery & Workshops',
      popular: false
    }
  ];

  return (
    <div className="space-y-24 text-white font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* 1. Starlink-Style Cinematic Header */}
      <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-solar-home.jpg"
            alt="Rooftop solar solutions across South Africa"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full space-y-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Architectures & Turnkey Systems
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Engineered for South African power.
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Pre-matched, certified solar kits engineered for seamless &lt;20ms load shedding resilience, zero flickering, and lifetime municipal compliance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <button
              onClick={openConfigurator}
              className="px-6 py-3.5 bg-white text-black font-bold uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-2"
            >
              <span>Calculate Sizing for Your Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCommercialForm(true)}
              className="px-6 py-3.5 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white font-semibold uppercase rounded-xl transition-all"
            >
              <span>Commercial 50kW+ Inquiry</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Turnkey Systems Lineup (Starlink Hardware Cards) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Standard Configurations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Turnkey Residential Kits
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Pre-fused, pre-programmed, and fully compliant with SANS 10142-1-2 standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {turnkeyKits.map((kit, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between space-y-8 transition-all relative ${
                kit.popular
                  ? 'bg-[#0D1117] border-2 border-[#00D2FF] shadow-[0_0_40px_rgba(0,210,255,0.15)] ring-1 ring-[#00D2FF]/50'
                  : 'bg-[#0D1117]/80 border border-[#1E2530] hover:border-white/20'
              }`}
            >
              {kit.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00D2FF] text-black font-mono font-extrabold text-[10px] uppercase rounded-full tracking-wider shadow-lg">
                  Most Popular Home Choice
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{kit.name}</h3>
                  <span className="text-xs text-[#94A3B8] font-mono block mt-0.5">{kit.subtitle}</span>
                  <span className="text-xs text-[#00D2FF] font-mono font-bold block mt-2">{kit.capacity}</span>
                </div>

                <div className="pt-2 border-t border-[#1E2530]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-white">{kit.priceZAR}</span>
                    <span className="text-xs text-[#64748B] font-mono">incl. VAT</span>
                  </div>
                  <span className="text-xs font-mono text-[#94A3B8] block mt-1">or <strong className="text-white">{kit.monthlyZAR}</strong></span>
                </div>

                <div className="space-y-2.5 pt-2 text-xs font-mono">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Included Hardware & Specs:</span>
                  {kit.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5 text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#1E2530]">
                <div className="p-3 bg-[#05070A] border border-[#1E2530] rounded-xl text-[11px] font-mono text-[#94A3B8]">
                  <strong className="text-white block mb-0.5">Powers:</strong>
                  {kit.idealFor}
                </div>

                <button
                  onClick={() => setShowResidentialForm(true)}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                    kit.popular
                      ? 'bg-[#00D2FF] hover:bg-[#38BDF8] text-black shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <span>Request Turnkey Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Commercial Microgrids Slide */}
      <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center overflow-hidden border-y border-[#1E2530]">
        <div className="absolute inset-0 z-0">
          <img
            src="/commercial-solar-sa.jpg"
            alt="Commercial solar microgrid on warehouse roof in South Africa"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/80 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full">
          <div className="max-w-xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Commercial & Industrial Scale
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              50kW+ Commercial Solar & Section 12B.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Slash industrial electricity tariffs, protect production schedules, and leverage 125% Section 12B tax deductions in Year 1. We deliver turnkey three-phase microgrids with remote SCADA monitoring.
            </p>
            <button
              onClick={() => setShowCommercialForm(true)}
              className="px-6 py-3.5 bg-white text-black hover:bg-neutral-200 font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-xl flex items-center gap-2"
            >
              <span>Book Commercial Load Profile Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showCommercialForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowCommercialForm(false)}
              aria-label="Close commercial feasibility form"
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#131822] border border-[#1E2530] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CommercialAssessmentForm onSuccess={() => setTimeout(() => setShowCommercialForm(false), 4000)} />
          </div>
        </div>
      )}

      {showResidentialForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowResidentialForm(false)}
              aria-label="Close residential quote form"
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#131822] border border-[#1E2530] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SolarQuoteForm onSuccess={() => setTimeout(() => setShowResidentialForm(false), 4000)} />
          </div>
        </div>
      )}

    </div>
  );
};
