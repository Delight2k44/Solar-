import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { OrderRecord } from '../../types';
import { 
  Activity, 
  Layers, 
  FileText, 
  Wrench, 
  ShoppingBag, 
  UserCheck, 
  BatteryCharging, 
  Sun, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  User,
  LogOut,
  Truck,
  Package,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Eye,
  Printer,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Bell,
  X
} from 'lucide-react';

interface CustomerPortalProps {
  onBookMaintenance?: () => void;
  onNavigateToShop?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  onBookMaintenance,
  onNavigateToShop 
}) => {
  const { 
    projects, 
    orders, 
    maintenanceTickets, 
    userNotifications,
    markNotificationRead,
    createMaintenanceTicket 
  } = useData();
  const { currentUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'telemetry' | 'installation' | 'maintenance' | 'documents'>('dashboard');
  
  // Selected Order for Modal / Deep Inspection
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRecord | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderRecord | null>(null);

  // New Maintenance Ticket Form Modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketReason, setTicketReason] = useState('Annual Preventative Health Audit');
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('');

  // User-scoped orders or fallback
  const userOrders = orders.filter(o => 
    !currentUser?.email || 
    o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
    o.customerName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
    o.customerEmail.includes('bryanston')
  );
  const displayOrders = userOrders.length > 0 ? userOrders : orders;
  const primaryOrder = displayOrders[0];

  // User-scoped maintenance tickets
  const userTickets = maintenanceTickets.filter(t => 
    !currentUser?.email ||
    t.clientEmail.toLowerCase() === currentUser.email.toLowerCase() ||
    t.clientName.includes('Bryanston')
  );

  // User-scoped notifications from Admin Operations Desk
  const myNotifications = userNotifications.filter(n =>
    n.targetUserEmail === 'all' ||
    (currentUser?.email && n.targetUserEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
    n.targetUserEmail.includes('bryanston')
  );
  const unreadNotifications = myNotifications.filter(n => !n.read);

  const stageDescriptions = [
    { title: 'Order Placed & Payment Cleared', desc: 'Secure transaction confirmed via 3D Secure / Instant EFT.', icon: ShoppingBag },
    { title: 'Admin Technical Approval', desc: 'Engineering desk reviewed roof schematic & allocated warehouse serials.', icon: ShieldCheck },
    { title: 'Hardware Bench-Testing & Prep', desc: 'Inverter firmware flashed and LiFePO4 cells balanced at 1000V DC.', icon: Activity },
    { title: 'Freight Dispatch & In-Transit', desc: 'Heavy transport logistics dispatched with real-time GPS tracking.', icon: Truck },
    { title: 'On-Site Certified Installation', desc: 'DoL Master Electrician mounted hardware, DB changeover, and AC/DC isolators.', icon: Wrench },
    { title: 'Commissioning & CoC Handover', desc: 'Supplementary SANS 10142-1-2 CoC and municipal SSEG sign-off issued.', icon: CheckCircle2 }
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDetails.trim()) return;

    createMaintenanceTicket({
      clientName: currentUser?.name || 'Bryanston Residential Client',
      clientEmail: currentUser?.email || 'client@bryanston.co.za',
      clientPhone: currentUser?.phone || '+27 82 456 7890',
      siteAddress: primaryOrder?.shippingAddress || '14 Protea Avenue, Bryanston',
      city: primaryOrder?.city || 'Johannesburg',
      tier: 'Performance SLA (24/7 Priority)',
      inverterBrand: 'Deye 8kW Hybrid',
      systemAge: '1 Year',
      primaryReason: ticketReason,
      issueDetails: ticketDetails,
      assignedTechnician: 'Master Electrician J. Botha',
      scheduledDate: 'Next Available SLA Window'
    });

    setTicketSuccessMsg('Service request logged successfully. A certified technician has been notified.');
    setTicketDetails('');
    setTimeout(() => {
      setTicketSuccessMsg('');
      setIsTicketModalOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-[#0E1311] border border-[#24302A] rounded-2xl p-6 sm:p-8 max-w-7xl mx-auto text-[#E6ECE8] shadow-2xl space-y-8 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. PORTAL HEADER: Profile Overview & Quick Actions */}
      {/* ========================================================================= */}
      <div className="border-b border-[#24302A] pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white font-mono font-bold text-xl shadow-lg shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'KX'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981] font-bold">
                Kinetix Energy Asset Portal
              </span>
              <span className="px-2 py-0.2 bg-[#141A17] border border-[#24302A] text-[#9EADA5] rounded text-[9px] font-mono">
                SLA: ACTIVE (24/7)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
              {currentUser?.name || 'Bryanston Residential Client'}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#9EADA5] font-mono">
              <span>{currentUser?.email || 'client@bryanston.co.za'}</span>
              <span className="text-[#6B7B73]">•</span>
              <span>Site: <strong className="text-white">{primaryOrder?.shippingAddress || 'Sandton City'}, {primaryOrder?.city || 'Gauteng'}</strong></span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('orders')}
            className="px-3.5 py-2 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#286D58] text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Truck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Track Orders ({displayOrders.length})</span>
          </button>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-3.5 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Request Service</span>
          </button>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-2 bg-[#141A17] hover:bg-red-950/40 border border-[#24302A] hover:border-red-800 text-[#9EADA5] hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Broadcast / Direct Notifications Tray */}
      {myNotifications.length > 0 && (
        <div className="space-y-3 font-mono text-xs">
          {myNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 shadow-lg transition-all ${
                notif.read 
                  ? 'bg-[#141A17]/60 border-[#24302A] text-[#9EADA5]' 
                  : 'bg-[#141A17] border-[#10B981]/60 text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-[#1B4D3E] text-[#10B981] font-bold uppercase px-1.5 py-0.5 rounded">
                      {notif.sender || 'Admin Desk'}
                    </span>
                    <strong className="text-white text-xs">{notif.title}</strong>
                    <span className="text-[#6B7B73] text-[10px]">{notif.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#9EADA5] leading-relaxed">{notif.message}</p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => markNotificationRead(notif.id)}
                  className="px-2.5 py-1 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] hover:border-[#10B981] text-[10px] text-[#10B981] rounded-lg shrink-0 transition-colors"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex overflow-x-auto gap-1 border-b border-[#24302A] pb-px text-xs font-mono font-bold tracking-wider">
        {[
          { id: 'dashboard', label: 'OVERVIEW', icon: Layers },
          { id: 'orders', label: `ORDERS & SHIPMENTS (${displayOrders.length})`, icon: Truck },
          { id: 'telemetry', label: 'SYSTEM TELEMETRY', icon: Activity },
          { id: 'installation', label: 'INSTALLATION & COC', icon: UserCheck },
          { id: 'maintenance', label: `MAINTENANCE LOG (${userTickets.length})`, icon: Wrench },
          { id: 'documents', label: 'DOCUMENT VAULT', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#141A17] text-white border-t-2 border-[#10B981] border-x border-[#24302A]'
                  : 'text-[#9EADA5] hover:text-white hover:bg-[#141A17]/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-[#6B7B73]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Key Energy Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-[#6B7B73] mb-2">
                <span className="text-[10px] uppercase font-bold">Solar Generation Today</span>
                <Sun className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="text-2xl font-extrabold text-white">28.4 kWh</div>
              <span className="text-[11px] text-[#10B981] block mt-1">R 84.50 Eskom offset today</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-[#6B7B73] mb-2">
                <span className="text-[10px] uppercase font-bold">Battery Storage (LiFePO4)</span>
                <BatteryCharging className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-2xl font-extrabold text-white">94 %</div>
              <span className="text-[11px] text-[#10B981] block mt-1">10.24 kWh • 53.4V Floating</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-[#6B7B73] mb-2">
                <span className="text-[10px] uppercase font-bold">Household Consumption</span>
                <Zap className="w-4 h-4 text-[#286D58]" />
              </div>
              <div className="text-2xl font-extrabold text-white">1.62 kW</div>
              <span className="text-[11px] text-[#10B981] block mt-1">100% Solar & Battery powered</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between text-[#6B7B73] mb-2">
                <span className="text-[10px] uppercase font-bold">SANS 10142 Compliance</span>
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-lg font-bold text-white uppercase">CoC Issued</div>
              <span className="text-[11px] text-[#9EADA5] block mt-1">Supplementary #ZA-9042</span>
            </div>
          </div>

          {/* Active Order Spotlight */}
          {primaryOrder && (
            <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Active Order & Shipment Fulfillment ({primaryOrder.id})
                    </span>
                  </div>
                  <span className="text-xs text-[#9EADA5] font-mono">
                    Placed on {primaryOrder.createdAt} • Carrier: <strong className="text-white">{primaryOrder.courierName || 'RAM Specialized Logistics'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {primaryOrder.adminApproved ? (
                    <span className="px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono font-bold rounded-lg uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved by Admin</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-[#D97706]/15 border border-[#D97706]/40 text-[#D97706] text-xs font-mono font-bold rounded-lg uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Admin Review</span>
                    </span>
                  )}

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-3 py-1 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-white text-xs font-mono rounded-lg transition-colors"
                  >
                    View All Orders
                  </button>
                </div>
              </div>

              {/* 5-Stage Live Timeline Progress Bar */}
              <div className="space-y-3 font-mono">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {stageDescriptions.map((stage, idx) => {
                    const isCompleted = (primaryOrder.currentStageIndex ?? 0) >= idx;
                    const isCurrent = (primaryOrder.currentStageIndex ?? 0) === idx;
                    const Icon = stage.icon;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                          isCurrent
                            ? 'bg-[#1B4D3E]/40 border-[#10B981] ring-2 ring-[#10B981]/30 text-white'
                            : isCompleted
                            ? 'bg-[#0E1311] border-[#286D58] text-[#10B981]'
                            : 'bg-[#0E1311] border-[#24302A] text-[#6B7B73]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px]">STAGE 0{idx + 1}</span>
                          {isCompleted && !isCurrent && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />}
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <strong className="text-[11px] leading-tight block truncate text-white">{stage.title}</strong>
                        </div>
                        <p className="text-[9px] text-[#9EADA5] line-clamp-2 leading-relaxed">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {primaryOrder.adminNotes && (
                  <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl text-xs text-[#9EADA5] flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Dispatch Notes: <strong className="text-white">{primaryOrder.adminNotes}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('telemetry')}
              className="p-5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] rounded-2xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">Live Inverter Telemetry</h4>
                <p className="text-xs text-[#9EADA5] leading-relaxed">
                  Real-time monitoring of MPPT solar yield, battery discharge cycles, and power grid health.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-[#10B981] font-semibold gap-1">
                <span>Inspect Telemetry</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="p-5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] rounded-2xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">Tax Invoices & CoC Vault</h4>
                <p className="text-xs text-[#9EADA5] leading-relaxed">
                  Download official SABS / SANS 10142-1-2 Certificate of Compliance and 15% VAT invoices.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-[#10B981] font-semibold gap-1">
                <span>View Documents</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="p-5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] rounded-2xl text-left flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4D3E]/30 border border-[#286D58] flex items-center justify-center text-[#10B981]">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">Priority Maintenance SLA</h4>
                <p className="text-xs text-[#9EADA5] leading-relaxed">
                  Schedule preventative solar panel de-soiling, battery impedance audits, and technician visits.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-[#10B981] font-semibold gap-1">
                <span>Book Service Visit</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS & SHIPMENT TRACKING (Takealot-Style Full Visibility) */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4 font-mono">
            <div>
              <h3 className="text-lg font-bold text-white uppercase">Your Hardware Orders & Delivery Pipeline</h3>
              <p className="text-xs text-[#9EADA5]">All equipment purchases, freight tracking, and turnkey installations.</p>
            </div>

            {onNavigateToShop && (
              <button
                onClick={onNavigateToShop}
                className="px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-xs font-bold uppercase rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Solar Store</span>
              </button>
            )}
          </div>

          {displayOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3 font-mono text-xs text-[#9EADA5]">
              <Package className="w-10 h-10 mx-auto text-[#6B7B73]" />
              <p className="text-sm font-bold text-white">No equipment orders found</p>
              <p>Visit our hardware store to configure an 8kW hybrid kit or battery backup system.</p>
            </div>
          ) : (
            <div className="space-y-6 font-mono text-xs">
              {displayOrders.map(order => (
                <div key={order.id} className="bg-[#141A17] border border-[#24302A] rounded-2xl overflow-hidden shadow-xl space-y-4">
                  
                  {/* Order Top Bar */}
                  <div className="p-5 bg-[#0E1311] border-b border-[#24302A] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-white font-extrabold text-sm">{order.id}</span>
                      
                      {/* Admin Approval Status Badge */}
                      {order.adminApproved ? (
                        <span className="px-2.5 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] rounded uppercase font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved by Admin</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-[#D97706]/15 border border-[#D97706]/40 text-[#D97706] text-[10px] rounded uppercase font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin Approval</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 bg-[#141A17] text-[#9EADA5] border border-[#24302A] text-[10px] rounded uppercase">
                        {order.paymentMethod.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] text-[#6B7B73]">Placed on {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-white font-bold">
                        R {order.totalCartZAR.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Tax Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Freight & Carrier Tracking Strip */}
                  <div className="px-5 py-3 bg-[#111814] border-y border-[#24302A] flex flex-wrap items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#10B981]" />
                      <span>Carrier: <strong className="text-white">{order.courierName || 'RAM Specialized Logistics'}</strong></span>
                      <span className="text-[#6B7B73]">•</span>
                      <span>Waybill: <strong className="text-[#10B981]">{order.trackingNumber || `RAM-ZA-${order.id.slice(-6)}`}</strong></span>
                    </div>
                    <div>
                      <span>Estimated Delivery: <strong className="text-white">{order.estimatedDeliveryDate || '3 Business Days'}</strong></span>
                    </div>
                  </div>

                  {/* 5-Stage Visual Progress Bar */}
                  <div className="px-5 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {stageDescriptions.map((stage, idx) => {
                        const isCompleted = (order.currentStageIndex ?? 0) >= idx;
                        const isCurrent = (order.currentStageIndex ?? 0) === idx;

                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-[10px] space-y-1 ${
                              isCurrent
                                ? 'bg-[#1B4D3E]/40 border-[#10B981] text-white'
                                : isCompleted
                                ? 'bg-[#0E1311] border-[#286D58] text-[#10B981]'
                                : 'bg-[#0E1311] border-[#24302A] text-[#6B7B73]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold">0{idx + 1}</span>
                              {isCompleted && !isCurrent && <Check className="w-3 h-3 text-[#10B981]" />}
                            </div>
                            <span className="font-bold block truncate">{stage.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Items Table */}
                  <div className="px-5 py-2 space-y-3">
                    <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Items in this shipment:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-[#24302A] last:border-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || '/hybrid-inverter-deye.jpg'}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-xl bg-[#0E1311] border border-[#24302A] shrink-0"
                          />
                          <div>
                            <strong className="text-white text-xs block">{item.productName}</strong>
                            <span className="text-[10px] text-[#9EADA5]">
                              Brand: {item.brand} • SKU: {item.sku} • Qty: {item.quantity}
                              {item.includeInstallation && (
                                <span className="text-[#10B981] ml-2 font-bold">+ Turnkey Installation Included</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">
                            R {(item.unitPriceZAR * item.quantity).toLocaleString()}
                          </span>
                          {item.includeInstallation && item.installationPriceZAR > 0 && (
                            <span className="text-[10px] text-[#10B981]">
                              + R {(item.installationPriceZAR * item.quantity).toLocaleString()} install
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 bg-[#0E1311] border-t border-[#24302A] flex flex-wrap items-center justify-between text-[11px] text-[#9EADA5] gap-2">
                    <div>
                      <span>Delivery Site: <strong className="text-white">{order.shippingAddress}, {order.city}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7B73]">Current Fulfillment Status:</span>
                      <strong className="text-[#D97706] uppercase">{order.orderStatus.replace('_', ' ')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SYSTEM TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span className="text-[10px] uppercase font-bold">SOLAR PV PRODUCTION</span>
                <Sun className="w-5 h-5 text-[#D97706]" />
              </div>
              <div className="text-3xl font-extrabold text-white">5.14 kW</div>
              <span className="text-[10px] text-[#10B981]">Today's Yield: 28.4 kWh • Peak: 5.42 kW</span>
            </div>

            <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span className="text-[10px] uppercase font-bold">LITHIUM STORAGE (SOC)</span>
                <BatteryCharging className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-3xl font-extrabold text-white">96 %</div>
              <span className="text-[10px] text-[#10B981]">Float Charging • 53.4 V • 24.2 °C</span>
            </div>

            <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span className="text-[10px] uppercase font-bold">GRID INTERCONNECTION</span>
                <Zap className="w-5 h-5 text-[#286D58]" />
              </div>
              <div className="text-3xl font-extrabold text-white">0.00 kW</div>
              <span className="text-[10px] text-[#10B981]">100% Self-Sufficient • 0kW Grid Import</span>
            </div>
          </div>

          {/* Detailed Inverter Health Table */}
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase">Inverter Firmware & Grid Compliance Diagnostics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl">
                <span className="text-[#6B7B73] block text-[10px]">Wi-Fi Logger Link:</span>
                <strong className="text-white">-56 dBm (High Quality)</strong>
              </div>
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl">
                <span className="text-[#6B7B73] block text-[10px]">IGBT Heatsink Temp:</span>
                <strong className="text-white">39.2 °C (Optimal)</strong>
              </div>
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl">
                <span className="text-[#6B7B73] block text-[10px]">Grid Sync Frequency:</span>
                <strong className="text-white">50.01 Hz (Synchronized)</strong>
              </div>
              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-xl">
                <span className="text-[#6B7B73] block text-[10px]">Self-Consumption:</span>
                <strong className="text-[#10B981]">99.1 %</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INSTALLATION & SANS 10142 COC */}
      {/* ========================================================================= */}
      {activeTab === 'installation' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase">SANS 10142-1-2 Electrical Installation Dossier</h4>
                <p className="text-[#9EADA5] text-xs">Department of Labour certified installation credentials and test report.</p>
              </div>
              <span className="px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-bold rounded-lg text-xs uppercase">
                SSEG Grid Approved
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-2">
                <span className="text-[#6B7B73] text-[10px] uppercase font-bold block">Assigned Lead Electrician</span>
                <strong className="text-white text-sm block">Master Electrician J. Botha</strong>
                <span className="text-[#10B981] text-[10px] block">DoL Wireman's Registration: #IE-88210-GP</span>
                <div className="pt-2 flex items-center gap-2">
                  <a href="tel:+27118004500" className="px-3 py-1 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-white rounded text-[10px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#10B981]" />
                    <span>Direct Call</span>
                  </a>
                  <a href="mailto:support@kinetixenergy.co.za" className="px-3 py-1 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-white rounded text-[10px] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#10B981]" />
                    <span>Email Desk</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-2">
                <span className="text-[#6B7B73] text-[10px] uppercase font-bold block">Certificate of Compliance (CoC)</span>
                <strong className="text-white text-sm block">CoC #ZA-GP-9042-2026</strong>
                <span className="text-[#9EADA5] text-[10px] block">Issued pursuant to Occupational Health & Safety Act (No. 85 of 1993)</span>
                <div className="pt-2">
                  <button
                    onClick={() => alert('Downloading official Supplementary CoC PDF...')}
                    className="px-3 py-1 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CoC PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MAINTENANCE & SERVICE SLA */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24302A] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Service SLA & Preventative Maintenance Log</h4>
                <p className="text-[#9EADA5] text-xs">Active service history, scheduled inspections, and emergency callouts.</p>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold uppercase rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Log New Service Request</span>
              </button>
            </div>

            <div className="space-y-3">
              {userTickets.map(ticket => (
                <div key={ticket.id} className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">{ticket.id} • {ticket.tier}</span>
                    <span className="text-[10px] uppercase bg-[#1B4D3E]/40 border border-[#286D58] text-[#10B981] px-2 py-0.5 rounded font-bold">
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{ticket.primaryReason}</p>
                  <p className="text-[11px] text-[#9EADA5]">{ticket.issueDetails}</p>
                  <span className="text-[10px] text-[#6B7B73] block pt-1">
                    Scheduled: {ticket.scheduledDate} • Assigned: {ticket.assignedTechnician}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DOCUMENT VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-2xl space-y-5">
            <h4 className="text-sm font-bold text-white uppercase">Downloadable Compliance Documents & Warranties</h4>
            <div className="space-y-3">
              {[
                { name: 'Supplementary Electrical Certificate of Compliance (CoC).pdf', size: '1.8 MB', date: 'August 2026', type: 'coc' },
                { name: 'Single Line Diagram (SLD) & DB Changeover Schematic.pdf', size: '2.4 MB', date: 'August 2026', type: 'diagram' },
                { name: 'Freedom Won 10-Year Manufacturer Warranty Certificate.pdf', size: '850 KB', date: 'August 2026', type: 'warranty' },
                { name: 'Deye Hybrid Inverter Factory Test & Commissioning Report.pdf', size: '1.1 MB', date: 'August 2026', type: 'test' },
                { name: 'Final Itemized Paid Tax Invoice (KX-PAY-904288).pdf', size: '420 KB', date: 'August 2026', type: 'invoice' }
              ].map((doc, idx) => (
                <div key={idx} className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl flex items-center justify-between hover:border-[#3A4D43] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#141A17] border border-[#24302A] flex items-center justify-center text-[#10B981]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-white font-bold block">{doc.name}</span>
                      <span className="text-[10px] text-[#6B7B73]">{doc.size} • Verified {doc.date}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading verified ${doc.name}...`)}
                    className="px-3.5 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: OFFICIAL TAX INVOICE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141A17] border border-[#24302A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-4">
              <div>
                <span className="text-[10px] text-[#10B981] font-bold uppercase block">Official SARS Tax Invoice</span>
                <h3 className="text-lg font-bold text-white uppercase">{selectedOrderForInvoice.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg hover:bg-[#0E1311]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#9EADA5] bg-[#0E1311] p-4 rounded-xl">
              <div>
                <strong className="text-white block uppercase">Billed To:</strong>
                <div>{selectedOrderForInvoice.customerName}</div>
                <div>{selectedOrderForInvoice.customerEmail}</div>
                <div>{selectedOrderForInvoice.shippingAddress}, {selectedOrderForInvoice.city}</div>
              </div>
              <div>
                <strong className="text-white block uppercase">Issued By:</strong>
                <div>Kinetix Energy Technologies (Pty) Ltd</div>
                <div>VAT Reg: 4890281240</div>
                <div>Sandton City Office Tower, Gauteng</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#6B7B73] uppercase font-bold block">Itemized Equipment & Services:</span>
              {selectedOrderForInvoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 border-b border-[#24302A]">
                  <div>
                    <span className="text-white font-bold">{item.quantity}x {item.productName}</span>
                    <span className="text-[10px] text-[#6B7B73] block">SKU: {item.sku}</span>
                  </div>
                  <span className="text-white font-bold">R {(item.unitPriceZAR * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#24302A] text-right">
              <div className="flex justify-between text-[#9EADA5]">
                <span>Equipment Subtotal:</span>
                <span>R {selectedOrderForInvoice.equipmentSubtotalZAR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9EADA5]">
                <span>Turnkey Installation:</span>
                <span>R {selectedOrderForInvoice.installationSubtotalZAR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9EADA5]">
                <span>VAT (15%):</span>
                <span>R {selectedOrderForInvoice.vatZAR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#D97706] pt-2 border-t border-[#24302A]">
                <span>Total Amount Paid:</span>
                <span>R {selectedOrderForInvoice.totalCartZAR.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  alert(`Downloading Tax_Invoice_${selectedOrderForInvoice.id}.pdf`);
                  setSelectedOrderForInvoice(null);
                }}
                className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REQUEST MAINTENANCE / SERVICE MODAL */}
      {/* ========================================================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141A17] border border-[#24302A] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl font-mono text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-white uppercase">Request Certified Solar Service</h3>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1.5 text-[#9EADA5] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {ticketSuccessMsg ? (
              <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-[#10B981] text-center font-bold">
                {ticketSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-[#9EADA5] uppercase text-[10px] mb-1">Reason for Service Request *</label>
                  <select
                    value={ticketReason}
                    onChange={e => setTicketReason(e.target.value)}
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white"
                  >
                    <option value="Annual Preventative Health Audit">Annual Preventative Health Audit</option>
                    <option value="Solar Panel Cleaning & Hydro-Wash">Solar Panel Cleaning & Hydro-Wash</option>
                    <option value="Battery Expansion / Secondary Tower Add-on">Battery Expansion / Secondary Tower Add-on</option>
                    <option value="Inverter Telemetry / Firmware Update">Inverter Telemetry / Firmware Update</option>
                    <option value="Supplementary SANS 10142 CoC Re-Certification">Supplementary SANS 10142 CoC Re-Certification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9EADA5] uppercase text-[10px] mb-1">Site & Equipment Notes *</label>
                  <textarea
                    required
                    rows={3}
                    value={ticketDetails}
                    onChange={e => setTicketDetails(e.target.value)}
                    placeholder="Describe any specific observations or preferred technician visit window..."
                    className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-white placeholder-[#6B7B73]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 bg-[#0E1311] hover:bg-[#1B2420] border border-[#24302A] text-[#9EADA5] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-bold uppercase rounded-lg"
                  >
                    Submit Service Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
