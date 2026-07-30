"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../lib/CartContext";
import { CreditCard, Truck, CheckCircle, ArrowLeft, Loader2, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, isLoaded } = useCart();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "cod", // default Cash on Delivery
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const deliveryFee = cartSubtotal > 5000 ? 0 : 120;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalAmount: grandTotal,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        clearCart();
      } else {
        setError(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your internet connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-sm text-gray-500 mt-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order ID:</span>
              <span className="font-bold text-gray-900">#HT-{orderSuccess.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Customer:</span>
              <span className="font-semibold text-gray-900">{orderSuccess.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Amount:</span>
              <span className="font-extrabold text-blue-600">৳{Math.round(grandTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Status:</span>
              <span className="font-semibold text-amber-600 capitalize">
                {formData.paymentMethod === "cod" ? "Pay on Delivery" : "Paid"} ({formData.paymentMethod.toUpperCase()})
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/cart" className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 mb-6">No items in your cart to checkout.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form details */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">Shipping Details</h2>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="e.g. john@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="e.g. 01712345678"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</label>
                    <textarea
                      name="shippingAddress"
                      required
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      placeholder="Street, City, Zip Code"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">Payment Method</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: Truck },
                    { id: "bkash", label: "bKash / Mobile", icon: CreditCard },
                    { id: "card", label: "Credit/Debit Card", icon: DollarSign },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? "border-blue-600 bg-blue-50/40 text-blue-600 shadow-sm"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm Order (৳{Math.round(grandTotal).toLocaleString()})
                  </>
                )}
              </button>
            </form>

            {/* Order summary sidebar */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">Your Order</h2>

              <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-1">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex gap-3 items-center">
                    <div className="relative w-12 h-12 bg-slate-50 rounded-lg flex-shrink-0 p-1 flex items-center justify-center overflow-hidden border border-gray-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ৳{Math.round(product.price * quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">৳{Math.round(cartSubtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Charge</span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-900">৳{deliveryFee}</span>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between text-base text-gray-900">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-extrabold text-blue-600">৳{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
