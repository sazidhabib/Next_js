'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Filter,
  Plus,
  Eye,
  Calendar,
  HardDrive,
  Copy,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Modal } from '../ui';

const CATEGORIES = [
  { id: 'ALL', label: 'All Files' },
  { id: 'EMPLOYEE_PHOTO', label: 'Employee Photos' },
  { id: 'PASSPORT', label: 'Passports & Visas' },
  { id: 'LOGO', label: 'Logos & Branding' },
  { id: 'GENERAL', label: 'General Documents' },
];

export default function MediaManagement() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadCategory, setUploadCategory] = useState('GENERAL');
  const [previewFile, setPreviewFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const fileInputRef = useRef(null);

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
    fetchMedia();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileUpload = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

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
      if (data.success) {
        fetchMedia();
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        if (previewFile?.id === id) setPreviewFile(null);
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <span>Centralized Media Library</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {files.length} {files.length === 1 ? 'Asset' : 'Assets'}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage all employee photos, passport scans, branding logos, and compliance documents in one place
              </p>
            </div>
          </div>

          {/* Quick Stats & Upload Action */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400">
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <span>Storage: <strong>{formatFileSize(totalBytes)}</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="px-2.5 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="GENERAL">General</option>
                <option value="EMPLOYEE_PHOTO">Employee Photo</option>
                <option value="PASSPORT">Passport/Visa</option>
                <option value="LOGO">App Logo</option>
              </select>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition"
            >
              Filter
            </button>
          </form>
        </div>
      </Card>

      {/* Gallery Grid */}
      <Card>
        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            Loading media files...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <FolderOpen className="w-7 h-7" />
            </div>
            <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">No media files found</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Upload images directly to this library or attach them in employee, visa, or branding settings.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload First Asset</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex flex-col shadow-xs"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => setPreviewFile(file)}
                  className="w-full aspect-square bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center p-2 cursor-pointer relative overflow-hidden"
                >
                  <img
                    src={file.url}
                    alt={file.originalName || file.filename}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Category Tag Overlay */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {file.category || 'GENERAL'}
                  </span>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                      }}
                      className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white transition"
                      title="Preview Image"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file.url, file.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/90 text-zinc-800 hover:bg-white transition"
                      title="Copy URL"
                    >
                      {copiedId === file.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* File Details */}
                <div className="p-2 flex flex-col justify-between flex-1">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px] truncate" title={file.originalName || file.filename}>
                    {file.originalName || file.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span className="truncate">{new Date(file.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={Boolean(previewFile)}
          onClose={() => setPreviewFile(null)}
          title={`Asset Preview: ${previewFile.originalName || previewFile.filename}`}
        >
          <div className="space-y-4 text-xs">
            <div className="w-full max-h-[60vh] bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center p-3">
              <img
                src={previewFile.url}
                alt={previewFile.originalName}
                className="max-h-[55vh] max-w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
              <div>
                <span className="text-zinc-400 text-[10px] block">Category</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{previewFile.category}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">File Size</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatFileSize(previewFile.fileSize)}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">File Type</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{previewFile.fileType || 'image'}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">Uploaded On</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {new Date(previewFile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={previewFile.url}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-xs text-zinc-700 dark:text-zinc-300 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopyUrl(previewFile.url, previewFile.id)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-xs flex items-center space-x-1.5 shrink-0 transition"
              >
                {copiedId === previewFile.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
