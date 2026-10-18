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
} from "lucide-react";

export default function SocialDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  // Composer Form State
  const [contentText, setContentText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [notification, setNotification] = useState(null);

  // Accounts Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [retryingDeliveryId, setRetryingDeliveryId] = useState(null);

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

  // Fetch accounts and posts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const toggleAccount = (id) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id]
    );
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!contentText.trim()) {
      showNotification("Please enter content for your post.", "error");
      return;
    }

    if (selectedAccountIds.length === 0) {
      showNotification("Please select at least one social media channel.", "error");
      return;
    }

    const targetAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentText,
          mediaUrl: imagePreview || mediaUrl || null,
          targetAccounts,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Post broadcasted across all selected channels!", "success");
        setContentText("");
        setMediaUrl("");
        setImagePreview("");
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

  // Character calculations & constraints
  const twitterSelected = selectedAccountIds.some(
    (id) => accounts.find((a) => a.id === id)?.provider === "twitter"
  );
  const instagramSelected = selectedAccountIds.some(
    (id) => accounts.find((a) => a.id === id)?.provider === "instagram"
  );
  const isOverTwitterLimit = twitterSelected && contentText.length > 280;
  const isMissingInstagramMedia = instagramSelected && !imagePreview && !mediaUrl;

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
                1-Click Social Engine
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
              <span>Success Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">98.4%</div>
            <div className="text-[11px] text-neutral-500 mt-1">Auto retry on fail</div>
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
          {/* Left Column: 1-Click Multi-Channel Composer (7 Cols) */}
          <section className="lg:col-span-7 bg-[#12141f]/90 border border-neutral-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">1-Click Universal Composer</h2>
                  <p className="text-xs text-neutral-400">Compose once, distribute simultaneously to all channels</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {contentText.length} chars
              </span>
            </div>

            <form onSubmit={handlePublish}>
              {/* Channel Selectors / Pills */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Target Social Channels ({selectedAccountIds.length}/{accounts.length} Selected)
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

              {/* Text Input Composer */}
              <div className="mb-4 relative">
                <textarea
                  rows={5}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="What's happening? Share product announcements, marketing updates, or thoughts..."
                  className="w-full bg-[#0a0b12] border border-neutral-800 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all resize-none font-sans leading-relaxed"
                />

                {/* Platform limit alerts */}
                <div className="flex items-center justify-between mt-1 text-xs">
                  <div className="flex items-center gap-3">
                    {twitterSelected && (
                      <span
                        className={`font-mono ${
                          isOverTwitterLimit ? "text-red-400 font-bold" : "text-neutral-500"
                        }`}
                      >
                        𝕏 {280 - contentText.length} left
                      </span>
                    )}
                    {instagramSelected && isMissingInstagramMedia && (
                      <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                        <AlertCircle className="w-3 h-3" /> Instagram requires an image
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Media URL / Upload Section */}
              <div className="mb-6 bg-[#0a0b12]/80 border border-neutral-800/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>Attach Single Image (Optional)</span>
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setMediaUrl("");
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <CloseIcon className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {/* Image URL input */}
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
                      className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-all"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                {/* Image Preview Box */}
                {imagePreview && (
                  <div className="mt-3 relative w-full h-44 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="w-full h-full object-cover"
                      onError={() => showNotification("Could not load image from URL", "error")}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setContentText("");
                    setImagePreview("");
                    setMediaUrl("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Clear Form
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
                className="text-xs text-neutral-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
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
              <div className="flex flex-col gap-3.5 max-h-[640px] overflow-y-auto pr-1">
                {posts.map((post) => {
                  return (
                    <div
                      key={post.id}
                      className="bg-[#12141f]/90 border border-neutral-800/90 rounded-2xl p-4 shadow-md backdrop-blur-sm transition-all hover:border-neutral-700"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] text-neutral-500">
                          {new Date(post.createdAt || post.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
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
                        <div className="text-[11px] font-medium text-neutral-400 mb-0.5">
                          Delivery Channels:
                        </div>
                        {post.deliveries?.map((del) => {
                          const pInfo = getProviderInfo(del.provider);
                          return (
                            <div
                              key={del.id}
                              className="flex items-center justify-between py-1 px-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[10px] text-neutral-300">
                                  {pInfo.name}
                                </span>
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
                                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-medium transition-colors"
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
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
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
                className="px-4 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
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
