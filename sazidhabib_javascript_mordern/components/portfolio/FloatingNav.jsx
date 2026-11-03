"use client";

import { useState, useEffect } from "react";
import { FiHome, FiUser, FiBriefcase, FiLayers, FiDollarSign, FiMail, FiCheckCircle } from "react-icons/fi";

const navItems = [
  { id: "top", label: "Home", icon: FiHome },
  { id: "about", label: "About", icon: FiUser },
  { id: "exp", label: "Career", icon: FiCheckCircle },
  { id: "work", label: "Work", icon: FiBriefcase },
  { id: "services", label: "Services", icon: FiLayers },
  { id: "pricing", label: "Pricing", icon: FiDollarSign },
  { id: "contact", label: "Contact", icon: FiMail },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = id === "top" ? 0 : element.offsetTop - 40;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-300 ${
        scrolled ? "bottom-6" : "bottom-8"
      }`}
      aria-label="Floating Navigation Bar"
    >
      <nav className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-[#0B0C10]/85 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80 ring-1 ring-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-white/15 shadow-sm shadow-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title={item.label}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className={`hidden md:inline ${isActive ? "font-semibold" : "opacity-80"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[0.5px]" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

