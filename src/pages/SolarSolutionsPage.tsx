import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  BatteryCharging, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { EstimateDisclaimer } from '../components/common/EstimateDisclaimer';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
          Custom Engineered Architectures
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          Engineered for South African Energy Realities.
        </h1>
        <p className="text-sm text-[#9EADA5] leading-relaxed">
          Whether you need load shedding resilience for your home, daytime operational offset for a commercial facility, or an upgrade to an existing solar array, our engineering team designs systems tailored to your specific single-phase or three-phase load profile.
        </p>
      </div>

      {/* Embedded Quote / Assessment Modals */}
      {showCommercialForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowCommercialForm(false)}
              className="absolute top-4 right-4 z-10 p-2 text-[#9EADA5] hover:text-white bg-[#141A17] border border-[#24302A] rounded-md transition-colors"
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
              className="absolute top-4 right-4 z-10 p-2 text-[#9EADA5] hover:text-white bg-[#141A17] border border-[#24302A] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SolarQuoteForm onSuccess={() => setTimeout(() => setShowResidentialForm(false), 4000)} />
          </div>
        </div>
      )}

      {/* Solutions Grid */}
      <div className="space-y-12">
        {/* 1. Residential Solar */}
        <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311] border border-[#24302A] rounded text-xs font-mono text-[#286D58] font-bold uppercase">
              <Home className="w-3.5 h-3.5" /> Residential Solar Solutions
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Greater Energy Independence for Households
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Designed for suburban homes, townhouses, and residential estates seeking to eliminate load shedding anxiety and permanently reduce escalating municipal electricity tariffs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Sub-4ms UPS Auto-Switching</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> SABS CoC Certified Compliance</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Quiet IP65 Wall-Mounted Inverters</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Smart Mobile App Monitoring</div>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setShowResidentialForm(true)}
                className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors"
              >
                <span>Request a Residential Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/hero-solar-home.jpg"
              alt="Residential solar installation luxury home"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Residential 8kW Hybrid Setup
            </span>
          </div>
        </div>

        {/* 2. Commercial Solar & Section 12B */}
        <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311] border border-[#24302A] rounded text-xs font-mono text-[#286D58] font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" /> Commercial & Industrial 3-Phase
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Operational Cost Reduction & Peak-Demand Shaving
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Three-phase grid-tied and hybrid architectures engineered for commercial office parks, retail centers, logistics warehouses, and agricultural operations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> SARS Section 12B Accelerated Depreciation</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 3-Phase Phase Balancing & KVA Control</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Generator Synchronization & Fuel Saving</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> High-Voltage Commercial Storage Rack</div>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setShowCommercialForm(true)}
                className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Request Commercial Assessment & Section 12B Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/commercial-solar-sa.jpg"
              alt="Commercial warehouse rooftop solar array"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Midrand 120kWp Commercial Array
            </span>
          </div>
        </div>

        {/* 3. Backup Power Systems */}
        <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311] border border-[#24302A] rounded text-xs font-mono text-[#286D58] font-bold uppercase">
              <Zap className="w-3.5 h-3.5" /> Inverter & Battery Backup Only
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Loadshedding Backup (Solar-Ready Architecture)
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Start with an intelligent hybrid inverter and high-capacity LiFePO4 battery bank to guarantee continuous power during outages. Add solar panels anytime in the future without changing inverters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Instantaneous Transfer Under 4ms</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Grid Fast-Charge Between Outages</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 10-Year Battery Warranty</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Fully Expandable with PV Panels</div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setShowResidentialForm(true)}
                className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors"
              >
                <span>Request a Backup Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/battery-inverter-room.jpg"
              alt="Clean battery storage power room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Turnkey Inverter & Battery Rack Room
            </span>
          </div>
        </div>

        {/* 4. Agricultural & Hybrid Microgrids */}
        <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311] border border-[#24302A] rounded text-xs font-mono text-[#286D58] font-bold uppercase">
              <Layers className="w-3.5 h-3.5" /> Agricultural & Vineyard Microgrids
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Off-Grid Agrivoltaics & Cold-Storage Resilience
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Engineered for South African wine farms, packhouses, irrigation pump stations, and cold storage facilities. Integrates ground-mount arrays with high-voltage battery storage to ensure 24/7 crop and harvest protection.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setShowCommercialForm(true)}
                className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors"
              >
                <span>Request an Agricultural Feasibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/solar-farm-agricultural.jpg"
              alt="Agricultural solar microgrid in Stellenbosch vineyard"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Stellenbosch Agricultural Microgrid
            </span>
          </div>
        </div>

        {/* 5. System Upgrades & DB Rewiring */}
        <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311] border border-[#24302A] rounded text-xs font-mono text-[#286D58] font-bold uppercase">
              <RefreshCw className="w-3.5 h-3.5" /> System Upgrades & SANS Rewiring
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Expand Your Existing System's Capacity
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Already have an inverter or battery installed? We assess your existing single-line diagram and safely add additional solar panels, parallel inverter modules, or secondary lithium racks with certified CoC re-issuance.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setCurrentRoute('contact')}
                className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded inline-flex items-center gap-2 transition-colors"
              >
                <span>Book an Upgrade Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/electrician-wiring-db.jpg"
              alt="Master electrician rewiring solar sub DB board"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Certified Master Electrician DB Rewiring
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
