"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FAQSection({
  pageId,
  title,
  description,
  items: initialItems
}) {
  const [items, setItems] = useState(initialItems || []);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(!initialItems);
  const pathname = usePathname();

  useEffect(() => {
    if (initialItems) return;

    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || 'home';
    const derivedId = pageId || (pathname === '/' ? 'home' : lastSegment);
    const settingKey = `${derivedId}_faqs`;

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const faqData = data.data[settingKey];
          if (faqData) {
            setItems(JSON.parse(faqData));
          } else if (derivedId !== 'home') {
            // Fallback to home then global FAQs if service-specific ones don't exist
            if (data.data.home_faqs) {
              setItems(JSON.parse(data.data.home_faqs));
            } else if (data.data.global_faqs) {
              setItems(JSON.parse(data.data.global_faqs));
            }
          } else if (data.data.global_faqs) {
            setItems(JSON.parse(data.data.global_faqs));
          }
        }
      })
      .catch(err => console.error("FAQ fetch error:", err))
      .finally(() => setLoading(false));
  }, [pageId, pathname, initialItems]);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            {title || (pathname === "/" ? "Common Questions" : "Frequently Asked Questions")}
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            {description || "Find answers to the most common inquiries about our process and services."}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`bg-white rounded-2xl border transition-all duration-300 ${openIndex === index ? "border-primary/30 shadow-xl shadow-primary/5" : "border-zinc-200 shadow-sm hover:border-zinc-300"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 flex items-center justify-between text-left"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === index ? "text-primary" : "text-zinc-900"}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? "bg-primary text-white" : "bg-zinc-100 text-zinc-500"}`}>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-500 ${openIndex === index ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="w-full h-px bg-zinc-100 mb-4" />
                  <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
