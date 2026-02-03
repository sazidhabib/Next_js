"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Bell, Plus, User, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useSettings } from "../hooks/useSettings";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const { settings } = useSettings();

  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "text-primary font-bold" : "text-gray-600 hover:text-primary font-medium";
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Hide Navbar on Admin Routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  // Dashboard Navbar
  if (pathname === "/dashboard") {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt={settings.site_name}
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <span className="text-2xl">📷</span> {settings.site_name}
              </span>
            )}
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
            </button>
            <Link
              href="/"
              className="text-gray-600 hover:text-primary font-medium"
            >
              হোম
            </Link>
            <Link
              href="/add-frame"
              className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-lg shadow-blue-200"
            >
              <Plus size={18} />
              ফ্রেম যুক্ত করুন
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <Image
                width={45}
                height={45}
                src={settings.logo_url}
                alt={settings.site_name}
                className="h-10 w-auto"
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-primary rounded lg:hidden"></div>
                <span className="text-xl font-bold text-primary flex items-center gap-2">
                  <span className="text-2xl">📷</span> {settings.site_name}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={isActive("/")}
            >
              হোম
            </Link>
            <Link
              href="/popular-frames"
              className={isActive("/popular-frames")}
            >
              জনপ্রিয় ফ্রেম
            </Link>
            <Link
              href="/text-frames"
              className={isActive("/text-frames")}
            >
              টেক্সট ফ্রেম
            </Link>
            <Link
              href="/all-frames"
              className={isActive("/all-frames")}
            >
              সকল ফ্রেম
            </Link>
            <Link
              href="/add-frame"
              className={isActive("/add-frame")}
            >
              যুক্ত করুন
            </Link>
            <Link
              href="/contact"
              className={isActive("/contact")}
            >
              যোগাযোগ
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-4">
              {!user || user.role === "admin" ? (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-blue-800 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg shadow-blue-200"
                >
                  <User size={18} />
                  লগইন
                </Link>
              ) : (
                <>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <Link
                    href="/add-frame"
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md shadow-blue-100"
                  >
                    <Plus size={18} />
                    যুক্ত করুন
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full font-medium border border-green-200 hover:bg-green-100"
                    >
                      <User size={18} />
                      {user.username || "User"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="লগআউট"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50"
            >
              হোম
            </Link>
            <Link
              href="/popular-frames"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50"
            >
              জনপ্রিয় ফ্রেম
            </Link>
            <Link
              href="/text-frames"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50"
            >
              টেক্সট ফ্রেম
            </Link>
            <Link
              href="/all-frames"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50"
            >
              সকল ফ্রেম
            </Link>

            {!user || user.role === "admin" ? (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-blue-50 mt-4"
              >
                লগইন
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50"
                >
                  ড্যাশবোর্ড ({user.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  লগআউট
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
