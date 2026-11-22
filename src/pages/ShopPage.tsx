import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { SolarConfigurator } from '../components/configurator/SolarConfigurator';
import { SolarQuoteForm } from '../components/forms/SolarQuoteForm';
import { 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Truck, 
  SlidersHorizontal,
  CheckCircle2,
  Boxes,
  ArrowUpDown,
  ChevronDown,
  Cpu,
  FileText,
  Sparkles,
  X,
  BatteryCharging,
  Sun,
  Shield,
  Radio,
  PackageCheck,
  Check,
  Filter,
  ShoppingCart,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { OrderInstructionModal } from '../components/shop/OrderInstructionModal';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  openConfigurator?: () => void;
  setCurrentRoute?: (route: string) => void;
}

interface CategoryDefinition {
  id: string;
  label: string;
  fullName: string;
  spec: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'inverters',
    label: 'Hybrid Inverters',
    fullName: 'Intelligent Low & High-Voltage Hybrid Inverters',
    spec: 'UPS < 4ms Cutover • 5kW - 150kW Tier-1 Models',
    image: '/tesla-solar-inverter-menu.jpg',
    icon: Zap
  },
  {
    id: 'batteries',
    label: 'Battery Storage',
    fullName: 'LiFePO4 Lithium Energy Storage Systems',
    spec: '10-Yr Warranty • High Density 48V & High Voltage',
    image: '/tesla-powerwall-menu.jpg',
    icon: BatteryCharging
  },
  {
    id: 'solar-panels',
    label: 'Solar Panels',
    fullName: 'Tier-1 N-Type TOPCon & Mono PV Modules',
    spec: '450W - 650W High-Efficiency Bifacial & Mono',
    image: '/tesla-solar-panels-menu.jpg',
    icon: Sun
  },
  {
    id: 'complete-kits',
    label: 'Complete Kits',
    fullName: 'Turnkey Pre-Engineered Solar & Storage Kits',
    spec: 'SANS CoC Ready • Turnkey Hardware Bundles',
    image: '/tesla-solar-roof-menu.jpg',
    icon: PackageCheck
  },
  {
    id: 'mounting-equipment',
    label: 'Mounting & Rails',
    fullName: 'Structural Anodized Aluminum Rails & Clamps',
    spec: '140 km/h Wind Load • Tile, IBR & Corrugated',
    image: '/hardware-mounting-rails.jpg',
    icon: SlidersHorizontal
  },
  {
    id: 'protection-accessories',
    label: 'Protection & SPDs',
    fullName: 'AC/DC Surge Protection & Combiner Switchgear',
    spec: '1000V DC Type II Surge Protection & Fused Isolators',
    image: '/hardware-combiner-box.jpg',
    icon: Shield
  },
  {
    id: 'monitoring-equipment',
    label: 'Wi-Fi & Telemetry',
    fullName: 'Cloud Inverter Telemetry & Smart Energy Meters',
    spec: 'Real-time Mobile Telemetry & Modbus CT Meters',
    image: '/hardware-wifi-logger.jpg',
    icon: Radio
  },
  {
    id: 'warranties',
    label: 'Warranties & Care',
    fullName: 'Official Factory Extended Warranty Protection',
    spec: 'Up to 20-Year Lifetime Extended Coverage',
    image: '/solar-protection-panel.jpg',
    icon: ShieldCheck
  }
];

type SortOption = 
  | 'stock-first'
  | 'price-asc'
  | 'price-desc'
  | 'power-desc'
  | 'name-asc'
  | 'brand-asc';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'stock-first', label: 'In Stock First' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'power-desc', label: 'Power: High to Low (kW)' },
  { id: 'name-asc', label: 'Product Name (A-Z)' },
  { id: 'brand-asc', label: 'Manufacturer (A-Z)' },
];

export const ShopPage: React.FC<ShopPageProps> = ({ 
  onSelectProduct,
  initialCategory = 'all',
  onCategoryChange,
  openConfigurator,
  setCurrentRoute
}) => {
  const { products, activeQuote, clearActiveQuote } = useData();
  const { totalItemsCount, totalCartZAR, setIsCartOpen } = useCart();
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'single' | 'three'>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('stock-first');
  const [includeVat, setIncludeVat] = useState<boolean>(false);

  // Modal states
  const [showOrderGuideModal, setShowOrderGuideModal] = useState(false);
  const [isQuickQuoteModalOpen, setIsQuickQuoteModalOpen] = useState(false);
  const [isConfiguratorModalOpen, setIsConfiguratorModalOpen] = useState(false);

  // Dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const [isCapacityDropdownOpen, setIsCapacityDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Dropdown refs
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const phaseDropdownRef = useRef<HTMLDivElement>(null);
  const capacityDropdownRef = useRef<HTMLDivElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (phaseDropdownRef.current && !phaseDropdownRef.current.contains(target)) {
        setIsPhaseDropdownOpen(false);
      }
      if (capacityDropdownRef.current && !capacityDropdownRef.current.contains(target)) {
        setIsCapacityDropdownOpen(false);
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(target)) {
        setIsBrandDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setIsCategoryDropdownOpen(false);
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedPhase('all');
    setSelectedCapacity('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSortBy('stock-first');
    if (onCategoryChange) {
      onCategoryChange('all');
    }
  };

  // Distinct brands computed from products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) brandsSet.add(p.brand.trim());
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Dynamic counts for categories based on products
  // When in 'all', show count of physical hardware items (warranties are accessible via warranties category)
  const hardwareCount = useMemo(() => {
    return products.filter(p => p.category !== 'warranties').length;
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: hardwareCount };
    CATEGORY_DEFINITIONS.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category === cat.id).length;
    });
    return counts;
  }, [products, hardwareCount]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter: when 'all' is selected, display physical hardware; warranties appear when 'warranties' is selected
      if (selectedCategory !== 'all') {
        if (product.category !== selectedCategory) {
          return false;
        }
      } else {
        if (product.category === 'warranties') {
          return false;
        }
      }

      // 2. Phase Filter (for inverters or equipment with phase defined)
      if (selectedPhase !== 'all') {
        if (!product.phase || product.phase !== selectedPhase) {
          return false;
        }
      }

      // 3. Power Capacity Filter (kW)
      if (selectedCapacity !== 'all') {
        const rating = product.ratingKw ?? 0;
        if (selectedCapacity === 'compact' && (rating <= 0 || rating >= 5)) return false;
        if (selectedCapacity === 'residential' && (rating < 5 || rating > 10)) return false;
        if (selectedCapacity === 'high-power' && (rating <= 10 || rating > 25)) return false;
        if (selectedCapacity === 'commercial' && rating < 25) return false;
      }

      // 4. Brand Filter
      if (selectedBrand !== 'all') {
        if (product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesSummary = product.summary.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesSummary) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'stock-first': {
          const aStock = a.inStock ? 1 : 0;
          const bStock = b.inStock ? 1 : 0;
          if (aStock !== bStock) return bStock - aStock;
          return a.name.localeCompare(b.name);
        }
        case 'price-asc':
          return a.priceZAR - b.priceZAR;
        case 'price-desc':
          return b.priceZAR - a.priceZAR;
        case 'power-desc': {
          const aPower = a.ratingKw ?? a.capacityKwh ?? 0;
          const bPower = b.ratingKw ?? b.capacityKwh ?? 0;
          return bPower - aPower;
        }
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'brand-asc':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, selectedPhase, selectedCapacity, selectedBrand, searchQuery, sortBy]);

  const activeCategoryMeta = CATEGORY_DEFINITIONS.find(c => c.id === selectedCategory);
  const hasActiveFilters = selectedCategory !== 'all' || selectedPhase !== 'all' || selectedCapacity !== 'all' || selectedBrand !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC AUTHENTIC STORE HERO (CLEAN & PROFESSIONAL)                  */}
      {/* ========================================================================= */}
      <section className="relative pt-28 sm:pt-36 pb-20 px-6 sm:px-12 border-b border-[#1E2530] overflow-hidden">
        
        {/* Real High-Resolution Photovoltaic Facility Photography Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/commercial-solar-sa.jpg"
            alt="Photovoltaic Solar Power Equipment Store"
            className="w-full h-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/85 to-[#05070A]/40 sm:bg-gradient-to-r sm:from-[#05070A] sm:via-[#05070A]/90 sm:to-[#05070A]/30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Photovoltaic <span className="text-[#00D2FF]">Hardware Store</span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-normal">
              Direct wholesale and commercial supply of Tier-1 solar panels, intelligent hybrid inverters, LiFePO4 battery banks, and certified protection switchgear. Pre-tested in Sandton and dispatched direct to site.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="#hardware-workspace"
                className="px-7 py-4 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-extrabold uppercase rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Browse Equipment Catalog</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (openConfigurator) openConfigurator();
                  else if (setCurrentRoute) setCurrentRoute('configurator');
                  else setIsConfiguratorModalOpen(true);
                }}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#00D2FF]" />
                <span>3D System Sizer</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOrderGuideModal(true)}
                className="px-5 py-4 bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-[#64748B]" />
                <span>Order Guide</span>
              </button>
            </div>

            {/* Subtle Engineering Trust Anchors */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>SANS 10142-1-2 &amp; SABS Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00D2FF]" />
                <span>Insured National Freight (TCG &amp; RAM)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Sandton Hub 1000V DC Bench Tested</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STORE ASSURANCE BAR (FREE DELIVERY, REAL-TIME DISPATCH, SANS CoC, PAYMENT) */}
      {/* ========================================================================= */}
      <section className="bg-[#090D14] border-b border-[#1E2530] py-3.5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-[#94A3B8]">
            <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">Free National Freight</span>
              <span className="text-[10px] text-[#64748B]">Orders over R5,000 (TCG/RAM)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#94A3B8]">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">Sandton Lab Tested</span>
              <span className="text-[10px] text-[#64748B]">1000V DC Pre-Commissioned</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#94A3B8]">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">SANS 10142 CoC Ready</span>
              <span className="text-[10px] text-[#64748B]">Full Municipal SSEG Sign-off</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#94A3B8]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block text-[11px]">Instant SA Checkout</span>
              <span className="text-[10px] text-[#64748B]">Ozow, Capitec Pay, Visa &amp; MC</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN STORE WORKSPACE (FILTER DECK & HARDWARE SHELVES)                  */}
      {/* ========================================================================= */}
      <section id="hardware-workspace" className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-6">
        
        {/* Prospective Quotation Sticky Alert if active */}
        {activeQuote && (
          <div className="sticky top-16 z-30 bg-[#080C14]/95 backdrop-blur-md border border-[#00D2FF]/50 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,210,255,0.18)] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="relative mt-1 sm:mt-0">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00D2FF]"></span>
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40">
                      SegenSolar Pty // Prospective Project Builder
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Ref: <strong className="text-white">{activeQuote.referenceNo}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-sans">
                    <span className="text-white">
                      Project: <strong className="text-[#00D2FF] font-mono">{activeQuote.description}</strong>
                    </span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#10B981] font-mono font-bold">
                      {activeQuote.items.length} Products ({activeQuote.items.reduce((s, i) => s + i.qty, 0)} Units)
                    </span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-white font-mono font-bold">
                      Net Subtotal: R {activeQuote.items.reduce((sum, item) => sum + (item.netPriceZAR * item.qty), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowOrderGuideModal(true)}
                  className="px-3.5 py-2.5 bg-[#161B22] hover:bg-[#1E2530] text-[#00D2FF] border border-[#00D2FF]/40 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.15)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="hidden sm:inline">Order Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentRoute) setCurrentRoute('quotation-report');
                  }}
                  className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#00D2FF] hover:brightness-110 text-black font-mono font-black text-xs uppercase tracking-wide rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.3)] flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                >
                  <FileText className="w-4 h-4 text-black" />
                  <span>Generate Quotation Report</span>
                </button>

                <button
                  type="button"
                  onClick={clearActiveQuote}
                  className="px-3 py-2.5 bg-[#161B22] hover:bg-red-950/50 hover:text-red-300 text-[#94A3B8] border border-[#1E2530] hover:border-red-500/40 rounded-xl text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Discard active quote draft"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Discard</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STREAMLINED STORE CONTROL DECK: SEARCH, VAT TOGGLE, FILTERS           */}
        {/* ===================================================================== */}
        <div className="bg-[#0D1117] border border-[#1E2530] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
          
          {/* Top Row: Store Title + Search Input + VAT Switch */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{activeCategoryMeta?.fullName || activeCategoryMeta?.label || 'Hardware Equipment Catalog'}</span>
                </h2>
                <span className="px-3 py-0.5 bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold rounded-lg">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} on Shelf
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                {activeCategoryMeta?.spec || 'Genuine Tier-1 equipment ready for immediate dispatch and installation.'}
              </p>
            </div>

            {/* Top Right Controls: Live Search + VAT Toggle */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
              
              {/* Quick Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search model, brand, SKU..."
                  className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl pl-9 pr-7 py-2.5 text-xs text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none font-mono transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* VAT Calculation Pill Switch */}
              <div className="flex items-center gap-1.5 bg-[#05070A] p-1 rounded-xl border border-[#1E2530] text-xs font-mono shrink-0">
                <button
                  type="button"
                  onClick={() => setIncludeVat(false)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    !includeVat
                      ? 'bg-[#00D2FF] text-black font-bold shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="Show prices excluding 15% VAT"
                >
                  Excl. VAT
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeVat(true)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    includeVat
                      ? 'bg-[#00D2FF] text-black font-bold shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="Show prices including 15% VAT"
                >
                  Incl. 15% VAT
                </button>
              </div>

            </div>

          </div>

          {/* =================================================================== */}
          {/* THE ESSENTIAL DROP DOWN LIST FILTERS (Category, Brand, Phase, etc.) */}
          {/* =================================================================== */}
          <div className="pt-4 border-t border-[#1E2530] flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              {/* 1. CATEGORY DROP DOWN LIST */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsPhaseDropdownOpen(false);
                    setIsCapacityDropdownOpen(false);
                    setIsBrandDropdownOpen(false);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isCategoryDropdownOpen || selectedCategory !== 'all'
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/60 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isCategoryDropdownOpen}
                >
                  <Boxes className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="text-[#94A3B8]">Aisle:</span>
                  <strong className="text-white">
                    {selectedCategory === 'all' ? 'All Hardware' : (activeCategoryMeta?.label || selectedCategory)}
                  </strong>
                  <span className="text-[10px] text-[#00D2FF] font-bold px-1.5 py-0.5 rounded bg-white/5">
                    ({categoryCounts[selectedCategory] ?? hardwareCount})
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                  }`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-2 max-h-80 overflow-y-auto space-y-1 shadow-2xl z-40 animate-in fade-in duration-150 no-scrollbar text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                          : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Boxes className="w-3.5 h-3.5" />
                        <span>All Hardware Equipment</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        selectedCategory === 'all' ? 'bg-black/20 text-black' : 'text-[#64748B]'
                      }`}>
                        {hardwareCount}
                      </span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    {CATEGORY_DEFINITIONS.map(cat => {
                      const IconComp = cat.icon;
                      const count = categoryCounts[cat.id] ?? 0;
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#00D2FF]/20 border border-[#00D2FF]/50 text-[#00D2FF] font-bold'
                              : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-1">
                            <IconComp className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                            <span className="truncate">{cat.label}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                            isActive ? 'bg-[#00D2FF]/20 text-[#00D2FF]' : 'text-[#64748B]'
                          }`}>
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. MANUFACTURER / BRAND DROP DOWN LIST */}
              <div className="relative" ref={brandDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsBrandDropdownOpen(!isBrandDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsPhaseDropdownOpen(false);
                    setIsCapacityDropdownOpen(false);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isBrandDropdownOpen || selectedBrand !== 'all'
                      ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isBrandDropdownOpen}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[#94A3B8]">Brand:</span>
                  <strong className="text-white">
                    {selectedBrand === 'all' ? 'All Brands' : selectedBrand}
                  </strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isBrandDropdownOpen ? 'rotate-180 text-purple-400' : ''
                  }`} />
                </button>

                {isBrandDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-60 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 max-h-72 overflow-y-auto animate-in fade-in duration-150 text-xs font-mono no-scrollbar">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand('all');
                        setIsBrandDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedBrand === 'all' ? 'bg-[#00D2FF] text-black font-bold' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>All Manufacturers</span>
                      {selectedBrand === 'all' && <Check className="w-3 h-3 text-black" />}
                    </button>
                    {availableBrands.map(brand => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setIsBrandDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedBrand.toLowerCase() === brand.toLowerCase()
                            ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                            : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{brand}</span>
                        {selectedBrand.toLowerCase() === brand.toLowerCase() && <Check className="w-3 h-3 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. PHASE DROP DOWN LIST (Single Phase vs 3-Phase) */}
              <div className="relative" ref={phaseDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsPhaseDropdownOpen(!isPhaseDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsCapacityDropdownOpen(false);
                    setIsBrandDropdownOpen(false);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isPhaseDropdownOpen || selectedPhase !== 'all'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isPhaseDropdownOpen}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[#94A3B8]">Phase:</span>
                  <strong className="text-white">
                    {selectedPhase === 'all' ? 'All Phases' : selectedPhase === 'single' ? 'Single Phase (230V)' : '3-Phase (400V)'}
                  </strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isPhaseDropdownOpen ? 'rotate-180 text-amber-400' : ''
                  }`} />
                </button>

                {isPhaseDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhase('all');
                        setIsPhaseDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedPhase === 'all' ? 'bg-[#00D2FF] text-black font-bold' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>All Electrical Phases</span>
                      {selectedPhase === 'all' && <Check className="w-3 h-3 text-black" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhase('single');
                        setIsPhaseDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedPhase === 'single' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Single Phase (230V)</span>
                      {selectedPhase === 'single' && <Check className="w-3 h-3 text-sky-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhase('three');
                        setIsPhaseDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedPhase === 'three' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Three Phase (400V)</span>
                      {selectedPhase === 'three' && <Check className="w-3 h-3 text-amber-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 4. POWER / CAPACITY DROP DOWN LIST */}
              <div className="relative" ref={capacityDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCapacityDropdownOpen(!isCapacityDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsPhaseDropdownOpen(false);
                    setIsBrandDropdownOpen(false);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isCapacityDropdownOpen || selectedCapacity !== 'all'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isCapacityDropdownOpen}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[#94A3B8]">Capacity:</span>
                  <strong className="text-white">
                    {selectedCapacity === 'all' && 'All Sizes'}
                    {selectedCapacity === 'compact' && '< 5kW (Compact)'}
                    {selectedCapacity === 'residential' && '5kW - 10kW'}
                    {selectedCapacity === 'high-power' && '10kW - 25kW'}
                    {selectedCapacity === 'commercial' && '25kW - 150kW+'}
                  </strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isCapacityDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                  }`} />
                </button>

                {isCapacityDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCapacity('all');
                        setIsCapacityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCapacity === 'all' ? 'bg-[#00D2FF] text-black font-bold' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>All Capacities &amp; Ratings</span>
                      {selectedCapacity === 'all' && <Check className="w-3 h-3 text-black" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCapacity('compact');
                        setIsCapacityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCapacity === 'compact' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Compact (&lt; 5kW)</span>
                      {selectedCapacity === 'compact' && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCapacity('residential');
                        setIsCapacityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCapacity === 'residential' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Standard Home (5kW - 10kW)</span>
                      {selectedCapacity === 'residential' && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCapacity('high-power');
                        setIsCapacityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCapacity === 'high-power' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>High-Power Home (10kW - 25kW)</span>
                      {selectedCapacity === 'high-power' && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCapacity('commercial');
                        setIsCapacityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedCapacity === 'commercial' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>Commercial Microgrid (25kW - 150kW+)</span>
                      {selectedCapacity === 'commercial' && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Sort Drop Down List */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                  setIsPhaseDropdownOpen(false);
                  setIsCapacityDropdownOpen(false);
                  setIsBrandDropdownOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isSortDropdownOpen || sortBy !== 'stock-first'
                    ? 'bg-[#00D2FF]/10 border-[#00D2FF]/50 text-white'
                    : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                }`}
                aria-expanded={isSortDropdownOpen}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span className="text-[#94A3B8]">Sort:</span>
                <strong className="text-white">
                  {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || 'In Stock First'}
                </strong>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                  isSortDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                }`} />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                  <div className="px-3 py-1.5 text-[10px] text-[#64748B] uppercase tracking-wider font-bold border-b border-white/5">
                    Sort Options
                  </div>
                  {SORT_OPTIONS.map(opt => {
                    const isActive = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                            : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-black" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Active Filter Chips with 1-Click Clear */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-[#1E2530] flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#00D2FF]" />
                  Active Filters:
                </span>
                
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/40 text-[#00D2FF] font-semibold">
                    <span>Category: {activeCategoryMeta?.label || selectedCategory}</span>
                    <button onClick={() => handleCategorySelect('all')} className="hover:text-white cursor-pointer">×</button>
                  </span>
                )}

                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-purple-300 font-semibold">
                    <span>Brand: {selectedBrand}</span>
                    <button onClick={() => setSelectedBrand('all')} className="hover:text-white cursor-pointer">×</button>
                  </span>
                )}

                {selectedPhase !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
                    <span>Phase: {selectedPhase === 'single' ? 'Single Phase (230V)' : '3-Phase (400V)'}</span>
                    <button onClick={() => setSelectedPhase('all')} className="hover:text-white cursor-pointer">×</button>
                  </span>
                )}

                {selectedCapacity !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold">
                    <span>Capacity: {selectedCapacity}</span>
                    <button onClick={() => setSelectedCapacity('all')} className="hover:text-white cursor-pointer">×</button>
                  </span>
                )}

                {searchQuery.trim() !== '' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white font-semibold">
                    <span>Search: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-400 cursor-pointer">×</button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#00D2FF] hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* HARDWARE SHELF GRID (AUTHENTIC E-COMMERCE STORE CARDS)                */}
        {/* ===================================================================== */}
        <div className="space-y-4">
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  includeVat={includeVat}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#0D1117] border border-[#1E2530] rounded-3xl p-8 space-y-4 max-w-lg mx-auto shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#00D2FF]">
                <Boxes className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">No Equipment Matches Your Filter Criteria</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Try broadening your selection in the drop down filters above or clear your active search query to display available hardware.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#00D2FF] hover:bg-[#00D2FF]/90 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* FLOATING CART CHECKOUT BAR (WHEN CUSTOMER HAS ITEMS IN BASKET)            */}
      {/* ========================================================================= */}
      {totalItemsCount > 0 && (
        <aside aria-label="Active shopping cart" className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-3.5 rounded-2xl bg-[#0D1117]/95 backdrop-blur-xl border border-[#00D2FF]/60 hover:border-[#00D2FF] text-white font-mono shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex items-center gap-3.5 hover:scale-[1.03] transition-all cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#00D2FF] text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.4)]">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center border-2 border-[#0D1117]">
                {totalItemsCount}
              </span>
            </div>

            <div className="text-left font-sans">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-mono font-semibold">
                Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </span>
              <span className="text-base font-extrabold text-[#10B981] font-mono leading-none block mt-0.5">
                R {totalCartZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pl-2 border-l border-white/10 flex items-center gap-1.5 text-xs text-[#00D2FF] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 3. QUALITY ASSURANCE & DISPATCH PROTOCOLS SECTION                         */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto border-t border-[#1E2530] space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Quality Assurance &amp; Dispatch Protocols
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise Engineering Standards
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Every component procured through our network conforms to South African municipal regulations, comprehensive laboratory bench testing, and insured national freight.
          </p>
        </div>

        {/* 3 Feature Showcase Cards with Real Photography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: SANS 10142-1-2 Certified */}
          <div className="rounded-2xl bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/50 transition-all duration-300 overflow-hidden group shadow-lg flex flex-col justify-between">
            <div className="relative aspect-video w-full overflow-hidden bg-black/40">
              <img
                src="/sans-compliance-inspection.jpg"
                alt="Licensed Master Electrician conducting SANS 10142-1-2 CoC compliance test on solar distribution board"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/electrician-wiring-db.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#080B10]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#00D2FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#00D2FF]" />
                  <span>SABS 10142-1-2</span>
                </span>
              </div>
            </div>
            
            <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>SANS 10142-1-2 Certified</span>
                </h4>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
                  Every panel, inverter, and protection enclosure is verified against South African municipal SSEG regulations and SABS standards.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#64748B]">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">ECSA Sign-Off</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">CoC Ready</span>
                <span className="px-2 py-0.5 rounded bg-[#00D2FF]/10 text-[#00D2FF]">Municipal SSEG</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pre-Commissioned Bench Testing */}
          <div className="rounded-2xl bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/50 transition-all duration-300 overflow-hidden group shadow-lg flex flex-col justify-between">
            <div className="relative aspect-video w-full overflow-hidden bg-black/40">
              <img
                src="/bench-testing-lab.jpg"
                alt="Electrical engineer performing DC high-voltage bench testing and calibration at Sandton laboratory"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/battery-inverter-room.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#080B10]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#10B981] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#10B981]" />
                  <span>Sandton Hub QA</span>
                </span>
              </div>
            </div>
            
            <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Pre-Commissioned Bench Testing</span>
                </h4>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
                  Inverters and LiFePO4 batteries undergo DC high-voltage bench testing and firmware calibration before dispatch from our Sandton hub.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#64748B]">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">Firmware Pre-Flash</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">DC Load Verified</span>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">Zero DOA Policy</span>
              </div>
            </div>
          </div>

          {/* Card 3: Tracked Courier Delivery */}
          <div className="rounded-2xl bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/50 transition-all duration-300 overflow-hidden group shadow-lg flex flex-col justify-between">
            <div className="relative aspect-video w-full overflow-hidden bg-black/40">
              <img
                src="/logistics-courier-delivery.jpg"
                alt="Direct courier cargo van delivering palletized solar panel and inverter crates with GPS tracking"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/commercial-solar-sa.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#080B10]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#F59E0B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-[#F59E0B]" />
                  <span>TCG &amp; RAM Logistics</span>
                </span>
              </div>
            </div>
            
            <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Tracked Courier Delivery</span>
                </h4>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
                  Direct door-to-site delivery via The Courier Guy (TCG) &amp; RAM logistics with real-time waypoint telemetry and crated transit protection.
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#64748B]">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">Waypoint Telemetry</span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[#CBD5E1]">Crated Freight</span>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">Fully Insured</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Quote Modal Overlay */}
      {isQuickQuoteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl my-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsQuickQuoteModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#05070A] border border-[#1E2530] rounded-xl transition-colors cursor-pointer"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              <span className="text-[10px] font-mono text-[#00D2FF] uppercase font-bold tracking-widest block">
                Instant Trade Estimation
              </span>
              <h3 className="text-xl font-bold text-white">Generate Quick Solar Quote</h3>
              <p className="text-xs text-[#94A3B8]">
                Get an immediate bill of materials and locked trade price estimate for your installation.
              </p>
            </div>
            <SolarQuoteForm onSuccess={() => setTimeout(() => setIsQuickQuoteModalOpen(false), 3000)} />
          </div>
        </div>
      )}

      {/* Standalone PV System Configurator Modal */}
      {isConfiguratorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-4xl my-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsConfiguratorModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#05070A] border border-[#1E2530] rounded-xl transition-colors cursor-pointer"
              aria-label="Close designer modal"
            >
              <X className="w-5 h-5" />
            </button>
            <SolarConfigurator onQuoteRequested={() => setTimeout(() => setIsConfiguratorModalOpen(false), 3500)} />
          </div>
        </div>
      )}

      {/* Interactive Order Instruction & Tutorial Modal */}
      {activeQuote && (
        <OrderInstructionModal
          isOpen={showOrderGuideModal}
          onClose={() => setShowOrderGuideModal(false)}
          onProceed={() => setShowOrderGuideModal(false)}
          referenceNo={activeQuote.referenceNo}
          projectDescription={activeQuote.description}
        />
      )}

    </div>
  );
};
