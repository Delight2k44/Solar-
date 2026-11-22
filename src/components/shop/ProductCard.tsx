import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { ShoppingBag, Eye, ShieldCheck, Check, Plus, Minus, Star, Truck, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  includeVat?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, includeVat = false }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { activeQuote, addItemToActiveQuote } = useData();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [addedToQuoteToast, setAddedToQuoteToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity, false);
    setAddedToCartToast(true);
    setTimeout(() => {
      setAddedToCartToast(false);
    }, 2200);
  };

  const handleAddToQuote = () => {
    addItemToActiveQuote(product, quantity);
    setAddedToQuoteToast(true);
    setTimeout(() => setAddedToQuoteToast(false), 2000);
  };

  // Price calculations
  const basePrice = product.priceZAR;
  const vatPrice = basePrice * 1.15;
  const msrpPrice = basePrice * 1.12; // Suggested retail reference
  const savings = msrpPrice - basePrice;

  const displayedPrice = includeVat ? vatPrice : basePrice;
  const secondaryPrice = includeVat ? basePrice : vatPrice;

  // Star rating calculation based on product SKU hash for consistency
  const ratingScore = 4.8 + ((product.sku.charCodeAt(product.sku.length - 1) % 3) / 10);
  const reviewCount = 18 + (product.sku.charCodeAt(0) % 35);

  return (
    <div className="bg-[#0B0F17] hover:bg-[#101622] border border-[#1E2530] hover:border-[#00D2FF]/60 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-md hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] font-sans relative">
      
      {/* 1. STORE SHELF IMAGE STAGE (High-Contrast Clean Studio Frame) */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative w-full h-52 sm:h-56 bg-gradient-to-b from-[#141B26] to-[#0B0F17] overflow-hidden border-b border-[#1E2530] flex items-center justify-center p-5 cursor-pointer group-hover:bg-[#141C2B] transition-colors"
      >
        <img
          src={product.image || '/hero-solar-home.jpg'}
          alt={product.name}
          className="max-w-full max-h-full object-contain object-center group-hover:scale-108 transition-transform duration-300 drop-shadow-md filter contrast-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/hero-solar-home.jpg';
          }}
        />

        {/* Top Badges (Brand, Phase, Capacity) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%]">
          <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white uppercase font-bold rounded-lg shadow-sm">
            {product.brand}
          </span>

          {product.phase && (
            <span className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg backdrop-blur-md border ${
              product.phase === 'three' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
            }`}>
              {product.phase === 'three' ? '3-Phase 400V' : '1-Phase 230V'}
            </span>
          )}

          {product.ratingKw && (
            <span className="px-2 py-1 bg-[#00D2FF]/15 border border-[#00D2FF]/40 text-[10px] font-mono text-[#00D2FF] font-bold rounded-lg backdrop-blur-md">
              {product.ratingKw >= 1 ? `${product.ratingKw} kW` : `${Math.round(product.ratingKw * 1000)} W`}
            </span>
          )}

          {product.capacityKwh && (
            <span className="px-2 py-1 bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold rounded-lg backdrop-blur-md">
              {product.capacityKwh} kWh
            </span>
          )}
        </div>

        {/* Top Right: Real Store Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            product.stockCount <= 3 ? (
              <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-mono font-bold rounded-lg backdrop-blur-md shadow-sm animate-pulse">
                Only {product.stockCount} Left!
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold rounded-lg backdrop-blur-md shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>In Stock ({product.stockCount})</span>
              </span>
            )
          ) : (
            <span className="px-2.5 py-1 bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] font-mono font-semibold rounded-lg backdrop-blur-md">
              Backorder
            </span>
          )}
        </div>
      </div>

      {/* 2. PRODUCT DETAILS & STORE METRICS */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          
          {/* Brand Category & Star Rating */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#00D2FF] font-extrabold tracking-wider">
              {product.brand} // {product.category.toUpperCase()}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white text-[11px] font-mono">{ratingScore.toFixed(1)}</span>
              <span className="text-[#64748B] text-[10px]">({reviewCount})</span>
            </div>
          </div>

          {/* Product Title (Clean, Clickable) */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-base font-bold text-white group-hover:text-[#00D2FF] transition-colors line-clamp-2 cursor-pointer leading-snug tracking-tight"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Part Number SKU & Warranty */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-0.5">
            <span>SKU: <strong className="text-[#94A3B8]">{product.sku}</strong></span>
            <span className="text-[#10B981] font-semibold">{product.warrantyYears}-Yr Warranty</span>
          </div>

          {/* Store Perks Checkmarks */}
          <div className="space-y-1 pt-1 text-[11px] text-[#94A3B8]">
            <div className="flex items-center gap-1.5 text-white/90">
              <Check className="w-3 h-3 text-[#10B981] shrink-0" />
              <span>SANS 10142-1-2 CoC Certified</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Truck className="w-3 h-3 text-[#00D2FF] shrink-0" />
              <span>Free Insured National Delivery</span>
            </div>
          </div>
        </div>

        {/* 3. HARDWARE SPECIFICATIONS MINI-GRID */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
          {product.specs[0] && (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold truncate">
                {product.specs[0].label}
              </span>
              <span className="text-white font-mono font-bold truncate block mt-0.5">
                {product.specs[0].value}
              </span>
            </div>
          )}

          {product.pricePerWpZAR ? (
            <div className="truncate">
              <span className="text-[#00D2FF] text-[10px] uppercase block font-semibold">Rate / Watt</span>
              <span className="text-white font-mono font-bold truncate block mt-0.5">
                R {(includeVat ? product.pricePerWpZAR * 1.15 : product.pricePerWpZAR).toFixed(3)}/Wp
              </span>
            </div>
          ) : product.specs[1] ? (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold truncate">
                {product.specs[1].label}
              </span>
              <span className="text-white font-mono font-bold truncate block mt-0.5">
                {product.specs[1].value}
              </span>
            </div>
          ) : (
            <div className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold">Dispatch QA</span>
              <span className="text-emerald-400 font-mono font-bold truncate block mt-0.5">
                1000V Bench Tested
              </span>
            </div>
          )}
        </div>

        {/* 4. REAL STORE PRICING BLOCK */}
        <div className="space-y-3 pt-1 border-t border-[#1E2530]">
          
          <div className="space-y-0.5">
            {/* Suggested Retail Strike-through */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#64748B] line-through">
                R {(includeVat ? msrpPrice * 1.15 : msrpPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 text-[10px]">
                Save R {savings.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Main Current Price */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight">
                R {displayedPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#00D2FF] font-bold">
                {includeVat ? 'Incl. 15% VAT' : 'Excl. 15% VAT'}
              </span>
            </div>

            {/* Secondary VAT Footnote */}
            <div className="text-[10px] font-mono text-[#64748B]">
              {includeVat 
                ? `(R ${secondaryPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Excl. VAT)`
                : `(R ${secondaryPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Incl. 15% VAT)`
              }
            </div>
          </div>

          {/* 5. STORE SHOPPING ACTIONS: QUANTITY SELECTOR & ADD TO CART */}
          <div className="space-y-2 pt-1">
            
            <div className="flex items-center gap-2">
              {/* Stepper Quantity Control */}
              <div className="flex items-center bg-[#05070A] border border-[#1E2530] rounded-xl overflow-hidden shrink-0 h-11 shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 h-full text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                  title="Decrease Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 text-center bg-transparent text-sm font-mono font-extrabold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 h-full text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Store Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 h-11 px-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  addedToCartToast
                    ? 'bg-[#10B981] text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]'
                    : !product.inStock
                    ? 'bg-white/5 border border-white/10 text-[#64748B] cursor-not-allowed'
                    : 'bg-[#00D2FF] hover:bg-[#38BDF8] text-black hover:scale-[1.02] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                }`}
              >
                {addedToCartToast ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : !product.inStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Secondary Store Action: View Details / Active Quote Builder */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-white text-xs font-mono rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Product Specifications &amp; Datasheet</span>
              </button>

              {activeQuote && (
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="py-2 px-3 bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/40 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  title="Add to active contractor quote"
                >
                  <Plus className="w-3 h-3" />
                  <span>Quote</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
