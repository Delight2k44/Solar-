import React, { useState, useEffect } from 'react';
import { Activity, Truck, Clock, Check, Copy, ShoppingBag, ShieldCheck, Cpu, Wrench, CheckCircle2, Info } from 'lucide-react';
import { ProjectInfo, ShipmentInfo } from '../../types/dashboard';
import { calculateCountdown } from '../../utils/formatters';

interface InstallationPipelineProps {
  project: ProjectInfo | null;
  shipment: ShipmentInfo | null;
  onNavigateToShop?: () => void;
}

export const InstallationPipeline: React.FC<InstallationPipelineProps> = ({
  project,
  shipment,
  onNavigateToShop
}) => {
  const [copiedWaybill, setCopiedWaybill] = useState(false);
  const [countdownText, setCountdownText] = useState('Delivery Expected');

  useEffect(() => {
    if (!shipment?.estimatedDeliveryTimestamp) return;

    const updateTimer = () => {
      const res = calculateCountdown(shipment.estimatedDeliveryTimestamp);
      setCountdownText(res.formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [shipment]);

  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  const defaultStages = [
    { num: '01', title: 'Order Placed', subtitle: '3D Secure / EFT Cleared', icon: ShoppingBag },
    { num: '02', title: 'Tech Review', subtitle: 'CAD & Single Line Diagram', icon: ShieldCheck },
    { num: '03', title: 'Allocation', subtitle: '1000V DC Bench Testing', icon: Cpu },
    { num: '04', title: 'Freight Dispatch', subtitle: 'The Courier Guy (TCG) In-Transit', icon: Truck },
    { num: '05', title: 'On-Site Setup', subtitle: 'DoL Master Electrician', icon: Wrench },
    { num: '06', title: 'Commissioning', subtitle: 'SANS 10142 CoC Issued', icon: CheckCircle2 }
  ];

  const currentIdx = project?.currentStageIndex ?? 0;

  return (
    <section className="bg-[#141A17]/90 backdrop-blur-xl border border-[#24302A] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl font-mono">
      {/* Header Strip with Tracking Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Installation & Commissioning Pipeline</h3>
          </div>
          <p className="text-[11px] text-[#9EADA5]">
            Project Ref: <strong className="text-white">{project?.id || 'KX-STANDBY-01'}</strong> • SANS 10142-1-2 Verified
          </p>
        </div>

        {/* Dynamic Waybill Chip & Countdown */}
        {shipment ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 bg-[#0E1311] border border-[#286D58] rounded-xl flex items-center gap-2 text-xs">
              <Truck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#9EADA5]">Waybill:</span>
              <strong className="text-white font-bold">{shipment.waybillNumber}</strong>
              <button
                onClick={() => handleCopyWaybill(shipment.waybillNumber)}
                title="Copy Waybill"
                className="text-[#6B7B73] hover:text-white p-0.5 transition-colors"
              >
                {copiedWaybill ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <span className="px-2.5 py-1.5 bg-[#1B4D3E]/40 border border-[#10B981]/40 text-[#10B981] text-[11px] font-bold rounded-xl flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{countdownText}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onNavigateToShop && (
              <button
                onClick={onNavigateToShop}
                className="px-3.5 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Configure New System</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 6-Stage Visual Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {defaultStages.map((stage, idx) => {
          const isCompleted = project ? currentIdx > idx || (currentIdx === idx && project.status === 'installed') : false;
          const isCurrent = project ? currentIdx === idx && project.status !== 'installed' : false;
          const StepIcon = stage.icon;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2 relative overflow-hidden ${
                isCurrent
                  ? 'bg-[#1B4D3E]/30 border-[#10B981] ring-1 ring-[#10B981]/50 text-white shadow-lg'
                  : isCompleted
                  ? 'bg-[#0E1311] border-[#286D58]/80 text-[#10B981]'
                  : 'bg-[#0E1311]/60 border-[#24302A] text-[#6B7B73]'
              }`}
            >
              {/* Step Number + State Icon */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold font-mono ${isCurrent || isCompleted ? 'text-[#10B981]' : 'text-[#6B7B73]'}`}>
                  {stage.num}
                </span>
                {isCompleted && (
                  <span className="w-4 h-4 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981]">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                {isCurrent && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#10B981]/20 rounded text-[9px] text-[#10B981] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <StepIcon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[#10B981]' : isCompleted ? 'text-[#10B981]' : 'text-[#6B7B73]'}`} />
                  <strong className={`text-[11px] leading-tight block truncate ${isCurrent ? 'text-white' : isCompleted ? 'text-[#E6ECE8]' : 'text-[#6B7B73]'}`}>
                    {stage.title}
                  </strong>
                </div>
                <span className="text-[9px] text-[#9EADA5] line-clamp-1 leading-normal">
                  {stage.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Notes / Engineering Dispatch Update */}
      {project?.adminNotes && (
        <div className="px-4 py-2.5 bg-[#0E1311] border border-[#24302A] rounded-xl text-xs text-[#9EADA5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="truncate">Engineering Update: <strong className="text-white">{project.adminNotes}</strong></span>
          </div>
          <span className="text-[10px] text-[#6B7B73] shrink-0">Ops Desk Sign-off</span>
        </div>
      )}
    </section>
  );
};
