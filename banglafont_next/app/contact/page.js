"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// Local icons to make the component self-contained and visually rich
function IconMail(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

function IconPhone(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

function IconMapPin(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function IconSend(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#00e599] bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          আপনার কোনো প্রশ্ন, মতামত বা কাস্টম প্রজেক্ট প্রস্তাবনা থাকলে আমাদের জানান। আমাদের টিম দ্রুত আপনার জিজ্ঞাসার উত্তর দিবে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Side: Contact Form Card */}
        <div className="lg:col-span-7 bg-[#121420]/60 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow background */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00e599]/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>Send a Message</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: সাকিব হাসান"
                  className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ইমেইল এড্রেস *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="যেমন: sakib@example.com"
                  className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">বিষয় *</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="যেমন: ফন্ট লাইসেন্স সম্পর্কিত জিজ্ঞাসা"
                className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">বার্তা *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="আপনার বার্তাটি বিস্তারিত এখানে লিখুন..."
                className="w-full bg-[#181a28]/60 border border-white/5 hover:border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e599]/50 focus:ring-1 focus:ring-[#00e599]/20 transition-all text-xs sm:text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-all shadow-lg hover:shadow-[#00e599]/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <IconSend className="text-xs" />
              <span>{loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Contact details */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {/* Card 1: Email */}
          <div className="bg-[#121420]/60 border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
              <IconMail className="text-lg" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ইমেইল করুন</h3>
              <p className="text-sm font-semibold text-white">support@banglatype.com</p>
              <p className="text-[10px] text-gray-500">আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করি</p>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-[#121420]/60 border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <IconPhone className="text-lg" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">সরাসরি কল</h3>
              <p className="text-sm font-semibold text-white">+880 1700-000000</p>
              <p className="text-[10px] text-gray-500">শনিবার - বৃহস্পতিবার (সকাল ১০টা - সন্ধ্যা ৬টা)</p>
            </div>
          </div>

          {/* Card 3: Location */}
          <div className="bg-[#121420]/60 border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <IconMapPin className="text-lg" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">অফিস ঠিকানা</h3>
              <p className="text-sm font-semibold text-white">বনানী, ঢাকা, বাংলাদেশ</p>
              <p className="text-[10px] text-gray-500">সাক্ষাতের পূর্বে অনুগ্রহ করে এপয়েন্টমেন্ট নিন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
