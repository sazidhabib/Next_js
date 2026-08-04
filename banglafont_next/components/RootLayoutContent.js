"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function RootLayoutContent({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.body.className = "min-h-full bg-gray-50 text-gray-900";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.body.className = "min-h-full flex flex-col bg-[#090a0f] text-gray-100";
    }
  }, [isAdmin]);

  // Set default open state for desktop viewport and close drawer on navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [pathname]);

  if (isAdmin) {
    return <main className="flex-1 min-w-0">{children}</main>;
  }

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden cursor-pointer"
          />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  );
}
