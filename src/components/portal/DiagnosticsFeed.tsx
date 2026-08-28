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
    <div className="bg-[#141A17]/90 backdrop-blur-xl border border-[#24302A] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl font-mono">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-[#24302A] pb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Engineering & Diagnostics Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[10px] text-[#10B981] hover:underline"
            >
              Mark All Read
            </button>
          )}
          <span className="px-2 py-0.5 bg-[#0E1311] border border-[#24302A] text-[#9EADA5] rounded text-[10px] font-bold">
            {unreadCount} NEW
          </span>
        </div>
      </div>

      {/* Notifications Drawer */}
      <div className="space-y-3 text-xs">
        {notifications.length > 0 ? (
          notifications.map(notif => {
            const isSuccess = notif.type === 'success';
            const isWarning = notif.type === 'warning';
            const isTransit = notif.type === 'in_transit';

            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                  notif.read
                    ? 'bg-[#0E1311]/70 border-[#24302A] text-[#9EADA5]'
                    : 'bg-[#0E1311] border-[#10B981]/60 text-white shadow-md'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border ${
                      isSuccess
                        ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                        : isWarning
                        ? 'bg-[#D97706]/15 border-[#D97706]/40 text-[#D97706]'
                        : isTransit
                        ? 'bg-[#1B4D3E]/40 border-[#286D58] text-[#10B981]'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5]'
                    }`}>
                      {notif.type}
                    </span>
                    <strong className="text-white text-xs">{notif.title}</strong>
                  </div>
                  <p className="text-[11px] text-[#9EADA5] leading-relaxed">{notif.description}</p>
                  <span className="text-[9px] text-[#6B7B73] block">{notif.createdAt}</span>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="px-2 py-1 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#10B981] text-[9px] text-[#10B981] font-bold rounded shrink-0 transition-colors"
                  >
                    Read
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="space-y-2.5">
            <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                <div>
                  <span className="text-white font-bold block text-[11px]">Bench-Testing Passed (1000V DC)</span>
                  <span className="text-[10px] text-[#9EADA5]">Sandton Hub QA Certification</span>
                </div>
              </div>
              <span className="text-[9px] text-[#10B981] font-bold">VERIFIED</span>
            </div>

            <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
                <div>
                  <span className="text-white font-bold block text-[11px]">Spring Solar Yield Diagnostic Ready</span>
                  <span className="text-[10px] text-[#9EADA5]">High UV Solar Irradiance Window</span>
                </div>
              </div>
              <button
                onClick={onRequestService}
                className="px-2 py-1 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-[9px] text-white font-bold rounded"
              >
                Schedule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Service Dispatch Trigger */}
      <div className="pt-2 border-t border-[#24302A] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#6B7B73]">Need certified technician support?</span>
        <button
          onClick={onRequestService}
          className="text-[#10B981] hover:text-white font-bold flex items-center gap-1 transition-colors text-[11px]"
        >
          <span>Dispatch Ticket</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
