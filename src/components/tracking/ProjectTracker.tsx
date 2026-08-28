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
  Zap
} from 'lucide-react';

interface ProjectTrackerProps {
  initialOrderId?: string;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({ initialOrderId = 'KX-9042' }) => {
  const { projects } = useData();
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [activeRecordId, setActiveRecordId] = useState(initialOrderId);
  const [notFound, setNotFound] = useState(false);

  const activeRecord = projects[activeRecordId] || projects['KX-9042'] || Object.values(projects)[0];

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

  const handleQuickSelect = (id: string) => {
    setSearchQuery(id);
    setActiveRecordId(id);
    setNotFound(false);
  };

  return (
    <div className="bg-[#0E1311] border border-[#24302A] rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto text-[#E6ECE8] shadow-2xl">
      {/* Tracker Search Header */}
      <div className="border-b border-[#24302A] pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Project Logistics & Milestone Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase">
              Know Where Your Installation Stands
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9EADA5]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Real-Time Milestone System</span>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter your Order Reference (e.g. VX-9042)"
              className="w-full bg-[#141A17] border border-[#24302A] rounded pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-[#6B7B73] focus:border-[#286D58]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
          >
            Track Project
          </button>
        </form>

        {notFound && (
          <div className="mt-3 p-3 bg-red-950/40 border border-red-900/60 rounded text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Order reference not found. Please try sample reference <strong>VX-9042</strong> or <strong>VX-8105</strong>.</span>
          </div>
        )}
      </div>

      {/* Active Record Detail Banner */}
      <div className="bg-[#141A17] border border-[#24302A] rounded-lg p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#6B7B73] uppercase text-[10px] block">Project Reference & Client</span>
            <span className="text-white font-bold text-sm">{activeRecord.orderId}</span>
            <span className="text-[#9EADA5] block text-[11px] mt-0.5">{activeRecord.customerName}</span>
          </div>

          <div>
            <span className="text-[#6B7B73] uppercase text-[10px] block">Installation Location & Target</span>
            <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#286D58]" /> {activeRecord.location}
            </span>
            <span className="text-[#9EADA5] block text-[11px] mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#286D58]" /> Scheduled: {activeRecord.installationDate}
            </span>
          </div>

          <div>
            <span className="text-[#6B7B73] uppercase text-[10px] block">Lead Electrical Engineer</span>
            <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3.5 h-3.5 text-[#286D58]" /> {activeRecord.assignedTechnician.name}
            </span>
            <span className="text-[#9EADA5] block text-[10px] mt-0.5">
              {activeRecord.assignedTechnician.leadCert}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1B2420] text-xs">
          <span className="text-[#6B7B73] font-mono uppercase text-[10px] block">Allocated System Hardware:</span>
          <span className="text-[#E6ECE8] font-medium">{activeRecord.systemSummary}</span>
        </div>
      </div>

      {/* 6-Stage Milestone Progress Tracker */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2">
          Engineering & Logistics Stages (06 Milestones)
        </h3>

        <div className="space-y-3">
          {activeRecord.stages.map((stage, idx) => {
            const isDone = stage.completed;
            const isCurrent = stage.current;
            const isPending = !isDone && !isCurrent;

            return (
              <div
                key={stage.key}
                className={`p-4 rounded border transition-all flex items-start gap-4 ${
                  isCurrent 
                    ? 'bg-[#141A17] border-[#286D58] ring-1 ring-[#286D58]/50' 
                    : isDone 
                    ? 'bg-[#141A17]/70 border-[#24302A]' 
                    : 'bg-[#0E1311]/40 border-[#1B2420] opacity-60'
                }`}
              >
                {/* Milestone Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-[#D97706] animate-pulse">
                      <Clock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#1A221E] border border-[#24302A] flex items-center justify-center text-[#6B7B73] font-mono text-[10px]">
                      0{idx + 1}
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isCurrent ? 'text-[#D97706]' : isDone ? 'text-white' : 'text-[#9EADA5]'}`}>
                      {stage.title}
                    </h4>
                    {stage.date && (
                      <span className="text-[10px] font-mono text-[#6B7B73]">
                        {stage.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9EADA5] mt-1 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 hidden sm:block">
                  {isDone && (
                    <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded uppercase">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded uppercase">
                      Active Stage
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-mono bg-[#141A17] text-[#6B7B73] border border-[#24302A] px-2 py-0.5 rounded uppercase">
                      Queued
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Documents & Compliance Records */}
      <div className="mt-8 pt-6 border-t border-[#24302A] space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
          Handover Documentation & Compliance Vault
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeRecord.documents.map((doc, idx) => (
            <div 
              key={idx}
              className="p-3 bg-[#141A17] border border-[#24302A] rounded flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#286D58] shrink-0" />
                <div className="min-w-0">
                  <span className="text-white font-medium truncate block text-[11px]">{doc.name}</span>
                  <span className="text-[10px] font-mono text-[#6B7B73]">{doc.date} • {doc.size}</span>
                </div>
              </div>
              <button 
                onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                className="p-1.5 text-[#9EADA5] hover:text-white rounded border border-[#24302A] hover:bg-[#1A221E] shrink-0"
                title="Download Document"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
