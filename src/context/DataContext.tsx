import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_CATALOG, SAMPLE_PROJECT_RECORDS, MAINTENANCE_PACKAGES } from '../data/mockData';
import { 
  Product, 
  ProjectRecord, 
  OrderRecord, 
  InstallationBooking, 
  CommercialLead,
  ContactEnquiry,
  UserNotification
} from '../types';

export interface MaintenanceTicket {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  siteAddress: string;
  city: string;
  tier: string;
  inverterBrand: string;
  systemAge: string;
  primaryReason: string;
  issueDetails: string;
  status: 'pending' | 'dispatched' | 'in_progress' | 'resolved';
  assignedTechnician?: string;
  scheduledDate?: string;
  createdAt: string;
}

export interface LeadQuote {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  suburb: string;
  province: string;
  propertyType: string;
  monthlyBillZAR: number;
  recommendedInverterKw: number;
  recommendedBatteryKwh: number;
  recommendedSolarKwp: number;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'won';
}

export interface SiteContentSection {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
}

interface DataContextType {
  products: Product[];
  projects: Record<string, ProjectRecord>;
  orders: OrderRecord[];
  installationBookings: InstallationBooking[];
  commercialLeads: CommercialLead[];
  maintenanceTickets: MaintenanceTicket[];
  leadsQuotes: LeadQuote[];
  contactEnquiries: ContactEnquiry[];
  userNotifications: UserNotification[];
  siteContent: Record<string, SiteContentSection>;
  
  // Product actions (Full Admin Store Management)
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions (Takealot Core)
  createOrder: (orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'orderStatus' | 'currentStageIndex'>) => string;
  updateOrderStatus: (orderId: string, status: OrderRecord['orderStatus'], stageIndex?: number, trackingData?: Partial<OrderRecord>) => void;
  deleteOrder: (orderId: string) => void;
  
  // Booking & Commercial actions
  createInstallationBooking: (data: Omit<InstallationBooking, 'id' | 'createdAt' | 'status'>) => string;
  updateInstallationBookingStatus: (bookingId: string, status: InstallationBooking['status']) => void;
  deleteInstallationBooking: (bookingId: string) => void;
  
  createCommercialLead: (data: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>) => string;
  updateCommercialLeadStatus: (leadId: string, status: CommercialLead['status']) => void;
  deleteCommercialLead: (leadId: string) => void;
  
  // Project tracking actions
  updateProjectStage: (orderId: string, stageIndex: number) => void;
  assignTechnician: (orderId: string, name: string, cert: string) => void;
  
  // Maintenance actions
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], tech?: string) => void;
  createMaintenanceTicket: (data: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => string;
  deleteMaintenanceTicket: (ticketId: string) => void;
  
  // Lead actions
  addLeadQuote: (data: Omit<LeadQuote, 'id' | 'createdAt' | 'status'>) => string;
  updateLeadStatus: (leadId: string, status: LeadQuote['status']) => void;
  deleteLeadQuote: (leadId: string) => void;
  
  // Contact Enquiries
  createContactEnquiry: (data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>) => string;
  updateContactEnquiryStatus: (id: string, status: ContactEnquiry['status'], replyNotes?: string) => void;
  deleteContactEnquiry: (id: string) => void;
  
  // Notifications & Customer Communication
  sendNotification: (data: Omit<UserNotification, 'id' | 'createdAt' | 'read'>) => string;
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // CMS Content actions
  updateSiteContent: (key: string, data: Partial<SiteContentSection>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SITE_CONTENT: Record<string, SiteContentSection> = {
  hero: {
    title: 'Smarter Energy. Built for Real Life.',
    subtitle: 'From load-shedding resilience to complete off-grid independence, we engineer reliable solar solutions tailored to your energy needs.',
    imageUrl: '/hero-solar-home.jpg',
    buttonText: 'Get a Solar Quote',
    buttonLink: 'configurator'
  },
  solution_residential: {
    title: 'Residential Solar Solutions',
    subtitle: 'Greater energy independence for suburban households and townhouses.',
    imageUrl: '/hero-solar-home.jpg'
  },
  solution_commercial: {
    title: 'Commercial & Industrial 3-Phase',
    subtitle: 'Operational cost reduction, generator fuel savings, and Section 12B tax relief.',
    imageUrl: '/commercial-solar-sa.jpg'
  },
  solution_agricultural: {
    title: 'Agricultural & Vineyard Microgrids',
    subtitle: 'Off-grid agrivoltaics and cold storage resilience for farms and packhouses.',
    imageUrl: '/solar-farm-agricultural.jpg'
  },
  solution_upgrades: {
    title: 'System Upgrades & DB Rewiring',
    subtitle: 'Expand existing inverters with secondary batteries and SANS 10142 re-certification.',
    imageUrl: '/electrician-wiring-db.jpg'
  }
};

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'KX-PAY-904288',
    userId: 'usr-client-01',
    customerName: 'Bryanston Residential Client',
    customerEmail: 'client@bryanston.co.za',
    customerPhone: '+27 82 456 7890',
    shippingAddress: '14 Protea Avenue, Bryanston',
    city: 'Johannesburg',
    propertyType: 'Residential Single Family',
    roofType: 'Concrete Tile (30° Pitch)',
    items: [
      {
        productId: 'deye-8kw-hybrid',
        productName: 'Deye 8kW Hybrid Inverter (SUN-8K-SG01LP1)',
        brand: 'Deye',
        sku: 'INV-DEYE-8K-SG01',
        image: '/hybrid-inverter-deye.jpg',
        quantity: 1,
        unitPriceZAR: 28999,
        includeInstallation: true,
        installationPriceZAR: 8500
      },
      {
        productId: 'dyness-5-12kwh',
        productName: 'Dyness 5.12kWh BX51100 LiFePO4 Battery Module',
        brand: 'Dyness',
        sku: 'BAT-DYN-51100',
        image: '/lithium-battery-etower.jpg',
        quantity: 2,
        unitPriceZAR: 21499,
        includeInstallation: true,
        installationPriceZAR: 3200
      }
    ],
    equipmentSubtotalZAR: 71997,
    installationSubtotalZAR: 14900,
    vatZAR: 13034.55,
    totalCartZAR: 99931.55,
    paymentMethod: 'instant_eft',
    selectedBank: 'Capitec Pay',
    paymentStatus: 'completed',
    orderStatus: 'installed',
    currentStageIndex: 3,
    courierName: 'RAM Specialized Freight (Pty) Ltd',
    trackingNumber: 'RAM-KX-904288ZA',
    estimatedDeliveryDate: '2026-08-25',
    adminApproved: true,
    adminNotes: 'Bench-tested at Sandton Central Hub. Passed 1000V DC isolation and firmware checks.',
    createdAt: '2026-08-22'
  },
  {
    id: 'KX-PAY-810520',
    userId: 'usr-client-02',
    customerName: 'Camps Bay Design Studio',
    customerEmail: 'owner@campsbaystudio.co.za',
    customerPhone: '+27 83 123 9988',
    shippingAddress: '22 Victoria Road, Camps Bay',
    city: 'Cape Town',
    propertyType: 'Commercial Studio',
    roofType: 'Corrugated Klip-Lok',
    items: [
      {
        productId: 'sunsynk-12kw-3phase',
        productName: 'Sunsynk 12kW 3-Phase Hybrid Inverter',
        brand: 'Sunsynk',
        sku: 'INV-SUN-12K-3P',
        image: '/hybrid-inverter-deye.jpg',
        quantity: 1,
        unitPriceZAR: 54999,
        includeInstallation: true,
        installationPriceZAR: 12500
      }
    ],
    equipmentSubtotalZAR: 54999,
    installationSubtotalZAR: 12500,
    vatZAR: 10124.85,
    totalCartZAR: 77623.85,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    orderStatus: 'bench_testing',
    currentStageIndex: 1,
    createdAt: '2026-08-25'
  }
];

const INITIAL_INSTALL_BOOKINGS: InstallationBooking[] = [
  {
    id: 'KX-INST-9140',
    clientName: 'Sarah Jenkins',
    email: 'sarah.j@mweb.co.za',
    phone: '+27 84 555 9012',
    address: '88 Waterfall Estate Drive',
    city: 'Midrand, Gauteng',
    targetDate: '2026-09-05',
    roofType: 'Slate Tile',
    phaseConnection: '3-Phase (400V, 80A)',
    dbLocation: 'Double Garage',
    specialAccess: 'Estate security gate clearance required.',
    status: 'site_visit_scheduled',
    createdAt: '2026-08-24'
  }
];

const INITIAL_COMMERCIAL_LEADS: CommercialLead[] = [
  {
    id: 'KX-COMM-8201',
    companyName: 'Bredasdorp Agrivoltaics Cooperative',
    industrySector: 'Agriculture & Cold Storage',
    monthlySpend: 'R 85,000 – R 140,000 / month',
    peakKva: '250 kVA – 500 kVA',
    dieselMonthly: 'R 45,000 / month',
    taxSection12b: true,
    contactName: 'Dirk van der Merwe',
    designation: 'Managing Director',
    email: 'dirk@bredasdorpfarming.co.za',
    phone: '+27 82 777 3412',
    locationCity: 'Overberg, Western Cape',
    status: 'audit_booked',
    createdAt: '2026-08-23'
  }
];

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'KX-SRV-8941',
    clientName: 'Bryanston Residential Client',
    clientEmail: 'client@bryanston.co.za',
    clientPhone: '+27 82 456 7890',
    siteAddress: '14 Protea Avenue, Bryanston',
    city: 'Johannesburg',
    tier: 'Performance SLA (Quarterly)',
    inverterBrand: 'Deye 8kW Hybrid',
    systemAge: '1 Year',
    primaryReason: 'Annual SANS 10142 Health Audit & Thermal Scan',
    issueDetails: 'Preventative check before winter high peak tariff period.',
    status: 'in_progress',
    assignedTechnician: 'Master Electrician J. Botha',
    scheduledDate: '28 Aug 2026',
    createdAt: '2026-08-20'
  },
  {
    id: 'KX-SRV-7712',
    clientName: 'Camps Bay Commercial Studio',
    clientEmail: 'owner@campsbaystudio.co.za',
    clientPhone: '+27 83 123 9988',
    siteAddress: '22 Victoria Road, Camps Bay',
    city: 'Cape Town',
    tier: 'Complete Asset Protection',
    inverterBrand: 'Sunsynk 12kW 3-Phase',
    systemAge: '2 Years',
    primaryReason: 'Panel De-soiling & Hydro-Wash',
    issueDetails: 'Coastal salt mist film reduction on roof panels.',
    status: 'dispatched',
    assignedTechnician: 'Senior Solar Tech D. Visser',
    scheduledDate: '30 Aug 2026',
    createdAt: '2026-08-22'
  }
];

const INITIAL_LEADS: LeadQuote[] = [
  {
    id: 'KX-Q-904218',
    fullName: 'Werner van Zyl',
    email: 'werner@vanzyl.co.za',
    phone: '+27 82 999 1234',
    suburb: 'Constantia',
    province: 'Western Cape',
    propertyType: 'Residential Luxury Villa',
    monthlyBillZAR: 8500,
    recommendedInverterKw: 12,
    recommendedBatteryKwh: 15.36,
    recommendedSolarKwp: 9.8,
    createdAt: '2026-08-24',
    status: 'new'
  },
  {
    id: 'KX-Q-881203',
    fullName: 'Thabo Mokoena',
    email: 'thabo@mokoena-holdings.co.za',
    phone: '+27 83 555 4321',
    suburb: 'Midrand',
    province: 'Gauteng',
    propertyType: 'Commercial Warehouse',
    monthlyBillZAR: 45000,
    recommendedInverterKw: 50,
    recommendedBatteryKwh: 60,
    recommendedSolarKwp: 45,
    createdAt: '2026-08-23',
    status: 'contacted'
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => {
          const defaultProd = PRODUCTS_CATALOG.find(dp => dp.id === p.id);
          if (defaultProd && defaultProd.image) {
            return { ...p, image: defaultProd.image };
          }
          return p;
        });
      }
      return PRODUCTS_CATALOG;
    } catch {
      return PRODUCTS_CATALOG;
    }
  });

  const [projects, setProjects] = useState<Record<string, ProjectRecord>>(() => {
    try {
      const saved = localStorage.getItem('kinetix_projects');
      return saved ? JSON.parse(saved) : SAMPLE_PROJECT_RECORDS;
    } catch {
      return SAMPLE_PROJECT_RECORDS;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [installationBookings, setInstallationBookings] = useState<InstallationBooking[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_install_bookings');
      return saved ? JSON.parse(saved) : INITIAL_INSTALL_BOOKINGS;
    } catch {
      return INITIAL_INSTALL_BOOKINGS;
    }
  });

  const [commercialLeads, setCommercialLeads] = useState<CommercialLead[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_commercial_leads');
      return saved ? JSON.parse(saved) : INITIAL_COMMERCIAL_LEADS;
    } catch {
      return INITIAL_COMMERCIAL_LEADS;
    }
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_tickets');
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [leadsQuotes, setLeadsQuotes] = useState<LeadQuote[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_enquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'KX-ENQ-8192',
          name: 'Sipho Ndlovu',
          email: 'sipho.ndlovu@outlook.com',
          phone: '+27 82 555 7711',
          subject: '3-Phase Inverter Compatibility for Waterfall Estate',
          message: 'Good day, I have an existing borehole pump (3.5kW 3-Phase). Can your Sunsynk 12kW inverter handle the inductive starting surge with 2x Freedom Won batteries?',
          status: 'new',
          createdAt: '2026-08-27'
        },
        {
          id: 'KX-ENQ-7720',
          name: 'Helena Marais',
          email: 'helena@marais-arch.co.za',
          phone: '+27 83 222 9900',
          subject: 'Architectural Flush Solar Roof Mounts',
          message: 'Hi Kinetix team, we are designing a residential home in Franschhoek and require black-framed bi-facial panels with hidden cable trays. Please send spec sheets.',
          status: 'reviewed',
          replyNotes: 'Technical datasheets dispatched via email.',
          createdAt: '2026-08-26'
        }
      ];
    } catch {
      return [];
    }
  });

  const [userNotifications, setUserNotifications] = useState<UserNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_notifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'NOTIF-101',
          targetUserEmail: 'all',
          title: 'Spring Solar Yield Optimization Audit Window Open',
          message: 'Prepare your solar PV array for peak spring generation with our complimentary inverter diagnostic scan.',
          type: 'general',
          read: false,
          sender: 'Kinetix Engineering Desk',
          createdAt: '2026-08-25'
        },
        {
          id: 'NOTIF-102',
          targetUserEmail: 'client@bryanston.co.za',
          targetUserName: 'Bryanston Residential Client',
          title: 'Hardware Allocation & Bench-Testing Complete',
          message: 'Your 8kW Deye inverter and Freedom Won eTower modules have passed 1000V DC bench testing and are staged for freight dispatch.',
          type: 'order',
          read: false,
          sender: 'Sandton Logistics Hub',
          createdAt: '2026-08-26'
        }
      ];
    } catch {
      return [];
    }
  });

  const [siteContent, setSiteContent] = useState<Record<string, SiteContentSection>>(() => {
    try {
      const saved = localStorage.getItem('kinetix_site_content');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kinetix_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kinetix_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('kinetix_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kinetix_install_bookings', JSON.stringify(installationBookings));
  }, [installationBookings]);

  useEffect(() => {
    localStorage.setItem('kinetix_commercial_leads', JSON.stringify(commercialLeads));
  }, [commercialLeads]);

  useEffect(() => {
    localStorage.setItem('kinetix_tickets', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('kinetix_leads', JSON.stringify(leadsQuotes));
  }, [leadsQuotes]);

  useEffect(() => {
    localStorage.setItem('kinetix_enquiries', JSON.stringify(contactEnquiries));
  }, [contactEnquiries]);

  useEffect(() => {
    localStorage.setItem('kinetix_notifications', JSON.stringify(userNotifications));
  }, [userNotifications]);

  useEffect(() => {
    localStorage.setItem('kinetix_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('kinetix_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kinetix_install_bookings', JSON.stringify(installationBookings));
  }, [installationBookings]);

  useEffect(() => {
    localStorage.setItem('kinetix_commercial_leads', JSON.stringify(commercialLeads));
  }, [commercialLeads]);

  useEffect(() => {
    localStorage.setItem('kinetix_tickets', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('kinetix_leads', JSON.stringify(leadsQuotes));
  }, [leadsQuotes]);

  useEffect(() => {
    localStorage.setItem('kinetix_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  // Product Actions
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Order Actions (Takealot Core)
  const createOrder = (orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'orderStatus' | 'currentStageIndex'>): string => {
    const newOrderId = `KX-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estDateString = estDate.toISOString().split('T')[0];

    const newOrder: OrderRecord = {
      ...orderData,
      id: newOrderId,
      paymentStatus: 'completed',
      orderStatus: 'hardware_reserved',
      currentStageIndex: 0,
      courierName: 'RAM Specialized Solar Logistics (Pty) Ltd',
      trackingNumber: `RAM-ZA-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDeliveryDate: estDateString,
      adminApproved: false,
      adminNotes: 'Order received. Awaiting dispatch manager technical approval.',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Save to orders array
    setOrders(prev => [newOrder, ...prev]);

    // Also register in projects tracker so the customer can immediately track milestones
    const newProjectRecord: ProjectRecord = {
      orderId: newOrderId,
      customerName: orderData.customerName,
      location: `${orderData.city}, South Africa`,
      systemSummary: orderData.items.map(i => `${i.quantity}x ${i.productName}`).join(' + '),
      currentStageIndex: 0,
      installationDate: estDateString,
      assignedTechnician: {
        name: 'Master Electrician J. Botha',
        leadCert: 'DoL / SANS 10142 #88210',
        contactPlaceholder: '+27 11 800 4500'
      },
      stages: [
        { id: 0, key: 'order-received', title: 'Order Received & Hardware Reserved', description: 'Equipment allocated at Sandton Logistics hub.', completed: true, current: true, date: new Date().toISOString().split('T')[0] },
        { id: 1, key: 'equipment-prep', title: 'Equipment Bench-Testing & Prep', description: 'Inverter firmware flashed and battery impedance tested.', completed: false, current: false },
        { id: 2, key: 'install-scheduled', title: 'Installation Scheduled (DoL Certified)', description: 'Master Electrician allocated for site execution.', completed: false, current: false },
        { id: 3, key: 'install-progress', title: 'Installation in Progress on Site', description: 'Mounting rails, DC cabling, and inverter mounted.', completed: false, current: false },
        { id: 4, key: 'commissioned', title: 'System Commissioned & Telemetry Live', description: 'Live telemetry synced with cloud monitoring portal.', completed: false, current: false },
        { id: 5, key: 'completed', title: 'Completed & CoC Handover Issued', description: 'SANS 10142-1-2 Certificate of Compliance signed.', completed: false, current: false }
      ],
      documents: [
        { name: `Tax_Invoice_${newOrderId}.pdf`, type: 'invoice', date: new Date().toISOString().split('T')[0], size: '1.2 MB' },
        { name: 'System_SLD_Schematic_Draft.pdf', type: 'diagram', date: new Date().toISOString().split('T')[0], size: '850 KB' }
      ]
    };

    setProjects(prev => ({
      ...prev,
      [newOrderId]: newProjectRecord
    }));

    return newOrderId;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderRecord['orderStatus'], 
    stageIndex?: number,
    trackingData?: Partial<OrderRecord>
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const nextStage = stageIndex !== undefined ? stageIndex : o.currentStageIndex;
        const isApproved = nextStage >= 1 || (trackingData?.adminApproved ?? o.adminApproved ?? false);
        return {
          ...o,
          ...trackingData,
          orderStatus: status,
          currentStageIndex: nextStage,
          adminApproved: isApproved,
          adminNotes: trackingData?.adminNotes || o.adminNotes || (isApproved ? 'Approved by Admin Engineering Desk' : 'Pending dispatch review')
        };
      }
      return o;
    }));

    if (stageIndex !== undefined) {
      updateProjectStage(orderId, stageIndex);
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setProjects(prev => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
  };

  // Booking & Commercial Actions
  const createInstallationBooking = (data: Omit<InstallationBooking, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `KX-INST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: InstallationBooking = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInstallationBookings(prev => [newBooking, ...prev]);
    return newId;
  };

  const updateInstallationBookingStatus = (bookingId: string, status: InstallationBooking['status']) => {
    setInstallationBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const deleteInstallationBooking = (bookingId: string) => {
    setInstallationBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const createCommercialLead = (data: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `KX-COMM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: CommercialLead = {
      ...data,
      id: newId,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCommercialLeads(prev => [newLead, ...prev]);
    return newId;
  };

  const updateCommercialLeadStatus = (leadId: string, status: CommercialLead['status']) => {
    setCommercialLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  const deleteCommercialLead = (leadId: string) => {
    setCommercialLeads(prev => prev.filter(l => l.id !== leadId));
  };

  // Project Stage Actions
  const updateProjectStage = (orderId: string, stageIndex: number) => {
    setProjects(prev => {
      const project = prev[orderId];
      if (!project) return prev;

      const updatedStages = project.stages.map((stage, idx) => ({
        ...stage,
        completed: idx <= stageIndex,
        current: idx === stageIndex
      }));

      return {
        ...prev,
        [orderId]: {
          ...project,
          currentStageIndex: stageIndex,
          stages: updatedStages
        }
      };
    });
  };

  const assignTechnician = (orderId: string, name: string, cert: string) => {
    setProjects(prev => {
      const project = prev[orderId];
      if (!project) return prev;

      return {
        ...prev,
        [orderId]: {
          ...project,
          assignedTechnician: {
            ...project.assignedTechnician,
            name,
            leadCert: cert
          }
        }
      };
    });
  };

  // Maintenance Actions
  const updateTicketStatus = (ticketId: string, status: MaintenanceTicket['status'], tech?: string) => {
    setMaintenanceTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status, ...(tech ? { assignedTechnician: tech } : {}) } : t))
    );
  };

  const createMaintenanceTicket = (data: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `KX-SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: MaintenanceTicket = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMaintenanceTickets(prev => [newTicket, ...prev]);
    return newId;
  };

  const deleteMaintenanceTicket = (ticketId: string) => {
    setMaintenanceTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  // Lead Actions
  const addLeadQuote = (data: Omit<LeadQuote, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `KX-Q-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLead: LeadQuote = {
      ...data,
      id: newId,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeadsQuotes(prev => [newLead, ...prev]);
    return newId;
  };

  const updateLeadStatus = (leadId: string, status: LeadQuote['status']) => {
    setLeadsQuotes(prev => prev.map(l => (l.id === leadId ? { ...l, status } : l)));
  };

  const deleteLeadQuote = (leadId: string) => {
    setLeadsQuotes(prev => prev.filter(l => l.id !== leadId));
  };

  // Contact Enquiries Actions
  const createContactEnquiry = (data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `KX-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: ContactEnquiry = {
      ...data,
      id: newId,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContactEnquiries(prev => [newEnquiry, ...prev]);
    return newId;
  };

  const updateContactEnquiryStatus = (id: string, status: ContactEnquiry['status'], replyNotes?: string) => {
    setContactEnquiries(prev => prev.map(e => e.id === id ? { ...e, status, ...(replyNotes ? { replyNotes } : {}) } : e));
  };

  const deleteContactEnquiry = (id: string) => {
    setContactEnquiries(prev => prev.filter(e => e.id !== id));
  };

  // Notifications & Customer Communication
  const sendNotification = (data: Omit<UserNotification, 'id' | 'createdAt' | 'read'>): string => {
    const newId = `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif: UserNotification = {
      ...data,
      id: newId,
      read: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUserNotifications(prev => [newNotif, ...prev]);
    return newId;
  };

  const markNotificationRead = (id: string) => {
    setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setUserNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Content Actions
  const updateSiteContent = (key: string, data: Partial<SiteContentSection>) => {
    setSiteContent(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || DEFAULT_SITE_CONTENT[key] || { title: '', subtitle: '', imageUrl: '' }),
        ...data
      }
    }));
  };

  const resetToDefaults = () => {
    setProducts(PRODUCTS_CATALOG);
    setProjects(SAMPLE_PROJECT_RECORDS);
    setOrders(INITIAL_ORDERS);
    setInstallationBookings(INITIAL_INSTALL_BOOKINGS);
    setCommercialLeads(INITIAL_COMMERCIAL_LEADS);
    setMaintenanceTickets(INITIAL_TICKETS);
    setLeadsQuotes(INITIAL_LEADS);
    setSiteContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem('kinetix_products');
    localStorage.removeItem('kinetix_projects');
    localStorage.removeItem('kinetix_orders');
    localStorage.removeItem('kinetix_install_bookings');
    localStorage.removeItem('kinetix_commercial_leads');
    localStorage.removeItem('kinetix_tickets');
    localStorage.removeItem('kinetix_leads');
    localStorage.removeItem('kinetix_enquiries');
    localStorage.removeItem('kinetix_notifications');
    localStorage.removeItem('kinetix_site_content');
  };

  return (
    <DataContext.Provider
      value={{
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
        createOrder,
        updateOrderStatus,
        deleteOrder,
        createInstallationBooking,
        updateInstallationBookingStatus,
        deleteInstallationBooking,
        createCommercialLead,
        updateCommercialLeadStatus,
        deleteCommercialLead,
        updateProjectStage,
        assignTechnician,
        updateTicketStatus,
        createMaintenanceTicket,
        deleteMaintenanceTicket,
        addLeadQuote,
        updateLeadStatus,
        deleteLeadQuote,
        createContactEnquiry,
        updateContactEnquiryStatus,
        deleteContactEnquiry,
        sendNotification,
        markNotificationRead,
        deleteNotification,
        updateSiteContent,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

