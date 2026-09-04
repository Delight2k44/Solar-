import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  User, 
  SlidersHorizontal,
  Wrench,
  Layers,
  FileText,
  Calculator,
  Activity,
  HelpCircle,
  ShieldCheck,
  Zap,
  Building2,
  Home,
  LogOut,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setCurrentRoute, openConfigurator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [segmentMode, setSegmentMode] = useState<'personal' | 'business'>('personal');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

  const solutionsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSegmentSwitch = (mode: 'personal' | 'business') => {
    setSegmentMode(mode);
    if (mode === 'business') {
      handleNav('commercial');
    } else {
      handleNav('home');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#05070A]/90 backdrop-blur-2xl border-b border-[#1E2530] shadow-lg transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between font-sans">
        
        {/* ========================================================================= */}
        {/* 1. LEFT: STARLINK-STYLE WORDMARK + DESKTOP TEXT LINKS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
          {/* Starlink-Style Tracked Bold Wordmark */}
          <button 
            onClick={() => handleNav('home')}
            className="text-white font-extrabold tracking-[0.22em] sm:tracking-[0.25em] text-sm sm:text-base uppercase hover:opacity-80 transition-opacity drop-shadow-md shrink-0"
          >
            KINETIX
          </button>

          {/* Desktop Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-xs font-semibold text-[#CBD5E1] drop-shadow-sm">
            
            {/* Solutions Dropdown */}
            <div className="relative" ref={solutionsRef}>
              <button
                onClick={() => {
                  setSolutionsOpen(!solutionsOpen);
                  setResourcesOpen(false);
                }}
                className={`flex items-center gap-1.5 hover:text-white transition-colors py-2 ${
                  solutionsOpen || currentRoute === 'solar' || currentRoute === 'shop' || currentRoute === 'commercial' ? 'text-white' : ''
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${solutionsOpen ? 'rotate-180 text-[#00D2FF]' : ''}`} />
              </button>

              {/* Solutions Floating Mega Menu */}
              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl space-y-1 text-xs animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handleNav('solar')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block text-xs">Residential Solar Kits</strong>
                      <span className="text-[10px] text-[#64748B]">Turnkey 5kW - 12kW Home Hybrid Systems</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('commercial')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block text-xs">Commercial Microgrids</strong>
                      <span className="text-[10px] text-[#64748B]">50kW+ Commercial Solar & Section 12B Tax</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('shop')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block text-xs">Hardware Store</strong>
                      <span className="text-[10px] text-[#64748B]">Inverters, LiFePO4 Batteries & Solar Panels</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('installation')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block text-xs">DoL Master Installation</strong>
                      <span className="text-[10px] text-[#64748B]">SANS 10142-1-2 Protocol & CoC Sign-Off</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => {
                  setResourcesOpen(!resourcesOpen);
                  setSolutionsOpen(false);
                }}
                className={`flex items-center gap-1.5 hover:text-white transition-colors py-2 ${
                  resourcesOpen || currentRoute === 'resources' || currentRoute === 'faq' ? 'text-white' : ''
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${resourcesOpen ? 'rotate-180 text-[#00D2FF]' : ''}`} />
              </button>

              {/* Resources Floating Menu */}
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl space-y-1 text-xs animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      openConfigurator();
                      setResourcesOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-[#00D2FF]" />
                    <div>
                      <strong className="text-white block text-xs">Solar System Configurator</strong>
                      <span className="text-[10px] text-[#64748B]">Calculate kW capacity & ROI</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('tracking')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Activity className="w-4 h-4 text-[#00D2FF]" />
                    <div>
                      <strong className="text-white block text-xs">Live Order & Freight Tracker</strong>
                      <span className="text-[10px] text-[#64748B]">RAM Logistics waybill inspection</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('resources')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#00D2FF]" />
                    <div>
                      <strong className="text-white block text-xs">SANS Standards & Guides</strong>
                      <span className="text-[10px] text-[#64748B]">South African regulatory compliance</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('faq')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center gap-3 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#00D2FF]" />
                    <div>
                      <strong className="text-white block text-xs">Technical FAQ</strong>
                      <span className="text-[10px] text-[#64748B]">Common solar engineering questions</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Service Plans */}
            <button
              onClick={() => handleNav('maintenance')}
              className={`hover:text-white transition-colors ${
                currentRoute === 'maintenance' ? 'text-white' : ''
              }`}
            >
              Service Plans
            </button>
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* 2. RIGHT CONTROLS: DESKTOP PILL + PROFILE + CART | MOBILE CLEAN ICONS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Admin Operations Pill (Desktop only) */}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#00D2FF]/20 backdrop-blur-md border border-[#00D2FF]/50 text-[#00D2FF] hover:bg-[#00D2FF] hover:text-black rounded-lg text-[11px] font-mono font-bold uppercase transition-all shadow-sm"
              title="Admin Operations Hub"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Admin Hub</span>
            </button>
          )}

          {/* Starlink Segmented Pill: [ Personal | Business ] (Desktop & Tablet only) */}
          <div className="hidden md:flex bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-lg p-0.5 items-center text-xs font-semibold shadow-sm transition-all">
            <button
              onClick={() => handleSegmentSwitch('personal')}
              className={`px-3 py-1 rounded-md transition-all ${
                segmentMode === 'personal' && currentRoute !== 'commercial' && currentRoute !== 'business'
                  ? 'bg-white/25 text-white font-bold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => handleSegmentSwitch('business')}
              className={`px-3 py-1 rounded-md transition-all ${
                segmentMode === 'business' || currentRoute === 'commercial' || currentRoute === 'business'
                  ? 'bg-white/25 text-white font-bold shadow-sm'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              Business
            </button>
          </div>

          {/* South Africa Region Globe Icon (Desktop only) */}
          <button
            onClick={() => alert('Region: South Africa (Eskom / SSEG Tariffs • ZAR currency)')}
            title="Region: South Africa (ZAR)"
            className="hidden md:flex w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-[#E2E8F0] hover:text-white items-center justify-center transition-colors shadow-sm"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* User Profile / Customer Portal Button (Desktop only) */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              title={isAuthenticated ? `Signed in as ${currentUser?.name}` : 'Sign In / Customer Portal'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                isAuthenticated
                  ? 'bg-[#00D2FF]/25 border-[#00D2FF]/60 text-[#00D2FF]'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/15 text-[#E2E8F0] hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-2xl space-y-1 text-xs animate-in fade-in zoom-in-95">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 border-b border-white/10">
                      <strong className="text-white block truncate">{currentUser?.name}</strong>
                      <span className="text-[10px] text-[#64748B] block truncate">{currentUser?.email}</span>
                    </div>

                    <button
                      onClick={() => handleNav('portal')}
                      className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-white flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>Customer Asset Portal</span>
                    </button>

                    <button
                      onClick={() => handleNav('tracking')}
                      className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-white flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>Track Active Order</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-[#00D2FF] flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Admin Operations Hub</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-red-950/30 text-left text-red-400 flex items-center gap-2 border-t border-white/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-white/10 text-[11px] text-[#94A3B8]">
                      Sign in to view your solar assets and track installation.
                    </div>
                    <button
                      onClick={() => handleNav('login')}
                      className="w-full p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-center block mt-1"
                    >
                      Customer Sign In
                    </button>
                    <button
                      onClick={() => handleNav('tracking')}
                      className="w-full p-2 rounded-xl hover:bg-white/5 text-center text-[#94A3B8] hover:text-white block text-[11px]"
                    >
                      Track Order with Waybill
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon Button (Visible on both Desktop & Mobile) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-[#E2E8F0] hover:text-white flex items-center justify-center transition-colors relative shadow-sm shrink-0"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00D2FF] text-black text-[9px] font-extrabold flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger Button (iPhone 15 Pro Optimized) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NATIVE MOBILE SLIDEOUT DRAWER (iPhone 15 Pro Friendly) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-[#05070A]/98 backdrop-blur-3xl border-t border-white/10 p-5 overflow-y-auto space-y-6 font-sans animate-in slide-in-from-top-4 duration-300">
          
          {/* Segmented Switch on Mobile */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-1 flex items-center text-xs font-semibold">
            <button
              onClick={() => handleSegmentSwitch('personal')}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                segmentMode === 'personal' && currentRoute !== 'commercial' && currentRoute !== 'business'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Personal Solutions
            </button>
            <button
              onClick={() => handleSegmentSwitch('business')}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                segmentMode === 'business' || currentRoute === 'commercial' || currentRoute === 'business'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Business 50kW+
            </button>
          </div>

          {/* Core Navigation Links */}
          <div className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => handleNav('solar')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-[#00D2FF]" />
                <span>Residential Solar Kits</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('commercial')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#00D2FF]" />
                <span>Commercial Microgrids & Section 12B</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('shop')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#00D2FF]" />
                <span>Solar Hardware Store</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('installation')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-[#00D2FF]" />
                <span>DoL Master Installation Standards</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('maintenance')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                <span>Service Plans & 24/7 SLA</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('tracking')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-[#00D2FF]" />
                <span>Track Active Order & Freight</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNav('faq')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-[#00D2FF]" />
                <span>Technical FAQ & Knowledge Base</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#64748B]" />
            </button>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-3 font-mono">
            <button
              onClick={() => {
                openConfigurator();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 bg-white text-black font-bold uppercase text-xs rounded-xl text-center shadow-lg"
            >
              Calculate Solar Capacity
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => handleNav('portal')}
                className="w-full py-3.5 bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] font-bold uppercase text-xs rounded-xl text-center"
              >
                Customer Asset Portal ({currentUser?.name})
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full py-3.5 bg-white/10 border border-white/20 text-white font-bold uppercase text-xs rounded-xl text-center"
              >
                Customer Sign In
              </button>
            )}

            <a
              href="https://wa.me/27787808569"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold uppercase text-xs rounded-xl text-center flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Support (078 780 8569)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
