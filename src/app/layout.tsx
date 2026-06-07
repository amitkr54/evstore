import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "EVParts India — Premium EV Accessories & Spare Parts",
  description:
    "Shop premium EV accessories and spare parts for OLA Electric, TVS iQube, Ather Energy, and Bajaj Chetak. 100% fitment guaranteed. Fast delivery across India.",
  keywords: "EV accessories, OLA S1 parts, Ather 450X accessories, TVS iQube, Bajaj Chetak spare parts, electric scooter accessories India",
  openGraph: {
    title: "EVParts India — Premium EV Accessories",
    description: "Premium aftermarket accessories and spare parts for Indian electric scooters",
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
