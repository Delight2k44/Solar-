import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Target, 
  Eye, 
  Wrench, 
  ArrowRight, 
  Sun, 
  Layers, 
  CheckCircle2, 
  Users, 
  Zap, 
  Award,
  Phone
} from 'lucide-react';
import { PartnerPlaceholderGrid } from '../components/common/PlaceholderBadge';

interface AboutPageProps {
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentRoute, openConfigurator }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CREW PHOTOGRAPH */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#10B981] font-bold">
              About Kinetix Energy Technologies
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
            Smarter Energy. <span className="text-[#10B981]">Built for Real Life.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#9EADA5] leading-relaxed">
            South Africa's premier solar engineering & hardware team. We engineer, install, and support certified solar and battery systems designed for lasting energy independence.
          </p>
        </div>

        {/* Featured Crew Photo */}
        <div className="relative rounded-2xl overflow-hidden border border-[#24302A] shadow-2xl bg-[#0E1311] group">
          <img
            src="/kinetix-team-crew.jpg"
            alt="Kinetix Energy Certified Installation Crew and Solar Service Fleet"
            className="w-full h-auto max-h-[580px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1311] via-transparent to-transparent opacity-80 pointer-events-none"></div>
          
          {/* Overlay Badges */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="bg-[#0E1311]/90 backdrop-blur-md border border-[#286D58] px-4 py-2 rounded-xl text-xs text-white flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Department of Labour Registered Electricians & Master Installers</span>
            </div>
            <div className="bg-[#1B4D3E]/90 backdrop-blur-md border border-[#10B981]/40 px-3.5 py-2 rounded-xl text-xs font-bold text-white uppercase flex items-center gap-1.5 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
              <span>SANS 10142-1-2 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KEY STATS / PROOF POINTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-white">500+</div>
          <div className="text-[11px] text-[#10B981] font-bold uppercase">Turnkey Installs</div>
          <div className="text-[10px] text-[#6B7B73]">Residential & Commercial</div>
        </div>

        <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
          <div className="text-[10px] text-[#10B981] font-bold uppercase">DoL Certified</div>
          <div className="text-[10px] text-[#6B7B73]">Wireman's Licensed</div>
        </div>

        <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-white">10-Year</div>
          <div className="text-[11px] text-[#10B981] font-bold uppercase">Battery Warranty</div>
          <div className="text-[10px] text-[#6B7B73]">Tier-1 LiFePO4 Storage</div>
        </div>

        <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-white">24/7</div>
          <div className="text-[11px] text-[#10B981] font-bold uppercase">Cloud Telemetry</div>
          <div className="text-[10px] text-[#6B7B73]">Real-time monitoring</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FOUR CORE PRINCIPLES (CONCISE & PUNCHY) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="border-b border-[#24302A] pb-3 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Our Engineering Principles
          </h2>
          <span className="text-[11px] font-mono text-[#10B981]">Built Without Compromise</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-3 hover:border-[#286D58] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Smart Technology
            </h3>
            <p className="text-xs text-[#9EADA5] leading-relaxed">
              Cloud telemetry, mobile monitoring, and precision load profiling for complete control.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-3 hover:border-[#286D58] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Custom Sizing
            </h3>
            <p className="text-xs text-[#9EADA5] leading-relaxed">
              Engineered around your actual peak load curves and solar yield—no cookie-cutter setups.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-3 hover:border-[#286D58] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              100% Transparency
            </h3>
            <p className="text-xs text-[#9EADA5] leading-relaxed">
              Clear itemized bills of materials, honest yield figures, and zero hidden handover fees.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-3 hover:border-[#286D58] transition-colors">
            <div className="w-9 h-9 rounded-lg bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Lifetime Support
            </h3>
            <p className="text-xs text-[#9EADA5] leading-relaxed">
              Annual SANS 10142 audits, preventative de-soiling, and factory warranty management.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CERTIFICATIONS & COMPLIANCE */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Accreditations & Tier-1 Partners
          </h2>
          <span className="text-xs font-mono text-[#9EADA5]">SABS • SSEG • DoL Certified</span>
        </div>

        <PartnerPlaceholderGrid />
      </div>

      {/* ========================================================================= */}
      {/* 5. CALL TO ACTION */}
      {/* ========================================================================= */}
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            Ready to power your property?
          </h3>
          <p className="text-xs sm:text-sm text-[#9EADA5] max-w-lg mx-auto">
            Configure your custom system online or speak directly with our certified solar engineers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openConfigurator}
            className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-lg"
          >
            <span>Build Solar System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentRoute('contact')}
            className="px-6 py-3.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] hover:border-[#31423A] text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Speak with an Engineer</span>
          </button>
        </div>
      </div>

    </div>
  );
};
