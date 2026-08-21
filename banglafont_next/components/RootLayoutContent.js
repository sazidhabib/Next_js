"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function RootLayoutContent({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/designer/login" || pathname === "/designer/register";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.body.className = "min-h-full bg-gray-50 text-gray-900";
    } else {
      if (theme === "dark") {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.body.className = "min-h-full flex flex-col bg-[#090a0f] text-gray-100";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.body.className = "min-h-full flex flex-col bg-gray-50 text-gray-900";
      }
    }
  }, [isAdmin, theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // Set default open state for desktop viewport and close drawer on navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(!isAuthPage);
    } else {
      setSidebarOpen(false);
    }
  }, [pathname, isAuthPage]);

  if (isAdmin) {
    return <main className="flex-1 min-w-0">{children}</main>;
  }

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1 relative">
        {sidebarOpen && !isAuthPage && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden cursor-pointer"
          />
        )}
        {!isAuthPage && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </>
  );
}
