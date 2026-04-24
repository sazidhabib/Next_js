"use client";

import { motion } from "framer-motion";

const keywords = [
  "SEO Audits",
  "SEO Optimization",
  "Keyword Research",
  "On-page SEO",
  "Off-page SEO",
  "Organic Growth",
  "Technical SEO",
  "Local SEO",
  "App Store Optimization",
  "Shopify SEO",
  "WooCommerce SEO",
  "Magento SEO",
];

export default function ScrollingTicker() {
  return (
    <div className="bg-primary py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
        className="inline-block"
      >
        {[...keywords, ...keywords].map((keyword, index) => (
          <span
            key={index}
            className="text-white text-lg font-bold mx-8 inline-flex items-center"
          >
            <span className="mr-4 text-white/50">•</span>
            {keyword}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
