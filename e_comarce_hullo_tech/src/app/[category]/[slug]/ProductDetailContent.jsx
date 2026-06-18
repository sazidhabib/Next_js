"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Share2,
  GitCompare,
  Check,
  Star,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Specification", "Description", "Reviews"];

export default function ProductDetailContent({ product, category, relatedProducts }) {
  const [activeTab, setActiveTab] = useState("Specification");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState("cash");

  const images = Array.isArray(product.images) ? product.images : [product.image].filter(Boolean);
  const regularPrice = Math.round(product.price * 1.12);
  const hasDiscount = regularPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Image + Summary */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 py-8 lg:py-12">
        {/* Image Gallery */}
        <div className="lg:w-[45%] lg:sticky lg:top-28 lg:self-start">
          <div className="relative bg-[#fafbfc] rounded-2xl border border-gray-100 aspect-square flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-center p-8"
              >
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-contain max-h-full max-w-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-all border border-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-all border border-gray-100"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-[72px] h-[72px] rounded-xl border-2 flex items-center justify-center bg-white overflow-hidden transition-all duration-200 ${i === selectedImage
                    ? "border-blue-600 shadow-md shadow-blue-600/10"
                    : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    width={64}
                    height={64}
                    className="object-contain max-h-full p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-[55%]">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-5">
            {product.brand && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wide uppercase">
                {product.brand}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              {[
                { icon: Share2, label: "Share" },
                { icon: Heart, label: "Save" },
                { icon: GitCompare, label: "Compare" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">(5 reviews)</span>
          </div>

          {/* Price + Status Row */}
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                Price
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  ৳{product.price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ৳{regularPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${product.stock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock ? "bg-emerald-500" : "bg-red-500"}`} />
                {product.stock ? "In Stock" : "Out of Stock"}
              </span>
              {hasDiscount && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                  Save {Math.round((1 - product.price / regularPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Product Code", value: product.id },
              { label: "Model", value: product.model },
              { label: "Warranty", value: product.warranty },
              { label: "Availability", value: product.stock ? "In Stock" : "Call for Availability" },
            ].filter((item) => item.value).map((item) => (
              <div key={item.label} className="bg-[#fafbfc] rounded-xl px-4 py-3">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Key Features */}
          {Array.isArray(product.specs) && product.specs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Key Features</h2>
              <ul className="space-y-2">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-blue-600" />
                    </span>
                    <span className="leading-relaxed">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Payment Options */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Payment Options</h2>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMode("cash")}
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMode === "cash"
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMode === "cash"}
                  onChange={() => {}}
                  className="sr-only"
                />
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-900">Cash Price</span>
                  {paymentMode === "cash" && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-gray-900">৳{product.price}</div>
                {hasDiscount && (
                  <div className="text-xs text-gray-400 line-through mt-0.5">৳{regularPrice}</div>
                )}
                <div className="text-[11px] text-gray-400 mt-1.5">Online / Cash Payment</div>
              </label>
              <label
                onClick={() => setPaymentMode("emi")}
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMode === "emi"
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="emi"
                  checked={paymentMode === "emi"}
                  onChange={() => {}}
                  className="sr-only"
                />
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-900">EMI</span>
                  {paymentMode === "emi" && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-gray-900">৳{Math.round(product.price / 12)}<span className="text-sm font-medium text-gray-400">/mo</span></div>
                <div className="text-[11px] text-gray-400 mt-0.5">0% EMI for 12 Months</div>
              </label>
            </div>
          </div>

          {/* Cart + Quantity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-12 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-full flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              className="flex-1 h-12 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10"
              disabled={!product.stock}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            {[
              { icon: Truck, label: "Free Delivery", sub: "On orders over $50" },
              { icon: Shield, label: "Secure Payment", sub: "SSL encrypted" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7 days return" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#fafbfc] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Sidebar */}
      <hr className="border-gray-100" />
      <div className="flex flex-col lg:flex-row gap-12 py-10 lg:py-14">
        {/* Main Content */}
        <div className="lg:w-[70%] min-w-0">
          {/* Tabs */}
          <div className="border-b border-gray-100 mb-8">
            <div className="flex gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3.5 text-sm font-medium transition-all relative ${activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "Specification" && (() => {
                const getSpecsObject = () => {
                  if (!product.specifications) return {};
                  if (typeof product.specifications === 'string') {
                    try {
                      return JSON.parse(product.specifications);
                    } catch (e) {
                      return {};
                    }
                  }
                  return product.specifications;
                };
                const specsObject = getSpecsObject();
                return (
                  <section>
                    {specsObject && typeof specsObject === 'object' && !Array.isArray(specsObject) && Object.keys(specsObject).length > 0 ? (
                      <div className="space-y-8">
                        {Object.entries(specsObject).map(([section, fields], idx) => (
                          <div key={idx}>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                              {section}
                            </h3>
                            <div className="space-y-0">
                              {Object.entries(fields).map(([key, value], i) => (
                                <div
                                  key={i}
                                  className={`flex items-start gap-4 py-3 ${i % 2 === 0 ? "bg-[#fafbfc] -mx-4 px-4 rounded-lg" : ""
                                  }`}
                                >
                                  {key && key.trim() !== "" && (
                                    <span className="text-sm text-gray-500 w-48 shrink-0 font-medium">
                                      {key}
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-900 whitespace-pre-line flex-1">
                                    {value}
                                  </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                        Basic Information
                      </h3>
                      <div className="space-y-0">
                        {[
                          { label: "Name", value: product.name },
                          { label: "Brand", value: product.brand },
                          { label: "Model", value: product.model },
                          ...(Array.isArray(product.specs) ? product.specs.map((spec, i) => ({
                            label: `Specification ${i + 1}`,
                            value: spec,
                          })) : []),
                        ].filter((item) => item.value).map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-4 py-3 ${i % 2 === 0 ? "bg-[#fafbfc] -mx-4 px-4 rounded-lg" : ""
                            }`}
                          >
                            <span className="text-sm text-gray-500 w-48 shrink-0 font-medium">
                              {item.label}
                            </span>
                            <span className="text-sm text-gray-900">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )})()}

              {activeTab === "Description" && (
                <section>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p className="text-sm">{product.description}</p>
                    {Array.isArray(product.specs) && product.specs.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Key Highlights</h3>
                        <ul className="space-y-2">
                          {product.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "Reviews" && (
                <section>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
                      <p className="text-sm text-gray-400 mt-1">See what our customers say</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-500 mt-1 block">5 out of 5</span>
                    </div>
                  </div>
                  <div className="bg-[#fafbfc] rounded-xl p-5">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      Great product! Highly recommended. The quality exceeded my expectations.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-semibold text-gray-600">John D.</span>
                      <span aria-hidden>&middot;</span>
                      <span>Verified Purchase</span>
                      <span aria-hidden>&middot;</span>
                      <span>May 1, 2026</span>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Latest Price Section */}
          <section className="mt-10 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                <span className="text-white font-bold text-sm">৳</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-1.5">
                  What is the price of {product.name} in Bangladesh?
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The latest price of{" "}
                  <span className="font-semibold text-gray-900">{product.name}</span> is{" "}
                  <span className="font-bold text-blue-600">৳{product.price}</span>{" "}
                  in Bangladesh. You can buy at the best price from our website or visit our nearest showroom.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="lg:w-[30%] min-w-0">
            <div className="lg:sticky lg:top-28">
              <section className="border border-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-5">Similar Products</h3>
                <div className="space-y-4">
                  {relatedProducts.slice(0, 5).map((rp, i) => (
                    <Link
                      key={rp.id}
                      href={`/${rp.category}/${rp.slug}`}
                      className={`flex gap-3.5 group ${i < relatedProducts.slice(0, 5).length - 1 ? "pb-4 border-b border-gray-100" : ""
                      }`}
                    >
                      <div className="w-16 h-16 bg-[#fafbfc] rounded-xl shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden group-hover:border-gray-200 transition-colors">
                        <Image
                          src={rp.image}
                          alt={rp.name}
                          width={60}
                          height={60}
                          className="object-contain max-h-full p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {rp.name}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1.5">
                          ৳{rp.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
