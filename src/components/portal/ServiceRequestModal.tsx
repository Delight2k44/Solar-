import React, { useState } from 'react';
import { Wrench, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-white uppercase">Request Certified Solar Service</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-[#10B981] text-center font-bold">
            Service request logged successfully. A certified technician has been dispatched.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl text-[11px] space-y-1 text-[#9EADA5]">
              <div>Client: <strong className="text-white">{user.name}</strong></div>
              <div>Property: <strong className="text-white">{activeSite?.address || 'Site Address'}</strong></div>
            </div>

            <div>
              <label className="block text-[#9EADA5] uppercase text-[10px] mb-1">Reason for Service Request *</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
              >
                <option value="Annual Preventative Health Audit">Annual Preventative Health Audit</option>
                <option value="Solar Panel Cleaning & Hydro-Wash">Solar Panel Cleaning & Hydro-Wash</option>
                <option value="Battery Expansion / Secondary Tower Add-on">Battery Expansion / Secondary Tower Add-on</option>
                <option value="Inverter Telemetry / Firmware Update">Inverter Telemetry / Firmware Update</option>
                <option value="Supplementary SANS 10142 CoC Re-Certification">Supplementary SANS 10142 CoC Re-Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9EADA5] uppercase text-[10px] mb-1">Site & Equipment Notes *</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe any specific observations or preferred technician visit window..."
                className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white placeholder-[#6B7B73]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-[#9EADA5] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold uppercase rounded-lg"
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
