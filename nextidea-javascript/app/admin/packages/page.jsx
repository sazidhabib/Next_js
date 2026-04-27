"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Copy,
} from "lucide-react";

const SERVICE_PAGES = [
  { id: "digital-media-buying", name: "Digital Media Buying" },
  { id: "social-media-marketing", name: "Social Media Marketing" },
  { id: "web-design-development", name: "Web Design & Development" },
  { id: "seo", name: "SEO Services" },
  { id: "seo-audit", name: "SEO Audit" },
  { id: "e-commerce-seo", name: "E-commerce SEO" },
  { id: "local-seo", name: "Local SEO" },
  { id: "brand-identity", name: "Brand Identity" },
  { id: "creative-concept-execution", name: "Creative Concept & Execution" },
  { id: "design-printing", name: "Design & Printing" },
  { id: "digital-pr", name: "Digital PR" },
  { id: "event-and-activation", name: "Event & Activation" },
  { id: "video-production-photography", name: "Video Production & Photography" },
];

const EMPTY_FEATURE = { name: "", included: true };

const EMPTY_PACKAGE = {
  name: "",
  features: [{ ...EMPTY_FEATURE }],
  channels: "",
  mediaSpending: "",
  setupCost: "",
  managementFee: "",
  buttonText: "",
};

export default function PackagesManager() {
  const [packages, setPackages] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("Our Packages");
  const [sectionSubtitle, setSectionSubtitle] = useState("Choose the perfect package for your business needs");
  const [sectionFooter, setSectionFooter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activePage, setActivePage] = useState("digital-media-buying");
  const [expandedPkg, setExpandedPkg] = useState(null);

  const currentKey = `${activePage}_packages`;
  const metaKey = `${activePage}_packages_meta`;

  useEffect(() => {
    fetchPackages();
  }, [activePage]);

  const fetchPackages = async () => {
    setLoading(true);
    setExpandedPkg(null);
    try {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const pkgSetting = data.data.find((s) => s.setting_key === currentKey);
        const metaSetting = data.data.find((s) => s.setting_key === metaKey);

        if (pkgSetting) {
          setPackages(JSON.parse(pkgSetting.setting_value || "[]"));
        } else {
          setPackages([]);
        }

        if (metaSetting) {
          const meta = JSON.parse(metaSetting.setting_value || "{}");
          setSectionTitle(meta.title || "Our Packages");
          setSectionSubtitle(meta.subtitle || "Choose the perfect package for your business needs");
          setSectionFooter(meta.footerText || "");
        } else {
          setSectionTitle("Our Packages");
          setSectionSubtitle("Choose the perfect package for your business needs");
          setSectionFooter("");
        }
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setMessage({ type: "error", text: "Failed to load packages" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: currentKey, value: JSON.stringify(packages), type: "json" },
            {
              key: metaKey,
              value: JSON.stringify({
                title: sectionTitle,
                subtitle: sectionSubtitle,
                footerText: sectionFooter,
              }),
              type: "json",
            },
          ],
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const pageName = SERVICE_PAGES.find((p) => p.id === activePage)?.name;
        setMessage({ type: "success", text: `${pageName} packages updated!` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save packages" });
    } finally {
      setSaving(false);
    }
  };

  // Package CRUD
  const addPackage = () => {
    const newPkg = { ...EMPTY_PACKAGE, features: [{ ...EMPTY_FEATURE }] };
    setPackages([...packages, newPkg]);
    setExpandedPkg(packages.length);
  };

  const removePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
    if (expandedPkg === index) setExpandedPkg(null);
  };

  const duplicatePackage = (index) => {
    const copy = JSON.parse(JSON.stringify(packages[index]));
    copy.name = `${copy.name} (Copy)`;
    const updated = [...packages];
    updated.splice(index + 1, 0, copy);
    setPackages(updated);
    setExpandedPkg(index + 1);
  };

  const updatePackage = (index, field, value) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
  };

  // Feature CRUD
  const addFeature = (pkgIndex) => {
    const updated = [...packages];
    updated[pkgIndex].features.push({ ...EMPTY_FEATURE });
    setPackages(updated);
  };

  const removeFeature = (pkgIndex, featureIndex) => {
    const updated = [...packages];
    updated[pkgIndex].features = updated[pkgIndex].features.filter((_, i) => i !== featureIndex);
    setPackages(updated);
  };

  const updateFeature = (pkgIndex, featureIndex, field, value) => {
    const updated = [...packages];
    updated[pkgIndex].features[featureIndex] = {
      ...updated[pkgIndex].features[featureIndex],
      [field]: value,
    };
    setPackages(updated);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Packages Management
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage pricing packages for each service page
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={activePage}
            onChange={(e) => setActivePage(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary font-bold"
          >
            {SERVICE_PAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </motion.div>
      )}

      {/* Section Meta Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-2">Section Settings</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
              Section Title
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-bold text-base focus:outline-none focus:border-primary transition-all"
              placeholder="Our Packages"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
              placeholder="Choose the perfect package..."
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
            Footer Note
          </label>
          <input
            type="text"
            value={sectionFooter}
            onChange={(e) => setSectionFooter(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
            placeholder="*Media payments are paid in advance"
          />
        </div>
      </div>

      {/* Packages List */}
      <div className="space-y-4">
        {packages.map((pkg, pkgIdx) => (
          <div
            key={pkgIdx}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700"
          >
            {/* Package Header (collapsible) */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
              onClick={() =>
                setExpandedPkg(expandedPkg === pkgIdx ? null : pkgIdx)
              }
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-zinc-600" />
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {pkgIdx + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold">
                    {pkg.name || "Untitled Package"}
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    {pkg.features.length} features
                    {pkg.managementFee ? ` • ${pkg.managementFee}` : ""}
                    {pkg.setupCost ? ` • Setup: ${pkg.setupCost}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicatePackage(pkgIdx);
                  }}
                  className="p-2 text-zinc-500 hover:text-blue-400 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePackage(pkgIdx);
                  }}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedPkg === pkgIdx ? (
                  <ChevronUp className="w-5 h-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                )}
              </div>
            </div>

            {/* Package Body (expanded) */}
            {expandedPkg === pkgIdx && (
              <div className="px-6 pb-6 border-t border-zinc-800 pt-4 space-y-5">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-bold text-base focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Starter, Growth, Pro..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={pkg.buttonText || ""}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "buttonText", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder='Default: "Choose Plan"'
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Channel Coverage
                    </label>
                    <input
                      type="text"
                      value={pkg.channels || ""}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "channels", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Facebook, Google, LinkedIn..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Media Spending
                    </label>
                    <input
                      type="text"
                      value={pkg.mediaSpending || ""}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "mediaSpending", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Up to $1K"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Setup Cost
                    </label>
                    <input
                      type="text"
                      value={pkg.setupCost || ""}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "setupCost", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. 10,000 TK"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">
                      Management Fee
                    </label>
                    <input
                      type="text"
                      value={pkg.managementFee || ""}
                      onChange={(e) =>
                        updatePackage(pkgIdx, "managementFee", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. 30,000 TK"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 mb-2 block">
                    Features
                  </label>
                  <div className="space-y-2">
                    {pkg.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-2 group"
                      >
                        <button
                          onClick={() =>
                            updateFeature(
                              pkgIdx,
                              fIdx,
                              "included",
                              !feature.included
                            )
                          }
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                            feature.included
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                          title={
                            feature.included
                              ? "Included — click to exclude"
                              : "Excluded — click to include"
                          }
                        >
                          {feature.included ? "✓" : "✕"}
                        </button>
                        <input
                          type="text"
                          value={feature.name}
                          onChange={(e) =>
                            updateFeature(
                              pkgIdx,
                              fIdx,
                              "name",
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-1.5 bg-transparent border-none text-zinc-300 text-sm focus:outline-none"
                          placeholder="Feature name..."
                        />
                        <button
                          onClick={() => removeFeature(pkgIdx, fIdx)}
                          className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addFeature(pkgIdx)}
                    className="mt-2 flex items-center gap-2 text-zinc-500 hover:text-primary text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Feature
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Package Button */}
        <button
          onClick={addPackage}
          className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all group"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold uppercase tracking-wider text-xs">
            Add New Package
          </span>
        </button>
      </div>

      {/* Info note */}
      {packages.length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No packages configured for this service page</p>
          <p className="text-sm mt-1">
            Click "Add New Package" to create one, or the service page will use its default hardcoded packages.
          </p>
        </div>
      )}
    </div>
  );
}
