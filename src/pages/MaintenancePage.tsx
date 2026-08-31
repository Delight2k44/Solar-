import React, { useState } from 'react';
import { 
  Activity, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ArrowRight, 
  Phone, 
  Calendar,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  const plans = [
    {
      name: 'Essential Care',
      subtitle: 'Standard Residential Installations',
      priceZAR: 'R 450',
      period: '/ month',
      features: [
        'Annual Full System Electrical Health Audit',
        'Bi-Annual Solar Panel Hydro-Wash & Cleaning',
        'Firmware Updates & Inverter BMS Balancing',
        'Priority Phone Support & Diagnostics',
        '10% Discount on Add-on Battery Storage'
      ],
      recommended: false
    },
    {
      name: 'Performance SLA',
      subtitle: 'Executive Homes & High-Availability Sites',
      priceZAR: 'R 890',
      period: '/ month',
      features: [
        '24/7 Automated Cloud Telemetry & Alerting',
        '4-Hour Priority On-Site Technician Dispatch',
        'Bi-Annual In-Depth Thermal Infrared Imaging',
        'Comprehensive Storm & Surge Inspection',
        'Supplementary SANS 10142 CoC Re-Certification',
        'Free Inverter Loaner Unit during Repairs'
      ],
      recommended: true
    },
    {
      name: 'Enterprise Microgrid',
      subtitle: 'Commercial Facilities & 50kW+ Solar Arrays',
      priceZAR: 'R 2,450',
      period: '/ month',
      features: [
        'Dedicated Master Electrician Account Lead',
        'SCADA Remote Load Management & Peak Shaving',
        'Monthly On-Site Performance Optimization',
        'Guaranteed 2-Hour SLA Rapid Response',
        'Quarterly Executive Energy Yield Reports',
        'Direct Liaison with City Power / Eskom'
      ],
      recommended: false
    }
  ];

  return (
    <div className="space-y-24 text-white font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* 1. Header */}
      <section className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/solar-maintenance-cleaning.jpg"
            alt="Solar maintenance and cleaning"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/80 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full space-y-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Lifetime Reliability & SLA
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Service plans & 24/7 maintenance.
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Protect your solar yield and battery health. Preventative diagnostics, hydro-cleaning, and guaranteed rapid technician response across Gauteng and the Western Cape.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <a
              href="tel:+27118004500"
              className="px-6 py-3.5 bg-white text-black font-bold uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dispatch: 011 800 4500</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Service Plans Cards (Starlink Style) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Maintenance Tiers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transparent Service Level Agreements
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Cancel or upgrade your subscription anytime. Backed by certified Master Electricians.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between space-y-8 transition-all relative ${
                plan.recommended
                  ? 'bg-[#0D1117] border-2 border-[#00D2FF] shadow-[0_0_40px_rgba(0,210,255,0.15)] ring-1 ring-[#00D2FF]/50'
                  : 'bg-[#0D1117]/80 border border-[#1E2530] hover:border-white/20'
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00D2FF] text-black font-mono font-extrabold text-[10px] uppercase rounded-full tracking-wider shadow-lg">
                  Recommended SLA
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <span className="text-xs text-[#94A3B8] font-mono block mt-0.5">{plan.subtitle}</span>
                </div>

                <div className="pt-2 border-t border-[#1E2530]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold font-mono text-white">{plan.priceZAR}</span>
                    <span className="text-xs text-[#94A3B8] font-mono">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs font-mono">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert(`Enrolling in ${plan.name} SLA... A technical account manager will connect with you.`)}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  plan.recommended
                    ? 'bg-[#00D2FF] hover:bg-[#38BDF8] text-black shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <span>Select {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
