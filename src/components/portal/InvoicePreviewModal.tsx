import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ProjectInfo, HardwareItem, UserProfile, CustomerSite } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInfo | null;
  hardware: HardwareItem[];
  user: UserProfile;
  activeSite: CustomerSite | null;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  hardware,
  user,
  activeSite
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-sans text-sm animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2530] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#10B981] font-mono font-bold uppercase tracking-wider block">
                Official SARS Tax Invoice
              </span>
              <h3 className="text-lg font-bold text-white font-mono tracking-tight">{project.id}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#161B22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billed To / Issued By Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#161B22] border border-[#21262D] p-4 rounded-xl">
          <div className="space-y-1">
            <strong className="text-white block uppercase tracking-wider text-[11px] text-[#00D2FF]">
              Billed To:
            </strong>
            <div className="font-semibold text-white">{user.name}</div>
            <div className="text-[#94A3B8]">{user.email}</div>
            <div className="text-[#94A3B8]">{activeSite?.address || 'Site Address'}, {activeSite?.city || 'Gauteng'}</div>
          </div>
          <div className="space-y-1 sm:text-right">
            <strong className="text-white block uppercase tracking-wider text-[11px] text-[#10B981]">
              Issued By:
            </strong>
            <div className="font-semibold text-white">Kinetix Energy Technologies (Pty) Ltd</div>
            <div className="text-[#94A3B8]">VAT Reg: 4890281240</div>
            <div className="text-[#94A3B8]">Sandton City Office Tower, Sandton, 2196</div>
          </div>
        </div>

        {/* Itemized Hardware Table */}
        <div className="space-y-2">
          <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider block">
            Itemized Equipment & Turnkey Installation:
          </span>
          <div className="space-y-2">
            {hardware.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 bg-[#161B22]/60 border border-[#21262D] rounded-xl text-xs"
              >
                <div>
                  <span className="text-white font-medium block">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">
                    SKU: {item.sku} • SN: {item.serialNumber || `SN-${item.sku}-ZA`}
                  </span>
                </div>
                <span className="text-white font-mono font-bold shrink-0 ml-3">
                  {formatCurrency(item.unitPriceZAR * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="space-y-2 pt-3 border-t border-[#1E2530]">
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>Subtotal (Excl. VAT):</span>
            <span className="font-mono">{formatCurrency(project.assetValueZAR / 1.15)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>15% SARS VAT:</span>
            <span className="font-mono">{formatCurrency(project.assetValueZAR - (project.assetValueZAR / 1.15))}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#10B981] pt-3 border-t border-[#21262D]">
            <span>Total Settlement Paid:</span>
            <span className="font-mono">{formatCurrency(project.assetValueZAR)}</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold uppercase flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={() => {
              alert(`Downloading Tax_Invoice_${project.id}.pdf`);
              onClose();
            }}
            className="px-5 py-2.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
