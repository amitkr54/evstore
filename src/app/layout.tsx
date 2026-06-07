import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Buy EV Scooter Accessories Online India — OLA, TVS, Ather, Bajaj | EVParts India",
  description:
    "Shop 89+ premium accessories for OLA S1, TVS iQube, Ather 450X, Bajaj Chetak, Hero Vida & Ampere Nexus. Screen guards, crash guards, seat covers. Fast delivery. 100% fitment.",
  keywords: "EV accessories, OLA S1 parts, Ather 450X accessories, TVS iQube, Bajaj Chetak spare parts, Hero Vida accessories, Ampere Nexus parts, electric scooter accessories India",
  openGraph: {
    title: "EVParts India — Premium EV Accessories",
    description: "Shop 89+ premium aftermarket accessories and spare parts for Indian electric scooters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
