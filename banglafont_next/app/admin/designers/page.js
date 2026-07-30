"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/designers")
      .then((r) => r.json())
      .then((d) => setDesigners(d.designers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ডিজাইনার</h1>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">নাম</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">স্লাগ</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ফন্ট</th>
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-gray-500">{d.slug}</td>
                <td className="px-4 py-3 text-gray-500">{d._count.fonts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
