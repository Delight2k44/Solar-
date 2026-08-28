import React, { useState, useRef, useEffect } from 'react';
import { Sun, MapPin, ChevronDown, Wrench, LogOut, Check } from 'lucide-react';
import { CustomerSite, UserProfile, SupportInfo } from '../../types/dashboard';
import { getInitials } from '../../utils/formatters';

interface DashboardHeaderProps {
  user: UserProfile;
  sites: CustomerSite[];
  activeSite: CustomerSite | null;
  support: SupportInfo;
  onSelectSite: (siteId: string) => void;
  onRequestService: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  sites,
  activeSite,
  support,
  onSelectSite,
  onRequestService,
  onLogout
}) => {
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSiteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = getInitials(user.name);

  return (
    <header className="bg-[#141A17]/90 backdrop-blur-xl border border-[#24302A] rounded-2xl px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
      {/* Left: Brand Identity & Portal Pill */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white shadow-inner">
          <Sun className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-tight text-white uppercase">Kinetix Energy</span>
            <span className="px-2 py-0.5 bg-[#1B4D3E]/40 border border-[#286D58]/60 text-[#10B981] text-[9px] font-mono font-bold uppercase rounded-full tracking-wider">
              Asset Portal
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#6B7B73]">Renewable Energy Asset Management</span>
        </div>
      </div>

      {/* Right: Site Selector Dropdown + SLA Status + Profile + Quick Action */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        {/* Multi-Site Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#286D58] rounded-xl text-[#9EADA5] transition-colors text-left"
            title="Switch Active Property"
          >
            <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="truncate max-w-[170px] sm:max-w-[210px] font-medium text-white">
              {activeSite ? `${activeSite.address}` : 'Select Property'}
            </span>
            {sites.length > 1 && <ChevronDown className="w-3 h-3 text-[#6B7B73]" />}
          </button>

          {/* Dropdown Menu */}
          {isSiteDropdownOpen && sites.length > 0 && (
            <div className="absolute right-0 mt-1.5 w-72 bg-[#141A17] border border-[#24302A] rounded-xl shadow-2xl z-50 overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-[#24302A] text-[10px] font-bold text-[#6B7B73] uppercase tracking-wider">
                Select Active Site ({sites.length})
              </div>
              <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                {sites.map(site => (
                  <button
                    key={site.id}
                    onClick={() => {
                      onSelectSite(site.id);
                      setIsSiteDropdownOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left flex items-start justify-between gap-2 transition-colors ${
                      site.id === activeSite?.id
                        ? 'bg-[#1B4D3E]/30 border border-[#10B981]/50 text-white'
                        : 'hover:bg-[#0E1311] text-[#9EADA5] hover:text-white'
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="font-bold text-white truncate">{site.name}</div>
                      <div className="text-[10px] text-[#6B7B73] truncate">{site.address}, {site.city}</div>
                    </div>
                    {site.id === activeSite?.id && (
                      <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic SLA Status Pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-[11px] border ${
          support.isAvailable
            ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
            : 'bg-[#D97706]/10 border-[#D97706]/30 text-[#D97706]'
        }`}>
          <span className={`w-2 h-2 rounded-full ${support.isAvailable ? 'bg-[#10B981] animate-pulse' : 'bg-[#D97706]'}`} />
          <span>{support.slaStatus}</span>
        </div>

        {/* User Monogram Initials Avatar & Name */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#24302A]">
          <div className="w-7 h-7 rounded-lg bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white text-[11px] font-bold shadow-inner">
            {initials}
          </div>
          <span className="text-xs text-white font-semibold hidden sm:inline truncate max-w-[120px]">
            {user.name}
          </span>
        </div>

        {/* Ghost Service Request Button */}
        <button
          onClick={onRequestService}
          className="px-3 py-1.5 bg-transparent hover:bg-[#1A221E] border border-[#24302A] hover:border-[#286D58] text-[#E6ECE8] hover:text-white rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5"
        >
          <Wrench className="w-3 h-3 text-[#10B981]" />
          <span>Request Service</span>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          title="Sign Out"
          className="p-1.5 text-[#6B7B73] hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
