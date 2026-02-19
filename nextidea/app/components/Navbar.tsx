"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

const servicesDropdown = [
  { href: "/services/brand-strategy", label: "Brand Strategy" },
  { href: "/services/creative-design", label: "Creative Design" },
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/digital-marketing", label: "Digital Marketing" },
  { href: "/creative_concept", label: "Creative Concept & Execution" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 hover:text-primary transition-colors"
          >
            Next<span className="text-primary">Idea</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 py-2">
                  {servicesDropdown.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsServicesOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:text-primary hover:bg-zinc-50 transition-colors"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="#contact"
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-zinc-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-zinc-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2 border-t border-zinc-100">
              <div className="text-sm font-medium text-zinc-900 py-2">Services</div>
              {servicesDropdown.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 pl-4 text-sm text-zinc-600 hover:text-primary transition-colors"
                >
                  {service.label}
                </Link>
              ))}
            </div>
            <Link
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
