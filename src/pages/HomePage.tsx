import React from 'react';
import { 
  Sun, 
  BatteryCharging, 
  Wrench, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Activity,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { PartnerPlaceholderGrid, PlaceholderBadge } from '../components/common/PlaceholderBadge';
import { EstimateDisclaimer, IncentiveDisclaimer } from '../components/common/EstimateDisclaimer';
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
  const hero = siteContent.hero || {
    title: 'Reliable solar power, designed around your energy needs.',
    subtitle: 'From equipment and installation to maintenance and system upgrades, we make reliable renewable energy easier to understand, buy and manage.',
    imageUrl: '/hero-solar-home.jpg'
  };

  return (
    <div className="space-y-14 sm:space-y-18 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[720px] flex items-center border-b border-[#24302A] overflow-hidden">
        {/* Full-Bleed High-Definition Architectural Background Image (Unobstructed) */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.imageUrl}
            alt="Modern luxury eco-home with integrated all-black solar roof panels, battery storage units, and coastal sunset"
            className="w-full h-full object-cover object-center lg:object-right"
          />
          {/* Directional Legibility Gradient (Clean left fade, unobstructed right vista) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1311] via-[#0E1311]/85 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1311] via-[#0E1311]/80 to-[#0E1311]/40 lg:hidden" />
          <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141A17]/90 backdrop-blur-none border border-[#24302A] rounded text-[11px] font-mono tracking-widest text-[#286D58] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              SMARTER ENERGY. BUILT FOR REAL LIFE.
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight sm:leading-[1.1]">
              {hero.title}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[#C4D1CA] leading-relaxed font-normal drop-shadow-sm">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={openConfigurator}
                className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>Get a Solar Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentRoute('solar')}
                className="px-6 py-3.5 bg-[#141A17]/95 hover:bg-[#1A221E] border border-[#24302A] text-white font-mono font-semibold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Solar Solutions</span>
              </button>
            </div>

            {/* Trust Subtext */}
            <div className="pt-4 border-t border-[#24302A]/80 text-xs font-mono text-[#9EADA5] flex flex-wrap items-center gap-3">
              <span className="text-[#E6ECE8] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Solar solutions
              </span>
              <span>•</span>
              <span className="text-[#E6ECE8] font-medium flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#286D58]" /> Professional installation
              </span>
              <span>•</span>
              <span className="text-[#E6ECE8] font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#D97706]" /> Ongoing support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & VERIFIED CREDENTIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Engineering Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Energy decisions should come with confidence.
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] mt-2 leading-relaxed">
              Choosing an energy system is a long-term investment. We help customers understand what they need, what it will cost and how the system can perform over time.
            </p>
          </div>

          {/* Verified Partner Placeholders Grid */}
          <PartnerPlaceholderGrid />
        </div>
      </section>

      {/* 3. VISUAL SOLUTIONS SECTION (With High-Res Visual Headers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Turnkey Energy Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              One energy partner. Multiple ways to take control.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Solar Systems */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all shadow-md">
              <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/solar-farm-agricultural.jpg"
                  alt="Turnkey solar systems and microgrids"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#286D58]" /> Complete Systems
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">Solar Systems</h3>
                  <p className="text-xs text-[#9EADA5] mt-1.5 leading-relaxed">
                    Complete solar solutions designed around your property's energy requirements.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentRoute('solar')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E6ECE8] group-hover:text-white uppercase tracking-wider transition-colors pt-3 border-t border-[#1B2420]"
                >
                  <span>Explore Solar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#286D58]" />
                </button>
              </div>
            </div>

            {/* Card 2: Solar Equipment */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all shadow-md">
              <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/solar-panel-mono.jpg"
                  alt="Solar equipment and inverters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3 text-[#286D58]" /> Direct Hardware
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">Solar Equipment</h3>
                  <p className="text-xs text-[#9EADA5] mt-1.5 leading-relaxed">
                    Shop panels, inverters, batteries and supporting equipment from the online store.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentRoute('shop')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E6ECE8] group-hover:text-white uppercase tracking-wider transition-colors pt-3 border-t border-[#1B2420]"
                >
                  <span>Shop Equipment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#286D58]" />
                </button>
              </div>
            </div>

            {/* Card 3: Installation */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all shadow-md">
              <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/electrician-wiring-db.jpg"
                  alt="Certified Solar Installation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-[#286D58]" /> SANS 10142 CoC
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">Installation</h3>
                  <p className="text-xs text-[#9EADA5] mt-1.5 leading-relaxed">
                    Professional installation with scheduling and project updates throughout the process.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentRoute('installation')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E6ECE8] group-hover:text-white uppercase tracking-wider transition-colors pt-3 border-t border-[#1B2420]"
                >
                  <span>Plan an Installation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#286D58]" />
                </button>
              </div>
            </div>

            {/* Card 4: Maintenance */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all shadow-md">
              <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/solar-maintenance-cleaning.jpg"
                  alt="Solar maintenance and inspections"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#286D58]" /> Lifetime Care
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">Maintenance</h3>
                  <p className="text-xs text-[#9EADA5] mt-1.5 leading-relaxed">
                    Keep your system performing with ongoing maintenance, inspections and support.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentRoute('maintenance')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E6ECE8] group-hover:text-white uppercase tracking-wider transition-colors pt-3 border-t border-[#1B2420]"
                >
                  <span>View Maintenance</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#286D58]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. VISUAL INSTALLATIONS SHOWCASE (See What You Are Buying) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
                Completed Project Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                Real Installations Across South Africa.
              </h2>
              <p className="text-xs sm:text-sm text-[#9EADA5] mt-1 max-w-2xl">
                See real turnkey installations—from residential hybrid battery power rooms to commercial logistics rooftops.
              </p>
            </div>

            <button
              onClick={openConfigurator}
              className="px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-xs font-mono font-bold text-white uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0"
            >
              <span>Size Your Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gallery Item 1 */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all">
              <div className="aspect-16/10 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/hero-solar-home.jpg"
                  alt="Camps Bay Luxury Residential Solar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
                  Residential Eco-Home • Cape Town
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white uppercase">All-Black Matte Roof Array + Dual Storage</h4>
                <p className="text-xs text-[#9EADA5]">8kW Single Phase Hybrid • 10.24kWh Storage • 100% Loadshedding Backup</p>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all">
              <div className="aspect-16/10 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/battery-inverter-room.jpg"
                  alt="Bryanston Dedicated Power Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
                  Executive Power Room • Bryanston, JHB
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white uppercase">Clean Battery Rack & Inverter Power Room</h4>
                <p className="text-xs text-[#9EADA5]">12kW 3-Phase Inverter • 15kWh LiFePO4 Rack • Pre-Wired SABS DB</p>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all">
              <div className="aspect-16/10 overflow-hidden relative bg-[#0E1311]">
                <img
                  src="/commercial-solar-sa.jpg"
                  alt="Midrand Commercial Warehouse Array"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-[10px] font-mono text-white">
                  Commercial Facility • Midrand, Gauteng
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-white uppercase">Commercial Rooftop Solar & Peak Shaving</h4>
                <p className="text-xs text-[#9EADA5]">50kW 3-Phase Commercial System • SARS Section 12B Tax Allowance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLAR CONFIGURATOR TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
              Multi-Step Sizing Model
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              Not every property needs the same solar system.
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Tell us about your property, energy usage and goals. Our solar configurator helps you explore a solution based on your requirements.
            </p>
            <div className="pt-2">
              <button
                onClick={openConfigurator}
                className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors"
              >
                <span>Build My Solar System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4 STEPS WITH VISUAL PROGRESSION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
              Clear Engineering Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              From first question to working system.
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] mt-1">
              A transparent, 4-step engineering journey from your initial load profile to active solar generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Tell us what you need',
                desc: 'Share information about your property, energy usage and goals.',
                img: '/cad-solar-audit.jpg',
                badge: 'Load Profiling'
              },
              {
                num: '02',
                title: 'Certified Roof Installation',
                desc: 'Mechanical roof rail mounting and DC string cable containment.',
                img: '/solar-installer-roof.jpg',
                badge: 'Roof PV Mount'
              },
              {
                num: '03',
                title: 'SABS Protection & DB Changeover',
                desc: 'Pre-wired surge protection box, inverter calibration, and CoC certification.',
                img: '/solar-protection-panel.jpg',
                badge: 'SANS 10142'
              },
              {
                num: '04',
                title: 'Live Mobile Telemetry',
                desc: 'Real-time solar generation and battery state-of-charge tracking from your phone.',
                img: '/homeowner-app-dashboard.jpg',
                badge: 'Live Telemetry'
              }
            ].map(step => (
              <div 
                key={step.num}
                className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all shadow-md"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-[#0E1311]">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold">
                    Stage {step.num}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1B4D3E]/90 border border-[#286D58] px-2 py-0.5 rounded text-[9px] font-mono text-white uppercase font-semibold">
                    {step.badge}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#9EADA5] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SHOP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
                Direct Hardware Sales
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                Solar equipment, without the guesswork.
              </h2>
              <p className="text-xs sm:text-sm text-[#9EADA5] mt-1">
                Browse solar equipment and components for residential and commercial applications.
              </p>
            </div>

            <button
              onClick={() => setCurrentRoute('shop')}
              className="px-4 py-2.5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] text-xs font-mono font-semibold text-white uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Hardware Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: 'Solar Panels',
                desc: 'Tier-1 Mono PERC & Bi-Facial',
                img: '/solar-installer-roof.jpg',
                count: '545W – 550W'
              },
              {
                title: 'Hybrid Inverters',
                desc: 'Single & 3-Phase Low Voltage',
                img: '/electrician-wiring-db.jpg',
                count: '5kW – 12kW'
              },
              {
                title: 'LiFePO4 Batteries',
                desc: '1C & 0.5C Lithium Modules',
                img: '/battery-inverter-room.jpg',
                count: '5.12kWh – 15kWh'
              },
              {
                title: 'Protection & DBs',
                desc: 'SABS Pre-Wired Enclosures',
                img: '/solar-protection-panel.jpg',
                count: 'IP65 Rated'
              }
            ].map(cat => (
              <div
                key={cat.title}
                onClick={() => setCurrentRoute('shop')}
                className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden cursor-pointer group hover:border-[#31423A] transition-all shadow-sm"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-[#0E1311]">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] font-mono text-white">
                    {cat.count}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white uppercase group-hover:text-[#286D58] transition-colors">{cat.title}</h4>
                  <p className="text-[11px] text-[#9EADA5]">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINANCING & REBATE CHECKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financing Box */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold">
                Asset Finance & Structured Capex
              </span>
              <h3 className="text-xl font-bold text-white uppercase">
                Make the move to solar easier to plan.
              </h3>
              <p className="text-xs text-[#9EADA5] leading-relaxed">
                Explore estimated monthly repayments and understand how different system configurations could affect the overall cost.
              </p>
            </div>

            <div className="p-4 bg-[#0E1311] border border-[#1B2420] rounded text-xs text-[#9EADA5] space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Entry Hybrid Setup (5kW + 5kWh):</span>
                <span className="text-white font-bold">~R 2,450 / mo*</span>
              </div>
              <div className="flex justify-between">
                <span>Executive Setup (8kW + 10kWh):</span>
                <span className="text-white font-bold">~R 3,850 / mo*</span>
              </div>
              <p className="text-[10px] text-[#6B7B73] pt-1">
                *Estimated repayment based on 60-month term @ prime interest rate. Final terms subject to credit approval.
              </p>
            </div>

            <button
              onClick={() => setCurrentRoute('calculator')}
              className="px-5 py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors text-center"
            >
              Calculate Financing
            </button>
          </div>

          {/* Rebates & Tax Incentives Box */}
          <div className="p-8 bg-[#141A17] border border-[#24302A] rounded-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold">
                South African Regulatory Incentives
              </span>
              <h3 className="text-xl font-bold text-white uppercase">
                Find out what incentives may apply to you.
              </h3>
              <p className="text-xs text-[#9EADA5] leading-relaxed">
                Energy incentives and programmes can change. Use our checker to explore potential incentives based on your location and system requirements.
              </p>
            </div>

            <IncentiveDisclaimer />

            <button
              onClick={() => setCurrentRoute('resources')}
              className="px-5 py-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono font-semibold text-xs uppercase tracking-wider rounded transition-colors text-center"
            >
              Check Incentives & SSEG Policies
            </button>
          </div>
        </div>
      </section>


      {/* 9. MAINTENANCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block">
              Asset Lifecycle Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Your solar system is an investment. Keep it performing.
            </h2>
            <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
              Our maintenance services help customers monitor system performance, identify issues and keep equipment operating as expected.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            {[
              'System inspections',
              'Performance checks',
              'Fault identification',
              'Equipment maintenance',
              'De-soiling & cleaning',
              'Component replacement',
              'System upgrades',
              'Statutory CoC audits'
            ].map((srv, idx) => (
              <div key={idx} className="p-3 bg-[#0E1311] border border-[#24302A] rounded flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#286D58] shrink-0" />
                <span className="text-[#E6ECE8]">{srv}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentRoute('maintenance')}
              className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
            >
              Book Maintenance
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
