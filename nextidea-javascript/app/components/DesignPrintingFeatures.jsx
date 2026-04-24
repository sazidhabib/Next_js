"use client";

import { motion } from "framer-motion";
import { PenTool, Layers, Users, Clock } from "lucide-react";

const features = [
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Tailored Solutions",
    description: "Custom designs that align perfectly with your brand identity and objectives.",
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Quality Materials",
    description: "We use only the best materials to ensure a premium look and feel.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Designers",
    description: "A team of creative professionals dedicated to bringing your vision to life.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "On-Time Delivery",
    description: "Reliable service that ensures your products are delivered when you need them.",
  },
];

export default function DesignPrintingFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-black mb-6"
          >
            Your <span className="text-primary">Partner</span> in Brand Excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 max-w-4xl mx-auto leading-relaxed"
          >
            At Next Idea, we go beyond printing. We partner with you to understand your brand values and translate them into physical products that speak volumes. With a commitment to quality, we ensure that every printed item resonates with your target audience and props up your brand value.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-primary/20 rounded-3xl p-8 text-center hover:shadow-xl hover:shadow-primary/10 transition-all group"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
