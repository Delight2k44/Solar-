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
