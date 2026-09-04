import React from 'react';
import { ShieldCheck, Phone, Zap } from 'lucide-react';
import { SupportInfo } from '../../types/dashboard';

interface DashboardFooterProps {
  support: SupportInfo;
  certifications: string[];
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ support, certifications }) => {
  return (
    <footer className="border-t border-[#1E2530] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#64748B] gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#94A3B8] font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          {certifications[0] || 'SANS 10142-1-2 Certified'}
        </span>
        {certifications.slice(1).map((cert, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[#30363D]">•</span>
            <span className="text-[#94A3B8]">{cert}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-3.5">
        <a 
          href={`tel:${support.phone.replace(/\s+/g, '')}`} 
          className="hover:text-white text-[#94A3B8] transition-colors flex items-center gap-1.5 font-mono"
        >
          <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
          <span>Priority SLA: {support.phone}</span>
        </a>
        <span className="text-[#30363D]">•</span>
        <span className="text-[#10B981] font-semibold flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          {support.slaStatus}
        </span>
      </div>
    </footer>
  );
};
