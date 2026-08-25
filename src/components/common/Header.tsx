import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sun, 
  Moon,
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  UserCircle, 
  Calculator,
  Wrench,
  Layers,
  FileText,
  HelpCircle,
  PhoneCall,
  Activity,
  Home,
  Building2,
  Zap,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setCurrentRoute, openConfigurator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();

  const solutionsRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setCompanyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (route: string) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    setCompanyDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E1311] border-b border-[#24302A]">
      {/* Top Utility Bar */}
      <div className="bg-[#141A17] border-b border-[#1B2420] text-[#9EADA5] text-[11px] font-mono py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#E6ECE8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              SANS 10142-1-2 Certified Installation
            </span>
            <span className="hidden md:inline text-[#6B7B73]">•</span>
            <span className="hidden md:inline text-[#6B7B73]">
              South African SSEG Grid Registered
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <button 
                onClick={() => handleNav('admin')}
                className="px-2 py-0.5 bg-[#D97706]/20 border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-black rounded text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Admin CMS</span>
              </button>
            )}

            <button 
              onClick={() => handleNav('tracking')}
              className="text-[#9EADA5] hover:text-white transition-colors hidden sm:flex items-center gap-1"
            >
              <Activity className="w-3 h-3 text-[#286D58]" />
              <span>Track Project</span>
            </button>
            
            <span className="text-[#6B7B73] hidden sm:inline">|</span>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleNav('portal')}
                  className="flex items-center gap-1 text-[#10B981] hover:text-white font-bold transition-colors"
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{currentUser?.name?.split(' ')[0] || 'My Account'}</span>
                </button>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="text-[#6B7B73] hover:text-red-400 p-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNav('login')}
                className="flex items-center gap-1 text-[#E6ECE8] hover:text-white transition-colors"
              >
                <Lock className="w-3 h-3 text-[#286D58]" />
                <span>Customer Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Clean Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Streamlined Brand Logo */}
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white uppercase">
                KINETIX
              </span>
              <span className="text-base sm:text-lg font-light text-[#9EADA5] uppercase tracking-tight">
                ENERGY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold tracking-wider text-[#9EADA5]">
            {/* Solutions Dropdown */}
            <div className="relative" ref={solutionsRef}>
              <button
                onClick={() => {
                  setSolutionsDropdownOpen(!solutionsDropdownOpen);
                  setCompanyDropdownOpen(false);
                }}
                className={`px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors uppercase ${
                  currentRoute === 'solar' || solutionsDropdownOpen
                    ? 'text-white bg-[#141A17]' 
                    : 'hover:text-white hover:bg-[#141A17]/60'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsDropdownOpen ? 'rotate-180 text-[#286D58]' : 'text-[#6B7B73]'}`} />
              </button>

              {/* Dropdown Menu */}
              {solutionsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#141A17] border border-[#24302A] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleNav('solar')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 rounded bg-[#0E1311] border border-[#24302A] text-[#286D58] mt-0.5">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase group-hover:text-[#286D58] transition-colors">Residential Solar</div>
                      <div className="text-[11px] text-[#9EADA5] font-normal leading-tight">Hybrid backup and bill offset for homes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('solar')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 rounded bg-[#0E1311] border border-[#24302A] text-[#286D58] mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase group-hover:text-[#286D58] transition-colors">Commercial 3-Phase</div>
                      <div className="text-[11px] text-[#9EADA5] font-normal leading-tight">Peak-shaving and Section 12B tax relief</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('solar')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 rounded bg-[#0E1311] border border-[#24302A] text-[#286D58] mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase group-hover:text-[#286D58] transition-colors">Battery Storage</div>
                      <div className="text-[11px] text-[#9EADA5] font-normal leading-tight">Loadshedding backup systems</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNav('solar')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] transition-colors flex items-start gap-3 group border-t border-[#1B2420] mt-1 pt-2"
                  >
                    <div className="p-1.5 rounded bg-[#0E1311] border border-[#24302A] text-[#286D58] mt-0.5">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase group-hover:text-[#286D58] transition-colors">System Upgrades</div>
                      <div className="text-[11px] text-[#9EADA5] font-normal leading-tight">Add panels, inverters, or battery racks</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Primary Links */}
            <button
              onClick={() => handleNav('shop')}
              className={`px-3.5 py-2 rounded transition-colors uppercase ${
                currentRoute === 'shop' ? 'text-white bg-[#141A17]' : 'hover:text-white hover:bg-[#141A17]/60'
              }`}
            >
              Shop
            </button>

            <button
              onClick={() => handleNav('installation')}
              className={`px-3.5 py-2 rounded transition-colors uppercase ${
                currentRoute === 'installation' ? 'text-white bg-[#141A17]' : 'hover:text-white hover:bg-[#141A17]/60'
              }`}
            >
              Installation
            </button>

            <button
              onClick={() => handleNav('maintenance')}
              className={`px-3.5 py-2 rounded transition-colors uppercase ${
                currentRoute === 'maintenance' ? 'text-white bg-[#141A17]' : 'hover:text-white hover:bg-[#141A17]/60'
              }`}
            >
              Maintenance
            </button>

            <button
              onClick={() => handleNav('calculator')}
              className={`px-3.5 py-2 rounded transition-colors uppercase ${
                currentRoute === 'calculator' ? 'text-white bg-[#141A17]' : 'hover:text-white hover:bg-[#141A17]/60'
              }`}
            >
              Calculator
            </button>

            {/* Company / Info Dropdown */}
            <div className="relative" ref={companyRef}>
              <button
                onClick={() => {
                  setCompanyDropdownOpen(!companyDropdownOpen);
                  setSolutionsDropdownOpen(false);
                }}
                className={`px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors uppercase ${
                  ['about', 'resources', 'faq', 'contact'].includes(currentRoute) || companyDropdownOpen
                    ? 'text-white bg-[#141A17]' 
                    : 'hover:text-white hover:bg-[#141A17]/60'
                }`}
              >
                <span>Company</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${companyDropdownOpen ? 'rotate-180 text-[#286D58]' : 'text-[#6B7B73]'}`} />
              </button>

              {/* Dropdown Menu */}
              {companyDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#141A17] border border-[#24302A] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <button
                    onClick={() => handleNav('about')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] text-white hover:text-[#286D58] transition-colors uppercase font-medium flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#286D58]" /> About Us
                  </button>
                  <button
                    onClick={() => handleNav('resources')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] text-white hover:text-[#286D58] transition-colors uppercase font-medium flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#286D58]" /> Guides & Glossary
                  </button>
                  <button
                    onClick={() => handleNav('faq')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] text-white hover:text-[#286D58] transition-colors uppercase font-medium flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#286D58]" /> Technical FAQ
                  </button>
                  <button
                    onClick={() => handleNav('contact')}
                    className="w-full p-2.5 rounded text-left hover:bg-[#1A221E] text-white hover:text-[#286D58] transition-colors uppercase font-medium flex items-center gap-2 border-t border-[#1B2420] mt-1 pt-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#286D58]" /> Contact Engineering
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Utility */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded bg-[#141A17] border border-[#24302A] text-[#9EADA5] hover:text-white hover:border-[#31423A] transition-colors"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D97706]" /> : <Moon className="w-4 h-4 text-[#286D58]" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded bg-[#141A17] border border-[#24302A] text-[#9EADA5] hover:text-white hover:border-[#31423A] transition-colors"
              title="View Equipment Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1B4D3E] text-white text-[9px] font-mono font-bold flex items-center justify-center border border-[#0E1311]">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Single High-Contrast Primary CTA */}
            <button
              onClick={openConfigurator}
              className="px-4 py-2.5 text-xs font-mono font-bold text-white bg-[#1B4D3E] hover:bg-[#286D58] border border-[#286D58] rounded transition-colors uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <span>Get a Solar Quote</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-[#141A17] border border-[#24302A] text-[#9EADA5]"
              title="Toggle Theme"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D97706]" /> : <Moon className="w-4 h-4 text-[#286D58]" />}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded bg-[#141A17] border border-[#24302A] text-white"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1B4D3E] text-white text-[8px] font-mono font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#141A17] border border-[#24302A] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Grouped Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E1311] border-b border-[#24302A] px-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7B73] px-2 block mb-2">
                Core Sizing & Hardware
              </span>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { label: 'Solar Solutions', route: 'solar' },
                  { label: 'Shop Equipment', route: 'shop' },
                  { label: 'Installation & CoC', route: 'installation' },
                  { label: 'Maintenance SLAs', route: 'maintenance' },
                  { label: 'Energy & Payback Calculator', route: 'calculator' },
                ].map(item => (
                  <button
                    key={item.route}
                    onClick={() => handleNav(item.route)}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-mono uppercase font-semibold flex items-center justify-between ${
                      currentRoute === item.route ? 'bg-[#141A17] text-white border border-[#24302A]' : 'text-[#9EADA5]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#6B7B73]" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7B73] px-2 block mb-2">
                Account & Governance
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {isAuthenticated ? (
                  <button
                    onClick={() => handleNav('portal')}
                    className="p-2.5 bg-[#1B4D3E] border border-[#286D58] text-white rounded text-center uppercase font-bold"
                  >
                    My Account
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('login')}
                    className="p-2.5 bg-[#141A17] border border-[#24302A] text-white rounded text-center uppercase"
                  >
                    Sign In / Register
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="p-2.5 bg-[#D97706]/20 border border-[#D97706] text-[#D97706] rounded text-center uppercase font-bold"
                  >
                    ⚡ Admin CMS
                  </button>
                )}

                <button
                  onClick={() => handleNav('tracking')}
                  className="p-2.5 bg-[#141A17] border border-[#24302A] text-white rounded text-center uppercase"
                >
                  Track Project
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className="p-2.5 bg-[#141A17] border border-[#24302A] text-[#9EADA5] rounded text-center uppercase"
                >
                  About Us
                </button>
                <button
                  onClick={() => handleNav('contact')}
                  className="p-2.5 bg-[#141A17] border border-[#24302A] text-[#9EADA5] rounded text-center uppercase"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1B2420]">
            <button
              onClick={() => {
                openConfigurator();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-xs font-mono font-bold text-white bg-[#1B4D3E] rounded uppercase tracking-wider text-center"
            >
              Get a Solar Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
