import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PlaceholderBadgeProps {
  type?: 'certification' | 'partner' | 'review' | 'contact' | 'metric';
  label: string;
  className?: string;
}

export const PlaceholderBadge: React.FC<PlaceholderBadgeProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-2 bg-[#0D1117] border border-[#1E2530] rounded text-xs text-[#94A3B8] font-mono select-none ${className}`}
      title="Editable CMS Placeholder - To be connected with client verified credentials"
    >
      <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse"></span>
      <span className="uppercase text-[10px] tracking-wider text-[#64748B] font-semibold">CMS Placeholder:</span>
      <span className="text-[#E6ECE8]">{label}</span>
    </div>
  );
};

export const PartnerPlaceholderGrid: React.FC = () => {
  const partners = [
    'Manufacturer Certification / Deye Approved Partner',
    'Sunsynk Certified Master Installer',
    'Freedom Won Accredited Energy Integrator',
    'SAPVIA PV GreenCard Certified Team',
    'ECASA Registered Electrical Contractor',
    'Department of Labour Registered Installation Electricians'
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {partners.map((partner) => (
        <div 
          key={partner} 
          className="flex flex-col items-center justify-center p-4 bg-[#0D1117] border border-[#1E2530] rounded text-center transition-colors hover:border-[#30363D]"
        >
          <ShieldCheck className="w-5 h-5 text-[#00D2FF] mb-2" />
          <span className="text-[11px] font-mono text-[#94A3B8] leading-tight">
            {partner}
          </span>
          <span className="mt-2 text-[9px] uppercase tracking-wider text-[#64748B] bg-[#0D1117] px-2 py-0.5 rounded border border-[#161B22]">
            Verified Partner
          </span>
        </div>
      ))}
    </div>
  );
};
