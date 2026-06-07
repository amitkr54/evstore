"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, ArrowRight, ChevronRight } from "lucide-react";
import { brands, products, getBestsellers } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import BrandLogo from "@/components/BrandLogo";

const trustBadges = [
  { icon: "🔒", title: "Secure UPI Payment", desc: "Zero transaction fees, direct bank transfer" },
  { icon: "🚚", title: "Fast Pan-India Delivery", desc: "Dispatched within 24 hours" },
  { icon: "✅", title: "100% Fitment Guarantee", desc: "Perfect fit or full refund" },
  { icon: "↩️", title: "Easy Replacement", desc: "Hassle-free 7-day return policy" },
];

const stats = [
  { value: "15,000+", label: "Happy Customers" },
  { value: "98%", label: "Fitment Accuracy" },
  { value: "4.7★", label: "Avg. Rating" },
  { value: "₹399", label: "Free Shipping Above" },
];

export default function HomePage() {
  const bestsellers = getBestsellers().slice(0, 8); // Top 8 bestsellers

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,230,118,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(79,158,255,0.08) 0%, transparent 50%)" }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold text-green-400" style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            1,200+ Orders Delivered This Month
          </div>
          <h1 className="section-heading text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-6 max-w-4xl mx-auto">
            Premium EV Spare Parts<br />
            <span className="gradient-text-green">&amp; Accessories</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Fast delivery across India. Perfect fitment guaranteed for <strong className="text-white">OLA</strong>, <strong className="text-white">TVS</strong>, <strong className="text-white">Ather</strong> &amp; <strong className="text-white">Bajaj Chetak</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalog" id="shop-now-btn" className="btn-primary text-base px-8 py-3.5 rounded-xl">
              <Zap size={18} fill="currentColor" /> Shop Now
            </Link>
            <Link href="/catalog" className="btn-secondary text-base px-8 py-3.5 rounded-xl">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-light rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND SELECTION GRID */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="badge badge-purple mb-3">Shop by Brand</span>
          <h2 className="section-heading text-3xl sm:text-4xl text-white mt-2">Select Your <span className="gradient-text-blue">EV Brand</span></h2>
          <p className="text-gray-500 mt-2 text-sm">Every product is precision-matched to your specific model</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand) => {
            const count = products.filter((p) => p.brand === brand.id).length;
            return (
              <Link
                key={brand.id}
                id={`brand-filter-${brand.id}`}
                href={`/catalog?brand=${brand.id}`}
                className="card-hover rounded-2xl p-5 text-left group transition-all duration-200"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${brand.color}15`, border: `1px solid ${brand.color}30` }}>
                  <BrandLogo logo={brand.logo} className="w-7 h-7" color={brand.color} />
                </div>
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{brand.displayName}</h3>
                <p className="text-xs text-gray-500 mt-1">{brand.models.join(", ")}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-semibold" style={{ color: brand.color }}>{count} Products</span>
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: brand.color }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading text-2xl sm:text-3xl text-white">
              🔥 Bestselling Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">{bestsellers.length} products</p>
          </div>
          <Link href="/catalog" className="hidden sm:flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors font-semibold">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-14" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-heading text-3xl sm:text-4xl text-white">Shop with <span className="gradient-text-green">Confidence</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="rounded-2xl p-5 text-center card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1.5">{badge.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading text-3xl sm:text-4xl text-white">Shop by <span className="gradient-text-orange">Category</span></h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Cables & Wires", value: "cables", icon: "🔌", color: "#ff6b35", desc: "Brake & accelerator cables" },
            { label: "Screen Guards", value: "protection", icon: "🛡️", color: "#4f9eff", desc: "9H tempered & nano glass" },
            { label: "Crash Guards", value: "guards", icon: "🦺", color: "#a855f7", desc: "Full-body metal protection" },
            { label: "Comfort Accessories", value: "comfort", icon: "💺", color: "#00e676", desc: "Mats, footrests & covers" },
            { label: "Charger Accessories", value: "charger", icon: "⚡", color: "#facc15", desc: "Wall mounts & dust caps" },
            { label: "Utility & Holders", value: "utility", icon: "🔧", color: "#64748b", desc: "Mobile holders & plates" },
            { label: "Scooter Covers", value: "covers", icon: "🏍️", color: "#ec4899", desc: "Waterproof UV covers" },
            { label: "Combo Kits", value: "combo", icon: "📦", color: "#14b8a6", desc: "All-in-one protection" },
            { label: "Spare Parts", value: "spares", icon: "⚙️", color: "#f43f5e", desc: "Belts & shock absorbers" },
          ].map((cat) => (
            <Link key={cat.value} href={`/catalog?category=${cat.value}`} id={`cat-${cat.value}`}
              className="card-hover rounded-2xl p-5 text-center group" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-4xl mb-3 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{cat.label}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-10 px-4 mb-8">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0d1f1a, #0a2618)", border: "1px solid rgba(0,230,118,0.2)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(0,230,118,0.12) 0%, transparent 60%)" }} />
          <div className="relative z-10 px-8 py-10 sm:flex items-center justify-between gap-6">
            <div className="mb-6 sm:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💬</span>
                <span className="badge badge-green">WhatsApp Orders</span>
              </div>
              <h3 className="section-heading text-2xl sm:text-3xl text-white font-black mb-2">Order directly on WhatsApp</h3>
              <p className="text-gray-400 text-sm">Add items to cart, fill your address, and place your order — zero platform fees.</p>
            </div>
            <div className="flex-shrink-0">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" id="whatsapp-cta-btn" className="btn-whatsapp sm:w-auto px-8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
