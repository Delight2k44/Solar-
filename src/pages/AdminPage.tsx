import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Product, OrderRecord, InstallationBooking, CommercialLead, ContactEnquiry, UserNotification } from '../types';
import { 
  Lock,
  ArrowRight,
  SlidersHorizontal, 
  Package, 
  Truck, 
  Wrench, 
  FileText, 
  Image as ImageIcon, 
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
  Building2,
  Bell,
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Check,
  Eye,
  X,
  User,
  LogOut
} from 'lucide-react';

interface AdminPageProps {
  setCurrentRoute: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setCurrentRoute }) => {
  const { 
    products, 
    projects, 
    orders,
    installationBookings,
    commercialLeads,
    maintenanceTickets, 
    leadsQuotes, 
    contactEnquiries,
    userNotifications,
    siteContent,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    updateInstallationBookingStatus,
    deleteInstallationBooking,
    updateCommercialLeadStatus,
    deleteCommercialLead,
    updateProjectStage,
    assignTechnician,
    updateTicketStatus,
    deleteMaintenanceTicket,
    updateLeadStatus,
    deleteLeadQuote,
    updateContactEnquiryStatus,
    deleteContactEnquiry,
    sendNotification,
    deleteNotification,
    updateSiteContent,
    resetToDefaults
  } = useData();

  const { currentUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<
    'kpi' | 'orders' | 'products' | 'bookings' | 'maintenance' | 'proposals' | 'enquiries' | 'commercial' | 'notifications' | 'content'
  >('kpi');
  
  const [saveToast, setSaveToast] = useState('');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    brand: 'Kinetix Energy',
    category: 'complete-kits',
    priceZAR: 45000,
    stockCount: 15,
    sku: `KX-${Math.floor(1000 + Math.random() * 9000)}`,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'High-efficiency solar component engineered for South African installations.',
    warrantyYears: 5,
    inStock: true,
    installationAvailable: true,
    installationPriceZAR: 6500
  });

  // Notification Compose State
  const [notifTargetEmail, setNotifTargetEmail] = useState('all');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'order' | 'maintenance' | 'installation' | 'general'>('general');

  // CMS Content Editor State
  const [heroTitle, setHeroTitle] = useState(siteContent.hero?.title || 'Smarter Energy. Built for Real Life.');
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent.hero?.subtitle || '');
  const [heroImage, setHeroImage] = useState(siteContent.hero?.imageUrl || '/hero-solar-home.jpg');

  const availablePhotos = [
    { label: 'Kinetix Installation Crew & Fleet', path: '/kinetix-team-crew.jpg' },
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

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Open Product Modal for Add
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      brand: 'Kinetix Energy',
      category: 'complete-kits',
      priceZAR: 45000,
      stockCount: 15,
      sku: `KX-${Math.floor(1000 + Math.random() * 9000)}`,
      image: '/hybrid-inverter-deye.jpg',
      summary: 'High-efficiency solar component engineered for South African installations.',
      warrantyYears: 5,
      inStock: true,
      installationAvailable: true,
      installationPriceZAR: 6500,
      specs: [{ label: 'Technology', value: 'LiFePO4 / Pure Sine Wave' }],
      compatibility: ['Deye', 'Sunsynk', 'Freedom Won'],
      faqs: [{ question: 'Is installation included?', answer: 'Yes, certified DoL installation is available.' }]
    });
    setIsProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.priceZAR) return;

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
      showToast(`Product "${productForm.name}" updated successfully!`);
    } else {
      const newId = (productForm.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

      addProduct({
        id: newId,
        name: productForm.name || 'New Solar Product',
        brand: productForm.brand || 'Kinetix Energy',
        category: productForm.category || 'complete-kits',
        priceZAR: Number(productForm.priceZAR) || 0,
        inStock: productForm.inStock ?? true,
        stockCount: Number(productForm.stockCount) || 10,
        sku: productForm.sku || `KX-${Math.floor(1000 + Math.random() * 9000)}`,
        image: productForm.image || '/hybrid-inverter-deye.jpg',
        summary: productForm.summary || '',
        warrantyYears: Number(productForm.warrantyYears) || 5,
        specs: productForm.specs || [],
        compatibility: productForm.compatibility || [],
        installationAvailable: productForm.installationAvailable ?? true,
        installationPriceZAR: Number(productForm.installationPriceZAR) || 0,
        faqs: productForm.faqs || []
      });
      showToast(`Product "${productForm.name}" added to catalog!`);
    }

    setIsProductModalOpen(false);
  };

  // Send System Notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    sendNotification({
      targetUserEmail: notifTargetEmail,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      sender: 'Kinetix Operations Center'
    });

    showToast(`Notification sent to ${notifTargetEmail === 'all' ? 'all users' : notifTargetEmail}!`);
    setNotifTitle('');
    setNotifMessage('');
  };

  // Save CMS Content
  const handleSaveContent = () => {
    updateSiteContent('hero', {
      title: heroTitle,
      subtitle: heroSubtitle,
      imageUrl: heroImage
    });
    showToast('Hero section & media updated live!');
  };

  // Compute Total Revenue
  const totalRevenueZAR = orders.reduce((sum, o) => sum + (o.totalCartZAR || 0), 0);
  const pendingOrdersCount = orders.filter(o => !o.adminApproved || o.currentStageIndex === 0).length;

  const isAdmin = currentUser?.role === 'admin' && currentUser?.email?.toLowerCase() === 'delightchetter@gmail.com';

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-[#141A17] border border-red-500/30 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
            Access Restricted • Secured Portal
          </span>
          <h3 className="text-xl font-bold text-white uppercase">Operations Dashboard</h3>
          <p className="text-xs text-[#9EADA5] leading-relaxed">
            This administration portal is restricted to authorized operations personnel (<strong>delightchetter@gmail.com</strong>). Please sign in to authenticate.
          </p>
        </div>
        <button
          onClick={() => setCurrentRoute('login')}
          className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Authenticate as Administrator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 font-sans text-[#E6ECE8]">
      
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-black font-mono text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. ADMIN HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24302A] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#10B981] font-bold">
              Kinetix Master Operations Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-[#9EADA5] font-mono">
            Authenticated Admin: <strong className="text-white">{currentUser?.email || 'admin@kinetixenergy.co.za'}</strong> • Full Read/Write/Delete Access
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-sans font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => { logout(); setCurrentRoute('home'); }}
            className="px-3.5 py-2 bg-[#141A17] hover:bg-red-950/40 border border-[#24302A] hover:border-red-800 text-[#9EADA5] hover:text-red-300 font-sans text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Sign Out Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-1 border-b border-[#24302A] pb-px text-xs font-mono font-bold tracking-wider">
        {[
          { id: 'kpi', label: 'METRICS OVERVIEW', icon: TrendingUp },
          { id: 'orders', label: `ORDERS & SALES (${orders.length})`, icon: Truck, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
          { id: 'products', label: `STORE & PRICES (${products.length})`, icon: Package },
          { id: 'bookings', label: `SITE ASSESSMENTS (${installationBookings.length})`, icon: Calendar },
          { id: 'maintenance', label: `SERVICE DISPATCH (${maintenanceTickets.length})`, icon: Wrench },
          { id: 'proposals', label: `SIZING PROPOSALS (${leadsQuotes.length})`, icon: FileText },
          { id: 'enquiries', label: `ENQUIRIES (${contactEnquiries.length})`, icon: Mail },
          { id: 'commercial', label: `COMMERCIAL 3-PHASE (${commercialLeads.length})`, icon: Building2 },
          { id: 'notifications', label: `MESSAGING & ALERTS (${userNotifications.length})`, icon: Bell },
          { id: 'content', label: 'SITE MEDIA & CMS', icon: ImageIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap relative ${
                isActive
                  ? 'bg-[#141A17] text-white border-t-2 border-[#10B981] border-x border-[#24302A]'
                  : 'text-[#9EADA5] hover:text-white hover:bg-[#141A17]/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-[#6B7B73]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-[#D97706] text-black text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: METRICS & KPI OVERVIEW */}
      {activeTab === 'kpi' && (
        <div className="space-y-8 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-2">
              <span className="text-[10px] text-[#6B7B73] uppercase font-bold">Total Platform Revenue</span>
              <div className="text-2xl font-extrabold text-[#10B981]">R {totalRevenueZAR.toLocaleString()}</div>
              <span className="text-[10px] text-[#9EADA5]">Across {orders.length} placed equipment orders</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-2">
              <span className="text-[10px] text-[#6B7B73] uppercase font-bold">Pending Orders & Approvals</span>
              <div className="text-2xl font-extrabold text-[#D97706]">{pendingOrdersCount}</div>
              <span className="text-[10px] text-[#9EADA5]">Awaiting technical review or dispatch</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-2">
              <span className="text-[10px] text-[#6B7B73] uppercase font-bold">Active Hardware Catalog</span>
              <div className="text-2xl font-extrabold text-white">{products.length} Products</div>
              <span className="text-[10px] text-[#9EADA5]">Panels, Inverters, Batteries, Kits</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-2">
              <span className="text-[10px] text-[#6B7B73] uppercase font-bold">Inbound Leads & Forms</span>
              <div className="text-2xl font-extrabold text-white">
                {installationBookings.length + maintenanceTickets.length + leadsQuotes.length + contactEnquiries.length + commercialLeads.length}
              </div>
              <span className="text-[10px] text-[#9EADA5]">Assessments, Service, Sizing, Enquiries</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div 
              onClick={() => setActiveTab('orders')}
              className="p-5 bg-[#141A17] border border-[#24302A] hover:border-[#10B981] rounded-2xl cursor-pointer space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between text-white font-bold">
                <span>Manage Hardware Orders</span>
                <Truck className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-[#9EADA5]">Approve incoming customer orders, assign RAM freight waybills, and advance stages.</p>
            </div>

            <div 
              onClick={() => setActiveTab('products')}
              className="p-5 bg-[#141A17] border border-[#24302A] hover:border-[#10B981] rounded-2xl cursor-pointer space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between text-white font-bold">
                <span>Edit Prices & Products</span>
                <Package className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-[#9EADA5]">Change product pictures, adjust ZAR pricing, update stock numbers, or create items.</p>
            </div>

            <div 
              onClick={() => setActiveTab('notifications')}
              className="p-5 bg-[#141A17] border border-[#24302A] hover:border-[#10B981] rounded-2xl cursor-pointer space-y-2 group transition-all"
            >
              <div className="flex items-center justify-between text-white font-bold">
                <span>Send Customer Messages</span>
                <Bell className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-[#9EADA5]">Broadcast system notifications or send direct updates to specific customer accounts.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT DESK */}
      {activeTab === 'orders' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase">Orders & Sales Fulfillment Queue ({orders.length})</h3>
              <p className="text-[#9EADA5]">Review and approve customer transactions, assign freight waybills, and advance installation stages.</p>
            </div>
          </div>

          <div className="space-y-5">
            {orders.map(order => (
              <div key={order.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-white text-sm">{order.id}</span>
                    <span className="px-2 py-0.5 bg-[#10B981]/20 border border-[#10B981] text-[#10B981] text-[10px] rounded uppercase font-bold">
                      {order.paymentStatus}
                    </span>
                    <span className="text-[#6B7B73]">• {order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-[#6B7B73]">• {order.createdAt}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.adminApproved ? (
                      <span className="px-2.5 py-1 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] rounded uppercase font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Admin Approved</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          updateOrderStatus(order.id, 'bench_testing', 1, {
                            adminApproved: true,
                            adminNotes: 'Approved by Sandton Operations Hub. Hardware bench-testing in progress.'
                          });
                          showToast(`Order ${order.id} approved!`);
                        }}
                        className="px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase text-[10px] rounded flex items-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Order</span>
                      </button>
                    )}

                    <select
                      value={order.orderStatus}
                      onChange={e => {
                        const newStatus = e.target.value as any;
                        const stageMap: Record<string, number> = {
                          hardware_reserved: 0,
                          bench_testing: 1,
                          scheduled: 2,
                          installed: 3,
                          commissioned: 4,
                          completed: 5
                        };
                        const nextStage = stageMap[newStatus] ?? order.currentStageIndex;
                        updateOrderStatus(order.id, newStatus, nextStage, { adminApproved: true });
                        showToast(`Order ${order.id} stage updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="hardware_reserved">Stage 0: Hardware Reserved</option>
                      <option value="bench_testing">Stage 1: Bench Testing</option>
                      <option value="scheduled">Stage 2: Install Scheduled</option>
                      <option value="installed">Stage 3: On-Site Install</option>
                      <option value="commissioned">Stage 4: Commissioned</option>
                      <option value="completed">Stage 5: CoC Completed</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete order ${order.id}?`)) {
                          deleteOrder(order.id);
                          showToast(`Order ${order.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#9EADA5] bg-[#0E1311] p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Customer Details</span>
                    <strong className="text-white block">{order.customerName}</strong>
                    <div>{order.customerEmail}</div>
                    <div>{order.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Delivery & Freight Tracking</span>
                    <div className="text-white">{order.shippingAddress}, {order.city}</div>
                    <div className="text-[10px] text-[#10B981] mt-1">
                      Carrier: {order.courierName || 'RAM Logistics'} • Waybill: {order.trackingNumber || `RAM-ZA-${order.id.slice(-6)}`}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Financial Breakdown</span>
                    <div className="text-[#D97706] font-bold text-sm">R {order.totalCartZAR.toLocaleString()}</div>
                    <div className="text-[10px] text-[#6B7B73]">
                      Eq: R {order.equipmentSubtotalZAR.toLocaleString()} • Install: R {order.installationSubtotalZAR.toLocaleString()} • VAT: R {order.vatZAR.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Line Items:</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-[#0E1311] rounded border border-[#24302A]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#141A17] flex items-center justify-center text-[10px] text-[#D97706] font-bold">
                          {item.quantity}x
                        </span>
                        <span className="text-white font-medium">{item.productName}</span>
                        <span className="text-[10px] text-[#6B7B73]">({item.sku})</span>
                      </div>
                      <span className="text-white font-bold">R {(item.unitPriceZAR * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STORE & PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase">Product Catalog & Live Pricing Manager ({products.length})</h3>
              <p className="text-[#9EADA5]">Edit prices, change pictures, modify stock levels, or create new solar hardware listings.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(prod => (
              <div key={prod.id} className="bg-[#141A17] border border-[#24302A] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                <div className="aspect-16/10 relative overflow-hidden bg-[#0E1311]">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold">
                    {prod.category}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-[#1B4D3E]/90 border border-[#10B981]/40 px-2 py-0.5 rounded text-[9px] text-[#10B981] font-bold">
                    {prod.stockCount} in stock
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase">{prod.brand} • {prod.sku}</span>
                    <strong className="text-white text-sm block line-clamp-1">{prod.name}</strong>
                    <p className="text-[11px] text-[#9EADA5] line-clamp-2 mt-1">{prod.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-[#24302A] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6B7B73] block">Unit Price (ZAR):</span>
                      <strong className="text-base text-[#10B981]">R {prod.priceZAR.toLocaleString()}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="px-3 py-1.5 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#10B981] text-white rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete product "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                            showToast(`Product "${prod.name}" deleted.`);
                          }
                        }}
                        className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESIDENTIAL SITE ASSESSMENTS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-[#24302A] pb-4">
            <h3 className="text-base font-bold text-white uppercase">
              Installation Assessment Bookings ({installationBookings.length})
            </h3>
            <p className="text-[#9EADA5]">Site assessment requests submitted from "Confirm Installation Assessment Window".</p>
          </div>

          <div className="space-y-4">
            {installationBookings.map(booking => (
              <div key={booking.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{booking.id}</span>
                    <span className="text-[#10B981] font-semibold">({booking.clientName})</span>
                    <span className="text-[#6B7B73]">Requested: {booking.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      onChange={e => {
                        updateInstallationBookingStatus(booking.id, e.target.value as any);
                        showToast(`Assessment ${booking.id} status updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="site_visit_scheduled">Site Visit Scheduled</option>
                      <option value="quote_prepared">Quote Prepared</option>
                      <option value="confirmed">Confirmed & Approved</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete assessment booking ${booking.id}?`)) {
                          deleteInstallationBooking(booking.id);
                          showToast(`Booking ${booking.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5] bg-[#0E1311] p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Contact</span>
                    <strong className="text-white">{booking.clientName}</strong>
                    <div>{booking.email}</div>
                    <div>{booking.phone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Site Location</span>
                    <div className="text-white">{booking.address}</div>
                    <div>{booking.city}</div>
                    <div className="text-[10px] text-[#10B981]">Target Date: {booking.targetDate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Electrical Specs</span>
                    <div>Roof: {booking.roofType}</div>
                    <div>Phase: {booking.phaseConnection}</div>
                    <div>DB: {booking.dbLocation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MAINTENANCE & SERVICE DISPATCH */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-[#24302A] pb-4">
            <h3 className="text-base font-bold text-white uppercase">
              Service SLA & Maintenance Dispatch Queue ({maintenanceTickets.length})
            </h3>
            <p className="text-[#9EADA5]">Requests from "Dispatch Maintenance Booking Request" or customer portal.</p>
          </div>

          <div className="space-y-4">
            {maintenanceTickets.map(ticket => (
              <div key={ticket.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{ticket.id}</span>
                    <span className="text-[#10B981]">({ticket.tier})</span>
                    <span className="text-[#6B7B73]">• Client: {ticket.clientName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ticket.status}
                      onChange={e => {
                        updateTicketStatus(ticket.id, e.target.value as any);
                        showToast(`Service ticket ${ticket.id} updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="pending">Pending Dispatch</option>
                      <option value="dispatched">Dispatched to Site</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved & CoC Signed</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete service ticket ${ticket.id}?`)) {
                          deleteMaintenanceTicket(ticket.id);
                          showToast(`Service ticket ${ticket.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5] bg-[#0E1311] p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Client & Site</span>
                    <strong className="text-white">{ticket.clientName}</strong>
                    <div>{ticket.siteAddress}, {ticket.city}</div>
                    <div>{ticket.clientPhone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Issue & Primary Reason</span>
                    <strong className="text-white block">{ticket.primaryReason}</strong>
                    <div className="text-[11px]">{ticket.issueDetails}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Assigned Crew</span>
                    <div className="text-white font-bold">{ticket.assignedTechnician || 'Unassigned'}</div>
                    <div className="text-[10px] text-[#10B981]">Scheduled: {ticket.scheduledDate || 'TBD'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SIZING PROPOSALS & QUOTES */}
      {activeTab === 'proposals' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-[#24302A] pb-4">
            <h3 className="text-base font-bold text-white uppercase">
              Solar Sizing Quotes & Proposal Leads ({leadsQuotes.length})
            </h3>
            <p className="text-[#9EADA5]">Leads generated from the interactive multi-step Solar Configurator.</p>
          </div>

          <div className="space-y-4">
            {leadsQuotes.map(quote => (
              <div key={quote.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{quote.id}</span>
                    <strong className="text-white">{quote.fullName}</strong>
                    <span className="text-[#6B7B73]">• {quote.suburb}, {quote.province}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={quote.status}
                      onChange={e => {
                        updateLeadStatus(quote.id, e.target.value as any);
                        showToast(`Quote lead ${quote.id} status updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Client Contacted</option>
                      <option value="quoted">Formal Proposal Sent</option>
                      <option value="won">Closed & Won</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete quote lead ${quote.id}?`)) {
                          deleteLeadQuote(quote.id);
                          showToast(`Quote ${quote.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5] bg-[#0E1311] p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Customer Info</span>
                    <strong className="text-white">{quote.fullName}</strong>
                    <div>{quote.email}</div>
                    <div>{quote.phone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Property & Bill</span>
                    <div className="text-white">{quote.propertyType}</div>
                    <div>Monthly Electricity Bill: <strong className="text-[#D97706]">R {quote.monthlyBillZAR.toLocaleString()}</strong></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Engineered System Recommendation</span>
                    <div className="text-[#10B981] font-bold">
                      {quote.recommendedInverterKw}kW Inverter • {quote.recommendedBatteryKwh}kWh Battery • {quote.recommendedSolarKwp}kWp Solar
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GENERAL CONTACT ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-[#24302A] pb-4">
            <h3 className="text-base font-bold text-white uppercase">
              Website Contact Enquiries ({contactEnquiries.length})
            </h3>
            <p className="text-[#9EADA5]">Messages submitted from the "Send Enquiry" contact form.</p>
          </div>

          <div className="space-y-4">
            {contactEnquiries.map(enq => (
              <div key={enq.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{enq.id}</span>
                    <strong className="text-white">{enq.name}</strong>
                    <span className="text-[#6B7B73]">• {enq.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={enq.status}
                      onChange={e => {
                        updateContactEnquiryStatus(enq.id, e.target.value as any);
                        showToast(`Enquiry ${enq.id} status updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="new">New Enquiry</option>
                      <option value="reviewed">Under Review</option>
                      <option value="replied">Replied to Client</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete enquiry ${enq.id}?`)) {
                          deleteContactEnquiry(enq.id);
                          showToast(`Enquiry ${enq.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#0E1311] p-4 rounded-xl space-y-2 text-[#9EADA5]">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>Email: <strong className="text-white">{enq.email}</strong> • Phone: <strong className="text-white">{enq.phone || 'N/A'}</strong></div>
                    <span className="text-[#10B981] font-semibold">{enq.subject}</span>
                  </div>
                  <p className="text-white font-medium bg-[#141A17] p-3 rounded-lg border border-[#24302A] text-xs leading-relaxed">
                    "{enq.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: COMMERCIAL 3-PHASE AUDITS */}
      {activeTab === 'commercial' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="border-b border-[#24302A] pb-4">
            <h3 className="text-base font-bold text-white uppercase">
              Commercial & Industrial 3-Phase Leads ({commercialLeads.length})
            </h3>
            <p className="text-[#9EADA5]">C&I leads for Section 12B tax relief, generator displacement, and medium-voltage microgrids.</p>
          </div>

          <div className="space-y-4">
            {commercialLeads.map(comm => (
              <div key={comm.id} className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{comm.id}</span>
                    <strong className="text-white text-sm">{comm.companyName}</strong>
                    <span className="text-[#10B981]">({comm.industrySector})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={comm.status}
                      onChange={e => {
                        updateCommercialLeadStatus(comm.id, e.target.value as any);
                        showToast(`Commercial lead ${comm.id} status updated!`);
                      }}
                      className="bg-[#0E1311] border border-[#24302A] rounded px-3 py-1 text-white uppercase text-[10px] font-bold"
                    >
                      <option value="new">New Request</option>
                      <option value="profiling">Load Profiling</option>
                      <option value="audit_booked">On-Site Audit Booked</option>
                      <option value="proposal_sent">EPC Proposal Sent</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm(`Delete commercial lead ${comm.id}?`)) {
                          deleteCommercialLead(comm.id);
                          showToast(`Commercial lead ${comm.id} deleted.`);
                        }
                      }}
                      className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#9EADA5] bg-[#0E1311] p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Contact Person</span>
                    <strong className="text-white">{comm.contactName} ({comm.designation})</strong>
                    <div>{comm.email}</div>
                    <div>{comm.phone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Energy Metrics</span>
                    <div>Monthly Spend: <strong className="text-white">{comm.monthlySpend}</strong></div>
                    <div>Peak Demand: <strong className="text-[#10B981]">{comm.peakKva}</strong></div>
                    <div>Diesel: {comm.dieselMonthly}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7B73] block uppercase font-bold">Tax & Location</span>
                    <div>Location: {comm.locationCity}</div>
                    <div>Section 12B Incentive: <strong className="text-[#10B981]">{comm.taxSection12b ? 'Applicable' : 'No'}</strong></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: CUSTOMER MESSAGING & NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-8 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-4 shadow-xl">
            <div className="border-b border-[#24302A] pb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-white uppercase">Compose & Broadcast Customer Notification</h3>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Target Recipient Email *</label>
                  <input
                    type="text"
                    required
                    value={notifTargetEmail}
                    onChange={e => setNotifTargetEmail(e.target.value)}
                    placeholder="Enter email or 'all'"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                  <span className="text-[9px] text-[#6B7B73] mt-0.5 block">Use 'all' to broadcast to every user</span>
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Notification Category</label>
                  <select
                    value={notifType}
                    onChange={e => setNotifType(e.target.value as any)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="general">General Platform Announcement</option>
                    <option value="order">Order & Freight Update</option>
                    <option value="installation">Installation Scheduling</option>
                    <option value="maintenance">Maintenance SLA Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Notification Title *</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    placeholder="e.g. Order Approved & Dispatched"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Message Content *</label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  placeholder="Type the message that will be delivered directly to the user dashboard..."
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase border-b border-[#24302A] pb-2">
              Dispatched Customer Notifications ({userNotifications.length})
            </h4>

            {userNotifications.map(notif => (
              <div key={notif.id} className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] text-[9px] rounded uppercase font-bold">
                      {notif.type}
                    </span>
                    <strong className="text-white text-xs">{notif.title}</strong>
                    <span className="text-[#6B7B73]">To: {notif.targetUserEmail}</span>
                  </div>
                  <p className="text-[#9EADA5]">{notif.message}</p>
                  <span className="text-[10px] text-[#6B7B73] block">Sent by {notif.sender} on {notif.createdAt}</span>
                </div>

                <button
                  onClick={() => {
                    deleteNotification(notif.id);
                    showToast('Notification deleted.');
                  }}
                  className="p-1.5 bg-[#0E1311] hover:bg-red-950/50 border border-[#24302A] hover:border-red-800 text-red-400 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: SITE MEDIA & CMS CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-8 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-6 shadow-xl">
            <div className="border-b border-[#24302A] pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Homepage Hero Media & Headline Editor</h3>
                <p className="text-[#9EADA5]">Update the primary banner image and text across the public landing page.</p>
              </div>
              <button
                onClick={handleSaveContent}
                className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={e => setHeroTitle(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Hero Subtitle Text</label>
                  <textarea
                    rows={3}
                    value={heroSubtitle}
                    onChange={e => setHeroSubtitle(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Hero Picture Selection</label>
                  <select
                    value={heroImage}
                    onChange={e => setHeroImage(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  >
                    {availablePhotos.map(p => (
                      <option key={p.path} value={p.path}>{p.label} ({p.path})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Hero Media Live Preview:</span>
                <div className="aspect-16/10 rounded-xl overflow-hidden border border-[#24302A] bg-[#0E1311] relative">
                  <img
                    src={heroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1311] via-transparent to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm line-clamp-1">{heroTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141A17] border border-[#24302A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-white uppercase">
                  {editingProductId ? 'Edit Product & Pricing' : 'Add New Solar Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Deye 12kW 3-Phase Inverter"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand || ''}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Deye / Sunsynk / Freedom Won"
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Category *</label>
                  <select
                    value={productForm.category || 'complete-kits'}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="complete-kits">Complete Solar Kits</option>
                    <option value="inverters">Hybrid Inverters</option>
                    <option value="batteries">LiFePO4 Batteries</option>
                    <option value="solar-panels">Solar Panels</option>
                    <option value="protection-accessories">Protection & DBs</option>
                    <option value="mounting-equipment">Mounting Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">SKU Number</label>
                  <input
                    type="text"
                    value={productForm.sku || ''}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Price (ZAR Incl. VAT) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.priceZAR || 0}
                    onChange={e => setProductForm({ ...productForm, priceZAR: Number(e.target.value) })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount || 0}
                    onChange={e => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Product Picture</label>
                <select
                  value={productForm.image || '/hybrid-inverter-deye.jpg'}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3 py-2 text-white mb-2"
                >
                  {availablePhotos.map(p => (
                    <option key={p.path} value={p.path}>{p.label} ({p.path})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#9EADA5] text-[10px] uppercase mb-1">Summary Description</label>
                <textarea
                  rows={3}
                  value={productForm.summary || ''}
                  onChange={e => setProductForm({ ...productForm, summary: e.target.value })}
                  className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#24302A]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-[#9EADA5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-bold uppercase rounded-xl flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProductId ? 'Update Product' : 'Add to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
