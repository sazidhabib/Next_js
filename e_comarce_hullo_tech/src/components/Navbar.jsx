"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X, Gift, Zap, Wrench, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    name: "Desktop",
    href: "/desktops",
    subCategories: [
      { name: "Gaming PC", href: "/desktops/gaming-pc" },
      { name: "Brand PC", href: "/desktops/brand-pc" },
      { name: "All-in-One PC", href: "/desktops/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/desktops/portable-mini-pc" },
    ],
  },
  {
    name: "Laptop",
    href: "/laptop-notebook",
    subCategories: [
      { name: "All Laptop", href: "/laptop-notebook/laptop" },
      { name: "Gaming Laptop", href: "/laptop-notebook/Gaming-Laptop" },
      { name: "Premium Ultrabook", href: "/laptop-notebook/ultrabook" },
      { name: "Laptop Bag", href: "/laptop-bag-backpack" },
    ],
  },
  {
    name: "Component",
    href: "/component",
    subCategories: [
      { name: "Processor", href: "/component/processor" },
      { name: "Motherboard", href: "/component/motherboard" },
      { name: "Graphics Card", href: "/component/graphics-card" },
      { name: "RAM (Desktop)", href: "/component/ram" },
      { name: "RAM (Laptop)", href: "/component/laptop-ram" },
      { name: "SSD", href: "/ssd" },
      { name: "Hard Disk Drive", href: "/component/hard-disk-drive" },
      { name: "Power Supply", href: "/component/power-supply" },
      { name: "Casing", href: "/component/casing" },
    ],
  },
  {
    name: "Monitor",
    href: "/monitor",
    subCategories: [
      { name: "Gaming Monitor", href: "/gaming-monitor" },
      { name: "Curved Monitor", href: "/curved-monitor" },
      { name: "4K Monitor", href: "/4k-monitor" },
      { name: "Portable Monitor", href: "/portable-monitor" },
    ],
  },
  {
    name: "Power",
    href: "/power",
    subCategories: [
      { name: "UPS", href: "/ups" },
      { name: "Online UPS", href: "/online-ups" },
      { name: "Mini UPS", href: "/mini-ups" },
      { name: "Portable Power Station", href: "/portable-power-station" },
    ],
  },
  {
    name: "Phone",
    href: "/mobile-phone",
    subCategories: [
      { name: "iPhone", href: "/apple-iphone" },
      { name: "Samsung", href: "/samsung-mobile-phone" },
      { name: "Redmi", href: "/xiaomi-mobile-phone" },
      { name: "Realme", href: "/realme-mobile-phone" },
    ],
  },
  {
    name: "Tablet",
    href: "/tablet-pc",
    subCategories: [
      { name: "iPad", href: "/apple-ipad" },
      { name: "Samsung", href: "/samsung-tablet" },
      { name: "Lenovo", href: "/tablet-pc/lenovo-tablet-pc" },
      { name: "Graphics Tablet", href: "/graphics-tablet" },
    ],
  },
  {
    name: "Office Equipment",
    href: "/office-equipment",
    subCategories: [
      { name: "Printer", href: "/printer" },
      { name: "Photocopier", href: "/photocopier" },
      { name: "Projector", href: "/projector" },
      { name: "Scanner", href: "/office-equipment/Scanner" },
    ],
  },
  {
    name: "Camera",
    href: "/camera",
    subCategories: [
      { name: "DSLR", href: "/dslr-camera" },
      { name: "Mirrorless Camera", href: "/mirrorless-camera" },
      { name: "Action Camera", href: "/camera/action-camera" },
      { name: "Security Camera", href: "/security-camera" },
    ],
  },
  {
    name: "Security",
    href: "/security-camera",
    subCategories: [
      { name: "WiFi Camera", href: "/wifi-camera" },
      { name: "IP Camera", href: "/ip-camera" },
      { name: "DVR/NVR", href: "/dvr-nvr" },
      { name: "Accessories", href: "/security-accessories" },
    ],
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleMouseEnter = (categoryName) => {
    setActiveMegaMenu(categoryName);
  };

  const handleMouseLeave = () => {
    setActiveMegaMenu(null);
  };

  const activeCategory = categories.find(cat => cat.name === activeMegaMenu);

  return (
    <>
      {/* Top Bar */}
      <motion.div
        className="bg-[#010d21] text-white py-2 px-4 text-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex gap-6">
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/information/offer" className="hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium">
                  <Gift className="w-3.5 h-3.5" /> Offers
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/happy-hour" className="hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium">
                  <Zap className="w-3.5 h-3.5" /> Happy Hour
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/tool/pc_builder" className="hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium">
                  <Wrench className="w-3.5 h-3.5" /> PC Builder
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link href="/compare" className="hover:text-blue-300 flex items-center gap-1.5 transition-colors font-medium">
                  <BarChart3 className="w-3.5 h-3.5" /> Compare (0)
                </Link>
              </motion.div>
          </div>
          <div className="flex gap-4">
            <Link href="/track-order" className="hover:text-blue-300 hidden md:block transition-colors font-medium">Track Order</Link>
            <Link href="/help" className="hover:text-blue-300 hidden md:block transition-colors font-medium">Help</Link>
            <Link href="/account/login" className="hover:text-blue-300 transition-colors font-medium">Login</Link>
            <span className="text-white/40">|</span>
            <Link href="/account/register" className="hover:text-blue-300 transition-colors font-medium">Register</Link>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.div
        className="bg-white/80 backdrop-blur-md border-b border-star-gray/50 sticky top-0 z-50 shadow-sm"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="bg-white border border-star-gray rounded px-2 py-1.5 shadow-sm">
                  <Image
                    src="/logo.jpg"
                    alt="HulloTech Logo"
                    width={100}
                    height={30}
                    className="h-8 w-auto"
                  />
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-star-blue to-blue-600 bg-clip-text text-transparent tracking-tight">
                  HulloTech
                </span>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="flex-1 max-w-2xl mx-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <motion.input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-star-gray rounded-lg focus:outline-none focus:border-star-blue focus:ring-2 focus:ring-star-blue/20 text-sm transition-all duration-300 font-medium"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-star-blue text-white rounded-r-lg hover:bg-star-dark-blue transition-all"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>

            {/* Right Icons */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/account" className="hidden md:flex flex-col items-center text-star-text hover:text-star-blue transition-colors font-medium">
                  <User className="w-6 h-6" />
                  <span className="text-xs">Account</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/cart" className="flex flex-col items-center text-star-text hover:text-star-blue relative transition-colors font-medium">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-xs">Cart</span>
                  <motion.span
                    className="absolute -top-1 -right-2 bg-star-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    whileHover={{ scale: 1.1 }}
                  >
                    0
                  </motion.span>
                </Link>
              </motion.div>
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 text-star-text hover:text-star-blue transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Category Navigation with Mega Menu */}
        <motion.div
          className="bg-white border-t border-star-gray hidden md:block relative"
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                >
                  <Link
                    href={cat.href}
                    className={`inline-block py-3 px-3 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeMegaMenu === cat.name
                        ? "text-star-blue border-b-2 border-star-blue"
                        : "text-gray-700 hover:text-star-blue border-b-2 border-transparent"
                      }`}
                  >
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mega Menu - Full Width */}
          <AnimatePresence>
            {activeMegaMenu && activeCategory && activeCategory.subCategories && (
              <motion.div
                className="absolute top-full left-0 right-0 bg-white border-b border-star-gray/50 shadow-xl z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-4 gap-8">
                    <motion.div
                      className="col-span-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-bold text-star-blue mb-4 text-base tracking-tight">Popular {activeCategory.name}</h3>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={activeCategory.href}
                          className="inline-block bg-gradient-to-r from-star-blue to-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          View All {activeCategory.name}
                        </Link>
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="col-span-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {activeCategory.subCategories.map((sub, idx) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                          >
                            <Link
                              href={sub.href}
                              className="block py-2 px-3 text-sm text-gray-700 hover:text-star-blue hover:bg-star-light-gray rounded transition-all duration-300 font-medium"
                            >
                              {sub.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-b border-star-gray shadow-xl"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                >
                  <Link
                    href={cat.href}
                    className="block py-2.5 text-sm font-semibold text-gray-900 hover:text-star-blue transition-colors border-l-2 border-transparent hover:border-star-blue pl-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  {cat.subCategories && (
                    <motion.div
                      className="pl-4 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      {cat.subCategories.map((sub, sidx) => (
                        <motion.div
                          key={sub.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: sidx * 0.02 }}
                        >
                          <Link
                            href={sub.href}
                            className="block py-1.5 text-xs text-gray-600 hover:text-star-blue transition-colors font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
