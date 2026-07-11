"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { XaiLogo } from "@/components/icons";

const navLinks = ["Platform", "Docs", "Pricing", "Enterprise"];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      className={`sticky top-0 z-50 flex items-center justify-between px-12 py-5 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#27272A] bg-[#09090B]/80 backdrop-blur-xl"
          : "border-[#27272A] bg-transparent"
      }`}
    >
      <XaiLogo />
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((item) => (
          <a
            key={item}
            href="#"
            className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors duration-150 tracking-wide"
          >
            {item}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors px-3 py-1.5">
          Sign in
        </button>
        <button className="text-[13px] bg-white text-[#09090B] px-4 py-1.5 hover:bg-[#E4E4E7] transition-colors font-medium">
          Get early access
        </button>
      </div>
    </motion.nav>
  );
}
