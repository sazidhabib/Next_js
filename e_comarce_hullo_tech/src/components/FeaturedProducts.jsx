"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products as mockProducts } from "../data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function FeaturedProducts() {
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setFeaturedList(data.data);
        } else {
          setFeaturedList(mockProducts.filter((p) => p.featured));
        }
      } catch {
        setFeaturedList(mockProducts.filter((p) => p.featured));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl"
            variants={itemVariants}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {featuredList.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <Link
            href={`/${product.category}/${product.slug}`}
            className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500"
          >
            <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="text-[11px] text-gray-400 ml-1.5 font-medium">
                  (5)
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-gray-900">
                ${product.price}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
