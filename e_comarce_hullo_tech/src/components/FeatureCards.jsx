"use client";

import { motion } from "framer-motion";
import { Laptop, AlertCircle, Home, Wrench } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: 1,
    icon: Laptop,
    title: "Laptop Finder",
    description: "Find the perfect laptop for your needs",
    href: "/laptop-finder",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    id: 2,
    icon: AlertCircle,
    title: "Raise a Complain",
    description: "Share your experience with us",
    href: "/complain",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    id: 3,
    icon: Home,
    title: "Home Service",
    description: "Get expert help at your doorstep",
    href: "/service-center",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    id: 4,
    icon: Wrench,
    title: "Servicing Center",
    description: "Professional device repair",
    href: "/service-center",
    gradient: "from-violet-500 to-purple-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function FeatureCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <motion.div key={feature.id} variants={itemVariants}>
              <Link
                href={feature.href}
                className="group block h-full"
              >
                <div className="relative h-full bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col items-start gap-4 hover:shadow-xl hover:border-gray-200 transition-all duration-500 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-[0.04] rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-500 group-hover:opacity-[0.08] group-hover:scale-150`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-black/5`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-300 group-hover:text-blue-600 transition-colors mt-auto inline-flex items-center gap-1">
                    Learn more
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
