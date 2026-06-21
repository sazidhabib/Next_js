"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Upload, Trash2, Check, Loader2, Image as ImageIcon, 
  CheckSquare, Square, FileImage
} from 'lucide-react';

export default function MediaLibraryModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  multiSelect = false, 
  title = "Media Library" 
}) {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedUrls([]);
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.success) {
        setImages(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
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
              // Replace extension with .webp
              const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const newFileName = `${nameWithoutExt}.webp`;
              const webpFile = new File([blob], newFileName, { type: 'image/webp' });
              resolve(webpFile);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/webp', 0.85); // 0.85 compression quality
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
        // Convert to WebP if it's an image and not already WebP
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
        fetchImages();
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setImages(images.filter(img => img.name !== filename));
        setSelectedUrls(selectedUrls.filter(url => !url.endsWith(filename)));
      } else {
        alert(data.message || "Failed to delete image.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting image.");
    }
  };

  const handleSelectImage = (url) => {
    if (multiSelect) {
      if (selectedUrls.includes(url)) {
        setSelectedUrls(selectedUrls.filter(u => u !== url));
      } else {
        setSelectedUrls([...selectedUrls, url]);
      }
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedUrls.length === 0) return;
    if (multiSelect) {
      onSelect(selectedUrls);
    } else {
      onSelect(selectedUrls[0]);
    }
    onClose();
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Images upload as WebP with original name. Select {multiSelect ? "multiple images" : "an image"}.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center select-none">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search images by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
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
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10"
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

        {/* Explorer Content */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-slate-950/20">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-slate-400 text-sm">Loading media files...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl p-8">
              <FileImage className="w-12 h-12 mb-3 text-slate-600" />
              <p className="font-semibold text-slate-400">No media assets found</p>
              <p className="text-xs text-slate-500 mt-1">Upload images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredImages.map((img) => {
                const isSelected = selectedUrls.includes(img.url);
                return (
                  <div
                    key={img.name}
                    onClick={() => handleSelectImage(img.url)}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-900 transition-all select-none ${
                      isSelected 
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg" 
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="aspect-square w-full relative bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        className="object-contain w-full h-full p-1 group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      
                      {/* Select indicator */}
                      <div className="absolute top-2 left-2 z-10">
                        {multiSelect ? (
                          isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-500 fill-slate-950" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                          )
                        ) : (
                          isSelected && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                            </div>
                          )
                        )}
                      </div>

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-200">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(img.name, e)}
                          className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition shadow-md hover:scale-105 active:scale-95"
                          title="Delete image from store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                      <p className="text-[11px] font-semibold text-slate-200 truncate" title={img.name}>
                        {img.name}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        {formatSize(img.size)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/30">
          <span className="text-xs text-slate-400">
            {selectedUrls.length} image(s) selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-sm transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSelect}
              disabled={selectedUrls.length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10"
            >
              Select Image(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
