"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  Smartphone,
  Tablet,
  Camera,
  Shield,
  HardDrive,
} from "lucide-react";
import { categories as mockCategories } from "../data/mockData";

const iconMap = {
  HardDrive: HardDrive,
  Laptop: Laptop,
  Cpu: Cpu,
  Monitor: Monitor,
  Smartphone: Smartphone,
  Tablet: Tablet,
  Camera: Camera,
  Shield: Shield,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FeaturedCategories() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategoriesList(data.data);
        } else {
          setCategoriesList(mockCategories);
        }
      } catch {
        setCategoriesList(mockCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
            Categories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="text-blue-600 text-xs font-medium tracking-[0.15em] uppercase mb-2">
          Categories
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Shop by Category
        </h2>
      </div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {categoriesList.map((category, i) => {
          const IconComponent = iconMap[category.icon];
          return (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/${category.slug}`}
                className="group flex flex-col items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-center text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
