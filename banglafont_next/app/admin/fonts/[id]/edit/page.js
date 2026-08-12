"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditFontPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [designers, setDesigners] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [form, setForm] = useState({
    name: "", banglaName: "", slug: "", description: "", detailsDescription: "", fontType: "FREE",
    style: "GENERAL", encoding: "UNICODE", price: "",
    fontFileUrl: "", previewImageUrl: "", designerId: "", developerId: "", featured: false,
    foundry: "", released: "", version: "1.000", formats: "OTF, TTF, WOFF2",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [encodingDropdownOpen, setEncodingDropdownOpen] = useState(false);

  const handleEncodingToggle = (val) => {
    const current = form.encoding ? form.encoding.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) : [];
    let updated;
    if (current.includes(val)) {
      updated = current.filter(item => item !== val);
    } else {
      updated = [...current, val];
    }
    setForm({ ...form, encoding: updated.join(", ") });
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (nameVal) => {
    const oldSlugify = slugify(form.name);
    const isSlugAuto = !form.slug || form.slug === oldSlugify;
    setForm({
      ...form,
      name: nameVal,
      slug: isSlugAuto ? slugify(nameVal) : form.slug,
    });
  };

  const handleSlugChange = (slugVal) => {
    setForm({
      ...form,
      slug: slugify(slugVal),
    });
  };

  useEffect(() => {
    // Fetch designers, developers, and single font data
    Promise.all([
      fetch("/api/designers").then((r) => r.json()),
      fetch("/api/developers").then((r) => r.json()),
      fetch(`/api/admin/fonts/${id}`).then((r) => r.json()),
    ])
      .then(([designersData, developersData, fontData]) => {
        setDesigners(designersData.designers || []);
        setDevelopers(developersData.developers || []);
        if (fontData.font) {
          const f = fontData.font;
          let rawEncoding = f.encoding || "[]";
          try {
            const parsed = JSON.parse(rawEncoding);
            if (Array.isArray(parsed)) {
              rawEncoding = parsed.join(", ");
            }
          } catch (e) {
            // Keep original if parsing fails
          }
          setForm({
            name: f.name || "",
            banglaName: f.banglaName || "",
            slug: f.slug || "",
            description: f.description || "",
            detailsDescription: f.detailsDescription || "",
            fontType: f.fontType || "FREE",
            style: f.style || "GENERAL",
            encoding: rawEncoding,
            price: f.price !== null ? String(f.price) : "",
            fontFileUrl: f.fontFileUrl || "",
            previewImageUrl: f.previewImageUrl || "",
            designerId: f.designerId || "",
            developerId: f.developerId || "",
            featured: f.featured || false,
            foundry: f.foundry || "",
            released: f.released || "",
            version: f.version || "1.000",
            formats: f.formats || "OTF, TTF, WOFF2",
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("ফন্ট ডেটা লোড করতে ব্যর্থ হয়েছে।");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    let currentFontFileUrl = form.fontFileUrl;
    let currentPreviewImageUrl = form.previewImageUrl;

    // If file uploads are selected, upload them first
    if (zipFile || previewFile) {
      try {
        const formData = new FormData();
        formData.append("slug", form.slug || "temp-font");
        if (zipFile) formData.append("zipFile", zipFile);
        if (previewFile) formData.append("previewFile", previewFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "File upload failed");
        }

        if (uploadData.zipUrl) {
          currentFontFileUrl = uploadData.zipUrl;
        }
        if (uploadData.previewUrl) {
          currentPreviewImageUrl = uploadData.previewUrl;
        }
      } catch (err) {
        toast.error(err.message);
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/admin/fonts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fontFileUrl: currentFontFileUrl,
          previewImageUrl: currentPreviewImageUrl,
          price: form.price ? parseFloat(form.price) : null,
          designerId: parseInt(form.designerId),
          developerId: form.developerId ? parseInt(form.developerId) : null,
          encoding: JSON.stringify(form.encoding.split(",").map((s) => s.trim())),
        }),
      });
      if (res.ok) {
        toast.success("ফন্ট সফলভাবে আপডেট করা হয়েছে।");
        router.push("/admin/fonts");
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Update failed");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ফন্ট এডিট করুন</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নাম (English) *</label>
            <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">বাংলা নাম</label>
            <input value={form.banglaName} onChange={(e) => setForm({ ...form, banglaName: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview বর্ণনা</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Details বর্ণনা</label>
          <textarea value={form.detailsDescription} onChange={(e) => setForm({ ...form, detailsDescription: e.target.value })} rows={4} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">টাইপ</label>
            <select value={form.fontType} onChange={(e) => setForm({ ...form, fontType: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="FREE">FREE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">স্টাইল</label>
            <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="GENERAL">সাধারণ</option>
              <option value="HANDWRITING">Handwriting</option>
              <option value="HEADING">Heading</option>
              <option value="PARAGRAPH">Paragraph</option>
              <option value="STYLISH">Stylish</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">এনকোডিং</label>
            <button
              type="button"
              onClick={() => setEncodingDropdownOpen(!encodingDropdownOpen)}
              className="w-full border border-border bg-white text-gray-900 rounded-lg px-4 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex justify-between items-center text-sm min-h-[46px]"
            >
              <span>{form.encoding || "নির্বাচন করুন"}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </button>
            {encodingDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-border rounded-lg shadow-lg p-2 space-y-1">
                {["UNICODE", "ANSI", "BORNA"].map((enc) => {
                  const isSelected = form.encoding
                    ? form.encoding.split(",").map(s => s.trim().toUpperCase()).includes(enc)
                    : false;
                  return (
                    <label key={enc} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-700 font-normal">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleEncodingToggle(enc)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {enc}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ডিজাইনার *</label>
            <select value={form.designerId} onChange={(e) => setForm({ ...form, designerId: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required>
              <option value="">নির্বাচন করুন</option>
              {designers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ডেভেলপার</label>
            <select value={form.developerId} onChange={(e) => setForm({ ...form, developerId: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">নির্বাচন করুন</option>
              {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নতুন ফন্ট ফাইল (ZIP)</label>
            <input 
              type="file" 
              accept=".zip" 
              onChange={(e) => setZipFile(e.target.files[0])} 
              className="w-full border border-border bg-white text-gray-900 rounded-lg px-3 py-1.5 focus:outline-none text-sm" 
            />
            <div className="text-[10px] text-gray-500 mt-1">অথবা নিজে URL লিখুন:</div>
            <input 
              value={form.fontFileUrl} 
              onChange={(e) => setForm({ ...form, fontFileUrl: e.target.value })} 
              placeholder="/uploads/fonts/fontname.zip" 
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নতুন ফন্ট প্রিভিউ (TTF/WOFF2)</label>
            <input 
              type="file" 
              accept=".ttf,.otf,.woff,.woff2" 
              onChange={(e) => setPreviewFile(e.target.files[0])} 
              className="w-full border border-border bg-white text-gray-900 rounded-lg px-3 py-1.5 focus:outline-none text-sm" 
            />
            <div className="text-[10px] text-gray-500 mt-1">অথবা নিজে URL লিখুন:</div>
            <input 
              value={form.previewImageUrl} 
              onChange={(e) => setForm({ ...form, previewImageUrl: e.target.value })} 
              placeholder="/uploads/fonts/fontname-preview.ttf" 
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">মূল্য (প্রিমিয়াম)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foundry</label>
            <input value={form.foundry} onChange={(e) => setForm({ ...form, foundry: e.target.value })} placeholder="SutonnyMJ Foundry" className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Released</label>
            <input value={form.released} onChange={(e) => setForm({ ...form, released: e.target.value })} placeholder="May 2024" className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="1.000" className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <input value={form.formats} onChange={(e) => setForm({ ...form, formats: e.target.value })} placeholder="OTF, TTF, WOFF2" className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
          <span className="text-sm text-gray-700">ফিচার্ড</span>
        </label>
        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 cursor-pointer">
          {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
        </button>
      </form>
    </div>
  );
}
