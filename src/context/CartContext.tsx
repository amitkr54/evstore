"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product, SHIPPING_THRESHOLD, SHIPPING_FEE, WHATSAPP_NUMBER, STORE_NAME } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  mobile: string;
  bikeModel: string;
  address: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  checkoutStep: 0 | 1 | 2; // 0=cart, 1=customer form, 2=payment
  customerInfo: CustomerInfo;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCheckoutStep: (step: 0 | 1 | 2) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  shippingProgress: number;
  generateWhatsAppLink: () => string;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<0 | 1 | 2>(0);
  const [customerInfo, setCustomerInfoState] = useState<CustomerInfo>({
    name: "",
    mobile: "",
    bikeModel: "",
    address: "",
  });

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep(0);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCheckoutStep(0);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    setCheckoutStep(0);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const setCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
    setCustomerInfoState((prev) => ({ ...prev, ...info }));
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  const generateWhatsAppLink = useCallback(() => {
    const orderLines = items
      .map(
        (item) =>
          `• ${item.product.name} (×${item.quantity}) — ₹${item.product.salePrice * item.quantity}`
      )
      .join("\n");

    const message = `🛒 *New Order from ${STORE_NAME}*\n\n` +
      `👤 *Name:* ${customerInfo.name}\n` +
      `📱 *Mobile:* ${customerInfo.mobile}\n` +
      `🏍️ *Bike Model:* ${customerInfo.bikeModel}\n` +
      `📍 *Address:* ${customerInfo.address}\n\n` +
      `─────────────────\n` +
      `*Order Details:*\n${orderLines}\n\n` +
      `─────────────────\n` +
      `🚚 *Shipping:* ₹${shippingFee}\n` +
      `💰 *Total Payable:* ₹${total}\n\n` +
      `Please confirm availability and share payment details. Thank you! 🙏`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, customerInfo, shippingFee, total]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        checkoutStep,
        customerInfo,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        setCheckoutStep,
        setCustomerInfo,
        subtotal,
        shippingFee,
        total,
        itemCount,
        shippingProgress,
        generateWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
