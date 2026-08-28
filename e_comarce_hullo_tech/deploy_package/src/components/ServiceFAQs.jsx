"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "How long does a typical repair take?",
    answer:
      "Most repairs take 3-7 business days depending on the device and issue. We offer express service for minor repairs (same-day available on eligible items). You'll receive a detailed estimate after diagnosis.",
  },
  {
    id: 2,
    question: "Do you provide warranty on repairs?",
    answer:
      "Yes, all our repairs come with a 90-day warranty on parts and labor. Warranty period may be longer for certain services. Original manufacturer warranty is preserved for covered repairs.",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit cards, debit cards, mobile banking (bKash, Nagad, Rocket), and bank transfers. A 50% advance payment is required to start the service.",
  },
  {
    id: 4,
    question: "Do I need to book an appointment?",
    answer:
      "While walk-ins are welcome, we recommend booking an appointment to avoid waiting times. You can book through our website, phone, or visit any service center directly.",
  },
  {
    id: 5,
    question: "What happens if my device can't be repaired?",
    answer:
      "If repair isn't possible, we'll inform you with a detailed explanation. In such cases, no service charge is applied for the diagnosis. We can help with device replacement options.",
  },
  {
    id: 6,
    question: "Are you authorized for warranty repairs?",
    answer:
      "Yes, HulloTech is an authorized service center for major brands including Dell, HP, Lenovo, Apple, Samsung, and others. We use genuine parts for all repairs.",
  },
];

export default function ServiceFAQs() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="bg-star-light-gray py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Find answers to common questions about our service center
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-star-gray overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-bold text-gray-800 text-left text-sm md:text-base">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-star-blue flex-shrink-0 transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="px-6 py-4 bg-blue-50 border-t border-star-gray">
                  <p className="text-gray-700 text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 border border-star-blue text-center">
          <p className="text-gray-800 mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-block px-6 py-2 bg-star-blue text-white rounded-lg font-medium hover:bg-star-dark-blue transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
