"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/case-study", label: "Case Study" },
  { href: "/contact", label: "Contact" },
];

const portfolioDropdown = [
  { href: "/protfolio", label: "All Demos" },
  { href: "/protfolio?category=Creatives", label: "Creatives" },
  { href: "/protfolio?category=Campaigns", label: "Campaigns" },
  { href: "/protfolio?category=Printing%20%26%20Packaging", label: "Printing & Packaging" },
  { href: "/protfolio?category=Website", label: "Website" },
];

const servicesDropdown = [
  { href: "/services/creative-concept-execution", label: "Creative Concept & Execution" },
  { href: "/services/digital-media-buying", label: "Digital Media Buying" },
  { href: "/services/social-media-marketing", label: "Social Media Marketing" },
  { href: "/services/brand-identity", label: "Brand Identity" },
  { href: "/services/web-design-development", label: "Web Design & Development" },
  { href: "/services/event-and-activation", label: "Event and Activation" },
  { href: "/services/video-production-photography", label: "Video Production & Photography" },
  { 
    href: "/services/seo", 
    label: "SEO",
    subItems: [
      { href: "/services/seo/seo-audit", label: "SEO Audit" },
      { href: "/services/seo/local-seo", label: "Local SEO" },
      { href: "/services/seo/e-commerce-seo", label: "E-commerce SEO" },
    ]
  },
  { href: "/services/digital-pr", label: "Digital PR" },
  { href: "/services/design-printing", label: "Design and Printing Solutions" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [expandedMobileService, setExpandedMobileService] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 hover:text-primary transition-colors"
          >
            <Image src="/nextlogo.png" alt="Logo" width={100} height={100} />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                  ? "text-primary"
                  : "text-zinc-600"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => {
                  setIsPortfolioOpen(!isPortfolioOpen);
                  setIsServicesOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/protfolio") ? "text-primary" : "text-zinc-600"
                  }`}
              >
                Portfolio
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isPortfolioOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isPortfolioOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  {portfolioDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsPortfolioOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:text-primary hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  setIsPortfolioOpen(false);
                }}
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-[500px] overflow-y-auto">
                  {servicesDropdown.map((service) => (
                    <div key={service.href}>
                      <Link
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-600 hover:text-primary hover:bg-gray-50 transition-colors"
                      >
                        {service.label}
                      </Link>
                      {service.subItems && (
                        <div className="bg-gray-50/50 py-1 border-y border-gray-50">
                          {service.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsServicesOpen(false)}
                              className="flex items-center px-4 py-2 pl-9 text-sm text-zinc-500 hover:text-primary hover:bg-gray-100 transition-colors relative before:content-[''] before:absolute before:left-5 before:top-1/2 before:w-1.5 before:h-1.5 before:bg-zinc-300 before:-translate-y-1/2 before:rounded-full hover:before:bg-primary"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://www.facebook.com/NextIdeaSolution"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
            >
              REVIEW US ON FACEBOOK
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
          <div className="lg:hidden pb-6 border-t border-gray-100 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                  ? "text-primary"
                  : "text-zinc-600"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2 border-t border-gray-100">
              <button 
                onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-zinc-900 py-2"
              >
                Portfolio
                <ChevronDown className={`w-4 h-4 transition-transform ${isPortfolioOpen ? "rotate-180" : ""}`} />
              </button>
              {isPortfolioOpen && (
                <div className="mt-1 space-y-1 pb-2">
                  {portfolioDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 pl-4 text-sm text-zinc-600 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="py-2 border-t border-gray-100">
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-zinc-900 py-2"
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {isServicesOpen && (
                <div className="mt-1 space-y-1 pb-2">
                  {servicesDropdown.map((service) => (
                    <div key={service.href}>
                      {service.subItems ? (
                        <div>
                          <button
                            onClick={() => setExpandedMobileService(expandedMobileService === service.label ? "" : service.label)}
                            className="flex items-center justify-between w-full py-2 pl-4 text-sm text-zinc-600 hover:text-primary transition-colors"
                          >
                            {service.label}
                            <ChevronDown className={`w-4 h-4 mr-4 transition-transform ${expandedMobileService === service.label ? "rotate-180" : ""}`} />
                          </button>
                          {expandedMobileService === service.label && (
                            <div className="pl-6 border-l-2 border-gray-100 ml-6 pb-2 mt-1 space-y-1">
                              {service.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block py-2 pl-4 text-sm text-zinc-500 hover:text-primary transition-colors"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={service.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 pl-4 text-sm text-zinc-600 hover:text-primary transition-colors"
                        >
                          {service.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a
              href="https://www.facebook.com/NextIdeaSolution"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full"
            >
              REVIEW US ON FACEBOOK
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
