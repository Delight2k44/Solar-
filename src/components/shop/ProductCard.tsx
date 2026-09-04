import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Eye, ShieldCheck, Check, Plus, Wrench } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/40 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all shadow-lg font-sans">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 bg-[#161B22] overflow-hidden border-b border-[#1E2530]">
        <img
          src={product.image || '/hero-solar-home.jpg'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
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
          {product.specs.slice(0, 2).map((spec, idx) => (
            <div key={idx} className="truncate">
              <span className="text-[#64748B] text-[10px] uppercase block font-semibold">{spec.label}</span>
              <span className="text-[#E6ECE8] font-medium truncate block mt-0.5">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Pricing and CTAs */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#94A3B8]">ZAR (Excl. VAT):</span>
            <span className="text-base font-mono font-extrabold text-[#10B981]">
              R {product.priceZAR.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProduct(product)}
              className="py-2.5 px-3 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#00D2FF] text-[#94A3B8] hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Details</span>
            </button>

            <button
              onClick={() => addToCart(product, 1, false)}
              className="py-2.5 px-3 bg-[#00D2FF] hover:bg-[#38BDF8] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
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
