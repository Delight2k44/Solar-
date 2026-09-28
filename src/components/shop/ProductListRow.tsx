import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { ShoppingBag, Eye, FileText, Check } from 'lucide-react';

interface ProductListRowProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductListRow: React.FC<ProductListRowProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { activeQuote, addItemToActiveQuote } = useData();
  const [quoteQty, setQuoteQty] = useState<number>(1);
  const [addedToQuoteToast, setAddedToQuoteToast] = useState(false);

  const handleAddToQuote = () => {
    addItemToActiveQuote(product, quoteQty);
    setAddedToQuoteToast(true);
    setTimeout(() => setAddedToQuoteToast(false), 2000);
  };

  // Format ZAR currency in South African standard format
  const formattedPrice = `R ${product.priceZAR.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  const isClearance = product.etaStock?.toLowerCase().includes('clearance') ||
    product.summary.toLowerCase().includes('clearance') ||
    product.etaStock?.toLowerCase().includes('no more stock');

  const isOrderOnline = product.etaStock?.toLowerCase().includes('order online') ||
    product.summary.toLowerCase().includes('warranty');

  return (
    <div className="bg-[#0D1117] hover:bg-[#121822] border border-[#1E2530] hover:border-[#00D2FF]/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
      
      {/* LEFT SECTION: Thumbnail + Identification + Specs */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        
        {/* Thumbnail Image */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-[#161B22] border border-[#1E2530] overflow-hidden cursor-pointer group-hover:border-[#00D2FF]/40 transition-all flex items-center justify-center p-2"
        >
          <img
            src={product.image || '/hero-solar-home.jpg'}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
            }}
          />
          {product.brand && (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-[#94A3B8] uppercase">
              {product.brand}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-1.5 min-w-0 flex-1">
          
          {/* Top Line: SKU Part Number + Manufacturer */}
          <div className="flex flex-wrap items-center gap-2">
            <span 
              onClick={() => onSelectProduct(product)}
              className="px-2 py-0.5 rounded-md bg-[#00D2FF]/10 hover:bg-[#00D2FF]/20 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold cursor-pointer transition-colors"
            >
              {product.sku}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">
              {product.brand}
            </span>
            {product.ratingKw && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] font-mono text-[#E2E8F0]">
                {product.ratingKw >= 1 ? `${product.ratingKw} kW` : `${Math.round(product.ratingKw * 1000)} W`}
              </span>
            )}
            {product.warrantyYears && (
              <span className="text-[11px] font-mono text-[#10B981] hidden sm:inline">
                • {product.warrantyYears}Y Warranty
              </span>
            )}
          </div>

          {/* Product Title (clickable) */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm sm:text-base font-bold text-white group-hover:text-[#00D2FF] cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Secondary Specifications / Dimensions */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8]">
            {product.dimensions && (
              <span className="font-mono text-[11px] text-[#CBD5E1]">
                Size: <strong className="text-white">{product.dimensions}</strong>
              </span>
            )}
            {product.cellCount && (
              <span className="font-mono text-[11px] text-[#CBD5E1]">
                Cells: <strong className="text-white">{product.cellCount}</strong>
              </span>
            )}
            {product.specs?.[0] && !product.dimensions && (
              <span className="text-[11px]">
                {product.specs[0].label}: <strong className="text-white font-mono">{product.specs[0].value}</strong>
              </span>
            )}
          </div>

          {/* Stock Telemetry & Availability Flags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[11px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {product.stockCount > 0 ? `${product.stockCount} In Stock` : 'In Stock'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/50 border border-red-500/40 text-red-300 text-[11px] font-mono">
                Out of Stock
              </span>
            )}

            {isOrderOnline && (
              <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/40 text-blue-300 text-[11px] font-mono font-semibold">
                Order Online
              </span>
            )}

            {isClearance && (
              <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-semibold">
                Clearance
              </span>
            )}

            {product.etaStock && (
              <span className="text-[11px] font-mono text-[#94A3B8] ml-1">
                {product.etaStock}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* RIGHT SECTION: Price & Action Buttons */}
      <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
        
        {/* Pricing Block */}
        <div className="text-left md:text-right space-y-0.5">
          <div className="text-lg sm:text-xl font-mono font-extrabold text-[#10B981] tracking-tight">
            {formattedPrice}
          </div>
          {product.pricePerWpZAR && (
            <div className="text-xs font-mono text-[#00D2FF] font-semibold">
              (R {product.pricePerWpZAR.toFixed(3)}/Wp)
            </div>
          )}
          <span className="text-[10px] text-[#64748B] block">Excl. 15% VAT</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeQuote && (
            <div className="flex items-center gap-1.5 bg-[#05070A] p-1 rounded-xl border border-[#00D2FF]/40 shadow-sm">
              <div className="flex items-center border border-white/10 rounded-lg bg-black/50 overflow-hidden">
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
                  className="w-10 text-center bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  addedToQuoteToast
                    ? 'bg-[#10B981] text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-[#00D2FF]/15 hover:bg-[#00D2FF] text-[#00D2FF] hover:text-black border border-[#00D2FF]/40'
                }`}
                title="Add product to active quotation"
              >
                {addedToQuoteToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>+ Quote</span>
                  </>
                )}
              </button>
            </div>
          )}

          <button
            onClick={() => onSelectProduct(product)}
            className="px-3 py-2 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-[#E6ECE8] text-xs font-mono font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            onClick={() => addToCart(product, 1, false)}
            className="px-4 py-2 bg-[#00D2FF] hover:bg-[#38BDF8] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};
