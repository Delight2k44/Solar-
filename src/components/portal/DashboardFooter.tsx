import React from 'react';
import { ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { SupportInfo } from '../../types/dashboard';

interface DashboardFooterProps {
  support: SupportInfo;
  certifications: string[];
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ support, certifications }) => {
  return (
    <footer className="border-t border-[#24302A] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#6B7B73] gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#9EADA5] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          {certifications[0] || 'SANS 10142-1-2 Certified'}
        </span>
        {certifications.slice(1).map((cert, idx) => (
          <React.Fragment key={idx}>
            <span>•</span>
            <span>{cert}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a href={`tel:${support.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors flex items-center gap-1">
          <Phone className="w-3 h-3 text-[#10B981]" />
          <span>Support: {support.phone}</span>
        </a>
        <span>•</span>
        <span className="text-[#10B981] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          {support.slaStatus}
        </span>
      </div>
    </footer>
  );
};
