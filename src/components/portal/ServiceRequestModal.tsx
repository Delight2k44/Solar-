import React, { useState } from 'react';
import { Wrench, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CustomerSite, UserProfile } from '../../types/dashboard';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeSite: CustomerSite | null;
  onSubmitTicket: (ticketData: { reason: string; details: string }) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  user,
  activeSite,
  onSubmitTicket
}) => {
  const [reason, setReason] = useState('Annual Preventative Health Audit');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    onSubmitTicket({ reason, details });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl font-sans text-sm animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#1E2530] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">Request SLA Service</h3>
              <p className="text-[11px] text-[#94A3B8]">DoL certified master electrician dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#161B22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
            <h4 className="text-sm font-bold text-white uppercase">Service Request Logged</h4>
            <p className="text-xs text-[#94A3B8]">
              Ticket dispatched to Sandton Operations Hub. An engineering SLA specialist will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-[#161B22] border border-[#21262D] rounded-xl text-xs space-y-1.5 text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Account Holder:</span>
                <strong className="text-white font-medium">{user.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Site Location:</span>
                <strong className="text-white font-medium">{activeSite?.address || 'Site Address'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Coverage Tier:</span>
                <span className="text-[#10B981] font-mono font-bold">24/7 Priority VIP</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#94A3B8]">
                Reason for Service Request *
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-[#161B22] border border-[#30363D] focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF] rounded-xl px-4 py-2.5 text-white text-xs transition-all outline-none"
              >
                <option value="Annual Preventative Health Audit">Annual Preventative Health Audit</option>
                <option value="Solar Panel Cleaning & Hydro-Wash">Solar Panel Cleaning & Hydro-Wash</option>
                <option value="Battery Expansion / Secondary Tower Add-on">Battery Expansion / Secondary Tower Add-on</option>
                <option value="Inverter Telemetry / Firmware Update">Inverter Telemetry / Firmware Update</option>
                <option value="Supplementary SANS 10142 CoC Re-Certification">Supplementary SANS 10142 CoC Re-Certification</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#94A3B8]">
                Site & Equipment Observations *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe any error codes, audible inverter beeps, or preferred technician appointment windows..."
                className="w-full bg-[#161B22] border border-[#30363D] focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF] rounded-xl px-4 py-2.5 text-white text-xs placeholder-[#64748B] transition-all outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md"
              >
                Submit Service Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
