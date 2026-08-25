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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Shop Header */}
      <div className="border-b border-[#24302A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold block mb-1">
            Certified Hardware Store
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Solar Equipment, Without the Guesswork.
          </h1>
          <p className="text-xs sm:text-sm text-[#9EADA5] mt-1 max-w-2xl">
            Direct sales of Tier-1 solar panels, hybrid inverters, lithium iron phosphate batteries, and SABS-compliant protection hardware.
          </p>
        </div>

        <div className="text-xs font-mono text-[#9EADA5] bg-[#141A17] border border-[#24302A] px-4 py-2 rounded shrink-0">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> verified components
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141A17] border border-[#24302A] rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, wattage, or SKU..."
              className="w-full bg-[#0E1311] border border-[#24302A] rounded pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-[#6B7B73] focus:border-[#286D58]"
            />
          </div>

          {/* Brand Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs font-mono text-white focus:border-[#286D58]"
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
              className="w-full bg-[#0E1311] border border-[#24302A] rounded px-3 py-2 text-xs font-mono text-white focus:border-[#286D58]"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1B2420]">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#1B4D3E] text-white border border-[#286D58] font-semibold'
                  : 'bg-[#0E1311] text-[#9EADA5] border border-[#24302A] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#141A17] border border-[#24302A] rounded-lg">
          <p className="text-sm text-[#9EADA5]">No hardware matches your active filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBrand('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-[#286D58] hover:underline font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
