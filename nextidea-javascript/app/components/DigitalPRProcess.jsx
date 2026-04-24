"use client";

import { motion } from "framer-motion";
import { Search, Target, Megaphone, BarChart } from "lucide-react";

const processSteps = [
  {
    icon: <Search className="w-10 h-10" />,
    title: "Audit & Research",
    description: "We study your brand, industry trends, and media landscape to identify unique opportunities for coverage.",
  },
  {
    icon: <Target className="w-10 h-10" />,
    title: "Strategy & Story Building",
    description: "We develop a pitch-ready PR strategy with strong, newsworthy angles that resonate with journalists.",
  },
  {
    icon: <Megaphone className="w-10 h-10" />,
    title: "Media Outreach & Pitching",
    description: "Our PR specialists pitch to top-tier journalists, bloggers, and influencers to secure high-quality placements.",
  },
  {
    icon: <BarChart className="w-10 h-10" />,
    title: "Placements & Reporting",
    description: "We secure features, mentions, and backlinks. You receive comprehensive reports detailing the impact on your SEO.",
  },
];

export default function DigitalPRProcess() {
  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-black mb-6"
          >
            How Our Digital PR Services Work
          </motion.h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
            We utilize a data-driven approach to get your brand featured on top tier media outlets. We leverage digital PR tools to research industry trends and opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
