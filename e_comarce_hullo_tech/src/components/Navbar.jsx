"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

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
      <div className="bg-[#010d21] text-white py-1.5 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex gap-6">
            <Link href="/information/offer" className="hover:underline flex items-center gap-1">
              <span>🎁</span> Offers
            </Link>
            <Link href="/happy-hour" className="hover:underline flex items-center gap-1">
              <span>⚡</span> Happy Hour
            </Link>
            <Link href="/tool/pc_builder" className="hover:underline flex items-center gap-1">
              <span>🛠️</span> PC Builder
            </Link>
            <Link href="/compare" className="hover:underline flex items-center gap-1">
              <span>📊</span> Compare (0)
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/track-order" className="hover:underline hidden md:block">Track Order</Link>
            <Link href="/help" className="hover:underline hidden md:block">Help</Link>
            <Link href="/account/login" className="hover:underline">Login</Link>
            <span className="text-white/40">|</span>
            <Link href="/account/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-star-gray/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
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

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-star-gray rounded-lg focus:outline-none focus:border-star-blue focus:ring-1 focus:ring-star-blue text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-star-blue text-white rounded-r-lg hover:bg-star-dark-blue transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <Link href="/account" className="hidden md:flex flex-col items-center text-star-text hover:text-star-blue transition-colors">
                <User className="w-6 h-6" />
                <span className="text-xs">Account</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center text-star-text hover:text-star-blue relative transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs">Cart</span>
                <span className="absolute -top-1 -right-2 bg-star-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation with Mega Menu */}
        <div className="bg-white border-t border-star-gray hidden md:block relative" onMouseLeave={handleMouseLeave}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                >
                  <Link
                    href={cat.href}
                    className={`inline-block py-3 px-3 text-sm font-medium transition-colors ${activeMegaMenu === cat.name
                      ? "text-star-blue"
                      : "text-star-text hover:text-star-blue"
                      }`}
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mega Menu - Full Width */}
          {activeMegaMenu && activeCategory && activeCategory.subCategories && (
            <div className="mega-menu">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-1">
                    <h3 className="font-semibold text-star-blue mb-3 text-base">Popular {activeCategory.name}</h3>
                    <Link
                      href={activeCategory.href}
                      className="inline-block bg-star-blue text-white px-4 py-2 rounded text-sm hover:bg-star-dark-blue transition-colors"
                    >
                      View All {activeCategory.name}
                    </Link>
                  </div>
                  <div className="col-span-3">
                    <div className="grid grid-cols-3 gap-2">
                      {activeCategory.subCategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="category-link"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-star-gray shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {categories.map((cat) => (
              <div key={cat.name}>
                <Link
                  href={cat.href}
                  className="block py-2 text-sm font-medium text-star-text hover:text-star-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
                {cat.subCategories && (
                  <div className="pl-4 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block py-1.5 text-xs text-gray-600 hover:text-star-blue"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
