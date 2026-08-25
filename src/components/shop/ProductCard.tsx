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
    <div className="bg-[#141A17] border border-[#24302A] rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#31423A] transition-all">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 bg-[#0E1311] overflow-hidden border-b border-[#24302A]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Brand & Stock Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 bg-[#0E1311]/90 backdrop-blur-none border border-[#24302A] text-[10px] font-mono text-[#E6ECE8] uppercase font-semibold rounded">
            {product.brand}
          </span>
          {product.ratingKw && (
            <span className="px-2 py-0.5 bg-[#1B4D3E]/90 border border-[#286D58] text-[10px] font-mono text-white font-bold rounded">
              {product.ratingKw} kW
            </span>
          )}
          {product.capacityKwh && (
            <span className="px-2 py-0.5 bg-[#1B4D3E]/90 border border-[#286D58] text-[10px] font-mono text-white font-bold rounded">
              {product.capacityKwh} kWh
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5">
          {product.inStock ? (
            <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-[10px] font-mono font-medium rounded">
              In Stock ({product.stockCount})
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-300 text-[10px] font-mono rounded">
              Backorder
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase text-[#6B7B73] mb-1">
            SKU: {product.sku} • {product.warrantyYears} Year Warranty
          </div>
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-white group-hover:text-[#286D58] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#9EADA5] line-clamp-2 mt-1.5 leading-relaxed">
            {product.summary}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-[#1B2420] text-[11px] font-mono">
          {product.specs.slice(0, 2).map((spec, idx) => (
            <div key={idx} className="truncate">
              <span className="text-[#6B7B73] text-[9px] uppercase block">{spec.label}</span>
              <span className="text-[#E6ECE8] font-medium truncate block">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Pricing and CTAs */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono text-[#9EADA5]">ZAR (Excl. VAT):</span>
            <span className="text-base font-mono font-bold text-white">
              R {product.priceZAR.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProduct(product)}
              className="py-2 px-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-[#9EADA5] hover:text-white text-xs font-mono font-medium rounded flex items-center justify-center gap-1.5 transition-colors uppercase"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => addToCart(product, 1, false)}
              className="py-2 px-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-colors uppercase"
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
