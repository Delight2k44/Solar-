import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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
  LogOut
} from 'lucide-react';
import { TelemetryNotice } from '../common/EstimateDisclaimer';

interface CustomerPortalProps {
  onBookMaintenance?: () => void;
  onNavigateToShop?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  onBookMaintenance,
  onNavigateToShop 
}) => {
  const { projects, maintenanceTickets } = useData();
  const { currentUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'telemetry' | 'orders' | 'installation' | 'maintenance' | 'documents'>('dashboard');
  
  // Use project KX-9042 by default or first available
  const project = projects['KX-9042'] || Object.values(projects)[0];
  const userTickets = maintenanceTickets.filter(t => t.clientEmail === currentUser?.email || t.clientName.includes('Bryanston'));

  const stageTitles = [
    'Order Received & Hardware Reserved',
    'Equipment Bench-Testing & Prep',
    'Installation Scheduled (DoL Certified)',
    'Installation in Progress on Site',
    'System Commissioned & Telemetry Live',
    'Completed & CoC Handover Issued'
  ];

  return (
    <div className="bg-[#0E1311] border border-[#24302A] rounded-2xl p-6 sm:p-8 max-w-6xl mx-auto text-[#E6ECE8] shadow-2xl">
      {/* Portal Header */}
      <div className="border-b border-[#24302A] pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
              Customer Account & Asset Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase">
            {project ? `${project.customerName} #${project.orderId}` : 'Kinetix Client Asset Dashboard'}
          </h2>
          <span className="text-xs text-[#9EADA5] font-mono mt-0.5 block">
            Account Holder: <strong className="text-white">{currentUser?.name || 'Bryanston Residential Client'}</strong> • Service SLA: <span className="text-[#10B981] font-bold">Active</span>
          </span>
        </div>

        {/* Quick Status & Logout */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-[#141A17] border border-[#24302A] text-[#9EADA5] px-3.5 py-1.5 rounded-lg">
            Stage 0{project?.currentStageIndex}: <strong className="text-[#D97706]">{project?.stages[project.currentStageIndex]?.title || 'In Progress'}</strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-[#24302A] pb-px mb-8 text-xs font-mono font-semibold">
        {[
          { id: 'dashboard', label: 'DASHBOARD', icon: Layers },
          { id: 'telemetry', label: 'SYSTEM HEALTH & TELEMETRY', icon: Activity },
          { id: 'orders', label: 'EQUIPMENT & ORDERS', icon: ShoppingBag },
          { id: 'installation', label: 'INSTALLATION & COC', icon: UserCheck },
          { id: 'maintenance', label: 'MAINTENANCE LOG', icon: Wrench },
          { id: 'documents', label: 'DOCUMENTS VAULT', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#141A17] text-white border-t-2 border-[#286D58] border-x border-[#24302A]'
                  : 'text-[#9EADA5] hover:text-white hover:bg-[#141A17]/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#286D58]' : 'text-[#6B7B73]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl">
              <span className="text-[10px] uppercase text-[#6B7B73] block mb-1">Installed Inverter</span>
              <span className="text-white font-bold text-sm">8.0 kW Single Phase</span>
              <span className="text-[10px] text-[#286D58] block mt-1">Deye SUN-8K-SG01LP1</span>
            </div>

            <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl">
              <span className="text-[10px] uppercase text-[#6B7B73] block mb-1">Battery Storage</span>
              <span className="text-white font-bold text-sm">10.24 kWh LiFePO4</span>
              <span className="text-[10px] text-[#286D58] block mt-1">Freedom Won eTower (Dual)</span>
            </div>

            <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl">
              <span className="text-[10px] uppercase text-[#6B7B73] block mb-1">Solar PV Array</span>
              <span className="text-white font-bold text-sm">5.50 kWp (10 Panels)</span>
              <span className="text-[10px] text-[#286D58] block mt-1">Canadian Solar 550W HiKu6</span>
            </div>

            <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl">
              <span className="text-[10px] uppercase text-[#6B7B73] block mb-1">Grid Compliance</span>
              <span className="text-[#10B981] font-bold text-sm">SANS 10142-1-2</span>
              <span className="text-[10px] text-[#6B7B73] block mt-1">City Power / SSEG Certified</span>
            </div>
          </div>

          {/* Active Installation Milestone Card */}
          {project && (
            <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24302A] pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#286D58]" />
                  <h3 className="text-sm font-bold text-white uppercase">
                    Live Installation Milestone Tracker ({project.orderId})
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#9EADA5]">
                  Target Handover: <strong className="text-white">{project.installationDate}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                {project.stages.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                      st.current
                        ? 'bg-[#1B4D3E]/40 border-[#10B981] ring-1 ring-[#10B981]'
                        : st.completed
                        ? 'bg-[#0E1311] border-[#286D58] text-[#10B981]'
                        : 'bg-[#0E1311] border-[#24302A] text-[#6B7B73]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">0{idx + 1}</span>
                      {st.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                      {st.current && <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping" />}
                    </div>
                    <span className="text-[10px] font-bold block uppercase truncate">{st.title}</span>
                    <span className="text-[9px] text-[#9EADA5] block truncate">{st.date || 'Scheduled'}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded-lg text-xs font-mono text-[#9EADA5] flex items-center justify-between">
                <span>Assigned Master Electrician: <strong className="text-white">{project.assignedTechnician.name}</strong></span>
                <span className="text-[10px] text-[#286D58]">{project.assignedTechnician.leadCert}</span>
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('telemetry')}
              className="p-5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] rounded-xl text-left flex items-center justify-between group transition-all"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-white uppercase block">System Health & Telemetry</span>
                <p className="text-[11px] text-[#9EADA5]">Live battery state of charge (SoC), daily solar generation, and load profile.</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#286D58] group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="p-5 bg-[#141A17] hover:bg-[#1A221E] border border-[#24302A] rounded-xl text-left flex items-center justify-between group transition-all"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-white uppercase block">Compliance Vault & CoC Documents</span>
                <p className="text-[11px] text-[#9EADA5]">Download supplementary electrical CoC, single-line diagram (SLD), and warranties.</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#286D58] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span>SOLAR GENERATION</span>
                <Sun className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="text-2xl font-bold text-white">4.82 kW</div>
              <span className="text-[10px] text-[#10B981]">Peak Generation Today: 24.6 kWh</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span>BATTERY STATE (SOC)</span>
                <BatteryCharging className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-2xl font-bold text-white">92 %</div>
              <span className="text-[10px] text-[#10B981]">Float Charging • 53.2 V</span>
            </div>

            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[#6B7B73]">
                <span>HOUSEHOLD CONSUMPTION</span>
                <Zap className="w-4 h-4 text-[#286D58]" />
              </div>
              <div className="text-2xl font-bold text-white">1.45 kW</div>
              <span className="text-[10px] text-[#10B981]">100% Solar Powered (0kW Grid Draw)</span>
            </div>
          </div>

          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase">Inverter Firmware & Health Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Wi-Fi Logger RSSI:</span>
                <strong className="text-white">-58 dBm (Strong)</strong>
              </div>
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Heatsink Temperature:</span>
                <strong className="text-white">38.4 °C (Normal)</strong>
              </div>
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Grid Frequency:</span>
                <strong className="text-white">50.02 Hz (Synchronized)</strong>
              </div>
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Daily Self-Consumption:</span>
                <strong className="text-[#10B981]">98.4 %</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase">Installed Equipment Schedule</h4>
            <div className="space-y-3 font-mono text-xs">
              {[
                { name: 'Deye 8kW Single Phase Hybrid Inverter', sku: 'DEYE-8K-HYB-01', price: 'R 32,450', qty: 1 },
                { name: 'Freedom Won eTower LiFePO4 Battery 5.12kWh', sku: 'FW-ETOWER-5.12', price: 'R 53,600', qty: 2 },
                { name: 'Canadian Solar 550W HiKu6 Mono PERC Panels', sku: 'CS-HIKU6-550W', price: 'R 21,500', qty: 10 },
                { name: 'SABS Pre-Wired AC/DC Surge DB Box & Changeover', sku: 'KX-PROT-2IN-1OUT', price: 'R 6,950', qty: 1 },
                { name: 'Turnkey Installation, Cable Containment & SANS CoC', sku: 'SRV-INSTALL-COC', price: 'R 18,500', qty: 1 }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#0E1311] border border-[#24302A] rounded-lg flex items-center justify-between">
                  <div>
                    <strong className="text-white block">{item.name}</strong>
                    <span className="text-[10px] text-[#6B7B73]">SKU: {item.sku} • Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold text-[#D97706]">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Installation & CoC */}
      {activeTab === 'installation' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
              <h4 className="font-bold text-white uppercase">Installation Compliance Dossier</h4>
              <span className="text-[#10B981] bg-[#1B4D3E]/40 border border-[#286D58] px-2 py-0.5 rounded text-[10px]">
                SANS 10142-1-2 Verified
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#9EADA5]">
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Installation Electrician (IE):</span>
                <strong className="text-white">Lead Master Technician [Department of Labour Registered]</strong>
              </div>
              <div>
                <span className="text-[#6B7B73] block text-[10px]">Certificate of Compliance (CoC):</span>
                <strong className="text-white">CoC #ZA-GP-9042-2026 (Supplementary Electrical CoC)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
              <h4 className="font-bold text-white uppercase">Service SLA & Preventative Maintenance History</h4>
              {onBookMaintenance && (
                <button
                  onClick={onBookMaintenance}
                  className="px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-[10px] uppercase font-bold rounded transition-colors"
                >
                  Book New Service Window
                </button>
              )}
            </div>

            <div className="space-y-3">
              {userTickets.map(ticket => (
                <div key={ticket.id} className="p-4 bg-[#0E1311] border border-[#24302A] rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">{ticket.id} • {ticket.tier}</span>
                    <span className="text-[10px] uppercase bg-[#1B4D3E] text-[#10B981] px-2 py-0.5 rounded">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-[#9EADA5]">{ticket.primaryReason}</p>
                  <span className="text-[10px] text-[#6B7B73] block">Scheduled: {ticket.scheduledDate} • Assigned: {ticket.assignedTechnician}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Documents Vault */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white uppercase">Downloadable Compliance Documents & Warranties</h4>
            <div className="space-y-3">
              {[
                { name: 'Supplementary Electrical Certificate of Compliance (CoC).pdf', size: '1.8 MB', date: 'August 2026' },
                { name: 'Single Line Diagram (SLD) & DB Changeover Schematic.pdf', size: '2.4 MB', date: 'August 2026' },
                { name: 'Freedom Won 10-Year Manufacturer Warranty Certificate.pdf', size: '850 KB', date: 'August 2026' },
                { name: 'Deye Hybrid Inverter Factory Test & Commissioning Report.pdf', size: '1.1 MB', date: 'August 2026' },
                { name: 'Final Itemized Paid Tax Invoice (KX-9042).pdf', size: '420 KB', date: 'August 2026' }
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 bg-[#0E1311] border border-[#24302A] rounded-lg flex items-center justify-between hover:border-[#31423A] transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#286D58]" />
                    <div>
                      <span className="text-white font-bold block">{doc.name}</span>
                      <span className="text-[10px] text-[#6B7B73]">{doc.size} • {doc.date}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    className="p-2 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] rounded text-white text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[10px]">Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
