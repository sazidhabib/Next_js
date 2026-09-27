'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  Trash2,
  X,
  FileCheck,
  FolderOpen,
  Filter,
  Eye,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Modal, Badge } from '../ui';

const CATEGORIES = [
  { id: 'ALL', label: 'All Files' },
  { id: 'EMPLOYEE_PHOTO', label: 'Employee Photos' },
  { id: 'PASSPORT', label: 'Passports & Visas' },
  { id: 'LOGO', label: 'Logos & Branding' },
  { id: 'GENERAL', label: 'General Documents' },
];

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialUrl = '',
  title = 'Media Library & File Selector',
  preferredCategory = 'ALL',
}) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload' | 'url'
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState(initialUrl || '');
  const [selectedCategory, setSelectedCategory] = useState(preferredCategory || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const fileInputRef = useRef(null);
  const [uploadCategory, setUploadCategory] = useState(preferredCategory !== 'ALL' ? preferredCategory : 'GENERAL');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let url = `/api/media?category=${selectedCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedFileUrl(initialUrl || '');
      setSelectedCategory(preferredCategory || 'ALL');
    }
  }, [isOpen, selectedCategory, preferredCategory]);

  const handleFileUpload = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', uploadCategory);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.file) {
        setSelectedFileUrl(data.file.url);
        await fetchMedia();
        setActiveTab('library');
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this media file from the library?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedFileUrl === files.find((f) => f.id === id)?.url) {
          setSelectedFileUrl('');
        }
        fetchMedia();
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleApply = () => {
    let finalUrl = selectedFileUrl;
    if (activeTab === 'url') {
      if (!directUrl.trim()) {
        alert('Please enter an image URL');
        return;
      }
      finalUrl = directUrl.trim();
    }

    if (!finalUrl) {
      alert('Please select an image from the library or upload a new file');
      return;
    }

    onSelect(finalUrl);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 text-xs">
        {/* Sub-Tab Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'library'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Media Library ({files.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Media Library Gallery */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchMedia();
                  }}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
              {loading ? (
                <div className="col-span-full py-12 text-center text-zinc-400">Loading media library...</div>
              ) : files.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-400 flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No media files found</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Switch tabs above to upload your first image.</p>
                </div>
              ) : (
                files.map((file) => {
                  const isSelected = selectedFileUrl === file.url;
                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFileUrl(file.url)}
                      className={`relative rounded-xl border p-2 cursor-pointer transition flex flex-col items-center group overflow-hidden ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/50 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {/* Checkmark badge if selected */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Delete button on hover */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteMedia(e, file.id)}
                        className="absolute top-2 right-2 z-10 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow hover:bg-rose-700"
                        title="Delete from library"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Image Thumbnail */}
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center mb-2 border border-zinc-100 dark:border-zinc-800">
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      {/* File Metadata */}
                      <div className="w-full text-left truncate">
                        <p className="font-semibold text-[11px] text-zinc-900 dark:text-zinc-100 truncate">
                          {file.originalName || file.filename}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{formatFileSize(file.fileSize)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Upload New File */}
        {activeTab === 'upload' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Assign Category:
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="GENERAL">General Document / Media</option>
                <option value="EMPLOYEE_PHOTO">Employee Profile Photo</option>
                <option value="PASSPORT">Passport / Visa Scan</option>
                <option value="LOGO">Brand Logo / Header Image</option>
              </select>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload({ target: { files: e.dataTransfer.files } });
                }
              }}
              className="w-full h-52 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800/60 bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition flex flex-col items-center justify-center p-4 cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {uploading ? 'Converting & optimizing to WebP...' : 'Click to browse or drag & drop an image'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">Supports PNG, JPG, JPEG, GIF, SVG, WebP (up to 10MB)</p>
              
              <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Auto-converts to lightweight WebP for lightning fast loading</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Direct URL Link */}
        {activeTab === 'url' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Image Web URL:
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={directUrl}
                onChange={(e) => {
                  setDirectUrl(e.target.value);
                  setSelectedFileUrl(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {directUrl && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 max-h-40 flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                <img src={directUrl} alt="URL Preview" className="max-h-36 object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-2 min-w-0 max-w-[280px]">
            {selectedFileUrl ? (
              <div className="flex items-center space-x-2 truncate">
                <img
                  src={selectedFileUrl}
                  alt="Selected"
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 truncate">
                  {selectedFileUrl.split('/').pop()}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-400 italic">No media selected</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedFileUrl && activeTab !== 'url'}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Select & Apply Media</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
