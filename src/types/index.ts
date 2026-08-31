export type ProductCategory = 
  | 'solar-panels'
  | 'inverters'
  | 'batteries'
  | 'complete-kits'
  | 'mounting-equipment'
  | 'protection-accessories'
  | 'monitoring-equipment';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceZAR: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  image: string;
  summary: string;
  ratingKw?: number;
  capacityKwh?: number;
  warrantyYears: number;
  specs: ProductSpec[];
  compatibility: string[];
  installationAvailable: boolean;
  installationPriceZAR?: number;
  faqs: { question: string; answer: string }[];
}

export type PropertyType = 'residential' | 'commercial' | 'agricultural' | 'industrial';
export type SolarPriority = 'lower-bills' | 'backup-power' | 'energy-independence' | 'reduce-grid-reliance' | 'balanced';
export type BackupDuration = 'essential' | 'several-hours' | 'overnight' | 'full-24h';

export interface ConfiguratorResult {
  propertyType: PropertyType;
  monthlyBillZAR: number;
  monthlyKwh: number;
  priority: SolarPriority;
  backupDuration: BackupDuration;
  recommendedInverterKva: number;
  recommendedSolarKwp: number;
  recommendedBatteryKwh: number;
  estimatedPriceMinZAR: number;
  estimatedPriceMaxZAR: number;
  estimatedMonthlySavingsZAR: number;
  estimatedPaybackYears: number;
  co2SavedTonnesPerYear: number;
}

export interface ProvinceIrradiance {
  name: string;
  peakSunHoursPerDay: number; // kWh/m²/day
  avgTariffPerKwhZAR: number; // ZAR
}

export interface ProjectStage {
  id: number;
  key: 'order-received' | 'equipment-prep' | 'install-scheduled' | 'install-progress' | 'commissioned' | 'completed';
  title: string;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface ProjectRecord {
  orderId: string;
  customerName: string;
  location: string;
  systemSummary: string;
  currentStageIndex: number; // 0 to 5
  stages: ProjectStage[];
  assignedTechnician: {
    name: string;
    leadCert: string;
    contactPlaceholder: string;
  };
  installationDate: string;
  documents: {
    name: string;
    type: 'invoice' | 'coc' | 'warranty' | 'diagram';
    date: string;
    size: string;
  }[];
}

export interface MaintenancePackage {
  id: string;
  name: string;
  tier: 'Essential' | 'Performance' | 'Complete';
  tagline: string;
  description: string;
  features: string[];
  idealFor: string;
  slaResponse: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: 'Guides' | 'Buying Guides' | 'Energy Tips' | 'Glossary' | 'News';
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  image: string;
  quantity: number;
  unitPriceZAR: number;
  includeInstallation: boolean;
  installationPriceZAR: number;
}

export interface OrderRecord {
  id: string; // e.g. KX-PAY-981240
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  propertyType: string;
  roofType?: string;
  notes?: string;
  items: OrderItem[];
  equipmentSubtotalZAR: number;
  installationSubtotalZAR: number;
  vatZAR: number;
  totalCartZAR: number;
  paymentMethod: 'payfast' | 'card' | 'applepay' | 'payflex' | 'instant_eft' | 'ozow' | 'finance' | 'deposit';
  selectedBank?: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  orderStatus: 'processing' | 'hardware_reserved' | 'bench_testing' | 'scheduled' | 'installed' | 'commissioned' | 'completed';
  currentStageIndex: number;
  courierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  adminApproved?: boolean;
  adminNotes?: string;
  createdAt: string;
}

export interface InstallationBooking {
  id: string; // e.g. KX-INST-1234
  clientName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  targetDate: string;
  roofType: string;
  phaseConnection: string;
  dbLocation: string;
  specialAccess?: string;
  status: 'pending' | 'site_visit_scheduled' | 'quote_prepared' | 'confirmed';
  createdAt: string;
}

export interface CommercialLead {
  id: string; // e.g. KX-COMM-1234
  companyName: string;
  industrySector: string;
  monthlySpend: string;
  peakKva: string;
  dieselMonthly: string;
  taxSection12b: boolean;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  locationCity: string;
  status: 'new' | 'profiling' | 'audit_booked' | 'proposal_sent';
  createdAt: string;
}

export interface ContactEnquiry {
  id: string; // e.g. KX-ENQ-9021
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'replied' | 'archived';
  replyNotes?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string; // e.g. NOTIF-1029
  targetUserEmail: string; // or 'all'
  targetUserName?: string;
  title: string;
  message: string;
  type: 'order' | 'maintenance' | 'installation' | 'general';
  read: boolean;
  sender: string; // 'Admin Desk', etc.
  createdAt: string;
}


