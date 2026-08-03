"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "All Fonts", href: "/free-fonts", icon: "🅰️" },
    { label: "New Releases", href: "/free-fonts?sort=new", icon: "🕒" },
    { label: "Best Sellers", href: "/premium-font", icon: "⭐" },
    { label: "Free Fonts", href: "/free-fonts", icon: "🏷️" },
    { label: "Pro Fonts", href: "/premium-font", icon: "💎" },
    { label: "Font Foundries", href: "/designer", icon: "🏢" },
    { label: "Collections", href: "/collections", icon: "🗂️" },
  ];

  const toolsNav = [
    { label: "Glyphs", href: "#glyphs", icon: "🔣" },
    { label: "Font Pairing", href: "#pairing", icon: "🔤" },
    { label: "Type Tester", href: "#type-tester", icon: "✍️" },
    { label: "OpenType", href: "#opentype", icon: "⚡" },
  ];

  const userNav = [
    { label: "Wishlist", href: "#wishlist", icon: "🤍" },
    { label: "Downloads", href: "#downloads", icon: "📥" },
    { label: "License", href: "/eula", icon: "📜" },
    { label: "Help Center", href: "/about-us", icon: "💬" },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0d0e14] border-r border-white/10 hidden lg:flex flex-col justify-between py-6 px-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {/* Main Nav */}
        <div>
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active
                        ? "bg-white/10 text-[#00e599] font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-white/5 pt-4">
          <ul className="space-y-1">
            {toolsNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/5 pt-4">
          <ul className="space-y-1">
            {userNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upgrade to Pro Promotion Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-[#12131a] border border-purple-500/20 text-center relative overflow-hidden group">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2 text-lg">
          👑
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
    </aside>
  );
}
