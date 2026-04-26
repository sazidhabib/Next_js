"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, AlertCircle, CheckCircle2, Users, Plus, Trash2, Upload, Layout } from "lucide-react";

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activePage, setActivePage] = useState("home");

  const PAGES = [
    { id: "home", name: "Home Page" },
    { id: "brand-identity", name: "Brand Identity" },
    { id: "creative-concept-execution", name: "Creative Concept" },
    { id: "design-printing", name: "Design & Printing" },
    { id: "digital-media-buying", name: "Digital Media Buying" },
    { id: "digital-pr", name: "Digital PR" },
    { id: "event-and-activation", name: "Event & Activation" },
    { id: "seo", name: "SEO" },
    { id: "social-media-marketing", name: "Social Media Marketing" },
    { id: "video-production-photography", name: "Video & Photography" },
    { id: "web-design-development", name: "Web Design" },
  ];

  const currentKey = `${activePage}_clients`;

  useEffect(() => {
    fetchClients();
  }, [activePage]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const clientSetting = data.data.find(s => s.setting_key === currentKey);
        if (clientSetting) {
          setClients(JSON.parse(clientSetting.setting_value || "[]"));
        } else {
          setClients([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      setMessage({ type: "error", text: "Failed to load clients" });
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (index, field, value) => {
    const newList = [...clients];
    newList[index][field] = value;
    setClients(newList);
  };

  const addClient = () => {
    setClients([...clients, { name: "New Client", logo: "" }]);
  };

  const removeClient = (index) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (index, file) => {
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
        handleClientChange(index, 'logo', data.data.url);
        setMessage({ type: "success", text: "Logo uploaded! Remember to save changes." });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          settings: [{ 
            key: currentKey, 
            value: JSON.stringify(clients),
            type: 'json'
          }] 
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `${PAGES.find(p => p.id === activePage).name} clients updated!` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Management</h1>
          <p className="text-zinc-400 mt-1">Manage partner and client logos for different pages</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={activePage}
            onChange={(e) => setActivePage(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary font-bold"
          >
            {PAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group transition-all hover:border-zinc-700">
            <button 
              onClick={() => removeClient(idx)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center p-4">
                {client.logo ? (
                  <img src={client.logo} className="max-w-full max-h-full object-contain" alt={client.name} />
                ) : (
                  <Layout className="w-8 h-8 text-zinc-600" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Client Name</label>
                  <input 
                    type="text" 
                    value={client.name} 
                    onChange={(e) => handleClientChange(idx, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Logo URL / Upload</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={client.logo} 
                      onChange={(e) => handleClientChange(idx, 'logo', e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-all"
                    />
                    <label className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-700 text-zinc-400 transition-all">
                      <Upload className="w-4 h-4" />
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addClient}
          className="h-full min-h-[200px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Add New Client</span>
        </button>
      </div>
    </div>
  );
}
