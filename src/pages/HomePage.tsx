import React from 'react';
import { 
  Sun, 
  BatteryCharging, 
  Wrench, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Smartphone,
  Cpu,
  TrendingUp,
  Download
} from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { useData } from '../context/DataContext';
import { Product } from '../types';

interface HomePageProps {
  setCurrentRoute: (route: string) => void;
  openConfigurator: () => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  setCurrentRoute, 
  openConfigurator,
  onSelectProduct
}) => {
  const { products, siteContent } = useData();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="space-y-0 text-white font-sans selection:bg-[#00D2FF] selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. STARLINK-STYLE FULL-BLEED CINEMATIC HERO */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-start overflow-hidden border-b border-[#1E2530]">
        {/* Full-Bleed Edge-to-Edge Architectural Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-solar-home.jpg"
            alt="Modern luxury eco-home with integrated solar rooftop and battery storage under dramatic sky"
            className="w-full h-full object-cover object-[center_30%] sm:object-center lg:object-right"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
            }}
          />
          {/* Subtle Starlink-Style Cinematic Dark Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 lg:hidden" />
          <div className="absolute inset-0 subtle-grid opacity-10 pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-32 sm:py-40 relative z-10 w-full">
          <div className="max-w-2xl space-y-7">
            


            {/* Massive Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Reliable, uninterrupted power.
            </h1>

            {/* Clean Subtitle */}
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl font-normal">
              Turnkey residential and commercial hybrid solar, high-capacity LiFePO4 battery storage, and certified South African installation.
            </p>

            {/* Starlink Starting Price Callout */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] block font-bold">
                Turnkey Systems Starting At
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  R 62,500
                </span>
                <span className="text-sm font-mono text-[#94A3B8]">
                  or <strong className="text-[#00D2FF]">R 2,450</strong> /mo financed
                </span>
              </div>
            </div>

            {/* Starlink Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={openConfigurator}
                className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xl flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentRoute('solar')}
                className="px-8 py-4 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>View Pricing & Kits</span>
              </button>
            </div>

            {/* Quick SANS Pill */}
            <div className="pt-4 border-t border-white/10 text-xs font-mono text-[#94A3B8] flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                SANS 10142-1-2 Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
                &lt; 20ms Instant Grid Switchover
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FULL-BLEED SLIDE: ZERO LOAD-SHEDDING RESILIENCE (Starlink Weather / Reliability style) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[680px] lg:min-h-[780px] flex items-center justify-end overflow-hidden border-b border-[#1E2530]">
        <div className="absolute inset-0 z-0">
          <img
            src="/battery-inverter-room.jpg"
            alt="Dedicated home battery power room with clean inverter installation"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/70 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/30 lg:hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 relative z-10 w-full flex justify-end">
          <div className="max-w-xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Grid Failure Immunity
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineered for extreme reliability.
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              When the municipal grid drops, Kinetix hybrid systems transition in under <strong>20 milliseconds</strong> — faster than a computer or home appliance can register. No flickering lights, no data loss, and zero disruption to refrigeration or home security.
            </p>

            {/* Spec Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Switchover</span>
                <span className="text-xl font-bold text-white">&lt; 20ms</span>
                <span className="text-[9px] text-[#00D2FF] block">Seamless UPS</span>
              </div>

              <div className="p-3.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Battery Lifespan</span>
                <span className="text-xl font-bold text-white">6,000+</span>
                <span className="text-[9px] text-[#00D2FF] block">Cycles (~15 Yrs)</span>
              </div>

              <div className="p-3.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Compliance</span>
                <span className="text-xl font-bold text-white">SANS</span>
                <span className="text-[9px] text-[#00D2FF] block">10142-1-2 CoC</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentRoute('solar')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2"
              >
                <span>Explore Backup Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00D2FF]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STARLINK-STYLE HARDWARE LINEUP (Clean & Direct) */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Tier-1 Hardware Registry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pre-matched, certified components.
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
              Every inverter, lithium battery, and solar panel is rigorously bench-tested in our Gauteng QA lab to ensure flawless interoperability under high thermal load.
            </p>
          </div>

          <button
            onClick={() => setCurrentRoute('shop')}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-colors flex items-center gap-2 shrink-0"
          >
            <span>View Full Store ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00D2FF]" />
          </button>
        </div>

        {/* Featured Hardware Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FULL-BLEED SLIDE: REAL-TIME MOBILE & CLOUD TELEMETRY (Starlink App style) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-start overflow-hidden border-y border-[#1E2530]">
        <div className="absolute inset-0 z-0">
          <img
            src="/homeowner-app-dashboard.jpg"
            alt="Real-time smartphone telemetry and solar power dashboard"
            className="w-full h-full object-cover object-center lg:object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/30 lg:hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 relative z-10 w-full">
          <div className="max-w-xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
              Asset Intelligence
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Manage your energy from anywhere.
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Track live kilowatt production, battery state of charge (SoC), and Eskom grid tariff optimization in real-time. Access official SARS tax invoices, single line diagrams, and SANS CoC certificates directly from your personal asset portal.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 font-mono">
              <button
                onClick={() => setCurrentRoute('portal')}
                className="px-6 py-3.5 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open Asset Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentRoute('tracking')}
                className="px-6 py-3.5 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Track Installation Stage</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 3-STEP TURNKEY INSTALLATION PROCESS */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Streamlined Deployment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            From design to commissioning in 3 steps.
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            No ambiguous quotes or uncertified contractors. Fully transparent pricing, master electrician installation, and lifetime support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Step 1 */}
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-4 relative group hover:border-[#00D2FF]/50 transition-all">
            <span className="text-3xl font-extrabold text-[#00D2FF] block">01</span>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">Digital System Sizing</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Use our interactive configurator to calculate your exact kilowatt capacity, battery storage size, and monthly Eskom tariff savings in 60 seconds.
            </p>
            <button
              onClick={openConfigurator}
              className="text-xs text-[#00D2FF] font-bold flex items-center gap-1 hover:underline pt-2"
            >
              <span>Launch Configurator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-4 relative group hover:border-[#00D2FF]/50 transition-all">
            <span className="text-3xl font-extrabold text-[#00D2FF] block">02</span>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">DoL Certified Installation</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Our accredited Master Electricians install the single line diagram, DC protection fuses, and hybrid inverter according to SANS 10142-1-2 standards.
            </p>
            <button
              onClick={() => setCurrentRoute('installation')}
              className="text-xs text-[#00D2FF] font-bold flex items-center gap-1 hover:underline pt-2"
            >
              <span>Installation Standards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-4 relative group hover:border-[#00D2FF]/50 transition-all">
            <span className="text-3xl font-extrabold text-[#00D2FF] block">03</span>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">SANS CoC & SLA Care</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Receive your official municipal Certificate of Compliance, grid connection sign-off, and 24/7 telemetry monitoring with priority maintenance dispatch.
            </p>
            <button
              onClick={() => setCurrentRoute('maintenance')}
              className="text-xs text-[#00D2FF] font-bold flex items-center gap-1 hover:underline pt-2"
            >
              <span>Explore SLA Tiers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STARLINK-STYLE FINAL BOTTOM HERO CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="relative py-32 px-6 sm:px-12 overflow-hidden border-t border-[#1E2530] text-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/hero-solar-home.jpg"
            alt="Solar home in South Africa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Independent Solar Power
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Take control of your energy today.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto">
            Discover how much you can save every month while safeguarding your family and business against grid failure.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={openConfigurator}
              className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Size Your Property Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentRoute('shop')}
              className="px-8 py-4 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-all w-full sm:w-auto"
            >
              <span>Explore Hardware Store</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
