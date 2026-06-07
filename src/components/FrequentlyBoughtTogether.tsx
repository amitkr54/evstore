"use client";

import { ShoppingCart, Package } from "lucide-react";
import { Product, getFrequentlyBoughtTogether, calculateDiscount } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface FrequentlyBoughtTogetherProps {
  product: Product;
}

export default function FrequentlyBoughtTogether({ product }: FrequentlyBoughtTogetherProps) {
  const { addItem, items } = useCart();
  const relatedProducts = getFrequentlyBoughtTogether(product.id);

  if (relatedProducts.length === 0) return null;

  const allProducts = [product, ...relatedProducts];
  const bundleTotal = allProducts.reduce((sum, p) => sum + p.salePrice, 0);
  const bundleDiscount = Math.round(bundleTotal * 0.08); // 8% bundle discount
  const bundlePrice = bundleTotal - bundleDiscount;

  const handleAddBundle = () => {
    allProducts.forEach((p) => addItem(p));
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "rgba(168,85,247,0.06)" }}>
        <div className="flex items-center gap-2">
          <Package size={18} className="text-purple-400" />
          <h3 className="font-bold text-white section-heading text-base">Frequently Bought Together</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">Customers who bought this also bought</p>
      </div>

      {/* Products Row */}
      <div className="p-5">
        <div className="flex items-center gap-3 flex-wrap">
          {allProducts.map((p, index) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-20 h-20 rounded-xl object-cover"
                    style={{ border: p.id === product.id ? "2px solid rgba(168,85,247,0.5)" : "1px solid var(--border)" }}
                  />
                  {p.id === product.id && (
                    <span className="absolute -top-2 -right-2 badge badge-purple text-[9px]">This item</span>
                  )}
                </div>
                <div className="text-center max-w-[80px]">
                  <p className="text-xs text-gray-300 font-medium leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-green-400 font-bold text-xs mt-0.5">₹{p.salePrice.toLocaleString()}</p>
                </div>
              </div>
              {index < allProducts.length - 1 && (
                <span className="text-gray-600 font-bold text-lg flex-shrink-0">+</span>
              )}
            </div>
          ))}
        </div>

        {/* Bundle Price & CTA */}
        <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">₹{bundlePrice.toLocaleString()}</span>
                <span className="text-gray-500 line-through text-sm">₹{bundleTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-purple-400 font-semibold">
                🎁 Bundle Deal — Save ₹{bundleDiscount} (8% off)
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{allProducts.length} items in this combo</p>
            </div>
            <button
              id={`bundle-add-${product.id}`}
              onClick={handleAddBundle}
              className="btn-primary"
              style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
            >
              <ShoppingCart size={16} />
              Add Combo to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
