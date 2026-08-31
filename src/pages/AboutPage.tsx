import React from 'react';
import { ShieldCheck, Zap, Wrench, Users, Activity, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  setCurrentRoute?: (route: string) => void;
  openConfigurator?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentRoute }) => {
  return (
    <div className="space-y-24 text-white font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* 1. Header */}
      <section className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/kinetix-team-crew.jpg"
            alt="Kinetix Energy Engineering Crew"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/80 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full space-y-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              South African Solar Engineering
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Engineered with zero compromise.
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Founded in Sandton, Gauteng, Kinetix Energy delivers high-performance renewable technology designed to survive the harsh electrical and thermal conditions of the Southern African power grid.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Values / Engineering Standards */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#00D2FF]" />
            <strong className="text-base font-bold text-white block">SANS 10142-1-2 Compliance</strong>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Every system is legally certified with a South African Certificate of Compliance, protecting your property insurance and municipal rights.
            </p>
          </div>

          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-3">
            <Wrench className="w-6 h-6 text-[#00D2FF]" />
            <strong className="text-base font-bold text-white block">Sandton QA Central Hub</strong>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Every inverter and battery unit is pre-fused and bench-tested under 1000V DC load in our testing facility before freight dispatch.
            </p>
          </div>

          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-3">
            <Activity className="w-6 h-6 text-[#00D2FF]" />
            <strong className="text-base font-bold text-white block">24/7 Telemetry SLA</strong>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Cloud-connected telemetry monitoring safeguards your battery health and ensures rapid technician dispatch whenever anomalies occur.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
