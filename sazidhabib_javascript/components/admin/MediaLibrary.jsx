'use client';

import { useState, useEffect } from 'react';

const MediaLibrary = ({ token, isSelectMode = false, onSelect = null }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media', {
        headers: { 'Authorization': `Bearer ${token}` }
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
          
          // Downscale large images to max width 1200px to save database storage space
          const MAX_WIDTH = 1200;
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
          
          // Convert to WebP data URL
          const webpDataUrl = canvas.toDataURL('image/webp', 0.85); // 0.85 quality
          resolve(webpDataUrl);
        };
        img.onerror = (err) => reject(new Error('Failed to load image element'));
      };
      reader.onerror = (err) => reject(new Error('Failed to read file'));
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    
    let successCount = 0;
    let failMessages = [];

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
          // 1. Process image to WebP (client-side)
          finalData = await processToWebP(file);
          
          // 2. Extract clean name (without extension) and append .webp
          const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          finalFileName = `${cleanName.replace(/\s+/g, '_').toLowerCase()}.webp`;
        }

        // 3. Post to API
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: finalFileName,
            data: finalData
          })
        });

        if (res.ok) {
          successCount++;
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

    // Refresh media library list
    fetchMedia();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent trigger select in select-mode
    if (!window.confirm('Delete this image permanently from media database?')) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMediaList(mediaList.filter(m => m.id !== id));
      } else {
        alert('Failed to delete media');
      }
    } catch (err) {
      alert('Error deleting media');
    }
  };

  const handleCopyLink = (e, url) => {
    e.stopPropagation();
    const absoluteUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(absoluteUrl);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const getMediaUrl = (media) => `/api/media?id=${media.id}&name=${encodeURIComponent(media.name)}`;

  return (
    <div className="flex flex-col gap-6 w-full">
      {!isSelectMode && (
        <div>
          <h2 className="text-xl font-bold text-white">Media Library</h2>
          <p className="text-slate-400 text-sm">Central repository for all section images. Uploaded files automatically convert to WebP format.</p>
        </div>
      )}

      {/* Upload Zone */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-6 rounded-xl border border-white/5">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-white font-semibold text-sm">Upload New Asset</span>
          <span className="text-slate-500 text-xs">Images are converted to WEBP. Videos are uploaded directly.</span>
        </div>

        <label className={`py-2.5 px-5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-semibold cursor-pointer transition-all flex items-center gap-2 active:scale-[0.97] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading
            ? uploadProgress
              ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
              : 'Processing...'
            : 'Upload Images'}
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {loading ? (
        <div className="text-slate-450 text-center py-16">Loading media catalog...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-slate-500 text-center py-16 glass-card rounded-2xl">
          No files uploaded yet. Select files to upload.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaList.map((media) => {
            const url = getMediaUrl(media);
            const isCopied = copySuccess === url;

            return (
              <div
                key={media.id}
                onClick={() => isSelectMode && onSelect && onSelect(url)}
                className={`glass-card rounded-xl overflow-hidden border p-2 flex flex-col justify-between gap-2 transition-all duration-300 relative group ${
                  isSelectMode
                    ? 'cursor-pointer border-white/5 hover:border-accent/40 hover:scale-[1.02]'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Image/Video Box */}
                <div className="w-full aspect-square bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center relative group-hover:bg-slate-800/50 transition-colors">
                  {media.name.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={media.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  )}
                  
                  {media.name.match(/\.(mp4|webm|ogg)$/i) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 p-2 rounded-full opacity-70 group-hover:opacity-0 transition-opacity">
                        <svg className="w-6 h-6 text-white pl-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Delete button (non-select mode or hover) */}
                  <button
                    onClick={(e) => handleDelete(e, media.id)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-slate-400 hover:text-red-400 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Delete Image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                    </svg>
                  </button>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-white text-xs font-semibold truncate block" title={media.name}>
                    {media.name}
                  </span>
                  
                  {!isSelectMode && (
                    <button
                      onClick={(e) => handleCopyLink(e, url)}
                      className={`text-[10px] w-full py-1 rounded border transition-all text-center flex items-center justify-center gap-1 mt-1 ${
                        isCopied
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCopied ? 'Copied!' : 'Copy URL'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
