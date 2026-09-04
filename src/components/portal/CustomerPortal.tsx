import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { buildDashboardData } from '../../services/dashboardService';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKpis } from './DashboardKpis';
import { InstallationPipeline } from './InstallationPipeline';
import { HardwareDetails } from './HardwareDetails';
import { DiagnosticsFeed } from './DiagnosticsFeed';
import { DashboardFooter } from './DashboardFooter';
import { ServiceRequestModal } from './ServiceRequestModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';

interface CustomerPortalProps {
  onBookMaintenance?: () => void;
  onNavigateToShop?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onBookMaintenance,
  onNavigateToShop
}) => {
  const { orders, userNotifications, maintenanceTickets, markNotificationRead, createMaintenanceTicket } = useData();
  const { currentUser, logout } = useAuth();

  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Normalize complete dynamic dashboard data
  const data = buildDashboardData(
    currentUser,
    orders,
    userNotifications,
    maintenanceTickets,
    selectedSiteId
  );

  const handleTicketSubmit = (ticketData: { reason: string; details: string }) => {
    createMaintenanceTicket({
      clientName: data.user.name,
      clientEmail: data.user.email,
      clientPhone: data.user.phone || '+27 82 000 0000',
      siteAddress: data.activeSite?.address || 'Site Address',
      city: data.activeSite?.city || 'Johannesburg',
      tier: data.support.slaTier,
      inverterBrand: data.system?.inverterBrand || 'Deye / Sunsynk Hybrid',
      systemAge: data.project ? '1 Year' : 'New System',
      primaryReason: ticketData.reason,
      issueDetails: ticketData.details,
      assignedTechnician: data.support.assignedElectrician?.name || 'Master Electrician J. Botha',
      scheduledDate: 'Next Available SLA Window'
    });
  };

  const handleMarkAllRead = () => {
    data.notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 font-sans text-[#E6ECE8] pb-16">
      {/* 1. Top Minimalist Nav Bar */}
      <DashboardHeader
        user={data.user}
        sites={data.sites}
        activeSite={data.activeSite}
        support={data.support}
        onSelectSite={siteId => setSelectedSiteId(siteId)}
        onRequestService={() => setIsServiceModalOpen(true)}
        onLogout={logout}
      />

      {/* 2. Top KPI / Telemetry Row */}
      <DashboardKpis
        system={data.system}
        project={data.project}
      />

      {/* 3. Active Project & Installation Pipeline */}
      <InstallationPipeline
        project={data.project}
        shipment={data.shipment}
        onNavigateToShop={onNavigateToShop}
      />

      {/* 4. 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 COLS): Hardware & Serial Registry */}
        <div className="lg:col-span-7 space-y-6">
          <HardwareDetails
            hardware={data.hardware}
            project={data.project}
            onOpenInvoice={() => setIsInvoiceModalOpen(true)}
            onOpenCoc={() => alert('Downloading official Supplementary SANS 10142-1-2 Certificate of Compliance (PDF)...')}
            onNavigateToShop={onNavigateToShop}
          />
        </div>

        {/* Right Column (5 COLS): Engineering & Diagnostics Feed */}
        <div className="lg:col-span-5 space-y-6">
          <DiagnosticsFeed
            notifications={data.notifications}
            onMarkRead={id => markNotificationRead(id)}
            onMarkAllRead={handleMarkAllRead}
            onRequestService={() => setIsServiceModalOpen(true)}
          />
        </div>
      </div>

      {/* 5. Minimal App Footer */}
      <DashboardFooter
        support={data.support}
        certifications={data.certifications}
      />

      {/* Modals */}
      <ServiceRequestModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        user={data.user}
        activeSite={data.activeSite}
        onSubmitTicket={handleTicketSubmit}
      />

      <InvoicePreviewModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        project={data.project}
        hardware={data.hardware}
        user={data.user}
        activeSite={data.activeSite}
      />
    </div>
  );
};
