import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { 
  FileText, 
  Printer, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  ChevronDown, 
  Sparkles, 
  ExternalLink, 
  Search, 
  ShoppingCart,
  Cloud,
  ShoppingBag,
  Battery,
  ArrowRight,
  Zap,
  MapPin,
  Wind,
  Gauge,
  Layers
} from 'lucide-react';
import { OrderInstructionModal } from '../components/shop/OrderInstructionModal';

interface NewOrderQuotationPageProps {
  setCurrentRoute: (route: string) => void;
  onSelectProduct?: (product: Product) => void;
  openConfigurator?: () => void;
  initialMode?: 'setup' | 'quotation';
}

export interface QuoteLineItem {
  id: string;
  qty: number;
  partNo: string;
  description: string;
  netPriceZAR: number;
  link?: string;
  isCustom?: boolean;
}

const TEMPLATES = [
  'Start from a blank order (Build your own BOM)',
  '1. 10kW 3ph On-Grid Poly',
  '2. 10kW 3ph Hybrid Mono 10kWh',
  '3. 12kW Sunsynk Commercial 3-Phase + Freedom Won 15kWh',
  '4. 15kW 3ph On-Grid Poly',
  '5. 20kW 3ph On-Grid Poly',
  '6. 3kW 1ph Off-Grid Poly 5kWh',
  '7. 3kW 1ph On-Grid Poly',
  '8. 30kW 3ph On-Grid Poly',
  '9. 4kW 1ph On-Grid Poly',
  '10. 50kW 3ph On-Grid Poly',
  '11. 5kW 1ph Hybrid Mono 5kWh',
  '12. 5kW 1ph Off-Grid Poly 5kWh',
  '13. 5kW 1ph On-Grid Poly',
  '14. 8kW 1ph Hybrid Mono 10kWh'
];

export const NewOrderQuotationPage: React.FC<NewOrderQuotationPageProps> = ({
  setCurrentRoute,
  onSelectProduct,
  openConfigurator,
  initialMode = 'setup'
}) => {
  const { 
    products, 
    activeQuote, 
    startNewQuote, 
    updateQuoteItemQty, 
    removeQuoteItem, 
    saveQuoteToFirebase 
  } = useData();
  const { addToCart, setIsCartOpen } = useCart();

  // Page View Modes: 'setup' (New Quotation Form) | 'quotation' (Official Quotation Letter)
  const [viewMode, setViewMode] = useState<'setup' | 'quotation'>(
    initialMode === 'quotation' || (activeQuote && activeQuote.items.length > 0 && initialMode !== 'setup')
      ? 'quotation'
      : 'setup'
  );

  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode);
    }
  }, [initialMode]);

  // Form State
  const [orderType, setOrderType] = useState(activeQuote?.type || 'PV Equipment Sales *');
  const [description, setDescription] = useState(activeQuote?.description || 'Group_Project');
  const [selectedTemplate, setSelectedTemplate] = useState('Start from a blank order (Build your own BOM)');

  // Notification and Toast States
  const [orderUpdatedToast, setOrderUpdatedToast] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingFirebase, setIsSavingFirebase] = useState(false);

  // Catalog Quick-Add Drawer / Modal State
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Instruction Animation Modal State
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  // Handle Initial "CREATE" Action:
  // User Requirement: "can we show like an animation instruction on how to plase an oder when the user press create"
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    startNewQuote(description, orderType, selectedTemplate);
    setShowInstructionModal(true);
  };

  const handleProceedToCatalog = () => {
    setShowInstructionModal(false);
    setCurrentRoute('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSelect = (tmpl?: string, type?: string) => {
    if (tmpl) setSelectedTemplate(tmpl);
    if (type) setOrderType(type);
    const el = document.getElementById('order-console');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic Quote items from activeQuote
  const items = activeQuote?.items || [];

  // Quantity edit
  const handleQuantityChange = (id: string, newQty: number) => {
    updateQuoteItemQty(id, newQty);
    setOrderUpdatedToast(true);
    setTimeout(() => setOrderUpdatedToast(false), 2500);
  };

  // Delete line item
  const handleDeleteItem = (id: string) => {
    removeQuoteItem(id);
    setOrderUpdatedToast(true);
    setTimeout(() => setOrderUpdatedToast(false), 2500);
  };

  // Add Product from Catalog
  const handleAddProductToQuote = (product: Product) => {
    const existing = items.find(item => item.partNo === (product.sku || product.id.toUpperCase()));
    if (existing) {
      updateQuoteItemQty(existing.id, existing.qty + 1);
    } else {
      updateQuoteItemQty(`custom-${Date.now()}`, 1);
    }
    setOrderUpdatedToast(true);
    setTimeout(() => setOrderUpdatedToast(false), 2500);
  };

  // Financial Calculations based entirely on items
  const totalPriceNetZAR = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.netPriceZAR * item.qty), 0);
  }, [items]);

  const vat15ZAR = useMemo(() => {
    return totalPriceNetZAR * 0.15;
  }, [totalPriceNetZAR]);

  const grossTotalZAR = useMemo(() => {
    return totalPriceNetZAR + vat15ZAR;
  }, [totalPriceNetZAR, vat15ZAR]);

  // Calculate total Wp from panels for dynamic c/Wp display
  const totalWp = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.powerOutputW) return sum + (item.powerOutputW * item.qty);
      const match = item.description.match(/(\d+)\s*Wp/i) || item.description.match(/(\d+)\s*W/i);
      if (match && (
        item.description.toLowerCase().includes('panel') || 
        item.description.toLowerCase().includes('module') || 
        item.partNo.toLowerCase().includes('jkm') || 
        item.partNo.toLowerCase().includes('cnc')
      )) {
        return sum + (parseInt(match[1]) * item.qty);
      }
      return sum;
    }, 0);
  }, [items]);

  const centsPerWp = useMemo(() => {
    if (!totalWp || totalWp === 0) return 0;
    return Number(((totalPriceNetZAR / totalWp) * 100).toFixed(1));
  }, [totalPriceNetZAR, totalWp]);

  const handleUpdateOrder = () => {
    setOrderUpdatedToast(true);
    setTimeout(() => setOrderUpdatedToast(false), 2500);
  };

  const handleSaveToFirebase = async () => {
    if (!activeQuote) return;
    setIsSavingFirebase(true);
    try {
      await saveQuoteToFirebase(activeQuote);
      showToast(`Quote ${activeQuote.referenceNo} successfully saved to Firebase Firestore!`);
    } catch {
      showToast('Notice: Quote saved locally.');
    } finally {
      setIsSavingFirebase(false);
    }
  };

  const handleSubmitOrder = () => {
    if (!activeQuote || items.length === 0) return;
    items.forEach(item => {
      if (item.netPriceZAR > 0) {
        const matched = products.find(p => p.sku === item.partNo || p.id.toLowerCase() === item.partNo.toLowerCase());
        const prodToAdd: Product = matched || {
          id: item.partNo,
          name: item.description,
          brand: item.brand || item.partNo.split('-')[0] || 'Kinetix',
          category: 'solar-panels',
          priceZAR: item.netPriceZAR,
          sku: item.partNo,
          image: item.image || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
          summary: item.description,
          warrantyYears: 10,
          inStock: true,
          stockCount: 100,
          specs: [],
          compatibility: [],
          installationAvailable: true,
          faqs: []
        };
        addToCart(prodToAdd, item.qty);
      }
    });
    setOrderSubmitted(true);
    setTimeout(() => {
      setIsCartOpen(true);
    }, 1000);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E6ECE8] font-sans pb-24">
      {/* Top Header Navigation Bar */}
      <div className="border-b border-[#1E2530] bg-[#0D1117]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('shop')}
            className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#00D2FF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </button>
          <span className="text-[#1E2530]">•</span>
          <span className="text-xs font-mono text-[#64748B] hidden sm:inline">
            SEGENSOLAR PTY RESELLER PORTAL // QUOTATION GENERATOR
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInstructionModal(true)}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#00D2FF]/10 hover:bg-[#00D2FF]/20 border border-[#00D2FF]/30 text-[#00D2FF] flex items-center gap-1.5 transition-all cursor-pointer"
            title="How to build and place your quotation order"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Order Guide</span>
          </button>

          {viewMode === 'quotation' && (
            <>
              <button
                onClick={() => setViewMode('setup')}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#1E2530] hover:border-white/20 text-[#CBD5E1] transition-all cursor-pointer"
              >
                Edit Setup Details
              </button>
              <button
                onClick={handlePrintQuote}
                className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Print Quote</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className="p-3.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] text-xs font-mono flex items-center justify-between animate-in fade-in shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 1: STARLINK FULL-BLEED CINEMATIC HERO & PROSPECTIVE ORDER SETUP  */}
      {/* ===================================================================== */}
      {viewMode === 'setup' ? (
        <div className="space-y-0">
          
          {/* ========================================================= */}
          {/* STARLINK SECTION 1: HERO VIEWPORT WITH ADDRESS/ORDER BAR */}
          {/* ========================================================= */}
          <section className="relative min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-[#1E2530]">
            {/* Full-Bleed Edge-to-Edge Background */}
            <div className="absolute inset-0 z-0">
              <img
                src="/hero-solar-home.jpg"
                alt="Modern luxury eco-home with integrated solar rooftop and battery storage under dramatic sky"
                className="w-full h-full object-cover object-[center_35%] sm:object-center filter brightness-[0.70] contrast-[1.1] scale-105 transition-all duration-1000"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/commercial-solar-sa.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,210,255,0.18),transparent)]" />
              <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />
            </div>

            {/* Top spacer / Eyebrow badge */}
            <div className="relative z-10 pt-10 sm:pt-14">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#00D2FF] uppercase font-bold shadow-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
                  <span>SANS 10142-1-2 COMPLIANT // TIER-1 PHOTOVOLTAIC HARDWARE</span>
                </div>
              </div>
            </div>

            {/* Center Hero Content & Iconic Starlink Capsule Input */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-8 sm:py-12 text-center space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.95] drop-shadow-2xl">
                  ENGINEERED SOLAR.
                </h1>
                <p className="text-sm sm:text-lg md:text-xl font-mono text-[#CBD5E1] tracking-wider uppercase max-w-3xl mx-auto drop-shadow font-light">
                  Direct SegenSolar Procurement • Tier-1 Storage • SABS Switchgear
                </p>
              </div>

              {/* Starlink Address / Project Reference Input Capsule */}
              <div className="w-full max-w-2xl mx-auto pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-black/80 backdrop-blur-2xl border border-white/20 hover:border-white/40 focus-within:border-[#00D2FF] shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-all">
                  <div className="flex items-center gap-3 px-4 py-2 w-full">
                    <MapPin className="w-5 h-5 text-[#00D2FF] shrink-0" />
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickSelect();
                        }
                      }}
                      placeholder="ENTER SERVICE ADDRESS OR PROJECT NAME..."
                      className="bg-transparent border-none text-white text-xs sm:text-sm font-mono placeholder:text-neutral-500 focus:outline-none w-full uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl sm:rounded-full transition-all shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-102 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>ORDER NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Pre-select Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  {[
                    { label: 'RESIDENTIAL (5kW–8kW)', tmpl: '11. 5kW 1ph Hybrid Mono 5kWh', type: 'PV Equipment Sales *' },
                    { label: 'COMMERCIAL TURNKEY (10kW–50kW)', tmpl: '10. 50kW 3ph On-Grid Poly', type: 'Commercial Turnkey *' },
                    { label: 'ENERGY STORAGE SYSTEM', tmpl: '14. 8kW 1ph Hybrid Mono 10kWh', type: 'PV Equipment Sales *' },
                    { label: 'CUSTOM BOM (BLANK)', tmpl: 'Start from a blank order (Build your own BOM)', type: 'PV Equipment Sales *' }
                  ].map((pill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickSelect(pill.tmpl, pill.type)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer border ${
                        selectedTemplate === pill.tmpl
                          ? 'bg-[#00D2FF]/20 border-[#00D2FF] text-[#00D2FF]'
                          : 'bg-black/60 hover:bg-white/10 border-white/10 hover:border-white/30 text-[#CBD5E1]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Telemetry Specs Bar (Starlink Style) */}
            <div className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 text-xs font-mono text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
                    <span className="text-[#64748B]">UPS SWITCH:</span>
                    <strong className="text-white">&lt; 4ms AUTOMATIC</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="text-[#64748B]">BATTERY CELLS:</span>
                    <strong className="text-white">6,000+ CYCLES (10-YR)</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="text-[#64748B]">BUFFER STOCK:</span>
                    <strong className="text-white">1,606 UNITS ALLOCATED</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
                    <span className="text-[#64748B]">PRICE GUARANTEE:</span>
                    <strong className="text-[#00D2FF]">14-DAY PRICE LOCK</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickSelect()}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <span>CONFIGURE BOM</span>
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* STARLINK SHOWCASE SECTION 1: RESILIENCE & BACKUP POWER    */}
          {/* ========================================================= */}
          <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-start overflow-hidden border-b border-[#1E2530]">
            <div className="absolute inset-0 z-0">
              <img
                src="/battery-inverter-room.jpg"
                alt="High-density solar battery and inverter installation room"
                className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.15] scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/40 lg:hidden" />
              <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 w-full">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold">
                  <Battery className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>GRID-INDEPENDENCE & STORAGE</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
                  UNINTERRUPTED RESILIENCE.
                </h2>

                <p className="text-sm sm:text-base text-[#CBD5E1] font-light leading-relaxed">
                  Engineered specifically for South Africa's extreme grid volatility. Ultra-fast sub-4ms UPS transfer prevents sensitive equipment, medical apparatus, and security systems from rebooting during sudden Eskom load shedding.
                </p>

                {/* 3-Column Spec Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">&lt; 4ms</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Transfer Time</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">6,000+</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">90% DoD Cycles</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#00D2FF] font-mono block">10-YR</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Cell Warranty</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('11. 5kW 1ph Hybrid Mono 5kWh', 'PV Equipment Sales *')}
                    className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-102 flex items-center gap-2 cursor-pointer"
                  >
                    <span>SELECT 5kW HYBRID SYSTEM</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSelect('14. 8kW 1ph Hybrid Mono 10kWh', 'PV Equipment Sales *')}
                    className="px-6 py-4 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>8kW / 10kWh SYSTEM</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* STARLINK SHOWCASE SECTION 2: CLIMATE & HIGH-DURABILITY    */}
          {/* ========================================================= */}
          <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-end overflow-hidden border-b border-[#1E2530]">
            <div className="absolute inset-0 z-0">
              <img
                src="/solar-installer-roof.jpg"
                alt="Solar technician installing panels on rooftop under bright sunny sky"
                className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.1] scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/80 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/40 lg:hidden" />
              <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 w-full flex justify-end">
              <div className="max-w-2xl space-y-6 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>WEATHERPROOF ENGINEERING</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
                  CLIMATE HARDENED.
                </h2>

                <p className="text-sm sm:text-base text-[#CBD5E1] font-light leading-relaxed ml-auto">
                  Built to withstand South Africa’s extreme UV radiation, severe Highveld hail, and coastal maritime corrosion. Heavy-duty anodized aluminum framing rated for 140 km/h wind shear with IP65-sealed ingress enclosures.
                </p>

                {/* 3-Column Spec Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">140 km/h</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Wind Resistance</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">IP65</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Ingress Sealed</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#00D2FF] font-mono block">SANS</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">10142-1-2 Standard</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('2. 10kW 3ph Hybrid Mono 10kWh', 'Commercial Turnkey *')}
                    className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-102 flex items-center gap-2 cursor-pointer"
                  >
                    <span>10kW 3-PHASE HYBRID</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* STARLINK SHOWCASE SECTION 3: WAREHOUSE BUFFER & LOGISTICS */}
          {/* ========================================================= */}
          <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-start overflow-hidden border-b border-[#1E2530]">
            <div className="absolute inset-0 z-0">
              <img
                src="/commercial-solar-sa.jpg"
                alt="Commercial rooftop solar installation in South Africa"
                className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.15] scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/40 lg:hidden" />
              <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 w-full">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold">
                  <Truck className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>DIRECT SABS WAREHOUSE BUFFER</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
                  DIRECT ALLOCATION.
                </h2>

                <p className="text-sm sm:text-base text-[#CBD5E1] font-light leading-relaxed">
                  Order directly against verified physical inventory in SegenSolar bonded logistics centers in Johannesburg and Cape Town. Transparent wholesale trade pricing with an official 14-day price lock guarantee.
                </p>

                {/* 3-Column Spec Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">1,606</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Units Buffer</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono block">14-Day</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Price Lock</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#00D2FF] font-mono block">24–48h</span>
                    <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">Courier Dispatch</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('10. 50kW 3ph On-Grid Poly', 'Commercial Turnkey *')}
                    className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-102 flex items-center gap-2 cursor-pointer"
                  >
                    <span>50kW COMMERCIAL TURNKEY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickSelect('3. 12kW Sunsynk Commercial 3-Phase + Freedom Won 15kWh', 'Commercial Turnkey *')}
                    className="px-6 py-4 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>12kW SUNSYNK + FREEDOM WON</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION 4: INTERACTIVE PROSPECTIVE ORDER CONSOLE          */}
          {/* ========================================================= */}
          <div id="order-console" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-2 pb-10">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#00D2FF] font-bold block">
                CONFIGURATION CONSOLE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                CREATE PROSPECTIVE ORDER
              </h2>
              <p className="text-sm text-[#94A3B8] font-mono max-w-xl mx-auto">
                Define your project scope, select a certified pre-engineered template or start from a blank bill of materials.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: SegenSolar Facility Guidelines & Tools */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1117]/90 backdrop-blur-2xl border border-[#1E2530] space-y-5 shadow-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
                      Facility Overview
                    </span>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      Prospective Project Facility
                    </h3>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    This facility may be used for building a list of items to be utilised for a prospective project. You will be able to see all the prices of the selected items and when you are ready to place the order on SegenSolar Pty you may complete it, but until then it will not be processed.
                  </p>
                  
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    You will be given the option to create your prospective order from a pre-defined template or start from a blank order.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <span className="text-[11px] font-mono text-white font-bold block uppercase tracking-wider">
                      Alternative Planning Tools:
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                      <button 
                        type="button"
                        onClick={() => openConfigurator ? openConfigurator() : setCurrentRoute('shop')} 
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D2FF]/40 text-[#00D2FF] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Quick Quote</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => openConfigurator ? openConfigurator() : setCurrentRoute('shop')} 
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D2FF]/40 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>System Designer</span>
                      </button>
                    </div>
                  </div>

                  {/* Important Alert Notice */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs leading-relaxed flex items-start gap-3 shadow-lg">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white block uppercase mb-0.5">Important Procurement Note:</strong>
                      Please ensure you create a shipment and make any required payment promptly so we can prepare to ship your goods to you.
                    </span>
                  </div>

                  {/* Interactive Tutorial Button */}
                  <button
                    type="button"
                    onClick={() => setShowInstructionModal(true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#00D2FF]/10 hover:bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Watch Interactive Order Guide (4 Steps)</span>
                  </button>

                </div>
              </div>

              {/* Right Column: New Quotation Setup Form */}
              <div className="lg:col-span-7">
                <form 
                  onSubmit={handleCreateQuotation} 
                  className="bg-[#0D1117]/95 backdrop-blur-2xl border-2 border-[#00D2FF]/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_0_60px_rgba(0,210,255,0.15)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent" />

                  <div className="flex items-center justify-between border-b border-[#1E2530] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
                        Order Configuration
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Create Prospective Order
                      </h2>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#94A3B8]">
                      Step 1 of 2
                    </span>
                  </div>

                  {/* Type Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Order Type:
                    </label>
                    <select
                      value={orderType}
                      onChange={e => setOrderType(e.target.value)}
                      className="w-full bg-[#05070A] border border-[#1E2530] focus:border-[#00D2FF] rounded-xl px-4 py-3.5 text-xs text-white font-mono focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="PV Equipment Sales *">PV Equipment Sales *</option>
                      <option value="Commercial Turnkey *">Commercial Turnkey *</option>
                      <option value="Warranty Replacement *">Warranty Replacement *</option>
                    </select>
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Project Description*:
                    </label>
                    <input
                      type="text"
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="e.g. Group_Project"
                      className="w-full bg-[#05070A] border border-[#1E2530] focus:border-[#00D2FF] rounded-xl px-4 py-3.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#00D2FF] transition-all"
                    />
                    <span className="block text-[11px] text-[#64748B] font-mono">
                      * Your unique project reference name for this quotation.
                    </span>
                  </div>

                  {/* Template Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Starting Template*:
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={e => setSelectedTemplate(e.target.value)}
                      className="w-full bg-[#05070A] border border-[#1E2530] focus:border-[#00D2FF] rounded-xl px-4 py-3.5 text-xs text-white font-mono focus:outline-none transition-colors cursor-pointer text-ellipsis overflow-hidden"
                    >
                      {TEMPLATES.map(tmpl => (
                        <option key={tmpl} value={tmpl}>
                          {tmpl}
                        </option>
                      ))}
                    </select>
                    <span className="block text-[11px] text-[#64748B] font-mono">
                      * Start from a blank order or load pre-engineered BOM configurations.
                    </span>
                  </div>

                  {/* Starlink Dual Action Buttons */}
                  <div className="pt-6 border-t border-[#1E2530] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <span className="text-[11px] font-mono text-[#64748B] text-left max-w-xs">
                      * Select Create when you have entered a description and template.
                    </span>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowInstructionModal(true)}
                        className="px-6 py-4 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-[#00D2FF]/50 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#00D2FF]" />
                        <span>How it Works</span>
                      </button>

                      <button
                        type="submit"
                        className="px-10 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-102 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>CREATE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </form>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* =================================================================== */
        /* MODE 2: OFFICIAL SEGENSOLAR QUOTATION LETTER                        */
        /* =================================================================== */
        <div className="space-y-8">
          
          {/* STARLINK-STYLE QUOTATION REPORT CINEMATIC HERO BANNER (print:hidden) */}
          <section className="relative pt-20 sm:pt-28 pb-16 px-4 sm:px-8 lg:px-12 border-b border-[#1E2530] overflow-hidden print:hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="/commercial-solar-sa.jpg"
                alt="Commercial Solar Installation"
                className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1] scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/50 to-[#05070A]/85" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,210,255,0.15),transparent)]" />
              <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>SEGENSOLAR PTY // OFFICIAL QUOTATION REPORT</span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl space-y-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                    Official Quotation.
                  </h1>
                  <p className="text-sm sm:text-base text-[#CBD5E1] font-mono">
                    Reference: <strong className="text-[#00D2FF]">{activeQuote?.referenceNo || 'KiPV07912 - Group_Project'}</strong> • Account: <strong className="text-white">KINESP002</strong> • 14-Day Price Lock Active
                  </p>
                </div>

                {/* Financial Telemetry Metrics */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#94A3B8]">
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
                    <span className="text-[#64748B] block text-[10px] uppercase">Net Subtotal</span>
                    <span className="text-white font-bold font-mono">R {totalPriceNetZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
                    <span className="text-[#64748B] block text-[10px] uppercase">15% VAT</span>
                    <span className="text-white font-bold font-mono">R {vat15ZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-[#10B981]/50 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <span className="text-[#64748B] block text-[10px] uppercase">Gross Total</span>
                    <span className="text-[#10B981] font-bold font-mono text-sm">R {grossTotalZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {centsPerWp > 0 && (
                    <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-[#00D2FF]/40 rounded-xl shadow-lg">
                      <span className="text-[#64748B] block text-[10px] uppercase">Solar Metric</span>
                      <span className="text-[#00D2FF] font-bold font-mono">{centsPerWp} c/Wp</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Quotation report content container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            {/* Success Toast */}
            {orderUpdatedToast && (
              <div className="p-3.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] text-xs font-mono flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Quotation order quantities & financial line items recalculated.</span>
                </div>
              </div>
            )}

            {orderSubmitted && (
              <div className="p-4 rounded-2xl bg-[#00D2FF]/20 border border-[#00D2FF] text-white space-y-2 text-center animate-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-[#00D2FF]/30 flex items-center justify-center mx-auto text-[#00D2FF]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm uppercase">Order Successfully Dispatched to Procurement</h4>
                <p className="text-xs text-[#CBD5E1]">
                  Quote {activeQuote?.referenceNo || 'KiPV07912 - Group_Project'} has been loaded into your trade cart buffer. Finalizing reservation...
                </p>
              </div>
            )}

            {/* Quote Header Bar (Segen Portal Toolbar) */}
            <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl print:hidden">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-[#00D2FF] font-bold">Quote:</span>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeQuote?.referenceNo || 'KiPV07912 - Group_Project'}
                  </h2>
                </div>
                {/* Secondary navigation links from Segen Portal */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] flex-wrap">
                  <span className="text-[#00D2FF] font-semibold underline cursor-pointer">View Quote</span>
                  <span>-</span>
                  <button onClick={() => setViewMode('setup')} className="hover:text-white underline cursor-pointer">
                    Edit Details
                  </button>
                  <span>-</span>
                  <button onClick={handlePrintQuote} className="hover:text-white underline cursor-pointer">
                    Print Quote
                  </button>
                  <span>-</span>
                  <button onClick={() => setCurrentRoute('contact')} className="hover:text-white underline cursor-pointer">
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentRoute('shop')}
                  className="px-3.5 py-2 rounded-xl bg-[#00D2FF]/15 hover:bg-[#00D2FF]/25 border border-[#00D2FF]/40 text-[#00D2FF] font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Return to product catalog to select more products"
                >
                  <Plus className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Add More Products</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToFirebase}
                  disabled={isSavingFirebase}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Save quote document to Firebase Firestore"
                >
                  <Cloud className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{isSavingFirebase ? 'Saving...' : 'Save to Firebase'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={items.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#00D2FF] hover:brightness-110 text-black font-mono font-bold text-xs uppercase tracking-wide shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  Submit Order
                </button>
              </div>
            </div>

            {/* ================================================================= */}
            {/* THE QUOTATION LETTER CARD (Official Printable Document)            */}
            {/* ================================================================= */}
            <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 print:bg-white print:text-black print:border-none print:p-0">
              
              {/* Official Quotation Letterhead */}
              <div className="border-b border-[#1E2530] pb-6 space-y-4 print:border-black">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-white print:text-black uppercase">
                      Quotation
                    </h1>
                    <p className="text-xs font-mono text-[#94A3B8] print:text-gray-700">
                      SegenSolar (Pty) Ltd | Northlands Production Park | Northriding | Gauteng | 2169 | South Africa
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">Reference No:</span>
                    <strong className="text-lg font-mono text-[#00D2FF] print:text-black font-extrabold">
                      {activeQuote?.referenceNo || 'KiPV07912 - Group_Project'}
                    </strong>
                  </div>
                </div>

                {/* Account & Party Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5 font-mono text-xs print:border-gray-300">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Account Code</span>
                    <span className="text-white print:text-black font-bold">{activeQuote?.accountCode || 'KINESP002'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Organisation</span>
                    <span className="text-white print:text-black font-bold">{activeQuote?.organisation || 'Kinetix Engineering Solutions'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Type</span>
                    <span className="text-white print:text-black font-bold">{(activeQuote?.type || orderType).replace('*', '').trim()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Prospect Status</span>
                    <span className="text-[#10B981] font-bold">Proposal/Price Quote</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Stock Location</span>
                    <span className="text-white print:text-black font-bold">West Rand</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Description</span>
                    <span className="text-white print:text-black font-bold">{activeQuote?.description || description}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Created Date</span>
                    <span className="text-white print:text-black font-bold">{activeQuote?.createdAt || new Date().toISOString().split('T')[0]}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#64748B] block">Delivery Organisation</span>
                    <span className="text-white print:text-black font-bold">{activeQuote?.organisation || 'Kinetix Engineering'}</span>
                  </div>
                </div>

                {/* Delivery Address & Terms */}
                <div className="p-3.5 rounded-xl bg-[#05070A] border border-[#1E2530] font-mono text-xs space-y-1.5 print:bg-gray-50 print:border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[#64748B] text-[10px] block uppercase">Delivery Address:</span>
                      <span className="text-white print:text-black">
                        {activeQuote?.address || '2068 W Section , Botshabelo Bloemfontein Republic of South Africa 9781'}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[#64748B] text-[10px] block uppercase">Payment Terms:</span>
                      <span className="text-amber-400 font-bold print:text-black">No credit available (Proforma Trade).</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#64748B] pt-1 border-t border-white/5">
                    Customer-generated quotations are valid for 14 days from the above date ({activeQuote?.validUntil || '14 Days'}).
                  </div>
                </div>
              </div>

              {/* Line Items Bill of Materials Table */}
              <div className="overflow-x-auto">
                {items.length > 0 ? (
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#1E2530] text-[#64748B] uppercase text-[10px] tracking-wider print:border-black">
                        <th className="py-2.5 px-3 w-16">Qty</th>
                        <th className="py-2.5 px-3 w-48">Part No</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-right w-28">Net</th>
                        <th className="py-2.5 px-3 text-right w-32">Total Price</th>
                        <th className="py-2.5 px-3 text-center w-14 print:hidden">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2530]/60 print:divide-gray-200">
                      {items.map(item => {
                        const lineTotal = item.netPriceZAR * item.qty;
                        return (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                            {/* Qty with inline editor */}
                            <td className="py-2.5 px-3 font-bold text-white print:text-black">
                              <input
                                type="number"
                                min="0"
                                value={item.qty}
                                onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                className="w-14 bg-[#05070A] border border-[#1E2530] focus:border-[#00D2FF] rounded px-1.5 py-0.5 text-center text-xs text-white print:border-none print:p-0 print:text-black focus:outline-none"
                              />
                            </td>

                            {/* Part Number */}
                            <td className="py-2.5 px-3 text-[#00D2FF] print:text-black font-semibold">
                              {item.link ? (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1 group-hover:text-white transition-colors"
                                >
                                  <span>{item.partNo}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-50 print:hidden" />
                                </a>
                              ) : (
                                <span>{item.partNo}</span>
                              )}
                            </td>

                            {/* Description */}
                            <td className="py-2.5 px-3 text-[#CBD5E1] print:text-black font-sans leading-tight">
                              {item.description}
                            </td>

                            {/* Unit Net Price */}
                            <td className="py-2.5 px-3 text-right text-[#94A3B8] print:text-black">
                              {item.netPriceZAR === 0 ? 'POA' : `R ${item.netPriceZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </td>

                            {/* Line Total */}
                            <td className="py-2.5 px-3 text-right font-bold text-white print:text-black">
                              {item.netPriceZAR === 0 ? 'R 0,00' : `R ${lineTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </td>

                            {/* Delete Button */}
                            <td className="py-2.5 px-3 text-center print:hidden">
                              {item.partNo !== 'DELIVERY' && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 text-[#64748B] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                                  title="Delete line item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center space-y-4 bg-[#05070A] rounded-2xl border border-dashed border-[#1E2530] p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white uppercase font-mono">
                        No Products Added to Quote Yet
                      </h4>
                      <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                        Your prospective project quote for "{activeQuote?.description || 'Group_Project'}" is currently empty. Visit the catalog to add solar panels, inverters, and batteries.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentRoute('shop')}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      + Browse Product Catalog & Add Hardware
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Instructions & Freight Notice */}
              <div className="pt-4 border-t border-[#1E2530] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs print:border-black">
                <div className="space-y-1 max-w-xl text-[#94A3B8] text-[11px]">
                  <p>You can edit the quantity, or delete, multiple line items at once. Click Update to confirm changes.</p>
                  <p className="text-[#64748B]">
                    Your delivery charge has been estimated based upon a single shipment from our Segen Office - West Rand warehouse. This will be automatically recalculated when you create a shipment to request we deliver your goods.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateOrder}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs uppercase transition-all cursor-pointer shrink-0 print:hidden"
                >
                  Update Order
                </button>
              </div>

              {/* Financial Calculation Summary Deck */}
              <div className="pt-4 border-t border-[#1E2530] flex flex-col items-end space-y-2 font-mono print:border-black">
                <div className="w-full sm:w-80 space-y-1.5 text-xs">
                  
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Total Net Price</span>
                    <strong className="text-white print:text-black font-bold">
                      R {totalPriceNetZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>

                  {totalWp > 0 && (
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span>Rate per Wp ({totalWp.toLocaleString()} Wp)</span>
                      <span className="text-[#00D2FF] print:text-black font-semibold">
                        {centsPerWp}c/Wp
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>VAT (15.00%)</span>
                    <span className="text-white print:text-black">
                      R {vat15ZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-base font-extrabold text-white print:text-black">
                    <span className="uppercase text-xs text-[#00D2FF] print:text-black">Gross Total</span>
                    <span className="text-[#00D2FF] print:text-black text-lg">
                      R {grossTotalZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* QUICK ADD CATALOG PRODUCTS MODAL DRAWER                                */}
      {/* ======================================================================= */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[#1E2530] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  Add Hardware Products to Quote
                </h3>
                <p className="text-xs text-[#94A3B8]">Select items from live Tier-1 warehouse inventory.</p>
              </div>
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-[#1E2530]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  placeholder="Search inverter, panels, batteries..."
                  className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-white/5">
              {products
                .filter(p => p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || p.brand.toLowerCase().includes(catalogSearch.toLowerCase()))
                .slice(0, 15)
                .map(p => (
                  <div key={p.id} className="pt-2 flex items-center justify-between gap-3 text-xs font-mono">
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-bold truncate">{p.brand} {p.name}</div>
                      <div className="text-[10px] text-[#64748B]">{p.category} // SKU: {p.id.toUpperCase()}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-bold">R{p.priceZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
                      <button
                        onClick={() => handleAddProductToQuote(p)}
                        className="mt-1 px-2.5 py-1 bg-[#00D2FF]/20 hover:bg-[#00D2FF] text-[#00D2FF] hover:text-black font-bold text-[10px] rounded uppercase transition-colors cursor-pointer"
                      >
                        + Add Line
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-[#1E2530] text-right">
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Done Adding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Order Instruction & Tutorial Modal */}
      <OrderInstructionModal
        isOpen={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
        onProceed={handleProceedToCatalog}
        referenceNo={activeQuote?.referenceNo || 'KiPV07912'}
        projectDescription={activeQuote?.description || description}
      />

    </div>
  );
};
