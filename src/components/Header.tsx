"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Zap, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { brands } from "@/data/products";

import BrandLogo from "@/components/BrandLogo";

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-lg tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  EV<span className="gradient-text-green">Parts</span>
                </span>
                <span className="text-xs text-gray-500 block -mt-1 leading-none">India</span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products, brands, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark pl-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}`}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {brand.displayName.split(" ")[0]}
                </Link>
              ))}
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-3 ml-4">
              <button
                id="cart-btn"
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl glass-light hover:bg-white/10 transition-all duration-200"
                aria-label="Open cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center animate-bounce">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl glass-light hover:bg-white/10 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/5 pb-4">
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark pl-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery)}`;
                      setMobileMenuOpen(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="px-4 mt-2 grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl glass-light hover:bg-white/10 transition-all text-sm font-medium"
                >
                  <BrandLogo logo={brand.logo} className="w-5 h-5 flex-shrink-0" color={brand.color} />
                  {brand.displayName}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
