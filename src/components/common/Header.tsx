import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Globe, 
  User, 
  SlidersHorizontal,
  Wrench,
  FileText,
  Calculator,
  Activity,
  HelpCircle,
  Building2,
  Home,
  LogOut,
  MessageCircle,
  Sun,
  Zap,
  Battery,
  Package,
  Layers,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
  onSelectShopCategory?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRoute, 
  setCurrentRoute, 
  openConfigurator,
  onSelectShopCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [mobileProductsExpanded, setMobileProductsExpanded] = useState(false);
  const [mobileSolutionsExpanded, setMobileSolutionsExpanded] = useState(false);
  const [mobileResourcesExpanded, setMobileResourcesExpanded] = useState(false);
  const [segmentMode, setSegmentMode] = useState<'personal' | 'business'>('personal');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showRegionNotice, setShowRegionNotice] = useState(false);
  
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

  const solutionsRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const resourcesMegaMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsMegaMenuRef = useRef<HTMLDivElement>(null);

  // Computed state: any of the full-width studio mega menus open
  const isMegaMenuOpen = solutionsOpen || productsOpen || resourcesOpen;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        solutionsRef.current && 
        !solutionsRef.current.contains(target) &&
        (!megaMenuRef.current || !megaMenuRef.current.contains(target))
      ) {
        setSolutionsOpen(false);
      }
      if (
        resourcesRef.current && 
        !resourcesRef.current.contains(target) &&
        (!resourcesMegaMenuRef.current || !resourcesMegaMenuRef.current.contains(target))
      ) {
        setResourcesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (
        productsRef.current && 
        !productsRef.current.contains(target) &&
        (!productsMegaMenuRef.current || !productsMegaMenuRef.current.contains(target))
      ) {
        setProductsOpen(false);
        setActiveSubCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNav = (route: string, shopCat?: string) => {
    if (shopCat && onSelectShopCategory) {
      onSelectShopCategory(shopCat);
    }
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setProductsOpen(false);
    setActiveSubCategory(null);
    setMobileProductsExpanded(false);
    setMobileSolutionsExpanded(false);
    setMobileResourcesExpanded(false);
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isMegaMenuOpen
        ? 'bg-white/95 backdrop-blur-2xl border-b border-neutral-200 shadow-md text-neutral-900'
        : 'bg-white/[0.03] backdrop-blur-2xl sm:backdrop-blur-3xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.08)] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between font-sans">
        
        {/* ========================================================================= */}
        {/* 1. LEFT: STARLINK-STYLE WORDMARK (Aligned Left) */}
        {/* ========================================================================= */}
        <div className="flex-1 flex items-center justify-start">
          <button 
            onClick={() => handleNav('home')}
            className={`font-extrabold tracking-[0.22em] sm:tracking-[0.25em] text-sm sm:text-base uppercase hover:opacity-80 transition-all shrink-0 cursor-pointer ${
              isMegaMenuOpen ? 'text-neutral-950' : 'text-white drop-shadow-md'
            }`}
          >
            KINETIX
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTER: DESKTOP CLEAN NAVIGATION LINKS (Consistent Pill Styling) */}
        {/* ========================================================================= */}
        <nav className={`hidden md:flex items-center justify-center gap-1 sm:gap-2 text-xs font-semibold ${
          isMegaMenuOpen ? 'text-neutral-600' : 'text-[#CBD5E1] drop-shadow-sm'
        }`}>
          
          {/* Solutions Dropdown Trigger */}
          <div className="relative" ref={solutionsRef}>
            <button
              onClick={() => {
                setSolutionsOpen(!solutionsOpen);
                setProductsOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                solutionsOpen
                  ? 'bg-neutral-100 text-neutral-950 shadow-inner'
                  : isMegaMenuOpen
                  ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  : currentRoute === 'solar' || currentRoute === 'commercial'
                  ? 'bg-white/15 text-white shadow-inner backdrop-blur-md border border-white/20'
                  : 'hover:text-white hover:bg-white/10 text-[#CBD5E1]'
              }`}
            >
              <span>Solutions</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                solutionsOpen ? 'rotate-180 text-neutral-950' : 'text-[#00D2FF]'
              }`} />
            </button>
          </div>

          {/* Products Dropdown Trigger (Matching Solutions Pill) */}
          <div className="relative" ref={productsRef}>
            <button
              onClick={() => {
                setProductsOpen(!productsOpen);
                setSolutionsOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                productsOpen
                  ? 'bg-neutral-100 text-neutral-950 shadow-inner'
                  : isMegaMenuOpen
                  ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  : currentRoute === 'shop' || currentRoute === 'product'
                  ? 'bg-white/15 text-white shadow-inner backdrop-blur-md border border-white/20'
                  : 'hover:text-white hover:bg-white/10 text-[#CBD5E1]'
              }`}
            >
              <span>Products</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                productsOpen ? 'rotate-180 text-neutral-950' : 'text-[#00D2FF]'
              }`} />
            </button>
          </div>

          {/* Resources Dropdown Trigger (Matching Solutions Pill) */}
          <div className="relative" ref={resourcesRef}>
            <button
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setSolutionsOpen(false);
                setProductsOpen(false);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                resourcesOpen
                  ? 'bg-neutral-100 text-neutral-950 shadow-inner'
                  : isMegaMenuOpen
                  ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  : currentRoute === 'resources' || currentRoute === 'faq' || currentRoute === 'configurator'
                  ? 'bg-white/15 text-white shadow-inner backdrop-blur-md border border-white/20'
                  : 'hover:text-white hover:bg-white/10 text-[#CBD5E1]'
              }`}
            >
              <span>Resources</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                resourcesOpen ? 'rotate-180 text-neutral-950' : 'text-[#00D2FF]'
              }`} />
            </button>
          </div>
        </nav>

        {/* ========================================================================= */}
        {/* 2. RIGHT CONTROLS: DESKTOP PILL + PROFILE + CART | MOBILE CLEAN ICONS */}
        {/* ========================================================================= */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          
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
          <div className={`hidden md:flex rounded-lg p-0.5 items-center text-xs font-semibold shadow-sm transition-all ${
            solutionsOpen || productsOpen
              ? 'bg-neutral-100 border border-neutral-200'
              : 'bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20'
          }`}>
            <button
              onClick={() => handleSegmentSwitch('personal')}
              className={`px-3 py-1 rounded-md transition-all ${
                segmentMode === 'personal' && currentRoute !== 'commercial' && currentRoute !== 'business'
                  ? isMegaMenuOpen
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-white/25 text-white font-bold shadow-sm'
                  : isMegaMenuOpen
                  ? 'text-neutral-600 hover:text-black'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => handleSegmentSwitch('business')}
              className={`px-3 py-1 rounded-md transition-all ${
                segmentMode === 'business' || currentRoute === 'commercial' || currentRoute === 'business'
                  ? isMegaMenuOpen
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-white/25 text-white font-bold shadow-sm'
                  : isMegaMenuOpen
                  ? 'text-neutral-600 hover:text-black'
                  : 'text-[#CBD5E1] hover:text-white'
              }`}
            >
              Business
            </button>
          </div>

          {/* South Africa Region Globe Icon (Desktop only) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowRegionNotice(!showRegionNotice)}
              title="Region: South Africa (ZAR)"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                isMegaMenuOpen
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/15 text-[#E2E8F0] hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
            </button>
            {showRegionNotice && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-[#0D1117] border border-[#1E2530] rounded-xl shadow-2xl text-xs font-mono text-[#CBD5E1] space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-1.5 text-[#00D2FF] font-bold uppercase text-[10px]">
                  <span>🇿🇦 Active Market Region</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  South Africa (Eskom / SSEG Tariffs • ZAR currency • SANS 10142-1-2 standards)
                </p>
              </div>
            )}
          </div>

          {/* User Profile / Customer Portal Button (Desktop only) */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              title={isAuthenticated ? `Signed in as ${currentUser?.name}` : 'Sign In / Customer Portal'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                isAuthenticated
                  ? 'bg-[#00D2FF]/25 border-[#00D2FF]/60 text-[#00D2FF]'
                  : isMegaMenuOpen
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
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
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors relative shadow-sm shrink-0 ${
              isMegaMenuOpen
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-[#E2E8F0] hover:text-white'
            }`}
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
            className={`md:hidden w-9 h-9 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
              isMegaMenuOpen
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-900'
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white'
            }`}
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* TESLA MEGA MENU: EXACT SCREENSHOT PARITY (Clean Floating Studio Layout) */}
      {/* ========================================================================= */}
      {solutionsOpen && (
        <>
          {/* Backdrop Dimming Overlay */}
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            onClick={() => setSolutionsOpen(false)}
          />

          {/* Mega Menu Surface */}
          <div 
            ref={megaMenuRef}
            className="fixed top-16 sm:top-20 inset-x-0 z-50 bg-white border-b border-neutral-200 shadow-[0_30px_60px_rgba(0,0,0,0.18)] animate-in fade-in slide-in-from-top-1 duration-200 font-sans text-neutral-900"
          >
            <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10">
              {/* 4 Product Columns (Solar Panels, Powerwall, Megapack, Electricians) on Equal Baseline */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-end">
                
                {/* 1. Solar Panels */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('solar')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer pb-1 transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-solar-panels-menu.jpg"
                        alt="Solar Panels"
                        className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/solar-panel-mono.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-semibold text-[#171A20] mt-3.5 tracking-tight">
                    Solar Panels
                  </h4>
                  <div className="flex items-center justify-center gap-5 mt-1.5 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('configurator')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 2. Powerwall */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('configurator')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer pb-1 transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-powerwall-menu.jpg"
                        alt="Powerwall"
                        className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/lithium-battery-etower.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-semibold text-[#171A20] mt-3.5 tracking-tight">
                    Powerwall
                  </h4>
                  <div className="flex items-center justify-center gap-5 mt-1.5 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('configurator')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 3. Megapack */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('commercial')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer pb-1 transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-megapack-menu.jpg"
                        alt="Megapack"
                        className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/commercial-solar-sa.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-semibold text-[#171A20] mt-3.5 tracking-tight">
                    Megapack
                  </h4>
                  <div className="flex items-center justify-center mt-1.5 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('commercial')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Learn
                    </button>
                  </div>
                </div>

                {/* 4. Electricians */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('installation')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer pb-1 transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-electricians-menu.jpg"
                        alt="Electricians"
                        className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/electrician-wiring-db.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-semibold text-[#171A20] mt-3.5 tracking-tight">
                    Electricians
                  </h4>
                  <div className="flex items-center justify-center gap-5 mt-1.5 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('installation')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('installation')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TESLA MEGA MENU: PRODUCTS (High Quality Tesla Pictures & Studio Layout) */}
      {/* ========================================================================= */}
      {productsOpen && (
        <>
          {/* Backdrop Dimming Overlay */}
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            onClick={() => setProductsOpen(false)}
          />

          {/* Mega Menu Surface */}
          <div 
            ref={productsMegaMenuRef}
            className="fixed top-16 sm:top-20 inset-x-0 z-50 bg-white border-b border-neutral-200 shadow-[0_30px_60px_rgba(0,0,0,0.18)] animate-in fade-in slide-in-from-top-1 duration-200 font-sans text-neutral-900"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
              {/* 5 Product Columns on Equal Baseline with High-Quality Studio Pictures */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-end">
                
                {/* 1. Solar Panels */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('shop', 'solar-panels')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-44 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-solar-panels-menu.jpg"
                        alt="Solar Panels"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/solar-panel-mono.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Solar Panels
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase font-bold">Tier-1</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'solar-panels')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 2. Hybrid Inverters */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('shop', 'inverters')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-44 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-solar-inverter-menu.jpg"
                        alt="Hybrid Inverters"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hybrid-inverter-deye.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Hybrid Inverters
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase font-bold">Smart</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'inverters')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'inverters')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 3. LiFePO4 Batteries (The Battery Side) */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('shop', 'batteries')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-44 h-36 flex items-center justify-center">
                      <img
                        src="/lithium-battery-etower.jpg"
                        alt="LiFePO4 Lithium Batteries"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/tesla-powerwall-menu.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      LiFePO4 Batteries
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase font-bold">Storage</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'batteries')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'batteries')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 4. Powerwall */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('shop', 'batteries')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-44 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-powerwall-menu.jpg"
                        alt="Tesla Powerwall"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/lithium-battery-etower.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Powerwall
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#00D2FF]/20 text-[#008db3] uppercase font-bold">13.5kWh</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'batteries')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 5. Solar Roof & Kits */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('shop', 'complete-kits')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-44 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-solar-roof-menu.jpg"
                        alt="Solar Roof & Kits"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Solar Roof &amp; Kits
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase font-bold">Turnkey</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('shop', 'complete-kits')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Order
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Action: View All Products */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleNav('shop', 'all')}
                  className="inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full bg-[#171A20] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 shadow-xs hover:shadow-md hover:scale-[1.02] cursor-pointer group"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#00D2FF]" />
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TESLA MEGA MENU: RESOURCES (High Quality Studio Layout)                   */}
      {/* ========================================================================= */}
      {resourcesOpen && (
        <>
          {/* Backdrop Dimming Overlay */}
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            onClick={() => setResourcesOpen(false)}
          />

          {/* Mega Menu Surface */}
          <div 
            ref={resourcesMegaMenuRef}
            className="fixed top-16 sm:top-20 inset-x-0 z-50 bg-white border-b border-neutral-200 shadow-[0_30px_60px_rgba(0,0,0,0.18)] animate-in fade-in slide-in-from-top-1 duration-200 font-sans text-neutral-900"
          >
            <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10">
              {/* 4 Resource Columns on Equal Baseline with High-Quality Pictures */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                
                {/* 1. Design Studio */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('configurator')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-design-studio-menu.jpg"
                        alt="Tesla Solar Design Studio"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Design Studio
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#00D2FF]/20 text-[#008db3] uppercase font-bold">3D</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('configurator')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Design
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('solar')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                  </div>
                </div>

                {/* 2. Solar Capacity Sizer */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => { setResourcesOpen(false); openConfigurator(); }}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-calculator-menu.jpg"
                        alt="Solar Capacity Sizer"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cad-solar-audit.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Capacity Sizer
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase font-bold">ROI</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => { setResourcesOpen(false); openConfigurator(); }}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Calculate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('resources')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Learn
                    </button>
                  </div>
                </div>

                {/* 3. Live Freight & Order Tracker */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('tracking')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-tracking-menu.jpg"
                        alt="Live Order & Freight Tracking"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/commercial-solar-sa.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      Order Tracking
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 uppercase font-bold">Live</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('tracking')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Track Order
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('portal')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Portal
                    </button>
                  </div>
                </div>

                {/* 4. SANS Standards & Guides */}
                <div className="flex flex-col items-center text-center group">
                  <div 
                    onClick={() => handleNav('resources')}
                    className="w-full h-36 sm:h-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  >
                    <div className="w-48 h-36 flex items-center justify-center">
                      <img
                        src="/tesla-docs-menu.jpg"
                        alt="SANS 10142 Standards & Guides"
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cad-solar-audit.jpg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-center gap-1.5 mt-3">
                    <h4 className="text-base font-semibold text-[#171A20] tracking-tight">
                      SANS 10142 Guides
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase font-bold">CoC</span>
                  </div>
                  <div className="h-6 flex items-center justify-center gap-5 mt-1 text-xs sm:text-sm font-normal text-[#5C5E62]">
                    <button
                      type="button"
                      onClick={() => handleNav('resources')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      Standards
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('faq')}
                      className="underline underline-offset-4 decoration-[#B3B4B6] hover:decoration-[#171A20] hover:text-[#171A20] transition-colors cursor-pointer font-medium"
                    >
                      FAQs
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

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
            {/* Tesla-Style Solutions Accordion */}
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setMobileSolutionsExpanded(!mobileSolutionsExpanded)}
                className="w-full p-3 bg-white/5 hover:bg-white/10 text-left text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold">Solutions</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${mobileSolutionsExpanded ? 'rotate-180 text-[#00D2FF]' : ''}`} />
              </button>
              {mobileSolutionsExpanded && (
                <div className="bg-white/[0.02] border-t border-white/5 p-3 space-y-2.5 font-sans">
                  {/* Solar Panels */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-solar-panels-menu.jpg" alt="Solar Panels" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Solar Panels</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Rooftop Generation</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('configurator'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Powerwall */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-powerwall-menu.jpg" alt="Powerwall" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Powerwall</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Home Battery Backup</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('configurator'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Megapack */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-megapack-menu.jpg" alt="Megapack" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Megapack</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Commercial 50kW+ BESS</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('commercial'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('commercial'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Electricians */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img 
                          src="/tesla-electricians-menu.jpg" 
                          alt="Electricians" 
                          className="w-full h-full object-contain mix-blend-multiply" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/electrician-wiring-db.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Electricians</div>
                        <div className="text-[10px] text-neutral-400 font-mono">DoL Master Electricians & CoC</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('installation'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('installation'); }} className="text-white font-semibold hover:underline">Book</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

            {/* Products Accordion (With High-Quality Tesla Pictures) */}
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setMobileProductsExpanded(!mobileProductsExpanded)}
                className="w-full p-3 bg-white/5 hover:bg-white/10 text-left text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold">Hardware Products</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${mobileProductsExpanded ? 'rotate-180 text-[#00D2FF]' : ''}`} />
              </button>
              {mobileProductsExpanded && (
                <div className="bg-white/[0.02] border-t border-white/5 p-3 space-y-2.5 font-sans">
                  {/* Solar Panels */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-solar-panels-menu.jpg" alt="Solar Panels" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Solar Panels</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Tier-1 N-Type TOPCon</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'solar-panels'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Hybrid Inverters */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-solar-inverter-menu.jpg" alt="Hybrid Inverters" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Hybrid Inverters</div>
                        <div className="text-[10px] text-neutral-400 font-mono">5kW - 50kW Smart</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'inverters'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'inverters'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* LiFePO4 Batteries */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/lithium-battery-etower.jpg" alt="LiFePO4 Batteries" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">LiFePO4 Batteries</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Rack &amp; Tower Storage</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'batteries'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'batteries'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Powerwall */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-powerwall-menu.jpg" alt="Powerwall" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Powerwall</div>
                        <div className="text-[10px] text-neutral-400 font-mono">13.5kWh Backup Storage</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'batteries'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Solar Roof & Kits */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-solar-roof-menu.jpg" alt="Solar Roof & Kits" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Solar Roof &amp; Kits</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Turnkey Pre-Engineered</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'complete-kits'); }} className="text-white font-semibold hover:underline">Order</button>
                    </div>
                  </div>

                  {/* Full catalog link */}
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleNav('shop', 'all'); }}
                    className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D2FF] text-xs font-mono text-center block mt-1"
                  >
                    View All Products →
                  </button>
                </div>
              )}
            </div>

            {/* Resources Accordion (With High-Quality Tesla Pictures) */}
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setMobileResourcesExpanded(!mobileResourcesExpanded)}
                className="w-full p-3 bg-white/5 hover:bg-white/10 text-left text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold">Engineering Resources</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${mobileResourcesExpanded ? 'rotate-180 text-[#00D2FF]' : ''}`} />
              </button>
              {mobileResourcesExpanded && (
                <div className="bg-white/[0.02] border-t border-white/5 p-3 space-y-2.5 font-sans">
                  {/* Design Studio */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-design-studio-menu.jpg" alt="Design Studio" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Design Studio</div>
                        <div className="text-[10px] text-neutral-400 font-mono">3D Solar &amp; Battery Configurator</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('configurator'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); openConfigurator(); }} className="text-white font-semibold hover:underline">Design</button>
                    </div>
                  </div>

                  {/* Capacity Sizer */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-calculator-menu.jpg" alt="Capacity Sizer" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Capacity Sizer</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Load &amp; Production Calculator</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('solar'); }} className="text-[#00D2FF] hover:underline">Learn</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); openConfigurator(); }} className="text-white font-semibold hover:underline">Calculate</button>
                    </div>
                  </div>

                  {/* Order Tracking */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-tracking-menu.jpg" alt="Order Tracking" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">Order Tracking</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Live RAM Waybill &amp; Dispatch</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('portal'); }} className="text-[#00D2FF] hover:underline">Portal</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('tracking'); }} className="text-white font-semibold hover:underline">Track</button>
                    </div>
                  </div>

                  {/* SANS 10142 Guides */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 flex items-center justify-center rounded bg-white p-0.5 shrink-0 shadow-xs">
                        <img src="/tesla-docs-menu.jpg" alt="SANS 10142 Guides" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs">SANS 10142 Guides</div>
                        <div className="text-[10px] text-neutral-400 font-mono">DoL Electrical Compliance &amp; CoC</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('resources'); }} className="text-[#00D2FF] hover:underline">Standards</button>
                      <span className="text-white/20">|</span>
                      <button onClick={() => { setMobileMenuOpen(false); handleNav('faq'); }} className="text-white font-semibold hover:underline">FAQs</button>
                    </div>
                  </div>

                  {/* Full resources link */}
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleNav('resources'); }}
                    className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D2FF] text-xs font-mono text-center block mt-1"
                  >
                    Explore All Knowledge Hub Articles →
                  </button>
                </div>
              )}
            </div>

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
