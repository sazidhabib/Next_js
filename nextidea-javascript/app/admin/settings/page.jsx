"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, AlertCircle, CheckCircle2, Globe, Mail, Phone, MapPin, Hash, Settings } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s))
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
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error) {
      console.error("Save settings error:", error);
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-300 font-medium">Loading settings...</p>
      </div>
    );
  }

  const getIcon = (key) => {
    if (key.includes("email")) return Mail;
    if (key.includes("phone")) return Phone;
    if (key.includes("address")) return MapPin;
    if (key.includes("name") || key.includes("description")) return Globe;
    return Hash;
  };

  const renderSetting = (setting) => {
    const Icon = getIcon(setting.setting_key);
    return (
      <div
        key={setting.id}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 md:w-1/3">
            <label className="text-sm font-bold text-zinc-300 capitalize">
              {setting.setting_key.replace(/_/g, " ")}
            </label>
            <p className="text-xs text-zinc-500">{setting.description}</p>
          </div>
          
          <div className="relative flex-grow">
            <Icon className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            {setting.setting_type === "text" || setting.setting_key === "address" || setting.setting_key === "site_description" || setting.setting_key === "footer_about" ? (
                <textarea
                    value={setting.setting_value || ""}
                    onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all resize-none text-sm"
                />
            ) : (
                <input
                    type="text"
                    value={setting.setting_value || ""}
                    onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all text-sm"
                />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Site Settings</h1>
          <p className="text-zinc-300 mt-1">Manage your website global configuration</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

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

      <div className="space-y-12">
        {/* General Settings */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> General Settings
          </h2>
          <div className="grid gap-6">
            {settings.filter(s => ['site_name', 'site_description', 'footer_about', 'copyright_text'].includes(s.setting_key)).map(renderSetting)}
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Contact Information
          </h2>
          <div className="grid gap-6">
            {settings.filter(s => ['contact_email', 'contact_phone', 'address'].includes(s.setting_key)).map(renderSetting)}
          </div>
        </section>

        {/* Social Media Links */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" /> Social Media Links
          </h2>
          <div className="grid gap-6">
            {settings.filter(s => s.setting_key.includes('_url')).map(renderSetting)}
          </div>
        </section>

        {/* Other Settings */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Other Configuration
          </h2>
          <div className="grid gap-6">
            {settings.filter(s => 
              !['site_name', 'site_description', 'footer_about', 'copyright_text', 'contact_email', 'contact_phone', 'address'].includes(s.setting_key) &&
              !s.setting_key.includes('_url') &&
              !s.setting_key.startsWith('about_') &&
              !s.setting_key.startsWith('home_')
            ).map(renderSetting)}
          </div>
        </section>
      </div>
    </div>
  );
}
