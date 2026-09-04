import React from 'react';
import { AlertTriangle, Info, Activity } from 'lucide-react';

interface EstimateDisclaimerProps {
  className?: string;
  variant?: 'inline' | 'banner' | 'card';
}

export const EstimateDisclaimer: React.FC<EstimateDisclaimerProps> = ({ 
  className = '',
  variant = 'banner'
}) => {
  if (variant === 'inline') {
    return (
      <p className={`text-xs text-[#94A3B8] font-mono leading-relaxed ${className}`}>
        <strong className="text-[#D97706] font-semibold">ESTIMATE NOTICE:</strong> These figures are calculated for guidance and engineering sizing estimations only. They do not constitute a formal quotation, guarantee of savings, or certified electrical design. Final pricing and yields require an on-site physical assessment.
      </p>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 bg-[#0D1117] border border-[#1E2530] rounded-2xl shadow-xl flex items-start gap-4 ${className}`}>
        <AlertTriangle className="w-5 h-5 text-[#00D2FF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#94A3B8] leading-relaxed font-mono">
          <strong className="text-white uppercase tracking-wider block mb-1">
            Engineering & Financial Estimate Notice
          </strong>
          Calculations are based on average South African solar irradiance models, standard equipment efficiencies, and current published electricity tariffs. All figures are preliminary estimations.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-[#0D1117] border border-[#21262D] rounded-xl flex items-start gap-3 ${className}`}>
      <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
      <div className="text-xs text-[#94A3B8] leading-relaxed">
        <span className="font-semibold text-[#E6ECE8] uppercase tracking-wider block mb-1">
          Engineering & Financial Estimate Notice
        </span>
        These calculations are based on average South African regional solar irradiance models, standard equipment efficiencies, and current published electricity tariffs. Actual performance varies according to roof azimuth, tilt, shading factors, and individual household consumption profiles. All figures are estimates and should not be treated as a final quotation or engineering assessment.
      </div>
    </div>
  );
};

export const IncentiveDisclaimer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 bg-[#0D1117] border border-[#1E2530] rounded-md flex items-start gap-3 text-xs text-[#94A3B8] ${className}`}>
      <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-[#E6ECE8] block mb-1">Regulatory & Incentive Disclaimer</span>
        Incentive and feed-in tariff information (including Section 12B/12BA allowances and municipal SSEG feed-in credits) is provided for guidance only. Requirements and rates are subject to municipal bylaws and SARS tax legislation. Confirmation should be obtained from the relevant local authority or registered tax practitioner.
      </div>
    </div>
  );
};

export const TelemetryNotice: React.FC<{ isConnected?: boolean; className?: string }> = ({ 
  isConnected = false,
  className = ''
}) => {
  return (
    <div 
      role="status"
      aria-live="polite"
      className={`p-3.5 bg-[#0D1117] border border-[#1E2530] rounded-xl flex items-center justify-between gap-4 text-xs font-mono ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Activity className={`w-4 h-4 ${isConnected ? 'text-[#10B981]' : 'text-[#D97706] animate-pulse'}`} />
        <span className="text-[#94A3B8]">
          SYSTEM TELEMETRY STATUS:
        </span>
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
          isConnected 
            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' 
            : 'bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30'
        }`}>
          {isConnected ? 'LIVE CLOUD TELEMETRY CONNECTED' : 'MONITORING CONNECTION PENDING / MOCK TELEMETRY MODE'}
        </span>
      </div>
      <span className="text-[11px] text-[#64748B] hidden md:inline">
        RS485 / Wi-Fi Gateway Polling Rate: 30s
      </span>
    </div>
  );
};
