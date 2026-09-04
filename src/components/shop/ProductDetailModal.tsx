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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl max-w-4xl w-full text-[#E6ECE8] overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#94A3B8] hover:text-white bg-[#161B22] border border-[#30363D] hover:bg-[#21262D] rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="bg-[#161B22] p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#1E2530] flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 rounded-xl bg-[#0D1117] border border-[#30363D] overflow-hidden mb-4 relative shadow-inner">
                <img
                  src={product.image || '/hero-solar-home.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#0D1117]/90 backdrop-blur-md border border-[#1E2530] px-3 py-1 rounded-lg text-xs font-mono text-white font-bold shadow-sm">
                  {product.brand}
                </div>
              </div>

              {/* Delivery and Warranty Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#0D1117] border border-[#1E2530] rounded-xl space-y-1">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" /> {product.warrantyYears}-Year Warranty
                  </span>
                  <span className="text-[11px] text-[#94A3B8] block">Manufacturer Direct Coverage</span>
                </div>

                <div className="p-3.5 bg-[#0D1117] border border-[#1E2530] rounded-xl space-y-1">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Truck className="w-4 h-4 text-[#00D2FF]" /> The Courier Guy
                  </span>
                  <span className="text-[11px] text-[#94A3B8] block">2 - 4 Days Turnkey In-Transit</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E2530] text-xs font-mono text-[#64748B]">
              <span>Hardware SKU: <strong className="text-[#94A3B8]">{product.sku}</strong></span>
              <span className="block mt-1 text-[11px]">SABS / NRS 097-2-1 Compliance Standard Verified</span>
            </div>
          </div>

          {/* Right Column: Information & Configuration */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#00D2FF] font-bold tracking-widest block mb-1">
                {product.category.replace('-', ' ')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                {product.summary}
              </p>
            </div>

            {/* Interactive Detail Tabs */}
            <div>
              <div className="flex border-b border-[#1E2530] gap-2 text-xs pb-2">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === 'specs' 
                      ? 'bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('compatibility')}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === 'compatibility' 
                      ? 'bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Compatibility
                </button>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === 'warranty' 
                      ? 'bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/30' 
                      : 'text-[#94A3B8] hover:text-white'
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
                      <div key={idx} className="flex justify-between py-1.5 border-b border-[#1E2530]/60">
                        <span className="text-[#64748B]">{spec.label}</span>
                        <span className="text-white font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'compatibility' && (
                  <div className="space-y-2 text-xs">
                    <p className="text-[#94A3B8] text-xs mb-2">Verified hardware integrations:</p>
                    <div className="space-y-1.5">
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
                  <div className="space-y-2 text-xs text-[#94A3B8] leading-relaxed">
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
              <div className="p-4 bg-[#161B22] border border-[#30363D] hover:border-[#00D2FF]/40 rounded-xl transition-all">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeInstallation}
                      onChange={e => setIncludeInstallation(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0D1117] border-[#30363D] text-[#00D2FF] focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#00D2FF]" /> Add Turnkey Installation & CoC
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block">
                        Includes physical mounting, DC/AC protection cabling & SANS test certificate
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#10B981]">
                    + R {product.installationPriceZAR.toLocaleString()}
                  </span>
                </label>
              </div>
            )}

            {/* Price & Add to Cart Section */}
            <div className="pt-4 border-t border-[#1E2530] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#64748B] block">Item Total (Excl VAT)</span>
                  <span className="text-xl font-mono font-extrabold text-[#10B981]">
                    R {((product.priceZAR + (includeInstallation ? (product.installationPriceZAR || 0) : 0)) * quantity).toLocaleString()}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 border border-[#30363D] rounded-xl bg-[#161B22] px-2.5 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold px-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
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
