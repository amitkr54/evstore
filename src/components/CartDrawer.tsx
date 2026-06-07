"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle, ChevronRight, ChevronLeft, Copy } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SHIPPING_THRESHOLD, UPI_ID, STORE_NAME } from "@/data/products";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    itemCount,
    shippingProgress,
    checkoutStep,
    setCheckoutStep,
    customerInfo,
    setCustomerInfo,
    generateWhatsAppLink,
    clearCart,
  } = useCart();

  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep(1);
  };

  const handlePlaceOrder = () => {
    const { name, mobile, bikeModel, address } = customerInfo;
    if (!name.trim() || !mobile.trim() || !bikeModel.trim() || !address.trim()) {
      setFormError("Please fill in all fields before placing the order.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ""))) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setFormError("");
    setCheckoutStep(2);
  };

  const handleWhatsApp = () => {
    const link = generateWhatsAppLink();
    window.open(link, "_blank");
  };

  const handleOrderSuccess = () => {
    clearCart();
    closeCart();
    setCheckoutStep(0);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={closeCart} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col slide-in-right"
        style={{ background: "var(--bg-secondary)", borderLeft: "1px solid var(--border)" }}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            {checkoutStep > 0 && (
              <button
                onClick={() => setCheckoutStep((checkoutStep - 1) as 0 | 1)}
                className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <div>
              <h2 className="font-bold text-white section-heading text-lg">
                {checkoutStep === 0 && `Cart (${itemCount} item${itemCount !== 1 ? "s" : ""})`}
                {checkoutStep === 1 && "Delivery Details"}
                {checkoutStep === 2 && "Complete Payment"}
              </h2>
              {checkoutStep === 0 && (
                <p className="text-xs text-gray-500">
                  {shippingFee === 0 ? "✅ Free shipping applied!" : `Add ₹${SHIPPING_THRESHOLD - subtotal} more for free shipping`}
                </p>
              )}
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={closeCart}
            className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-5 py-3 gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
          {[{ n: 0, label: "Cart" }, { n: 1, label: "Details" }, { n: 2, label: "Payment" }].map((step, idx) => (
            <div key={step.n} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                checkoutStep === step.n
                  ? "bg-green-400 text-black"
                  : checkoutStep > step.n
                  ? "bg-green-800 text-green-400"
                  : "bg-white/10 text-gray-500"
              }`}>
                {checkoutStep > step.n ? <CheckCircle size={14} /> : step.n + 1}
              </div>
              <span className={`text-xs font-medium ${checkoutStep === step.n ? "text-white" : "text-gray-600"}`}>{step.label}</span>
              {idx < 2 && <ChevronRight size={12} className="text-gray-700" />}
            </div>
          ))}
        </div>

        {/* Step 0: Cart Items */}
        {checkoutStep === 0 && (
          <>
            {/* Shipping Progress Bar */}
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>
                  {shippingFee === 0
                    ? "🎉 You have FREE shipping!"
                    : `₹${SHIPPING_THRESHOLD - subtotal} away from free shipping`}
                </span>
                <span>₹{SHIPPING_THRESHOLD}</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${shippingProgress}%`,
                    background: shippingProgress >= 100
                      ? "linear-gradient(90deg, #00e676, #00bcd4)"
                      : "linear-gradient(90deg, #ff6b35, #f7931e)",
                  }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Your cart is empty</p>
                    <p className="text-sm text-gray-500">Browse our EV accessories and add items to your cart.</p>
                  </div>
                  <button onClick={closeCart} className="btn-secondary text-sm">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white leading-tight line-clamp-2 mb-1">
                        {item.product.name}
                      </p>
                      <p className="text-green-400 font-bold text-sm">₹{(item.product.salePrice * item.quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 transition-all text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 transition-all text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-green-400 font-semibold" : ""}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="divider-glow" />
                  <div className="flex justify-between font-black text-white text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button id="proceed-to-checkout-btn" onClick={handleProceedToCheckout} className="btn-primary w-full">
                  Proceed to Checkout <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 1: Customer Info Form */}
        {checkoutStep === 1 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* Order Summary mini */}
              <div className="p-3 rounded-xl text-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-gray-400 mb-2">Order Summary</p>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs text-gray-300 mb-1">
                    <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="text-green-400 font-semibold flex-shrink-0">₹{(item.product.salePrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="divider-glow mt-2 mb-2" />
                <div className="flex justify-between font-bold text-white text-sm">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <h3 className="font-bold text-white section-heading">Delivery Information</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium" htmlFor="cust-name">Full Name *</label>
                  <input
                    id="cust-name"
                    type="text"
                    className="input-dark"
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium" htmlFor="cust-mobile">Mobile Number *</label>
                  <input
                    id="cust-mobile"
                    type="tel"
                    className="input-dark"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={customerInfo.mobile}
                    onChange={(e) => setCustomerInfo({ mobile: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium" htmlFor="cust-bike">Bike Model *</label>
                  <input
                    id="cust-bike"
                    type="text"
                    className="input-dark"
                    placeholder="e.g., OLA S1 Air, Ather 450X"
                    value={customerInfo.bikeModel}
                    onChange={(e) => setCustomerInfo({ bikeModel: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium" htmlFor="cust-address">Shipping Address *</label>
                  <textarea
                    id="cust-address"
                    rows={3}
                    className="input-dark resize-none"
                    placeholder="Full address with pincode, city, state"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ address: e.target.value })}
                  />
                </div>
              </div>

              {formError && (
                <p className="text-red-400 text-xs p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  ⚠️ {formError}
                </p>
              )}
            </div>

            <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button id="place-order-btn" onClick={handlePlaceOrder} className="btn-primary w-full">
                Continue to Payment <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Payment Options */}
        {checkoutStep === 2 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <div className="p-3 rounded-xl text-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-xs text-gray-500 mb-1">Delivering to</p>
                <p className="font-semibold text-white text-sm">{customerInfo.name} • {customerInfo.mobile}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{customerInfo.address}</p>
              </div>

              {/* WhatsApp Option */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(37,211,102,0.3)" }}>
                <div className="px-4 py-3" style={{ background: "rgba(37,211,102,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <div>
                      <p className="font-bold text-white text-sm">Order via WhatsApp</p>
                      <p className="text-xs text-gray-400">We'll confirm your order on WhatsApp</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-3">Click below to send your order details directly to our business WhatsApp. We'll confirm availability and share payment instructions.</p>
                  <button id="whatsapp-order-btn" onClick={handleWhatsApp} className="btn-whatsapp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Place Order via WhatsApp
                  </button>
                </div>
              </div>

              {/* UPI Option */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(79,158,255,0.3)" }}>
                <div className="px-4 py-3" style={{ background: "rgba(79,158,255,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="font-bold text-white text-sm">Pay via UPI</p>
                      <p className="text-xs text-gray-400">Zero transaction fees — direct bank transfer</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex flex-col items-center gap-3">
                  {/* UPI QR Code */}
                  <div className="w-44 h-44 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(STORE_NAME)}&am=${total}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-40 h-40"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Scan with any UPI app</p>
                    <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <span className="text-xs font-mono text-blue-400">{UPI_ID}</span>
                      <button onClick={handleCopyUPI} className="text-gray-400 hover:text-white transition-colors" aria-label="Copy UPI ID">
                        {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Amount: <span className="text-white font-bold">₹{total.toLocaleString()}</span></p>
                  </div>
                  <p className="text-xs text-gray-500 text-center">After payment, send screenshot to WhatsApp for order confirmation</p>
                  <button onClick={handleOrderSuccess} className="btn-secondary w-full text-sm">
                    <CheckCircle size={15} /> I've Completed Payment
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
