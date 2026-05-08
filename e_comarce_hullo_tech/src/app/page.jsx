"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Zap, Tag, Clock } from "lucide-react";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import { useState } from "react";

const banners = [
  {
    id: 1,
    title: "Gaming Laptop Festival",
    subtitle: "Up to 30% Off on Selected Gaming Laptops",
    image: "/laptop.webp",
    bgColor: "bg-gray-900",
  },
  {
    id: 2,
    title: "PC Builder Season",
    subtitle: "Build Your Dream PC with Best Prices",
    image: "/desktop.webp",
    bgColor: "bg-gray-900",
  },
  {
    id: 3,
    title: "Smartphone Bonanza",
    subtitle: "Latest Phones at Unbeatable Prices",
    image: "/phone.webp",
    bgColor: "bg-gray-900",
  },
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <main className="bg-star-light-gray">
      {/* Hero Banner Carousel */}
      <section className="relative bg-white overflow-hidden">
        <div className="relative h-[300px] md:h-[400px]">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className={`${banner.bgColor} h-full`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                  <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                    <div className="text-white">
                      <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        {banner.title}
                      </h1>
                      <p className="text-lg md:text-xl mb-6 opacity-90">
                        {banner.subtitle}
                      </p>
                      <Link
                        href="/offers"
                        className="inline-block bg-white text-star-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <div className="hidden md:flex justify-center">
                      <div className="w-64 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">Banner Image</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentBanner ? "bg-white" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white border-y border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-center gap-6 md:gap-12 text-sm">
            <Link href="/happy-hour" className="flex items-center gap-2 text-star-orange hover:text-orange-700 font-medium">
              <Zap className="w-4 h-4" />
              <span>Happy Hour Deals</span>
            </Link>
            <Link href="/information/offer" className="flex items-center gap-2 text-star-red hover:text-red-700 font-medium">
              <Tag className="w-4 h-4" />
              <span>Offers</span>
            </Link>
            <Link href="/tool/pc_builder" className="flex items-center gap-2 text-star-blue hover:text-star-dark-blue font-medium">
              <span>🛠️</span>
              <span>PC Builder</span>
            </Link>
            <Link href="/new-arrivals" className="flex items-center gap-2 text-star-green hover:text-green-700 font-medium">
              <Clock className="w-4 h-4" />
              <span>New Arrivals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryGrid />
      </section>

      {/* Happy Hour Section */}
      <section className="bg-gradient-to-r from-blue-500 to-orange-50 border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-star-orange" />
              <h2 className="text-2xl font-bold text-gray-800">Happy Hour</h2>
              <span className="bg-star-orange text-white text-xs px-2 py-1 rounded">Limited Time</span>
            </div>
            <Link href="/happy-hour" className="text-star-blue hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="product-card bg-white">
                <div className="relative">
                  <div className="aspect-square bg-star-light-gray flex items-center justify-center">
                    <span className="text-gray-400">Product {item}</span>
                  </div>
                  <div className="badge-sale">SALE</div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">Happy Hour Deal Product {item}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-star-blue font-bold">$499</span>
                    <span className="text-gray-400 line-through text-sm">$699</span>
                  </div>
                  <div className="mt-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                    Save $200
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link href="/featured" className="text-star-blue hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* New Arrivals */}
      <section className="bg-white border-y border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
            <Link href="/new-arrivals" className="text-star-blue hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="product-card bg-white">
                <div className="relative">
                  <div className="aspect-square bg-star-light-gray flex items-center justify-center">
                    <span className="text-gray-400">New Product {item}</span>
                  </div>
                  <div className="badge-new">NEW</div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">New Arrival Product {item}</h3>
                  <p className="text-star-blue font-bold">$999</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="product-card bg-white">
              <div className="aspect-square bg-star-light-gray flex items-center justify-center">
                <span className="text-gray-400">Recommended {item}</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium mb-2">Recommended Product {item}</h3>
                <p className="text-star-blue font-bold text-lg">$999</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-white border-t border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Latest Tech News</h2>
            <Link href="/blog" className="text-star-blue hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Link key={item} href="/blog" className="group">
                <div className="bg-star-light-gray h-48 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-400">Blog Image {item}</span>
                </div>
                <h3 className="font-medium group-hover:text-star-blue transition-colors">
                  Tech News Article {item}
                </h3>
                <p className="text-sm text-gray-500 mt-1">May 8, 2026</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
