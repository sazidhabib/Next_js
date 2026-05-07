"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Desktop", href: "/desktops" },
    { name: "Laptop", href: "/laptop-notebook" },
    { name: "Component", href: "/component" },
    { name: "Monitor", href: "/monitor" },
    { name: "Phone", href: "/mobile-phone" },
    { name: "Tablet", href: "/tablet-pc" },
    { name: "Camera", href: "/camera" },
    { name: "Security", href: "/security-camera" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-star-blue text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex gap-4">
            <Link href="/help" className="hover:underline">Help Center</Link>
            <Link href="/track-order" className="hover:underline">Track Order</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/account/login" className="hover:underline">Login</Link>
            <Link href="/account/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-star-gray sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-star-blue">
              HulloTech
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-star-gray rounded-l-lg focus:outline-none focus:border-star-blue"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-star-blue text-white rounded-r-lg hover:bg-star-dark-blue transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <Link href="/account" className="hidden md:flex flex-col items-center text-star-text hover:text-star-blue">
                <User className="w-6 h-6" />
                <span className="text-xs">Account</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center text-star-text hover:text-star-blue relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs">Cart</span>
                <span className="absolute -top-1 -right-1 bg-star-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-star-light-gray border-t border-star-gray hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="py-3 text-sm whitespace-nowrap text-star-text hover:text-star-blue font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-star-gray">
          <div className="px-4 py-4 space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="block py-2 text-sm text-star-text hover:text-star-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
