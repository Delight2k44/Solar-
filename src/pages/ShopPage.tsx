import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { Search, Filter, ShoppingBag, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'solar-panels', label: 'Solar Panels' },
    { id: 'inverters', label: 'Hybrid Inverters' },
    { id: 'batteries', label: 'LiFePO4 Batteries' },
    { id: 'complete-kits', label: 'Complete Solar Kits' },
    { id: 'mounting-equipment', label: 'Mounting & Rails' },
    { id: 'protection-accessories', label: 'Protection & Enclosures' },
  ];

  const brands = ['all', 'Deye', 'Sunsynk', 'Freedom Won', 'Dyness', 'Canadian Solar', 'JA Solar', 'Renusol', 'Kinetix Pre-Engineered Systems', 'Kinetix Electrical'];

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceZAR - b.priceZAR;
    if (sortBy === 'price-desc') return b.priceZAR - a.priceZAR;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-24 space-y-10 text-white font-sans selection:bg-[#00D2FF] selection:text-black">
      {/* Shop Header */}
      <div className="border-b border-[#1E2530] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] font-bold block">
            Certified Hardware Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Solar Equipment Store.
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
            Direct sales of Tier-1 solar panels, hybrid inverters, lithium iron phosphate batteries, and SABS-compliant protection hardware.
          </p>
        </div>

        <div className="text-xs font-mono text-[#94A3B8] bg-[#0D1117] border border-[#1E2530] px-4 py-2 rounded-xl shrink-0">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> verified components
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-mono text-xs">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, wattage, or SKU..."
              className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-[#64748B] focus:border-[#00D2FF] focus:outline-none"
            />
          </div>

          {/* Brand Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-2.5 text-white focus:border-[#00D2FF] focus:outline-none"
            >
              <option value="all">All Manufacturers</option>
              {brands.filter(b => b !== 'all').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-2.5 text-white focus:border-[#00D2FF] focus:outline-none"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Selector (Mobile Dropdown & Desktop Pills) */}
        <div className="pt-2 border-t border-[#1E2530]">
          {/* Mobile Category Dropdown */}
          <div className="block sm:hidden">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-[#05070A] border border-[#1E2530] rounded-xl px-3.5 py-2.5 text-[#00D2FF] text-xs font-semibold focus:border-[#00D2FF] outline-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-[#0D1117] text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00D2FF] text-black shadow-md'
                    : 'bg-[#05070A] text-[#94A3B8] border border-[#1E2530] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-[#0D1117] border border-[#1E2530] rounded-2xl space-y-4 font-sans">
          <div className="w-16 h-16 rounded-2xl bg-[#161B22] border border-[#1E2530] flex items-center justify-center mx-auto text-[#64748B]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-tight">No hardware found matching filters</h3>
          <p className="text-xs text-[#94A3B8]">Try adjusting your search keywords or switching category filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#00D2FF] hover:bg-[#38BDF8] text-black font-bold uppercase text-xs rounded-xl transition-all shadow-md"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
