import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  FileText, 
  UserCheck, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Download, 
  ShieldCheck, 
  Zap,
  Truck,
  ExternalLink,
  Copy,
  Check,
  PackageCheck
} from 'lucide-react';

interface ProjectTrackerProps {
  initialOrderId?: string;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({ initialOrderId = 'KX-9042' }) => {
  const { projects } = useData();
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [activeRecordId, setActiveRecordId] = useState(initialOrderId);
  const [notFound, setNotFound] = useState(false);
  const [copiedWaybill, setCopiedWaybill] = useState(false);

  const activeRecord = projects[activeRecordId] || projects['KX-9042'] || Object.values(projects)[0];
  const tcgWaybill = `TCG-ZA-${activeRecord?.orderId?.replace(/[^0-9]/g, '') || '904281'}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (projects[query]) {
      setActiveRecordId(query);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto text-white shadow-2xl font-sans selection:bg-[#00D2FF] selection:text-black">
      
      {/* Header */}
      <div className="border-b border-[#1E2530] pb-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Freight & Milestone Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Live Order & Parcel Tracking
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#05070A] border border-[#1E2530] rounded-xl text-xs font-mono text-[#00D2FF]">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping"></span>
            <span>The Courier Guy Live API Linked</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 font-mono text-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter Order Reference (e.g. KX-9042) or TCG Waybill..."
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

        {notFound && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-200 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Order reference not found. Try searching sample reference <strong>KX-9042</strong>.</span>
          </div>
        )}
      </div>

      {/* The Courier Guy Live Shipment Card */}
      <div className="p-6 bg-[#05070A] border border-[#1E2530] rounded-2xl mb-8 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2530] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white block text-sm">The Courier Guy (TCG) Specialized Freight</strong>
              <span className="text-[#64748B] text-[11px]">Primary South African Logistics Dispatch</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-[#0D1117] border border-[#1E2530] rounded-xl flex items-center gap-2">
              <span className="text-[#64748B]">Waybill:</span>
              <strong className="text-[#00D2FF] font-bold">{tcgWaybill}</strong>
              <button
                onClick={() => handleCopy(tcgWaybill)}
                className="text-[#64748B] hover:text-white p-1"
                title="Copy TCG Waybill"
              >
                {copiedWaybill ? <Check className="w-3.5 h-3.5 text-[#00D2FF]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <a
              href={`https://thecourierguy.co.za/tracking?waybill=${encodeURIComponent(tcgWaybill)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 text-[11px]"
            >
              <span>TCG Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <span className="text-[#64748B] uppercase text-[10px] block">Current Depot Hub:</span>
            <span className="text-white font-bold">Kempton Park SuperHub, GP</span>
          </div>
          <div>
            <span className="text-[#64748B] uppercase text-[10px] block">Carrier Service:</span>
            <span className="text-white font-bold">Heavy Inverter & Battery Express</span>
          </div>
          <div>
            <span className="text-[#64748B] uppercase text-[10px] block">Estimated Delivery:</span>
            <span className="text-[#00D2FF] font-bold">{activeRecord?.installationDate || 'Within 48 Hours'}</span>
          </div>
        </div>
      </div>

      {/* 6-Stage Milestone Progress */}
      <div className="space-y-6">
        <h3 className="text-base font-extrabold text-white uppercase tracking-tight font-mono flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#00D2FF]" />
          <span>Turnkey Installation Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {activeRecord?.stages?.map((stage, idx) => {
            const isCompleted = stage.completed;
            const isCurrent = stage.current;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCurrent
                    ? 'bg-[#00D2FF]/10 border-[#00D2FF] ring-1 ring-[#00D2FF]/50'
                    : isCompleted
                    ? 'bg-[#05070A] border-white/10'
                    : 'bg-[#05070A]/50 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Step {idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" />
                  ) : isCurrent ? (
                    <span className="px-2 py-0.5 bg-[#00D2FF] text-black text-[9px] font-extrabold uppercase rounded-full">
                      In Progress
                    </span>
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                  )}
                </div>

                <div>
                  <strong className="text-white block text-sm font-bold">{stage.title}</strong>
                  <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
