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
} from "lucide-react";

const TABS = ["Specification", "Description", "Reviews"];

export default function ProductDetailContent({ product, category, relatedProducts }) {
  const [activeTab, setActiveTab] = useState("Specification");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [showReviews, setShowReviews] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const images = product.images?.length ? product.images : [product.image];
  const regularPrice = Math.round(product.price * 1.12);
  const hasDiscount = regularPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Main Summary Section - 2 column */}
      <div className="product-summary flex flex-col lg:flex-row gap-8 mb-10">
        {/* Left: Product Image */}
        <div className="lg:w-[42%]">
          <div className="images">
            <div className="bg-[#ffffff] rounded-lg p-6 relative aspect-square flex items-center justify-center border border-gray-100">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={500}
                height={500}
                className="object-contain max-h-full max-w-full"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded border p-1 flex items-center justify-center bg-white ${i === selectedImage ? "border-star-blue" : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={60}
                      height={60}
                      className="object-contain max-h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-[58%]">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-star-blue transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-1 hover:text-star-blue transition-colors">
                <Heart className="w-4 h-4" /> Save
              </button>
              <button className="flex items-center gap-1 hover:text-star-blue transition-colors">
                <GitCompare className="w-4 h-4" /> Compare
              </button>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-5" itemProp="name">
            {product.name}
          </h1>

          {/* Product Info Card */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-gray-500">Price :</span>
              <span className="text-lg font-bold text-star-blue">৳{product.price}</span>
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-500">Regular Price :</span>
                <span className="text-lg font-bold text-gray-600 line-through">৳{regularPrice}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-gray-500">Status :</span>
              <span className={product.stock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {product.stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-gray-500">Product Code :</span>
              <span className="text-lg font-medium text-gray-700">{product.id}</span>
            </div>
            {product.brand && (
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-500">Brand :</span>
                <span className="text-lg font-medium text-gray-700">{product.brand}</span>
              </div>
            )}
            {product.model && (
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-500">Model :</span>
                <span className="text-lg font-medium text-gray-700">{product.model}</span>
              </div>
            )}
            {product.warranty && (
              <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-500">Warranty :</span>
                <span className="text-lg font-medium text-gray-700">{product.warranty}</span>
              </div>
            )}
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">Key Features</h2>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {product.specs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-star-blue mt-0.5 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Options */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">Payment Options</h2>
            <div className="flex gap-3">
              <label
                onClick={() => setPaymentMode("cash")}
                className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMode === "cash"
                  ? "border-star-blue bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMode === "cash"}
                  onChange={() => { }}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="mb-1">
                    <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through ml-2">৳{regularPrice}</span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-star-blue">Cash Discount Price</div>
                  <div className="text-xs text-gray-400 mt-0.5">Online / Cash Payment</div>
                </div>
              </label>
              <label
                onClick={() => setPaymentMode("emi")}
                className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMode === "emi"
                  ? "border-star-blue bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="emi"
                  checked={paymentMode === "emi"}
                  onChange={() => { }}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    ৳{Math.round(product.price / 12)}/month
                  </div>
                  <div className="text-xs font-medium text-gray-600">Regular Price: ৳{regularPrice}</div>
                  <div className="text-xs text-gray-400 mt-0.5">0% EMI for up to 12 Months</div>
                </div>
              </label>
            </div>
          </div>

          {/* Cart Options */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-11">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 h-full flex items-center justify-center text-sm font-medium text-gray-900 min-w-[48px]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              className="flex-1 h-11 bg-star-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
              disabled={!product.stock}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabs + Sidebar */}
      <hr className="border-gray-200 mb-8" />
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="lg:w-[70%] min-w-0">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                    ? "text-star-blue after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-star-blue"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "Specification" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Specification</h2>
                </div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(product.specifications).map(([section, fields], idx) => (
                      <table key={idx} className="w-full data-table text-sm border-collapse">
                        <thead>
                          <tr>
                            <td className="bg-[#f8f9fa] font-bold text-gray-900 px-4 py-3 rounded-tl-lg rounded-tr-lg" colSpan={2}>
                              {section}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(fields).map(([key, value], i) => (
                            <tr key={i} className="border-b border-gray-100 even:bg-[#fafbfc]">
                              <td className="px-4 py-3 text-gray-500 w-48 align-top">{key}</td>
                              <td className="px-4 py-3 text-gray-800">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))}
                  </div>
                ) : (
                  <table className="w-full data-table text-sm border-collapse">
                    <thead>
                      <tr>
                        <td className="bg-[#f8f9fa] font-bold text-gray-900 px-4 py-3 rounded-tl-lg rounded-tr-lg" colSpan={2}>
                          Basic Information
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 even:bg-[#fafbfc]">
                        <td className="px-4 py-3 text-gray-500 w-48">Name</td>
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                      </tr>
                      {product.brand && (
                        <tr className="border-b border-gray-100 even:bg-[#fafbfc]">
                          <td className="px-4 py-3 text-gray-500">Brand</td>
                          <td className="px-4 py-3 text-gray-800">{product.brand}</td>
                        </tr>
                      )}
                      {product.model && (
                        <tr className="border-b border-gray-100 even:bg-[#fafbfc]">
                          <td className="px-4 py-3 text-gray-500">Model</td>
                          <td className="px-4 py-3 text-gray-800">{product.model}</td>
                        </tr>
                      )}
                      {product.specs && product.specs.map((spec, i) => (
                        <tr key={i} className="border-b border-gray-100 even:bg-[#fafbfc]">
                          <td className="px-4 py-3 text-gray-500">Specification {i + 1}</td>
                          <td className="px-4 py-3 text-gray-800">{spec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )}

            {activeTab === "Description" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Description</h2>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm">
                  <p>{product.description}</p>
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <ul className="space-y-2">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-star-blue rounded-full shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Reviews" && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Reviews (1)</h2>
                    <p className="text-sm text-gray-500 mt-1">See what our customers say</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-star-yellow">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">5 out of 5</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-1 text-star-yellow mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Great product! Highly recommended.</p>
                  <p className="text-xs text-gray-400">By <span className="font-medium text-gray-600">John D.</span> on May 1, 2026</p>
                </div>
              </section>
            )}
          </div>

          {/* Latest Price Section */}
          <section className="mt-10 bg-[#f8f9fa] rounded-lg p-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              What is the price of {product.name} in Bangladesh?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The latest price of {product.name} is{" "}
              <span className="font-bold text-star-blue">৳{product.price}</span> in Bangladesh.
              You can buy the {product.name} at best price from our website or visit our nearest showroom.
            </p>
          </section>
        </div>

        {/* Sidebar: Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="lg:w-[30%] min-w-0">
            <section className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">Similar Products</h3>
              <div className="space-y-4">
                {relatedProducts.slice(0, 5).map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/${rp.category}/${rp.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-16 h-16 bg-[#f8f9fa] rounded shrink-0 flex items-center justify-center border border-gray-100">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        width={60}
                        height={60}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm text-gray-700 group-hover:text-star-blue transition-colors line-clamp-2 leading-snug">
                        {rp.name}
                      </h4>
                      <div className="mt-1">
                        <span className="text-sm font-bold text-star-blue">৳{rp.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
