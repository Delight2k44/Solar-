import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Sun, 
  Maximize2, 
  Award, 
  Share2, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  Layers,
  Wrench,
  Battery,
  Clock,
  ArrowRight,
  Download,
  ChevronDown,
  Shield,
  BadgePercent,
  CheckCircle
} from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';

interface ProductPageProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBackToShop: () => void;
  openConfigurator: () => void;
}

type ViewAngle = 'perspective' | 'interface' | 'installation' | 'schematic';
type SpecTab = 'electrical' | 'mechanical' | 'warranty' | 'compatibility' | 'documents';

export const ProductPage: React.FC<ProductPageProps> = ({ 
  product, 
  onSelectProduct, 
  onBackToShop,
  openConfigurator 
}) => {
  const { products } = useData();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [activeTab, setActiveTab] = useState<SpecTab>('electrical');
  const [activeViewAngle, setActiveViewAngle] = useState<ViewAngle>('perspective');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showStickyPurchase, setShowStickyPurchase] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveViewAngle('perspective');
    setSelectedVariantIndex(0);
    setQuantity(1);
  }, [product.id]);

  // Track scroll position for sticky purchase ribbon
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setShowStickyPurchase(true);
      } else {
        setShowStickyPurchase(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find products in the same category for carousel navigation
  const categoryProducts = products.filter(p => p.category === product.category);
  const currentIndex = categoryProducts.findIndex(p => p.id === product.id);
  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : categoryProducts[categoryProducts.length - 1];
  const nextProduct = currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : categoryProducts[0];

  // Hardware Ecosystem Pairings: Recommended complement items
  const ecosystemPairings = products
    .filter(p => {
      if (product.category === 'inverters') return p.category === 'batteries' || p.category === 'solar-panels';
      if (product.category === 'batteries') return p.category === 'inverters' || p.category === 'protection-accessories';
      if (product.category === 'solar-panels') return p.category === 'inverters' || p.category === 'mounting-equipment';
      return p.category !== product.category;
    })
    .slice(0, 3);

  // Related products (excluding current)
  const relatedProducts = categoryProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Keyboard shortcut listener for arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && prevProduct) {
        onSelectProduct(prevProduct);
      } else if (e.key === 'ArrowRight' && nextProduct) {
        onSelectProduct(nextProduct);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevProduct, nextProduct, onSelectProduct]);

  // Dynamic capacity & size variant chips based on category
  const getVariants = () => {
    if (product.category === 'inverters') {
      return [
        { label: '5.0 kW Hybrid', spec: 'Single Phase • 2x MPPT', multiplier: 0.8 },
        { label: '8.0 kW High-Yield', spec: 'Single Phase • 2x MPPT (Current)', multiplier: 1.0 },
        { label: '12.0 kW Commercial', spec: 'Three Phase • 4x MPPT', multiplier: 1.55 }
      ];
    }
    if (product.category === 'batteries') {
      return [
        { label: '5.12 kWh Base', spec: '1C Discharge • 6,000 Cycles', multiplier: 0.65 },
        { label: '10.24 kWh Dual Stack', spec: 'High-Density • 6,000 Cycles (Current)', multiplier: 1.0 },
        { label: '14.3 kWh High-Density', spec: 'Server Rack Form Factor', multiplier: 1.4 }
      ];
    }
    if (product.category === 'solar-panels') {
      return [
        { label: 'Single Module', spec: '550W N-Type TOPCon (Current)', multiplier: 1.0 },
        { label: '6-Panel Array', spec: '3.3 kWp String Package', multiplier: 5.8 },
        { label: 'Full Pallet (36x)', spec: '19.8 kWp Bulk Contractor Pack', multiplier: 33.5 }
      ];
    }
    return [
      { label: 'Standard Unit', spec: 'OEM Verified Unit (Current)', multiplier: 1.0 },
      { label: 'Contractor Pack (5x)', spec: 'Bulk Installation Bundle', multiplier: 4.8 }
    ];
  };

  const variants = getVariants();
  const currentVariant = variants[selectedVariantIndex] || variants[0];

  // Pricing calculations
  const basePriceZAR = product.priceZAR * currentVariant.multiplier;
  const installationFeeZAR = product.installationPriceZAR || 4850;
  const effectiveUnitPrice = includeInstallation ? basePriceZAR + installationFeeZAR : basePriceZAR;
  const totalPriceExclVat = effectiveUnitPrice * quantity;
  const vatAmountZAR = totalPriceExclVat * 0.15;
  const totalPriceInclVat = totalPriceExclVat + vatAmountZAR;
  const monthlyFinanceEstimate = Math.round((totalPriceInclVat / 36) * 1.12);

  // Normalized efficiency metric
  const getNormalizedMetric = () => {
    if (product.category === 'solar-panels') {
      const watts = product.ratingKw ? product.ratingKw * 1000 : 550;
      return {
        value: `R ${(basePriceZAR / watts).toFixed(3)}`,
        label: 'per Watt peak (Wp)'
      };
    }
    if (product.category === 'batteries') {
      const kwh = product.capacityKwh || 5.12;
      return {
        value: `R ${Math.round(basePriceZAR / kwh).toLocaleString()}`,
        label: 'per kWh storage capacity'
      };
    }
    if (product.category === 'inverters') {
      const kw = product.ratingKw || 8;
      return {
        value: `R ${Math.round(basePriceZAR / kw).toLocaleString()}`,
        label: 'per kW continuous output'
      };
    }
    return {
      value: `SKU: ${product.sku}`,
      label: 'direct manufacturer procurement'
    };
  };

  const normalizedMetric = getNormalizedMetric();

  // Multi-angle imagery mapper
  const getAngleImage = (angle: ViewAngle) => {
    switch (angle) {
      case 'interface':
        return product.category === 'inverters' || product.category === 'batteries'
          ? '/battery-inverter-room.jpg'
          : '/electrician-wiring-db.jpg';
      case 'installation':
        return product.category === 'solar-panels' || product.category === 'mounting-equipment'
          ? '/solar-installer-roof.jpg'
          : '/hero-solar-home.jpg';
      case 'schematic':
        return '/cad-solar-audit.jpg';
      case 'perspective':
      default:
        return product.image || '/solar-panel-mono.jpg';
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, includeInstallation);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadDoc = (docName: string) => {
    setDownloadToast(`Preparing ${docName} verification packet...`);
    setTimeout(() => {
      setDownloadToast(`✓ ${docName} downloaded successfully.`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E6ECE8] font-sans selection:bg-[#00D2FF] selection:text-black pb-24">
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST GLASS RIBBON: BREADCRUMBS + CAROUSEL NAVIGATION */}
      {/* ========================================================================= */}
      <section className="border-b border-white/10 bg-[#05070A]/85 backdrop-blur-2xl py-3 px-4 sm:px-8 lg:px-12 sticky top-16 sm:top-20 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-[#94A3B8] truncate">
            <button 
              onClick={onBackToShop}
              className="hover:text-white flex items-center gap-1.5 transition-colors group text-[#00D2FF] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Hardware</span>
            </button>
            <span className="text-white/20">/</span>
            <button 
              onClick={onBackToShop}
              className="hover:text-white transition-colors truncate uppercase cursor-pointer"
            >
              {product.category.replace('-', ' ')}
            </button>
            <span className="text-white/20 hidden sm:inline">/</span>
            <span className="text-white font-semibold truncate hidden sm:inline">{product.name}</span>
          </div>

          {/* Product-by-Product Carousel Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#64748B] hidden lg:inline mr-2">
              Item {currentIndex + 1} of {categoryProducts.length}
            </span>

            <div className="flex items-center gap-1.5">
              {prevProduct && (
                <button
                  onClick={() => onSelectProduct(prevProduct)}
                  title={`Previous: ${prevProduct.name} (Shortcut: ←)`}
                  className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#CBD5E1] hover:text-white flex items-center gap-1 transition-all text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
              )}

              {nextProduct && (
                <button
                  onClick={() => onSelectProduct(nextProduct)}
                  title={`Next: ${nextProduct.name} (Shortcut: →)`}
                  className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#CBD5E1] hover:text-white flex items-center gap-1 transition-all text-xs cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00D2FF]" />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D1117] border border-[#00D2FF]/40 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#00D2FF] animate-spin" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO HARDWARE STAGE (TESLA SPLIT VIEW STANDARD) */}
      {/* ========================================================================= */}
      <section className="pt-8 sm:pt-12 pb-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ----------------------------------------------------------------------- */}
          {/* LEFT 7 COLS: BORDERLESS STUDIO HARDWARE VISUALIZER & ANGLE SWITCHER */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-36">
            
            {/* Main Interactive Stage */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] min-h-[320px] sm:min-h-[420px] rounded-3xl bg-gradient-to-b from-[#0F141C] via-[#090C10] to-[#05070A] border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center p-6 group">
              
              {/* Tesla Ambient Lighting Glow Behind Hardware */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.08),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 subtle-grid opacity-10 pointer-events-none" />

              {/* Hardware Render */}
              <img
                src={getAngleImage(activeViewAngle)}
                alt={product.name}
                className="max-h-[82%] max-w-[82%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/solar-panel-mono.jpg';
                }}
              />

              {/* Top Left: Brand Telemetry Capsule */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white uppercase tracking-wider shadow-md">
                  {product.brand}
                </span>

                {product.ratingKw && (
                  <span className="px-3 py-1 rounded-full bg-[#00D2FF]/20 backdrop-blur-md border border-[#00D2FF]/40 text-[11px] font-mono font-bold text-[#00D2FF] shadow-sm">
                    {product.ratingKw >= 1 ? `${product.ratingKw} kW RATED` : `${Math.round(product.ratingKw * 1000)} W`}
                  </span>
                )}

                {product.capacityKwh && (
                  <span className="px-3 py-1 rounded-full bg-[#00D2FF]/20 backdrop-blur-md border border-[#00D2FF]/40 text-[11px] font-mono font-bold text-[#00D2FF] shadow-sm">
                    {product.capacityKwh} kWh LiFePO4
                  </span>
                )}
              </div>

              {/* Top Right: Live Regional Warehouse Stock Beacon */}
              <div className="absolute top-4 right-4">
                {product.inStock ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 backdrop-blur-md border border-[#10B981]/30 text-[#10B981] font-mono text-xs font-bold shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{product.stockCount.toLocaleString()} in Sandton &amp; CT Hubs</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 backdrop-blur-md border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-md">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Backorder Available</span>
                  </div>
                )}
              </div>

              {/* Bottom Angle Overlay Selector (Tesla Camera Angle Selector Style) */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-2">
                <div className="bg-[#05070A]/85 backdrop-blur-md border border-white/15 rounded-full p-1 flex items-center gap-1 text-[11px] font-mono shadow-xl">
                  <button
                    onClick={() => setActiveViewAngle('perspective')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeViewAngle === 'perspective'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Studio 3D
                  </button>
                  <button
                    onClick={() => setActiveViewAngle('interface')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeViewAngle === 'interface'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Terminals
                  </button>
                  <button
                    onClick={() => setActiveViewAngle('installation')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeViewAngle === 'installation'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    In-Situ
                  </button>
                  <button
                    onClick={() => setActiveViewAngle('schematic')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeViewAngle === 'schematic'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Blueprint
                  </button>
                </div>
              </div>

            </div>

            {/* Triple Trust Benchmark Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-sans">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>{product.warrantyYears}-Year Direct Warranty</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  Tier-1 OEM backing with direct replacement guarantees in South Africa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Truck className="w-4 h-4 text-[#00D2FF]" />
                  <span>Insured SA Freight</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  Dispatched via RAM Logistics &amp; TCG with live waybill GPS tracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" />
                  <span>SANS 10142-1-2 &amp; NRS</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  Pre-cleared for Eskom &amp; City of Cape Town SSEG grid compliance.
                </p>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT 5 COLS: TESLA CONFIGURATION & PROCUREMENT PANEL */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: SKU, Category & Share Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold">
                  {product.category.replace('-', ' ')} // SKU: {product.sku}
                </span>

                <button
                  onClick={handleShare}
                  className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="Share product link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Verified Installations Badge */}
              <div className="flex items-center gap-3 pt-1 text-xs font-mono text-[#94A3B8]">
                <div className="flex items-center text-amber-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-white font-semibold">4.9 / 5.0</span>
                <span className="text-white/20">•</span>
                <span>142 SA Verified Installs</span>
              </div>

              {/* Product Summary */}
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pt-2">
                {product.summary}
              </p>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* TESLA VARIANT SELECTION CHIPS */}
            {/* --------------------------------------------------------------------- */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold uppercase tracking-wide">Select Configuration</span>
                <span className="text-[#00D2FF]">{currentVariant.label}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {variants.map((variant, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedVariantIndex === idx
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-[#CBD5E1] hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{variant.label}</span>
                    <span className={`text-[10px] mt-1 block font-mono ${
                      selectedVariantIndex === idx ? 'text-neutral-600' : 'text-[#64748B]'
                    }`}>
                      {variant.spec}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* TRANSPARENT PRICING CARD WITH ZAR FINANCING ESTIMATOR */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F141C] to-[#070A0E] border border-white/10 shadow-xl space-y-4">
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">
                    Cash Purchase (Excl. 15% VAT)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      R {basePriceZAR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Normalized Metric */}
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">
                    Normalized Metric
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#00D2FF] block mt-1">
                    {normalizedMetric.value}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] block">
                    {normalizedMetric.label}
                  </span>
                </div>
              </div>

              {/* VAT & Financing Breakdown */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>Total Incl. 15% VAT:</span>
                  <strong className="text-white font-bold">
                    R {(basePriceZAR * 1.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span className="flex items-center gap-1.5 text-[#00D2FF]">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>Estimated Financing (36 Mo @ 12%):</span>
                  </span>
                  <span className="text-white font-bold">
                    From R {monthlyFinanceEstimate.toLocaleString()} / mo
                  </span>
                </div>
              </div>

            </div>

            {/* --------------------------------------------------------------------- */}
            {/* OPTIONAL TURNKEY CERTIFIED INSTALLATION TOGGLE */}
            {/* --------------------------------------------------------------------- */}
            {product.installationAvailable && (
              <div 
                onClick={() => setIncludeInstallation(!includeInstallation)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  includeInstallation
                    ? 'bg-[#00D2FF]/10 border-[#00D2FF] text-white shadow-lg'
                    : 'bg-white/[0.02] border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    includeInstallation ? 'bg-[#00D2FF] border-[#00D2FF] text-black font-bold' : 'border-white/30'
                  }`}>
                    {includeInstallation && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Add DoL Master Electrician Installation
                    </span>
                    <span className="text-[11px] text-[#94A3B8] block">
                      Includes SANS 10142-1-2 Certificate of Compliance (CoC) &amp; Municipal Sign-off
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white shrink-0">
                  +R {installationFeeZAR.toLocaleString()}
                </span>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* QUANTITY CONTROLS & PRIMARY TESLA-STYLE PURCHASE ACTIONS */}
            {/* --------------------------------------------------------------------- */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-white/[0.03] border border-white/15 rounded-2xl p-1 font-mono">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-xl hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-xl hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Multiplier Buttons */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]">
                  <button 
                    onClick={() => setQuantity(5)} 
                    className="px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  >
                    x5
                  </button>
                  <button 
                    onClick={() => setQuantity(10)} 
                    className="px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  >
                    x10
                  </button>
                  {product.palletCount && (
                    <button 
                      onClick={() => setQuantity(product.palletCount || 36)} 
                      className="px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    >
                      Pallet ({product.palletCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                {/* Primary Button */}
                <button
                  onClick={handleAddToCart}
                  className="py-4 px-6 bg-white hover:bg-neutral-200 text-black font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Secondary Button: Launches Tesla Solar Design Studio */}
                <button
                  onClick={openConfigurator}
                  className="py-4 px-6 bg-[#0D1117] hover:bg-[#161B22] border border-white/15 hover:border-[#00D2FF] text-white font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-[#00D2FF] group-hover:rotate-12 transition-transform" />
                  <span>Design Full PV System</span>
                </button>
              </div>

              {/* Delivery & Dispatch Notice */}
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Standard Dispatch: 24h from Sandton or Cape Town Hub.</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CINEMATIC HARDWARE STORYTELLING (TESLA DEEP-DIVES) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#00D2FF] uppercase font-bold">
            Aerospace-Grade Precision Engineering
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Severe African Operating Realities
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Every component is bench-tested at our high-voltage laboratory in Sandton to guarantee seamless islanding during Eskom blackout events and relentless thermal performance in extreme Highveld summers.
          </p>
        </div>

        {/* 4 Editorial Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Feature 1 */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F141C] to-[#080B10] border border-white/10 hover:border-[#00D2FF]/40 transition-all group relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-mono text-white/90 group-hover:text-[#00D2FF] transition-colors">
                &lt; 4ms
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] font-bold block">
                Zero-Break Islanding
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Microsecond Uninterrupted UPS Transfer
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Equipped with military-grade solid-state transfer switches capable of islanding backup circuits in under 4 milliseconds. Sensitive workstation clusters, medical chillers, and home automation systems experience zero voltage flicker during abrupt municipal grid collapse.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>SANS 10142-1 Annexure S Verified</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F141C] to-[#080B10] border border-white/10 hover:border-[#00D2FF]/40 transition-all group relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-mono text-white/90 group-hover:text-[#00D2FF] transition-colors">
                5,400 Pa
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] font-bold block">
                Extreme Climatic Defense
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                35mm Severe Hail & Highveld Wind Armor
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Lab-tested against 35mm ice projectiles at terminal velocities exceeding 95 km/h, with a 5,400 Pa mechanical front load rating. Anodized marine-grade aluminium frame with Class C5 salt-fog corrosion resistance protects both coastal and Highveld installations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>IEC 61215-2 Climatic & Mechanical Stress Certified</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F141C] to-[#080B10] border border-white/10 hover:border-[#00D2FF]/40 transition-all group relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-mono text-white/90 group-hover:text-[#00D2FF] transition-colors">
                &gt; 87.4%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] font-bold block">
                Ultra-Low Degradation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                30-Year Linear Output Guarantee
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Engineered with advanced N-Type TOPCon or high-cycle LiFePO4 cells offering an ultra-low annual degradation rate of less than 0.40% per annum. Guarantees minimum 87.4% retained generation capability after three continuous decades of service.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Direct Segen Solar & Tier-1 OEM Backing</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F141C] to-[#080B10] border border-white/10 hover:border-[#00D2FF]/40 transition-all group relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-mono text-white/90 group-hover:text-[#00D2FF] transition-colors">
                NRS 097
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] font-bold block">
                Regulatory Fast-Track
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                SSEG Municipal Grid Interconnection
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Pre-approved on municipal feed-in registers including City of Cape Town, City Power Johannesburg, and Eskom SSEG portals. Ready for automated bi-directional feed-in tariffs, net metering credit schemes, and zero municipal registration friction.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>NRS 097-2-1:2017 & SANS 10142-1-2 Listed</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TECHNICAL SPECIFICATIONS & DOCUMENTATION MATRIX */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="bg-[#0D1117] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Tab Headers */}
          <div className="flex items-center overflow-x-auto border-b border-white/10 bg-[#080B10] px-4 py-3 font-mono text-xs no-scrollbar gap-2">
            <button
              onClick={() => setActiveTab('electrical')}
              className={`px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'electrical'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Electrical Parameters</span>
            </button>

            <button
              onClick={() => setActiveTab('mechanical')}
              className={`px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'mechanical'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mechanical Data</span>
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'warranty'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Warranty & Standards</span>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'compatibility'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>System Compatibility</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-[#00D2FF] text-black font-bold shadow-md'
                  : 'text-[#00D2FF] hover:text-white hover:bg-[#00D2FF]/10'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Engineering Documents (PDF)</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            
            {/* TAB 1: ELECTRICAL SPECS */}
            {activeTab === 'electrical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                      <span className="text-[#64748B] text-[10px] uppercase font-semibold block">{spec.label}</span>
                      <span className="text-white font-bold text-sm block">{spec.value}</span>
                    </div>
                  ))}
                  {product.dimensions && (
                    <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                      <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Dimensions</span>
                      <span className="text-white font-bold text-sm block">{product.dimensions}</span>
                    </div>
                  )}
                  {product.cellCount && (
                    <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                      <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Cell Count</span>
                      <span className="text-white font-bold text-sm block">{product.cellCount} Cells (Monocrystalline)</span>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                    <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Operating Temp Range</span>
                    <span className="text-white font-bold text-sm block">-40°C to +85°C</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                    <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Maximum System Voltage</span>
                    <span className="text-white font-bold text-sm block">1,500 V DC</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 hover:border-white/15 transition-colors space-y-1">
                    <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Max Series Fuse Rating</span>
                    <span className="text-white font-bold text-sm block">25 A / 30 A</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MECHANICAL DATA */}
            {activeTab === 'mechanical' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Module Physical Dimensions</span>
                    <span className="text-white text-sm block font-bold">{product.dimensions || '2278 x 1134 x 35 mm'}</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Anodized aluminium alloy frame with pre-drilled grounding holes, drainage channels, and mounting slots compatible with all standard rail profiles.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Front / Rear Glass Encapsulation</span>
                    <span className="text-white text-sm block font-bold">2.0mm + 2.0mm Semi-Tempered Glass</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      High transmission anti-reflective coated glass engineered for severe hail and Highveld thermal fluctuation.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Junction Box & Connectors</span>
                    <span className="text-white text-sm block font-bold">IP68 Rated with 3 Bypass Diodes</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Genuine Stäubli MC4 / JK03M compatible connectors with 1200mm UV-resistant solar cables (4mm² / 6mm² cross-section).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Mechanical Load Capacity</span>
                    <span className="text-white text-sm block font-bold">5,400 Pa Front / 2,400 Pa Rear</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Tested against 140 km/h wind loads and heavy mechanical loading according to SANS 10160 structural guidelines.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: WARRANTY & STANDARDS */}
            {activeTab === 'warranty' && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-[#05070A] border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <span>{product.warrantyYears}-Year Manufacturer Direct Replacement Warranty</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Backed by direct supplier warranty through Segen Solar South Africa. Includes a 15-year materials and workmanship warranty plus 30-year linear power output warranty guaranteeing at least 87.4% output at Year 30. Local RMA fulfillment handled directly out of Sandton.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 font-mono text-[11px]">
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">IEC 61215</span>
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">IEC 61730</span>
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">ISO 9001 / 14001</span>
                    <span className="px-3 py-1.5 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] font-semibold">SANS 10142-1-2 CoC</span>
                    <span className="px-3 py-1.5 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] font-semibold">NRS 097-2-1 SSEG</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMPATIBILITY */}
            {activeTab === 'compatibility' && (
              <div className="space-y-4">
                <p className="text-xs text-[#94A3B8]">
                  Verified hardware pairings bench-tested and approved at our Sandton technical center:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {product.compatibility.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#05070A] border border-white/5 flex items-center gap-3 text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                    <span>CAN-Bus / RS485 Protocol Autodetect</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#05070A] border border-white/5 flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0" />
                    <span>Tesla Gateway &amp; Smart Meter Interoperability</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: OFFICIAL ENGINEERING DOWNLOADS */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  
                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 hover:border-[#00D2FF]/30 transition-all flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#00D2FF]">Technical Datasheet</span>
                        <span className="text-[10px] text-[#64748B]">PDF • 2.4 MB</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        Official {product.name} Engineering Datasheet
                      </h4>
                      <p className="text-xs text-[#94A3B8] font-sans">
                        Full V-I curves, temperature coefficients, dimension diagrams, and electrical characteristics across irradiance levels.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc('Official Engineering Datasheet')}
                      className="py-2.5 px-4 bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Datasheet</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 hover:border-[#00D2FF]/30 transition-all flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#00D2FF]">Grid Certificate</span>
                        <span className="text-[10px] text-[#64748B]">PDF • 1.1 MB</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        NRS 097-2-1 Municipal Compliance Certificate
                      </h4>
                      <p className="text-xs text-[#94A3B8] font-sans">
                        Official accredited lab test certificate required by City of Cape Town and City Power for SSEG registration.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc('NRS 097-2-1 Certificate')}
                      className="py-2.5 px-4 bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download NRS Certificate</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 hover:border-[#00D2FF]/30 transition-all flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#00D2FF]">Electrical Standard</span>
                        <span className="text-[10px] text-[#64748B]">PDF • 3.8 MB</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        SANS 10142-1-2 CoC Installation Manual
                      </h4>
                      <p className="text-xs text-[#94A3B8] font-sans">
                        Wiring schematics, DC surge protection specifications, and Certificate of Compliance signing criteria for master electricians.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc('SANS 10142 Installation Manual')}
                      className="py-2.5 px-4 bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Wiring Manual</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 hover:border-[#00D2FF]/30 transition-all flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#00D2FF]">Commissioning</span>
                        <span className="text-[10px] text-[#64748B]">PDF • 1.9 MB</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        Commissioning &amp; Cloud Telemetry Guide
                      </h4>
                      <p className="text-xs text-[#94A3B8] font-sans">
                        Step-by-step Wi-Fi/LAN gateway setup, cloud monitoring portal onboarding, and battery DIP-switch communication maps.
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc('Commissioning & Telemetry Guide')}
                      className="py-2.5 px-4 bg-white/5 hover:bg-white text-white hover:text-black font-bold uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Guide</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HARDWARE ECOSYSTEM PAIRINGS (COMPLETE THE SYSTEM) */}
      {/* ========================================================================= */}
      {ecosystemPairings.length > 0 && (
        <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#00D2FF] uppercase font-bold block">
                Synchronous Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Recommended Hardware Ecosystem Pairings
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Components bench-tested to work seamlessly together with native communication protocols.
              </p>
            </div>

            <button
              onClick={openConfigurator}
              className="text-xs font-mono text-[#00D2FF] hover:underline flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Design Complete System in 3D Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecosystemPairings.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="p-5 rounded-3xl bg-gradient-to-b from-[#0F141C] to-[#070A0E] border border-white/10 hover:border-white/25 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 uppercase">
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#64748B] block">SKU: {item.sku}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#00D2FF] transition-colors mt-0.5 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] block uppercase">Excl. VAT</span>
                    <span className="text-base font-bold text-white">
                      R {item.priceZAR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="py-2 px-3 rounded-xl bg-white/5 group-hover:bg-white text-white group-hover:text-black font-bold uppercase transition-all flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto border-t border-white/10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#00D2FF] uppercase font-bold">
            Customer Inquiries &amp; Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Key insights on South African grid compatibility, warranties, and certified installation.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Is this hardware compliant with City of Cape Town and Eskom SSEG regulations?",
              a: "Yes. This hardware holds official NRS 097-2-1 certification and is registered on municipal approved equipment schedules for City of Cape Town, City Power (Johannesburg), and eThekwini. It complies fully with anti-islanding disconnect requirements for legal bi-directional solar feed-in."
            },
            {
              q: "What happens during Stage 6 loadshedding or unexpected substation collapse?",
              a: "When the municipal utility drops, the internal solid-state transfer switch isolates your backup circuits in under 4 milliseconds. Essential and high-priority circuits (lights, refrigeration, Wi-Fi, workstation computers, and security systems) remain powered without glitching or rebooting."
            },
            {
              q: "What does the DoL Master Electrician Installation option include?",
              a: "Our certified Department of Employment and Labour (DoL) master electricians handle structural mounting, DC cabling with Type-2 surge protection devices (SPD), AC tie-in to your main distribution board, earthing spike installation, and issue an authentic SANS 10142-1-2 Certificate of Compliance (CoC)."
            },
            {
              q: "What are the dispatch and shipping timelines across South Africa?",
              a: "Orders placed before 14:00 are dispatched same-day from our Sandton (Gauteng) or Brackenfell (Western Cape) fulfillment centers. Regional transit takes 24 to 48 hours via specialized logistics with tail-lift trucks for secure delivery."
            },
            {
              q: "Can I expand this system with additional batteries or solar panels in the future?",
              a: "Yes. All modular inverters and high-density battery racks feature plug-and-play CAN-bus / RS485 communication protocols allowing up to 16 units in parallel without needing manual firmware flashing or proprietary gateway replacements."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0F141C] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#00D2FF] shrink-0 transition-transform duration-200 ${
                    expandedFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MORE PRODUCTS IN THIS TIER (CONTINUOUS EXPLORATION GRID) */}
      {/* ========================================================================= */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00D2FF] font-bold block">
                Continuous Exploration
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                More in {product.category.replace('-', ' ').toUpperCase()}
              </h3>
            </div>

            <button
              onClick={onBackToShop}
              className="text-xs font-mono text-[#00D2FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Range ({categoryProducts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map(relProduct => (
              <div 
                key={relProduct.id} 
                onClick={() => onSelectProduct(relProduct)}
                className="cursor-pointer group"
              >
                <ProductCard
                  product={relProduct}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. STICKY BOTTOM PURCHASE RIBBON (SLIDES IN ON SCROLL PAST HERO) */}
      {/* ========================================================================= */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#070A0E]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] py-3 px-4 sm:px-8 transition-all duration-300 transform ${
          showStickyPurchase ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Thumbnail & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={getAngleImage('perspective')} 
              alt={product.name} 
              className="w-11 h-11 rounded-xl object-contain bg-white/[0.03] border border-white/10 p-1 shrink-0 hidden sm:block" 
            />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                {product.name}
              </h4>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#00D2FF] truncate block">
                {currentVariant.label} • SKU: {product.sku}
              </span>
            </div>
          </div>

          {/* Pricing & CTA Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Calculated Price */}
            <div className="text-right hidden md:block font-mono">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">
                Total (Excl. VAT)
              </span>
              <span className="text-base sm:text-lg font-bold text-white">
                R {totalPriceExclVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center bg-white/[0.04] border border-white/15 rounded-xl p-1 font-mono text-xs hidden sm:flex">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            {/* Configurator Launcher */}
            <button
              onClick={openConfigurator}
              className="py-2.5 px-4 bg-[#0D1117] hover:bg-[#161B22] border border-white/15 hover:border-[#00D2FF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hidden lg:flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Design PV System</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. FLOATING DOWNLOAD TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      {downloadToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#070A0E]/95 border border-[#00D2FF]/40 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 font-mono text-xs animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

    </div>
  );
};
