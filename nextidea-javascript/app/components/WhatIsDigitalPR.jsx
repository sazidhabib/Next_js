"use client";

import { motion } from "framer-motion";
import { Building2, UserPlus, ShoppingCart, Briefcase, Link } from "lucide-react";

const perfectFor = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Startups launching new products",
  },
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Businesses looking to attract investors",
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "E-commerce stores needing authority",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "B2B businesses wanting to outshine rivals",
  },
  {
    icon: <Link className="w-8 h-8" />,
    title: "Companies seeking SEO boosts with link building",
  },
];

export default function WhatIsDigitalPR() {
  return (
    <section className="py-20 bg-white text-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
            What is Digital PR?
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Digital PR is a modern form of public relations that focuses on increasing your online presence through strategic content, media outreach, and high-authority link placements. Unlike traditional PR, online PR in digital marketing focuses on digital outcomes like search rankings, referral traffic, and brand mentions on Google that bring measurable results.
          </p>
        </motion.div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Perfect for</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {perfectFor.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary/5 border border-primary/10 rounded-2xl p-6 w-full max-w-[220px] flex flex-col items-center text-center hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1"
            >
              <div className="text-primary mb-4 bg-white p-3 rounded-xl shadow-sm">
                {item.icon}
              </div>
              <p className="text-black font-medium text-sm">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
