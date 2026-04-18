"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ 
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our services, process, and how we can help transform your business.",
  items = [
    {
      question: "What services does Next Idea Solutions provide?",
      answer: "We offer a comprehensive range of digital services including Digital Media Buying, Creative Concept & Execution, Brand Identity, Web Design & Development, SEO, and Social Media Marketing."
    },
    {
      question: "How do you measure the success of a campaign?",
      answer: "We use data-driven metrics such as ROI, ROAS, conversion rates, and engagement levels. We provide detailed monthly reports so you can see exactly how your investment is performing."
    },
    {
      question: "How quickly can we start a new project?",
      answer: "Typically, we can kick off a new project within 3-5 business days of contract signing and initial discovery meeting."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients globally, leveraging digital communication tools to ensure seamless collaboration regardless of time zones."
    }
  ]
}) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-zinc-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
