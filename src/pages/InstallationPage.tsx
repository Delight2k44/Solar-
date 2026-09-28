import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Zap, 
  Wrench, 
  FileCheck, 
  Activity, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';
import { InstallationBookingForm } from '../components/forms/InstallationBookingForm';

export const InstallationPage: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState('Power Distribution & DB Rewiring');

  const handleBookService = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowBookingForm(true);
  };

  // 1. Four Core Master Electrician Engineering Services Requested
  const electricalServices = [
    {
      num: '01',
      title: 'Power Distribution',
      badge: 'SANS 10142-1',
      subtitle: 'Single & Three-Phase DB Boards, Load Segregation & ATS Switchgear',
      desc: 'Master electrician wiring of primary distribution boards, essential and non-essential circuit segregation, automated generator transfer switches (ATS), and certified Type 1/2 DC & AC surge arrestors (SPD).',
      deliverables: [
        'Single-Phase (230V) & Three-Phase (400V) DB Re-wiring',
        'Essential vs. Non-Essential Load Segregation',
        'Automatic Transfer Switch (ATS) & Generator Interlocking',
        'Class I/II AC & DC Surge Protection (SABS / SANS 10142)'
      ],
      serviceValue: 'Power Distribution & DB Rewiring',
      icon: Zap,
      accentColor: 'text-[#00D2FF]',
      borderColor: 'hover:border-[#00D2FF]/50'
    },
    {
      num: '02',
      title: 'Fault Finding & Repairs',
      badge: '24/7 Diagnostics',
      subtitle: 'Advanced Diagnostic Tracing, Earth Leakage & Inverter Tripping',
      desc: 'Rapid diagnostic isolation and repair of persistent earth leakage tripping, high-voltage DC string isolation faults, inverter error codes (F-codes), high-impedance floating neutrals, and thermal hotspots.',
      deliverables: [
        'Earth Leakage Tripping & Insulation Resistance Testing (Megger)',
        'Solar Inverter Fault Code Diagnosis & PCB Calibration',
        'DC PV String Isolation & Arc Fault Troubleshooting',
        'Emergency 24/7 Rapid Response & DB Rectification'
      ],
      serviceValue: 'Fault Finding & Emergency Repairs',
      icon: Wrench,
      accentColor: 'text-amber-400',
      borderColor: 'hover:border-amber-400/50'
    },
    {
      num: '03',
      title: 'CoC Certification',
      badge: 'Statutory Legal',
      subtitle: 'SANS 10142-1 & SANS 10142-1-2 Official Sign-Off',
      desc: 'Statutory electrical inspections and issuance of legal Certificates of Compliance (CoC) by registered Master Electricians. Mandatory for insurance claims, property sales, and municipal SSEG grid-tie registration.',
      deliverables: [
        'SANS 10142-1-2 Photovoltaic & Battery SSEG CoC',
        'SANS 10142-1 General Domestic & Commercial Electrical CoC',
        'Municipal SSEG Grid-Tie Approval & Bi-Directional Meter Setup',
        'Full ECSA Statutory Test Reports & Earth Loop Impedance'
      ],
      serviceValue: 'SANS 10142-1-2 CoC Certification',
      icon: FileCheck,
      accentColor: 'text-emerald-400',
      borderColor: 'hover:border-emerald-400/50'
    },
    {
      num: '04',
      title: 'Electrical Maintenance',
      badge: 'Asset Protection',
      subtitle: 'Thermal Infrared Scans, Torque Audits & Battery Calibration',
      desc: 'Routine preventative servicing contracts for residential and commercial sites. Radiometric infrared thermal scanning of busbars and breakers, terminal torque calibration, battery BMS cell balancing, and inverter firmware updates.',
      deliverables: [
        'FLIR Radiometric Thermal Imaging (Hotspot & Arc Detection)',
        'Terminal Torque Verification (Preventing High-Resistance Arcing)',
        'LiFePO4 BMS Health Audits, Cell Balancing & Firmware Flash',
        'Annual Preventative Servicing & Compliance Renewal'
      ],
      serviceValue: 'Electrical Maintenance & Thermal Scan',
      icon: Activity,
      accentColor: 'text-purple-400',
      borderColor: 'hover:border-purple-400/50'
    }
  ];

  // 2. Four-Stage Commissioning Pipeline Standard
  const commissioningSteps = [
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
      
      {/* ===================================================================== */}
      {/* 1. STARLINK-STYLE CINEMATIC HEADER                                    */}
      {/* ===================================================================== */}
      <section className="relative min-h-[500px] sm:min-h-[540px] flex items-center justify-start overflow-hidden border-b border-[#1E2530] pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/electrician-wiring-db.jpg"
            alt="Master electrician wiring solar distribution board"
            className="w-full h-full object-cover object-[center_35%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/80 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 relative z-10 w-full space-y-6">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold px-2.5 py-0.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30">
                Department of Labour Accredited
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                ECSA Master Electricians
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Certified electrical engineering &amp; installation standards.
            </h1>
            
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              From power distribution boards and emergency fault finding to statutory SANS 10142 CoC certifications and scheduled preventative maintenance, every installation is engineered by registered Master Electricians with full municipal SSEG sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => handleBookService('Turnkey Solar & Battery System Installation')}
              className="px-6 py-3.5 bg-white text-black font-bold uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <span>Schedule On-Site Assessment</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <a
              href="#electrical-services"
              className="px-6 py-3.5 bg-[#0D1117]/80 hover:bg-[#161B22] border border-[#1E2530] hover:border-[#00D2FF]/50 text-white font-bold uppercase rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <span>View Core Services ↓</span>
            </a>
          </div>

          {/* Quick Capability Chips */}
          <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-mono text-[#94A3B8]">
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#00D2FF]" /> Power Distribution
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-amber-400" /> Fault Finding &amp; Repairs
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center gap-1.5">
              <FileCheck className="w-3 h-3 text-emerald-400" /> CoC Certification
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-purple-400" /> Electrical Maintenance
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. CORE MASTER ELECTRICIAN SERVICES (The 4 Pillars Requested)         */}
      {/* ===================================================================== */}
      <section id="electrical-services" className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Master Electrician Engineering Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Certified Electrical Services
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Beyond turnkey solar installations, our certified team handles complex residential, commercial, and industrial power distribution, rapid diagnostic fault isolation, and statutory compliance.
          </p>
        </div>

        {/* 4 Cards Grid: Power Distribution, Fault Finding, CoC Certification, Electrical Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {electricalServices.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 bg-[#0D1117] border border-[#1E2530] ${service.borderColor} rounded-2xl flex flex-col justify-between space-y-5 transition-all group shadow-xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)]`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl sm:text-3xl font-black ${service.accentColor} tracking-tight`}>
                      {service.num}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#CBD5E1] uppercase">
                      {service.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                        <IconComponent className={`w-4 h-4 ${service.accentColor}`} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#00D2FF] block leading-tight font-medium">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                    {service.desc}
                  </p>

                  {/* Scope of Work Deliverables */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block tracking-wider">
                      Scope Deliverables:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-[#CBD5E1] font-sans">
                      {service.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleBookService(service.serviceValue)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#00D2FF] text-white hover:text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-white/10"
                  >
                    <span>Request {service.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. 4-PHASE COMMISSIONING PIPELINE (Retained & Elevated)               */}
      {/* ===================================================================== */}
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
          {commissioningSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/40 rounded-2xl space-y-4 transition-all group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-[#00D2FF]">{step.num}</span>
                <ShieldCheck className="w-4 h-4 text-[#64748B] group-hover:text-[#00D2FF] transition-colors" />
              </div>
              <div className="space-y-1">
                <strong className="text-sm font-bold text-white block">{step.title}</strong>
                <span className="text-[10px] text-[#00D2FF] block leading-tight">{step.subtitle}</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. REGULATORY ACCREDITATION & COMPLIANCE BANNER                       */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-[#0D1117] via-[#05070A] to-[#0D1117] border border-[#1E2530] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981] font-bold block">
              South African Statutory Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SANS 10142-1 &amp; SANS 10142-1-2 Compliance Guaranteed
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Every installation includes an official Certificate of Compliance (CoC) signed off by a Department of Labour registered Installation Electrician (IE). Unlocks legal Eskom and municipal SSEG grid-tie feedback tariffs while ensuring 100% building insurance validity.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleBookService('SANS 10142-1-2 CoC Certification')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#00D2FF] hover:bg-[#00D2FF]/90 text-black font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book CoC Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBookService('Turnkey Solar & Battery System Installation')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Site Assessment</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. BOOKING FORM MODAL                                                 */}
      {/* ===================================================================== */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setShowBookingForm(false)}
              aria-label="Close installation booking dialog"
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#131822] border border-[#1E2530] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <InstallationBookingForm 
              defaultService={selectedService}
              onSuccess={() => setTimeout(() => setShowBookingForm(false), 4000)} 
            />
          </div>
        </div>
      )}

    </div>
  );
};
