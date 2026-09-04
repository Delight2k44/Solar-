import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { SolarConfigurator } from './components/configurator/SolarConfigurator';
import { EnergyCalculator } from './components/calculator/EnergyCalculator';
import { ProjectTracker } from './components/tracking/ProjectTracker';
import { CustomerPortal } from './components/portal/CustomerPortal';

import { HomePage } from './pages/HomePage';
import { SolarSolutionsPage } from './pages/SolarSolutionsPage';
import { BusinessPage } from './pages/BusinessPage';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { ShopPage } from './pages/ShopPage';
import { InstallationPage } from './pages/InstallationPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AboutPage } from './pages/AboutPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { SolarChatWidget } from './components/chat/SolarChatWidget';

import { Product } from './types';
import { X } from 'lucide-react';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfiguratorModalOpen, setIsConfiguratorModalOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Auth guards: redirect to login if accessing protected routes without being signed in
  useEffect(() => {
    if (currentRoute === 'portal' && !isAuthenticated) {
      setCurrentRoute('login');
    }
    if (currentRoute === 'admin' && (!isAuthenticated || !isAdmin)) {
      setCurrentRoute('login');
    }
  }, [currentRoute, isAuthenticated, isAdmin]);

  const openConfigurator = () => {
    setIsConfiguratorModalOpen(true);
  };

  const handleQuoteRequested = (data: any) => {
    // Open cart or confirmation
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1311] text-[#E6ECE8]">
      {/* Global Header */}
      <Header 
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        openConfigurator={openConfigurator}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            setCurrentRoute={setCurrentRoute}
            openConfigurator={openConfigurator}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {(currentRoute === 'commercial' || currentRoute === 'business') && (
          <BusinessPage
            openConfigurator={openConfigurator}
            setCurrentRoute={setCurrentRoute}
          />
        )}

        {currentRoute === 'solar' && (
          <SolarSolutionsPage
            openConfigurator={openConfigurator}
            setCurrentRoute={setCurrentRoute}
          />
        )}

        {currentRoute === 'shop' && (
          <ShopPage onSelectProduct={setSelectedProduct} />
        )}

        {currentRoute === 'installation' && (
          <InstallationPage />
        )}

        {currentRoute === 'maintenance' && (
          <MaintenancePage />
        )}

        {currentRoute === 'calculator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <EnergyCalculator onQuoteTrigger={openConfigurator} />
          </div>
        )}

        {currentRoute === 'configurator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <SolarConfigurator onQuoteRequested={handleQuoteRequested} />
          </div>
        )}

        {currentRoute === 'tracking' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <ProjectTracker initialOrderId="KX-9042" />
          </div>
        )}

        {currentRoute === 'portal' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <CustomerPortal 
              onBookMaintenance={() => setCurrentRoute('maintenance')} 
              onNavigateToShop={() => setCurrentRoute('shop')}
              setCurrentRoute={setCurrentRoute}
            />
          </div>
        )}

        {currentRoute === 'login' && (
          <LoginPage setCurrentRoute={setCurrentRoute} onSuccessRedirect="portal" />
        )}

        {currentRoute === 'admin' && (
          <AdminPage setCurrentRoute={setCurrentRoute} />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            setCurrentRoute={setCurrentRoute}
            openConfigurator={openConfigurator}
          />
        )}

        {currentRoute === 'resources' && (
          <ResourcesPage />
        )}

        {currentRoute === 'faq' && (
          <FAQPage
            openConfigurator={openConfigurator}
            setCurrentRoute={setCurrentRoute}
          />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer setCurrentRoute={setCurrentRoute} />

      {/* Slide-out Cart Drawer with Instant EFT / Card / Financing */}
      <CartDrawer onNavigate={(route) => { setCurrentRoute(route); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* Floating WhatsApp Live Chat Widget (078 780 8569) */}
      <WhatsAppWidget />

      {/* Interactive AI & Engineering Chatbot Widget */}
      <SolarChatWidget onOpenConfigurator={openConfigurator} />

      {/* Single Product Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Standalone Configurator Modal Overlay */}
      {isConfiguratorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setIsConfiguratorModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-[#9EADA5] hover:text-white bg-[#141A17] border border-[#24302A] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SolarConfigurator
              onQuoteRequested={(data) => {
                setTimeout(() => setIsConfiguratorModalOpen(false), 3500);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
