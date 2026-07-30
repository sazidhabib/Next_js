"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const navItems = [
    { label: "ড্যাশবোর্ড", href: "/admin" },
    { label: "ফন্টসমূহ", href: "/admin/fonts" },
    { label: "ডিজাইনার", href: "/admin/designers" },
    { label: "ডেভেলপার", href: "/admin/developers" },
    { label: "অর্ডার", href: "/admin/orders" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-border p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">অ্যাডমিন প্যানেল</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-gray-500 mb-2">{user.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            লগআউট
          </button>
        </div>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
