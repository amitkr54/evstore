"use client";

import Link from "next/link";
import { Zap, Globe, Play, Phone, Mail, MapPin } from "lucide-react";
import { brands } from "@/data/products";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className="font-black text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
                EV<span className="gradient-text-green">Parts</span> India
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              India&apos;s trusted destination for premium EV accessories and spare parts. 100% fitment guaranteed.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-pink-400">
                <Globe size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-red-400">
                <Play size={16} />
              </a>
              <a href="tel:+919876543210" aria-label="Phone" className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-green-400">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Shop by Brand</h4>
            <ul className="space-y-2">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`/catalog?brand=${brand.id}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <BrandLogo logo={brand.logo} className="w-4 h-4 flex-shrink-0" color={brand.color} />
                    {brand.displayName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {[
                { label: "Brake & Cables", value: "cables" },
                { label: "Screen Protection", value: "protection" },
                { label: "Crash Guards", value: "guards" },
                { label: "Comfort & Mats", value: "comfort" },
              ].map((cat) => (
                <li key={cat.value}>
                  <Link
                    href={`/catalog?category=${cat.value}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <Phone size={14} className="mt-0.5 flex-shrink-0 text-green-400" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <Mail size={14} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <a href="mailto:support@evpartsindia.com" className="hover:text-white transition-colors">support@evpartsindia.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
                <span>Ships Pan-India within 3–7 business days</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-glow mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 EVParts India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">🔒 Secure UPI Payment</span>
            <span className="flex items-center gap-1">🚚 Fast Pan-India Delivery</span>
            <span className="flex items-center gap-1">✅ 100% Fitment Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
