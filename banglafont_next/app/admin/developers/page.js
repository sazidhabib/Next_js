"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/developers")
      .then((r) => r.json())
      .then((d) => setDevelopers(d.developers || []))
      .finally(() => setLoading(false));
  }, []);

  async function deleteDeveloper(id) {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ডেভেলপারকে ডিলিট করতে চান?")) return;
    
    try {
      const res = await fetch(`/api/admin/developers/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        setDevelopers((prev) => prev.filter((d) => d.id !== id));
        toast.success("ডেভেলপার সফলভাবে ডিলিট করা হয়েছে।");
      } else {
        toast.error(data.error || "ডিলিট করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      toast.error("একটি ত্রুটি ঘটেছে।");
    }
  }

  if (loading) return <p className="text-gray-500">লোড হচ্ছে...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ডেভেলপার তালিকা</h1>
        <Link
          href="/admin/developers/new"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
        >
          + নতুন ডেভেলপার
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">নাম</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">স্লাগ</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ফন্ট সংখ্যা</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">একশন</th>
            </tr>
          </thead>
          <tbody>
            {developers.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 text-gray-500">{d.slug}</td>
                <td className="px-4 py-3 text-gray-500">{d._count?.fonts ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/developers/${d.id}/edit`}
                    className="text-primary hover:underline mr-3 font-medium"
                  >
                    এডিট
                  </Link>
                  <button
                    onClick={() => deleteDeveloper(d.id)}
                    className="text-red-500 hover:underline font-medium cursor-pointer"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

