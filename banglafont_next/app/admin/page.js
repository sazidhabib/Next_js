"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ড্যাশবোর্ড</h1>

      {!stats ? (
        <p className="text-gray-500">লোড হচ্ছে...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-border p-6">
            <p className="text-sm text-gray-500 mb-1">মোট ফন্ট</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalFonts}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <p className="text-sm text-gray-500 mb-1">মোট ডাউনলোড</p>
            <p className="text-3xl font-bold text-primary">{stats.totalDownloads.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <p className="text-sm text-gray-500 mb-1">শীর্ষ ফন্ট</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {stats.topFonts.map((f) => (
                <li key={f.slug}>{f.name} - {f.downloadCount.toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
