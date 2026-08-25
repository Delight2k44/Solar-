import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_CATALOG, SAMPLE_PROJECT_RECORDS, MAINTENANCE_PACKAGES } from '../data/mockData';
import { Product, ProjectRecord } from '../types';

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
  maintenanceTickets: MaintenanceTicket[];
  leadsQuotes: LeadQuote[];
  siteContent: Record<string, SiteContentSection>;
  
  // Product actions
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Project tracking actions
  updateProjectStage: (orderId: string, stageIndex: number) => void;
  assignTechnician: (orderId: string, name: string, cert: string) => void;
  
  // Maintenance actions
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], tech?: string) => void;
  createMaintenanceTicket: (data: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => string;
  
  // Lead actions
  addLeadQuote: (data: Omit<LeadQuote, 'id' | 'createdAt' | 'status'>) => string;
  updateLeadStatus: (leadId: string, status: LeadQuote['status']) => void;
  
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
      return saved ? JSON.parse(saved) : PRODUCTS_CATALOG;
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
    localStorage.setItem('kinetix_tickets', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('kinetix_leads', JSON.stringify(leadsQuotes));
  }, [leadsQuotes]);

  useEffect(() => {
    localStorage.setItem('kinetix_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  // Actions
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

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
    setMaintenanceTickets(INITIAL_TICKETS);
    setLeadsQuotes(INITIAL_LEADS);
    setSiteContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem('kinetix_products');
    localStorage.removeItem('kinetix_projects');
    localStorage.removeItem('kinetix_tickets');
    localStorage.removeItem('kinetix_leads');
    localStorage.removeItem('kinetix_site_content');
  };

  return (
    <DataContext.Provider
      value={{
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
        createMaintenanceTicket,
        addLeadQuote,
        updateLeadStatus,
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
