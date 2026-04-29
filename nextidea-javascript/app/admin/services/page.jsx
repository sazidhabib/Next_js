"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, Globe, Image as ImageIcon, 
  Settings, Loader2, Save, X, Check, ArrowRight,
  Sparkles, Video, Camera, Clapperboard, Users, Share2, 
  Scissors, Zap, Plane, Code2, Megaphone, Headphones, Target, Cpu, Trophy, FileText, Star, Palette, TrendingUp
} from "lucide-react";

// Icon mapping for selection
const ICON_OPTIONS = {
  Sparkles: <Sparkles />,
  Video: <Video />,
  Camera: <Camera />,
  Clapperboard: <Clapperboard />,
  Users: <Users />,
  Share2: <Share2 />,
  Scissors: <Scissors />,
  Zap: <Zap />,
  Plane: <Plane />,
  Code2: <Code2 />,
  Megaphone: <Megaphone />,
  Headphones: <Headphones />,
  Target: <Target />,
  Cpu: <Cpu />,
  Trophy: <Trophy />,
  FileText: <FileText />,
  Star: <Star />,
  Palette: <Palette />,
  TrendingUp: <TrendingUp />,
};

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service) => {
    // Parse JSON fields if they are strings
    const parsedService = { ...service };
    if (typeof parsedService.features_items === 'string') parsedService.features_items = JSON.parse(parsedService.features_items || '[]');
    if (typeof parsedService.process_steps === 'string') parsedService.process_steps = JSON.parse(parsedService.process_steps || '[]');
    if (typeof parsedService.related_services === 'string') parsedService.related_services = JSON.parse(parsedService.related_services || '[]');
    
    setEditingService(parsedService);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService({
      title: "",
      slug: "",
      tagline: "",
      hero_image: "",
      hero_icon: "Sparkles",
      about_title: "",
      about_description: "",
      about_image: "",
      features_title: "What's Included",
      features_items: [],
      process_title: "Our Process",
      process_steps: [],
      related_services: [],
      meta_title: "",
      meta_description: "",
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setServices(services.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingService.id 
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Services Management</h1>
          <p className="text-zinc-400 mt-1">Manage your service pages and their content</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search services by title or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all"
          >
            <div className="aspect-video relative overflow-hidden bg-zinc-800">
              {service.hero_image ? (
                <img src={service.hero_image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Globe className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur p-2 rounded-lg text-primary">
                {ICON_OPTIONS[service.hero_icon] || <Sparkles className="w-5 h-5" />}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
              <p className="text-zinc-500 text-sm mb-4">/{service.slug}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Page
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for adding/editing */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-white">
                  {editingService.id ? "Edit Service Page" : "Add New Service"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-12">
                {/* Hero Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Hero Section
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Service Title</label>
                      <input
                        required
                        value={editingService.title}
                        onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Slug (URL Path)</label>
                      <input
                        required
                        value={editingService.slug}
                        onChange={(e) => setEditingService({...editingService, slug: e.target.value})}
                        placeholder="e.g. video-production"
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Hero Tagline</label>
                      <input
                        value={editingService.tagline}
                        onChange={(e) => setEditingService({...editingService, tagline: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Hero Image URL</label>
                      <input
                        value={editingService.hero_image}
                        onChange={(e) => setEditingService({...editingService, hero_image: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Hero Icon</label>
                      <select
                        value={editingService.hero_icon}
                        onChange={(e) => setEditingService({...editingService, hero_icon: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none appearance-none"
                      >
                        {Object.keys(ICON_OPTIONS).map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Settings className="w-5 h-5" /> About Section
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Section Title</label>
                      <input
                        value={editingService.about_title}
                        onChange={(e) => setEditingService({...editingService, about_title: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Description</label>
                      <textarea
                        rows={4}
                        value={editingService.about_description}
                        onChange={(e) => setEditingService({...editingService, about_description: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">About Image URL</label>
                      <input
                        value={editingService.about_image}
                        onChange={(e) => setEditingService({...editingService, about_image: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* What's Included Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Check className="w-5 h-5" /> What's Included (Features)
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Section Title</label>
                      <input
                        value={editingService.features_title}
                        onChange={(e) => setEditingService({...editingService, features_title: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="grid gap-4">
                      {editingService.features_items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-zinc-800/50 rounded-xl flex gap-4 items-start border border-zinc-800 group">
                          <div className="flex-1 grid md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Icon</label>
                              <select
                                value={item.icon_name || "Check"}
                                onChange={(e) => {
                                  const newItems = [...editingService.features_items];
                                  newItems[idx].icon_name = e.target.value;
                                  setEditingService({...editingService, features_items: newItems});
                                }}
                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white"
                              >
                                {Object.keys(ICON_OPTIONS).map(icon => (
                                  <option key={icon} value={icon}>{icon}</option>
                                ))}
                                <option value="Check">Check</option>
                              </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Title</label>
                              <input
                                value={item.title}
                                onChange={(e) => {
                                  const newItems = [...editingService.features_items];
                                  newItems[idx].title = e.target.value;
                                  setEditingService({...editingService, features_items: newItems});
                                }}
                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-3">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                              <textarea
                                value={item.description}
                                onChange={(e) => {
                                  const newItems = [...editingService.features_items];
                                  newItems[idx].description = e.target.value;
                                  setEditingService({...editingService, features_items: newItems});
                                }}
                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = editingService.features_items.filter((_, i) => i !== idx);
                              setEditingService({...editingService, features_items: newItems});
                            }}
                            className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setEditingService({...editingService, features_items: [...editingService.features_items, {title: "", description: "", icon_name: "Check"}]})}
                        className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Feature
                      </button>
                    </div>
                  </div>
                </div>

                {/* Process Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Our Process
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Section Title</label>
                      <input
                        value={editingService.process_title}
                        onChange={(e) => setEditingService({...editingService, process_title: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="grid gap-4">
                      {editingService.process_steps.map((step, idx) => (
                        <div key={idx} className="p-4 bg-zinc-800/50 rounded-xl flex gap-4 items-start border border-zinc-800 group">
                          <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Step Title</label>
                              <input
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...editingService.process_steps];
                                  newSteps[idx].title = e.target.value;
                                  setEditingService({...editingService, process_steps: newSteps});
                                }}
                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                              <textarea
                                value={step.description}
                                onChange={(e) => {
                                  const newSteps = [...editingService.process_steps];
                                  newSteps[idx].description = e.target.value;
                                  setEditingService({...editingService, process_steps: newSteps});
                                }}
                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = editingService.process_steps.filter((_, i) => i !== idx);
                              setEditingService({...editingService, process_steps: newSteps});
                            }}
                            className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setEditingService({...editingService, process_steps: [...editingService.process_steps, {title: "", description: ""}]})}
                        className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Process Step
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meta Tags */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Globe className="w-5 h-5" /> SEO & Meta Tags
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Meta Title</label>
                      <input
                        value={editingService.meta_title}
                        onChange={(e) => setEditingService({...editingService, meta_title: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Status</label>
                      <select
                        value={editingService.is_active}
                        onChange={(e) => setEditingService({...editingService, is_active: parseInt(e.target.value)})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-zinc-400 uppercase">Meta Description</label>
                      <textarea
                        value={editingService.meta_description}
                        onChange={(e) => setEditingService({...editingService, meta_description: e.target.value})}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? "Saving..." : "Save Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
