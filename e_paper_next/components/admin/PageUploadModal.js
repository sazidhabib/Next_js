'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Crosshair,
  Loader2,
} from 'lucide-react';

export default function PageUploadModal({
  isOpen,
  onClose,
  editionId = 1,
  nextPageNumber = 1,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pageTitle, setPageTitle] = useState(`Page ${nextPageNumber} - Main`);
  const [pageNumber, setPageNumber] = useState(nextPageNumber);
  const [widthPx, setWidthPx] = useState(1000);
  const [heightPx, setHeightPx] = useState(1450);
  const [customUrl, setCustomUrl] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [uploadedPage, setUploadedPage] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Read natural dimensions
    const img = new Image();
    img.onload = () => {
      setWidthPx(img.naturalWidth || 1000);
      setHeightPx(img.naturalHeight || 1450);
    };
    img.src = objectUrl;
  };

  const handleCustomUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);
    setPreviewUrl(url);

    if (url) {
      const img = new Image();
      img.onload = () => {
        setWidthPx(img.naturalWidth || 1000);
        setHeightPx(img.naturalHeight || 1450);
      };
      img.src = url;
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setUploading(true);

    try {
      let finalImageUrl = customUrl;

      if (mode === 'upload') {
        if (!file) {
          setErrorMsg('Please select an image file to upload');
          setUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Failed to upload image file');
        }

        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        throw new Error('Image URL is required');
      }

      // Save new page in DB / store
      const pageRes = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editionId: parseInt(editionId, 10),
          pageNumber: parseInt(pageNumber, 10),
          pageTitle,
          imageUrl: finalImageUrl,
          thumbUrl: finalImageUrl,
          widthPx: parseInt(widthPx, 10),
          heightPx: parseInt(heightPx, 10),
        }),
      });

      const pageData = await pageRes.json();
      if (!pageData.success) {
        throw new Error(pageData.error || 'Failed to save page record');
      }

      setUploadedPage(pageData.data);
      if (onSuccess) {
        onSuccess(pageData.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while uploading page');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl('');
    setCustomUrl('');
    setUploadedPage(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 custom-scrollbar">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                {uploadedPage ? 'Page Scan Uploaded Successfully!' : 'Upload E-Paper Page Scan'}
              </h3>
              <p className="text-[11px] text-slate-400">Add a high-resolution newspaper scan to the edition</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {uploadedPage ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-100">Page {uploadedPage.pageNumber} is Ready!</h4>
              <p className="text-xs text-slate-400">
                &ldquo;{uploadedPage.pageTitle}&rdquo; ({uploadedPage.widthPx} &times; {uploadedPage.heightPx} px) was added to the publication.
              </p>
            </div>

            {uploadedPage.imageUrl && (
              <div className="relative aspect-[1/1.3] max-w-[200px] mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-lg bg-slate-950">
                <img
                  src={uploadedPage.imageUrl}
                  alt={uploadedPage.pageTitle}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/admin/map/${uploadedPage.id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <Crosshair className="w-4 h-4 stroke-[2.5]" />
                <span>Start Hotspot Mapping Now</span>
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close &amp; View Pages
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mode Selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'upload' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File from PC
              </button>
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'url' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Paste Image / SVG URL
              </button>
            </div>

            {/* Dropzone / File Picker */}
            {mode === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    previewUrl
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-950/80'
                  }`}
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="relative aspect-[1/1.3] max-w-[140px] mx-auto rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-900">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                      </div>
                      <p className="text-xs font-semibold text-amber-300">
                        {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                      <p className="text-[11px] text-slate-400">Click to choose a different image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click or drag &amp; drop high-res newspaper scan
                      </p>
                      <p className="text-[11px] text-slate-500">Supports JPG, PNG, WebP, SVG scans</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL / SVG Path *</label>
                <input
                  type="text"
                  placeholder="e.g. /sample-epaper/page_1.svg or https://..."
                  value={customUrl}
                  onChange={handleCustomUrlChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Page Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Page Number *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Page Title / Section *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. প্রথম পাতা, খেলাধুলা"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Width (Px)</label>
                <input
                  type="number"
                  value={widthPx}
                  onChange={(e) => setWidthPx(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Height (Px)</label>
                <input
                  type="number"
                  value={heightPx}
                  onChange={(e) => setHeightPx(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Scan...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload &amp; Save Page</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
