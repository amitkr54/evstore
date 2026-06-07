export type Category = "cables" | "protection" | "comfort" | "guards" | "charger" | "utility" | "spares" | "combo" | "covers";

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  compatibleModels: string[];
  category: Category;
  salePrice: number;
  wholesaleCost: number;
  description: string;
  longDescription: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  frequentlyBoughtWith: string[];
  isBestseller?: boolean;
  isNew?: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export type Brand = string;

export interface BrandInfo {
  id: Brand;
  name: string;
  displayName: string;
  models: string[];
  color: string;
  gradient: string;
  logo: string;
}

import data from "./data.json";

export const brands: BrandInfo[] = data.brands as BrandInfo[];
export const products: Product[] = data.products as Product[];

export const SHIPPING_THRESHOLD = data.settings.shippingThreshold;
export const SHIPPING_FEE = data.settings.shippingFee;
export const WHATSAPP_NUMBER = data.settings.whatsappNumber;
export const UPI_ID = data.settings.upiId;
export const STORE_NAME = data.settings.storeName;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByBrand(brand: Brand): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getFrequentlyBoughtTogether(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return product.frequentlyBoughtWith
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

export function calculateDiscount(salePrice: number): number {
  const mrp = Math.round(salePrice * 1.3);
  return Math.round(((mrp - salePrice) / mrp) * 100);
}
