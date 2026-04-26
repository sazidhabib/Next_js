"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, Loader2 } from "lucide-react";

export default function ServicesSection() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error("Services fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const services = settings?.home_services_list 
    ? JSON.parse(settings.home_services_list) 
    : [];

  if (loading) return null;

  return (
    <section id="services" className="py-24 bg-surface-dark text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-[#Eaeaea]">
            {settings?.home_services_title || "What We Do"}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full origin-center"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = Icons[service.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] transition-all duration-300 border border-zinc-800 hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <IconComponent className="w-24 h-24 text-white" />
                </div>

                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  {service.description}
                </p>

                <Link
                  href={service.link || "#"}
                  className="inline-flex items-center text-primary text-sm font-semibold group-hover:tracking-wider transition-all"
                >
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
