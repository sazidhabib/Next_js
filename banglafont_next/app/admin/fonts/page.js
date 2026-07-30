"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminFontsPage() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fonts?limit=100")
      .then((r) => r.json())
      .then((d) => setFonts(d.fonts))
      .finally(() => setLoading(false));
  }, []);

  async function deleteFont(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/fonts/${id}`, { method: "DELETE" });
    setFonts((prev) => prev.filter((f) => f.id !== id));
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ফন্টসমূহ</h1>
        <Link
          href="/admin/fonts/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
        >
          + নতুন ফন্ট
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">নাম</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">টাইপ</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">স্টাইল</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ডাউনলোড</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">একশন</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{font.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${font.fontType === "FREE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {font.fontType}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{font.style}</td>
                <td className="px-4 py-3 text-gray-500">{font.downloadCount}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/fonts/${font.id}/edit`} className="text-primary hover:underline mr-3">এডিট</Link>
                  <button onClick={() => deleteFont(font.id)} className="text-red-500 hover:underline">ডিলিট</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
