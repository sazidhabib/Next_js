"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection({ 
  title: propTitle, 
  description: propDescription,
  buttonText: propButtonText 
}) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("CTA fetch error:", err));
  }, []);

  const title = propTitle || settings?.home_cta_title || "Have Some Projects in Mind?";
  const description = propDescription || "Let's discuss how we can help you achieve your business goals with strategic creative solutions.";
  const buttonText = propButtonText || settings?.home_cta_button_text || "Ask for a quote";

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
            {title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
        >
          {description}
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
            {buttonText}
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
