"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12"><p className="text-gray-500 text-center">Loading...</p></div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fontSlug = searchParams.get("font");

  const [font, setFont] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fontSlug) {
      fetch(`/api/fonts/${fontSlug}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.error) router.push("/premium-font");
          else setFont(d);
        })
        .catch(() => router.push("/premium-font"));
    }
  }, [fontSlug, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fontId: font.id,
          customerName: form.name,
          customerEmail: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!font) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    );
  }

  if (order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white border border-border rounded-2xl p-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">অর্ডার কনফার্ম!</h1>
          <p className="text-gray-500 mb-6">
            আপনার অর্ডারটি পেন্ডিং অবস্থায় আছে। পেমেন্ট কনফার্ম হলে আপনি ডাউনলোড লিংক পাবেন।
          </p>
          <p className="text-sm text-gray-400">অর্ডার #: {order.id}</p>
          <button
            onClick={() => router.push("/premium-font")}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark"
          >
            আরও ফন্ট ব্রাউজ করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">চেকআউট</h1>
      <div className="bg-white border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900">{font.name}</h2>
        <p className="text-2xl font-bold text-primary mt-2">৳{font.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border rounded-lg px-4 py-2.5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-border rounded-lg px-4 py-2.5"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "প্রসেসিং..." : "অর্ডার কনফার্ম করুন"}
        </button>
      </form>
    </div>
  );
}
