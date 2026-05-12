"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Zap, Tag, Clock } from "lucide-react";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    id: 1,
    title: "Gaming Laptop Festival",
    subtitle: "Up to 30% Off on Selected Gaming Laptops",
    image: "/1st-post.jpeg",
    bgColor: "bg-gray-900",
  },
  {
    id: 2,
    title: "PC Builder Season",
    subtitle: "Build Your Dream PC with Best Prices",
    image: "/2nd_post.jpeg",
    bgColor: "bg-gray-900",
  },
  {
    id: 3,
    title: "Smartphone Bonanza",
    subtitle: "Latest Phones at Unbeatable Prices",
    image: "/3rd_post.png",
    bgColor: "bg-gray-900",
  },
];
const topSideBanners = [
  { id: 1, image: "/1st-post.jpeg", link: "/new-arrivals" },
  { id: 2, image: "/4th_post.png", link: "/new-arrivals" },
  { id: 3, image: "/3rd_post.png", link: "/new-arrivals" },
];

const bottomSideBanners = [
  { id: 1, image: "/2nd_post.jpeg", link: "/gaming" },
  { id: 2, image: "/cover.jpeg", link: "/gaming" },
  { id: 3, image: "/1st-post.jpeg", link: "/gaming" },
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentTopSide, setCurrentTopSide] = useState(0);
  const [currentBottomSide, setCurrentBottomSide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTopSide((prev) => (prev + 1) % topSideBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBottomSide((prev) => (prev + 1) % bottomSideBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextTopSide = () => {
    setCurrentTopSide((prev) => (prev + 1) % topSideBanners.length);
  };

  const prevTopSide = () => {
    setCurrentTopSide((prev) => (prev - 1 + topSideBanners.length) % topSideBanners.length);
  };

  const nextBottomSide = () => {
    setCurrentBottomSide((prev) => (prev + 1) % bottomSideBanners.length);
  };

  const prevBottomSide = () => {
    setCurrentBottomSide((prev) => (prev - 1 + bottomSideBanners.length) % bottomSideBanners.length);
  };

  return (
    <main className="bg-star-light-gray">
      {/* Hero Section with Grid Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Main Slider (Left Side - 3/4 Width) */}
          <div className="lg:col-span-3 relative bg-white rounded-xl overflow-hidden shadow-sm h-[300px] md:h-[420px]">
            <AnimatePresence>
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

                  <div className="relative h-full flex flex-col items-start justify-center px-8 md:px-12">
                    <div className="max-w-md text-white">
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                        {banners[currentBanner].title}
                      </h1>
                      <p className="text-lg md:text-xl mb-8 opacity-90 font-medium">
                        {banners[currentBanner].subtitle}
                      </p>
                      <Link
                        href="/offers"
                        className="inline-block bg-star-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-star-dark-blue transition-all transform hover:scale-105 shadow-lg"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors z-20 border border-white/30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors z-20 border border-white/30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentBanner ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Top Side Banner Slider */}
            <div className="flex-1 relative rounded-xl overflow-hidden h-[150px] lg:h-auto min-h-[200px] shadow-sm">
              <AnimatePresence>
                <motion.div
                  key={currentTopSide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Link href={topSideBanners[currentTopSide].link} className="block relative w-full h-full group">
                    <Image
                      src={topSideBanners[currentTopSide].image}
                      alt="Side Banner Top"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators for Top Side Slider (Top Right) */}
              <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                {topSideBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTopSide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentTopSide ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Side Banner Slider */}
            <div className="flex-1 relative rounded-xl overflow-hidden h-[150px] lg:h-auto min-h-[200px] shadow-sm">
              <AnimatePresence>
                <motion.div
                  key={currentBottomSide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Link href={bottomSideBanners[currentBottomSide].link} className="block relative w-full h-full group">
                    <Image
                      src={bottomSideBanners[currentBottomSide].image}
                      alt="Side Banner Bottom"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators for Bottom Side Slider (Top Right) */}
              <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                {bottomSideBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBottomSide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentBottomSide ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </div>
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