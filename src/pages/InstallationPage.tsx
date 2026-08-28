import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Activity, 
  ArrowRight, 
  Cpu, 
  Calendar,
  X,
  Check
} from 'lucide-react';
import { InstallationBookingForm } from '../components/forms/InstallationBookingForm';

export const InstallationPage: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Digital Audit & Sizing',
      subtitle: 'Single Line Diagram (SLD) CAD design and load calculation.',
      desc: 'Our engineers audit your property’s single-phase or three-phase distribution board, roof orientation, and peak kilowatt draw.'
    },
    {
      num: '02',
      title: 'QA Bench-Testing (1000V DC)',
      subtitle: 'Sandton Central hub isolation and firmware flash.',
      desc: 'Hardware is verified under high thermal load. Inverter firmware is matched to battery BMS protocol for zero telemetry error.'
    },
    {
      num: '03',
      title: 'DoL Certified On-Site Setup',
      subtitle: 'Master electrician DB re-wiring and DC protection fuses.',
      desc: 'Clean, trunked installation with high-grade DC surge arrestors, manual bypass switch, and dedicated battery breaker.'
    },
    {
      num: '04',
      title: 'SANS 10142-1-2 CoC Sign-Off',
      subtitle: 'Official Certificate of Compliance and municipal SSEG registration.',
      desc: 'Issuance of legal compliance certificate protecting your home insurance and unlocking Eskom grid-tie feedback tariffs.'
    }
  ];

  return (
    <div className="space-y-24 text-white font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* 1. Starlink-Style Cinematic Header */}
      <section className="relative min-h-[500px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/electrician-wiring-db.jpg"
            alt="Master electrician wiring solar distribution board"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full space-y-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Department of Labour Accredited
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Certified installation standards.
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Every Kinetix solar and battery system is installed exclusively by registered Master Electricians under SANS 10142-1-2 protocols with full municipal SSEG sign-off.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <button
              onClick={() => setShowBookingForm(true)}
              className="px-6 py-3.5 bg-white text-black font-bold uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-2"
            >
              <span>Schedule On-Site Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4-Phase Installation Pipeline */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Quality Assurance Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            The 4-Stage Commissioning Standard
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            We do not use sub-contracted uncertified installers. Full accountability from CAD single line diagram to final municipal CoC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/40 rounded-2xl space-y-4 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-[#00D2FF]">{step.num}</span>
                <ShieldCheck className="w-4 h-4 text-[#64748B] group-hover:text-[#00D2FF] transition-colors" />
              </div>
              <div className="space-y-1">
                <strong className="text-sm font-bold text-white block">{step.title}</strong>
                <span className="text-[10px] text-[#00D2FF] block leading-tight">{step.subtitle}</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#131822] border border-[#1E2530] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <InstallationBookingForm onSuccess={() => setTimeout(() => setShowBookingForm(false), 4000)} />
          </div>
        </div>
      )}

    </div>
  );
};
