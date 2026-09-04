import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Cpu, 
  Truck, 
  Wrench, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { ProjectInfo, ShipmentInfo } from '../../types/dashboard';

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

  const stages = [
    { num: '01', title: 'Order Reserved', desc: 'Payment / 3D Secure Cleared', icon: ShoppingBag },
    { num: '02', title: 'CAD Engineering', desc: 'Single Line Diagram Review', icon: ShieldCheck },
    { num: '03', title: 'Bench Testing', desc: '1000V DC Insulation Test', icon: Cpu },
    { num: '04', title: 'Freight Dispatch', desc: 'The Courier Guy In-Transit', icon: Truck },
    { num: '05', title: 'On-Site Setup', desc: 'DoL Certified Electrician', icon: Wrench },
    { num: '06', title: 'CoC Issued', desc: 'SANS 10142 Commissioning', icon: CheckCircle2 }
  ];

  const currentIdx = project?.currentStageIndex ?? 1;

  const handleCopy = (wb: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wb).then(() => {
        setCopiedWaybill(true);
        setTimeout(() => setCopiedWaybill(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <section className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2530] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2FF]" />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Installation & Milestone Pipeline
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Project Ref: <strong className="text-white font-mono">{project?.id || 'KX-STANDBY-01'}</strong> • SANS 10142-1-2 Verified Turnkey Execution
          </p>
        </div>

        {/* Courier Guy Tracking / Shop CTA */}
        {shipment ? (
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-[#161B22] border border-[#30363D] rounded-xl flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-[#00D2FF]" />
              <span className="text-[#94A3B8]">TCG Waybill:</span>
              <strong className="text-white font-mono">{shipment.waybillNumber}</strong>
              <button
                onClick={() => handleCopy(shipment.waybillNumber)}
                aria-label="Copy Waybill Number"
                className="text-[#94A3B8] hover:text-white transition-colors"
                title="Copy Waybill"
              >
                {copiedWaybill ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href={`https://thecourierguy.co.za/tracking?waybill=${shipment.waybillNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Track parcel on The Courier Guy portal"
              className="p-2 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#00D2FF] rounded-xl transition-colors"
              title="Track on The Courier Guy"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="px-4 py-2 bg-[#00D2FF] hover:bg-[#38BDF8] text-black rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Solar Hardware</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {/* Modern Connected Stepper Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stg, i) => {
          const Icon = stg.icon;
          const isCompleted = i < currentIdx;
          const isCurrent = i === currentIdx;

          return (
            <div
              key={stg.num}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isCurrent
                  ? 'bg-[#00D2FF]/10 border-[#00D2FF] text-white shadow-lg'
                  : isCompleted
                  ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#CBD5E1]'
                  : 'bg-[#161B22]/60 border-[#21262D] text-[#64748B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">{stg.num}</span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#00D2FF] text-black font-bold'
                      : isCompleted
                      ? 'bg-[#10B981] text-black font-bold'
                      : 'bg-[#21262D] text-[#64748B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <strong className={`block text-xs font-bold leading-snug ${isCurrent ? 'text-white' : ''}`}>
                  {stg.title}
                </strong>
                <span className="text-[11px] block text-[#94A3B8] mt-0.5 leading-tight">
                  {stg.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
