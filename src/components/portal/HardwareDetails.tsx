import React, { useState } from 'react';
import { Package, ChevronUp, ChevronDown, FileText, Download, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { HardwareItem, ProjectInfo } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';

interface HardwareDetailsProps {
  hardware: HardwareItem[];
  project: ProjectInfo | null;
  onOpenInvoice: () => void;
  onOpenCoc: () => void;
  onNavigateToShop?: () => void;
}

export const HardwareDetails: React.FC<HardwareDetailsProps> = ({
  hardware,
  project,
  onOpenInvoice,
  onOpenCoc,
  onNavigateToShop
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl font-sans">
      {/* Header with Collapsible Trigger */}
      <div className="flex items-center justify-between border-b border-[#1E2530] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
              Allocated Hardware & Serial Registry
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              Verified serial numbers, manufacturer warranties & SANS compliance
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#8B949E] text-[#94A3B8] hover:text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Hardware Items Rows */}
      {hardware.length > 0 ? (
        <div className={`space-y-3 ${isExpanded ? 'block' : 'hidden'}`}>
          {hardware.map(item => (
            <div 
              key={item.id} 
              className="p-4 bg-[#161B22] border border-[#21262D] hover:border-[#30363D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              {/* Product Info & Thumbnail */}
              <div className="flex items-center gap-3.5">
                <img
                  src={item.image || '/hybrid-inverter-deye.jpg'}
                  alt={item.name}
                  className="w-13 h-13 rounded-xl object-cover bg-[#0D1117] border border-[#30363D] shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[#00D2FF] text-[10px] font-mono font-bold rounded-md uppercase">
                      {item.brand}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">SKU: {item.sku}</span>
                  </div>
                  <strong className="text-sm font-semibold text-white block leading-snug">{item.name}</strong>
                  <div className="text-xs text-[#94A3B8] flex flex-wrap items-center gap-2">
                    <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                    <span>•</span>
                    <span className="text-[#10B981] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.warrantyYears}-Year Warranty
                    </span>
                    {item.includeInstallation && (
                      <>
                        <span>•</span>
                        <span className="text-[#38BDF8] font-medium">DoL Certified Installation</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Serial Number */}
              <div className="text-left sm:text-right border-t sm:border-t-0 border-[#21262D] pt-3 sm:pt-0 shrink-0">
                <span className="text-sm font-bold text-white block">
                  {formatCurrency(item.unitPriceZAR * item.quantity)}
                </span>
                <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">
                  SN: <span className="text-[#94A3B8]">{item.serialNumber || `SN-${item.sku}-ZA`}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#161B22]/50 border border-[#21262D] rounded-xl space-y-3 text-xs text-[#94A3B8]">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0D1117] border border-[#21262D] flex items-center justify-center text-[#64748B]">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white uppercase tracking-tight">No Hardware Allocated Yet</p>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            When you purchase equipment or lock in a turnkey quote, serialized hardware cards, warranties, and firmware specs will appear here.
          </p>
          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="px-4 py-2 bg-[#00D2FF] hover:bg-[#38BDF8] text-black text-xs font-bold uppercase rounded-xl transition-all inline-flex items-center gap-2 mt-2 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Hardware Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Quick Action Download Strip */}
      {project && (
        <div className="pt-3 border-t border-[#1E2530] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-xs text-[#94A3B8]">Official Compliance & SARS Accounting:</span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenInvoice}
              className="px-3.5 py-2 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Tax Invoice ({project.id})</span>
            </button>
            <button
              onClick={onOpenCoc}
              className="px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SANS 10142 CoC</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
