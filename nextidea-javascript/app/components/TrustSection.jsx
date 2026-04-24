"use client";

import { motion } from "framer-motion";
import { Award, Target, Shield, Zap } from "lucide-react";

const reasons = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "10+ Years of Experience",
    description: "We have been helping brands grow for over a decade with proven strategies.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Data-Driven Approach",
    description: "We use data to drive our decisions and ensure the best results for your ROI.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Transparency & Integrity",
    description: "We believe in being honest and transparent with our clients at every step.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lasting Results",
    description: "Our strategies are designed to deliver long-term growth, not just temporary spikes.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-black mb-4"
          >
            Why do brands trust Next Idea?
          </motion.h2>
          <p className="text-zinc-500 text-lg">
            Delivering excellence through strategy and execution.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 text-center hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                {reason.title}
              </h3>
              <p className="text-zinc-600">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
