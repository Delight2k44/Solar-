import React from 'react';
import { X, Printer, Download } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#24302A] pb-4">
          <div>
            <span className="text-[10px] text-[#10B981] font-bold uppercase block">Official SARS Tax Invoice</span>
            <h3 className="text-lg font-bold text-white uppercase">{project.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg hover:bg-[#0E1311]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[#9EADA5] bg-[#0E1311] p-4 rounded-xl">
          <div>
            <strong className="text-white block uppercase">Billed To:</strong>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{activeSite?.address || 'Site Address'}, {activeSite?.city || 'Gauteng'}</div>
          </div>
          <div>
            <strong className="text-white block uppercase">Issued By:</strong>
            <div>Kinetix Energy Technologies (Pty) Ltd</div>
            <div>VAT Reg: 4890281240</div>
            <div>Sandton City Office Tower, Gauteng</div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Itemized Equipment & Services:</span>
          {hardware.map((item, idx) => (
            <div key={idx} className="flex justify-between py-1.5 border-b border-[#24302A]">
              <div>
                <span className="text-white font-bold">{item.quantity}x {item.name}</span>
                <span className="text-[10px] text-[#6B7B73] block">SKU: {item.sku} • {item.serialNumber}</span>
              </div>
              <span className="text-white font-bold">{formatCurrency(item.unitPriceZAR * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#24302A] text-right">
          <div className="flex justify-between text-base font-bold text-[#D97706] pt-2 border-t border-[#24302A]">
            <span>Total Amount Paid:</span>
            <span>{formatCurrency(project.assetValueZAR)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={() => {
              alert(`Downloading Tax_Invoice_${project.id}.pdf`);
              onClose();
            }}
            className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
