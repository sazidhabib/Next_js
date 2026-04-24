"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function EcommerceHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Waves (SVG) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 200C200 100 400 300 600 250C800 200 1000 400 1200 350C1400 300 1600 100 1600 100"
            stroke="var(--primary)"
            strokeWidth="1"
          />
          <path
            d="M-100 300C200 200 400 400 600 350C800 300 1000 500 1200 450C1400 400 1600 200 1600 200"
            stroke="var(--primary)"
            strokeWidth="1"
          />
          <path
            d="M-100 400C200 300 400 500 600 450C800 400 1000 600 1200 550C1400 500 1600 300 1600 300"
            stroke="var(--primary)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-7xl font-bold text-black mb-6 leading-tight max-w-5xl mx-auto"
        >
          Turn Product Views Into Sales With SEO That Drives{" "}
          <span className="text-primary">High-Intent Traffic</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto mb-10"
        >
          While your competitors wait for luck, you take command. Our E-commerce
          SEO experts transform your store into a search engine favorite,
          bringing you visitors who are ready to buy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="#packages"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
          >
            See our packages
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
