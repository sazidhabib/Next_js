'use client';

import { useState, useEffect, useMemo } from 'react';

const MediaLibrary = ({ token, isSelectMode = false, onSelect = null }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewMedia, setPreviewMedia] = useState(null);

  const getEffectiveToken = () => {
    if (token) return token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sazid_portfolio_admin_token') || '';
    }
    return '';
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const fetchMedia = async () => {
    const activeToken = getEffectiveToken();
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      } else {
        setError('Failed to load media catalog');
      }
    } catch (err) {
      setError('Connection error loading media');
    } finally {
      setLoading(false);
    }
  };

  // Convert image to WebP client-side using Canvas
  const processToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          const MAX_WIDTH = 1400;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const webpDataUrl = canvas.toDataURL('image/webp', 0.88);
          resolve(webpDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image element'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const activeToken = getEffectiveToken();
    setUploading(true);
    setError('');
    
    let successCount = 0;
    let failMessages = [];
    let lastUploadedItem = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length });

      try {
        let finalData;
        let finalFileName;

        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          const base64Promise = new Promise((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
          finalData = await base64Promise;
          
          const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const ext = file.name.split('.').pop();
          finalFileName = `${cleanName.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
        } else {
          finalData = await processToWebP(file);
          const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          finalFileName = `${cleanName.replace(/\s+/g, '_').toLowerCase()}.webp`;
        }

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            name: finalFileName,
            data: finalData
          })
        });

        if (res.ok) {
          successCount++;
          const newItem = await res.json();
          lastUploadedItem = newItem;
        } else {
          const data = await res.json();
          failMessages.push(`${file.name}: ${data.error || 'Upload failed'}`);
        }
      } catch (err) {
        failMessages.push(`${file.name}: ${err.message}`);
      }
    }

    setUploadProgress(null);
    setUploading(false);

    if (failMessages.length > 0) {
      setError(`Uploaded ${successCount} file(s). Failed: ${failMessages.join(', ')}`);
    }

    // Refresh media library
    await fetchMedia();

    // If single file uploaded in select mode, auto-select it!
    if (isSelectMode && onSelect && files.length === 1 && lastUploadedItem) {
      onSelect(lastUploadedItem.url);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this image permanently from media database?')) return;

    const activeToken = getEffectiveToken();
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        setMediaList(prev => prev.filter(m => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete media');
      }
    } catch (err) {
      alert('Error deleting media');
    }
  };

  const handleCopyLink = (e, url) => {
    e.stopPropagation();
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(absoluteUrl);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    mediaList.forEach(m => {
      if (m.category) cats.add(m.category);
    });
    if (mediaList.some(m => m.type === 'video')) cats.add('Videos');
    return Array.from(cats);
  }, [mediaList]);

  // Filtered media list
  const filteredMedia = useMemo(() => {
    return mediaList.filter(item => {
      // Category filter
      if (selectedCategory === 'Videos') {
        if (item.type !== 'video') return false;
      } else if (selectedCategory !== 'All') {
        if (item.category !== selectedCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q));
      }

      return true;
    });
  }, [mediaList, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {!isSelectMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Centralized Media Library</h2>
            <p className="text-slate-400 text-sm">
              Manage all images, project mockups, icons, and videos in one unified repository.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMedia}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Refresh Media Catalog"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between glass-card p-5 rounded-2xl border border-white/10">
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Media Asset
          </span>
          <span className="text-slate-400 text-xs">
            Auto-converts images to optimized WebP. Video formats (MP4, WebM) supported.
          </span>
        </div>

        <label className={`py-2.5 px-5 bg-accent hover:bg-accent-dark text-white rounded-xl text-sm font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 active:scale-[0.98] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {uploading
            ? uploadProgress
              ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
              : 'Processing...'
            : 'Upload Files'}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
            multiple
          />
        </label>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by name..."
            className="w-full bg-white/5 border border-white/10 py-1.5 pl-8 pr-3 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-xs"
          />
          <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="text-slate-400 text-center py-20 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading media catalog...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-slate-500 text-center py-16 glass-card rounded-2xl border border-white/5 flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">No matching media files found.</span>
          <span className="text-xs text-slate-600">Try adjusting your search or upload new files above.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 max-h-[58vh] overflow-y-auto pr-1">
          {filteredMedia.map((media) => {
            const url = media.url;
            const isCopied = copySuccess === url;
            const isVideo = media.type === 'video' || media.name.match(/\.(mp4|webm|ogg)$/i);

            return (
              <div
                key={media.id}
                onClick={() => {
                  if (isSelectMode && onSelect) {
                    onSelect(url);
                  } else {
                    setPreviewMedia(media);
                  }
                }}
                className={`glass-card rounded-xl overflow-hidden border p-2 flex flex-col justify-between gap-2 transition-all duration-200 relative group select-none ${
                  isSelectMode
                    ? 'cursor-pointer border-white/5 hover:border-accent hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/10 active:scale-[0.98]'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                {/* Media Preview Box */}
                <div className="w-full aspect-square bg-slate-900/60 rounded-lg overflow-hidden flex items-center justify-center relative group-hover:bg-slate-800/60 transition-colors">
                  {isVideo ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play().catch(() => {})}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={media.name}
                      className="w-full h-full object-contain p-1"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://www.svgrepo.com/show/354262/react-router.svg';
                      }}
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1 pointer-events-none">
                    {isVideo && (
                      <span className="bg-purple-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs uppercase">
                        Video
                      </span>
                    )}
                    {media.isLocal ? (
                      <span className="bg-slate-800/80 text-slate-300 text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Asset
                      </span>
                    ) : (
                      <span className="bg-emerald-500/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Select Mode Hover Overlay */}
                  {isSelectMode && (
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-accent text-white text-[11px] font-bold py-1 px-3 rounded-md shadow-md">
                        Use This
                      </span>
                    </div>
                  )}

                  {/* Delete Button (Only for custom DB uploads) */}
                  {!media.isLocal && !isSelectMode && (
                    <button
                      onClick={(e) => handleDelete(e, media.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-500 text-slate-300 hover:text-white rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Delete from Media Database"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="flex flex-col gap-1 px-0.5">
                  <span className="text-white text-xs font-semibold truncate block" title={media.name}>
                    {media.name}
                  </span>
                  
                  {isSelectMode ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(url);
                      }}
                      className="text-[11px] w-full py-1 rounded-md bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/30 font-medium transition-all text-center mt-1"
                    >
                      Select
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleCopyLink(e, url)}
                      className={`text-[10px] w-full py-1 rounded-md border transition-all text-center flex items-center justify-center gap-1 mt-0.5 ${
                        isCopied
                          ? 'bg-green-500/20 border-green-500/40 text-green-300 font-semibold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isCopied ? '✓ Copied URL' : 'Copy URL'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Modal for Non-select mode */}
      {previewMedia && !isSelectMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="glass-card rounded-2xl p-6 max-w-2xl w-full border border-white/15 relative flex flex-col gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white truncate pr-8">{previewMedia.name}</h3>

            <div className="w-full max-h-[50vh] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
              {previewMedia.type === 'video' || previewMedia.name.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={previewMedia.url} controls autoPlay className="max-h-[48vh] max-w-full rounded-lg" />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.name} className="max-h-[48vh] max-w-full object-contain rounded-lg" />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400 truncate flex-1 font-mono">{previewMedia.url}</span>
              <button
                onClick={(e) => handleCopyLink(e, previewMedia.url)}
                className="py-1.5 px-4 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              >
                {copySuccess === previewMedia.url ? 'Copied!' : 'Copy Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
