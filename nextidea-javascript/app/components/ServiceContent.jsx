"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function ServiceContent({
  overview,
  features,
  process,
  relatedServices,
  gridCols = 2,
}) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
            {overview.title}
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {overview.description}
          </p>
        </motion.div>

        {features && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto mb-20"
          >
            <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center uppercase tracking-widest">
              {features.title}
            </h2>
            <div className={`grid md:grid-cols-${gridCols} gap-8`}>
              {features.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-zinc-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    {item.icon ? (
                      <div className="text-primary w-8 h-8">{item.icon}</div>
                    ) : (
                      <Check className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    {item.title ? (
                      <>
                        <h3 className="text-xl font-bold text-zinc-900 mb-3 uppercase tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-zinc-600 leading-relaxed text-sm">
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <span className="text-zinc-700 font-medium">
                        {item.text || item}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {process && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">
              {process.title}
            </h2>
            <div className="space-y-6">
              {process.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-6 p-6 rounded-2xl bg-zinc-50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg overflow-hidden p-2">
                    {step.icon ? step.icon : index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {relatedServices && relatedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    href={service.link}
                    className="group p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200 hover:border-primary/50 block"
                  >
                    {service.icon}
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
