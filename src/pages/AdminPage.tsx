import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { 
  SlidersHorizontal, 
  Package, 
  Truck, 
  Wrench, 
  FileText, 
  Image, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  UserCheck, 
  Save, 
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2
} from 'lucide-react';

interface AdminPageProps {
  setCurrentRoute: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setCurrentRoute }) => {
  const { 
    products, 
    projects, 
    maintenanceTickets, 
    leadsQuotes, 
    siteContent,
    updateProduct,
    addProduct,
    deleteProduct,
    updateProjectStage,
    assignTechnician,
    updateTicketStatus,
    updateLeadStatus,
    updateSiteContent,
    resetToDefaults
  } = useData();

  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'kpi' | 'content' | 'products' | 'projects' | 'maintenance' | 'leads'>('kpi');
  const [saveToast, setSaveToast] = useState(false);

  // Content Editor State
  const [heroTitle, setHeroTitle] = useState(siteContent.hero?.title || 'Smarter Energy. Built for Real Life.');
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent.hero?.subtitle || '');
  const [heroImage, setHeroImage] = useState(siteContent.hero?.imageUrl || '/hero-solar-home.jpg');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: 'Kinetix Pre-Engineered Systems',
    category: 'complete-kits',
    priceZAR: 45000,
    stockCount: 10,
    sku: `KX-${Math.floor(1000 + Math.random() * 9000)}`,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'High-efficiency solar component engineered for South African installations.',
    warrantyYears: 5
  });

  const availablePhotos = [
    { label: 'Luxury Eco-Home (Sunset)', path: '/hero-solar-home.jpg' },
    { label: 'Commercial Warehouse Array', path: '/commercial-solar-sa.jpg' },
    { label: 'Stellenbosch Agri Vineyard', path: '/solar-farm-agricultural.jpg' },
    { label: 'Battery Power Room & Inverter', path: '/battery-inverter-room.jpg' },
    { label: 'Master Electrician DB Wiring', path: '/electrician-wiring-db.jpg' },
    { label: 'Homeowner Mobile Energy App', path: '/homeowner-app-dashboard.jpg' },
    { label: 'Monocrystalline Cell Close-up', path: '/solar-panel-mono.jpg' },
    { label: 'Hybrid Inverter Unit', path: '/hybrid-inverter-deye.jpg' },
    { label: 'LiFePO4 Lithium Battery Tower', path: '/lithium-battery-etower.jpg' },
    { label: 'Roof PV Installation Harness', path: '/solar-installer-roof.jpg' },
    { label: 'Panel Cleaning & Hydro-Wash', path: '/solar-maintenance-cleaning.jpg' },
    { label: 'SABS Protection Enclosure DB', path: '/solar-protection-panel.jpg' },
    { label: 'CAD Solar Audit Tablet', path: '/cad-solar-audit.jpg' }
  ];

  const handleSaveContent = () => {
    updateSiteContent('hero', {
      title: heroTitle,
      subtitle: heroSubtitle,
      imageUrl: heroImage
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const completeProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      brand: newProduct.brand || 'Kinetix',
      category: newProduct.category as any || 'inverters',
      priceZAR: Number(newProduct.priceZAR) || 10000,
      inStock: (newProduct.stockCount || 0) > 0,
      stockCount: Number(newProduct.stockCount) || 1,
      sku: newProduct.sku || `KX-${Date.now()}`,
      warrantyYears: Number(newProduct.warrantyYears) || 5,
      image: newProduct.image || '/hybrid-inverter-deye.jpg',
      summary: newProduct.summary || 'Solar component specification.',
      specs: [{ label: 'Warranty', value: `${newProduct.warrantyYears || 5} Years` }],
      compatibility: ['Standard Single Phase / 3-Phase'],
      installationAvailable: true,
      installationPriceZAR: 3500,
      faqs: []
    };

    addProduct(completeProduct);
    setIsProductModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // KPI Calculations
  const totalCatalogValue = products.reduce((acc, p) => acc + p.priceZAR * p.stockCount, 0);
  const lowStockCount = products.filter(p => p.stockCount < 5).length;
  const activeProjectsCount = Object.keys(projects).length;
  const openTicketsCount = maintenanceTickets.filter(t => t.status !== 'resolved').length;
  const newLeadsCount = leadsQuotes.filter(l => l.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Admin Navigation & Status Banner */}
      <div className="bg-[#141A17] border border-[#24302A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-[#D97706] font-bold">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D97706] font-bold">
                Executive Control Hub
              </span>
              <span className="text-[9px] font-mono bg-[#1B4D3E] text-[#10B981] px-2 py-0.5 rounded">
                Live SQL Sync
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
              Kinetix CMS & Operations Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('home')}
            className="px-4 py-2 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-xs font-mono text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#286D58]" />
          </button>
          
          <button
            onClick={() => { logout(); setCurrentRoute('home'); }}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-xs font-mono text-red-200 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-4 bg-[#1B4D3E] border border-[#10B981] rounded-xl text-white text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Changes successfully saved and synchronized across the platform!</span>
        </div>
      )}

      {/* Main Tab Navigation Bar */}
      <div className="flex overflow-x-auto border-b border-[#24302A] gap-2 pb-1 text-xs font-mono">
        {[
          { id: 'kpi', label: '📊 Overview & KPIs', count: null },
          { id: 'content', label: '🖼️ Content & Photos CMS', count: null },
          { id: 'products', label: '📦 Products & ATUM Stock', count: products.length },
          { id: 'projects', label: '🚚 Project Milestones & CoC', count: activeProjectsCount },
          { id: 'maintenance', label: '🔧 Maintenance & SLA Tickets', count: openTicketsCount },
          { id: 'leads', label: '⚡ Sizing Quotes & Leads', count: newLeadsCount },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`px-4 py-3 rounded-t-lg font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#141A17] text-white border-t-2 border-[#286D58] border-x border-[#24302A]'
                : 'text-[#9EADA5] hover:text-white hover:bg-[#141A17]/40'
            }`}
          >
            <span>{item.label}</span>
            {item.count !== null && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                activeTab === item.id ? 'bg-[#286D58] text-white' : 'bg-[#0E1311] text-[#6B7B73]'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & KPIS */}
      {/* ========================================================================= */}
      {activeTab === 'kpi' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Warehouse Stock Value</span>
              <div className="text-2xl font-bold text-white font-mono">
                R {totalCatalogValue.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#10B981] font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {products.length} active SKUs
              </span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Active Installations</span>
              <div className="text-2xl font-bold text-[#D97706] font-mono">
                {activeProjectsCount} Projects
              </div>
              <span className="text-[11px] text-[#9EADA5] font-mono">
                Assigned to IE Electricians
              </span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Open SLA & Service Tickets</span>
              <div className="text-2xl font-bold text-[#10B981] font-mono">
                {openTicketsCount} Tickets
              </div>
              <span className="text-[11px] text-[#9EADA5] font-mono">
                4-Hour Response Target
              </span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">New Sizing Inquiries</span>
              <div className="text-2xl font-bold text-white font-mono">
                {newLeadsCount} Leads
              </div>
              <span className="text-[11px] text-[#286D58] font-mono">
                From Configurator & 3-Phase Form
              </span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider border-b border-[#24302A] pb-2">
              Administrative Quick Dispatch Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('content')}
                className="p-4 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] rounded-xl text-left space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">🖼️ Change Website Media & Pictures</span>
                <span className="text-[11px] text-[#9EADA5]">Switch hero backgrounds, solution images, and titles.</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className="p-4 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] rounded-xl text-left space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">📦 Manage Hardware Catalog & Prices</span>
                <span className="text-[11px] text-[#9EADA5]">Add products, update ZAR pricing, adjust stock numbers.</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className="p-4 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] rounded-xl text-left space-y-1 transition-all"
              >
                <span className="text-xs font-bold text-white block">🚚 Advance Project Milestones (KX-9042)</span>
                <span className="text-[11px] text-[#9EADA5]">Move customer installations to next milestone or CoC handover.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTENT & PICTURES CMS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'content' && (
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-8 space-y-8">
          <div className="border-b border-[#24302A] pb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold block">
                Visual Media & Copywriting Control
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Homepage & Solutions Media Manager</h3>
            </div>
            <button
              onClick={handleSaveContent}
              className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>

          {/* Hero Section Live Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#1B2420] pb-2">
              01. Homepage Hero Banner & Background Visual
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={e => setHeroTitle(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Hero Subtitle Copy</label>
                  <textarea
                    rows={3}
                    value={heroSubtitle}
                    onChange={e => setHeroSubtitle(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Select Hero Background Photo</label>
                  <select
                    value={heroImage}
                    onChange={e => setHeroImage(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                  >
                    {availablePhotos.map(photo => (
                      <option key={photo.path} value={photo.path}>
                        {photo.label} ({photo.path})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Preview Thumbnail */}
              <div className="lg:col-span-6 space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Active Visual Preview:</span>
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#0E1311] border border-[#24302A] relative shadow-lg">
                  <img
                    src={heroImage}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white uppercase">{heroTitle}</span>
                    <span className="text-[10px] text-[#9EADA5] truncate">{heroSubtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions Photos Grid Controls */}
          <div className="space-y-4 pt-4 border-t border-[#1B2420]">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              02. Solutions Page Visual Photo Assignments
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'solution_residential', label: 'Residential Hybrid', path: '/hero-solar-home.jpg' },
                { key: 'solution_commercial', label: 'Commercial 3-Phase', path: '/commercial-solar-sa.jpg' },
                { key: 'solution_agricultural', label: 'Agri Vineyard Microgrid', path: '/solar-farm-agricultural.jpg' },
                { key: 'solution_upgrades', label: 'DB Rewiring & Upgrades', path: '/electrician-wiring-db.jpg' },
              ].map(sol => (
                <div key={sol.key} className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-2">
                  <div className="aspect-16/10 rounded-lg overflow-hidden relative">
                    <img src={sol.path} alt={sol.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs font-bold text-white">{sol.label}</div>
                  <span className="text-[10px] font-mono text-[#286D58] block truncate">{sol.path}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCTS & ATUM INVENTORY (WOOCOMMERCE STYLE) */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24302A] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold block">
                ATUM Inventory & Hardware Sales
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Product Catalog & Warehouse Stock</h3>
            </div>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Solar Hardware</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#24302A] text-[#6B7B73] uppercase text-[10px]">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price (ZAR)</th>
                  <th className="pb-3">Stock Count</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2420]">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-[#0E1311]/60 transition-colors">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded bg-[#0E1311] border border-[#24302A]"
                      />
                      <div>
                        <span className="text-white font-bold block">{product.name}</span>
                        <span className="text-[10px] text-[#6B7B73]">{product.brand}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#9EADA5]">{product.sku}</td>
                    <td className="py-3">
                      <span className="bg-[#0E1311] border border-[#24302A] px-2 py-0.5 rounded text-[10px] text-[#9EADA5]">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#D97706] font-bold">R</span>
                        <input
                          type="number"
                          value={product.priceZAR}
                          onChange={e => updateProduct(product.id, { priceZAR: Number(e.target.value) })}
                          className="w-24 bg-[#0E1311] border border-[#24302A] rounded px-2 py-1 text-white font-bold text-xs"
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={product.stockCount}
                          onChange={e => updateProduct(product.id, { stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                          className="w-16 bg-[#0E1311] border border-[#24302A] rounded px-2 py-1 text-white text-xs"
                        />
                        <span className={`w-2 h-2 rounded-full ${product.stockCount > 5 ? 'bg-[#10B981]' : 'bg-red-500'}`} />
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-[#6B7B73] hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROJECT MILESTONES & COC DISPATCH */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 space-y-6">
            <div className="border-b border-[#24302A] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold block">
                Engineering Logistics & Milestone Dispatch
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Active Installation Projects</h3>
            </div>

            {Object.values(projects).map(project => (
              <div
                key={project.orderId}
                className="p-6 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B2420] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white font-mono">{project.orderId}</span>
                      <span className="text-xs text-[#9EADA5]">({project.customerName})</span>
                    </div>
                    <p className="text-xs text-[#6B7B73] font-mono">{project.location} • Scheduled: {project.installationDate}</p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#9EADA5]">Current Stage:</span>
                    <span className="px-2.5 py-1 bg-[#1B4D3E] text-[#10B981] font-bold rounded border border-[#286D58] uppercase">
                      Stage {project.currentStageIndex}: {project.stages[project.currentStageIndex]?.title}
                    </span>
                  </div>
                </div>

                {/* Milestone Step Selector Controls */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">
                    Update Milestone Progress Stage (0 to 5):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {project.stages.map((stage, idx) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => updateProjectStage(project.orderId, idx)}
                        className={`p-2.5 rounded border text-left text-xs font-mono transition-all ${
                          idx === project.currentStageIndex
                            ? 'bg-[#1B4D3E] border-[#10B981] text-white ring-1 ring-[#10B981]'
                            : idx < project.currentStageIndex
                            ? 'bg-[#141A17] border-[#286D58] text-[#10B981]'
                            : 'bg-[#141A17] border-[#24302A] text-[#6B7B73] hover:border-[#31423A]'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>0{idx}</span>
                          {idx <= project.currentStageIndex && <CheckCircle2 className="w-3 h-3 text-[#10B981]" />}
                        </div>
                        <span className="text-[9px] block truncate mt-1">{stage.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assigned Electrician */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1B2420] text-xs font-mono">
                  <div>
                    <label className="block text-[10px] uppercase text-[#6B7B73] mb-1">Assigned Installation Electrician</label>
                    <input
                      type="text"
                      value={project.assignedTechnician.name}
                      onChange={e => assignTechnician(project.orderId, e.target.value, project.assignedTechnician.leadCert)}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#6B7B73] mb-1">DoL Registration / Certification</label>
                    <input
                      type="text"
                      value={project.assignedTechnician.leadCert}
                      onChange={e => assignTechnician(project.orderId, project.assignedTechnician.name, e.target.value)}
                      className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MAINTENANCE SLAS & DIAGNOSTICS */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#24302A] pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold block">
              Asset Protection & Callouts
            </span>
            <h3 className="text-xl font-bold text-white uppercase">Maintenance SLA & Service Tickets</h3>
          </div>

          <div className="space-y-4">
            {maintenanceTickets.map(ticket => (
              <div
                key={ticket.id}
                className="p-5 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-3 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1B2420] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ticket.id}</span>
                    <span className="text-[#D97706]">({ticket.tier})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6B7B73]">Status:</span>
                    <select
                      value={ticket.status}
                      onChange={e => updateTicketStatus(ticket.id, e.target.value as any)}
                      className="bg-[#141A17] border border-[#24302A] rounded px-2.5 py-1 text-white uppercase text-[10px]"
                    >
                      <option value="pending">Pending Dispatch</option>
                      <option value="dispatched">Technician Dispatched</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved & CoC Verified</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5]">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Client & Location</span>
                    <strong className="text-white">{ticket.clientName}</strong>
                    <div className="text-[11px]">{ticket.siteAddress}, {ticket.city}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Hardware & Reason</span>
                    <div className="text-white">{ticket.inverterBrand} ({ticket.systemAge})</div>
                    <div className="text-[#D97706] text-[11px]">{ticket.primaryReason}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Assigned Technician</span>
                    <div className="text-white">{ticket.assignedTechnician || 'Unassigned'}</div>
                    <div className="text-[11px] text-[#6B7B73]">Target: {ticket.scheduledDate || 'TBD'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: LEADS & SIZING QUOTES INBOX */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#24302A] pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#286D58] font-bold block">
              Lead Routing & Quotation Generation
            </span>
            <h3 className="text-xl font-bold text-white uppercase">Sizing Calculator Leads Inbox</h3>
          </div>

          <div className="space-y-4">
            {leadsQuotes.map(lead => (
              <div
                key={lead.id}
                className="p-5 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-3 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1B2420] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{lead.id}</span>
                    <span className="text-[#286D58]">({lead.propertyType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6B7B73]">Pipeline Stage:</span>
                    <select
                      value={lead.status}
                      onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                      className="bg-[#141A17] border border-[#24302A] rounded px-2.5 py-1 text-white uppercase text-[10px]"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Formal Proposal Sent</option>
                      <option value="won">Won & Scheduled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5]">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Contact Details</span>
                    <strong className="text-white">{lead.fullName}</strong>
                    <div>{lead.email} • {lead.phone}</div>
                    <div className="text-[11px] text-[#6B7B73]">{lead.suburb}, {lead.province}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Monthly Spend</span>
                    <div className="text-[#D97706] font-bold text-sm">R {lead.monthlyBillZAR.toLocaleString()} / mo</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">Calculated Sizing</span>
                    <div className="text-white">{lead.recommendedInverterKw}kW Inverter • {lead.recommendedBatteryKwh}kWh Storage</div>
                    <div className="text-[#10B981]">{lead.recommendedSolarKwp} kWp Solar Array</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal Overlay */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#141A17] border border-[#24302A] rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white uppercase border-b border-[#24302A] pb-3">
              Add New Solar Hardware SKU
            </h3>

            <form onSubmit={handleSaveNewProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-[#9EADA5] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Deye 12kW 3-Phase Low Voltage Inverter"
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                  >
                    <option value="inverters">Hybrid Inverters</option>
                    <option value="batteries">LiFePO4 Batteries</option>
                    <option value="solar-panels">Solar Panels</option>
                    <option value="complete-kits">Complete Kits</option>
                    <option value="mounting-equipment">Mounting & Rails</option>
                    <option value="protection-accessories">Protection DBs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Price (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.priceZAR}
                    onChange={e => setNewProduct({ ...newProduct, priceZAR: Number(e.target.value) })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[#9EADA5] mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={e => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[#9EADA5] mb-1">Photo Selection</label>
                <select
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-white"
                >
                  {availablePhotos.map(p => (
                    <option key={p.path} value={p.path}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#24302A]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#0E1311] text-[#9EADA5] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold rounded"
                >
                  Save Hardware to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
