"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  Settings as SettingsIcon,
  AlertCircle,
  Check,
  LayoutDashboard,
  Package,
  Grid,
  LogOut,
  FileImage,
  ClipboardList,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import MediaLibraryModal from '../../../components/MediaLibraryModal';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminSettings() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('general');
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [activeSelector, setActiveSelector] = useState({ type: '', index: null });

  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    footerText: '',
    socialLinks: {},
    deliveryCharge: 120,
    freeShippingThreshold: 5000,
    mainSlider: [],
    topSlider: [],
    bottomSlider: [],
    brands: []
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setPendingCount(data.data.filter(o => o.status === 'pending').length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Wait for auth check to complete
  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchSettings();
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized, token, authLoading]);

  const parseSliderData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse slider string:", e);
      }
    }
    return [];
  };

  const processSettingsData = (rawSettings) => {
    if (!rawSettings) return rawSettings;
    return {
      ...rawSettings,
      mainSlider: parseSliderData(rawSettings.mainSlider),
      topSlider: parseSliderData(rawSettings.topSlider),
      bottomSlider: parseSliderData(rawSettings.bottomSlider),
      brands: parseSliderData(rawSettings.brands)
    };
  };

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setSettings(processSettingsData(data.data));
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    handleAdminLogout();
  };

  const showNotification = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleAddMainSlide = () => {
    const updated = [...(settings.mainSlider || []), { image: '' }];
    setSettings({ ...settings, mainSlider: updated });
  };

  const handleRemoveMainSlide = (index) => {
    const updated = [...(settings.mainSlider || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, mainSlider: updated });
  };

  const handleMainSlideChange = (index, value) => {
    const updated = [...(settings.mainSlider || [])];
    updated[index] = { ...updated[index], image: value };
    setSettings({ ...settings, mainSlider: updated });
  };

  const handleAddTopSlide = () => {
    const updated = [...(settings.topSlider || []), { image: '', link: '/offers' }];
    setSettings({ ...settings, topSlider: updated });
  };

  const handleRemoveTopSlide = (index) => {
    const updated = [...(settings.topSlider || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, topSlider: updated });
  };

  const handleTopSlideChange = (index, field, value) => {
    const updated = [...(settings.topSlider || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, topSlider: updated });
  };

  const handleAddBottomSlide = () => {
    const updated = [...(settings.bottomSlider || []), { image: '', link: '/offers' }];
    setSettings({ ...settings, bottomSlider: updated });
  };

  const handleRemoveBottomSlide = (index) => {
    const updated = [...(settings.bottomSlider || [])];
    updated.splice(index, 1);
    setSettings({ ...settings, bottomSlider: updated });
  };

  const handleBottomSlideChange = (index, field, value) => {
    const updated = [...(settings.bottomSlider || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, bottomSlider: updated });
  };

  const handleImageSelect = (url) => {
    const { type, index } = activeSelector;
    if (type === 'main') {
      const updated = [...(settings.mainSlider || [])];
      updated[index] = { ...updated[index], image: url };
      setSettings({ ...settings, mainSlider: updated });
    } else if (type === 'top') {
      const updated = [...(settings.topSlider || [])];
      updated[index] = { ...updated[index], image: url };
      setSettings({ ...settings, topSlider: updated });
    } else if (type === 'bottom') {
      const updated = [...(settings.bottomSlider || [])];
      updated[index] = { ...updated[index], image: url };
      setSettings({ ...settings, bottomSlider: updated });
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(processSettingsData(data.data));
        showNotification('Settings updated successfully!');
      } else {
        showNotification(data.message || 'Failed to update settings', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect happens in useAdminAuth if not authorized
  if (!isAuthorized || !token) {
    return null; // Will redirect via useAdminAuth hook
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar pendingCount={pendingCount} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 md:max-h-screen md:overflow-y-auto">
        {/* Alerts / Notifications */}
        {success && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center shadow-lg shadow-emerald-950/20 animate-fade-in-down">
            <Check className="w-5 h-5 mr-2" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center shadow-lg shadow-red-950/20 animate-fade-in-down">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Site Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Control site configurations, contact details, and home page sliders.
            </p>
          </div>
        </div>

        {/* Tab Selector Nav */}
        <div className="flex border-b border-slate-850 mb-8 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 rounded-t-lg -mb-[2px] ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-500 bg-slate-900/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            General Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sliders')}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 rounded-t-lg -mb-[2px] ${
              activeTab === 'sliders'
                ? 'border-blue-500 text-blue-500 bg-slate-900/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Slider Management
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={`px-5 py-3 font-semibold text-sm transition border-b-2 rounded-t-lg -mb-[2px] ${
              activeTab === 'brands'
                ? 'border-blue-500 text-blue-500 bg-slate-900/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Trusted Brands
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSettingsSubmit} className="max-w-4xl space-y-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Site Title</label>
                <input
                  type="text"
                  required
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Site Support Email</label>
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Site Contact Phone</label>
                <input
                  type="text"
                  required
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Address</label>
                <input
                  type="text"
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Standard Delivery Charge (৳)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.deliveryCharge || 0}
                  onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Free Delivery Minimum Order Total (৳)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.freeShippingThreshold || 0}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Site Meta Description</label>
                <textarea
                  rows="3"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Footer Rights / Copyright Text</label>
                <input
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {activeTab === 'sliders' && (
            <div className="space-y-8 animate-fade-in">
              {/* Main Slider Section */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Main Banner Slider</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Slides shown in the large left slider.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMainSlide}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg transition"
                  >
                    + Add Slide
                  </button>
                </div>
                
                {!(Array.isArray(settings.mainSlider) && settings.mainSlider.length) ? (
                  <p className="text-slate-500 text-sm py-2">No custom banners added. Default system banners will show.</p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {Array.isArray(settings.mainSlider) && settings.mainSlider.map((slide, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-xs font-bold text-slate-500 w-5 text-center">#{idx + 1}</span>
                        
                        {/* Thumbnail Preview */}
                        <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0 relative">
                          {slide.image ? (
                            <img src={slide.image} alt="Preview" className="object-cover w-full h-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        {/* Image Path Input */}
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Image Path / URL (e.g. /1st-post.jpeg)"
                            required
                            value={slide.image || ''}
                            onChange={(e) => handleMainSlideChange(idx, e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition text-sm"
                          />
                        </div>

                        {/* Choose Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSelector({ type: 'main', index: idx });
                            setMediaModalOpen(true);
                          }}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 rounded-lg transition text-xs flex items-center gap-1.5"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          <span>Choose</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveMainSlide(idx)}
                          className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-lg transition text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Side Slider Section */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Top-Right Side Slider</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Slides shown in the top-right promo slot.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTopSlide}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg transition"
                  >
                    + Add Slide
                  </button>
                </div>
                
                {!(Array.isArray(settings.topSlider) && settings.topSlider.length) ? (
                  <p className="text-slate-500 text-sm py-2">No custom banners added. Default system banners will show.</p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {Array.isArray(settings.topSlider) && settings.topSlider.map((slide, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-xs font-bold text-slate-500 w-5 md:col-span-1 text-center">#{idx + 1}</span>
                        
                        {/* Thumbnail Preview */}
                        <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0 md:col-span-1">
                          {slide.image ? (
                            <img src={slide.image} alt="Preview" className="object-cover w-full h-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        {/* Image Path Input */}
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            placeholder="Image Path / URL (e.g. /3rd_post.png)"
                            required
                            value={slide.image || ''}
                            onChange={(e) => handleTopSlideChange(idx, 'image', e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition text-sm"
                          />
                        </div>

                        {/* Link Path Input */}
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            placeholder="Link Path (e.g. /offers)"
                            required
                            value={slide.link || ''}
                            onChange={(e) => handleTopSlideChange(idx, 'link', e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition text-sm"
                          />
                        </div>

                        {/* Choose Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSelector({ type: 'top', index: idx });
                            setMediaModalOpen(true);
                          }}
                          className="md:col-span-1 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 rounded-lg transition text-xs flex items-center justify-center gap-1.5"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          <span>Choose</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveTopSlide(idx)}
                          className="md:col-span-1 px-3 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-lg transition text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Side Slider Section */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Bottom-Right Side Slider</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Slides shown in the bottom-right promo slot.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBottomSlide}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg transition"
                  >
                    + Add Slide
                  </button>
                </div>
                
                {!(Array.isArray(settings.bottomSlider) && settings.bottomSlider.length) ? (
                  <p className="text-slate-500 text-sm py-2">No custom banners added. Default system banners will show.</p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {Array.isArray(settings.bottomSlider) && settings.bottomSlider.map((slide, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-xs font-bold text-slate-500 w-5 md:col-span-1 text-center">#{idx + 1}</span>
                        
                        {/* Thumbnail Preview */}
                        <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0 md:col-span-1">
                          {slide.image ? (
                            <img src={slide.image} alt="Preview" className="object-cover w-full h-full" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        {/* Image Path Input */}
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            placeholder="Image Path / URL (e.g. /4th_post.png)"
                            required
                            value={slide.image || ''}
                            onChange={(e) => handleBottomSlideChange(idx, 'image', e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition text-sm"
                          />
                        </div>

                        {/* Link Path Input */}
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            placeholder="Link Path (e.g. /offers)"
                            required
                            value={slide.link || ''}
                            onChange={(e) => handleBottomSlideChange(idx, 'link', e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition text-sm"
                          />
                        </div>

                        {/* Choose Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSelector({ type: 'bottom', index: idx });
                            setMediaModalOpen(true);
                          }}
                          className="md:col-span-1 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 rounded-lg transition text-xs flex items-center justify-center gap-1.5"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          <span>Choose</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveBottomSlide(idx)}
                          className="md:col-span-1 px-3 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-lg transition text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'brands' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">Trusted Brands Marquee</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Manage the names of the brands displayed in the scrolling banner on the home page.
                </p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {Array.isArray(settings.brands) && settings.brands.map((brand, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                      <span className="text-xs font-bold text-slate-500 w-5 text-center">#{idx + 1}</span>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => {
                          const updated = [...(settings.brands || [])];
                          updated[idx] = e.target.value;
                          setSettings({ ...settings, brands: updated });
                        }}
                        className="flex-1 px-4 py-2 bg-slate-950/60 border border-slate-850 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="Brand Name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(settings.brands || [])];
                          if (idx > 0) {
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                          }
                          setSettings({ ...settings, brands: updated });
                        }}
                        disabled={idx === 0}
                        className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-20 transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(settings.brands || [])];
                          if (idx < updated.length - 1) {
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                          }
                          setSettings({ ...settings, brands: updated });
                        }}
                        disabled={idx === settings.brands.length - 1}
                        className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-20 transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(settings.brands || [])];
                          updated.splice(idx, 1);
                          setSettings({ ...settings, brands: updated });
                        }}
                        className="p-2 text-slate-500 hover:text-red-400 transition"
                        title="Delete Brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {(!settings.brands || settings.brands.length === 0) && (
                    <div className="text-center py-6 text-slate-500 bg-slate-950/20 rounded-xl border border-slate-850/50">
                      No brands listed. Add a new brand below to populate the list.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    id="newBrandInput"
                    placeholder="Enter brand name (e.g. Acer)"
                    className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value.trim();
                        if (val) {
                          const updated = [...(settings.brands || []), val];
                          setSettings({ ...settings, brands: updated });
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('newBrandInput');
                      const val = input ? input.value.trim() : '';
                      if (val) {
                        const updated = [...(settings.brands || []), val];
                        setSettings({ ...settings, brands: updated });
                        if (input) input.value = '';
                      }
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/10 flex items-center"
            >
              {actionLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
              Save Settings
            </button>
          </div>
        </form>

        {/* Media Library Modal */}
        <MediaLibraryModal
          isOpen={mediaModalOpen}
          onClose={() => setMediaModalOpen(false)}
          onSelect={handleImageSelect}
          title="Select Slider Banner Image"
        />
      </main>
    </div>
  );
}