"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../lib/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const deliveryFee = cartSubtotal > 5000 ? 0 : 120;
  const grandTotal = cartSubtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            Shopping Cart
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any products to your cart yet. Head back to shop our amazing deals.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items list */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cart.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <div className="relative w-24 h-24 bg-[#fafbfc] rounded-xl flex-shrink-0 p-2 border border-gray-50 flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <Link
                        href={`/${product.category}/${product.slug}`}
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category}</p>
                      <div className="text-lg font-extrabold text-blue-600 mt-2">
                        ৳{Math.round(product.price).toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity + Actions */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-slate-50 h-10">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 h-full flex items-center justify-center text-sm font-semibold text-gray-900 bg-white border-x border-gray-200">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary details */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-4">
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
                  <span className="text-xl font-extrabold text-blue-600">৳{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/15"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2 justify-center text-xs text-gray-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secure Checkout powered by SSL</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
