'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks } from "../constants";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full flex justify-center fixed top-0 z-50 transition-all duration-500 px-4 sm:px-8 ${
        scrolled ? "py-4 sm:py-6" : "py-6 sm:py-8"
      }`}
    >
      <div
        className={`w-full flex justify-between items-center max-w-7xl mx-auto transition-all duration-500 ${
          scrolled
            ? "py-3 px-6 sm:px-8 rounded-full glass shadow-lg"
            : "py-3 px-4 sm:px-8 bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            if (typeof window !== 'undefined') window.scrollTo(0, 0);
          }}
        >
          <span
            className={`text-white font-bold cursor-pointer tracking-tight transition-all duration-500 ${
              scrolled ? "text-base" : "text-2xl"
            }`}
          >
            Sazid<span className="text-sky-400">.</span>Habib
          </span>
        </Link>

        <ul className="list-none items-center hidden md:flex flex-row gap-6">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`transition-all duration-500 ease-in-out ${
                scrolled ? "text-[13px]" : "text-lg"
              } ${
                active === nav.title ? "text-white" : "text-slate-400"
              } hover:text-white font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`} className="inline-block">
                {nav.title}
              </a>
            </li>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white transition-colors p-1.5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <a
            href="https://github.com/sazidhabib"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="text-white bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 focus:ring-0 font-medium rounded-lg text-sm px-4 py-1.5 transition-all duration-300"
            >
              GitHub
            </button>
          </a>
        </ul>

        <div className="md:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? "/src/assets/close.svg" : "/src/assets/menu.svg"}
            alt="menu"
            className="w-[24px] h-[24px] object-contain cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 glass absolute top-16 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-medium cursor-pointer text-[15px] ${
                    active === nav.title ? "text-white" : "text-slate-400"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
