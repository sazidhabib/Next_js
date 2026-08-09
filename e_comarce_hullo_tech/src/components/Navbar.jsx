"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X, Gift, Zap, Wrench, BarChart3, ChevronRight, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../lib/CartContext";

const staticCategories = [
  {
    name: "Desktop",
    href: "/desktops",
    subCategories: [
      {
        name: "Gaming PC",
        href: "/desktops/gaming-pc",
        subCategories: [
          { name: "Intel Gaming PC", href: "/desktops/gaming-pc/intel" },
          { name: "AMD Gaming PC", href: "/desktops/gaming-pc/amd" },
          { name: "Custom Gaming Build", href: "/desktops/gaming-pc/custom" },
        ]
      },
      {
        name: "Brand PC",
        href: "/desktops/brand-pc",
        subCategories: [
          { name: "HP Brand PC", href: "/desktops/brand-pc/hp" },
          { name: "Dell Brand PC", href: "/desktops/brand-pc/dell" },
          { name: "Lenovo Brand PC", href: "/desktops/brand-pc/lenovo" },
        ]
      },
      { name: "All-in-One PC", href: "/desktops/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/desktops/portable-mini-pc" },
    ],
  },
  {
    name: "Laptop",
    href: "/laptop-notebook",
    subCategories: [
      {
        name: "All Laptop",
        href: "/laptop-notebook/laptop",
        subCategories: [
          { name: "HP Laptops", href: "/laptop-notebook/laptop/hp" },
          { name: "Dell Laptops", href: "/laptop-notebook/laptop/dell" },
          { name: "Lenovo Laptops", href: "/laptop-notebook/laptop/lenovo" },
          { name: "Asus Laptops", href: "/laptop-notebook/laptop/asus" },
        ]
      },
      {
        name: "Gaming Laptop",
        href: "/laptop-notebook/Gaming-Laptop",
        subCategories: [
          { name: "ASUS ROG/TUF", href: "/laptop-notebook/Gaming-Laptop/asus" },
          { name: "MSI Gaming", href: "/laptop-notebook/Gaming-Laptop/msi" },
          { name: "Lenovo Legion", href: "/laptop-notebook/Gaming-Laptop/lenovo" },
        ]
      },
      { name: "Premium Ultrabook", href: "/laptop-notebook/ultrabook" },
      { name: "Laptop Bag", href: "/laptop-bag-backpack" },
    ],
  },
  {
    name: "Component",
    href: "/component",
    subCategories: [
      {
        name: "Processor",
        href: "/component/processor",
        subCategories: [
          { name: "Intel Processor", href: "/component/processor/intel" },
          { name: "AMD Processor", href: "/component/processor/amd" },
        ]
      },
      {
        name: "Motherboard",
        href: "/component/motherboard",
        subCategories: [
          { name: "ASUS Motherboard", href: "/component/motherboard/asus" },
          { name: "MSI Motherboard", href: "/component/motherboard/msi" },
          { name: "Gigabyte Motherboard", href: "/component/motherboard/gigabyte" },
        ]
      },
      {
        name: "Graphics Card",
        href: "/component/graphics-card",
        subCategories: [
          { name: "NVIDIA GeForce", href: "/component/graphics-card/nvidia" },
          { name: "AMD Radeon", href: "/component/graphics-card/amd" },
        ]
      },
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
      {
        name: "Gaming Monitor",
        href: "/gaming-monitor",
        subCategories: [
          { name: "144Hz Monitor", href: "/gaming-monitor/144hz" },
          { name: "240Hz Monitor", href: "/gaming-monitor/240hz" },
          { name: "Ultrawide Gaming", href: "/gaming-monitor/ultrawide" },
        ]
      },
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
      {
        name: "iPhone",
        href: "/apple-iphone",
        subCategories: [
          { name: "iPhone 15 Pro Max", href: "/apple-iphone/iphone-15-pro-max" },
          { name: "iPhone 15 Pro", href: "/apple-iphone/iphone-15-pro" },
          { name: "iPhone 15", href: "/apple-iphone/iphone-15" },
          { name: "iPhone 14 Series", href: "/apple-iphone/iphone-14" },
          { name: "iPhone 13 Series", href: "/apple-iphone/iphone-13" },
        ]
      },
      {
        name: "Samsung",
        href: "/samsung-mobile-phone",
        subCategories: [
          { name: "Galaxy S24 Ultra", href: "/samsung-mobile-phone/s24-ultra" },
          { name: "Galaxy S24 Series", href: "/samsung-mobile-phone/s24" },
          { name: "Galaxy Fold/Flip", href: "/samsung-mobile-phone/fold-flip" },
          { name: "Galaxy A Series", href: "/samsung-mobile-phone/a-series" },
        ]
      },
      { name: "Redmi", href: "/xiaomi-mobile-phone" },
      { name: "Realme", href: "/realme-mobile-phone" },
    ],
  },
  {
    name: "Tablet",
    href: "/tablet-pc",
    subCategories: [
      {
        name: "iPad",
        href: "/apple-ipad",
        subCategories: [
          { name: "iPad Pro", href: "/apple-ipad/ipad-pro" },
          { name: "iPad Air", href: "/apple-ipad/ipad-air" },
          { name: "iPad Mini", href: "/apple-ipad/ipad-mini" },
          { name: "iPad 10.2", href: "/apple-ipad/ipad-10-2" },
        ]
      },
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
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [mobileExpandedSub, setMobileExpandedSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Dynamic menu items loaded from database settings
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    const parseMenu = (menuData) => {
      if (!menuData) return staticCategories;
      if (Array.isArray(menuData)) return menuData;
      if (typeof menuData === 'string') {
        try {
          const parsed = JSON.parse(menuData);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : staticCategories;
        } catch {
          return staticCategories;
        }
      }
      return staticCategories;
    };

    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(parseMenu(data.data.menuItems));
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic storefront menu, using static compile-time fallback:', err);
      });
  }, []);

  const handleMouseEnter = (categoryName) => {
    setActiveMegaMenu(categoryName);
    const cat = categories.find(c => c.name === categoryName);
    if (cat && cat.subCategories && cat.subCategories.length > 0) {
      setActiveSubCategory(cat.subCategories[0].name);
    } else {
      setActiveSubCategory(null);
    }
  };

  const handleMouseLeave = () => {
    setActiveMegaMenu(null);
    setActiveSubCategory(null);
  };

  return (
    <>
      {/* Top Bar */}
      <motion.div
        className="bg-[#010d21] text-white py-2 px-4 text-sm no-print"
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
        className="bg-white border-b border-star-gray/50 relative z-40 no-print"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-0">
          <div className="flex items-center justify-between h-14 md:h-16 gap-4">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-white border border-star-gray rounded px-1.5 py-1 shadow-sm">
                  <Image
                    src="/logo.jpg"
                    alt="HulloTech Logo"
                    width={90}
                    height={27}
                    className="h-6 md:h-8 w-auto"
                  />
                </div>
                <span className="text-lg md:text-2xl font-extrabold bg-gradient-to-r from-star-blue to-blue-600 bg-clip-text text-transparent tracking-tight">
                  HulloTech
                </span>
              </Link>
            </motion.div>

            {/* Search Bar - Desktop Only */}
            <motion.div
              className="hidden md:block flex-1 max-w-2xl mx-4"
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
              className="flex items-center gap-3 md:gap-4"
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
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-[10px] md:text-xs">Cart</span>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-2 bg-star-red text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold"
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
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

          {/* Search Bar - Mobile/Tablet Only */}
          <div className="block md:hidden pb-2 px-1">
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-star-gray rounded-lg focus:outline-none focus:border-star-blue text-sm font-medium"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-star-blue text-white rounded-r-lg hover:bg-star-dark-blue transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        className="bg-white/95 backdrop-blur-md border-b border-star-gray/50 hidden md:block sticky top-0 z-50 shadow-sm no-print"
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-1">
              {categories.map((cat, idx) => {
                const isActive = activeMegaMenu === cat.name;
                return (
                  <div
                    key={cat.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                  >
                    <Link
                      href={cat.href}
                      className={`inline-block py-3 px-3 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                        ? "text-star-blue border-b-2 border-star-blue"
                        : "text-gray-700 hover:text-star-blue border-b-2 border-transparent"
                        }`}
                    >
                      {cat.name}
                    </Link>

                    {/* Cascading Dropdown */}
                    <AnimatePresence>
                      {isActive && cat.subCategories && cat.subCategories.length > 0 && (
                        <motion.div
                          className={`absolute top-full ${idx > categories.length - 4 ? "right-0" : "left-0"
                            } mt-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 flex overflow-hidden min-h-[280px] max-h-[480px]`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Panel 1: Subcategories */}
                          <div className="w-60 py-2 bg-white flex flex-col border-r border-gray-100 overflow-y-auto">
                            {cat.subCategories.map((sub) => {
                              const hasSubSubs = sub.subCategories && sub.subCategories.length > 0;
                              const isSubActive = activeSubCategory === sub.name;
                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onMouseEnter={() => {
                                    if (hasSubSubs) {
                                      setActiveSubCategory(sub.name);
                                    } else {
                                      setActiveSubCategory(null);
                                    }
                                  }}
                                  className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${isSubActive
                                    ? "bg-star-blue text-white"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-star-blue"
                                    }`}
                                >
                                  <span>{sub.name}</span>
                                  {hasSubSubs && (
                                    <ChevronRight className={`w-3.5 h-3.5 ${isSubActive ? "text-white" : "text-gray-400"}`} />
                                  )}
                                </Link>
                              );
                            })}
                          </div>

                          {/* Panel 2: Sub-subcategories */}
                          {(() => {
                            const activeSubData = cat.subCategories.find(sub => sub.name === activeSubCategory);
                            if (activeSubData && activeSubData.subCategories && activeSubData.subCategories.length > 0) {
                              return (
                                <motion.div
                                  className="w-60 py-2 bg-gray-50/80 flex flex-col border-l border-gray-100 overflow-y-auto"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  {activeSubData.subCategories.map((subSub) => (
                                    <Link
                                      key={subSub.name}
                                      href={subSub.href}
                                      className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-star-blue hover:bg-gray-100/75 transition-colors"
                                    >
                                      {subSub.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              );
                            }
                            return null;
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-b border-star-gray shadow-xl fixed top-16 left-0 right-0 z-40 no-print"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="px-4 py-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {categories.map((cat, idx) => {
                const isCatExpanded = mobileExpandedCat === cat.name;
                const hasSubs = cat.subCategories && cat.subCategories.length > 0;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="border-b border-gray-100 pb-1"
                  >
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={cat.href}
                        className="text-sm font-bold text-gray-900 hover:text-star-blue transition-colors pl-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={() => setMobileExpandedCat(isCatExpanded ? null : cat.name)}
                          className="p-1 text-gray-500 hover:text-star-blue"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isCatExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    {hasSubs && isCatExpanded && (
                      <motion.div
                        className="pl-4 pb-2 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                      >
                        {cat.subCategories.map((sub) => {
                          const isSubExpanded = mobileExpandedSub === sub.name;
                          const hasSubSubs = sub.subCategories && sub.subCategories.length > 0;
                          return (
                            <div key={sub.name} className="space-y-1">
                              <div className="flex items-center justify-between py-1">
                                <Link
                                  href={sub.href}
                                  className="text-xs font-semibold text-gray-700 hover:text-star-blue transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {sub.name}
                                </Link>
                                {hasSubSubs && (
                                  <button
                                    onClick={() => setMobileExpandedSub(isSubExpanded ? null : sub.name)}
                                    className="p-1 text-gray-400 hover:text-star-blue"
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSubExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                )}
                              </div>
                              {hasSubSubs && isSubExpanded && (
                                <motion.div
                                  className="pl-3 space-y-1 border-l border-gray-200 ml-1"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.15 }}
                                >
                                  {sub.subCategories.map((subSub) => (
                                    <Link
                                      key={subSub.name}
                                      href={subSub.href}
                                      className="block py-1 text-[11px] text-gray-500 hover:text-star-blue transition-colors"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {subSub.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 no-print"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Link
          href="/cart"
          className="flex items-center justify-center bg-star-blue text-white w-14 h-14 rounded-full shadow-2xl hover:bg-star-dark-blue hover:scale-105 active:scale-95 transition-all duration-300 relative group border border-white/10"
        >
          <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              className="absolute -top-1 -right-1 bg-star-red text-white text-xs rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center font-bold border-2 border-white shadow-md"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {cartCount}
            </motion.span>
          )}
        </Link>
      </motion.div>
    </>
  );
}
