import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  AlertCircle, 
  Truck, 
  ExternalLink, 
  Copy, 
  Check, 
  PackageCheck,
  Box
} from 'lucide-react';

interface ProjectTrackerProps {
  initialOrderId?: string;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({ initialOrderId = '' }) => {
  const { orders } = useData();
  const { currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedId, setSearchedId] = useState(initialOrderId);
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));
  const [copiedWaybill, setCopiedWaybill] = useState(false);

  // Find actual user order from Firebase if query provided, or user's latest real order
  const userOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email)
    : [];

  const matchedOrder = searchQuery.trim() 
    ? orders.find(o => 
        o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase())
      )
    : (userOrders.length > 0 ? userOrders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(searchQuery.trim());
    setHasSearched(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  const waybill = matchedOrder?.trackingNumber || (matchedOrder ? `TCG-ZA-${matchedOrder.id.replace(/[^0-9]/g, '')}` : '');

  const standardStages = [
    { title: 'Order Confirmed', desc: 'Payment verified and equipment reserved in warehouse.' },
    { title: 'Technical Review', desc: 'Single Line Diagram (SLD) and electrical engineering sign-off.' },
    { title: 'QA Bench-Testing', desc: '1000V DC thermal load test and firmware synchronization.' },
    { title: 'Courier Dispatch', desc: 'In-transit with The Courier Guy specialized freight.' },
    { title: 'On-Site Installation', desc: 'Master Electrician DB wiring and surge protection setup.' },
    { title: 'Commissioning & CoC', desc: 'Final SANS 10142-1-2 Certificate of Compliance issued.' }
  ];

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto text-white shadow-2xl font-sans selection:bg-[#00D2FF] selection:text-black">
      
      {/* Header */}
      <div className="border-b border-[#1E2530] pb-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Freight & Installation Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Live Order & Parcel Tracking
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#05070A] border border-[#1E2530] rounded-xl text-xs font-mono text-[#00D2FF]">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping"></span>
            <span>The Courier Guy Live Link</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 font-mono text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Order Reference or TCG Waybill Number"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter your Order Reference (e.g. KX-PAY-...) or TCG Waybill..."
              className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold uppercase rounded-xl transition-all shadow-md"
          >
            Track Parcel
          </button>
        </form>

        {hasSearched && !matchedOrder && (
          <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-2xl text-xs text-amber-200 flex items-start gap-3 font-mono">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">No active shipment found for "{searchedId}"</strong>
              <span>Please verify the order reference on your confirmation invoice or contact our dispatch desk on WhatsApp (078 780 8569).</span>
            </div>
          </div>
        )}
      </div>

      {/* When a real order is matched */}
      {matchedOrder ? (
        <div className="space-y-8 animate-in fade-in">
          {/* Active Order Summary */}
          <div className="p-6 bg-[#05070A] border border-[#1E2530] rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2530] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white block text-sm">The Courier Guy (TCG) Logistics Dispatch</strong>
                  <span className="text-[#64748B] text-[11px]">Recipient: {matchedOrder.customerName} • {matchedOrder.city}</span>
                </div>
              </div>

              {waybill && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-[#0D1117] border border-[#1E2530] rounded-xl flex items-center gap-2">
                    <span className="text-[#64748B]">Waybill:</span>
                    <strong className="text-[#00D2FF] font-bold">{waybill}</strong>
                    <button
                      onClick={() => handleCopy(waybill)}
                      aria-label="Copy Waybill Number"
                      className="text-[#64748B] hover:text-white p-1"
                      title="Copy Waybill"
                    >
                      {copiedWaybill ? <Check className="w-3.5 h-3.5 text-[#00D2FF]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <a
                    href={`https://thecourierguy.co.za/tracking?waybill=${encodeURIComponent(waybill)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 text-[11px]"
                  >
                    <span>TCG Live Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-[#64748B] uppercase text-[10px] block">Order Reference:</span>
                <span className="text-white font-bold">{matchedOrder.id}</span>
              </div>
              <div>
                <span className="text-[#64748B] uppercase text-[10px] block">Payment Method:</span>
                <span className="text-white font-bold uppercase">{matchedOrder.paymentMethod || 'PayFast Settled'}</span>
              </div>
              <div>
                <span className="text-[#64748B] uppercase text-[10px] block">Delivery Location:</span>
                <span className="text-[#00D2FF] font-bold">{matchedOrder.shippingAddress || matchedOrder.city}</span>
              </div>
            </div>
          </div>

          {/* Milestone Progress for Real Order */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight font-mono flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#00D2FF]" />
              <span>Turnkey Fulfillment Pipeline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {standardStages.map((stage, idx) => {
                const currentStageIdx = matchedOrder.currentStageIndex ?? 1;
                const isCompleted = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isCurrent
                        ? 'bg-[#00D2FF]/10 border-[#00D2FF] ring-1 ring-[#00D2FF]/50'
                        : isCompleted
                        ? 'bg-[#05070A] border-white/10'
                        : 'bg-[#05070A]/50 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#64748B]">Stage 0{idx + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" />
                      ) : isCurrent ? (
                        <span className="px-2 py-0.5 bg-[#00D2FF] text-black text-[9px] font-extrabold uppercase rounded-full">
                          Active Stage
                        </span>
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      )}
                    </div>

                    <div>
                      <strong className="text-white block text-sm font-bold">{stage.title}</strong>
                      <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Empty Clean State for Production (No Fake Demos) */
        <div className="py-16 text-center space-y-4 font-mono">
          <div className="w-14 h-14 rounded-2xl bg-[#05070A] border border-[#1E2530] flex items-center justify-center text-[#64748B] mx-auto">
            <Box className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase">Track Your Solar Delivery</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              Enter your official Kinetix Order Reference or Courier Waybill above to inspect freight transit, technician dispatch, and SANS CoC milestones.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
