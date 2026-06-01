"use client";

import { motion } from "framer-motion";
import { Laptop, AlertCircle, Home, Wrench } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Laptop,
    title: "Laptop Finder",
    description: "Find Your Laptop Easily",
  },
  {
    id: 2,
    icon: AlertCircle,
    title: "Raise a Complain",
    description: "Share your experience",
  },
  {
    id: 3,
    icon: Home,
    title: "Home Service",
    description: "Get expert help.",
  },
  {
    id: 4,
    icon: Wrench,
    title: "Servicing Center",
    description: "Repair Your Device",
  },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function FeatureCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border border-star-gray rounded-lg p-6 md:p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:border-star-blue transition-all duration-300 cursor-pointer group h-full">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-star-light-gray to-blue-50 rounded-full flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-300"
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="w-7 h-7 text-star-blue" />
                </motion.div>
                <motion.h3
                  className="text-center font-bold text-gray-900 group-hover:text-star-blue transition-colors duration-300 text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-center text-xs md:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
