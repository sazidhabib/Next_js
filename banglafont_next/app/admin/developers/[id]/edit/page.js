"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditDeveloperPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [form, setForm] = useState({
    name: "",
    banglaName: "",
    slug: "",
    bio: "",
    photo: "",
    email: "",
    socialLinks: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

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
    fetch(`/api/admin/developers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("ডেভেলপার ডেটা লোড করতে ব্যর্থ হয়েছে।");
        return res.json();
      })
      .then((data) => {
        if (data.developer) {
          const d = data.developer;
          setForm({
            name: d.name || "",
            banglaName: d.banglaName || "",
            slug: d.slug || "",
            bio: d.bio || "",
            photo: d.photo || "",
            email: d.email || "",
            socialLinks: d.socialLinks || "",
          });
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    let currentPhotoUrl = form.photo;

    if (photoFile) {
      try {
        const formData = new FormData();
        formData.append("slug", form.slug || "temp-developer");
        formData.append("imageFile", photoFile);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Photo upload failed");
        }

        if (uploadData.imageUrl) {
          currentPhotoUrl = uploadData.imageUrl;
        }
      } catch (err) {
        toast.error(err.message);
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/admin/developers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photo: currentPhotoUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("ডেভেলপার সফলভাবে আপডেট করা হয়েছে।");
        router.push("/admin/developers");
      } else {
        throw new Error(data.error || "সংরক্ষণ করতে ব্যর্থ হয়েছে।");
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ডেভেলপার এডিট করুন</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নাম (English) *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">বাংলা নাম</label>
            <input
              type="text"
              value={form.banglaName}
              onChange={(e) => setForm({ ...form, banglaName: e.target.value })}
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">জীবনী (Bio)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">সোশ্যাল লিংক (socialLinks)</label>
            <input
              type="text"
              value={form.socialLinks}
              onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
              placeholder="e.g. Website, Facebook, Github link"
              className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">প্রোফাইল ছবি</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="w-full border border-border bg-white text-gray-900 rounded-lg px-3 py-1.5 focus:outline-none text-sm"
          />
          <div className="text-[10px] text-gray-500 mt-1">অথবা নিজে URL লিখুন:</div>
          <input
            type="text"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
            placeholder="/uploads/images/developer-name.jpg"
            className="w-full border border-border bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-1"
          />
        </div>



        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
