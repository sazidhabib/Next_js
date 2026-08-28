"use client";

import Link from "next/link";
import { Wrench, MapPin, Phone, Mail } from "lucide-react";

export default function ServiceCenterNavbar() {
  return (
    <nav className="bg-white border-b border-star-gray shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-star-blue rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 hover:text-star-blue"
            >
              HulloTech Service Center
            </Link>
          </div>

          {/* Quick Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#services"
              className="text-sm text-gray-700 hover:text-star-blue font-medium"
            >
              Services
            </Link>
            <Link
              href="#locations"
              className="text-sm text-gray-700 hover:text-star-blue font-medium"
            >
              Locations
            </Link>
            <Link
              href="#contact"
              className="text-sm text-gray-700 hover:text-star-blue font-medium"
            >
              Contact
            </Link>
            <Link
              href="#faq"
              className="text-sm text-gray-700 hover:text-star-blue font-medium"
            >
              FAQ
            </Link>
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-star-blue" />
              <span className="text-sm text-gray-700">+880-2-XXXX-XXXX</span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-star-blue text-white rounded-lg text-sm font-medium hover:bg-star-dark-blue transition-colors"
            >
              Back to Store
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Link
            href="/"
            className="lg:hidden px-3 py-2 bg-star-blue text-white rounded text-sm hover:bg-star-dark-blue"
          >
            Store
          </Link>
        </div>
      </div>
    </nav>
  );
}
