"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Monitor, LayoutGrid, Zap, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CaseStudiesClient() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/30 rounded-full blur-[100px] opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-primary-light text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Our Success Stories
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-light">Studies</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Proven results that showcase our expertise across industries, delivering measurable growth for our clients.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Western Consulting Case Study */}
              <motion.div
                key="western"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              >
                <Link href="/case-study/western-consulting" className="group block">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-xl shadow-zinc-200/50">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: "url('case-study.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        Lead Generation
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    Turning Conversations into Conversions: Western Consulting
                  </h3>
                  <p className="text-zinc-600 mb-4 line-clamp-2">
                    How we transformed Western Consulting Firm's lead generation strategy for global markets.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>

              {/* Mostofa Pipe Case Study */}
              <motion.div
                key="mostofa"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <Link href="/case-study/mostofa-pipe" className="group block">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-xl shadow-zinc-200/50">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: "url('CaseStudy2.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        SEO Success
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    From Zero to High-Intent Traffic: Mostofa Pipe Visibility
                  </h3>
                  <p className="text-zinc-600 mb-4 line-clamp-2">
                    Building a dominant SEO presence from scratch in just 5 months for an industry leader.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>

              {/* Urban Imperials Case Study */}
              <motion.div
                key="urban"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <Link href="/case-study/urban-imperials" className="group block">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-xl shadow-zinc-200/50">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: "url('case-study3.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900 uppercase tracking-wider">
                        Real Estate
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    300X ROAS for Urban's Premium Real Estate Project
                  </h3>
                  <p className="text-zinc-600 mb-4 line-clamp-2">
                    How high-targeted digital campaigns drove exceptional returns for luxury housing.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-zinc-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                Our Approach to Success
              </h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                Every case study represents our commitment to delivering measurable results through strategic thinking, creative execution, and technical excellence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                key="approach1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="flex items-start gap-6"
              >
                <Monitor className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Data-Driven Strategy
                  </h3>
                  <p className="text-zinc-600">
                    We begin with deep research and analytics to understand your market, competition, and opportunities.
                  </p>
                </div>
              </motion.div>

              <motion.div
                key="approach2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="flex items-start gap-6"
              >
                <Zap className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Innovative Execution
                  </h3>
                  <p className="text-zinc-600">
                    Our team combines creativity with technical expertise to deliver solutions that stand out.
                  </p>
                </div>
              </motion.div>

              <motion.div
                key="approach3"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="flex items-start gap-6"
              >
                <LayoutGrid className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Measurable Results
                  </h3>
                  <p className="text-zinc-600">
                    We focus on metrics that matter—conversions, revenue growth, and ROI.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
