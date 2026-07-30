"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewFontPage() {
  const router = useRouter();
  const [designers, setDesigners] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", fontType: "FREE",
    style: "GENERAL", encoding: "UNICODE", price: "",
    fontFileUrl: "", designerId: "", developerId: "", featured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/designers").then((r) => r.json()).then((d) => setDesigners(d.designers));
    fetch("/api/developers").then((r) => r.json()).then((d) => setDevelopers(d.developers));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : null,
          designerId: parseInt(form.designerId),
          developerId: form.developerId ? parseInt(form.developerId) : null,
          encoding: JSON.stringify(form.encoding.split(",").map((s) => s.trim())),
        }),
      });
      if (res.ok) router.push("/admin/fonts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">নতুন ফন্ট</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নাম *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">বর্ণনা</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-border rounded-lg px-4 py-2.5" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">টাইপ</label>
            <select value={form.fontType} onChange={(e) => setForm({ ...form, fontType: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5">
              <option value="FREE">FREE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">স্টাইল</label>
            <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5">
              <option value="GENERAL">সাধারণ</option>
              <option value="HANDWRITING">Handwriting</option>
              <option value="HEADING">Heading</option>
              <option value="PARAGRAPH">Paragraph</option>
              <option value="STYLISH">Stylish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">এনকোডিং</label>
            <input value={form.encoding} onChange={(e) => setForm({ ...form, encoding: e.target.value })} placeholder="UNICODE, ANSI" className="w-full border border-border rounded-lg px-4 py-2.5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ডিজাইনার *</label>
            <select value={form.designerId} onChange={(e) => setForm({ ...form, designerId: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5" required>
              <option value="">নির্বাচন করুন</option>
              {designers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ডেভেলপার</label>
            <select value={form.developerId} onChange={(e) => setForm({ ...form, developerId: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5">
              <option value="">নির্বাচন করুন</option>
              {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ফন্ট ফাইল URL *</label>
            <input value={form.fontFileUrl} onChange={(e) => setForm({ ...form, fontFileUrl: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">মূল্য (প্রিমিয়াম)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5" />
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
          <span className="text-sm text-gray-700">ফিচার্ড</span>
        </label>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50">
          {loading ? "সেভ হচ্ছে..." : "সেভ করুন"}
        </button>
      </form>
    </div>
  );
}
