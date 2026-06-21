"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  Package, LayoutDashboard, Settings, Grid, LogOut, Check,
  AlertCircle, Search, Upload, Trash2, Loader2, FileImage
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMedia() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchImages();
    }
  }, [isAuthorized, token, authLoading]);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.success) {
        setImages(data.data || []);
      } else {
        setError(data.message || 'Failed to load media.');
      }
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
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

  const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const newFileName = `${nameWithoutExt}.webp`;
              const webpFile = new File([blob], newFileName, { type: 'image/webp' });
              resolve(webpFile);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/webp', 0.85);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        let fileToUpload = file;
        if (file.type.startsWith('image/') && file.type !== 'image/webp') {
          fileToUpload = await convertToWebP(file);
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        return data.success ? data.url : null;
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      if (successfulUploads.length > 0) {
        showNotification(`${successfulUploads.length} image(s) uploaded successfully!`);
        fetchImages();
      } else {
        showNotification('Failed to upload image(s).', false);
      }
    } catch (err) {
      showNotification('Error occurred during upload.', false);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Image deleted successfully!');
        setImages(images.filter(img => img.name !== filename));
      } else {
        showNotification(data.message || "Failed to delete image.", false);
      }
    } catch (err) {
      showNotification('Error deleting image.', false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    handleAdminLogout();
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

  if (!isAuthorized || !token) {
    return null; // Redirects via useAdminAuth hook
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold tracking-wide">HulloTech</h2>
              <span className="text-xs text-slate-400">Admin Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Settings className="w-5 h-5" />
            <span>Site Configuration</span>
          </Link>

          <Link
            href="/admin/products"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Package className="w-5 h-5" />
            <span>Product Inventory</span>
          </Link>

          <Link
            href="/admin/categories"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Grid className="w-5 h-5" />
            <span>Category Manager</span>
          </Link>

          <Link
            href="/admin/media"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15"
          >
            <FileImage className="w-5 h-5" />
            <span>Media Gallery</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-950/20 hover:text-red-400 border border-slate-700/50 hover:border-red-900/30 text-slate-300 py-2.5 rounded-xl transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col max-h-screen overflow-y-auto">
        {/* Alerts */}
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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Media Gallery
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Centralized Image Management. All images automatically convert to WebP to optimize load speed.
            </p>
          </div>

          <div className="flex gap-2 self-start md:self-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/10 transition"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting & Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Image(s)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-md select-none">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search images by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading media files...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-slate-500">
            <FileImage className="w-16 h-16 mb-4 text-slate-700" />
            <p className="font-semibold text-slate-400">No media assets found</p>
            <p className="text-xs text-slate-500 mt-1">Upload images to populate your store library</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.name}
                className="group relative rounded-xl border border-slate-800 hover:border-slate-700 overflow-hidden bg-slate-900/30 transition-all select-none"
              >
                {/* Thumbnail */}
                <div className="aspect-square w-full relative bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                  <img 
                    src={img.url} 
                    alt={img.name} 
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  
                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                    <button
                      type="button"
                      onClick={() => handleDelete(img.name)}
                      className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition shadow-md hover:scale-105 active:scale-95"
                      title="Delete image from store"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-3 bg-slate-900/50">
                  <p className="text-[11px] font-semibold text-slate-200 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {formatSize(img.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
