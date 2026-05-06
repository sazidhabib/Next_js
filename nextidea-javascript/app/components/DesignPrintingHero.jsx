"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function DesignPrintingHero({ title, tagline, description, image }) {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Wavy Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 200C200 100 400 300 600 250C800 200 1000 400 1200 350C1400 300 1600 100 1600 100"
            stroke="var(--primary)"
            strokeWidth="1"
          />
          <path
            d="M-100 400C200 300 400 500 600 450C800 400 1000 600 1200 550C1400 500 1600 300 1600 300"
            stroke="var(--primary)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              {title ? title.split(' ').map((word, i) => i === 0 ? <span key={i} className="text-primary">{word} </span> : word + ' ') : <><span className="text-primary">Redefine</span> Your Corporate Image with Premium Designs and Customized Printing Solutions</>}
            </h1>

            <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
              {description || "Elevate your brand presence with custom-designed diaries, calendars, notebooks, annual reports, and corporate gifts—perfect tools to keep your brand top-of-mind and make a lasting impression."}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/protfolio"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
              >
                View Portfolio <span className="ml-2">→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute inset-0 bg-primary opacity-10"></div>
              <Image
                src={image || "/dp1.jpeg"}
                alt="Premium Brochure Design"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
