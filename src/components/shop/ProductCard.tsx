import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { ShoppingBag, Eye, ShieldCheck, Check, Plus, Wrench, FileText } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { activeQuote, addItemToActiveQuote } = useData();
  const [quoteQty, setQuoteQty] = useState<number>(1);
  const [addedToQuoteToast, setAddedToQuoteToast] = useState(false);

  const handleAddToQuote = () => {
    addItemToActiveQuote(product, quoteQty);
    setAddedToQuoteToast(true);
    setTimeout(() => setAddedToQuoteToast(false), 2000);
  };

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/40 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all shadow-lg font-sans">
      {/* Product Image Container (Standardized 4:3 Studio Frame) */}
      <div className="relative w-full h-48 sm:h-52 aspect-[4/3] bg-gradient-to-b from-[#161B22] to-[#0D1117] overflow-hidden border-b border-[#1E2530] flex items-center justify-center p-4">
        <img
          src={product.image || '/hero-solar-home.jpg'}
          alt={product.name}
          className="max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
          }}
        />

        {/* Brand & Technical Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 bg-[#0D1117]/90 backdrop-blur-md border border-[#1E2530] text-[10px] font-mono text-[#E6ECE8] uppercase font-bold rounded-lg shadow-sm">
            {product.brand}
          </span>
          {product.ratingKw && (
            <span className="px-2 py-0.5 bg-[#00D2FF]/15 border border-[#00D2FF]/30 text-[10px] font-mono text-[#00D2FF] font-bold rounded-lg backdrop-blur-md">
              {product.ratingKw} kW
            </span>
          )}
          {product.capacityKwh && (
            <span className="px-2 py-0.5 bg-[#00D2FF]/15 border border-[#00D2FF]/30 text-[10px] font-mono text-[#00D2FF] font-bold rounded-lg backdrop-blur-md">
              {product.capacityKwh} kWh
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          {product.inStock ? (
            <span className="px-2.5 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] font-mono font-bold rounded-lg backdrop-blur-md">
              In Stock ({product.stockCount})
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-red-950/70 border border-red-500/40 text-red-300 text-[10px] font-mono font-semibold rounded-lg backdrop-blur-md">
              Backorder
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase text-[#64748B] mb-1.5 flex items-center justify-between">
            <span>SKU: {product.sku}</span>
            <span className="text-[#10B981] font-semibold">{product.warrantyYears}-Year Warranty</span>
          </div>
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-white group-hover:text-[#00D2FF] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1.5 leading-relaxed">
            {product.summary}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-[#1E2530] text-xs">
          {product.dimensions ? (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold">Dimensions</span>
              <span className="text-[#E6ECE8] font-medium truncate block mt-0.5">{product.dimensions}</span>
            </div>
          ) : product.specs[0] ? (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold">{product.specs[0].label}</span>
              <span className="text-[#E6ECE8] font-medium truncate block mt-0.5">{product.specs[0].value}</span>
            </div>
          ) : null}

          {product.pricePerWpZAR ? (
            <div className="truncate">
              <span className="text-[#00D2FF] text-[10px] uppercase block font-semibold">Rate / Wp</span>
              <span className="text-white font-mono font-bold truncate block mt-0.5">R {product.pricePerWpZAR.toFixed(3)}/Wp</span>
            </div>
          ) : product.specs[1] ? (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold">{product.specs[1].label}</span>
              <span className="text-[#E6ECE8] font-medium truncate block mt-0.5">{product.specs[1].value}</span>
            </div>
          ) : null}
        </div>

        {/* Pricing and CTAs */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#94A3B8]">ZAR (Excl. VAT):</span>
            <span className="text-base font-mono font-extrabold text-[#10B981]">
              R {product.priceZAR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {activeQuote && (
            <div className="flex items-center gap-1.5 bg-[#05070A] p-1.5 rounded-xl border border-[#00D2FF]/40 shadow-sm">
              <div className="flex items-center border border-white/10 rounded-lg bg-black/50 overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuoteQty(q => Math.max(1, q - 1))}
                  className="px-2 py-1 text-xs text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Decrease"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quoteQty}
                  onChange={(e) => setQuoteQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-8 text-center bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuoteQty(q => q + 1)}
                  className="px-2 py-1 text-xs text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Increase"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToQuote}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addedToQuoteToast
                    ? 'bg-[#10B981] text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-[#00D2FF]/15 hover:bg-[#00D2FF] text-[#00D2FF] hover:text-black border border-[#00D2FF]/40'
                }`}
              >
                {addedToQuoteToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>+ Add to Quote</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProduct(product)}
              className="py-2.5 px-3 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-[#94A3B8] hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Details</span>
            </button>

            <button
              onClick={() => addToCart(product, 1, false)}
              className="py-2.5 px-3 bg-[#00D2FF] hover:bg-[#38BDF8] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
