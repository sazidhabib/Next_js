"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How quickly can I launch my project?",
    answer: "Project timelines vary based on complexity. A simple website can launch in 2-4 weeks, while complex enterprise solutions may take 3-6 months. We provide detailed timelines during our initial consultation."
  },
  {
    question: "What technologies do you use?",
    answer: "We use cutting-edge technologies including React, Next.js, Node.js, Python, AWS, and more. Our team stays current with industry trends to deliver the best solutions for your needs."
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes! We offer comprehensive post-launch support including maintenance, updates, security monitoring, and performance optimization to ensure your project continues to succeed."
  },
  {
    question: "Can you integrate with existing systems?",
    answer: "Absolutely. We specialize in seamless integrations with existing databases, APIs, CRMs, ERPs, and third-party services. We ensure smooth data flow and unified experiences."
  },
  {
    question: "What's your pricing model?",
    answer: "We offer flexible pricing models including fixed-price projects, time and materials, and dedicated team arrangements. Every solution is tailored to your budget and requirements."
  },
  {
    question: "How do you ensure data security?",
    answer: "We implement industry-standard security practices including encryption, secure authentication, regular audits, and compliance with GDPR, SOC 2, and other regulations."
  }
];

export default function FAQSection() {
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
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, process, and how we can help transform your business.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
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
