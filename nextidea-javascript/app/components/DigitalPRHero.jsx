"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function DigitalPRHero({ title, tagline, description }) {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              {title ? title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className="text-primary">{word}</span> : word + ' ') : <>Elevate Your Brand's Online Visibility With Strategic{" "}
              <span className="text-primary">Digital PR Campaigns</span></>}
            </h1>

            <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
              {description ? description : <><strong>Looking to get your brand featured in top news and media sites?</strong>
              <br className="mb-2" />
              Our Digital PR Services help you earn media coverage, build backlinks, trust
              and establish authority to improve your SEO and online authority.</>}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="#contact"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg aspect-[4/3]">
              <Image 
                src="/Digital-PR.png" 
                alt="Digital PR Campaigns" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
