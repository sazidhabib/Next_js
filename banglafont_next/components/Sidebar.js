"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  IconHome,
  IconType,
  IconClock,
  IconStar,
  IconTag,
  IconGrid,
  IconFolder,
  IconEdit3,
  IconZap,
  IconHeart,
  IconDownload,
  IconFileText,
  IconHelpCircle,
  IconCrown,
  IconArrowLeft,
} from "./Icons";

function SidebarContent({ isOpen, onClose }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [forceMainMenu, setForceMainMenu] = useState(false);
  const currentStyle = searchParams ? (searchParams.get("style") || "ALL") : "ALL";

  // Reset forceMainMenu when user navigates to "/free-fonts" from another page
  useEffect(() => {
    if (pathname === "/free-fonts") {
      setForceMainMenu(false);
    }
  }, [pathname]);

  const mainNav = [
    { label: "Home", href: "/", icon: IconHome },
    { label: "All Fonts", href: "/free-fonts", icon: IconType },
    { label: "New Releases", href: "/free-fonts?sort=new", icon: IconClock },
    { label: "Best Sellers", href: "/premium-font", icon: IconStar },
    { label: "Free Fonts", href: "/free-fonts", icon: IconTag },
    { label: "Pro Fonts", href: "/premium-font", icon: IconZap },
    { label: "Font Foundries", href: "/designer", icon: IconGrid },
    { label: "Collections", href: "/collections", icon: IconFolder },
  ];

  const toolsNav = [
    { label: "Type Tester", href: "/type-tester", icon: IconEdit3 },

  ];

  const userNav = [
    { label: "Wishlist", href: "#wishlist", icon: IconHeart },
    { label: "Downloads", href: "#downloads", icon: IconDownload },
    { label: "License", href: "/eula", icon: IconFileText },
    { label: "Help Center", href: "/about-us", icon: IconHelpCircle },
  ];

  const filterCategories = [
    { name: "All Fonts", count: 2438, value: "ALL" },
    { name: "Sans-Serif", count: 856, value: "GENERAL" },
    { name: "Serif", count: 632, value: "SERIF" },
    { name: "Display", count: 482, value: "STYLISH" },
    { name: "Handwritten", count: 286, value: "HANDWRITING" },
    { name: "Monospace", count: 182, value: "MONOSPACE" },
    { name: "Calligraphic", count: 134, value: "CALLIGRAPHIC" },
    { name: "Blackletter", count: 96, value: "BLACKLETTER" },
  ];

  const isDetailPage = pathname.startsWith("/free-font/");
  const isDashboard = pathname.startsWith("/designer/dashboard");
  const activeDetailTab = searchParams ? (searchParams.get("tab") || "Overview") : "Overview";
  const activeDashboardTab = searchParams ? (searchParams.get("tab") || "overview") : "overview";
  const isFilterActive = pathname === "/free-fonts" && !forceMainMenu;

  const dashboardNav = [
    { label: "Overview", tab: "overview", icon: IconHome },
    { label: "My Fonts", tab: "fonts", icon: IconType },
    { label: "Upload Font", tab: "upload", icon: IconZap },
    { label: "Profile Settings", tab: "settings", icon: IconHelpCircle },
  ];

  return (
    <aside className={`bg-[#0d0e14] flex flex-col justify-between transition-all duration-300 ease-in-out overflow-y-auto ${isOpen
        ? "fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-white/10 py-6 px-4 translate-x-0 opacity-100 lg:sticky lg:h-[calc(100vh-4rem)] lg:z-auto"
        : "fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-white/10 py-6 px-4 -translate-x-full opacity-0 pointer-events-none lg:sticky lg:h-[calc(100vh-4rem)] lg:z-auto lg:w-0 lg:p-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden"
      }`}>
      {/* Sliding Viewport */}
      <div className="w-full overflow-hidden flex flex-col flex-1">
        {isDashboard ? (
          <div className="flex flex-col justify-between flex-1">
            <div className="space-y-6">
              {/* Back Link */}
              <div className="pb-4 border-b border-white/5">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
                >
                  <IconArrowLeft className="text-sm" />
                  <span>Back to Main Menu</span>
                </Link>
              </div>

              {/* Dashboard Navigation Options */}
              <div>
                <ul className="space-y-1">
                  {dashboardNav.map((item) => {
                    const active = activeDashboardTab === item.tab;
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={`/designer/dashboard?tab=${item.tab}`}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                              ? "bg-[#00e599]/10 text-[#00e599] font-bold border border-[#00e599]/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                          <Icon className="text-base" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : isDetailPage ? (
          <div className="flex flex-col justify-between flex-1">
            <div className="space-y-6">
              {/* Back Link */}
              <div className="pb-4 border-b border-white/5">
                <Link
                  href="/free-fonts"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <IconArrowLeft className="text-sm" />
                  <span>Back to All Fonts</span>
                </Link>
              </div>

              {/* Detail Navigation Options */}
              <div>
                <ul className="space-y-1">
                  {["Overview", "Glyphs", "Features", "Details", "License", "Related Fonts"].map((tab) => {
                    const active = activeDetailTab === tab;
                    return (
                      <li key={tab}>
                        <Link
                          href={`${pathname}?tab=${tab}`}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                              ? "bg-[#00e599]/10 text-[#00e599] font-bold border border-[#00e599]/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                          <span>{tab}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Upgrade to Pro Promotion Banner */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-[#12131a] border border-purple-500/20 text-center relative overflow-hidden group">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-lg">
                <IconCrown className="text-xl" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Upgrade to Pro</h4>
              <p className="text-[10px] text-gray-400 mb-3 leading-tight">
                Unlock premium fonts, exclusive glyphs & more.
              </p>
              <Link
                href="/premium-font"
                className="inline-block w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] rounded-xl hover:opacity-90 transition-opacity"
              >
                Go Pro
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="flex w-[200%] flex-1 transition-transform duration-300 ease-in-out"
            style={{ transform: isFilterActive ? 'translateX(-50%)' : 'translateX(0%)' }}
          >
            {/* Panel 1: Main Menu */}
            <div className="w-1/2 shrink-0 flex flex-col justify-between pr-2">
              <div className="space-y-6">
                {/* Main Nav */}
                <div>
                  <ul className="space-y-1">
                    {mainNav.map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (item.href.includes("/free-fonts")) {
                                setForceMainMenu(false);
                              }
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${active
                                ? "bg-white/10 text-[#00e599] font-semibold"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            <Icon className="text-base" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <ul className="space-y-1">
                    {toolsNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Icon className="text-base" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <ul className="space-y-1">
                    {userNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Icon className="text-base" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Upgrade to Pro Promotion Banner inside Main Menu */}
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-[#12131a] border border-purple-500/20 text-center relative overflow-hidden group">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-lg">
                  <IconCrown className="text-xl" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Upgrade to Pro</h4>
                <p className="text-[10px] text-gray-400 mb-3 leading-tight">
                  Unlock premium fonts, exclusive glyphs & more.
                </p>
                <Link
                  href="/premium-font"
                  className="inline-block w-full py-2 bg-gradient-to-r from-[#00e599] to-emerald-500 text-gray-950 font-bold text-[11px] rounded-xl hover:opacity-90 transition-opacity"
                >
                  Go Pro
                </Link>
              </div>
            </div>

            {/* Panel 2: Filters Menu */}
            <div className="w-1/2 shrink-0 flex flex-col justify-between pl-2">
              <div className="space-y-6">
                {/* Back Button */}
                <div className="pb-4 border-b border-white/5">
                  <button
                    onClick={() => setForceMainMenu(true)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#00e599] transition-colors cursor-pointer"
                  >
                    <IconArrowLeft className="text-sm" />
                    <span>Back to Menu</span>
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Categories</h3>
                  <ul className="space-y-1">
                    {filterCategories.map((cat) => {
                      const active = currentStyle === cat.value;
                      return (
                        <li key={cat.name}>
                          <Link
                            href={cat.value === "ALL" ? "/free-fonts" : `/free-fonts?style=${cat.value}`}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${active
                                ? "bg-[#00e599]/10 text-[#00e599] font-bold"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            <span>{cat.name}</span>
                            <span className="text-[10px] text-gray-500">{cat.count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Price */}
                <div className="border-t border-white/5 pt-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Price</h3>
                  <div className="space-y-2 text-xs text-gray-400">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="accent-[#00e599] rounded" /> Free
                      </span>
                      <span className="text-[10px] text-gray-500">1,243</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="accent-[#00e599] rounded" /> Pro
                      </span>
                      <span className="text-[10px] text-gray-500">1,195</span>
                    </label>
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="border-t border-white/5 pt-4">
                  <Link
                    href="/free-fonts"
                    className="block w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs text-center rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Reset Filters
                  </Link>
                </div>
              </div>

              {/* Upgrade to Pro Promotion Banner inside Filters Menu */}
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-[#12131a] border border-purple-500/20 text-center relative overflow-hidden group">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-lg">
                  <IconCrown className="text-xl" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Upgrade to Pro</h4>
                <p className="text-[10px] text-gray-400 mb-3 leading-tight">
                  Unlock premium fonts, exclusive glyphs & more.
                </p>
                <Link
                  href="/premium-font"
                  className="inline-block w-full py-2 bg-gradient-to-r from-[#00e599] to-emerald-500 text-gray-950 font-bold text-[11px] rounded-xl hover:opacity-90 transition-opacity"
                >
                  Go Pro
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <Suspense fallback={<aside className="w-64 shrink-0 bg-[#0d0e14] border-r border-white/10 hidden lg:block h-[calc(100vh-4rem)]" />}>
      <SidebarContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}

