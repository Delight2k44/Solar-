import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { 
  MessageSquare, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Battery, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  X,
  RotateCcw,
  ShoppingCart,
  Check
} from 'lucide-react';

interface TeslaSolarDesignPageProps {
  setCurrentRoute: (route: string) => void;
  openConfigurator?: () => void;
}

type ProductOption = 'solar-battery' | 'battery-only';
type BillInputMode = 'zar' | 'kwh';

interface SystemSizeOption {
  id: string;
  name: string;
  kwp: number;
  panelCount: number;
  batteryKwh: number;
  inverterKw: number;
  annualGenerationKwh: number;
  priceZAR: number;
  monthlyFinanceZAR: number;
  badge?: string;
}

export const TeslaSolarDesignPage: React.FC<TeslaSolarDesignPageProps> = ({
  setCurrentRoute
}) => {
  const { addLeadQuote, products } = useData();
  const { addToCart, setIsCartOpen } = useCart();

  // State: Product selection (Card 1: Solar Panels + Powerwall 3 / LiFePO4 Storage | Card 2: Powerwall 3 / Battery Storage Only)
  const [selectedProduct, setSelectedProduct] = useState<ProductOption>('solar-battery');

  // State: Home Details
  const [homeAddress, setHomeAddress] = useState('42 Sandton Drive, Sandton, Johannesburg');
  const [billInputMode, setBillInputMode] = useState<BillInputMode>('zar');
  const [monthlyBillZAR, setMonthlyBillZAR] = useState<number>(3800);
  const [monthlyKwh, setMonthlyKwh] = useState<number>(1120);

  // State: Recommendation workflow
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [selectedSizeTier, setSelectedSizeTier] = useState<string>('medium');

  // State: Lead / Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [quoteReference, setQuoteReference] = useState('');

  // State: FAQs drawer
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Quick address chips
  const sampleAddresses = [
    'Sandton Drive, JHB',
    'Camps Bay, Cape Town',
    'Umhlanga Ridge, DBN',
    'Waterkloof, Pretoria'
  ];

  // Sync bill ZAR and kWh
  // Average South African municipal tariff ~ R3.40 / kWh
  const TARIFF_PER_KWH = 3.40;

  const handleBillZarChange = (val: number) => {
    const safeVal = Math.max(0, val);
    setMonthlyBillZAR(safeVal);
    setMonthlyKwh(Math.round(safeVal / TARIFF_PER_KWH));
  };

  const handleKwhChange = (val: number) => {
    const safeVal = Math.max(0, val);
    setMonthlyKwh(safeVal);
    setMonthlyBillZAR(Math.round(safeVal * TARIFF_PER_KWH));
  };

  // Dynamic system configurations based on selected product option and bill
  const systemOptions: SystemSizeOption[] = useMemo(() => {
    if (selectedProduct === 'battery-only') {
      return [
        {
          id: 'small',
          name: 'Essential Backup',
          kwp: 0,
          panelCount: 0,
          batteryKwh: 5.12,
          inverterKw: 5,
          annualGenerationKwh: 0,
          priceZAR: 49500,
          monthlyFinanceZAR: 980,
          badge: 'Lights & WiFi'
        },
        {
          id: 'medium',
          name: 'Home Powerwall (10.24 kWh)',
          kwp: 0,
          panelCount: 0,
          batteryKwh: 10.24,
          inverterKw: 8,
          annualGenerationKwh: 0,
          priceZAR: 89900,
          monthlyFinanceZAR: 1780,
          badge: 'Recommended'
        },
        {
          id: 'large',
          name: 'Whole-Home Powerwall (15.36 kWh)',
          kwp: 0,
          panelCount: 0,
          batteryKwh: 15.36,
          inverterKw: 12,
          annualGenerationKwh: 0,
          priceZAR: 128500,
          monthlyFinanceZAR: 2490,
          badge: 'Whole Home 24h'
        }
      ];
    }

    // Solar + Battery Storage
    return [
      {
        id: 'small',
        name: 'Small (4.4 kW)',
        kwp: 4.4,
        panelCount: 8,
        batteryKwh: 5.12,
        inverterKw: 5,
        annualGenerationKwh: 7100,
        priceZAR: 89000,
        monthlyFinanceZAR: 1690,
        badge: 'Compact Home'
      },
      {
        id: 'medium',
        name: 'Medium (8.8 kW)',
        kwp: 8.8,
        panelCount: 16,
        batteryKwh: 10.24,
        inverterKw: 8,
        annualGenerationKwh: 14200,
        priceZAR: 138900,
        monthlyFinanceZAR: 2420,
        badge: 'Recommended'
      },
      {
        id: 'large',
        name: 'Large (13.2 kW)',
        kwp: 13.2,
        panelCount: 24,
        batteryKwh: 15.36,
        inverterKw: 12,
        annualGenerationKwh: 21300,
        priceZAR: 198000,
        monthlyFinanceZAR: 3450,
        badge: 'High Consumption'
      },
      {
        id: 'xlarge',
        name: 'Extra Large (17.6 kW)',
        kwp: 17.6,
        panelCount: 32,
        batteryKwh: 20.48,
        inverterKw: 16,
        annualGenerationKwh: 28400,
        priceZAR: 259000,
        monthlyFinanceZAR: 4490,
        badge: 'Estate / Business'
      }
    ];
  }, [selectedProduct]);

  // Current active tier
  const activeSystem = useMemo(() => {
    return systemOptions.find(opt => opt.id === selectedSizeTier) || systemOptions[1] || systemOptions[0];
  }, [systemOptions, selectedSizeTier]);

  // Financial calculations
  const estimatedNewBillZAR = useMemo(() => {
    if (selectedProduct === 'battery-only') {
      return Math.round(monthlyBillZAR * 0.75);
    }
    return Math.max(280, Math.round(monthlyBillZAR * 0.10));
  }, [monthlyBillZAR, selectedProduct]);

  const monthlySavingsZAR = Math.max(0, monthlyBillZAR - estimatedNewBillZAR);
  const twentyFiveYearSavingsZAR = Math.round(monthlySavingsZAR * 12 * 25 * 0.85);

  // Energy offset %
  const energyOffsetPercent = useMemo(() => {
    if (selectedProduct === 'battery-only') return 100;
    const monthlyGen = activeSystem.annualGenerationKwh / 12;
    if (monthlyKwh <= 0) return 100;
    return Math.min(160, Math.round((monthlyGen / monthlyKwh) * 100));
  }, [activeSystem, monthlyKwh, selectedProduct]);

  // Handle "See System Recommendation"
  const handleSeeRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  // Add system to cart
  const handleAddToCart = () => {
    const kitProduct = products.find(p => p.id === 'complete-kit-executive-8kw') || products[0];
    if (kitProduct) {
      addToCart({
        ...kitProduct,
        name: `Kinetix ${activeSystem.name} (${activeSystem.kwp}kW Solar + ${activeSystem.batteryKwh}kWh Storage)`,
        priceZAR: activeSystem.priceZAR
      }, 1, true);
      setIsCartOpen(true);
    }
  };

  // Submit Lead / Assessment Booking
  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);

    setTimeout(() => {
      const refId = `KX-TSL-${Math.floor(100000 + Math.random() * 900000)}`;
      setQuoteReference(refId);

      addLeadQuote({
        fullName: contactName || 'Prospective Homeowner',
        email: contactEmail || 'client@kinetixes.com',
        phone: contactPhone || '078 780 8569',
        suburb: homeAddress,
        province: 'Gauteng / National',
        propertyType: 'residential',
        monthlyBillZAR: monthlyBillZAR,
        recommendedInverterKw: activeSystem.inverterKw,
        recommendedBatteryKwh: activeSystem.batteryKwh,
        recommendedSolarKwp: activeSystem.kwp
      });

      setIsSubmittingBooking(false);
      setBookingSuccess(true);
    }, 1000);
  };

  const faqsList = [
    {
      q: 'How does the solar and battery system work during loadshedding?',
      a: 'The system features sub-4ms UPS automatic switchover. When the Eskom or municipal grid drops, your power continues running instantly without flickering lights or rebooting computers.'
    },
    {
      q: 'Do I own the system or is it a lease?',
      a: 'You own the system 100%. You can pay via cash/Instant EFT, or choose flexible 60-month asset finance with full ownership from day one.'
    },
    {
      q: 'What warranties are included?',
      a: 'Solar panels feature a 25-year linear performance warranty. Battery storage cells are covered by a 10-year manufacturer warranty (6,000+ cycles at 90% DoD). Inverters carry a 5 to 10-year comprehensive warranty.'
    },
    {
      q: 'Are installations compliant with South African regulations?',
      a: 'Yes. Every project is installed by a certified Installation Electrician (IE) and includes an official SANS 10142-1-2 Certificate of Compliance (CoC) and municipal SSEG registration.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#3E6AE1] selection:text-white">
      
      {/* Studio Container: 2-Column Responsive Layout matching Tesla.com */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: LARGE ARCHITECTURAL STUDIO HERO IMAGE        */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
            
            {/* Rounded High-Res Hero Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-neutral-200 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] w-full group">
              <img
                src="/tesla-solar-home.jpg"
                alt="Modern luxury home with sleek integrated black solar panels, wall-mounted battery storage, and electric car on driveway"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-102"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                }}
              />

              {/* Dynamic Status / Telemetry Badge Over Image */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider uppercase font-semibold flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>KINETIX ENERGY // SANS 10142 CERTIFIED</span>
                </div>

                {hasCalculated && (
                  <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg animate-in fade-in">
                    <Zap className="w-3.5 h-3.5 text-[#3E6AE1]" />
                    <span>{activeSystem.kwp > 0 ? `${activeSystem.kwp} kW Solar` : 'Storage Only'} + {activeSystem.batteryKwh} kWh LiFePO4</span>
                  </div>
                )}
              </div>

              {/* Subtle bottom shadow vignette */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Bottom-left Action Buttons (Exact Tesla Layout: Chat icon + FAQs pill) */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Chat Button */}
              <button
                type="button"
                onClick={() => {
                  const chatTrigger = document.querySelector('[aria-label="Open Solar Engineering Chat"]') as HTMLButtonElement;
                  if (chatTrigger) chatTrigger.click();
                }}
                className="w-11 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                title="Open Live Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* FAQs Button */}
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer hover:scale-102 active:scale-98 flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-neutral-500" />
                <span>FAQs</span>
              </button>

              {/* Quick Return to Catalog */}
              <button
                type="button"
                onClick={() => setCurrentRoute('shop')}
                className="px-4 py-2.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors ml-auto hidden sm:inline-block cursor-pointer"
              >
                Browse All Hardware →
              </button>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: TESLA ENERGY CONFIGURATION CONSOLE          */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* 1. TOP SEGMENT SELECTION CARDS (Tesla Style) */}
            <div className="space-y-3">
              
              {/* Card 1: Solar Panels + Powerwall 3 */}
              <button
                type="button"
                onClick={() => setSelectedProduct('solar-battery')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedProduct === 'solar-battery'
                    ? 'border-neutral-900 bg-neutral-50/70 shadow-md ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      Solar Panels + Powerwall 3
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-snug">
                      Sleek, low-profile solar panels for your roof with intelligent battery storage
                    </p>
                  </div>
                  {selectedProduct === 'solar-battery' && (
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 ml-2 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>

              {/* Card 2: Powerwall 3 / Battery Storage Only */}
              <button
                type="button"
                onClick={() => setSelectedProduct('battery-only')}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedProduct === 'battery-only'
                    ? 'border-neutral-900 bg-neutral-50/70 shadow-md ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      Powerwall 3
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-snug">
                      Intelligent home battery for loadshedding backup and whole-home outage protection
                    </p>
                  </div>
                  {selectedProduct === 'battery-only' && (
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 ml-2 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>

            </div>

            {/* 2. SECTION: HOME DETAILS (Tesla Style) */}
            <div className="pt-2 space-y-5">
              
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Home Details
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed flex items-center gap-1">
                  <span>Enter your home address and average electricity bill to get a quote for solar panels and view your savings</span>
                  <span 
                    className="cursor-pointer text-neutral-400 hover:text-neutral-700" 
                    title="Calculations are based on typical South African municipal tariffs (R3.40/kWh) and regional irradiance."
                  >
                    <Info className="w-3.5 h-3.5 inline" />
                  </span>
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSeeRecommendation} className="space-y-4">
                
                {/* Field 1: Home Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Home Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="e.g. 42 Sandton Drive, Johannesburg"
                      className="w-full px-4 py-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 text-xs sm:text-sm text-neutral-900 focus:outline-none transition-all"
                    />
                    <MapPin className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sample address chips for fast testing */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">Popular:</span>
                    {sampleAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHomeAddress(addr)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200 transition-colors cursor-pointer"
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field 2: Average Electric Bill with Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Average Electric Bill
                    </label>
                    <button
                      type="button"
                      onClick={() => setBillInputMode(billInputMode === 'zar' ? 'kwh' : 'zar')}
                      className="text-xs text-[#3E6AE1] hover:underline font-medium cursor-pointer"
                    >
                      {billInputMode === 'zar' ? 'Enter your kWh' : 'Enter in Rands (ZAR)'}
                    </button>
                  </div>

                  {/* Bill input container */}
                  {billInputMode === 'zar' ? (
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-neutral-500 font-semibold text-sm pointer-events-none">
                        R
                      </span>
                      <input
                        type="number"
                        min="500"
                        max="100000"
                        step="100"
                        value={monthlyBillZAR}
                        onChange={(e) => handleBillZarChange(Number(e.target.value))}
                        className="w-full pl-8 pr-16 py-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 text-sm font-semibold text-neutral-900 focus:outline-none transition-all"
                      />
                      <span className="absolute right-4 text-neutral-400 text-xs font-mono pointer-events-none">
                        /mo
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="100"
                        max="30000"
                        step="50"
                        value={monthlyKwh}
                        onChange={(e) => handleKwhChange(Number(e.target.value))}
                        className="w-full px-4 pr-20 py-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 text-sm font-semibold text-neutral-900 focus:outline-none transition-all"
                      />
                      <span className="absolute right-4 text-neutral-400 text-xs font-mono pointer-events-none">
                        kWh / mo
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5 font-mono">
                    <span>Est. Monthly Usage: {monthlyKwh} kWh</span>
                    <span>Tariff: ~R{TARIFF_PER_KWH.toFixed(2)}/kWh</span>
                  </div>
                </div>

                {/* Primary CTA Button: Tesla Soft Blue Action Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#3E6AE1] hover:bg-[#345ac2] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>See System Recommendation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            </div>

            {/* ========================================================= */}
            {/* 3. DYNAMIC SYSTEM RECOMMENDATION DRAWER / ACCORDION       */}
            {/* ========================================================= */}
            {hasCalculated && (
              <div className="pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 border-t border-neutral-200">
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6AE1] font-bold">
                      Recommended System Size
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full">
                      {energyOffsetPercent}% Energy Offset
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900">
                    {activeSystem.name}
                  </h3>
                </div>

                {/* System Size Options Grid (Small, Medium, Large, XL) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {systemOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedSizeTier(opt.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedSizeTier === opt.id
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <span className="text-[11px] font-bold block truncate">
                        {opt.kwp > 0 ? `${opt.kwp} kW` : `${opt.batteryKwh} kWh`}
                      </span>
                      <span className={`text-[9px] font-mono uppercase block mt-0.5 truncate ${
                        selectedSizeTier === opt.id ? 'text-neutral-300' : 'text-neutral-500'
                      }`}>
                        {opt.badge || opt.id}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Key Spec Highlights (Tesla Format) */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Estimated Production
                      </span>
                      <span className="text-base sm:text-lg font-bold text-neutral-900 font-mono">
                        {activeSystem.annualGenerationKwh > 0 ? `${activeSystem.annualGenerationKwh.toLocaleString()} kWh / yr` : 'Standby Storage'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Battery Storage
                      </span>
                      <span className="text-base sm:text-lg font-bold text-neutral-900 font-mono">
                        {activeSystem.batteryKwh} kWh LiFePO4
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        New Monthly Bill
                      </span>
                      <span className="text-base sm:text-lg font-bold text-emerald-600 font-mono">
                        ~R {estimatedNewBillZAR.toLocaleString()} /mo
                      </span>
                      <span className="text-[10px] text-neutral-400 line-through block font-mono">
                        was R {monthlyBillZAR.toLocaleString()} /mo
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Est. 25-Yr Savings
                      </span>
                      <span className="text-base sm:text-lg font-bold text-emerald-600 font-mono">
                        R {twentyFiveYearSavingsZAR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Outage Protection Feature */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center gap-2 text-xs text-neutral-700">
                    <ShieldCheck className="w-4 h-4 text-[#3E6AE1] shrink-0" />
                    <span><strong>Outage Protection:</strong> Seamless &lt; 4ms switchover during Stage 6 loadshedding.</span>
                  </div>
                </div>

                {/* Purchase / Financing Options */}
                <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                        Turnkey Installed Price
                      </span>
                      <span className="text-2xl font-black font-mono text-white">
                        R {activeSystem.priceZAR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono block">
                        Incl. 15% VAT, SABS Hardware & CoC
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#00D2FF] font-bold block">
                        Or Finance From
                      </span>
                      <span className="text-lg font-bold font-mono text-white">
                        R {activeSystem.monthlyFinanceZAR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono block">
                        /mo (60 Months)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#3E6AE1]" />
                      <span>Order System & Book Site Survey</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-700"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add Equipment to Cart</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ORDER SYSTEM & SITE SURVEY BOOKING                 */}
      {/* ========================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 border border-neutral-200">
            
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleCompleteBooking} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6AE1] font-bold">
                    Official Sizing Reservation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                    Reserve Your Solar System
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Lock in 14-day wholesale trade pricing and schedule a certified Department of Labour electrician site inspection for <strong>{homeAddress}</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Selected System:</span>
                    <strong className="text-neutral-900">{activeSystem.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Storage Capacity:</span>
                    <strong className="text-neutral-900">{activeSystem.batteryKwh} kWh LiFePO4</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Installed Price:</span>
                    <strong className="text-emerald-600">R {activeSystem.priceZAR.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-neutral-900 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. johnathan@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-neutral-900 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 078 780 8569"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-neutral-900 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-4 bg-[#3E6AE1] hover:bg-[#345ac2] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmittingBooking ? (
                    <span>Allocating Warehouse Buffer...</span>
                  ) : (
                    <>
                      <span>Confirm Reservation & Dispatch Site Survey</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-neutral-900">
                    System Reserved!
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                    Your prospective specification has been secured under reference <strong className="text-[#3E6AE1] font-mono">{quoteReference}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-600 text-left space-y-1">
                  <p>• 14-Day Price Lock activated for warehouse buffer.</p>
                  <p>• SegenSolar dispatch consultant assigned.</p>
                  <p>• Our engineering team will contact you via WhatsApp to coordinate your physical site survey.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="px-8 py-3 bg-neutral-900 text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ========================================================= */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 border border-neutral-200">
            
            <button
              onClick={() => setIsFaqModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6AE1] font-bold block">
                Solar & Powerwall Intelligence
              </span>
              <h3 className="text-2xl font-black text-neutral-900">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-neutral-600">
                Everything you need to know about system design, loadshedding backup, and installation.
              </p>
            </div>

            <div className="space-y-3">
              {faqsList.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-neutral-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-neutral-900 hover:bg-neutral-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${activeFaqIndex === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-500">Need direct engineering assistance?</span>
              <a 
                href="https://wa.me/27787808569" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-[#25D366] hover:underline"
              >
                Chat on WhatsApp (078 780 8569) →
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
