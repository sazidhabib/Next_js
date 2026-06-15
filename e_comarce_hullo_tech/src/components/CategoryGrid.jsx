"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Laptop, Monitor, Cpu, Smartphone, Tablet, Camera, Shield, HardDrive } from "lucide-react";
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
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function CategoryGrid() {
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
      } catch (error) {
        console.error("DB Fetch failed for categories, falling back to mockData:", error);
        setCategoriesList(mockCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight"
        >
          Shop by Category
        </motion.h2>
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg"
              variants={itemVariants}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </section>
    );
  }

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight"
      >
        Shop by Category
      </motion.h2>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {categoriesList.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/${category.slug}`}
                className="group bg-white border border-star-gray rounded-lg p-4 flex flex-col items-center gap-3 hover:border-star-blue hover:shadow-lg transition-all duration-300 h-full"
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-star-light-gray to-blue-50 rounded-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {IconComponent && (
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-7 h-7 text-star-blue" />
                    </motion.div>
                  )}
                </motion.div>
                <motion.h3
                  className="text-xs font-semibold text-center text-gray-900 group-hover:text-star-blue transition-colors duration-300 leading-snug"
                  whileHover={{ scale: 1.05 }}
                >
                  {category.name}
                </motion.h3>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
