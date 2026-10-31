'use client';

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[100dvh] mx-auto flex items-center">
      <div className="flex flex-col px-6 items-center lg:flex-row gap-12 max-w-7xl w-full mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[var(--color-accent)] text-[13px] font-mono tracking-[0.25em] uppercase font-semibold"
            >
              Full-Stack Developer
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[var(--color-text)] font-bold text-[clamp(32px,5vw,56px)] leading-[1.15] tracking-tight mt-4"
            >
              Hi, I&apos;m{" "}
              <span className="inline-block text-transparent italic bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 pr-3 box-decoration-clone">
                Mahbub Sazid Habib
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[var(--color-text-muted)] text-[15px] sm:text-[16px] leading-relaxed mt-4 max-w-[520px]"
            >
              Crafting responsive, user-friendly web applications with modern
              tools. Passionate about building impactful projects.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex gap-4 mt-8"
            >
              <a
                href="/Mahbub_Sazid_Habib_Resume.pdf"
                download="Mahbub_Sazid_Habib_Resume.pdf"
              >
                <button
                  type="button"
                  className="text-white bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.97] cursor-pointer shadow-md shadow-sky-500/20"
                >
                  Download Resume
                </button>
              </a>
              <a href="#about">
                <button
                  type="button"
                  className="text-[var(--color-text)] border border-[var(--color-border)] bg-[var(--color-pill-bg)] hover:bg-[var(--color-pill-hover)] px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 active:scale-[0.97] cursor-pointer"
                >
                  Learn More
                </button>
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-b from-sky-500/10 to-transparent rounded-full blur-3xl" />
            <div className="home__img rounded-2xl border border-[var(--color-border)] shadow-xl" />
          </div>
        </motion.div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-[var(--color-border)] flex justify-center items-start p-2 hover:border-[var(--color-accent)] transition-colors">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-[var(--color-accent)] mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
