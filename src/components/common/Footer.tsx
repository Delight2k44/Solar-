import React from 'react';
import { Sun, ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  setCurrentRoute: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentRoute }) => {
  const handleNav = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070A] border-t border-[#1E2530] text-[#94A3B8] text-xs">

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Company Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00D2FF] flex items-center justify-center text-white font-bold">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight uppercase">
              KINETIX <span className="font-light text-[#94A3B8]">ENERGY</span>
            </span>
          </div>
          
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
            We know energy. We understand the technology. We make the transition to reliable, uninterrupted power simple for South African homes and businesses.
          </p>

          <div className="pt-2 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>National Operations: <strong className="text-[#E6ECE8]">078 780 8569</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <Mail className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Engineering Inquiries: <strong className="text-[#E6ECE8]">info@kinetixenergy.co.za</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#64748B]">
              <MapPin className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Head Office: <strong className="text-[#E6ECE8]">Gauteng, South Africa</strong></span>
            </div>
          </div>
        </div>

        {/* Solutions & Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase text-white tracking-wider">Solutions</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('solar')} className="hover:text-white transition-colors">
                Residential Hybrid Solar
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('solar')} className="hover:text-white transition-colors">
                Commercial 3-Phase Solar
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('solar')} className="hover:text-white transition-colors">
                Load Shedding Backup Systems
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('solar')} className="hover:text-white transition-colors">
                System Upgrades & Battery Modules
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('installation')} className="hover:text-white transition-colors">
                Certified Installation Process
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('maintenance')} className="hover:text-white transition-colors">
                Preventative Maintenance SLAs
              </button>
            </li>
          </ul>
        </div>

        {/* Tools & Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase text-white tracking-wider">Tools & Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('configurator')} className="hover:text-white transition-colors">
                Solar System Configurator
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('calculator')} className="hover:text-white transition-colors">
                Energy & Payback Calculator
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('tracking')} className="hover:text-white transition-colors">
                Live Project Tracker
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('portal')} className="hover:text-white transition-colors">
                Customer Portal & Telemetry
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors">
                Guides & SANS Glossary
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                Technical FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Future Energy & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase text-white tracking-wider">Future Horizon</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 text-[#64748B]">
              <span>Solar Photovoltaic</span>
              <span className="text-[9px] font-mono bg-[#00D2FF]/40 text-[#10B981] px-1 rounded">Active</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#64748B]">
              <span>High-Voltage Battery Storage</span>
              <span className="text-[9px] font-mono bg-[#00D2FF]/40 text-[#10B981] px-1 rounded">Active</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#64748B]">
              <span>Micro-Wind Generation</span>
              <span className="text-[9px] font-mono bg-[#1E2530] text-[#94A3B8] px-1 rounded">Coming Soon</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#64748B]">
              <span>Biogas Cogeneration</span>
              <span className="text-[9px] font-mono bg-[#1E2530] text-[#94A3B8] px-1 rounded">Coming Soon</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#64748B]">
              <span>Smart Microgrid Software</span>
              <span className="text-[9px] font-mono bg-[#1E2530] text-[#94A3B8] px-1 rounded">Coming Soon</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Gateways Strip */}
      <div className="border-t border-[#161B22] py-6 px-4 sm:px-6 bg-[#05070A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Secure 256-Bit SSL Encrypted Checkout</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold mr-1">Accepted Payments:</span>
            <div className="bg-white rounded px-2 py-1 h-7 flex items-center shadow-sm">
              <img src="/payment-visa.png" alt="Visa" className="h-4 object-contain" />
            </div>
            <div className="bg-white rounded px-2 py-1 h-7 flex items-center shadow-sm">
              <img src="/payment-mastercard.png" alt="MasterCard" className="h-5 object-contain" />
            </div>
            <div className="bg-white rounded px-2 py-1 h-7 flex items-center shadow-sm">
              <img src="/payment-applepay.png" alt="Apple Pay" className="h-5 object-contain" />
            </div>
            <div className="bg-[#BFA4F8] rounded px-2 py-1 h-7 flex items-center shadow-sm">
              <img src="/payment-payflex.png" alt="Payflex" className="h-4 object-contain" />
            </div>
            <div className="bg-[#002B49] rounded px-2 py-1 h-7 flex items-center shadow-sm border border-[#00B2FE]/40">
              <span className="font-sans font-black text-white text-[11px] tracking-wider">OZOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#0D1117] py-6 px-4 sm:px-6 text-[11px] font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} KINETIX ENERGY TECHNOLOGIES (PTY) LTD. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>SANS 10142-1-2 Compliant</span>
            <span>SSEG CoCT / City Power Registered</span>
            <span>POPIA & Data Privacy Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
