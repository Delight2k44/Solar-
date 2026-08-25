import React from 'react';
import { 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  Layers 
} from 'lucide-react';
import { InstallationBookingForm } from '../components/forms/InstallationBookingForm';

export const InstallationPage: React.FC = () => {
  const steps = [
    { num: '01', title: 'Consultation', desc: 'Initial energy profile assessment, bill analysis, and requirement definition.' },
    { num: '02', title: 'Site Assessment', desc: 'Physical inspection of roof orientation, shading factors, cable routes, and main distribution board (DB).' },
    { num: '03', title: 'System Design', desc: 'Single-line electrical diagram (SLD), CAD string layout, and SANS 10142 compliance check.' },
    { num: '04', title: 'Quote Approval', desc: 'Transparent itemized quotation approval, equipment reservation, and logistics allocation.' },
    { num: '05', title: 'Installation Scheduling', desc: 'Confirmation of on-site installation window with assigned Department of Labour installation electricians.' },
    { num: '06', title: 'Installation', desc: 'Mechanical roof rail mounting, DC surge isolation containment, inverter installation, and DB changeover switch wiring.' },
    { num: '07', title: 'Testing & Commissioning', desc: 'Polarity checks, earth loop impedance tests, inverter firmware calibration, and Wi-Fi cloud data logging setup.' },
    { num: '08', title: 'Handover & CoC', desc: 'Issuance of official supplementary electrical Certificate of Compliance (CoC), client walk-through, and warranty activation.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
            Certified Engineering Workflow
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Installation should be straightforward.
          </h1>
          <p className="text-sm text-[#9EADA5] leading-relaxed">
            From first site survey to the final Certificate of Compliance (CoC), our turnkey installation process follows strict South African electrical standards (SANS 10142-1-2) with zero guesswork.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[#9EADA5] pt-2">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Dept. of Labour Registered Electricians
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-[#286D58]" /> SABS CoC Compliance Certificate
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/solar-installer-roof.jpg"
              alt="Certified technician mounting solar roof array"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] font-mono text-white">
              Roof PV Array Assembly
            </span>
          </div>
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative group">
            <img
              src="/solar-protection-panel.jpg"
              alt="Neat SABS AC DC protection DB enclosure"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] font-mono text-white">
              SABS Protection DB Box
            </span>
          </div>
        </div>
      </div>

      {/* 8-Step Process Grid */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#24302A] pb-2">
          The 08-Stage Certified Installation Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(step => (
            <div 
              key={step.num}
              className="p-5 bg-[#141A17] border border-[#24302A] rounded-lg space-y-3 relative group hover:border-[#31423A] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-extrabold text-[#286D58]">
                  {step.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#24302A] group-hover:bg-[#10B981] transition-colors" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-[11px] text-[#9EADA5] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Installation Booking Schedule Form */}
      <div>
        <InstallationBookingForm />
      </div>
    </div>
  );
};
