import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, brands } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const brand = brands.find((b) => b.id === product.brand);
  const brandName = brand?.displayName || product.brand;

  const title = `${product.name} for ${brandName} | EVParts India`;
  const description = `${product.description}. 100% Fitment Guaranteed for ${product.compatibleModels.join(", ")}. Buy online from EVParts India.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${brandName} accessories, ${product.compatibleModels.join(", ")}, EV spare parts, electric scooter parts`,
    openGraph: {
      title,
      description,
      images: product.images.map((img) => ({ url: img, alt: product.name })),
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const brand = brands.find((b) => b.id === product.brand);
  const brandName = brand?.displayName || product.brand;

  // Schema.org Structured Data for Google Shopping / Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.salePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://evpartsindia.vercel.app/product/${product.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} brand={brand} />
    </>
  );
}
