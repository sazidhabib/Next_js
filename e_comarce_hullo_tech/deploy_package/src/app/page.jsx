"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import FeatureCards from "../components/FeatureCards";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products as mockProducts } from "../data/mockData";
import { useCart } from "../lib/CartContext";

const banners = [
  {
    id: 1,
    image: "/1st-post.jpeg",
  },
  {
    id: 2,
    image: "/2nd_post.jpeg",
  },
  {
    id: 3,
    image: "/cover.jpeg",
  },
];

const sideBannersTop = [
  {
    id: 1,
    image: "/3rd_post.png",
    link: "/offers",
  },
  {
    id: 2,
    image: "/1st-post.jpeg",
    link: "/offers",
  },
  {
    id: 3,
    image: "/cover.jpeg",
    link: "/offers",
  },
];

const sideBannersBottom = [
  {
    id: 1,
    image: "/4th_post.png",
    link: "/offers",
  },
  {
    id: 2,
    image: "/2nd_post.jpeg",
    link: "/offers",
  },
  {
    id: 3,
    image: "/cover.jpeg",
    link: "/offers",
  },
];

const staticBrands = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Gigabyte", "Corsair", "Samsung",
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentSideTop, setCurrentSideTop] = useState(0);
  const [currentSideBottom, setCurrentSideBottom] = useState(0);

  const [activeBanners, setActiveBanners] = useState(banners);
  const [activeSideTop, setActiveSideTop] = useState(sideBannersTop);
  const [activeSideBottom, setActiveSideBottom] = useState(sideBannersBottom);
  const [brands, setBrands] = useState(staticBrands);

  const { addToCart } = useCart();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Sort by id DESC to get last uploaded products first
          const sorted = [...data.data].sort((a, b) => b.id - a.id);
          setNewArrivals(sorted.slice(0, 10));
        } else {
          const sorted = [...mockProducts].sort((a, b) => b.id - a.id);
          setNewArrivals(sorted.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
        const sorted = [...mockProducts].sort((a, b) => b.id - a.id);
        setNewArrivals(sorted.slice(0, 10));
      } finally {
        setLoadingNewArrivals(false);
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(2); // mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // tablet
      } else {
        setVisibleCount(5); // desktop
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (newArrivals.length === 0) return;
    const interval = setInterval(() => {
      setNewArrivalsIndex((prev) => {
        const maxIndex = newArrivals.length - visibleCount;
        if (maxIndex <= 0) return 0;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [newArrivals, visibleCount, newArrivalsIndex]);

  const handleNewArrivalsNext = () => {
    setNewArrivalsIndex((prev) => {
      const maxIndex = newArrivals.length - visibleCount;
      if (maxIndex <= 0) return 0;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handleNewArrivalsPrev = () => {
    setNewArrivalsIndex((prev) => {
      const maxIndex = newArrivals.length - visibleCount;
      if (maxIndex <= 0) return 0;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  useEffect(() => {
    const fetchSliderSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
          const { mainSlider, topSlider, bottomSlider, brands: dbBrands } = json.data;

          const parseSlider = (data) => {
            if (!data) return null;
            if (Array.isArray(data)) return data;
            if (typeof data === 'string') {
              try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
              } catch (e) {
                console.error("Failed to parse slider string:", e);
              }
            }
            return null;
          };

          const main = parseSlider(mainSlider);
          const top = parseSlider(topSlider);
          const bottom = parseSlider(bottomSlider);
          const parsedBrands = parseSlider(dbBrands);

          if (main && main.length > 0) setActiveBanners(main);
          if (top && top.length > 0) setActiveSideTop(top);
          if (bottom && bottom.length > 0) setActiveSideBottom(bottom);
          if (parsedBrands && parsedBrands.length > 0) setBrands(parsedBrands);
        }
      } catch (err) {
        console.error('Failed to fetch slider settings:', err);
      }
    };
    fetchSliderSettings();
  }, []);

  useEffect(() => {
    const bannerLen = Array.isArray(activeBanners) ? activeBanners.length : 0;
    const topLen = Array.isArray(activeSideTop) ? activeSideTop.length : 0;
    const bottomLen = Array.isArray(activeSideBottom) ? activeSideBottom.length : 0;

    const mainTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % (bannerLen || 1));
    }, 5000);

    const topTimer = setInterval(() => {
      setCurrentSideTop((prev) => (prev + 1) % (topLen || 1));
    }, 6000);

    const bottomTimer = setInterval(() => {
      setCurrentSideBottom((prev) => (prev + 1) % (bottomLen || 1));
    }, 7000);

    return () => {
      clearInterval(mainTimer);
      clearInterval(topTimer);
      clearInterval(bottomTimer);
    };
  }, [activeBanners, activeSideTop, activeSideBottom]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#010d21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Slider */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden h-[300px] md:h-[450px] lg:h-[500px]">
              <AnimatePresence mode="wait">
                {Array.isArray(activeBanners) && activeBanners.length > 0 && (
                  <motion.div
                    key={currentBanner}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Link href="/offers" className="relative h-full w-full block">
                      <Image
                        src={activeBanners[currentBanner]?.image || "/1st-post.jpeg"}
                        alt="Banner Image"
                        fill
                        className="object-cover"
                        priority
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => {
                  const len = Array.isArray(activeBanners) ? activeBanners.length : 0;
                  setCurrentBanner((prev) => (prev - 1 + len) % (len || 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/25 transition-all z-20 border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const len = Array.isArray(activeBanners) ? activeBanners.length : 0;
                  setCurrentBanner((prev) => (prev + 1) % (len || 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/25 transition-all z-20 border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {Array.isArray(activeBanners) && activeBanners.map((_, index) => (
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

            {/* Side Sliders */}
            <div className="lg:col-span-1 grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:h-[500px]">
              {/* Top Side Slider */}
              <div className="flex-1 flex flex-col relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-[160px] lg:min-h-0 h-full bg-slate-900/10">
                <AnimatePresence mode="wait">
                  {Array.isArray(activeSideTop) && activeSideTop.length > 0 && (
                    <motion.div
                      key={currentSideTop}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Link
                        href={activeSideTop[currentSideTop]?.link || "/offers"}
                        className="group relative block h-full w-full"
                      >
                        <Image
                          src={activeSideTop[currentSideTop]?.image || "/3rd_post.png"}
                          alt="Promo Top"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Side Slider */}
              <div className="flex-1 flex flex-col relative rounded-2xl overflow-hidden min-h-[120px] sm:min-h-[160px] lg:min-h-0 h-full bg-slate-900/10">
                <AnimatePresence mode="wait">
                  {Array.isArray(activeSideBottom) && activeSideBottom.length > 0 && (
                    <motion.div
                      key={currentSideBottom}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Link
                        href={activeSideBottom[currentSideBottom]?.link || "/offers"}
                        className="group relative block h-full w-full"
                      >
                        <Image
                          src={activeSideBottom[currentSideBottom]?.image || "/4th_post.png"}
                          alt="Promo Bottom"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[11px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-6">
            Trusted by Tech Enthusiasts
          </p>
          <div className="relative w-full overflow-hidden marquee-container flex items-center">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex gap-16 md:gap-24 animate-marquee whitespace-nowrap opacity-40">
              {brands.map((brand, idx) => (
                <span key={`b1-${idx}`} className="text-base md:text-xl font-extrabold text-gray-900 tracking-wider uppercase hover:text-blue-600 transition-colors duration-300">
                  {brand}
                </span>
              ))}
            </div>
            <div className="flex gap-16 md:gap-24 animate-marquee whitespace-nowrap opacity-40" aria-hidden="true">
              {brands.map((brand, idx) => (
                <span key={`b2-${idx}`} className="text-base md:text-xl font-extrabold text-gray-900 tracking-wider uppercase hover:text-blue-600 transition-colors duration-300">
                  {brand}
                </span>
              ))}
            </div>
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
      {/* <section className="bg-[#f8fafc]">
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
      </section> */}

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
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewArrivalsPrev}
              disabled={newArrivals.length <= visibleCount}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 p-2.5 rounded-full text-gray-700 hover:text-blue-600 transition-all border border-gray-200 cursor-pointer"
              aria-label="Previous Arrivals"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNewArrivalsNext}
              disabled={newArrivals.length <= visibleCount}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 p-2.5 rounded-full text-gray-700 hover:text-blue-600 transition-all border border-gray-200 cursor-pointer"
              aria-label="Next Arrivals"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden -mx-2 md:-mx-3">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${newArrivalsIndex * (100 / visibleCount)}%)`,
            }}
          >
            {loadingNewArrivals ? (
              [1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 px-2 md:px-3"
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl animate-pulse" />
                </div>
              ))
            ) : (
              newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 px-2 md:px-3"
                >
                  <Link
                    href={`/${product.category}/${product.slug}`}
                    className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500 h-full"
                  >
                    <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                          <span className="text-gray-300 font-medium">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        New
                      </span>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95 border-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">৳{product.price}</p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recommended */}
      {/* <section className="bg-[#f8fafc]">
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
      </section> */}

      {/* Blog */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
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
      </section> */}
    </main>
  );
}
