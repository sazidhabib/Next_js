'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, X, Check, Copy } from 'lucide-react';

export default function ClippingModal({ clipBounds, page, edition, onClose }) {
  const canvasRef = useRef(null);
  const [exportedImageUrl, setExportedImageUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!clipBounds || !page) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = page.imageUrl;

    img.onload = () => {
      // Calculate pixel bounds on original image
      const sourceX = (clipBounds.x / 100) * img.naturalWidth;
      const sourceY = (clipBounds.y / 100) * img.naturalHeight;
      const sourceW = (clipBounds.width / 100) * img.naturalWidth;
      const sourceH = (clipBounds.height / 100) * img.naturalHeight;

      // Canvas dimensions: banner (80px) + cropped image + footer (40px)
      const bannerHeight = 80;
      const footerHeight = 40;
      const padding = 20;

      canvas.width = sourceW + padding * 2;
      canvas.height = sourceH + bannerHeight + footerHeight + padding * 2;

      // Background Paper Color
      ctx.fillStyle = '#fbfaf5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Masthead Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, bannerHeight);

      // Masthead Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(edition?.title || 'THE DAILY CHRONICLE', canvas.width / 2, 38);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`DIGITAL E-PAPER CLIP • ${edition?.publishDate || '2026-09-06'} • ${page?.pageTitle || 'Page 1'}`, canvas.width / 2, 60);

      // Draw Cropped Image Content
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        padding,
        bannerHeight + padding,
        sourceW,
        sourceH
      );

      // Draw Frame Border around image
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, bannerHeight + padding, sourceW, sourceH);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Clipped via Chronicle Interactive E-Paper Reader', canvas.width / 2, canvas.height - 15);

      const dataUrl = canvas.toDataURL('image/png');
      setExportedImageUrl(dataUrl);
    };
  }, [clipBounds, page, edition]);

  const handleDownload = () => {
    if (!exportedImageUrl) return;
    const link = document.createElement('a');
    link.download = `chronicle-clip-${Date.now()}.png`;
    link.href = exportedImageUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }
      });
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-slate-200">
              Newspaper Article Clip Ready
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Canvas for Generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Clip Preview */}
        <div className="my-6 max-h-[60vh] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-2 shadow-inner">
          {exportedImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exportedImageUrl}
              alt="Clipped snippet"
              className="max-w-full h-auto rounded shadow"
            />
          ) : (
            <div className="p-12 text-sm text-slate-400 animate-pulse">
              Generating high-resolution clip...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={!exportedImageUrl}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-rose-900/30 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Clip</span>
          </button>

          <button
            onClick={handleCopyImage}
            disabled={!exportedImageUrl}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
