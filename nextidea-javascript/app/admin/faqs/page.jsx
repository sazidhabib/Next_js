"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, AlertCircle, CheckCircle2, HelpCircle, Plus, Trash2, Home, Globe } from "lucide-react";

export default function FaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activePage, setActivePage] = useState("home");

  const PAGES = [
    { id: "home", name: "Home Page" },
    { id: "global", name: "Global / Default" },
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

  const currentKey = activePage === "global" ? "global_faqs" : `${activePage}_faqs`;

  useEffect(() => {
    fetchFaqs();
  }, [activePage]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const faqSetting = data.data.find(s => s.setting_key === currentKey);
        if (faqSetting) {
          setFaqs(JSON.parse(faqSetting.setting_value || "[]"));
        } else {
          setFaqs([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      setMessage({ type: "error", text: "Failed to load FAQs" });
    } finally {
      setLoading(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const newList = [...faqs];
    newList[index][field] = value;
    setFaqs(newList);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          settings: [
            { key: currentKey, value: JSON.stringify(faqs), type: 'json' }
          ] 
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `${PAGES.find(p => p.id === activePage).name} FAQs updated!` });
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
        <p className="text-zinc-400 font-medium">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQ Management</h1>
          <p className="text-zinc-400 mt-1">Manage questions and answers for Home and other pages</p>
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

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group transition-all hover:border-zinc-700">
            <button 
              onClick={() => removeFaq(idx)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Question</label>
                <input 
                  type="text" 
                  value={faq.question} 
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-800 rounded-xl text-white font-bold text-base focus:outline-none focus:border-primary transition-all"
                  placeholder="Enter question..."
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Answer</label>
                <textarea 
                  value={faq.answer} 
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 text-sm focus:outline-none focus:border-primary transition-all resize-none"
                  rows={3}
                  placeholder="Enter answer..."
                />
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addFaq}
          className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all group"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold uppercase tracking-wider text-xs">Add New FAQ</span>
        </button>
      </div>
    </div>
  );
}
