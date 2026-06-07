import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All EV Accessories & Spare Parts Online | EVParts India",
  description: "Browse our full catalog of premium EV scooter parts and accessories. Shop crash guards, screen protectors, cables, and more for OLA, TVS, Ather, and Bajaj.",
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
