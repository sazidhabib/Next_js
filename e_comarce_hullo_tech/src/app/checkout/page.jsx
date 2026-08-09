"use client";

import { useState, useEffect } from "react";
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

  const [shippingConfig, setShippingConfig] = useState({
    deliveryCharge: 120,
    freeShippingThreshold: 5000,
    siteTitle: 'HulloTech',
    contactEmail: 'support@hullotech.com',
    contactPhone: '+880 1234 567890',
    contactAddress: 'Dhaka, Bangladesh'
  });

  useEffect(() => {
    // Fetch settings
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setShippingConfig({
            deliveryCharge: Number(data.data.deliveryCharge) !== undefined ? Number(data.data.deliveryCharge) : 120,
            freeShippingThreshold: Number(data.data.freeShippingThreshold) !== undefined ? Number(data.data.freeShippingThreshold) : 5000,
            siteTitle: data.data.siteTitle || 'HulloTech',
            contactEmail: data.data.contactEmail || 'support@hullotech.com',
            contactPhone: data.data.contactPhone || '+880 1234 567890',
            contactAddress: data.data.contactAddress || 'Dhaka, Bangladesh'
          });
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  const deliveryFee = cartSubtotal > shippingConfig.freeShippingThreshold ? 0 : shippingConfig.deliveryCharge;
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
        deliveryCharge: deliveryFee,
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
        const enrichedItems = data.data.items ? data.data.items.map(item => {
          const cartItem = cart.find(c => c.product.id === item.productId);
          return {
            ...item,
            productName: cartItem ? cartItem.product.name : `Product #${item.productId}`
          };
        }) : [];

        setOrderSuccess({
          ...data.data,
          items: enrichedItems
        });
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background-color: white;
              color: black;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
              width: 100% !important;
            }
          }
        `}} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 print-container"
        >
          {/* Header Icon & Message (Hidden when printing) */}
          <div className="text-center space-y-4 no-print">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
              <p className="text-sm text-gray-500 mt-2">
                Thank you for your purchase. Our team member will contact you for confirmation within 24 hours.
              </p>
            </div>
          </div>

          {/* Printable Invoice Block */}
          <div id="printable-invoice" className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-white">
            {/* Invoice Header */}
            <div className="flex justify-between items-start pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">{shippingConfig.siteTitle}</h2>
                <p className="text-xs text-gray-400 mt-1">Invoice Receipt</p>
              </div>
              <div className="text-right text-xs text-gray-500 space-y-1">
                <p className="font-semibold text-gray-800">{shippingConfig.siteTitle} Store</p>
                <p>{shippingConfig.contactPhone}</p>
                <p>{shippingConfig.contactEmail}</p>
                <p>{shippingConfig.contactAddress}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Order Details</p>
                <p className="text-gray-800 font-bold">ID: #HT-{orderSuccess.id}</p>
                <p className="text-gray-600">Date: {new Date(orderSuccess.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600">Payment: Cash on Delivery</p>
                <p className="text-amber-600 font-semibold mt-1">Status: Pending COD Confirmation</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wider font-bold mb-1">Customer / Shipping</p>
                <p className="text-gray-800 font-bold">{orderSuccess.customerName}</p>
                <p className="text-gray-600">Phone: {orderSuccess.customerPhone}</p>
                <p className="text-gray-600">Email: {orderSuccess.customerEmail}</p>
                <p className="text-gray-600">Address: {orderSuccess.shippingAddress}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t border-gray-100 pt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orderSuccess.items && orderSuccess.items.map((item, index) => (
                    <tr key={index} className="text-gray-700">
                      <td className="py-2.5 font-medium">{item.productName || `Product #${item.productId}`}</td>
                      <td className="py-2.5 text-center font-semibold">{item.quantity}</td>
                      <td className="py-2.5 text-right font-medium">৳{Math.round(item.price).toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">৳{Math.round(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(!orderSuccess.items || orderSuccess.items.length === 0) && cart.map(({ product, quantity }) => (
                    <tr key={product.id} className="text-gray-700">
                      <td className="py-2.5 font-medium">{product.name}</td>
                      <td className="py-2.5 text-center font-semibold">{quantity}</td>
                      <td className="py-2.5 text-right font-medium">৳{Math.round(product.price).toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">৳{Math.round(product.price * quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 flex flex-col items-end gap-2 text-xs">
              <div className="flex justify-between w-64 text-gray-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-800">৳{Math.round(orderSuccess.totalAmount - (orderSuccess.deliveryCharge || deliveryFee)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-64 text-gray-500">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-gray-800">
                  {Number(orderSuccess.deliveryCharge || deliveryFee) === 0 ? "Free" : `৳${Math.round(orderSuccess.deliveryCharge || deliveryFee)}`}
                </span>
              </div>
              <div className="flex justify-between w-64 border-t border-gray-100 pt-2 text-sm text-gray-900 font-extrabold">
                <span>Total:</span>
                <span className="text-blue-600">৳{Math.round(orderSuccess.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex gap-3 no-print pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
            >
              Print / Download PDF
            </button>
            <Link
              href="/"
              onClick={() => clearCart()}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 active:scale-[0.98]"
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
                    { id: "cod", label: "Cash on Delivery", icon: Truck, disabled: false },
                    { id: "bkash", label: "bKash (Coming Soon)", icon: CreditCard, disabled: true },
                    { id: "card", label: "Credit/Debit (Coming Soon)", icon: DollarSign, disabled: true },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                          method.disabled
                            ? "opacity-50 cursor-not-allowed border-dashed border-gray-200 bg-slate-50 text-gray-400"
                            : formData.paymentMethod === method.id
                              ? "border-blue-600 bg-blue-50/40 text-blue-600 shadow-sm cursor-pointer"
                              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-slate-50 cursor-pointer"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          disabled={method.disabled}
                          checked={!method.disabled && formData.paymentMethod === method.id}
                          onChange={!method.disabled ? handleChange : undefined}
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
