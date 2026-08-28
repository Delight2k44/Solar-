import React from 'react';
import { Cpu, Activity, Calendar, Zap, Truck, CheckCircle2 } from 'lucide-react';
import { SystemSpecs, ProjectInfo } from '../../types/dashboard';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DashboardKpisProps {
  system: SystemSpecs | null;
  project: ProjectInfo | null;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ system, project }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
      {/* Card 1: System Capacity */}
      <div className="p-4 bg-[#141A17]/90 backdrop-blur-md border border-[#24302A] rounded-2xl space-y-2 hover:border-[#2D3D35] transition-all group shadow-sm">
        <div className="flex items-center justify-between text-[#6B7B73]">
          <span className="text-[10px] uppercase font-bold tracking-wider">System Capacity</span>
          <div className="w-6 h-6 rounded-lg bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#10B981]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-lg font-extrabold text-white tracking-tight truncate">
            {system ? `${system.capacityKw}kW Inverter` : 'Hardware Pending'}
          </div>
          <div className="text-[11px] text-[#9EADA5] flex items-center gap-1.5 truncate">
            <span className="text-[#10B981] font-bold">
              {system?.inverterBrand ? `${system.inverterBrand} Hybrid` : 'Awaiting Order'}
            </span>
            {system?.batteryKwh && (
              <>
                <span>•</span>
                <span>{system.batteryKwh}kWh Storage</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Real-Time Status */}
      <div className="p-4 bg-[#141A17]/90 backdrop-blur-md border border-[#24302A] rounded-2xl space-y-2 hover:border-[#2D3D35] transition-all group shadow-sm">
        <div className="flex items-center justify-between text-[#6B7B73]">
          <span className="text-[10px] uppercase font-bold tracking-wider">Real-Time Status</span>
          <div className="w-6 h-6 rounded-lg bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#D97706]">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-lg font-extrabold text-white tracking-tight truncate flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${project?.adminApproved ? 'bg-[#10B981]' : 'bg-[#D97706]'}`} />
            <span>
              {project ? `Stage 0${project.currentStageIndex + 1}: ${project.currentStageLabel}` : 'Account Active'}
            </span>
          </div>
          <div className="text-[11px] text-[#9EADA5] truncate">
            {project?.statusDescription || 'No active installation pipeline in progress'}
          </div>
        </div>
      </div>

      {/* Card 3: Estimated Commissioning / Delivery */}
      <div className="p-4 bg-[#141A17]/90 backdrop-blur-md border border-[#24302A] rounded-2xl space-y-2 hover:border-[#2D3D35] transition-all group shadow-sm">
        <div className="flex items-center justify-between text-[#6B7B73]">
          <span className="text-[10px] uppercase font-bold tracking-wider">Est. Commissioning</span>
          <div className="w-6 h-6 rounded-lg bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#286D58]">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-lg font-extrabold text-white tracking-tight">
            {project?.estimatedCommissioningDate ? formatDate(project.estimatedCommissioningDate) : 'Date Pending'}
          </div>
          <div className="text-[11px] text-[#9EADA5] flex items-center gap-1 truncate">
            <Truck className="w-3 h-3 text-[#10B981] shrink-0" />
            <span>{project ? 'Turnkey Schedule' : 'Schedule on Checkout'}</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Asset Value */}
      <div className="p-4 bg-[#141A17]/90 backdrop-blur-md border border-[#24302A] rounded-2xl space-y-2 hover:border-[#2D3D35] transition-all group shadow-sm">
        <div className="flex items-center justify-between text-[#6B7B73]">
          <span className="text-[10px] uppercase font-bold tracking-wider">Total Asset Value</span>
          <div className="w-6 h-6 rounded-lg bg-[#0E1311] border border-[#24302A] flex items-center justify-center text-[#10B981]">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-lg font-extrabold text-white tracking-tight text-[#10B981]">
            {project ? formatCurrency(project.assetValueZAR, project.currency) : 'R 0.00'}
          </div>
          <div className="text-[11px] text-[#9EADA5] uppercase">
            {project ? `${project.paymentStatus} • ${project.paymentMethod.replace('_', ' ')}` : 'No Active Purchases'}
          </div>
        </div>
      </div>
    </div>
  );
};
