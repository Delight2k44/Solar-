import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { 
  X, 
  ShoppingBag, 
  Wrench, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'warranty' | 'faqs'>('specs');

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, includeInstallation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#0E1311] border border-[#24302A] rounded-lg max-w-4xl w-full text-[#E6ECE8] overflow-hidden shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#9EADA5] hover:text-white bg-[#141A17] border border-[#24302A] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="bg-[#141A17] p-6 border-b md:border-b-0 md:border-r border-[#24302A] flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 rounded bg-[#0E1311] border border-[#24302A] overflow-hidden mb-4 relative">
                <img
                  src={product.image || '/hero-solar-home.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#0E1311]/90 border border-[#24302A] px-2.5 py-1 rounded text-xs font-mono text-white font-semibold">
                  {product.brand}
                </div>
              </div>

              {/* Delivery and Warranty Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                  <span className="flex items-center gap-1.5 text-white font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#286D58]" /> {product.warrantyYears} Year Warranty
                  </span>
                  <span className="text-[10px] text-[#6B7B73] block">Manufacturer direct coverage</span>
                </div>

                <div className="p-3 bg-[#0E1311] border border-[#24302A] rounded">
                  <span className="flex items-center gap-1.5 text-white font-semibold mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#286D58]" /> Tracked Logistics
                  </span>
                  <span className="text-[10px] text-[#6B7B73] block">2 - 5 Business Days in SA</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#24302A] text-xs font-mono text-[#6B7B73]">
              <span>Hardware SKU: <strong className="text-[#9EADA5]">{product.sku}</strong></span>
              <span className="block mt-1">SABS / NRS 097-2-1 Compliance Standard</span>
            </div>
          </div>

          {/* Right Column: Information & Configuration */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#286D58] font-bold tracking-widest block mb-1">
                {product.category.replace('-', ' ')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#9EADA5] mt-2 leading-relaxed">
                {product.summary}
              </p>
            </div>

            {/* Interactive Detail Tabs */}
            <div>
              <div className="flex border-b border-[#24302A] gap-4 text-xs font-mono pb-2">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 uppercase tracking-wider font-semibold ${
                    activeTab === 'specs' ? 'text-white border-b-2 border-[#286D58]' : 'text-[#6B7B73] hover:text-[#9EADA5]'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('compatibility')}
                  className={`pb-1 uppercase tracking-wider font-semibold ${
                    activeTab === 'compatibility' ? 'text-white border-b-2 border-[#286D58]' : 'text-[#6B7B73] hover:text-[#9EADA5]'
                  }`}
                >
                  Compatibility
                </button>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className={`pb-1 uppercase tracking-wider font-semibold ${
                    activeTab === 'warranty' ? 'text-white border-b-2 border-[#286D58]' : 'text-[#6B7B73] hover:text-[#9EADA5]'
                  }`}
                >
                  Warranty & CoC
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-3 min-h-36">
                {activeTab === 'specs' && (
                  <div className="space-y-1.5 text-xs font-mono">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-[#141A17]">
                        <span className="text-[#6B7B73]">{spec.label}</span>
                        <span className="text-white font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'compatibility' && (
                  <div className="space-y-2 text-xs">
                    <p className="text-[#9EADA5] text-xs mb-2">Verified hardware integrations:</p>
                    <div className="space-y-1">
                      {product.compatibility.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white font-mono text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="space-y-2 text-xs text-[#9EADA5] leading-relaxed">
                    <p>
                      This component carries a <strong className="text-white">{product.warrantyYears}-year manufacturer warranty</strong> against component defects, subject to installation by an accredited electrician according to SANS 10142 standards.
                    </p>
                    <p>
                      When paired with our certified installation service, a supplementary Certificate of Compliance (CoC) and manufacturer warranty registration are handled automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Installation Addon Option */}
            {product.installationAvailable && product.installationPriceZAR && (
              <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded-lg">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeInstallation}
                      onChange={e => setIncludeInstallation(e.target.checked)}
                      className="rounded bg-[#0E1311] border-[#24302A] text-[#1B4D3E] focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#286D58]" /> Add Turnkey Installation & CoC
                      </span>
                      <span className="text-[10px] text-[#6B7B73] block font-mono">
                        Includes physical mounting, DC/AC protection cabling & test certificate
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E6ECE8]">
                    + R {product.installationPriceZAR.toLocaleString()}
                  </span>
                </label>
              </div>
            )}

            {/* Price & Add to Cart Section */}
            <div className="pt-4 border-t border-[#24302A] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6B7B73] block">Item Total (Excl VAT)</span>
                  <span className="text-xl font-mono font-bold text-white">
                    R {((product.priceZAR + (includeInstallation ? (product.installationPriceZAR || 0) : 0)) * quantity).toLocaleString()}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 border border-[#24302A] rounded bg-[#141A17] px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#9EADA5] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold px-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#9EADA5] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Cart & Review Sizing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
