export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

export interface CustomerSite {
  id: string;
  name: string;
  address: string;
  city: string;
  province?: string;
  propertyType?: string;
  roofType?: string;
  isPrimary?: boolean;
}

export interface SystemSpecs {
  capacityKw: number;
  inverterName: string;
  inverterBrand: string;
  inverterModel?: string;
  batteryKwh?: number;
  batteryBrand?: string;
  solarKwp?: number;
  busVoltageDc?: string;
  status: 'operational' | 'commissioning' | 'offline' | 'pending_install' | 'standby';
  statusLabel?: string;
}

export type PipelineStageStatus = 'completed' | 'current' | 'pending' | 'delayed' | 'skipped';

export interface PipelineStage {
  id: number;
  key: string;
  name: string;
  subtitle: string;
  status: PipelineStageStatus;
  startedAt?: string;
  completedAt?: string;
  estimatedDate?: string;
  notes?: string;
}

export interface ProjectInfo {
  id: string;
  siteId: string;
  status: 'in_progress' | 'bench_testing' | 'dispatched' | 'installed' | 'commissioned' | 'pending';
  currentStageIndex: number;
  currentStageLabel: string;
  statusDescription: string;
  stages: PipelineStage[];
  estimatedDeliveryDate?: string | null;
  estimatedCommissioningDate?: string | null;
  assetValueZAR: number;
  currency: string;
  paymentStatus: 'paid' | 'partially_paid' | 'pending' | 'overdue' | 'financed';
  paymentMethod: string;
  adminApproved: boolean;
  adminNotes?: string;
  createdAt: string;
}

export interface ShipmentInfo {
  id: string;
  waybillNumber: string;
  courier: string;
  status: 'manifest_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  trackingUrl?: string;
  estimatedDeliveryTimestamp?: number | null;
  estimatedDeliveryDate?: string | null;
  originHub?: string;
  destinationCity?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  description?: string;
  brand: string;
  category: string;
  sku: string;
  serialNumber?: string;
  batchNumber?: string;
  quantity: number;
  unitPriceZAR: number;
  warrantyYears: number;
  warrantyExpiryDate?: string;
  warrantyStatus: 'active' | 'expiring_soon' | 'expired' | 'not_available';
  status: 'allocated' | 'bench_tested' | 'in_transit' | 'installed';
  image?: string;
  includeInstallation?: boolean;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'in_transit' | 'upcoming' | 'diagnostic';

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  status?: string;
  createdAt: string;
  read: boolean;
  action?: {
    label: string;
    actionType: 'schedule_visit' | 'track_shipment' | 'view_invoice' | 'view_coc' | 'contact_support';
    payload?: any;
  };
}

export interface CustomerDocument {
  id: string;
  name: string;
  type: 'tax_invoice' | 'sans_coc' | 'single_line_diagram' | 'warranty_cert' | 'test_report' | 'sseg_approval';
  fileSize?: string;
  createdAt: string;
  downloadUrl?: string;
  isAvailable: boolean;
}

export interface SupportInfo {
  slaTier: string;
  slaStatus: string;
  isAvailable: boolean;
  phone: string;
  email: string;
  assignedElectrician?: {
    name: string;
    registrationNumber: string;
    phone?: string;
  };
}

export interface DashboardData {
  user: UserProfile;
  sites: CustomerSite[];
  activeSiteId: string;
  activeSite: CustomerSite | null;
  system: SystemSpecs | null;
  project: ProjectInfo | null;
  shipment: ShipmentInfo | null;
  hardware: HardwareItem[];
  notifications: DashboardNotification[];
  documents: CustomerDocument[];
  support: SupportInfo;
  certifications: string[];
}
