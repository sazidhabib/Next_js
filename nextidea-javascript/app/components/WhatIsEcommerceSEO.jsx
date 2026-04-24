"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatIsEcommerceSEO() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
              What is Ecommerce SEO?
            </h2>
            <div className="space-y-4 text-zinc-600 text-lg">
              <p>
                E-commerce SEO is the practice of optimizing an online store to
                increase its visibility in search engine results pages (SERPs).
                The goal is to drive more organic traffic to the store, which can
                ultimately lead to more sales.
              </p>
              <p>
                It's about making sure that when people search for the products
                you sell, your store is the first one they see.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            {/* Using a placeholder or SVG if image not available */}
            <div className="relative w-full max-w-md aspect-square bg-zinc-50 rounded-3xl flex items-center justify-center p-8">
               <Image 
                src="/E-commerce-SEO.png" 
                alt="Ecommerce SEO illustration" 
                width={500} 
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
