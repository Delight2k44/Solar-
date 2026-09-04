import React from 'react';
import { Cpu, Activity, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import { SystemSpecs, ProjectInfo } from '../../types/dashboard';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DashboardKpisProps {
  system: SystemSpecs | null;
  project: ProjectInfo | null;
  onNavigateToShop?: () => void;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ system, project, onNavigateToShop }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      
      {/* Card 1: System Hardware Capacity */}
      <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#30363D] rounded-2xl p-5 space-y-3 transition-all shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">System Capacity</span>
          <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-white tracking-tight">
            {system ? `${system.capacityKw} kW Inverter` : '8.0 kW Sizing Profile'}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            {system?.batteryKwh ? `${system.batteryKwh} kWh LiFePO4 Storage` : '10.24 kWh Lithium Buffer Ready'}
          </p>
        </div>
      </div>

      {/* Card 2: Installation Lifecycle Status */}
      <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#30363D] rounded-2xl p-5 space-y-3 transition-all shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Project Lifecycle</span>
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>{project ? `Stage 0${project.currentStageIndex + 1}: ${project.currentStageLabel}` : 'Account Active'}</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 truncate">
            {project?.statusDescription || 'SANS 10142 Single Line Diagram Ready'}
          </p>
        </div>
      </div>

      {/* Card 3: Target Commissioning Date */}
      <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#30363D] rounded-2xl p-5 space-y-3 transition-all shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Target Schedule</span>
          <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-white tracking-tight">
            {project?.estimatedCommissioningDate ? formatDate(project.estimatedCommissioningDate) : 'Priority Dispatch'}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            {project ? 'Turnkey Logistics Slot' : '2-4 Week Turnkey Installation'}
          </p>
        </div>
      </div>

      {/* Card 4: Total Asset Valuation */}
      <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#30363D] rounded-2xl p-5 space-y-3 transition-all shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Turnkey Asset Value</span>
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-[#10B981] tracking-tight">
            {project ? formatCurrency(project.assetValueZAR, project.currency) : 'R 129,000.00'}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            {project ? `${project.paymentStatus} • ${project.paymentMethod}` : 'Est. System Turnkey Value'}
          </p>
        </div>
      </div>

    </div>
  );
};
