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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {overview && (overview.title || overview.description) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-20 text-center"
          >
            {overview.title && (
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
                {overview.title}
              </h2>
            )}
            {overview.description && (
              <p className="text-xl text-zinc-600 leading-relaxed max-w-3xl mx-auto">
                {overview.description}
              </p>
            )}
          </motion.div>
        )}

        {features && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mb-20"
          >
            <div className="flex flex-col items-center mb-12">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Our Offerings</span>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 text-center">
                {features.title}
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full mt-4" />
            </div>

            <div className={`grid sm:grid-cols-2 lg:grid-cols-${gridCols === 2 ? 3 : gridCols} gap-8`}>
              {features.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-zinc-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  <div className="relative z-10 flex-shrink-0 w-20 h-20 rounded-2xl bg-zinc-50 flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500 transform group-hover:rotate-6 group-hover:scale-110 shadow-sm">
                    {item.icon ? (
                      <div className="text-primary group-hover:text-white transition-colors duration-500 w-10 h-10 flex items-center justify-center">
                        {item.icon}
                      </div>
                    ) : (
                      <Check className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                    )}
                  </div>

                  <div className="relative z-10">
                    {item.title ? (
                      <>
                        <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-zinc-600 leading-relaxed text-sm">
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <span className="text-zinc-800 font-semibold text-lg">
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {process.title}
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
            </div>

            <div className="relative space-y-8">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 md:left-12 top-8 bottom-8 w-0.5 bg-zinc-200 hidden md:block" />

              {process.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row gap-6 p-8 rounded-3xl bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-zinc-100 group relative z-10"
                >
                  <div className="flex-shrink-0 w-12 h-12 md:w-24 md:h-24 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl md:text-3xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                    {step.icon ? step.icon : (index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
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
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Related Services
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link
                    href={service.link}
                    className="group p-8 rounded-3xl bg-zinc-50 hover:bg-white transition-all duration-300 border border-transparent hover:border-zinc-100 hover:shadow-2xl flex flex-col h-full"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <div className="mt-auto flex items-center text-primary font-bold">
                      Explore Service <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
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
