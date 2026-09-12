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
              className="text-sky-400 text-[13px] font-mono tracking-[0.25em] uppercase"
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
              className="text-white font-bold text-[clamp(32px,5vw,56px)] leading-[1.15] tracking-tight mt-4"
            >
              Hi, I&apos;m{" "}
              <span className="inline-block text-transparent italic bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 pr-3 box-decoration-clone">
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
              className="text-slate-400 text-[15px] sm:text-[16px] leading-relaxed mt-4 max-w-[520px]"
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
                  className="text-white bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 active:scale-[0.97]"
                >
                  Download Resume
                </button>
              </a>
              <a href="#about">
                <button
                  type="button"
                  className="text-slate-300 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 active:scale-[0.97]"
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
            <div className="home__img rounded-2xl border border-white/10 shadow-glass" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 w-full flex justify-center items-center"
      >
        <a href="#about">
          <div className="w-[30px] h-[52px] rounded-full border border-white flex justify-center items-start p-2 hover:border-white/20 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-2 h-2 rounded-full bg-slate-400"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
