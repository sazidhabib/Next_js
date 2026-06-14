"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeatureCards from "../components/FeatureCards";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    id: 1,
    title: "Gaming Laptop Festival",
    subtitle: "Up to 30% Off on Selected Gaming Laptops",
    image: "/1st-post.jpeg",
  },
  {
    id: 2,
    title: "PC Builder Season",
    subtitle: "Build Your Dream PC with Best Prices",
    image: "/2nd_post.jpeg",
  },
  {
    id: 3,
    title: "Smartphone Bonanza",
    subtitle: "Latest Phones at Unbeatable Prices",
    image: "/cover.jpeg",
  },
];

const sidePromos = [
  {
    id: 1,
    image: "/1st-post.jpeg",
    label: "Service",
    title: "Free Delivery",
    subtitle: "On orders over $50",
    link: "/offers",
  },
  {
    id: 2,
    image: "/cover.jpeg",
    label: "Support",
    title: "Expert Support",
    subtitle: "24/7 Tech Assistance",
    link: "/support",
  },
];

const brands = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Gigabyte", "Corsair", "Samsung",
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#010d21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Slider */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden h-[300px] md:h-[450px] lg:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={banners[currentBanner].image}
                      alt={banners[currentBanner].title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#010d21]/80 via-[#010d21]/40 to-transparent" />
                    <div className="relative h-full flex flex-col items-start justify-center px-8 md:px-14">
                      <div className="max-w-xl">
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-blue-300 text-sm md:text-base font-medium tracking-[0.15em] uppercase mb-3"
                        >
                          Limited Time Offer
                        </motion.p>
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
                        >
                          {banners[currentBanner].title}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="text-base md:text-lg text-white/70 mt-4 max-w-md font-medium leading-relaxed"
                        >
                          {banners[currentBanner].subtitle}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="mt-6 md:mt-8"
                        >
                          <Link
                            href="/offers"
                            className="inline-flex items-center gap-2 bg-white text-[#010d21] px-7 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all hover:shadow-xl active:scale-[0.98]"
                          >
                            Shop Now
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/25 transition-all z-20 border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/25 transition-all z-20 border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`rounded-full transition-all duration-500 ${index === currentBanner
                      ? "bg-white w-8 h-2"
                      : "bg-white/30 hover:bg-white/50 w-2 h-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Side Promos */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {sidePromos.map((promo) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: promo.id * 0.15 }}
                >
                  <Link
                    href={promo.link}
                    className="group relative flex-1 rounded-2xl overflow-hidden min-h-[140px] lg:min-h-0 block h-full"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010d21]/90 via-[#010d21]/40 to-transparent" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-5">
                      <p className="text-white/50 text-[11px] uppercase tracking-[0.15em] font-medium">
                        {promo.label}
                      </p>
                      <h3 className="text-white font-bold text-lg mt-0.5">
                        {promo.title}
                      </h3>
                      <p className="text-white/50 text-sm mt-0.5">
                        {promo.subtitle}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[11px] text-gray-400 uppercase tracking-[0.2em] font-medium mb-5">
            Trusted by Tech Enthusiasts
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-40">
            {brands.map((brand) => (
              <span key={brand} className="text-sm font-bold text-gray-900 tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <FeatureCards />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
              Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/featured"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* Happy Hour */}
      <section className="bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
                Limited Time
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Happy Hour Deals
              </h2>
            </div>
            <Link
              href="/happy-hour"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-amber-600 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500"
              >
                <div className="relative aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 font-medium">Product {item}</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    -30%
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    Happy Hour Deal Product {item}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">$499</span>
                    <span className="text-sm text-gray-400 line-through">$699</span>
                  </div>
                  <div className="mt-2 inline-block bg-red-50 text-red-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Save $200
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
              Latest
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500"
            >
              <div className="relative aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-300 font-medium">New Product {item}</span>
                </div>
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  New
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  New Arrival Product {item}
                </h3>
                <p className="text-lg font-bold text-gray-900">$999</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
                Personalized
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Recommended for You
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500"
              >
                <div className="relative aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 font-medium">Recommended {item}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    Recommended Product {item}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">$999</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
              Blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Latest Tech News
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((item) => (
            <Link key={item} href="/blog" className="group">
              <div className="relative aspect-[16/10] bg-[#f8fafc] rounded-xl overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-300 font-medium">Blog Image {item}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                Tech News Article {item}
              </h3>
              <p className="text-sm text-gray-400 mt-1.5 font-medium">May 8, 2026</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
