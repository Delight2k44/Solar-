import React from 'react';
import { ShieldCheck, Cpu, Target, Eye, Wrench, ArrowRight, Sun, Layers } from 'lucide-react';
import { PartnerPlaceholderGrid } from '../components/common/PlaceholderBadge';

interface AboutPageProps {
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentRoute, openConfigurator }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
          Company Mission & Engineering Principles
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
          Building a more practical future for energy.
        </h1>
        <p className="text-sm sm:text-base text-[#9EADA5] leading-relaxed">
          The company provides solar equipment, installation and maintenance services designed to help households and businesses make better energy decisions.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#24302A] pb-2">
          Our Four Operating Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Technology */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#286D58]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Technology
            </h3>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Using modern energy technologies and digital tools to simplify the customer experience. From cloud inverter telemetry to interactive CAD sizing models, we apply digital precision to physical electrical infrastructure.
            </p>
          </div>

          {/* Pillar 2: Practicality */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#286D58]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Practicality
            </h3>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Solutions are designed around actual energy requirements rather than one-size-fits-all packages. We calculate real-world load curves, night-time base loads, and solar irradiance to avoid over-promising and under-delivering.
            </p>
          </div>

          {/* Pillar 3: Transparency */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#286D58]">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Transparency
            </h3>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Customers should understand what they are buying, why it is recommended and what it will cost. We itemize every bill of materials, state estimated yields candidly, and clearly distinguish between estimates and certified electrical designs.
            </p>
          </div>

          {/* Pillar 4: Long-Term Support */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <div className="w-10 h-10 rounded bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#286D58]">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Long-Term Support
            </h3>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              The relationship does not end when installation is complete. We provide ongoing service level agreements, firmware management, warranty advocacy with Tier-1 manufacturers, and statutory re-inspections.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Governance */}
      <div className="space-y-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
            Certified Industry Compliance
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Standards & Certifications
          </h2>
        </div>

        <PartnerPlaceholderGrid />
      </div>

      {/* Action CTA */}
      <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-white uppercase">
          Ready to review your energy requirements?
        </h3>
        <p className="text-xs sm:text-sm text-[#9EADA5] max-w-xl mx-auto">
          Use our interactive configurator to model your property's solar requirements or speak directly with an energy engineering consultant.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={openConfigurator}
            className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
          >
            Build My Solar System
          </button>
          <button
            onClick={() => setCurrentRoute('contact')}
            className="px-6 py-3.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono font-semibold text-xs uppercase tracking-wider rounded transition-colors"
          >
            Contact Engineering Team
          </button>
        </div>
      </div>
    </div>
  );
};
