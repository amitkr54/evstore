"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart, Star, Shield, Truck, ChevronLeft,
  ChevronRight, CheckCircle, Zap
} from "lucide-react";
import { Product, BrandInfo, calculateDiscount } from "@/data/products";
import { useCart } from "@/context/CartContext";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import BrandLogo from "@/components/BrandLogo";

interface ProductDetailClientProps {
  product: Product;
  brand?: BrandInfo;
}

export default function ProductDetailClient({ product, brand }: ProductDetailClientProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center", transform: "scale(1)" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
  };
  const [added, setAdded] = useState(false);

  const discount = calculateDiscount(product.salePrice);
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const mrp = Math.round(product.salePrice * 1.3);
  const savings = mrp - product.salePrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
        <ChevronRight size={12} />
        <Link href={`/brand/${product.brand}`} className="hover:text-white transition-colors capitalize">
          {brand?.displayName}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-400 truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div 
            className="relative rounded-2xl overflow-hidden cursor-zoom-in" 
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", aspectRatio: "4/3" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.images[activeImage]}
              alt={`${product.name} - View ${activeImage + 1}`}
              className="w-full h-full object-cover transition-transform duration-100 ease-linear"
              style={zoomStyle}
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestseller && <span className="badge badge-orange">🔥 Bestseller</span>}
              {product.isNew && <span className="badge badge-green">✨ New Arrival</span>}
            </div>
            <div className="absolute top-4 right-4">
              <span className="badge badge-red text-sm font-black">Save {discount}%</span>
            </div>
            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((p) => Math.max(0, p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
                  disabled={activeImage === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImage((p) => Math.min(product.images.length - 1, p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
                  disabled={activeImage === product.images.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                  style={{ border: activeImage === idx ? "2px solid #00e676" : "2px solid var(--border)", opacity: activeImage === idx ? 1 : 0.5 }}
                  aria-label={`View product image ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          {/* Brand badge */}
          <div className="flex items-center gap-2">
            {brand && (
              <span className="badge text-white flex items-center gap-1.5" style={{ background: `${brand.color}25`, border: `1px solid ${brand.color}50`, color: brand.color === "#0052A5" ? "#6ba3f5" : brand.color }}>
                <BrandLogo logo={brand.logo} className="w-4 h-4" color={brand.color === "#0052A5" ? "#6ba3f5" : brand.color} />
                <span>{brand.displayName}</span>
              </span>
            )}
            {product.stock < 20 && (
              <span className="badge badge-red">⚡ Only {product.stock} left</span>
            )}
          </div>

          {/* Title */}
          <h1 className="section-heading text-2xl sm:text-3xl text-white leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" aria-label={`${product.rating} out of 5 stars`}>
              {stars.map((filled, i) => (
                <Star key={i} size={16} className={filled ? "star-filled" : "star-empty"} fill={filled ? "#fbbf24" : "transparent"} />
              ))}
            </div>
            <span className="text-white font-bold">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-black text-white">₹{product.salePrice.toLocaleString()}</span>
              <span className="text-gray-500 line-through text-lg mb-1">₹{mrp.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400 font-semibold">You save ₹{savings.toLocaleString()} ({discount}% off)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Inclusive of all taxes • Free shipping on orders above ₹399</p>
          </div>

          {/* Fitment Guarantee */}
          <div className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: "rgba(0,230,118,0.07)", border: "1px solid rgba(0,230,118,0.2)" }}>
            <Shield size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-bold text-sm">100% Fitment Guarantee</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Guaranteed to fit: <span className="text-white font-medium">{product.compatibleModels.join(", ")}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">{product.longDescription}</p>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Brand", value: brand?.displayName || product.brand },
              { label: "Compatible", value: product.compatibleModels.join(", ") },
              { label: "Category", value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
              { label: "In Stock", value: `${product.stock} units` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              id={`pdp-add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`btn-primary flex-1 py-3.5 transition-all ${added ? "opacity-80" : ""}`}
            >
              {added ? <><CheckCircle size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
            <button
              id={`pdp-buy-now-${product.id}`}
              onClick={() => { addItem(product); }}
              className="btn-secondary flex-1 py-3.5"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5"><Truck size={13} className="text-blue-400" /> Dispatched in 24 hours</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" /> 7-Day Easy Returns</span>
            <span className="flex items-center gap-1.5">🔒 Secure UPI Payment</span>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="mb-12">
        <FrequentlyBoughtTogether product={product} />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Tags</p>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="badge badge-blue capitalize">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
