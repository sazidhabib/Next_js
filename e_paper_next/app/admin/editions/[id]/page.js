'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  Crosshair,
  Plus,
  Trash2,
  Move,
  Upload,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import PageUploadModal from '@/components/admin/PageUploadModal';

export default function EditionDetailPage({ params }) {
  const unwrappedParams = use(params);
  const editionId = unwrappedParams.id;

  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchEdition = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/editions/${editionId}`);
      const data = await res.json();
      if (data.success) {
        setEdition(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [editionId]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  const handleDeletePage = async (pageId) => {
    if (!confirm('Are you sure you want to remove this page scan?')) return;
    try {
      const res = await fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchEdition();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nextPageNumber = (edition?.pages?.length || 0) + 1;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/editions"
            className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Editions</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-400" />
            <span>{edition?.title || `Edition #${editionId}`}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Date: <span className="text-slate-300">{edition?.publishDate}</span> &bull; Type:{' '}
            <span className="text-amber-400">{edition?.editionType}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload New Page Scan</span>
          </button>

          <Link
            href={`/admin/map/1`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Crosshair className="w-4 h-4 text-amber-400" />
            <span>Hotspot Canvas</span>
          </Link>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-200">
            Page Layout Scans ({edition?.pages?.length || 0} Pages)
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading edition pages...</div>
        ) : edition?.pages?.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No page scans uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Upload First Page Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {edition?.pages?.map((page) => (
              <div
                key={page.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-3 flex flex-col justify-between group shadow-sm transition-all"
              >
                <div>
                  <div className="relative aspect-[1/1.45] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 mb-3">
                    <img
                      src={page.imageUrl}
                      alt={page.pageTitle}
                      className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-amber-300">
                      Page {page.pageNumber}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-semibold text-emerald-400 flex items-center space-x-1">
                      <Crosshair className="w-3 h-3" />
                      <span>{page.hotspots?.length || 0} mapped</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-200 truncate">{page.pageTitle}</h3>
                    <p className="text-[11px] text-slate-400">
                      Dimensions: {page.widthPx} &times; {page.heightPx}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2">
                  <Link
                    href={`/admin/map/${page.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold transition-all border border-amber-500/30"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Map Hotspots</span>
                  </Link>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors"
                    title="Remove page scan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Upload Modal */}
      <PageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        editionId={editionId}
        nextPageNumber={nextPageNumber}
        onSuccess={() => {
          fetchEdition();
        }}
      />
    </div>
  );
}
