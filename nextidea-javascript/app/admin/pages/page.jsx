"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, Loader2, AlertCircle, CheckCircle2, FileText, 
  Layout, Info, Image, Upload, Plus, Trash2, Code 
} from "lucide-react";

export default function PageContentManager() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("home");
  const [activeServiceTab, setActiveServiceTab] = useState("seo");
  const [editJsonAsCode, setEditJsonAsCode] = useState({});

  const servicePagesList = [
    { id: "seo", label: "SEO Services", prefix: "service_seo_" },
    { id: "web_design_development", label: "Web Design", prefix: "service_web_design_development_" },
    { id: "brand_identity", label: "Brand Identity", prefix: "service_brand_identity_" },
    { id: "creative_concept_execution", label: "Creative Concept", prefix: "service_creative_concept_execution_" },
    { id: "digital_media_buying", label: "Digital Media", prefix: "service_digital_media_buying_" },
    { id: "design_printing", label: "Design & Printing", prefix: "service_design_printing_" },
    { id: "digital_pr", label: "Digital PR", prefix: "service_digital_pr_" },
    { id: "event_and_activation", label: "Event & Activation", prefix: "service_event_and_activation_" },
    { id: "social_media_marketing", label: "Social Media", prefix: "service_social_media_marketing_" },
    { id: "video_production_photography", label: "Video Production", prefix: "service_video_production_photography_" },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setMessage({ type: "error", text: "Failed to load content" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s))
    );
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    setSaving(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        if (key.includes("_item_")) {
          // Special case for JSON items
          const [settingKey, field, idx] = key.split("_item_");
          handleJsonItemChange(settingKey, parseInt(idx), field, data.data.url);
        } else {
          handleInputChange(key, data.data.url);
        }
        setMessage({ type: "success", text: "Image uploaded! Don't forget to save changes." });
        return data.data.url;
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setSaving(false);
    }
    return null;
  };

  const handleJsonItemChange = (settingKey, index, field, value) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.setting_key === settingKey) {
          try {
            const list = JSON.parse(s.setting_value || "[]");
            list[index][field] = value;
            return { ...s, setting_value: JSON.stringify(list, null, 2) };
          } catch (e) {
            console.error("JSON parse error in item change", e);
          }
        }
        return s;
      })
    );
  };

  const addJsonItem = (settingKey, template) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.setting_key === settingKey) {
          try {
            const list = JSON.parse(s.setting_value || "[]");
            const newItem = { ...template };
            // Ensure unique ID for hero slides if exists
            if (newItem.id !== undefined) newItem.id = Date.now();
            list.push(newItem);
            return { ...s, setting_value: JSON.stringify(list, null, 2) };
          } catch (e) {
            console.error("JSON parse error in add item", e);
          }
        }
        return s;
      })
    );
  };

  const removeJsonItem = (settingKey, index) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.setting_key === settingKey) {
          try {
            const list = JSON.parse(s.setting_value || "[]");
            list.splice(index, 1);
            return { ...s, setting_value: JSON.stringify(list, null, 2) };
          } catch (e) {
            console.error("JSON parse error in remove item", e);
          }
        }
        return s;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formattedSettings = settings.map((s) => ({
        key: s.setting_key,
        value: s.setting_value,
        type: s.setting_type,
        description: s.description,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: formattedSettings }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Content updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update content" });
      }
    } catch (error) {
      console.error("Update content error:", error);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const homeSettings = settings.filter(s => s.setting_key.startsWith("home_"));
  const aboutSettings = settings.filter(s => s.setting_key.startsWith("about_"));
  const currentServicePrefix = servicePagesList.find(s => s.id === activeServiceTab)?.prefix || "service_seo_";
  const serviceSettings = settings.filter(s => s.setting_key.startsWith(currentServicePrefix));

  const getCurrentTabSettings = () => {
    if (activeTab === "home") return homeSettings;
    if (activeTab === "about") return aboutSettings;
    if (activeTab === "services") return serviceSettings;
    return [];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading page content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Page Content</h1>
          <p className="text-zinc-400 mt-1">Manage the text and content of your website pages</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Updating..." : "Update All Pages"}
        </button>
      </div>

      <div className="flex gap-4 border-b border-zinc-800 pb-px">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "home"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Home Page
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "about"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          About Us Page
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "services"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Service Pages
        </button>
      </div>

      {activeTab === "services" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <label className="text-sm font-medium text-zinc-400">Select Service Page:</label>
          <div className="flex flex-wrap gap-2">
            <select 
              value={activeServiceTab}
              onChange={(e) => setActiveServiceTab(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            >
              {servicePagesList.map((service) => (
                <option key={service.id} value={service.id}>{service.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

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

      {/* Page Sections */}
      <div className="grid gap-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {getCurrentTabSettings().map((setting) => {
            const isImage = setting.setting_key.includes("image");
            const isJson = setting.setting_type === "json";
            const showAsCode = editJsonAsCode[setting.setting_key];
            
            return (
              <div
                key={setting.id}
                className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-all ${isJson ? 'lg:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {isImage ? <Image className="w-5 h-5" /> : isJson ? <Layout className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 capitalize">
                        {setting.setting_key.replace(`${activeTab}_`, "").replace(/_/g, " ")}
                      </label>
                      <p className="text-xs text-zinc-500">{setting.description}</p>
                    </div>
                  </div>
                  {isJson && (
                    <button 
                      onClick={() => setEditJsonAsCode(prev => ({...prev, [setting.setting_key]: !showAsCode}))}
                      className={`p-2 rounded-lg transition-all ${showAsCode ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                      title="Toggle Code View"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isJson && !showAsCode ? (
                  <div className="space-y-6">
                    {(() => {
                      try {
                        const items = JSON.parse(setting.setting_value || "[]");
                        return (
                          <div className="grid gap-4">
                            {items.map((item, idx) => (
                              <div key={idx} className="p-6 bg-zinc-800/30 border border-zinc-800 rounded-2xl space-y-4 relative group/item hover:border-zinc-700 transition-all">
                                <button 
                                  onClick={() => removeJsonItem(setting.setting_key, idx)}
                                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                  {Object.keys(item).map(field => (
                                    <div key={field} className={field === 'description' || field === 'imageUrl' || field === 'text' ? 'md:col-span-2' : ''}>
                                      <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1">{field}</label>
                                      {field === 'description' || field.includes('text') ? (
                                        <textarea 
                                          value={item[field]} 
                                          onChange={(e) => handleJsonItemChange(setting.setting_key, idx, field, e.target.value)}
                                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                                          rows={2}
                                        />
                                      ) : field.toLowerCase().includes('image') ? (
                                        <div className="space-y-3">
                                          {item[field] && (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                                              <img src={item[field]} className="w-full h-full object-cover" alt="Slide" />
                                            </div>
                                          )}
                                          <div className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={item[field]} 
                                              onChange={(e) => handleJsonItemChange(setting.setting_key, idx, field, e.target.value)}
                                              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                                              placeholder="Image URL"
                                            />
                                            <label className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 text-zinc-400 transition-all">
                                              <Upload className="w-4 h-4" />
                                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(`${setting.setting_key}_item_${field}_item_${idx}`, e.target.files[0])} />
                                            </label>
                                          </div>
                                        </div>
                                      ) : (
                                        <input 
                                          type="text" 
                                          value={item[field]} 
                                          onChange={(e) => handleJsonItemChange(setting.setting_key, idx, field, e.target.value)}
                                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={() => addJsonItem(setting.setting_key, items[0] ? {...items[0]} : {})}
                              className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                              <Plus className="w-5 h-5" />
                              Add New Item
                            </button>
                          </div>
                        );
                      } catch (e) {
                        return (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm italic">
                            JSON Format Error: Please use the Code view to fix the structure.
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : isJson && showAsCode ? (
                  <div className="space-y-4">
                    <textarea
                      value={setting.setting_value || ""}
                      onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isImage && (
                      <div className="space-y-4">
                        {setting.setting_value && (
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                              <img 
                                  src={setting.setting_value} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL"}
                              />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={setting.setting_value || ""}
                            onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                            className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all text-sm"
                            placeholder="Enter image URL..."
                          />
                          <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-all cursor-pointer border border-zinc-700">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(setting.setting_key, e.target.files[0])}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {!isImage && (
                      setting.setting_type === "text" || setting.setting_value?.length > 100 ? (
                        <textarea
                          value={setting.setting_value || ""}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all resize-none text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={setting.setting_value || ""}
                          onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all text-sm"
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
