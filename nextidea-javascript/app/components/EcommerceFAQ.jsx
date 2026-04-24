"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is e-commerce SEO and how is it different from regular SEO?",
    answer: "E-commerce SEO is specifically tailored for online stores. It focuses on optimizing product pages, categories, and shopping user experience, whereas regular SEO might focus more on information-based content. It involves technical aspects like schema markup for products and site speed for heavy image loads.",
  },
  {
    question: "How long does it take to see results from e-commerce SEO?",
    answer: "Typically, you can start seeing improvements in 3-6 months. However, SEO is a long-term strategy, and the most significant growth usually occurs after 6-12 months of consistent optimization and authority building.",
  },
  {
    question: "Can you help with technical SEO issues like site speed?",
    answer: "Yes, technical SEO is a core part of our service. We optimize image sizes, leverage browser caching, minimize scripts, and ensure your site structure is easily crawlable by search engines.",
  },
  {
    question: "Do you provide monthly reports and analysis?",
    answer: "Absolutely. We provide detailed monthly reports that track keyword rankings, organic traffic, conversion rates, and ROI. We also have monthly review meetings to discuss progress and future strategies.",
  },
  {
    question: "Is e-commerce SEO worth the investment?",
    answer: "E-commerce SEO offers one of the highest ROIs in digital marketing. Unlike paid ads, organic traffic is 'free' once you rank, and it builds long-term authority and trust that compounding over time.",
  },
  {
    question: "How much does e-commerce SEO cost?",
    answer: "Our packages start from ৳ 25,000 per month. The cost depends on the size of your store, the competitiveness of your niche, and the scale of optimization required.",
  },
];

export default function EcommerceFAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-black mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
              >
                <span className="text-lg font-bold text-black">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-zinc-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
