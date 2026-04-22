"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Research and Analysis",
    description: "We begin by analyzing the top competitors for your primary search terms. This includes detailed SERP analysis to uncover content gaps, backlink profiles and page structures. We also conduct a user intent study to identify what your customers are searching for and why.",
    color: "red", // Red accent
  },
  {
    number: "2",
    title: "Strategy Development",
    description: "Based on our research, we create a customized SEO strategy that aligns with your business goals. We define success metrics, timelines and reporting cadence. You receive a clear roadmap that covers on-page, technical, off-page and local SEO services.",
    color: "black", // Black accent
  },
  {
    number: "3",
    title: "Implementation",
    description: "Our SEO experts execute the plan, optimizing your website content, improving technical health and launching targeted link building campaigns. We prioritize quick-win tasks while planning long-term initiatives for sustained growth.",
    color: "red",
  },
  {
    number: "4",
    title: "Monitoring and Reporting",
    description: "You will receive monthly performance reports highlighting keyword rankings, organic traffic growth, conversion rates and ROI metrics. Our transparent reporting ensures you see the impact of our work on your bottom line.",
    color: "black",
  },
];

export default function SEOProcess() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
              How We Work?
            </h2>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              const accentColor = step.color === "red" ? "bg-primary" : "bg-zinc-900";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden shadow-xl border border-zinc-100 bg-white min-h-[220px]`}
                >
                  {/* Left Side (Even: Number, Odd: Content) */}
                  {isEven ? (
                    // Step 2, 4 (Number Left)
                    <>
                      <div className={`w-full md:w-32 ${accentColor} flex flex-col items-center justify-center text-white p-6`}>
                        <span className="text-4xl font-black">{step.number}</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Step</span>
                      </div>
                      <div className={`flex-grow p-8 flex flex-col justify-center border-l-8 border-zinc-900`}>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                        <p className="text-zinc-600 leading-relaxed">{step.description}</p>
                      </div>
                    </>
                  ) : (
                    // Step 1, 3 (Content Left)
                    <>
                      <div className={`flex-grow p-8 flex flex-col justify-center border-r-8 border-[#c01b33]`}>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                        <p className="text-zinc-600 leading-relaxed">{step.description}</p>
                      </div>
                      <div className={`w-full md:w-32 ${accentColor} flex flex-col items-center justify-center text-white p-6 order-first md:order-last`}>
                        <span className="text-4xl font-black">{step.number}</span>
                        <span className="text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Step</span>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
