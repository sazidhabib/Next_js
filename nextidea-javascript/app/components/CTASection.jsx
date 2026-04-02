"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-[#242424]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Have Some Projects in <span className="text-primary">Mind?</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
        >
          Let&apos;s discuss how we can help you achieve your business goals
          with strategic creative solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            Ask for a quote
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/protfolio"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-700 text-white font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            View Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
