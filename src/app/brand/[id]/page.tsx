import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { brands, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import BrandLogo from "@/components/BrandLogo";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const brand = brands.find((b) => b.id === id);
  
  if (!brand) return {};

  const title = `${brand.displayName} Electric Scooter Accessories Buy Online | EVParts`;
  const description = `Shop ${brand.displayName} scooter accessories online. 100% fitment guaranteed. Fast delivery across India. Buy ${brand.models.join(", ")} parts today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { id } = await params;
  const brand = brands.find((b) => b.id === id);
  
  if (!brand) notFound();

  const brandProducts = products.filter((p) => p.brand === brand.id);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-10">
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${brand.color}15`, border: `1px solid ${brand.color}30` }}>
          <BrandLogo logo={brand.logo} className="w-14 h-14" color={brand.color} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Shop <span style={{ color: brand.color }}>{brand.displayName}</span> Accessories
          </h1>
          <p className="text-gray-400 text-lg">
            Precision-matched aftermarket parts for {brand.models.join(", ")}.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 font-medium">{brandProducts.length} products found</p>
        <Link href={`/catalog?brand=${brand.id}`} className="text-sm flex items-center gap-1 hover:text-white transition-colors" style={{ color: brand.color }}>
          Filter & Sort <ArrowRight size={16} />
        </Link>
      </div>

      {brandProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-light rounded-3xl border border-white/5">
          <p className="text-gray-400 text-lg">No products found for this brand yet.</p>
        </div>
      )}
    </div>
  );
}
