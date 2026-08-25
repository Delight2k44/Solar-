import React, { useState } from 'react';
import { MAINTENANCE_PACKAGES } from '../data/mockData';
import { MaintenancePackage } from '../types';
import { 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  HelpCircle,
  Activity,
  AlertCircle
} from 'lucide-react';
import { MaintenanceRequestForm } from '../components/forms/MaintenanceRequestForm';

export const MaintenancePage: React.FC = () => {
  const [selectedTierName, setSelectedTierName] = useState<string>('Performance SLA (Quarterly)');

  const handleSelectTier = (tierName: string) => {
    setSelectedTierName(tierName);
    const formElement = document.getElementById('maintenance-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
            Asset Lifecycle & Diagnostics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Your solar system is an investment. Keep it performing.
          </h1>
          <p className="text-sm text-[#9EADA5] leading-relaxed">
            Our maintenance services help customers monitor system performance, identify issues and keep equipment operating as expected. SABS-compliant electrical inspections, string testing, and thermal scans.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[#9EADA5] pt-2">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> De-Ionized Panel Wash
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-[#286D58]" /> Infrared Hotspot Thermal Audit
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/solar-maintenance-cleaning.jpg"
              alt="Professional solar panel de-soiling and cleaning"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] font-mono text-white">
              De-Soiling & Hydro-Wash
            </span>
          </div>
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/cad-solar-audit.jpg"
              alt="Solar energy telemetry and diagnostics"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] font-mono text-white">
              Telemetry String Diagnostics
            </span>
          </div>
        </div>
      </div>

      {/* 3 Maintenance Packages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#24302A] pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Available Service & Preventative Care Tiers
          </h2>
          <span className="text-[10px] font-mono text-[#6B7B73]">
            Verified SLAs • SANS 10142 Audits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MAINTENANCE_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className="p-6 sm:p-8 rounded-xl border flex flex-col justify-between space-y-6 transition-all bg-[#141A17] border-[#24302A] hover:border-[#31423A]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold bg-[#0E1311] px-2.5 py-1 rounded border border-[#1B2420]">
                    {pkg.tier} Tier
                  </span>
                  <span className="text-[10px] font-mono text-[#9EADA5] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#286D58]" /> {pkg.slaResponse}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{pkg.name}</h3>
                  <p className="text-xs text-[#9EADA5] mt-1 leading-relaxed">{pkg.tagline}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1B2420]">
                  <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Package Inclusions:</span>
                  <ul className="space-y-1.5 text-xs text-[#9EADA5]">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#286D58] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTier(`${pkg.name} (${pkg.tier})`)}
                className="w-full py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider bg-[#1B4D3E] hover:bg-[#286D58] text-white transition-colors"
              >
                Select & Book This Package
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Maintenance Booking Form */}
      <div id="maintenance-form-section">
        <MaintenanceRequestForm selectedTier={selectedTierName} />
      </div>
    </div>
  );
};
