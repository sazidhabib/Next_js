'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
  Zap,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentImage = '',
  title = 'Media Library',
}) {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'upload' | 'url'
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentImage || '');
  const [customUrl, setCustomUrl] = useState('');
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentImage || '');
      setCustomUrl('');
      setUploadResult(null);
      fetchMediaList();
    }
  }, [isOpen, currentImage]);

  const fetchMediaList = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMediaList(json.data);
      }
    } catch (err) {
      console.error('Error loading media:', err);
      toast.error('Failed to load media gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File too large (max 15MB)');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        toast.success(`Image uploaded & converted to WebP! (Saved ${json.savedPercent || 0}%)`);
        setSelectedUrl(json.url);
        setUploadResult(json);
        // Refresh gallery
        await fetchMediaList();
        // Switch to gallery with selection
        setActiveTab('gallery');
      } else {
        toast.error(json.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed due to network error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (e, filename) => {
    e.stopPropagation();
    if (!window.confirm(`Delete image "${filename}" from server?`)) return;

    try {
      const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.info('Image deleted');
        setMediaList((prev) => prev.filter((item) => item.filename !== filename));
        if (selectedUrl.includes(filename)) {
          setSelectedUrl('');
        }
      } else {
        toast.error(json.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Network error deleting image');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSelection = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    } else if (selectedUrl) {
      onSelectImage(selectedUrl);
      onClose();
    } else {
      toast.warning('Please select or upload an image first');
    }
  };

  const filteredMedia = mediaList.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Auto WebP Fast Load
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Select from library or upload optimized images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Library ({mediaList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>External URL</span>
            </button>
          </div>

          {activeTab === 'gallery' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pl-8 pr-3 py-1.5 w-48 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="button"
                onClick={fetchMediaList}
                disabled={loading}
                title="Refresh library"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          {/* TAB 1: GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-xs">Loading media library...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-3">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">No media files found</h3>
                  <p className="text-xs text-slate-400 mb-4 max-w-sm">
                    {searchQuery
                      ? `No images match "${searchQuery}"`
                      : 'Upload your first image to store it in your centralized media library.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-600/20"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.url)}
                        className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all aspect-square bg-slate-900 flex flex-col ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.filename}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Overlay Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {item.isWebp && (
                            <span className="bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                              WEBP
                            </span>
                          )}
                        </div>

                        {/* Selection Checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Bottom Info Bar & Delete on Hover */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-slate-300 font-medium truncate max-w-[70%]">
                            {item.filename}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteImage(e, item.filename)}
                            title="Delete image"
                            className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="max-w-xl mx-auto h-full flex flex-col justify-center py-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-4">
                  {isUploading ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {isUploading ? 'Converting & Uploading...' : 'Click to Upload or Drag & Drop'}
                </h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm">
                  Supports PNG, JPG, JPEG, GIF, AVIF. Automatically converted to ultra-compressed WebP.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automatic 82% WebP Compression for Fast Loading</span>
                </div>
              </div>

              {uploadResult && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <img
                    src={uploadResult.url}
                    alt="Uploaded"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{uploadResult.filename}</p>
                    <p className="text-[11px] text-slate-400">
                      Size: {uploadResult.sizeFormatted} • Saved: {uploadResult.savedPercent}%
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Ready
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <div className="max-w-lg mx-auto py-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Image Web Address (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {customUrl && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400">Preview</label>
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={customUrl}
                      alt="Custom preview"
                      onError={() => toast.error('Invalid image URL')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3 min-w-0">
            {selectedUrl && (
              <div className="flex items-center gap-2">
                <img
                  src={selectedUrl}
                  alt="Selected"
                  className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <span className="text-xs text-slate-300 truncate max-w-[200px] sm:max-w-xs font-medium">
                  {selectedUrl}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
