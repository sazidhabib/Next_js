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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
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
      } catch (error) {
        console.error("Failed to load featured products:", error);
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
            className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg"
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
            className="group product-card bg-white rounded-lg overflow-hidden block h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <motion.div
              className="relative aspect-square bg-star-light-gray overflow-hidden"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <motion.button
                className="absolute bottom-3 right-3 bg-white p-2.5 rounded-full shadow-md hover:bg-star-blue hover:text-white transition-all"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.preventDefault()}
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Product Info */}
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1.5 font-medium">(5)</span>
              </div>
              <motion.h3
                className="text-sm font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-star-blue transition-colors duration-300"
                whileHover={{ x: 2 }}
              >
                {product.name}
              </motion.h3>
              <motion.p
                className="text-star-blue font-bold text-lg mt-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                ${product.price}
              </motion.p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
