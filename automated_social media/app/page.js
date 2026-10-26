"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Share2,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X as CloseIcon,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Globe,
  Sliders,
  Undo2,
  Copy,
  Eye,
  Check,
  HelpCircle,
  Hash,
  Wand2,
} from "lucide-react";

export default function SocialDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  // Universal Base Post State
  const [contentText, setContentText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [notification, setNotification] = useState(null);

  // Active Tab: "universal" | "linkedin" | "twitter" | "facebook" | "instagram" | "youtube"
  const [activeTab, setActiveTab] = useState("universal");

  // Platform Customization State
  const [platformCustomizations, setPlatformCustomizations] = useState({
    linkedin: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
    twitter: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
    facebook: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
    instagram: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
    youtube: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
  });

  // Preview Mode Tab: "current" (matches activeTab) or a specific provider
  const [previewTab, setPreviewTab] = useState("current");

  // Accounts Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [retryingDeliveryId, setRetryingDeliveryId] = useState(null);
  const [expandedDeliveryPostId, setExpandedDeliveryPostId] = useState(null);

  // Sample quick media presets
  const sampleMedia = [
    {
      name: "Modern Tech",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Launch Graphic",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Product Design",
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    },
  ];

  // Character limits and platform constraints
  const platformLimits = {
    twitter: { maxChars: 280, name: "X (Twitter)", requiresMedia: false },
    linkedin: { maxChars: 3000, name: "LinkedIn", requiresMedia: false },
    instagram: { maxChars: 2200, name: "Instagram", requiresMedia: true },
    facebook: { maxChars: 63206, name: "Facebook", requiresMedia: false },
    youtube: { maxChars: 5000, name: "YouTube", requiresMedia: false },
  };

  const fetchData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const [accRes, postRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/posts"),
      ]);

      const accData = await accRes.json();
      const postData = await postRes.json();

      if (accData.success) {
        setAccounts(accData.accounts || []);
        // Select all active accounts by default for 1-click convenience
        setSelectedAccountIds(accData.accounts.filter((a) => a.is_active).map((a) => a.id));
        setDbConnected(accData.databaseConnected);
      }

      if (postData.success) {
        setPosts(postData.posts || []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts and posts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const toggleAccount = (id) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id]
    );
  };

  // Helper to get effective content for any provider
  const getEffectiveContent = (provider) => {
    const custom = platformCustomizations[provider];
    if (custom && custom.isCustomized) {
      return {
        text: custom.text !== undefined && custom.text !== null ? custom.text : contentText,
        mediaUrl: custom.hasNoMedia
          ? null
          : custom.mediaUrl !== "" && custom.mediaUrl !== undefined
          ? custom.mediaUrl
          : imagePreview || mediaUrl || null,
        isCustomized: true,
      };
    }
    return {
      text: contentText,
      mediaUrl: imagePreview || mediaUrl || null,
      isCustomized: false,
    };
  };

  // Turn customization on for a platform
  const enablePlatformCustomization = (provider) => {
    setPlatformCustomizations((prev) => ({
      ...prev,
      [provider]: {
        isCustomized: true,
        text: prev[provider]?.text || contentText,
        mediaUrl: prev[provider]?.mediaUrl || imagePreview || mediaUrl || "",
        hasNoMedia: false,
      },
    }));
    showNotification(`Customization activated for ${platformLimits[provider]?.name || provider}`, "success");
  };

  // Revert / turn customization off for a platform
  const disablePlatformCustomization = (provider) => {
    setPlatformCustomizations((prev) => ({
      ...prev,
      [provider]: {
        isCustomized: false,
        text: "",
        mediaUrl: "",
        hasNoMedia: false,
      },
    }));
    showNotification(`Reverted ${platformLimits[provider]?.name || provider} to universal defaults`, "success");
  };

  // Copy latest universal content into platform customization
  const syncWithUniversal = (provider) => {
    setPlatformCustomizations((prev) => ({
      ...prev,
      [provider]: {
        isCustomized: true,
        text: contentText,
        mediaUrl: imagePreview || mediaUrl || "",
        hasNoMedia: false,
      },
    }));
    showNotification(`Synced ${platformLimits[provider]?.name || provider} with universal content`, "success");
  };

  // Update specific field for platform customization
  const updatePlatformCustomField = (provider, field, value) => {
    setPlatformCustomizations((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        isCustomized: true,
        [field]: value,
      },
    }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!contentText.trim()) {
      showNotification("Please enter universal base content for your post.", "error");
      return;
    }

    if (selectedAccountIds.length === 0) {
      showNotification("Please select at least one social media channel.", "error");
      return;
    }

    const targetAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));

    // Validate per-platform constraints using effective content
    for (const acc of targetAccounts) {
      const effective = getEffectiveContent(acc.provider);
      const limit = platformLimits[acc.provider];

      if (!effective.text || effective.text.trim().length === 0) {
        showNotification(`Text for ${limit?.name || acc.provider} cannot be empty.`, "error");
        return;
      }

      if (limit?.maxChars && effective.text.length > limit.maxChars) {
        showNotification(
          `${limit.name} exceeds limit of ${limit.maxChars} characters (Current: ${effective.text.length}). Customize it in the ${limit.name} tab!`,
          "error"
        );
        setActiveTab(acc.provider);
        return;
      }

      if (limit?.requiresMedia && !effective.mediaUrl) {
        showNotification(
          `${limit.name} requires an attached image. Please add one in the Universal or ${limit.name} tab!`,
          "error"
        );
        setActiveTab(acc.provider);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentText,
          mediaUrl: imagePreview || mediaUrl || null,
          targetAccounts,
          platformCustomizations,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Post broadcasted across all selected channels!", "success");
        // Reset composer
        setContentText("");
        setMediaUrl("");
        setImagePreview("");
        setPlatformCustomizations({
          linkedin: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
          twitter: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
          facebook: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
          instagram: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
          youtube: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
        });
        setActiveTab("universal");
        // Refresh posts list
        fetchData();
      } else {
        showNotification(data.error || "Failed to publish post.", "error");
      }
    } catch (err) {
      showNotification("Network error submitting post.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async (postId, deliveryId) => {
    setRetryingDeliveryId(deliveryId);
    try {
      const res = await fetch(`/api/posts/${postId}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryId }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Platform retry dispatched!", "success");
        fetchData();
      } else {
        showNotification(data.error || "Retry failed", "error");
      }
    } catch (err) {
      showNotification("Error retrying delivery", "error");
    } finally {
      setRetryingDeliveryId(null);
    }
  };

  // Platform styling helpers
  const getProviderInfo = (provider) => {
    switch (provider) {
      case "linkedin":
        return { name: "LinkedIn", color: "bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/30", icon: "in" };
      case "facebook":
        return { name: "Facebook", color: "bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/30", icon: "fb" };
      case "instagram":
        return { name: "Instagram", color: "bg-pink-500/15 text-pink-500 border-pink-500/30", icon: "ig" };
      case "twitter":
        return { name: "X (Twitter)", color: "bg-neutral-800 text-neutral-100 border-neutral-700", icon: "𝕏" };
      case "youtube":
        return { name: "YouTube", color: "bg-red-500/15 text-red-500 border-red-500/30", icon: "yt" };
      default:
        return { name: provider, color: "bg-neutral-800 text-neutral-300 border-neutral-700", icon: "●" };
    }
  };

  // Selected providers list for tabs
  const selectedProviders = Array.from(
    new Set(
      accounts
        .filter((a) => selectedAccountIds.includes(a.id))
        .map((a) => a.provider)
    )
  );

  // Active preview provider
  const currentPreviewProvider = previewTab === "current"
    ? (activeTab === "universal" ? (selectedProviders[0] || "twitter") : activeTab)
    : previewTab;

  const currentPreviewContent = getEffectiveContent(currentPreviewProvider);
  const currentPreviewProviderInfo = getProviderInfo(currentPreviewProvider);

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="relative border-b border-neutral-800/80 bg-[#0d0f17]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                OmniPost Hub
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                1-Click Multi-Channel Customizer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database status pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                dbConnected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  dbConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>{dbConnected ? "MySQL + Sequelize Active" : "Sandbox Demo Mode"}</span>
            </div>

            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-200 border border-neutral-700/80 transition-all shadow-sm"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Channels ({accounts.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-lg ${
              notification.type === "success"
                ? "bg-emerald-950/80 border-emerald-700/60 text-emerald-200"
                : "bg-red-950/80 border-red-700/60 text-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Connected Networks</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{accounts.length}</div>
            <div className="text-[11px] text-neutral-500 mt-1">LinkedIn, Meta, X, YouTube</div>
          </div>

          <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Total Broadcasts</span>
              <Share2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <div className="text-[11px] text-neutral-500 mt-1">1-click cross-posts</div>
          </div>

          <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Per-Platform Customizer</span>
              <Sliders className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400">Enabled</div>
            <div className="text-[11px] text-neutral-500 mt-1">Tailor text & media per channel</div>
          </div>

          <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Security Layer</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-sm font-semibold text-cyan-300 mt-1">AES-256-GCM</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Encrypted token vault</div>
          </div>
        </div>

        {/* 2-Column Responsive Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Channel Composer & Platform Customizer (7 Cols) */}
          <section className="lg:col-span-7 bg-[#12141f]/90 border border-neutral-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Multi-Channel Post Composer</h2>
                  <p className="text-xs text-neutral-400">Write universally or customize captions and media per network</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePublish}>
              {/* Channel Selectors / Pills */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                  1. Target Social Channels ({selectedAccountIds.length}/{accounts.length} Selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccountIds.includes(acc.id);
                    const providerInfo = getProviderInfo(acc.provider);
                    return (
                      <button
                        type="button"
                        key={acc.id}
                        onClick={() => toggleAccount(acc.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? `${providerInfo.color} ring-1 ring-white/10 shadow-md`
                            : "bg-neutral-900/60 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-black/30">
                          {providerInfo.icon}
                        </span>
                        <span>{acc.account_name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Tab Bar Switcher (Universal vs Individual Selected Platforms) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    2. Content & Platform Customization
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Click any network to customize its caption or image
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto">
                  {/* Universal Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("universal")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === "universal"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Universal (All Channels)</span>
                  </button>

                  {/* Individual Selected Channels Tabs */}
                  {selectedProviders.map((provider) => {
                    const pInfo = getProviderInfo(provider);
                    const isCustomized = platformCustomizations[provider]?.isCustomized;
                    const isActive = activeTab === provider;

                    return (
                      <button
                        type="button"
                        key={provider}
                        onClick={() => setActiveTab(provider)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-neutral-800 text-white border border-neutral-700 font-semibold shadow-sm"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-sm flex items-center justify-center font-bold text-[9px] bg-black/40">
                          {pInfo.icon}
                        </span>
                        <span>{pInfo.name}</span>
                        {isCustomized ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                            Custom
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Universal</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB 1: UNIVERSAL TAB */}
              {activeTab === "universal" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-neutral-400 bg-indigo-950/30 border border-indigo-800/30 rounded-xl px-3.5 py-2">
                    <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                      <Globe className="w-4 h-4 text-indigo-400" /> Universal Base Content
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {contentText.length} chars
                    </span>
                  </div>

                  {/* Universal Textarea */}
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="What's happening? Share product announcements, marketing updates, or thoughts... (This text will be used for all channels unless customized)"
                      className="w-full bg-[#0a0b12] border border-neutral-800 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>

                  {/* Universal Media URL / Upload Section */}
                  <div className="bg-[#0a0b12]/80 border border-neutral-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                        <span>Universal Media Attachment (Applies to all channels by default)</span>
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setMediaUrl("");
                          }}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <CloseIcon className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => {
                          setMediaUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        placeholder="Paste image URL (https://...)"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500">Quick Samples:</span>
                      {sampleMedia.map((m, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            setMediaUrl(m.url);
                            setImagePreview(m.url);
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-all cursor-pointer"
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>

                    {/* Universal Image Preview */}
                    {imagePreview && (
                      <div className="mt-3 relative w-full h-44 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                        <img
                          src={imagePreview}
                          alt="Universal preview"
                          className="w-full h-full object-cover"
                          onError={() => showNotification("Could not load image from URL", "error")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PLATFORM-SPECIFIC CUSTOMIZER */}
              {activeTab !== "universal" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Platform Header & Customization Toggle */}
                  {(() => {
                    const provider = activeTab;
                    const pInfo = getProviderInfo(provider);
                    const limit = platformLimits[provider];
                    const customConfig = platformCustomizations[provider] || {};
                    const isCustomized = customConfig.isCustomized;
                    const effective = getEffectiveContent(provider);
                    const currentChars = (isCustomized ? customConfig.text : contentText) || "";
                    const charsRemaining = limit ? limit.maxChars - currentChars.length : null;
                    const isOverLimit = charsRemaining !== null && charsRemaining < 0;

                    return (
                      <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs bg-black/50 border border-neutral-700">
                              {pInfo.icon}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{pInfo.name} Customizer</span>
                                {isCustomized ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    Custom Override Active
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                    Inheriting Universal
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-400">
                                {isCustomized
                                  ? `Tailored specifically for ${pInfo.name}. Will not affect other networks.`
                                  : `Currently using your universal description and image.`}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCustomized ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => syncWithUniversal(provider)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer"
                                  title="Copy current Universal text & image into this platform"
                                >
                                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Sync Universal</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => disablePlatformCustomization(provider)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 cursor-pointer"
                                >
                                  <Undo2 className="w-3.5 h-3.5" />
                                  <span>Revert</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => enablePlatformCustomization(provider)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>Customize for {pInfo.name}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Textarea for Platform */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                              <span>{pInfo.name} Post Description</span>
                              {isCustomized && (
                                <span className="text-[10px] text-purple-400 font-normal">
                                  (Independent from Universal)
                                </span>
                              )}
                            </label>
                            {limit?.maxChars && (
                              <span
                                className={`text-xs font-mono font-medium ${
                                  isOverLimit ? "text-red-400 font-bold" : "text-neutral-400"
                                }`}
                              >
                                {currentChars.length} / {limit.maxChars} chars
                                {isOverLimit && ` (${Math.abs(charsRemaining)} over limit!)`}
                              </span>
                            )}
                          </div>

                          <textarea
                            rows={5}
                            value={isCustomized ? customConfig.text : contentText}
                            disabled={!isCustomized}
                            onChange={(e) => updatePlatformCustomField(provider, "text", e.target.value)}
                            placeholder={
                              isCustomized
                                ? `Write customized description for ${pInfo.name}...`
                                : `Currently using Universal content. Click "Customize for ${pInfo.name}" above to edit.`
                            }
                            className={`w-full rounded-xl p-4 text-sm transition-all resize-none font-sans leading-relaxed ${
                              isCustomized
                                ? "bg-[#0a0b12] border border-purple-500/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                : "bg-neutral-900/40 border border-neutral-800 text-neutral-400 cursor-not-allowed opacity-80"
                            }`}
                          />

                          {/* Quick helper buttons for this platform */}
                          {isCustomized && (
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {provider === "twitter" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (currentChars.length > 280) {
                                      updatePlatformCustomField(provider, "text", currentChars.slice(0, 277) + "...");
                                    }
                                  }}
                                  className="text-[11px] px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/80 cursor-pointer flex items-center gap-1"
                                >
                                  <Wand2 className="w-3 h-3 text-indigo-400" />
                                  <span>Trim to 280 chars</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const hashtag = provider === "linkedin"
                                    ? "\n\n#Leadership #Innovation #Business"
                                    : provider === "twitter"
                                    ? " #Tech #Update"
                                    : "\n\n#trending #viral #content";
                                  updatePlatformCustomField(provider, "text", currentChars + hashtag);
                                }}
                                className="text-[11px] px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/80 cursor-pointer flex items-center gap-1"
                              >
                                <Hash className="w-3 h-3 text-pink-400" />
                                <span>Add {pInfo.name} Hashtags</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Media Section for Platform */}
                        <div className="bg-[#0a0b12]/80 border border-neutral-800/80 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-purple-400" />
                              <span>{pInfo.name} Image Attachment</span>
                            </label>

                            {isCustomized && (
                              <div className="flex items-center gap-3">
                                <label className="text-xs text-neutral-400 flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={customConfig.hasNoMedia || false}
                                    onChange={(e) =>
                                      updatePlatformCustomField(provider, "hasNoMedia", e.target.checked)
                                    }
                                    className="rounded border-neutral-700 text-indigo-600 focus:ring-0"
                                  />
                                  <span>Text-only (no image for {pInfo.name})</span>
                                </label>
                              </div>
                            )}
                          </div>

                          {!isCustomized ? (
                            <div className="text-xs text-neutral-400 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                              {imagePreview || mediaUrl ? (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={imagePreview || mediaUrl}
                                    alt="Inherited image"
                                    className="w-12 h-12 object-cover rounded-md border border-neutral-700"
                                  />
                                  <div>
                                    <div className="font-medium text-neutral-200">Using Universal Image</div>
                                    <div className="text-[11px] text-neutral-500">
                                      Enable customization above to attach a different image or post text-only.
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span>No universal image attached. Click &quot;Customize for {pInfo.name}&quot; to add a platform-specific image.</span>
                              )}
                            </div>
                          ) : customConfig.hasNoMedia ? (
                            <div className="text-xs text-amber-300/80 bg-amber-950/20 border border-amber-800/30 p-3 rounded-lg">
                              This post will be broadcast as <strong>text-only</strong> on {pInfo.name}, while other channels retain their images.
                            </div>
                          ) : (
                            <div>
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="url"
                                  value={customConfig.mediaUrl || ""}
                                  onChange={(e) =>
                                    updatePlatformCustomField(provider, "mediaUrl", e.target.value)
                                  }
                                  placeholder={`Custom image URL for ${pInfo.name} (https://...)`}
                                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                                />
                                {customConfig.mediaUrl && (
                                  <button
                                    type="button"
                                    onClick={() => updatePlatformCustomField(provider, "mediaUrl", "")}
                                    className="text-xs text-neutral-400 hover:text-red-400 px-2 cursor-pointer"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>

                              {/* Platform quick sample picker */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-neutral-500">Quick Samples:</span>
                                {sampleMedia.map((m, idx) => (
                                  <button
                                    type="button"
                                    key={idx}
                                    onClick={() =>
                                      updatePlatformCustomField(provider, "mediaUrl", m.url)
                                    }
                                    className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-all cursor-pointer"
                                  >
                                    {m.name}
                                  </button>
                                ))}
                              </div>

                              {/* Custom image preview */}
                              {customConfig.mediaUrl && (
                                <div className="mt-3 relative w-full h-44 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                                  <img
                                    src={customConfig.mediaUrl}
                                    alt={`${pInfo.name} custom preview`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-6 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setContentText("");
                    setImagePreview("");
                    setMediaUrl("");
                    setPlatformCustomizations({
                      linkedin: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
                      twitter: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
                      facebook: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
                      instagram: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
                      youtube: { isCustomized: false, text: "", mediaUrl: "", hasNoMedia: false },
                    });
                    setActiveTab("universal");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  Clear All
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedAccountIds.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting to {selectedAccountIds.length} channels...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>1-Click Broadcast</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* LIVE CROSS-PLATFORM PREVIEW CARD ACCORDION / BOX */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Live Channel Simulation Preview
                  </span>
                </div>

                {/* Preview selector pills */}
                <div className="flex items-center gap-1">
                  {selectedProviders.map((prov) => {
                    const pInfo = getProviderInfo(prov);
                    const isSelected = currentPreviewProvider === prov;
                    return (
                      <button
                        type="button"
                        key={prov}
                        onClick={() => setPreviewTab(prov)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-neutral-700 text-white font-semibold"
                            : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {pInfo.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Realistic Preview Box */}
              <div className="bg-[#0b0d14] border border-neutral-800 rounded-xl p-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                      OP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>OmniPost Brand</span>
                        <span className="text-[10px] text-neutral-500">
                          {currentPreviewProvider === "twitter"
                            ? "@omnipost"
                            : currentPreviewProvider === "linkedin"
                            ? "• 1st"
                            : ""}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <span>Just now</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">
                          {currentPreviewProviderInfo.name}
                        </span>
                        {currentPreviewContent.isCustomized && (
                          <span className="text-purple-400 font-semibold">• Customized</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    {currentPreviewContent.text?.length || 0} chars
                  </span>
                </div>

                {/* Preview Text */}
                <p className="text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed mb-3">
                  {currentPreviewContent.text || (
                    <span className="text-neutral-600 italic">No content yet. Type in the composer to preview...</span>
                  )}
                </p>

                {/* Preview Media */}
                {currentPreviewContent.mediaUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                    <img
                      src={currentPreviewContent.mediaUrl}
                      alt="Channel preview media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Column: Live Cross-Platform History & Status (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                  Broadcast Activity
                </h3>
              </div>
              <button
                onClick={fetchData}
                className="text-xs text-neutral-400 hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-8 text-center text-neutral-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                Loading post deliveries...
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-[#12141f]/70 border border-neutral-800/80 rounded-2xl p-8 text-center text-neutral-500 text-sm">
                No posts published yet. Use the composer on the left to make your first broadcast!
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 max-h-[750px] overflow-y-auto pr-1">
                {posts.map((post) => {
                  const hasCustomDeliveries = post.deliveries?.some((d) => d.custom_text || d.custom_media_url);

                  return (
                    <div
                      key={post.id}
                      className="bg-[#12141f]/90 border border-neutral-800/90 rounded-2xl p-4 shadow-md backdrop-blur-sm transition-all hover:border-neutral-700"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-500">
                            {new Date(post.createdAt || post.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {hasCustomDeliveries && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              Customized Channels
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            post.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : post.status === "partial_failure"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : post.status === "processing"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {post.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <p className="text-xs text-neutral-200 line-clamp-2 mb-3 leading-relaxed">
                        {post.content_text}
                      </p>

                      {/* Image Thumbnail if attached */}
                      {post.media_url && (
                        <div className="mb-3 w-full h-24 rounded-lg overflow-hidden border border-neutral-800">
                          <img
                            src={post.media_url}
                            alt="Attached media"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Platform Deliveries List */}
                      <div className="border-t border-neutral-800/80 pt-2.5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 mb-0.5">
                          <span>Delivery Channels:</span>
                          {hasCustomDeliveries && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDeliveryPostId(
                                  expandedDeliveryPostId === post.id ? null : post.id
                                )
                              }
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                            >
                              {expandedDeliveryPostId === post.id ? "Hide details" : "View custom content"}
                            </button>
                          )}
                        </div>
                        {post.deliveries?.map((del) => {
                          const pInfo = getProviderInfo(del.provider);
                          const isCustomDelivery = del.custom_text || del.custom_media_url;

                          return (
                            <div
                              key={del.id}
                              className="flex flex-col py-1.5 px-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60 text-xs gap-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[10px] text-neutral-300">
                                    {pInfo.name}
                                  </span>
                                  {isCustomDelivery && (
                                    <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300">
                                      Customized
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {del.status === "published" && (
                                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                                    </span>
                                  )}

                                  {del.status === "in_progress" && (
                                    <span className="flex items-center gap-1 text-[11px] text-indigo-400">
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Progress
                                    </span>
                                  )}

                                  {del.status === "failed" && (
                                    <div className="flex items-center gap-2">
                                      <span className="flex items-center gap-1 text-[11px] text-red-400">
                                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                                      </span>
                                      <button
                                        onClick={() => handleRetry(post.id, del.id)}
                                        disabled={retryingDeliveryId === del.id}
                                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-medium transition-colors cursor-pointer"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        {retryingDeliveryId === del.id ? "Retrying..." : "Retry"}
                                      </button>
                                    </div>
                                  )}

                                  {del.external_post_id && (
                                    <a
                                      href={
                                        del.external_post_id.startsWith("http")
                                          ? del.external_post_id
                                          : "#"
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-500 hover:text-neutral-300 transition-colors"
                                      title="View live post"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Expanded Custom Content Details */}
                              {expandedDeliveryPostId === post.id && isCustomDelivery && (
                                <div className="mt-1 pt-1 border-t border-neutral-800 text-[11px] text-neutral-300 bg-neutral-950/60 p-2 rounded">
                                  {del.custom_text && (
                                    <div className="mb-1">
                                      <span className="text-neutral-500">Custom Text: </span>
                                      <span>{del.custom_text}</span>
                                    </div>
                                  )}
                                  {del.custom_media_url && (
                                    <div>
                                      <span className="text-neutral-500">Custom Image: </span>
                                      <a
                                        href={del.custom_media_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-400 underline"
                                      >
                                        View attached image
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Account Management Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#12141f] border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Connected Social Channels</h3>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mt-3 mb-4">
              Connect your brand accounts using OAuth2. Once connected, 1-click posting delivers to these channels with automatic token refreshing.
            </p>

            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {[
                { id: "linkedin", name: "LinkedIn Profile / Company", icon: "in", color: "#0A66C2" },
                { id: "facebook", name: "Facebook Page", icon: "fb", color: "#1877F2" },
                { id: "instagram", name: "Instagram Business", icon: "ig", color: "#E4405F" },
                { id: "twitter", name: "X (Twitter) Profile", icon: "𝕏", color: "#ffffff" },
                { id: "youtube", name: "YouTube Channel Community", icon: "yt", color: "#FF0000" },
              ].map((provider) => {
                const connectedAccount = accounts.find((a) => a.provider === provider.id);

                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-xs">
                        {provider.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{provider.name}</div>
                        <div className="text-[11px] text-neutral-500">
                          {connectedAccount ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Connected as {connectedAccount.account_name}
                            </span>
                          ) : (
                            "Not linked"
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      {connectedAccount ? (
                        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <a
                          href={`/api/auth/${provider.id}/connect`}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                        >
                          Connect OAuth
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
