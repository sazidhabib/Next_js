"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-auto relative overflow-hidden">
      {/* Logo Watermark Background */}
      <div className="absolute bottom-[-46%] right-[20%] opacity-10 pointer-events-none">
        <Image
          src="/logotrans.png"
          alt="HulloTech watermark"
          width={800}
          height={800}
          className="w-96 h-96 md:w-full md:h-full object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(0, 119, 229, 0.1))" }}
        />
      </div>

      {/* Main Footer */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="bg-white border border-gray-700 rounded p-2 shadow-lg">
                <Image
                  src="/logo.jpg"
                  alt="HulloTech Logo"
                  width={100}
                  height={30}
                  className="h-7 w-auto"
                />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-star-blue to-blue-500 bg-clip-text text-transparent tracking-tight">
                HulloTech
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400 font-medium">Your trusted tech marketplace in Bangladesh.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-star-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">{settings.contactAddress}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-star-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">{settings.contactPhone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-star-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">{settings.contactEmail}</span>
              </div>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-5 text-lg tracking-tight">Shop</h4>
            <ul className="space-y-3 text-sm">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h4 className="text-white font-bold mb-5 text-lg tracking-tight">Support</h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-5 text-lg tracking-tight">Company</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h4 className="text-white font-bold mb-5 text-lg tracking-tight">Newsletter</h4>
            <p className="text-sm mb-4 text-gray-400 font-medium">Subscribe for latest offers and updates</p>
            <div className="flex gap-2 mb-6">
              <motion.input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-star-blue text-white font-medium transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="bg-gradient-to-r from-star-blue to-blue-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-gray-400 font-medium block">We accept:</span>
              <div className="flex gap-2 flex-wrap">
                {["VISA", "MASTER", "BKASH"].map((payment) => (
                  <motion.span
                    key={payment}
                    className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {payment}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-gray-800 bg-black/50 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400 font-medium">{settings.footerText}</p>
            <motion.div
              className="flex gap-6 flex-wrap justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors font-medium text-xs md:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
