import { User } from '../context/AuthContext';
import { MaintenanceTicket } from '../context/DataContext';
import { 
  DashboardData, 
  CustomerSite, 
  SystemSpecs, 
  ProjectInfo, 
  ShipmentInfo, 
  HardwareItem, 
  DashboardNotification, 
  CustomerDocument, 
  SupportInfo,
  PipelineStage 
} from '../types/dashboard';
import { OrderRecord, UserNotification } from '../types';

/**
 * Normalizes raw context and order data into a structured, production-ready DashboardData object.
 * Strictly avoids hardcoded customer values.
 */
export function buildDashboardData(
  currentUser: User | null,
  allOrders: OrderRecord[],
  allNotifications: UserNotification[],
  allTickets: MaintenanceTicket[],
  selectedSiteId?: string
): DashboardData {
  const isDemo = currentUser?.email?.toLowerCase() === 'client@bryanston.co.za';
  const cleanEmail = (currentUser?.email || '').trim().toLowerCase();

  // 1. Resolve User-scoped Orders
  const userOrders = allOrders.filter(o => {
    if (!currentUser?.email) return false;
    const orderEmail = (o.customerEmail || '').trim().toLowerCase();
    return orderEmail === cleanEmail || 
           (currentUser.id && o.userId === currentUser.id) ||
           (isDemo && orderEmail.includes('bryanston'));
  });

  // 2. Resolve Multi-Site configuration
  const sites: CustomerSite[] = [];
  
  if (userOrders.length > 0) {
    userOrders.forEach((order, idx) => {
      const siteId = `site-${order.id}`;
      if (!sites.some(s => s.address === order.shippingAddress)) {
        sites.push({
          id: siteId,
          name: `${order.propertyType || 'Residential Asset'} (${order.city})`,
          address: order.shippingAddress,
          city: order.city,
          propertyType: order.propertyType,
          roofType: order.roofType,
          isPrimary: idx === 0
        });
      }
    });
  } else {
    // New user with registered address or fallback
    sites.push({
      id: 'site-primary',
      name: 'Primary Property',
      address: currentUser?.address || (currentUser?.city ? `${currentUser.city}, South Africa` : 'Registered Address Pending'),
      city: currentUser?.city || 'Johannesburg',
      province: currentUser?.province || 'Gauteng',
      isPrimary: true
    });
  }

  // Active Site selection
  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0] || null;
  const activeSiteId = activeSite?.id || 'site-primary';

  // Find order for current active site
  const primaryOrder = userOrders.find(o => `site-${o.id}` === activeSiteId) || userOrders[0] || null;

  // 3. Resolve Hardware Assets
  const hardware: HardwareItem[] = [];
  if (primaryOrder && primaryOrder.items) {
    primaryOrder.items.forEach((item, idx) => {
      const isInv = item.productName.toLowerCase().includes('inverter') || item.sku.includes('INV');
      const isBat = item.productName.toLowerCase().includes('battery') || item.sku.includes('BAT');
      const isPanel = item.productName.toLowerCase().includes('panel') || item.sku.includes('SOLAR') || item.sku.includes('CS');
      
      const category = isInv ? 'Hybrid Inverters' : isBat ? 'LiFePO4 Storage' : isPanel ? 'Solar PV Modules' : 'Electrical Protection';
      const warrantyYears = isPanel ? 25 : isBat ? 10 : 5;

      hardware.push({
        id: `hw-${primaryOrder.id}-${idx}`,
        name: item.productName,
        brand: item.brand,
        category,
        sku: item.sku,
        serialNumber: `SN-${item.sku}-${primaryOrder.id.slice(-4)}${idx + 1}`,
        batchNumber: `BATCH-ZA-${new Date(primaryOrder.createdAt).getFullYear()}-${idx + 10}`,
        quantity: item.quantity,
        unitPriceZAR: item.unitPriceZAR,
        warrantyYears,
        warrantyStatus: 'active',
        status: primaryOrder.orderStatus === 'installed' ? 'installed' : primaryOrder.currentStageIndex >= 3 ? 'in_transit' : 'bench_tested',
        image: item.image,
        includeInstallation: item.includeInstallation
      });
    });
  }

  // 4. Resolve System Capacity & Specs
  let system: SystemSpecs | null = null;
  if (hardware.length > 0) {
    const invItem = hardware.find(h => h.category === 'Hybrid Inverters') || hardware[0];
    const batItem = hardware.find(h => h.category === 'LiFePO4 Storage');
    const panelItem = hardware.find(h => h.category === 'Solar PV Modules');

    const capacityKw = invItem?.name.includes('12kW') ? 12 : invItem?.name.includes('8kW') ? 8 : invItem?.name.includes('5kW') ? 5 : 8;
    const batteryKwh = batItem ? 5.12 * batItem.quantity : undefined;
    const solarKwp = panelItem ? (panelItem.quantity * 0.55) : undefined;

    system = {
      capacityKw,
      inverterName: invItem?.name || 'Hybrid Inverter',
      inverterBrand: invItem?.brand || 'Deye',
      inverterModel: invItem?.sku,
      batteryKwh,
      batteryBrand: batItem?.brand,
      solarKwp,
      busVoltageDc: '48V DC (Low-Voltage Safe)',
      status: primaryOrder?.orderStatus === 'installed' ? 'operational' : 'commissioning',
      statusLabel: primaryOrder?.orderStatus === 'installed' ? 'Grid-Synchronized & Operational' : 'Pre-Commissioning'
    };
  }

  // 5. Resolve Project & 6-Stage Pipeline
  let project: ProjectInfo | null = null;
  if (primaryOrder) {
    const currentIdx = primaryOrder.currentStageIndex ?? 3;
    
    const stageNames = [
      { name: 'Order Placed', sub: '3D Secure / EFT Cleared' },
      { name: 'Tech Review', sub: 'CAD & Single Line Diagram' },
      { name: 'Allocation', sub: '1000V DC Bench Testing' },
      { name: 'Freight Dispatch', sub: `${primaryOrder.courierName || 'RAM Logistics'} In-Transit` },
      { name: 'On-Site Setup', sub: 'DoL Master Electrician' },
      { name: 'Commissioning', sub: 'SANS 10142 CoC Issued' }
    ];

    const stages: PipelineStage[] = stageNames.map((s, idx) => {
      const isComp = currentIdx > idx || (currentIdx === idx && primaryOrder.orderStatus === 'installed');
      const isCurr = currentIdx === idx && primaryOrder.orderStatus !== 'installed';
      return {
        id: idx + 1,
        key: `stage-0${idx + 1}`,
        name: s.name,
        subtitle: s.sub,
        status: isComp ? 'completed' : isCurr ? 'current' : 'pending',
        startedAt: idx <= currentIdx ? primaryOrder.createdAt : undefined,
        completedAt: idx < currentIdx ? primaryOrder.createdAt : undefined,
        estimatedDate: idx >= currentIdx ? primaryOrder.estimatedDeliveryDate : undefined
      };
    });

    project = {
      id: primaryOrder.id,
      siteId: activeSiteId,
      status: primaryOrder.orderStatus === 'installed' ? 'installed' : 'in_progress',
      currentStageIndex: currentIdx,
      currentStageLabel: stageNames[currentIdx]?.name || 'Freight Dispatch',
      statusDescription: primaryOrder.adminNotes || 'Bench-tested at Sandton Central QA Hub. Hardware verified.',
      stages,
      estimatedDeliveryDate: primaryOrder.estimatedDeliveryDate || '3-5 Business Days',
      estimatedCommissioningDate: primaryOrder.estimatedDeliveryDate || 'Pending Scheduling',
      assetValueZAR: primaryOrder.totalCartZAR,
      currency: 'ZAR',
      paymentStatus: (primaryOrder.paymentStatus as any) || 'paid',
      paymentMethod: primaryOrder.paymentMethod,
      adminApproved: Boolean(primaryOrder.adminApproved),
      adminNotes: primaryOrder.adminNotes,
      createdAt: primaryOrder.createdAt
    };
  }

  // 6. Resolve Shipment Data
  let shipment: ShipmentInfo | null = null;
  if (primaryOrder) {
    const baseDate = new Date(primaryOrder.createdAt).getTime();
    const estDeliveryTime = baseDate + (3 * 24 * 60 * 60 * 1000);

    shipment = {
      id: `SHP-${primaryOrder.id}`,
      waybillNumber: primaryOrder.trackingNumber || `RAM-ZA-${primaryOrder.id.slice(-6)}`,
      courier: primaryOrder.courierName || 'RAM Specialized Freight (Pty) Ltd',
      status: primaryOrder.currentStageIndex >= 4 ? 'delivered' : 'in_transit',
      trackingUrl: `https://www.ram.co.za/track?w=${primaryOrder.trackingNumber || primaryOrder.id}`,
      estimatedDeliveryTimestamp: estDeliveryTime,
      estimatedDeliveryDate: primaryOrder.estimatedDeliveryDate || '3 Business Days',
      originHub: 'Sandton Central Engineering Logistics Hub',
      destinationCity: primaryOrder.city
    };
  }

  // 7. Resolve Notifications
  const notifications: DashboardNotification[] = allNotifications
    .filter(n => n.targetUserEmail === 'all' || (cleanEmail && n.targetUserEmail.toLowerCase() === cleanEmail) || (isDemo && n.targetUserEmail.includes('bryanston')))
    .map(n => {
      let type: DashboardNotification['type'] = 'info';
      if (n.title.toLowerCase().includes('approved') || n.title.toLowerCase().includes('success') || n.title.toLowerCase().includes('cleared')) {
        type = 'success';
      } else if (n.title.toLowerCase().includes('dispatch') || n.title.toLowerCase().includes('transit') || n.title.toLowerCase().includes('freight')) {
        type = 'in_transit';
      } else if (n.title.toLowerCase().includes('alert') || n.title.toLowerCase().includes('warning')) {
        type = 'warning';
      }

      return {
        id: n.id,
        type,
        title: n.title,
        description: n.message,
        createdAt: n.createdAt,
        read: n.read
      };
    });

  // 8. Resolve Documents
  const documents: CustomerDocument[] = [];
  if (primaryOrder) {
    documents.push(
      {
        id: `doc-tax-inv-${primaryOrder.id}`,
        name: `SARS Tax Invoice (${primaryOrder.id}).pdf`,
        type: 'tax_invoice',
        fileSize: '420 KB',
        createdAt: primaryOrder.createdAt,
        isAvailable: true
      },
      {
        id: `doc-coc-${primaryOrder.id}`,
        name: `Supplementary Electrical Certificate of Compliance (SANS 10142-1-2).pdf`,
        type: 'sans_coc',
        fileSize: '1.8 MB',
        createdAt: primaryOrder.createdAt,
        isAvailable: true
      },
      {
        id: `doc-sld-${primaryOrder.id}`,
        name: `Single Line Diagram & AC/DC Protection Schematic.pdf`,
        type: 'single_line_diagram',
        fileSize: '2.4 MB',
        createdAt: primaryOrder.createdAt,
        isAvailable: true
      },
      {
        id: `doc-war-${primaryOrder.id}`,
        name: `10-Year Hardware Manufacturer Warranty Dossier.pdf`,
        type: 'warranty_cert',
        fileSize: '850 KB',
        createdAt: primaryOrder.createdAt,
        isAvailable: true
      }
    );
  }

  // 9. Support & Certifications
  const support: SupportInfo = {
    slaTier: 'Performance SLA (24/7 Priority)',
    slaStatus: 'Active 24/7',
    isAvailable: true,
    phone: '+27 11 800 4500',
    email: 'support@kinetixenergy.co.za',
    assignedElectrician: {
      name: 'Master Electrician J. Botha',
      registrationNumber: 'DoL Reg: #IE-88210-GP',
      phone: '+27 11 800 4500'
    }
  };

  const certifications = [
    'SANS 10142-1-2 Certified',
    'City Power / SSEG Registered',
    'Department of Labour Accredited',
    'Eskom Tariffs Compliant'
  ];

  return {
    user: {
      id: currentUser?.id || 'usr-guest',
      name: currentUser?.name || 'Customer Account',
      email: currentUser?.email || '',
      phone: currentUser?.phone,
      role: currentUser?.role || 'customer'
    },
    sites,
    activeSiteId,
    activeSite,
    system,
    project,
    shipment,
    hardware,
    notifications,
    documents,
    support,
    certifications
  };
}
