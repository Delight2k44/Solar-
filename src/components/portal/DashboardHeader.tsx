import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  LogOut, 
  SlidersHorizontal, 
  ArrowRight
} from 'lucide-react';
import { CustomerSite, UserProfile, SupportInfo } from '../../types/dashboard';
import { getInitials } from '../../utils/formatters';

interface DashboardHeaderProps {
  user: UserProfile;
  sites: CustomerSite[];
  activeSite: CustomerSite | null;
  support: SupportInfo;
  isAdmin?: boolean;
  onSelectSite: (siteId: string) => void;
  onRequestService: () => void;
  onNavigateToAdmin?: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  sites,
  activeSite,
  support,
  isAdmin = false,
  onSelectSite,
  onRequestService,
  onNavigateToAdmin,
  onLogout
}) => {
  const initials = getInitials(user?.name || 'Customer');

  return (
    <div className="space-y-4 font-sans">
      {/* Admin Quick Switcher Banner (Shown when Administrator is logged in) */}
      {isAdmin && onNavigateToAdmin && (
        <div className="bg-gradient-to-r from-[#00D2FF]/15 via-[#0D1117] to-[#10B981]/15 border border-[#00D2FF]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/20 border border-[#00D2FF]/40 flex items-center justify-center text-[#00D2FF] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                  Master Operations Center
                </h4>
                <span className="px-2 py-0.5 bg-[#00D2FF]/20 text-[#00D2FF] text-[10px] font-mono font-bold uppercase rounded-full">
                  Admin Privileges
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                You are authenticated as <strong>{user.email}</strong> with full read/write/pricing control.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToAdmin}
            className="px-5 py-2.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Admin Operations Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Executive User Profile Header */}
      <header className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* User Identity & Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2530] to-[#0D1117] border border-[#2D3748] flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {initials || 'DC'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-[#0D1117] rounded-full" title="Active Connection" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {user.name}
              </h2>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 bg-[#00D2FF]/15 border border-[#00D2FF]/30 text-[#00D2FF] text-[10px] font-bold uppercase rounded-full">
                  System Administrator
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold uppercase rounded-full">
                  Verified Client Account
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
              <span>{user.email}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-[#CBD5E1]">
                <MapPin className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{activeSite?.city || 'Johannesburg, South Africa'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRequestService}
            className="px-4 py-2.5 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#8B949E] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>Request Maintenance SLA</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-[#161B22] hover:bg-red-950/40 border border-[#30363D] hover:border-red-500/40 text-[#94A3B8] hover:text-red-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
    </div>
  );
};
