"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Zap, Shield } from "lucide-react";
import { Product, calculateDiscount } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

const brandColors: Record<string, string> = {
  ola: "#E8272A",
  tvs: "#0052A5",
  ather: "#00A651",
  bajaj: "#1F3A8A",
};

const brandNames: Record<string, string> = {
  ola: "OLA Electric",
  tvs: "TVS iQube",
  ather: "Ather Energy",
  bajaj: "Bajaj Chetak",
};

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = calculateDiscount(product.salePrice);
  const brandColor = brandColors[product.brand] || "#4f9eff";

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <div className="card-hover rounded-2xl overflow-hidden group" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
    }}>
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="badge badge-orange">🔥 Bestseller</span>
          )}
          {product.isNew && (
            <span className="badge badge-green">✨ New</span>
          )}
        </div>
        {/* Discount badge */}
        <div className="absolute top-3 right-3">
          <span className="badge badge-red font-black">Save {discount}%</span>
        </div>
        {/* Brand label */}
        <div className="absolute bottom-3 left-3">
          <span
            className="badge text-white"
            style={{
              background: `${brandColor}30`,
              border: `1px solid ${brandColor}60`,
              color: brandColor === "#0052A5" ? "#6ba3f5" : brandColor,
            }}
          >
            {brandNames[product.brand]}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Model compatibility */}
        <p className="text-xs text-gray-500 mb-1 truncate">
          Fits: {product.compatibleModels.slice(0, 2).join(", ")}
          {product.compatibleModels.length > 2 && ` +${product.compatibleModels.length - 2} more`}
        </p>

        {/* Product name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-white leading-snug mb-1 hover:text-green-400 transition-colors line-clamp-2" style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem" }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {stars.map((filled, i) => (
              <Star
                key={i}
                size={12}
                className={filled ? "star-filled" : "star-empty"}
                fill={filled ? "#fbbf24" : "transparent"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">₹{product.salePrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-600 line-through">MRP ₹{Math.round(product.salePrice * 1.2).toLocaleString()}</p>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={() => addItem(product)}
            className="btn-primary py-2.5 px-4 text-sm rounded-xl"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Fitment guarantee badge */}
        {variant === "default" && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400/80">
            <Shield size={12} />
            <span>100% Fitment Guaranteed</span>
          </div>
        )}
      </div>
    </div>
  );
}
