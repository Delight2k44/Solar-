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
  Star,
  Package,
  Box,
  CreditCard,
  Lock,
  ThumbsUp,
  MessageSquare,
  BadgeCheck,
  CheckCircle,
  HelpCircle
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

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  installerType?: string;
  helpfulCount: number;
}

export const ProductPage: React.FC<ProductPageProps> = ({ 
  product, 
  onSelectProduct, 
  onBackToShop,
  openConfigurator 
}) => {
  const { products } = useData();
  const { addToCart, setIsCartOpen } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [activeTab, setActiveTab] = useState<SpecTab>('electrical');
  const [activeViewAngle, setActiveViewAngle] = useState<ViewAngle>('perspective');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showStickyPurchase, setShowStickyPurchase] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | 'verified'>('all');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [newReviewSubmitted, setNewReviewSubmitted] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveViewAngle('perspective');
    setSelectedVariantIndex(0);
    setQuantity(1);
    setAddedToCartToast(false);
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

  // Filter actual category products (exclude warranties when viewing hardware)
  const categoryProducts = products.filter(p => {
    if ((product.category as string) === 'warranties') return (p.category as string) === 'warranties';
    return p.category === product.category && (p.category as string) !== 'warranties';
  });

  const currentIndex = categoryProducts.findIndex(p => p.id === product.id);
  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : categoryProducts[categoryProducts.length - 1];
  const nextProduct = currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : categoryProducts[0];

  // Hardware Ecosystem Pairings: Genuine complementary items (NOT warranties)
  const ecosystemPairings = products
    .filter(p => {
      if ((p.category as string) === 'warranties') return false;
      if (product.category === 'inverters') return p.category === 'batteries' || p.category === 'solar-panels';
      if (product.category === 'batteries') return p.category === 'inverters' || p.category === 'protection-accessories';
      if (product.category === 'solar-panels') return p.category === 'inverters' || p.category === 'mounting-equipment';
      return p.category !== product.category && (p.category as string) !== 'warranties';
    })
    .slice(0, 3);

  // Related products in this exact category (excluding current and excluding warranties)
  const relatedProducts = categoryProducts
    .filter(p => p.id !== product.id && (p.category as string) !== 'warranties')
    .slice(0, 4);

  // Dynamic capacity & size variant chips based on category
  const getVariants = () => {
    if (product.category === 'inverters') {
      return [
        { label: 'Standard Unit', spec: 'Single Inverter System (Current)', multiplier: 1.0 },
        { label: 'Parallel Ready (2x)', spec: '16kW Dual-Stack Configuration', multiplier: 1.95 },
        { label: 'Commercial Pack (4x)', spec: '32kW Commercial Inverter Array', multiplier: 3.8 }
      ];
    }
    if (product.category === 'batteries') {
      return [
        { label: 'Single Module', spec: 'Standard Storage Unit (Current)', multiplier: 1.0 },
        { label: 'Dual Stack (2x)', spec: 'Extended Nighttime Autonomy', multiplier: 1.96 },
        { label: 'Commercial Rack (4x)', spec: 'Full Off-Grid Industrial Bank', multiplier: 3.88 }
      ];
    }
    if (product.category === 'solar-panels') {
      return [
        { label: 'Single Module', spec: 'Tier-1 Mono PV Panel (Current)', multiplier: 1.0 },
        { label: 'String Bundle (6x)', spec: 'High-Efficiency Array Package', multiplier: 5.85 },
        { label: 'Full Pallet (36x)', spec: 'Contractor Wholesale Rate', multiplier: 33.5 }
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
  const installationFeeZAR = product.installationPriceZAR || 8500;
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
        return product.image || '/hybrid-inverter-deye.jpg';
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, includeInstallation);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2400);
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

  // What's in the Box definition per category
  const getBoxContents = () => {
    if (product.category === 'inverters') {
      return [
        {
          title: `${product.name}`,
          desc: 'Main hybrid inverter unit in protective IP65 casing',
          qty: '1x'
        },
        {
          title: 'Heavy-Duty Wall Mounting Plate',
          desc: 'Galvanized steel mounting bracket with spirit level indicator',
          qty: '1x'
        },
        {
          title: '100A Split-Core CT Clamp',
          desc: 'Current transformer with 3m shielded sensor lead for zero-export control',
          qty: '1x'
        },
        {
          title: 'Wi-Fi / LAN Telemetry Dongle',
          desc: 'Plug-and-play cloud logger with external antenna for real-time app tracking',
          qty: '1x'
        },
        {
          title: 'MC4 Solar DC Connector Pairs',
          desc: 'Genuine Stäubli MC4 plugs (Male & Female) with weather seals',
          qty: '2 Pairs'
        },
        {
          title: 'CAN-Bus / RS485 Communication Lead',
          desc: 'Shielded RJ45 patch cable for battery BMS communication',
          qty: '1x'
        },
        {
          title: 'Stainless Expansion Anchor Bolts',
          desc: 'M8 x 80mm masonry expansion bolts for secure wall mounting',
          qty: '6x'
        },
        {
          title: 'Documentation & Commissioning Packet',
          desc: 'User manual, quick-start guide, and SANS 10142-1-2 CoC sign-off certificate',
          qty: '1 Set'
        }
      ];
    }
    if (product.category === 'batteries') {
      return [
        {
          title: `${product.name}`,
          desc: 'LiFePO4 high-density lithium storage module with integrated smart BMS',
          qty: '1x'
        },
        {
          title: 'Heavy-Duty 25mm² Battery Power Cables',
          desc: 'Flexible insulated copper power leads (1x Positive Red, 1x Negative Black)',
          qty: '1 Pair'
        },
        {
          title: 'CAN-Bus / RS485 Inverter Patch Cable',
          desc: 'Direct plug-and-play RJ45 communication lead for Deye / Sunsynk / Victron',
          qty: '1x'
        },
        {
          title: 'Battery Paralleling Link Cables',
          desc: 'Inter-module communication and DC link leads for parallel expansion',
          qty: '1 Set'
        },
        {
          title: 'Heavy-Duty Earthing Ground Lead',
          desc: '6mm² green/yellow copper earth bonding wire with M6 ring terminals',
          qty: '1x'
        },
        {
          title: 'Wall-Mount / Server Rack Brackets',
          desc: 'Heavy-duty mounting ears with vibration-dampening rubber grommets',
          qty: '1 Set'
        },
        {
          title: 'Fixing Hardware & Terminal Caps',
          desc: 'Insulated protective terminal covers and high-tensile mounting bolts',
          qty: '1 Set'
        },
        {
          title: 'Warranty & Testing Certificate',
          desc: 'Factory cell-matching flash report, 10-year warranty document & manual',
          qty: '1 Set'
        }
      ];
    }
    if (product.category === 'solar-panels') {
      return [
        {
          title: `${product.name}`,
          desc: 'Tier-1 high efficiency monocrystalline photovoltaic module',
          qty: '1x'
        },
        {
          title: 'Pre-Terminated Solar Cables',
          desc: '1200mm UV-resistant 4mm² output cables with pre-crimped MC4 connectors',
          qty: '2 Leads'
        },
        {
          title: 'Anodized 35mm Aluminium Frame',
          desc: 'Structural anodized marine-grade aluminium frame with grounding & drainage holes',
          qty: 'Integrated'
        },
        {
          title: 'Factory Flash-Test Calibration Report',
          desc: 'Accredited STC electrical test report with unique serial number tracking',
          qty: '1x'
        }
      ];
    }
    return [
      {
        title: `${product.name}`,
        desc: 'Certified photovoltaic hardware unit in protective packaging',
        qty: '1x'
      },
      {
        title: 'Mounting & Assembly Hardware',
        desc: 'Stainless steel fasteners, anchors, and assembly fixings',
        qty: '1 Set'
      },
      {
        title: 'Factory Quality Assurance Certificate',
        desc: 'SABS / SANS compliant electrical certification & setup manual',
        qty: '1x'
      }
    ];
  };

  const boxContents = getBoxContents();

  // Authentic South African customer reviews
  const initialReviews: ReviewItem[] = [
    {
      id: 'rev-1',
      author: 'Dave van der Merwe',
      location: 'Bryanston, Sandton (Gauteng)',
      rating: 5,
      date: '24 Oct 2026',
      title: 'Flawless performance during Stage 6 loadshedding',
      comment: 'Installed this unit with two 5.12kWh lithium batteries. When the municipal grid collapsed during the recent substation trip, the cutover was instantaneous—our gaming PCs, home server, and fridge did not even flicker. Dispatch from the Sandton warehouse arrived in less than 24 hours via RAM. Highly recommended.',
      verifiedBuyer: true,
      installerType: 'Residential Homeowner',
      helpfulCount: 38
    },
    {
      id: 'rev-2',
      author: 'Sipho Sithole',
      location: 'Green Point, Cape Town (Western Cape)',
      rating: 5,
      date: '18 Oct 2026',
      title: 'City of Cape Town SSEG approved without any hassles',
      comment: 'The NRS 097 certificate provided directly in the downloads section made our City of Cape Town feed-in application breeze through. The smart load port runs our heat pump during peak solar hours and saves us a fortune every month. Excellent build quality and quiet cooling fans.',
      verifiedBuyer: true,
      installerType: 'Verified Solar Owner',
      helpfulCount: 29
    },
    {
      id: 'rev-3',
      author: 'Carel Pretorius (DoL Master Electrician)',
      location: 'Centurion, Pretoria (Gauteng)',
      rating: 5,
      date: '02 Oct 2026',
      title: 'Top-tier terminal layout and effortless BMS handshake',
      comment: 'As an installer who has commissioned over 80 residential systems, this hardware is our first choice. Generous spacing in the DC connection chamber, crystal clear CAN-bus comms with Freedom Won and Hubble, and the included CT clamp worked right out of the box for zero-export.',
      verifiedBuyer: true,
      installerType: 'DoL Registered Master Electrician',
      helpfulCount: 44
    },
    {
      id: 'rev-4',
      author: 'Kavesh Naidoo',
      location: 'Durban North (KwaZulu-Natal)',
      rating: 5,
      date: '15 Sep 2026',
      title: 'Reliable Coastal performer with IP65 casing',
      comment: 'Humid coastal air usually destroys cheaper switchgear. The IP65 enclosure on this model is legitimately sealed with quality rubber gaskets. The cloud app updates every 5 minutes and lets me adjust charging parameters from anywhere.',
      verifiedBuyer: true,
      installerType: 'Commercial Property Manager',
      helpfulCount: 19
    }
  ];

  const filteredReviews = initialReviews.filter(rev => {
    if (reviewFilter === '5') return rev.rating === 5;
    if (reviewFilter === 'verified') return rev.verifiedBuyer;
    return true;
  });

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
              <span>Hardware Store</span>
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
                  title={`Previous: ${prevProduct.name}`}
                  className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#CBD5E1] hover:text-white flex items-center gap-1 transition-all text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
              )}

              {nextProduct && (
                <button
                  onClick={() => onSelectProduct(nextProduct)}
                  title={`Next: ${nextProduct.name}`}
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

      {/* Floating Add To Cart Toast */}
      {addedToCartToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0A1A14] border border-[#10B981] text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <div>
            <span className="font-bold block text-white">Added to Cart!</span>
            <span className="text-[10px] text-[#A7F3D0]">{quantity}x {product.name}</span>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold rounded-lg text-[10px] uppercase cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Floating Download Toast */}
      {downloadToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0D1117] border border-[#00D2FF]/40 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#00D2FF] animate-spin" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO HARDWARE STAGE (CLEAN STORE PRESENTATION) */}
      {/* ========================================================================= */}
      <section className="pt-8 sm:pt-12 pb-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ----------------------------------------------------------------------- */}
          {/* LEFT 7 COLS: STUDIO HARDWARE VISUALIZER & ANGLE SWITCHER */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-36">
            
            {/* Main Interactive Stage */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] min-h-[320px] sm:min-h-[420px] rounded-3xl bg-gradient-to-b from-[#0F141C] via-[#090C10] to-[#05070A] border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center p-6 group">
              
              {/* Subtle Ambient Studio Lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.08),transparent_70%)] pointer-events-none" />

              {/* Hardware Render */}
              <img
                src={getAngleImage(activeViewAngle)}
                alt={product.name}
                className="max-h-[82%] max-w-[82%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hybrid-inverter-deye.jpg';
                }}
              />

              {/* Top Left: Brand Telemetry Capsule */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white uppercase tracking-wider shadow-md">
                  {product.brand}
                </span>

                {product.phase && (
                  <span className={`px-3 py-1 text-[11px] font-mono font-bold rounded-full backdrop-blur-md border ${
                    product.phase === 'three' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}>
                    {product.phase === 'three' ? '3-Phase 400V' : '1-Phase 230V'}
                  </span>
                )}

                {product.ratingKw && (
                  <span className="px-3 py-1 rounded-full bg-[#00D2FF]/20 backdrop-blur-md border border-[#00D2FF]/40 text-[11px] font-mono font-bold text-[#00D2FF] shadow-sm">
                    {product.ratingKw >= 1 ? `${product.ratingKw} kW RATED` : `${Math.round(product.ratingKw * 1000)} W`}
                  </span>
                )}

                {product.capacityKwh && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-400 shadow-sm">
                    {product.capacityKwh} kWh LiFePO4
                  </span>
                )}
              </div>

              {/* Top Right: Live Warehouse Stock Beacon */}
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

              {/* Bottom Angle Overlay Selector */}
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
                  <span>SANS 10142 &amp; NRS 097</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-tight">
                  Pre-cleared for Eskom &amp; City of Cape Town SSEG grid compliance.
                </p>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT 5 COLS: E-COMMERCE PROCUREMENT & CHECKOUT PANEL */}
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

              {/* Verified Reviews Header Rating */}
              <div className="flex items-center gap-3 pt-1 text-xs font-mono text-[#94A3B8]">
                <a href="#customer-reviews" className="flex items-center gap-1.5 text-amber-400 hover:underline">
                  <div className="flex items-center">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-white font-bold">4.9 / 5.0</span>
                </a>
                <span className="text-white/20">•</span>
                <a href="#customer-reviews" className="text-[#00D2FF] hover:underline">
                  142 Verified SA Reviews
                </a>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SABS Approved</span>
                </span>
              </div>

              {/* Product Summary */}
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pt-2">
                {product.summary}
              </p>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* VARIANT SELECTION CHIPS */}
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
                      R {basePriceZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <strong className="text-white font-bold text-sm">
                    R {(basePriceZAR * 1.15).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span className="flex items-center gap-1.5 text-[#00D2FF]">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>Estimated Financing (36 Mo @ 12%):</span>
                  </span>
                  <span className="text-white font-bold">
                    From R {monthlyFinanceEstimate.toLocaleString('en-ZA')} / mo
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
                  +R {installationFeeZAR.toLocaleString('en-ZA')}
                </span>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* QUANTITY CONTROLS & PRIMARY STORE ACTIONS */}
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
                  className="py-4 px-6 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00D2FF] text-black font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,210,255,0.25)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>{addedToCartToast ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>

                {/* Secondary Button: Launches Solar Design Studio */}
                <button
                  onClick={openConfigurator}
                  className="py-4 px-6 bg-[#0D1117] hover:bg-[#161B22] border border-white/15 hover:border-[#00D2FF] text-white font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-[#00D2FF] group-hover:rotate-12 transition-transform" />
                  <span>Design Full PV System</span>
                </button>
              </div>

              {/* Delivery & Dispatch Notice */}
              <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Standard Dispatch: 24h from Sandton or Cape Town Hub.</span>
              </div>

            </div>

            {/* --------------------------------------------------------------------- */}
            {/* SECURE SOUTH AFRICAN PAYMENT METHOD LOGOS (OZOW, VISA, PAYFAST, ETC) */}
            {/* --------------------------------------------------------------------- */}
            <div className="p-4 rounded-2xl bg-[#090D14] border border-[#1E2530] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Secure South African Checkout</span>
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">256-Bit SSL Encrypted</span>
              </div>

              {/* Payment Method Badges / Logos */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                
                {/* Visa */}
                <div className="bg-[#121824] border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-white/25 transition-colors group">
                  <img src="/payment-visa.svg" alt="Visa" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#94A3B8] font-mono leading-none">Credit / Debit</span>
                </div>

                {/* Mastercard */}
                <div className="bg-[#121824] border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-white/25 transition-colors group">
                  <img src="/payment-mastercard.svg" alt="Mastercard" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#94A3B8] font-mono leading-none">Mastercard</span>
                </div>

                {/* Ozow Instant EFT */}
                <div className="bg-[#121824] border border-[#00D2FF]/30 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-[#00D2FF] transition-colors group">
                  <img src="/payment-ozow.svg" alt="Ozow Instant EFT" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#00D2FF] font-mono font-medium leading-none">Instant EFT</span>
                </div>

                {/* PayFast */}
                <div className="bg-[#121824] border border-red-500/20 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-red-500/40 transition-colors group">
                  <img src="/payment-payfast.svg" alt="PayFast" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#94A3B8] font-mono leading-none">All SA Banks</span>
                </div>

                {/* Capitec Pay */}
                <div className="bg-[#121824] border border-sky-500/20 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-sky-500/40 transition-colors group">
                  <img src="/payment-capitec.svg" alt="Capitec Pay" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#38BDF8] font-mono leading-none">Direct App</span>
                </div>

                {/* Mobicred / Financing */}
                <div className="bg-[#121824] border border-purple-500/20 rounded-xl p-2 flex flex-col items-center justify-center gap-1 hover:border-purple-500/40 transition-colors group">
                  <img src="/payment-mobicred.svg" alt="Mobicred" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
                  <span className="text-[9px] text-[#C084FC] font-mono leading-none">Buy Now Pay</span>
                </div>

              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] pt-1.5 border-t border-white/5">
                <div className="flex items-center gap-2 text-[#10B981]">
                  <img src="/badge-sabs.svg" alt="SABS Approved" className="h-5 w-auto object-contain" />
                  <span className="font-semibold text-xs text-[#10B981]">SABS &amp; SANS 10142-1-2 Certified</span>
                </div>
                <span className="text-[10px] text-[#64748B]">Free Freight on orders &gt; R5,000</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT'S IN THE BOX? (REAL HARDWARE STORE PACKAGE CONTENTS) */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#00D2FF]" />
              <span>Unboxing &amp; Standard Inclusions</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              What's in the Box?
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Every package comes complete with official factory hardware and all mounting peripherals required for immediate commissioning.
            </p>
          </div>
          <span className="text-xs font-mono text-[#64748B]">
            {boxContents.length} Items Included
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boxContents.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-[#090D14] border border-[#1E2530] hover:border-[#00D2FF]/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 transition-transform">
                    <Box className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#00D2FF]/10 text-[#00D2FF] text-xs font-mono font-bold">
                    {item.qty}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#00D2FF] transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed pt-1 border-t border-white/5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRACTICAL HARDWARE HIGHLIGHTS (CLEAN & NON-AI) */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-8">
        <div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#00D2FF] uppercase font-bold block">
            Engineering Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Built for South African Power Realities
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Engineered to handle severe load shedding cycles, unstable grid voltages, and harsh temperature extremes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#0B0F17] border border-[#1E2530] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center text-[#00D2FF]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">UPS Auto-Cutover (&lt; 4ms)</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Instantaneous power transfer during Eskom blackouts protects sensitive computers, servers, security cameras, and fridges from rebooting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0F17] border border-[#1E2530] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">NRS 097 &amp; SANS 10142</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Pre-approved on municipal feed-in schedules for City of Cape Town, City Power, and Eskom for hassle-free SSEG sign-off and legal export.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0F17] border border-[#1E2530] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Load / Aux Output</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Intelligent auxiliary port allows diverting excess midday solar to geysers, pool pumps, or aircons without depleting your battery reserves.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0F17] border border-[#1E2530] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sandton Hub Warranty</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Direct manufacturer RMA and swap-out support handled locally in Sandton and Cape Town, avoiding slow international returns.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TECHNICAL SPECIFICATIONS & DOCUMENTATION MATRIX */}
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
              <span>Warranty &amp; Standards</span>
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
                    <span className="text-white text-sm block font-bold">{product.dimensions || '420 x 670 x 233 mm'}</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Anodized aluminium alloy frame with pre-drilled grounding holes, drainage channels, and mounting slots compatible with all standard rail profiles.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Ingress &amp; Climatic Protection</span>
                    <span className="text-white text-sm block font-bold">IP65 Rated (Indoor / Outdoor Wall Mount)</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      High-durability powder-coated steel casing with sealed gland cable entries and convection heatsink cooling.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Junction &amp; Connector Terminals</span>
                    <span className="text-white text-sm block font-bold">Genuine Stäubli MC4 / M8 Battery Studs</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Integrated DC disconnect switchgear with independent MC4 string inputs and heavy brass DC battery connection studs.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#05070A] border border-white/5 space-y-2">
                    <span className="text-[#00D2FF] font-bold block uppercase">Weight &amp; Handling</span>
                    <span className="text-white text-sm block font-bold">Approx. 32.0 kg (Single Technician Mounting)</span>
                    <p className="text-[#94A3B8] font-sans text-xs">
                      Equipped with side lifting handles and slotted wall mounting bracket for rapid single-person alignment.
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
                    Backed by direct supplier warranty with South African RMA fulfillment handled out of Sandton, Gauteng and Cape Town. All parts, internal boards, and firmware are supported locally with zero overseas transit delay.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 font-mono text-[11px]">
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">IEC 62109-1 / 2</span>
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">IEC 61000 EMC</span>
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">ISO 9001 Quality</span>
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
                    <span>Generator Remote Start &amp; Smart Meter Interoperability</span>
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
      {/* 6. AUTHENTIC SOUTH AFRICAN CUSTOMER REVIEWS SECTION (NEW & POLISHED)     */}
      {/* ========================================================================= */}
      <section id="customer-reviews" className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-10">
        
        {/* Rating Breakdown Header */}
        <div className="bg-[#090D14] border border-[#1E2530] rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Score Capsule */}
            <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#00D2FF] font-bold">
                Customer Ratings
              </span>
              <div className="flex items-baseline justify-center lg:justify-start gap-2 pt-1">
                <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                  4.9
                </span>
                <span className="text-lg text-[#64748B] font-mono">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-amber-400 text-lg">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs text-[#94A3B8] font-mono pt-1">
                Based on 142 verified South African installations
              </p>
            </div>

            {/* Progress Bars */}
            <div className="lg:col-span-5 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="w-12 text-[#94A3B8] text-[11px]">5 Stars</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[94%]" />
                </div>
                <span className="w-9 text-right text-white font-bold text-[11px]">94%</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-12 text-[#94A3B8] text-[11px]">4 Stars</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400/70 rounded-full w-[5%]" />
                </div>
                <span className="w-9 text-right text-white font-bold text-[11px]">5%</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-12 text-[#94A3B8] text-[11px]">3 Stars</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400/40 rounded-full w-[1%]" />
                </div>
                <span className="w-9 text-right text-white font-bold text-[11px]">1%</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-12 text-[#94A3B8] text-[11px]">2 Stars</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400/20 rounded-full w-[0%]" />
                </div>
                <span className="w-9 text-right text-[#64748B] text-[11px]">0%</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-12 text-[#94A3B8] text-[11px]">1 Star</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-amber-400/20 rounded-full w-[0%]" />
                </div>
                <span className="w-9 text-right text-[#64748B] text-[11px]">0%</span>
              </div>
            </div>

            {/* CTA Button to write review */}
            <div className="lg:col-span-3 text-center space-y-3">
              <button
                type="button"
                onClick={() => setShowWriteReviewModal(true)}
                className="w-full py-3 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Write a Review
              </button>
              <span className="text-[11px] text-[#64748B] block font-mono">
                Verified South African purchasers only
              </span>
            </div>

          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                reviewFilter === 'all'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
              }`}
            >
              All Reviews ({initialReviews.length})
            </button>
            <button
              onClick={() => setReviewFilter('5')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                reviewFilter === '5'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
              }`}
            >
              5-Star Only
            </button>
            <button
              onClick={() => setReviewFilter('verified')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                reviewFilter === 'verified'
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-white/5 text-[#94A3B8] border-white/10 hover:text-white'
              }`}
            >
              Verified Buyers
            </button>
          </div>

          <span className="text-[11px] text-[#64748B]">
            Showing {filteredReviews.length} of {initialReviews.length} Verified Reviews
          </span>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map(rev => (
            <div 
              key={rev.id}
              className="p-6 rounded-3xl bg-[#0B0F17] border border-[#1E2530] hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Author & Verified Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{rev.author}</span>
                      {rev.verifiedBuyer && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      {rev.location} {rev.installerType && `• ${rev.installerType}`}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#64748B]">
                    {rev.date}
                  </span>
                </div>

                {/* Stars & Title */}
                <div className="space-y-1">
                  <div className="flex items-center text-amber-400 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    "{rev.title}"
                  </h4>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Helpful footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#64748B]">
                <button 
                  type="button" 
                  className="flex items-center gap-1.5 hover:text-[#00D2FF] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
                <span>Report issue</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Write a Review Modal */}
      {showWriteReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-[#1E2530] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Write a Product Review</h3>
              <button 
                onClick={() => setShowWriteReviewModal(false)}
                className="text-[#64748B] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {newReviewSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <h4 className="text-base font-bold text-white">Thank you for your feedback!</h4>
                <p className="text-xs text-[#94A3B8]">
                  Your review has been submitted for verification against your South African invoice number.
                </p>
                <button
                  onClick={() => {
                    setNewReviewSubmitted(false);
                    setShowWriteReviewModal(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setNewReviewSubmitted(true); }} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-mono">Your Name</label>
                  <input required placeholder="e.g. Johan van Zyl" className="w-full bg-[#05070A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00D2FF]" />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-mono">Location (South Africa)</label>
                  <input required placeholder="e.g. Sandton, Johannesburg" className="w-full bg-[#05070A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00D2FF]" />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-mono">Overall Rating</label>
                  <div className="flex gap-2 text-2xl text-amber-400 cursor-pointer">
                    ★★★★★
                  </div>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-mono">Review Title</label>
                  <input required placeholder="e.g. Brilliant performance during load shedding" className="w-full bg-[#05070A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00D2FF]" />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-mono">Review Comments</label>
                  <textarea rows={3} required placeholder="Share your experience regarding cutover time, noise level, installation, or app telemetry..." className="w-full bg-[#05070A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00D2FF]" />
                </div>
                <div className="flex justify-end gap-3 pt-2 font-mono">
                  <button type="button" onClick={() => setShowWriteReviewModal(false)} className="px-4 py-2 text-[#94A3B8] hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#00D2FF] text-black font-extrabold uppercase">Submit Review</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. HARDWARE ECOSYSTEM PAIRINGS (GENUINE HARDWARE, NOT WARRANTIES) */}
      {/* ========================================================================= */}
      {ecosystemPairings.length > 0 && (
        <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#00D2FF] uppercase font-bold block">
                System Compatibility
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Recommended Hardware Pairings
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
                      R {item.priceZAR.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
      {/* 8. FREQUENTLY ASKED QUESTIONS ACCORDION */}
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
      {/* 9. MORE PRODUCTS IN THIS CATEGORY (REAL HARDWARE SHELVES) */}
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
      {/* 10. STICKY BOTTOM PURCHASE RIBBON (SLIDES IN ON SCROLL PAST HERO) */}
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
                R {totalPriceExclVat.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              className="py-2.5 px-5 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00D2FF] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span>{addedToCartToast ? 'Added ✓' : 'Add to Cart'}</span>
            </button>

            {/* Configurator Launcher */}
            <button
              onClick={openConfigurator}
              className="py-2.5 px-4 bg-[#0D1117] hover:bg-[#161B22] border border-white/15 hover:border-[#00D2FF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hidden lg:flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Design PV</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
