import React, { useState } from 'react';
import { Package, ChevronUp, ChevronDown, FileText, Download, ShoppingBag, ShieldCheck } from 'lucide-react';
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
    <div className="bg-[#141A17]/90 backdrop-blur-xl border border-[#24302A] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl font-mono">
      {/* Header with Collapsible Trigger */}
      <div className="flex items-center justify-between border-b border-[#24302A] pb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Allocated Hardware & Serial Registry</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#9EADA5] hover:text-white p-1 rounded-lg hover:bg-[#0E1311] transition-colors flex items-center gap-1 text-xs"
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
              className="p-3.5 bg-[#0E1311] border border-[#24302A] hover:border-[#2D3D35] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              {/* Product Info & Thumbnail */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image || '/hybrid-inverter-deye.jpg'}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#141A17] border border-[#24302A] shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 bg-[#1B4D3E]/50 border border-[#286D58] text-[#10B981] text-[9px] font-bold rounded uppercase">
                      {item.brand}
                    </span>
                    <span className="text-[10px] text-[#6B7B73]">SKU: {item.sku}</span>
                  </div>
                  <strong className="text-xs text-white block leading-snug">{item.name}</strong>
                  <div className="text-[10px] text-[#9EADA5] flex items-center gap-2">
                    <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                    <span>•</span>
                    <span className="text-[#10B981] font-semibold">{item.warrantyYears}-Year Warranty</span>
                    {item.includeInstallation && (
                      <>
                        <span>•</span>
                        <span className="text-white font-semibold">DoL Installation Included</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Serial Number */}
              <div className="text-left sm:text-right border-t sm:border-t-0 border-[#1B2420] pt-2 sm:pt-0">
                <span className="text-xs font-bold text-white block">
                  {formatCurrency(item.unitPriceZAR * item.quantity)}
                </span>
                <span className="text-[9px] text-[#6B7B73] font-mono block">
                  {item.serialNumber || `SN-${item.sku}-ZA`}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#0E1311] border border-[#24302A] rounded-xl space-y-3 text-xs text-[#9EADA5]">
          <Package className="w-8 h-8 mx-auto text-[#6B7B73]" />
          <p className="text-white font-bold uppercase">No Hardware Allocated Yet</p>
          <p className="text-[11px]">When you purchase equipment, serialized hardware cards, warranties, and firmware specs will appear here.</p>
          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-xs font-bold uppercase rounded-xl transition-colors inline-flex items-center gap-1.5 mt-1 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Hardware Catalog</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Action Download Strip */}
      {project && (
        <div className="pt-2 border-t border-[#24302A] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-[#6B7B73]">Official Compliance & SARS Records:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInvoice}
              className="px-3 py-1.5 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#10B981] text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Tax Invoice ({project.id})</span>
            </button>
            <button
              onClick={onOpenCoc}
              className="px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
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
