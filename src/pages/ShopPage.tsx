import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductListRow } from '../components/shop/ProductListRow';
import { useCart } from '../context/CartContext';
import { SolarConfigurator } from '../components/configurator/SolarConfigurator';
import { SolarQuoteForm } from '../components/forms/SolarQuoteForm';
import { 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Truck,
  SlidersHorizontal,
  Building2,
  Home,
  CheckCircle2,
  Boxes,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronDown,
  ShoppingCart,
  Cpu,
  FileText,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { OrderInstructionModal } from '../components/shop/OrderInstructionModal';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
  openConfigurator?: () => void;
  setCurrentRoute?: (route: string) => void;
}

// 20 Technical Hardware Categories with Photographic Studio Imagery
const PORTAL_CATEGORIES = [
  { 
    id: 'solar-panels', 
    label: 'Solar Panels', 
    fullName: 'Tier-1 N-Type TOPCon & Mono PV Modules',
    count: 18, 
    spec: '450W - 650W High-Efficiency', 
    image: '/tesla-solar-panels-menu.jpg', 
    mappedCategory: 'solar-panels' 
  },
  { 
    id: 'inverters', 
    label: 'Hybrid Inverters', 
    fullName: 'Intelligent Low & High-Voltage Inverters',
    count: 35, 
    spec: 'UPS < 4ms Cutover • 5kW - 50kW', 
    image: '/tesla-solar-inverter-menu.jpg', 
    mappedCategory: 'inverters' 
  },
  { 
    id: 'batteries', 
    label: 'Battery Storage', 
    fullName: 'LiFePO4 Lithium Energy Storage Systems',
    count: 547, 
    spec: '10-Yr Warranty • High Density', 
    image: '/tesla-powerwall-menu.jpg', 
    mappedCategory: 'batteries' 
  },
  { 
    id: 'complete-kits', 
    label: 'Complete Kits', 
    fullName: 'Turnkey Pre-Engineered Solar & Storage Kits',
    count: 12, 
    spec: 'SANS CoC Ready • Full Protection', 
    image: '/tesla-solar-roof-menu.jpg', 
    mappedCategory: 'complete-kits' 
  },
  { 
    id: 'mounting-equipment', 
    label: 'Mounting & Rails', 
    fullName: 'Structural Anodized Aluminum Rails & Clamps',
    count: 189, 
    spec: '140 km/h Wind Load • Tile & IBR', 
    image: '/hardware-mounting-rails.jpg', 
    mappedCategory: 'mounting-equipment' 
  },
  { 
    id: 'protection-accessories', 
    label: 'Protection & SPDs', 
    fullName: 'AC/DC Surge Protection & Combiner Boxes',
    count: 61, 
    spec: '1000V DC Type II Surge Protection', 
    image: '/hardware-combiner-box.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'ac-components', 
    label: 'AC Switchgear', 
    fullName: 'Distribution Boards & Changeover Panels',
    count: 74, 
    spec: 'Single & 3-Phase SABS Standard', 
    image: '/hardware-rotary-switch.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'balance-of-system', 
    label: 'Balance of System', 
    fullName: 'DC Combiner Enclosures, Fuses & Hardware',
    count: 219, 
    spec: 'IP66 Weatherproof • SABS 10142', 
    image: '/hardware-combiner-box.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'cables', 
    label: 'Solar Cables & Leads', 
    fullName: 'Double-Insulated UV-Rated Solar Cable',
    count: 46, 
    spec: '4mm² - 16mm² • MC4 IP68 Rated', 
    image: '/hardware-solar-cables.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'switches', 
    label: 'Rotary Isolators', 
    fullName: 'Manual Rotary Isolators & Changeovers',
    count: 10, 
    spec: '63A 4-Pole 1000V IP65 Enclosure', 
    image: '/hardware-rotary-switch.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'energy-management', 
    label: 'Energy Management', 
    fullName: 'Smart Relays & Dynamic Peak Shaving',
    count: 14, 
    spec: 'Smart Load Shedding Resilience', 
    image: '/hardware-smart-meter.jpg', 
    mappedCategory: 'complete-kits' 
  },
  { 
    id: 'generator-integration', 
    label: 'Generator ATS', 
    fullName: 'Automatic Transfer Switch & Generator Start',
    count: 8, 
    spec: 'Dry Contact Control • Dual Contactors', 
    image: '/hardware-generator-ats.jpg', 
    mappedCategory: 'inverters' 
  },
  { 
    id: 'power-management', 
    label: 'Smart Power Meters', 
    fullName: 'Bi-Directional SSEG Smart Power Meters',
    count: 16, 
    spec: 'Split-Core CT Clamps • Class 1.0', 
    image: '/hardware-smart-meter.jpg', 
    mappedCategory: 'inverters' 
  },
  { 
    id: 'display', 
    label: 'Wi-Fi & Telemetry', 
    fullName: 'Wireless Cloud Inverter Telemetry Sticks',
    count: 26, 
    spec: 'iOS / Android Telemetry • 4G/Wi-Fi', 
    image: '/hardware-wifi-logger.jpg', 
    mappedCategory: 'inverters' 
  },
  { 
    id: 'accessories', 
    label: 'System Accessories', 
    fullName: 'BMS Communication Leads & Busbars',
    count: 32, 
    spec: 'OEM Communication Bus & Lugs', 
    image: '/hardware-solar-cables.jpg', 
    mappedCategory: 'mounting-equipment' 
  },
  { 
    id: 'tools', 
    label: 'Installer Tools', 
    fullName: 'MC4 Crimpers, Strippers & Multimeters',
    count: 14, 
    spec: '1000V Insulated Field Tools', 
    image: '/hardware-installer-tools.jpg', 
    mappedCategory: 'mounting-equipment' 
  },
  { 
    id: 'labels', 
    label: 'Warning Decals', 
    fullName: 'Statutory SANS 10142 Safety Decals',
    count: 13, 
    spec: 'UV-Resistant Vinyl Safety Warning', 
    image: '/hardware-warning-labels.jpg', 
    mappedCategory: 'protection-accessories' 
  },
  { 
    id: 'special-offers', 
    label: 'Commercial Bundles', 
    fullName: 'Turnkey 50kW+ Commercial Microgrid Packs',
    count: 5, 
    spec: 'Section 12B Tax Rebate Ready', 
    image: '/tesla-megapack-menu.jpg', 
    mappedCategory: 'complete-kits' 
  },
  { 
    id: 'clearance-products', 
    label: 'Clearance Hardware', 
    fullName: 'Warehouse Overstock Solar Hardware',
    count: 262, 
    spec: 'Full Manufacturer Warranty', 
    image: '/tesla-calculator-menu.jpg', 
    mappedCategory: 'complete-kits' 
  },
  { 
    id: 'recently-viewed', 
    label: 'Recent Inquiries', 
    fullName: 'Recently Inspected Hardware',
    count: 5, 
    spec: 'Fast Access Buffer', 
    image: '/tesla-tracking-menu.jpg', 
    mappedCategory: 'all' 
  },
];

export const ShopPage: React.FC<ShopPageProps> = ({ 
  onSelectProduct,
  initialCategory = 'all',
  onCategoryChange,
  openConfigurator,
  setCurrentRoute
}) => {
  const { products, activeQuote, clearActiveQuote } = useData();
  const { setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOrderGuideModal, setShowOrderGuideModal] = useState(false);
  type SortOption = 
    | 'stock-first'
    | 'price-desc'
    | 'price-asc'
    | 'name-asc'
    | 'name-desc'
    | 'part-asc'
    | 'part-desc'
    | 'brand-asc'
    | 'brand-desc';

  const SORT_OPTIONS: { id: SortOption; label: string }[] = [
    { id: 'stock-first', label: 'In Stock First' },
    { id: 'price-desc', label: 'Price high-low' },
    { id: 'price-asc', label: 'Price low-high' },
    { id: 'name-asc', label: 'Product A-Z' },
    { id: 'name-desc', label: 'Product Z-A' },
    { id: 'part-asc', label: 'PartNo A-Z' },
    { id: 'part-desc', label: 'PartNo Z-A' },
    { id: 'brand-asc', label: 'Manufacturer A-Z' },
    { id: 'brand-desc', label: 'Manufacturer Z-A' },
  ];

  const [sortBy, setSortBy] = useState<SortOption>('stock-first');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Dropdown open/close state
  const [isAllEquipmentDropdownOpen, setIsAllEquipmentDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isSecondarySortDropdownOpen, setIsSecondarySortDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isBottomActionsDropdownOpen, setIsBottomActionsDropdownOpen] = useState(false);
  const [isQuickQuoteModalOpen, setIsQuickQuoteModalOpen] = useState(false);
  const [isConfiguratorModalOpen, setIsConfiguratorModalOpen] = useState(false);

  const allEquipmentDropdownRef = React.useRef<HTMLDivElement>(null);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const marketDropdownRef = React.useRef<HTMLDivElement>(null);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);
  const secondarySortDropdownRef = React.useRef<HTMLDivElement>(null);
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const bottomActionsDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (allEquipmentDropdownRef.current && !allEquipmentDropdownRef.current.contains(target)) {
        setIsAllEquipmentDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (marketDropdownRef.current && !marketDropdownRef.current.contains(target)) {
        setIsMarketDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortDropdownOpen(false);
      }
      if (secondarySortDropdownRef.current && !secondarySortDropdownRef.current.contains(target)) {
        setIsSecondarySortDropdownOpen(false);
      }
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(target)) {
        setIsActionsDropdownOpen(false);
      }
      if (bottomActionsDropdownRef.current && !bottomActionsDropdownRef.current.contains(target)) {
        setIsBottomActionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateNewOrder = () => {
    setIsActionsDropdownOpen(false);
    setIsBottomActionsDropdownOpen(false);
    if (setCurrentRoute) {
      setCurrentRoute('new-order');
    } else {
      setIsCartOpen(true);
    }
  };

  const handleDesignPvSystem = () => {
    setIsActionsDropdownOpen(false);
    setIsBottomActionsDropdownOpen(false);
    if (openConfigurator) {
      openConfigurator();
    } else {
      setIsConfiguratorModalOpen(true);
    }
  };

  const handleQuickQuote = () => {
    setIsActionsDropdownOpen(false);
    setIsBottomActionsDropdownOpen(false);
    setIsQuickQuoteModalOpen(true);
  };

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (onCategoryChange) {
      onCategoryChange(catId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeMeta = PORTAL_CATEGORIES.find(c => c.id === selectedCategory);
  const targetFilterCategory = activeMeta ? activeMeta.mappedCategory : selectedCategory;

  const filteredProducts = products.filter(product => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category === selectedCategory || 
      (targetFilterCategory !== 'all' && product.category === targetFilterCategory);
    
    const matchesMarket = 
      selectedMarket === 'all' ||
      (selectedMarket === 'commercial' && ((product.ratingKw && product.ratingKw >= 15) || product.priceZAR >= 30000)) ||
      (selectedMarket === 'domestic' && (!product.ratingKw || product.ratingKw < 15) && product.priceZAR < 30000);

    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMarket && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'stock-first': {
        const aStock = a.inStock ? 1 : 0;
        const bStock = b.inStock ? 1 : 0;
        if (aStock !== bStock) return bStock - aStock;
        return a.name.localeCompare(b.name);
      }
      case 'price-desc':
        return b.priceZAR - a.priceZAR;
      case 'price-asc':
        return a.priceZAR - b.priceZAR;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'part-asc':
        return a.sku.localeCompare(b.sku);
      case 'part-desc':
        return b.sku.localeCompare(a.sku);
      case 'brand-asc':
        return a.brand.localeCompare(b.brand);
      case 'brand-desc':
        return b.brand.localeCompare(a.brand);
      default:
        return 0;
    }
  });

  const displayedProducts = filteredProducts;

  const isGridView = selectedCategory === 'all' && !searchQuery && selectedMarket === 'all';
  const totalItemsCount = PORTAL_CATEGORIES.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E6ECE8] font-sans selection:bg-[#00D2FF] selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION WITH ARCHITECTURAL BACKDROP & QUICK FILTERS    */}
      {/* ========================================================================= */}
      <section className="relative pt-28 sm:pt-36 pb-12 px-4 sm:px-8 lg:px-12 border-b border-white/10 overflow-hidden bg-[#05070A]">
        
        {/* Full-Bleed Edge-to-Edge Architectural Photo with Starlink Gradients */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={
              selectedCategory === 'inverters' ? '/battery-inverter-room.jpg' :
              selectedCategory === 'batteries' ? '/battery-inverter-room.jpg' :
              selectedCategory === 'mounting-equipment' ? '/solar-installer-roof.jpg' :
              selectedCategory === 'protection-accessories' ? '/solar-protection-panel.jpg' :
              selectedCategory === 'complete-kits' ? '/hero-solar-home.jpg' :
              '/commercial-solar-sa.jpg'
            }
            alt="Photovoltaic Solar Hardware Installations across South Africa"
            className="w-full h-full object-cover object-[center_30%] sm:object-center filter brightness-[0.7] contrast-[1.1] scale-105 transition-all duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/commercial-solar-sa.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/85 to-[#05070A]/90" />
        </div>

        {/* Ambient Radial Glow Lighting */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#00D2FF]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Badge, Description, Action Buttons */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Authentic Industrial Badge with Pulsing Cyan LED */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest text-[#00D2FF] uppercase font-bold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D2FF]"></span>
                </span>
                <span>TIER-1 EQUIPMENT PROCUREMENT • SANS 10142-1-2 &amp; SABS CERTIFIED</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.04]">
                  Photovoltaic <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#00D2FF]">Hardware</span>
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
                  Engineering-grade wholesale and enterprise distribution of Tier-1 monocrystalline panels, intelligent hybrid inverters, LiFePO4 energy storage, and SANS-certified protection switchgear. Pre-tested in Sandton and dispatched direct to site.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <a
                  href="#hardware-workspace"
                  className="px-6 py-3.5 bg-[#00D2FF] hover:bg-[#00D2FF]/90 text-black font-extrabold uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(0,210,255,0.3)] flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <span>Browse Equipment Catalog</span>
                  <ChevronDown className="w-4 h-4 text-black" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (openConfigurator) openConfigurator();
                    else if (setCurrentRoute) setCurrentRoute('configurator');
                  }}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00D2FF]/50 text-white font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#00D2FF]" />
                  <span>3D System Sizer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOrderGuideModal(true)}
                  className="px-4 py-3.5 bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Order Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00D2FF]" />
                </button>
              </div>

            </div>

            {/* Right Column: High-Tech Telemetry Showcase Panel */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#0D1117]/85 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#00D2FF]" />
                    <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                      Technical Verification
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                    Live Catalog
                  </span>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase block">Municipal SSEG</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> CoC Certified
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase block">UPS Auto-Cutover</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#00D2FF]" /> &lt; 4ms Switch
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase block">Sandton Lab QA</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" /> 1000V DC Tested
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#64748B] uppercase block">Transit Logistics</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-sky-400" /> Insured Freight
                    </span>
                  </div>
                </div>

                {/* Quick Visual Category Jump */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider block mb-2 font-bold">
                    Direct Hardware Filter:
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('solar-panels')}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                        selectedCategory === 'solar-panels'
                          ? 'bg-[#00D2FF]/20 border-[#00D2FF] text-[#00D2FF] font-bold'
                          : 'bg-white/[0.02] border-white/5 text-[#94A3B8] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img src="/tesla-solar-panels-menu.jpg" alt="Solar Panels" className="w-10 h-8 object-contain mix-blend-multiply" />
                      <span className="truncate w-full text-[10px]">Panels</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCategoryClick('inverters')}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                        selectedCategory === 'inverters'
                          ? 'bg-[#00D2FF]/20 border-[#00D2FF] text-[#00D2FF] font-bold'
                          : 'bg-white/[0.02] border-white/5 text-[#94A3B8] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img src="/tesla-solar-inverter-menu.jpg" alt="Inverters" className="w-10 h-8 object-contain mix-blend-multiply" />
                      <span className="truncate w-full text-[10px]">Inverters</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCategoryClick('batteries')}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                        selectedCategory === 'batteries'
                          ? 'bg-[#00D2FF]/20 border-[#00D2FF] text-[#00D2FF] font-bold'
                          : 'bg-white/[0.02] border-white/5 text-[#94A3B8] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img src="/lithium-battery-etower.jpg" alt="Batteries" className="w-10 h-8 object-contain mix-blend-multiply" />
                      <span className="truncate w-full text-[10px]">Batteries</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Horizontal Interactive Hardware Category Strip */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#00D2FF] text-black shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>All Equipment ({totalItemsCount.toLocaleString()})</span>
            </button>

            {PORTAL_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#00D2FF]/20 border border-[#00D2FF] text-[#00D2FF] font-bold shadow-sm'
                      : 'bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <div className="w-6 h-5 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <span>{cat.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#64748B]">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN PORTAL WORKSPACE (Unified Full-Width Control Deck + Grid/Catalog)  */}
      {/* ========================================================================= */}
      <section id="hardware-workspace" className="py-8 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-6">
        
        {/* All Equipment Drop Down List */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="relative" ref={allEquipmentDropdownRef}>
            <button
              type="button"
              onClick={() => setIsAllEquipmentDropdownOpen(!isAllEquipmentDropdownOpen)}
              className="px-4 py-2.5 rounded-xl bg-[#0D1117] hover:bg-[#161B22] border border-[#1E2530] hover:border-[#00D2FF]/50 text-white font-mono text-xs font-bold flex items-center gap-3 transition-all shadow-md cursor-pointer group"
              aria-expanded={isAllEquipmentDropdownOpen}
            >
              <div className="w-6 h-6 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/30 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                <Boxes className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#94A3B8]">All Equipment:</span>
                <span className="text-white font-extrabold">
                  {selectedCategory === 'all' 
                    ? 'All Equipment' 
                    : (PORTAL_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory)}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#00D2FF] font-semibold">
                  {selectedCategory === 'all' ? `${totalItemsCount.toLocaleString()} Units` : `${PORTAL_CATEGORIES.find(c => c.id === selectedCategory)?.count ?? filteredProducts.length} Units`}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 group-hover:text-white ${
                isAllEquipmentDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
              }`} />
            </button>

            {isAllEquipmentDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-2 max-h-[460px] overflow-y-auto space-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150 no-scrollbar">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold border-b border-white/5 flex items-center justify-between">
                  <span>Hardware Categories</span>
                  <span>{PORTAL_CATEGORIES.length} Categories</span>
                </div>

                {/* Option 1: All Equipment (Default View) */}
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryClick('all');
                    setIsAllEquipmentDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                      : 'text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedCategory === 'all' ? 'bg-black/20 text-black' : 'bg-white/5 text-[#00D2FF]'
                    }`}>
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">All Equipment</div>
                      <div className={`text-[10px] ${selectedCategory === 'all' ? 'text-black/80' : 'text-[#64748B]'}`}>
                        Complete Photovoltaic Hardware Catalog
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    selectedCategory === 'all' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
                  }`}>
                    {totalItemsCount.toLocaleString()}
                  </span>
                </button>

                <div className="my-1 border-t border-white/5" />

                {/* Options 2+: Portal Categories with images & specs */}
                <div className="space-y-0.5">
                  {PORTAL_CATEGORIES.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          handleCategoryClick(cat.id);
                          setIsAllEquipmentDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left font-mono transition-all flex items-center justify-between cursor-pointer group ${
                          isActive
                            ? 'bg-[#00D2FF]/20 border border-[#00D2FF]/50 text-[#00D2FF] font-bold'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="w-8 h-6 rounded-md bg-white p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                            <img
                              src={cat.image}
                              alt={cat.label}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-tight text-white group-hover:text-[#00D2FF] truncate">
                              {cat.label}
                            </div>
                            <div className="text-[10px] text-[#64748B] truncate">
                              {cat.spec}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded shrink-0 font-bold ${
                          isActive ? 'bg-[#00D2FF]/20 text-[#00D2FF]' : 'bg-white/5 text-[#94A3B8]'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Clear / Reset if filtered */}
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              className="text-xs font-mono text-[#00D2FF] hover:text-white hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Selected: <strong>{PORTAL_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</strong></span>
              <span className="text-[#64748B] hover:text-red-400">× Reset to All Equipment</span>
            </button>
          )}
        </div>
        
        {/* ===================================================================== */}
        {/* ACTIVE PROSPECTIVE QUOTATION DECK (WHEN USER IS BUILDING A QUOTE)     */}
        {/* ===================================================================== */}
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
                      {activeQuote.items.length} Product{activeQuote.items.length === 1 ? '' : 's'} Added ({activeQuote.items.reduce((s, i) => s + i.qty, 0)} Units)
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
                  title="View animated tutorial on how to build and place your order"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="hidden sm:inline">Order Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentRoute) {
                      setCurrentRoute('quotation-report');
                    }
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
        {/* TOP UNIFIED CONTROL DECK: CATEGORY & MARKET DROPDOWNS + SEARCH + SORT */}
        {/* ===================================================================== */}
        <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          
          {/* Top Row: Title, Spec & Search/Back */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                  {isGridView ? 'Photovoltaic Ecosystem' : (activeMeta?.fullName || activeMeta?.label || 'Hardware Catalog')}
                </h2>
                <span className="px-2.5 py-0.5 bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold rounded-lg">
                  {isGridView ? `${totalItemsCount.toLocaleString()} Products` : `${filteredProducts.length} Units`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                {isGridView 
                  ? 'Direct procurement of Tier-1 solar panels, hybrid inverters, and battery storage systems.' 
                  : activeMeta?.spec || 'Tier-1 Certified South African Solar Equipment'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {!isGridView && (
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs uppercase font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>All Categories</span>
                </button>
              )}

              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search hardware, SKU..."
                  className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none font-mono"
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

              {/* TOP ACTION DROPDOWN BUTTON (Create New Order / Design A PV System / Quick Quote) */}
              <div className="relative" ref={actionsDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsActionsDropdownOpen(!isActionsDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsMarketDropdownOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 text-black font-mono text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 shadow-[0_0_18px_rgba(0,210,255,0.3)] transition-all cursor-pointer shrink-0"
                  aria-expanded={isActionsDropdownOpen}
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Design System</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${
                    isActionsDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isActionsDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#080B10] border border-[#1E2530] rounded-2xl p-2 space-y-1 shadow-2xl z-50 animate-in fade-in duration-150 text-xs font-mono">
                    <div className="px-3 py-1.5 text-[10px] text-[#64748B] uppercase tracking-wider font-bold border-b border-white/5">
                      Select Portal Function
                    </div>

                    {/* 1. Create New Order */}
                    <button
                      type="button"
                      onClick={handleCreateNewOrder}
                      className="w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-start gap-3 hover:bg-[#00D2FF]/15 hover:border-[#00D2FF]/40 border border-transparent group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/40 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xs group-hover:text-[#00D2FF] transition-colors">
                          Create New Order
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-sans truncate">
                          Direct trade order, cart & procurement
                        </div>
                      </div>
                    </button>

                    {/* 2. Design A PV System */}
                    <button
                      type="button"
                      onClick={handleDesignPvSystem}
                      className="w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-start gap-3 hover:bg-[#10B981]/15 hover:border-[#10B981]/40 border border-transparent group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xs group-hover:text-[#10B981] transition-colors">
                          Design A PV System
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-sans truncate">
                          Kit Builder & component compatibility
                        </div>
                      </div>
                    </button>

                    {/* 3. Quick Quote */}
                    <button
                      type="button"
                      onClick={handleQuickQuote}
                      className="w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-start gap-3 hover:bg-[#F59E0B]/15 hover:border-[#F59E0B]/40 border border-transparent group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xs group-hover:text-[#F59E0B] transition-colors">
                          Quick Quote
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-sans truncate">
                          Fast bill of materials & locked trade pricing
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Row: The Dropdown Lists (By Category, By Market, Sort By, View As) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#1E2530]">
            
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              {/* 1. BY CATEGORY DROPDOWN */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsMarketDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isCategoryDropdownOpen || selectedCategory !== 'all'
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/50 text-white'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isCategoryDropdownOpen}
                >
                  <Boxes className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="text-[#94A3B8]">Category:</span>
                  <strong className="text-white">
                    {selectedCategory === 'all' ? 'All Categories' : (activeMeta?.label || 'Select')}
                  </strong>
                  <span className="text-[10px] text-[#00D2FF] font-bold">
                    ({selectedCategory === 'all' ? totalItemsCount.toLocaleString() : activeMeta?.count})
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                  }`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-[#080B10] border border-[#1E2530] rounded-2xl p-1.5 max-h-80 overflow-y-auto space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 no-scrollbar">
                    {/* All Categories Option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCategoryClick('all');
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                          : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Boxes className="w-3.5 h-3.5" />
                        <span>All Categories</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        selectedCategory === 'all' ? 'bg-black/20 text-black' : 'text-[#64748B]'
                      }`}>
                        {totalItemsCount.toLocaleString()}
                      </span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    {/* 20 Categories from PORTAL_CATEGORIES */}
                    {PORTAL_CATEGORIES.map(cat => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            handleCategoryClick(cat.id);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#00D2FF]/20 border border-[#00D2FF]/50 text-[#00D2FF] font-bold'
                              : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-1">
                            <div className="w-7 h-5 rounded bg-white p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                              <img src={cat.image} alt={cat.label} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <span className="truncate">{cat.label}</span>
                          </div>
                          <span className="text-[10px] text-[#64748B] shrink-0 font-semibold">
                            ({cat.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. BY MARKET DROPDOWN */}
              <div className="relative" ref={marketDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMarketDropdownOpen(!isMarketDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isMarketDropdownOpen || selectedMarket !== 'all'
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/50 text-white'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isMarketDropdownOpen}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="text-[#94A3B8]">Market:</span>
                  <strong className="text-white">
                    {selectedMarket === 'all'
                      ? 'All Sectors'
                      : selectedMarket === 'commercial'
                      ? 'Commercial (50kW+)'
                      : 'Domestic'}
                  </strong>
                  <span className="text-[10px] text-[#00D2FF] font-bold">
                    {selectedMarket === 'all' ? '(1,215)' : selectedMarket === 'commercial' ? '(220)' : '(995)'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isMarketDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                  }`} />
                </button>

                {isMarketDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#080B10] border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMarket('all');
                        setIsMarketDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedMarket === 'all'
                          ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                          : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>All Sectors</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        selectedMarket === 'all' ? 'bg-black/20 text-black' : 'text-[#64748B]'
                      }`}>
                        (1,215)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMarket('commercial');
                        setIsMarketDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedMarket === 'commercial'
                          ? 'bg-[#00D2FF]/20 border border-[#00D2FF]/50 text-[#00D2FF] font-bold'
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>Commercial (50kW+)</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold">(220)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMarket('domestic');
                        setIsMarketDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedMarket === 'domestic'
                          ? 'bg-[#00D2FF]/20 border border-[#00D2FF]/50 text-[#00D2FF] font-bold'
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>Domestic / Residential</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-semibold">(995)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. SORT DROPDOWN */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsSortDropdownOpen(!isSortDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsMarketDropdownOpen(false);
                    setIsAllEquipmentDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isSortDropdownOpen || sortBy !== 'stock-first'
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/50 text-white'
                      : 'bg-[#05070A] hover:bg-[#161B22] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isSortDropdownOpen}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="text-[#94A3B8]">Sort by:</span>
                  <strong className="text-white">
                    {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || 'In Stock First'}
                  </strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isSortDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                  }`} />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 sm:w-60 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                    <div className="px-3 py-1.5 text-[10px] text-[#64748B] uppercase tracking-wider font-bold border-b border-white/5 flex items-center justify-between">
                      <span>Sort By</span>
                      <span>{SORT_OPTIONS.length} Criteria</span>
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
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right: View As List/Grid */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-[#05070A] p-1 rounded-xl border border-[#1E2530]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#00D2FF] text-black shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#00D2FF] text-black shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* VIEW A: STARLINK-GRADE 20-CATEGORY MATRIX GRID (FULL WIDTH)           */}
        {/* ===================================================================== */}
        {isGridView ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {PORTAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group bg-[#0D1117] hover:bg-[#121824] border border-[#1E2530] hover:border-[#00D2FF]/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer hover:shadow-[0_16px_36px_rgba(0,210,255,0.12)] hover:-translate-y-1 min-h-[250px] sm:min-h-[270px] relative overflow-hidden"
              >
                {/* Top Spec & Units Allocated */}
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] group-hover:text-[#00D2FF] transition-colors truncate max-w-[130px]">
                    {cat.spec}
                  </span>
                  <span className="text-[10px] font-mono text-[#00D2FF] font-bold px-2 py-0.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 group-hover:bg-[#00D2FF] group-hover:text-black transition-all">
                    {cat.count} Units
                  </span>
                </div>

                {/* Real Photographic Equipment Studio Showcase Stage (Pure White Backdrop, 4:3) */}
                <div className="w-full h-32 sm:h-36 flex items-center justify-center relative my-3 overflow-hidden rounded-xl bg-white p-3 border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-sm group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                    }}
                  />
                </div>

                {/* Bottom Category Title and Full Name */}
                <div className="w-full pt-1 space-y-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#00D2FF] transition-colors leading-tight">
                      {cat.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <span className="block text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors truncate">
                    {cat.fullName || cat.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW B: FILTERED PRODUCTS LISTING (FULL WIDTH)                      */
          /* =================================================================== */
          <div className="space-y-4">
            
            {/* Reset Filters Quick Bar */}
            {(selectedCategory !== 'all' || selectedMarket !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B] bg-[#0D1117] border border-[#1E2530] rounded-xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <span>FILTERED BY:</span>
                  <strong className="text-white">{activeMeta?.label || selectedCategory}</strong>
                  {selectedMarket !== 'all' && (
                    <span className="text-[#00D2FF]">
                      ({selectedMarket === 'commercial' ? 'Commercial 50kW+' : 'Domestic / Residential'})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleCategoryClick('all');
                    setSelectedMarket('all');
                    setSearchQuery('');
                  }}
                  className="text-[#00D2FF] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}

            {/* Sort by Dropdown Toolbar */}
            <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B]">Showing:</span>
                <strong className="text-white">{displayedProducts.length}</strong>
                <span className="text-[#94A3B8]">components in</span>
                <span className="text-[#00D2FF] font-bold">{activeMeta?.label || selectedCategory}</span>
              </div>

              {/* Sort by Dropdown List */}
              <div className="relative" ref={secondarySortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSecondarySortDropdownOpen(!isSecondarySortDropdownOpen)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isSecondarySortDropdownOpen || sortBy !== 'stock-first'
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/50 text-white'
                      : 'bg-[#161B22] hover:bg-[#21262D] border-[#1E2530] text-[#CBD5E1]'
                  }`}
                  aria-expanded={isSecondarySortDropdownOpen}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="text-[#94A3B8]">Sort by:</span>
                  <strong className="text-white">
                    {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || 'In Stock First'}
                  </strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                    isSecondarySortDropdownOpen ? 'rotate-180 text-[#00D2FF]' : ''
                  }`} />
                </button>

                {isSecondarySortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-[#080B10]/98 backdrop-blur-2xl border border-[#1E2530] rounded-2xl p-1.5 space-y-0.5 shadow-2xl z-40 animate-in fade-in duration-150 text-xs font-mono">
                    <div className="px-3 py-1.5 text-[10px] text-[#64748B] uppercase tracking-wider font-bold border-b border-white/5 flex items-center justify-between">
                      <span>Sort By</span>
                      <span>{SORT_OPTIONS.length} Criteria</span>
                    </div>

                    {SORT_OPTIONS.map(opt => {
                      const isActive = sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setIsSecondarySortDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                              : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Product Listing (List View or Grid View) */}
            {displayedProducts.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-3">
                  {displayedProducts.map(product => (
                    <ProductListRow
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {displayedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="py-20 text-center bg-[#0D1117] border border-[#1E2530] rounded-2xl p-8 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#64748B]">
                  <Boxes className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  No Products Allocated in this Tier
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  We couldn't find any components currently matching this filter combination.
                </p>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl hover:bg-neutral-200 transition-all shadow-md cursor-pointer"
                >
                  Back to All Categories Grid
                </button>
              </div>
            )}

          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 3. ENTERPRISE ENGINEERING QUALITY ASSURANCE & LOGISTICS PROTOCOLS          */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#1E2530] space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[10px] font-mono tracking-widest text-[#00D2FF] uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
              <span>QUALITY ASSURANCE &amp; DISPATCH PROTOCOLS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Engineering Standards
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl font-normal leading-relaxed">
              Every component procured through our network conforms to South African municipal regulations, comprehensive laboratory bench testing, and insured national freight.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#64748B] shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#1E2530] text-[#94A3B8]">
              JHB &amp; CPT Warehouses
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#0D1117] border border-[#1E2530] text-[#10B981] font-bold">
              SABS Certified
            </span>
          </div>
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
