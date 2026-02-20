"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-study", label: "Case Study" },
  { href: "/contact", label: "Contact" },
];

const servicesDropdown = [
  { href: "/services/creative-concept-execution", label: "Creative Concept & Execution" },
  { href: "/services/digital-media-buying", label: "Digital Media Buying" },
  { href: "/services/social-media-marketing", label: "Social Media Marketing" },
  { href: "/services/brand-identity", label: "Brand Identity" },
  { href: "/services/web-design-development", label: "Web Design & Development" },
  { href: "/services/event-and-activation", label: "Event and Activation" },
  { href: "/services/video-production-photography", label: "Video Production & Photography" },
  { href: "/services/seo", label: "SEO" },
  { href: "/services/digital-pr", label: "Digital PR" },
  { href: "/services/design-printing", label: "Design and Printing Solutions" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 hover:text-primary transition-colors"
          >
            GEEKY <span className="text-primary">Social</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
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
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-96 overflow-y-auto">
                  {servicesDropdown.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsServicesOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:text-primary hover:bg-gray-50 transition-colors"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://www.designrush.com/agency/profile/geeky-social-ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
            >
              REVIEW US ON DESIGNRUSH
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-zinc-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-gray-100">
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
            <div className="py-2 border-t border-gray-100">
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
            <a
              href="https://www.designrush.com/agency/profile/geeky-social-ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full"
            >
              REVIEW US ON DESIGNRUSH
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
