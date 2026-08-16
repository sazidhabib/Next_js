"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function DesignerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মেলেনি।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/designer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(true);
        let count = 5;
        const interval = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(interval);
            router.push("/designer/login");
          }
        }, 1000);
      } else {
        throw new Error(data.error || "নিবন্ধন করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-[#121420]/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00e599]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Designer Signup</h1>
          <p className="text-xs text-gray-400">নতুন ডিজাইনার অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ডিজাইনার / ফাউন্ড্রি নাম</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="যেমন: সাকিব টাইপোগ্রাফি"
              className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ইমেইল এড্রেস</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-all shadow-lg hover:shadow-[#00e599]/25 disabled:opacity-50 cursor-pointer text-center mt-2"
          >
            {loading ? "নিবন্ধন হচ্ছে..." : "সাইন আপ করুন"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-450 relative z-10">
          <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
          <Link href="/designer/login" className="text-[#00e599] hover:underline font-semibold">
            লগইন করুন
          </Link>
        </div>
      </div>

      {/* Congratulation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#090a0f]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-[#121420]/90 border border-[#00e599]/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,229,153,0.15)] relative overflow-hidden space-y-6">
            {/* Success icon / decoration */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-950 font-black text-3xl mx-auto shadow-[0_0_30px_rgba(0,229,153,0.3)] animate-bounce">
              ✓
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">অভিনন্দন! 🎉</h2>
              <p className="text-sm text-gray-300">আপনার ডিজাইনার অ্যাকাউন্টটি সফলভাবে তৈরি হয়েছে।</p>
            </div>

            <div className="p-4 bg-[#181a28]/60 border border-white/5 rounded-2xl">
              <p className="text-xs text-gray-400 leading-relaxed">
                আপনাকে আগামী <span className="text-[#00e599] font-bold text-sm">{countdown}</span> সেকেন্ডের মধ্যে লগইন পেজে রিডাইরেক্ট করা হচ্ছে...
              </p>
            </div>

            <Link
              href="/designer/login"
              className="inline-block w-full py-3 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-all shadow-md hover:shadow-[#00e599]/15"
            >
              এখনই লগইন করুন
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
