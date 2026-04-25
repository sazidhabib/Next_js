"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ServiceHero({
  icon,
  title,
  tagline,
  description,
  buttonText = "See our packages",
  buttonLink = "#packages",
}) {
  const renderTitle = () => {
    if (typeof title === 'string') {
        const words = title.trim().split(/\s+/);
        if (words.length > 1) {
            const lastWord = words.pop();
            const titleStart = words.join(" ");
            return (
                <>
                    {titleStart} <span className="text-primary">{lastWord}</span>
                </>
            );
        }
    }
    return <span className="text-primary">{title}</span>;
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Waves (SVG) */}
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
            d="M-100 300C200 200 400 400 600 350C800 300 1000 500 1200 450C1400 400 1600 200 1600 200"
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

      <div className="container mx-auto px-4 relative z-10 text-center">
        {icon && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-8"
            >
                {icon}
            </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-7xl font-bold text-black mb-6 leading-tight max-w-5xl mx-auto"
        >
          {renderTitle()}
        </motion.h1>

        {tagline && (
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-zinc-600 font-medium max-w-3xl mx-auto mb-4"
            >
            {tagline}
            </motion.p>
        )}

        {description && (
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10"
            >
            {description}
            </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href={buttonLink}
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-primary/30"
          >
            {buttonText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
