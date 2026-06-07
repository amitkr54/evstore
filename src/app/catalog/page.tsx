"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";
import { products, brands, Brand, Category, calculateDiscount } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";

const categories = [
  { value: "cables", label: "Cables & Wires", icon: "🔌" },
  { value: "protection", label: "Screen Protection", icon: "🛡️" },
  { value: "guards", label: "Crash Guards", icon: "🦺" },
  { value: "comfort", label: "Comfort & Mats", icon: "💺" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
  { value: "rating", label: "Highest Rated" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 4000]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 4000]);
    setSearchQuery("");
    setSortBy("popular");
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.compatibleModels.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter(
      (p) => p.salePrice >= priceRange[0] && p.salePrice <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "discount":
        result.sort((a, b) => calculateDiscount(b.salePrice) - calculateDiscount(a.salePrice));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedBrands, selectedCategories, priceRange, sortBy]);

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 4000 ||
    searchQuery.trim() !== "";

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h3 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => {
            const count = products.filter((p) => p.brand === brand.id).length;
            const isSelected = selectedBrands.includes(brand.id);
            return (
              <button
                key={brand.id}
                id={`filter-brand-${brand.id}`}
                onClick={() => toggleBrand(brand.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-sm"
                style={{
                  background: isSelected ? `${brand.color}18` : "transparent",
                  border: isSelected ? `1px solid ${brand.color}50` : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <BrandLogo logo={brand.logo} className="w-4 h-4 flex-shrink-0" color={brand.color} />
                  <span className={isSelected ? "text-white font-semibold" : "text-gray-400"}>{brand.displayName}</span>
                </div>
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Part Type</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.value).length;
            const isSelected = selectedCategories.includes(cat.value);
            return (
              <button
                key={cat.value}
                id={`filter-cat-${cat.value}`}
                onClick={() => toggleCategory(cat.value)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-sm"
                style={{
                  background: isSelected ? "rgba(79,158,255,0.1)" : "transparent",
                  border: isSelected ? "1px solid rgba(79,158,255,0.4)" : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className={isSelected ? "text-white font-semibold" : "text-gray-400"}>{cat.label}</span>
                </div>
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Price Range</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={4000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-green-400"
          />
          <div className="grid grid-cols-3 gap-1.5">
            {[[0, 500], [500, 1500], [1500, 4000]].map(([min, max]) => (
              <button
                key={`${min}-${max}`}
                onClick={() => setPriceRange([min, max])}
                className="text-xs py-1.5 rounded-lg transition-all font-medium"
                style={{
                  background: priceRange[0] === min && priceRange[1] === max ? "rgba(0,230,118,0.15)" : "var(--bg-card)",
                  border: priceRange[0] === min && priceRange[1] === max ? "1px solid rgba(0,230,118,0.4)" : "1px solid var(--border)",
                  color: priceRange[0] === min && priceRange[1] === max ? "#00e676" : "#9090a8",
                }}
              >
                ₹{min}–₹{max}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="w-full btn-secondary text-sm py-2.5 text-red-400 border-red-500/20 hover:border-red-500/40">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="section-heading text-3xl sm:text-4xl text-white mb-2">All EV Accessories</h1>
        <p className="text-gray-500 text-sm">Premium aftermarket parts for Indian electric scooters</p>
      </div>

      {/* Top Bar: Search + Sort + Filter Toggle */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="catalog-search"
            type="text"
            placeholder="Search by name, brand, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark pl-9"
          />
        </div>
        <div className="relative">
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-dark pr-8 appearance-none cursor-pointer"
            style={{ minWidth: "180px" }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: "#16161f" }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <button
          id="toggle-filters-btn"
          onClick={() => setFilterOpen(!filterOpen)}
          className={`btn-secondary flex items-center gap-2 lg:hidden ${hasActiveFilters ? "border-green-500/40 text-green-400" : ""}`}
        >
          <SlidersHorizontal size={16} />
          Filters {hasActiveFilters && `(${selectedBrands.length + selectedCategories.length})`}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h2>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 transition-colors">Clear</button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {filterOpen && (
          <>
            <div className="overlay lg:hidden" onClick={() => setFilterOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden slide-in-right overflow-y-auto p-5" style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-lg glass-light flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <FilterPanel />
            </div>
          </>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-5">
            Showing <span className="text-white font-semibold">{filtered.length}</span> products
            {hasActiveFilters && <button onClick={clearFilters} className="ml-3 text-xs text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"><X size={11} />Clear filters</button>}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white font-semibold mb-1">No products found</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading catalog...</p>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
