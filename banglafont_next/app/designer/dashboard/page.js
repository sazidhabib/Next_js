"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { resolveFontUrl } from "../../../lib/fontUtils";

// Helper components for icons to keep it completely self-contained
function IconDashboard() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="9"></rect>
      <rect x="14" y="3" width="7" height="5"></rect>
      <rect x="14" y="12" width="7" height="9"></rect>
      <rect x="3" y="16" width="7" height="5"></rect>
    </svg>
  );
}

function IconType() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4 7 4 4 20 4 20 7"></polyline>
      <line x1="9" y1="20" x2="15" y2="20"></line>
      <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}

export default function DesignerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    router.push(`/designer/dashboard?tab=${tabName}`);
  };
  const [designer, setDesigner] = useState(null);
  const [fonts, setFonts] = useState([]);
  const [stats, setStats] = useState({ totalFonts: 0, totalDownloads: 0, totalLikes: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);

  // Forms
  const [fontForm, setFontForm] = useState({
    name: "", banglaName: "", description: "", detailsDescription: "",
    price: "", style: "GENERAL", encoding: "UNICODE",
    fontFileUrl: "", previewImageUrl: "", foundry: "", released: "", version: "1.000", formats: "OTF, TTF, WOFF2",
  });
  const [profileForm, setProfileForm] = useState({ name: "", banglaName: "", bio: "", photo: "", socialLinks: "" });

  const [zipFile, setZipFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [designerPhotoFile, setDesignerPhotoFile] = useState(null);
  const [savingFont, setSavingFont] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchProfileAndFonts = useCallback(async () => {
    setLoading(true);
    try {
      const profileRes = await fetch("/api/designer/profile");
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.success) {
        setDesigner(profileData.designer);
        setProfileForm({
          name: profileData.designer.name || "",
          banglaName: profileData.designer.banglaName || "",
          bio: profileData.designer.bio || "",
          photo: profileData.designer.photo || "",
          socialLinks: profileData.designer.socialLinks || "",
        });
      }

      const fontsRes = await fetch("/api/designer/fonts");
      const fontsData = await fontsRes.json();
      if (fontsRes.ok && fontsData.success) {
        setFonts(fontsData.fonts);
        setStats(fontsData.stats);
      }
    } catch (err) {
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndFonts();
  }, [fetchProfileAndFonts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") || "overview";
      setActiveTab(tab);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/designer/logout", { method: "POST" });
      if (res.ok) {
        toast.success("লগআউট সফল হয়েছে!");
        router.push("/designer/login");
        router.refresh();
      }
    } catch (err) {
      toast.error("লগআউট করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    let currentPhotoUrl = profileForm.photo;

    // Upload photo if selected
    if (designerPhotoFile) {
      try {
        const formData = new FormData();
        formData.append("slug", designer.slug);
        formData.append("imageFile", designerPhotoFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
        if (uploadData.imageUrl) {
          currentPhotoUrl = uploadData.imageUrl;
        }
      } catch (err) {
        toast.error(err.message);
        setSavingProfile(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/designer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileForm, photo: currentPhotoUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("প্রোফাইল আপডেট হয়েছে!");
        setDesigner(data.designer);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message || "প্রোফাইল সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFontSubmit = async (e) => {
    e.preventDefault();
    setSavingFont(true);

    let currentFontFileUrl = fontForm.fontFileUrl;
    let currentPreviewImageUrl = fontForm.previewImageUrl;

    const fontSlug = fontForm.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    // Upload ZIP/Preview files if selected
    if (zipFile || previewFile) {
      try {
        const formData = new FormData();
        formData.append("slug", fontSlug || "temp-font");
        if (zipFile) formData.append("zipFile", zipFile);
        if (previewFile) formData.append("previewFile", previewFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "File upload failed");
        if (uploadData.zipUrl) currentFontFileUrl = uploadData.zipUrl;
        if (uploadData.previewUrl) currentPreviewImageUrl = uploadData.previewUrl;
      } catch (err) {
        toast.error(err.message);
        setSavingFont(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/designer/fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fontForm,
          fontFileUrl: currentFontFileUrl,
          previewImageUrl: currentPreviewImageUrl,
          encoding: JSON.stringify(fontForm.encoding.split(",").map((s) => s.trim())),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("নতুন ফন্ট সফলভাবে যুক্ত হয়েছে!");
        setFontForm({
          name: "", banglaName: "", description: "", detailsDescription: "",
          price: "", style: "GENERAL", encoding: "UNICODE",
          fontFileUrl: "", previewImageUrl: "", foundry: "", released: "", version: "1.000", formats: "OTF, TTF, WOFF2",
        });
        setZipFile(null);
        setPreviewFile(null);
        setActiveTab("fonts");
        fetchProfileAndFonts();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message || "ফন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSavingFont(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-gray-500">লোডিং হচ্ছে...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Designer Header Block */}
      <div className="bg-[#121420]/60 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e599]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4">
          {designer?.photo ? (
            <img src={resolveFontUrl(designer.photo)} alt={designer.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-[#00e599]/30" />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#00e599] to-teal-500 flex items-center justify-center text-gray-955 font-black text-xl shadow-lg shadow-[#00e599]/20">
              {designer?.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
              <span>{designer?.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">Designer</span>
            </h1>
            <p className="text-[11px] text-gray-400">{designer?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <IconLogout />
          <span>Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-2.5 space-y-1 lg:hidden">
          <button
            onClick={() => handleTabChange("overview")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview" ? "bg-[#00e599]/10 text-[#00e599] border-l-2 border-[#00e599]" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <IconDashboard />
            <span>Overview</span>
          </button>
          <button
            onClick={() => handleTabChange("fonts")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "fonts" ? "bg-[#00e599]/10 text-[#00e599] border-l-2 border-[#00e599]" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <IconType />
            <span>My Fonts</span>
          </button>
          <button
            onClick={() => handleTabChange("upload")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upload" ? "bg-[#00e599]/10 text-[#00e599] border-l-2 border-[#00e599]" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <IconPlus />
            <span>Upload Font</span>
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-[#00e599]/10 text-[#00e599] border-l-2 border-[#00e599]" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <IconSettings />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-4 sm:p-5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Fonts</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">{stats.totalFonts}</span>
                </div>
                <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-4 sm:p-5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Downloads</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#00e599] mt-1 block">{stats.totalDownloads.toLocaleString()}</span>
                </div>
                <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-4 sm:p-5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Likes</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-rose-500 mt-1 block">{stats.totalLikes.toLocaleString()}</span>
                </div>
                <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-4 sm:p-5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Views</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1 block">{stats.totalViews.toLocaleString()}</span>
                </div>
              </div>

              {/* Tips & Guideline Section */}
              <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Designer Portal Guidelines</h3>
                <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
                  <li>আপনি নতুন ফন্ট আপলোড করলে তা সাথে সাথেই ফ্রি বা প্রিমিয়াম ক্যাটাগরিতে অন্তর্ভুক্ত হয়ে লাইভ হয়ে যাবে।</li>
                  <li>ফন্ট ফাইল অবশ্যই `.zip` ফরমেটে এবং প্রিভিউ ফাইল `.ttf`, `.otf`, `.woff2` ফরমেটে আপলোড করুন।</li>
                  <li>আপনার ড্যাশবোর্ডে প্রাপ্ত লাইক এবং ডাউনলোড সংখ্যা রিয়েলটাইমে হালনাগাদ হবে।</li>
                  <li>কোনো ডুপ্লিকেট ফন্ট বা অন্যের তৈরি করা ফন্ট আপলোড করা সম্পূর্ণ নিষিদ্ধ।</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: MY FONTS */}
          {activeTab === "fonts" && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">My Uploaded Fonts</h3>

              {fonts.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-500">আপনার কোনো আপলোড করা ফন্ট নেই।</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {fonts.map((f) => (
                    <div key={f.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{f.name} {f.banglaName && <span className="text-gray-400 font-normal">({f.banglaName})</span>}</h4>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                          <span>{f.style}</span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${f.fontType === "PREMIUM" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-[#00e599]"}`}>{f.fontType}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white font-mono font-bold">{f.downloadCount || 0} Downloads</div>
                        <div className="text-[9px] text-gray-500 font-mono mt-0.5">{f.likeCount || 0} Likes</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPLOAD FONT */}
          {activeTab === "upload" && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-5 sm:p-6 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Upload New Font</h3>
              <form onSubmit={handleFontSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="fontName" className="block font-semibold text-gray-400 mb-1">নাম (English) *</label>
                    <input
                      id="fontName"
                      name="fontName"
                      required
                      value={fontForm.name}
                      onChange={(e) => setFontForm({ ...fontForm, name: e.target.value })}
                      placeholder="যেমন: SolaimanLipi"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00e599]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="fontBanglaName" className="block font-semibold text-gray-400 mb-1">বাংলা নাম</label>
                    <input
                      id="fontBanglaName"
                      name="fontBanglaName"
                      value={fontForm.banglaName}
                      onChange={(e) => setFontForm({ ...fontForm, banglaName: e.target.value })}
                      placeholder="যেমন: সোলায়মান লিপি"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00e599]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="fontStyle" className="block font-semibold text-gray-400 mb-1">স্টাইল *</label>
                    <select
                      id="fontStyle"
                      name="fontStyle"
                      value={fontForm.style}
                      onChange={(e) => setFontForm({ ...fontForm, style: e.target.value })}
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#00e599]/50"
                    >
                      <option value="GENERAL">সাধারণ (General)</option>
                      <option value="HEADING">হেডিং (Heading)</option>
                      <option value="PARAGRAPH">প্যারাগ্রাফ (Paragraph)</option>
                      <option value="STYLISH">স্টাইলিশ (Stylish)</option>
                      <option value="HANDWRITING">হ্যান্ডরাইটিং (Handwriting)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="fontEncoding" className="block font-semibold text-gray-400 mb-1">ইনকোডিং</label>
                    <input
                      id="fontEncoding"
                      name="fontEncoding"
                      value={fontForm.encoding}
                      onChange={(e) => setFontForm({ ...fontForm, encoding: e.target.value })}
                      placeholder="UNICODE, ANSI (কমা দিয়ে লিখুন)"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00e599]/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="fontDescription" className="block font-semibold text-gray-400 mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <textarea
                    id="fontDescription"
                    name="fontDescription"
                    rows={2}
                    value={fontForm.description}
                    onChange={(e) => setFontForm({ ...fontForm, description: e.target.value })}
                    placeholder="ফন্টের সংক্ষিপ্ত বিবরণ এখানে লিখুন..."
                    className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#00e599]/50 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="fontDetailsDescription" className="block font-semibold text-gray-400 mb-1">বিস্তারিত বিবরণ</label>
                  <textarea
                    id="fontDetailsDescription"
                    name="fontDetailsDescription"
                    rows={4}
                    value={fontForm.detailsDescription}
                    onChange={(e) => setFontForm({ ...fontForm, detailsDescription: e.target.value })}
                    placeholder="ফন্টের বিস্তারিত বৈশিষ্ট্য ও বিবরণ এখানে লিখুন..."
                    className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#00e599]/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="zipFile" className="block font-semibold text-gray-400 mb-1">ফন্ট ডাউনলোড ফাইল (ZIP) *</label>
                    <input
                      id="zipFile"
                      name="zipFile"
                      type="file"
                      required
                      accept=".zip"
                      onChange={(e) => setZipFile(e.target.files[0])}
                      className="w-full border border-white/5 bg-[#181a28]/40 text-white rounded-lg px-3 py-1.5 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="previewFile" className="block font-semibold text-gray-400 mb-1">ফন্ট প্রিভিউ ফাইল (TTF/OTF)</label>
                    <input
                      id="previewFile"
                      name="previewFile"
                      type="file"
                      required
                      accept=".ttf,.otf,.woff2"
                      onChange={(e) => setPreviewFile(e.target.files[0])}
                      className="w-full border border-white/5 bg-[#181a28]/40 text-white rounded-lg px-3 py-1.5 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label htmlFor="fontFoundry" className="block font-semibold text-gray-400 mb-1">Foundry</label>
                    <input
                      id="fontFoundry"
                      name="fontFoundry"
                      value={fontForm.foundry}
                      onChange={(e) => setFontForm({ ...fontForm, foundry: e.target.value })}
                      placeholder="যেমন: সাকিব টাইপ Foundry"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="fontReleased" className="block font-semibold text-gray-400 mb-1">Released</label>
                    <input
                      id="fontReleased"
                      name="fontReleased"
                      value={fontForm.released}
                      onChange={(e) => setFontForm({ ...fontForm, released: e.target.value })}
                      placeholder="যেমন: May 2024"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="fontVersion" className="block font-semibold text-gray-400 mb-1">Version</label>
                    <input
                      id="fontVersion"
                      name="fontVersion"
                      value={fontForm.version}
                      onChange={(e) => setFontForm({ ...fontForm, version: e.target.value })}
                      placeholder="1.000"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="fontFormats" className="block font-semibold text-gray-400 mb-1">Format</label>
                    <input
                      id="fontFormats"
                      name="fontFormats"
                      value={fontForm.formats}
                      onChange={(e) => setFontForm({ ...fontForm, formats: e.target.value })}
                      placeholder="OTF, TTF, WOFF2"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="fontPrice" className="block font-semibold text-gray-400 mb-1">মূল্য (প্রিমিয়াম হলে লিখুন)</label>
                    <input
                      id="fontPrice"
                      name="fontPrice"
                      type="number"
                      value={fontForm.price}
                      onChange={(e) => setFontForm({ ...fontForm, price: e.target.value })}
                      placeholder="ফ্রি হলে ফাকা রাখুন"
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00e599]/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingFont}
                  className="px-6 py-3 bg-[#00e599] text-gray-950 font-bold rounded-xl hover:bg-[#00c784] transition-all disabled:opacity-50 cursor-pointer mt-4"
                >
                  {savingFont ? "আপলোড হচ্ছে..." : "ফন্ট আপলোড করুন"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-5 sm:p-6 shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Profile Settings</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="designerName" className="block font-semibold text-gray-400 mb-1">ডিজাইনার নাম (English) *</label>
                    <input
                      id="designerName"
                      name="designerName"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="designerBanglaName" className="block font-semibold text-gray-400 mb-1">বাংলা নাম</label>
                    <input
                      id="designerBanglaName"
                      name="designerBanglaName"
                      value={profileForm.banglaName}
                      onChange={(e) => setProfileForm({ ...profileForm, banglaName: e.target.value })}
                      className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="designerBio" className="block font-semibold text-gray-400 mb-1">বায়োগ্রাফি (Bio)</label>
                  <textarea
                    id="designerBio"
                    name="designerBio"
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="আপনার সম্পর্কে বিস্তারিত এখানে লিখুন..."
                    className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="designerSocialLinks" className="block font-semibold text-gray-400 mb-1">সোশ্যাল মিডিয়া লিঙ্কসমূহ</label>
                  <input
                    id="designerSocialLinks"
                    name="designerSocialLinks"
                    value={profileForm.socialLinks}
                    onChange={(e) => setProfileForm({ ...profileForm, socialLinks: e.target.value })}
                    placeholder="যেমন: Facebook: url, Twitter: url"
                    className="w-full border border-white/5 bg-[#181a28]/60 text-white rounded-lg px-4 py-2.5 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="designerPhoto" className="block font-semibold text-gray-400 mb-1">প্রোফাইল ছবি (Photo)</label>
                  <input
                    id="designerPhoto"
                    name="designerPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDesignerPhotoFile(e.target.files[0])}
                    className="w-full border border-white/5 bg-[#181a28]/40 text-white rounded-lg px-3 py-1.5 focus:outline-none text-xs"
                  />
                  {profileForm.photo && (
                    <div className="mt-2 text-gray-400">
                      <span>বর্তমান ছবি: </span>
                      <a href={profileForm.photo} target="_blank" rel="noreferrer" className="text-[#00e599] hover:underline">{profileForm.photo}</a>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-[#00e599] text-gray-950 font-bold rounded-xl hover:bg-[#00c784] transition-all disabled:opacity-50 cursor-pointer mt-4"
                >
                  {savingProfile ? "সেভ হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
