import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Truck, ArrowUpRight, Wrench } from 'lucide-react';
import { DashboardNotification } from '../../types/dashboard';

interface DiagnosticsFeedProps {
  notifications: DashboardNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRequestService: () => void;
}

export const DiagnosticsFeed: React.FC<DiagnosticsFeedProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRequestService
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl font-sans">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-[#1E2530] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
              Diagnostics & Telemetry Feed
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              Automated hardware logs, QA certifications & status alerts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-[#00D2FF] hover:underline font-semibold"
            >
              Mark All Read
            </button>
          )}
          <span className="px-2.5 py-0.5 bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] rounded-full text-[10px] font-mono font-bold">
            {unreadCount} NEW
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notif => {
            const isSuccess = notif.type === 'success';
            const isWarning = notif.type === 'warning';
            const isTransit = notif.type === 'in_transit';

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-3.5 transition-all ${
                  notif.read
                    ? 'bg-[#161B22]/50 border-[#21262D] text-[#94A3B8]'
                    : 'bg-[#161B22] border-[#00D2FF]/40 text-white shadow-md ring-1 ring-[#00D2FF]/20'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md border ${
                      isSuccess
                        ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                        : isWarning
                        ? 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
                        : isTransit
                        ? 'bg-[#00D2FF]/15 border-[#00D2FF]/40 text-[#00D2FF]'
                        : 'bg-[#1E2530] border-[#30363D] text-[#94A3B8]'
                    }`}>
                      {notif.type.replace('_', ' ')}
                    </span>
                    <strong className="text-xs font-semibold text-white truncate block">{notif.title}</strong>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{notif.description}</p>
                  <span className="text-[10px] font-mono text-[#64748B] block">{notif.createdAt}</span>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="px-2.5 py-1 bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-[10px] font-mono text-[#00D2FF] font-bold rounded-lg shrink-0 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="space-y-2.5">
            <div className="p-3.5 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <div>
                  <span className="text-white font-semibold block text-xs">Bench-Testing Passed (1000V DC)</span>
                  <span className="text-[11px] text-[#94A3B8]">Sandton Hub QA Verification Active</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold rounded">
                VERIFIED
              </span>
            </div>

            <div className="p-3.5 bg-[#161B22] border border-[#21262D] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <div>
                  <span className="text-white font-semibold block text-xs">Preventative Health Audit Recommended</span>
                  <span className="text-[11px] text-[#94A3B8]">Maximize summer PV yield production</span>
                </div>
              </div>
              <button
                onClick={onRequestService}
                className="px-2.5 py-1 bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] hover:border-[#F59E0B] text-[10px] text-white font-semibold rounded-lg transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Service Dispatch Trigger */}
      <div className="pt-3 border-t border-[#1E2530] flex items-center justify-between text-xs">
        <span className="text-xs text-[#94A3B8]">Need certified technician assistance?</span>
        <button
          onClick={onRequestService}
          className="text-[#00D2FF] hover:text-[#38BDF8] font-semibold flex items-center gap-1.5 transition-colors text-xs"
        >
          <span>Dispatch SLA Ticket</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
