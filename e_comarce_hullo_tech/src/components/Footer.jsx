"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState({
    contactAddress: "123 Tech Street, Dhaka, Bangladesh",
    contactPhone: "+880 123-456-7890",
    contactEmail: "support@hullotech.com",
    footerText: "© 2026 HulloTech. All rights reserved.",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setSettings({
            contactAddress: data.data.contactAddress || "123 Tech Street, Dhaka, Bangladesh",
            contactPhone: data.data.contactPhone || "+880 123-456-7890",
            contactEmail: data.data.contactEmail || "support@hullotech.com",
            footerText: data.data.footerText || "© 2026 HulloTech. All rights reserved.",
          });
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const shopLinks = [
    { name: "Desktop", href: "/desktops" },
    { name: "Laptop", href: "/laptop-notebook" },
    { name: "Component", href: "/component" },
    { name: "Monitor", href: "/monitor" },
    { name: "Phone", href: "/mobile-phone" },
    { name: "Tablet", href: "/tablet-pc" },
    { name: "Camera", href: "/camera" },
    { name: "Security", href: "/security-camera" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Track Order", href: "/track-order" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Warranty", href: "/returns" },
    { name: "FAQ", href: "/faq" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Store Locator", href: "/stores" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="bg-white border border-gray-700 rounded p-2">
                <Image
                  src="/logo.jpg"
                  alt="HulloTech Logo"
                  width={100}
                  height={30}
                  className="h-7 w-auto"
                />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-star-blue to-blue-600 bg-clip-text text-transparent tracking-tight">
                HulloTech
              </span>
            </Link>
            <p className="text-sm mb-4">Your trusted tech marketplace in Bangladesh.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-star-blue" />
                <span>{settings.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-star-blue" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-star-blue" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-white font-semibold mb-3">Newsletter</h4>
            <p className="text-sm mb-3">Subscribe for latest offers and updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-star-blue text-white"
              />
              <button className="bg-star-blue text-white px-4 py-2 rounded hover:bg-star-dark-blue transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="text-xs text-gray-400">We accept:</span>
              <div className="flex gap-2 text-xs">
                <span className="bg-gray-800 px-2 py-1 rounded">VISA</span>
                <span className="bg-gray-800 px-2 py-1 rounded">MASTER</span>
                <span className="bg-gray-800 px-2 py-1 rounded">BKASH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>{settings.footerText}</p>
            <div className="flex gap-4">
              {legalLinks.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
