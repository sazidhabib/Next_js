'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Layers } from 'lucide-react';
import HotspotMappingCanvas from '@/components/admin/HotspotMappingCanvas';

export default function PageHotspotMapper({ params }) {
  const unwrappedParams = use(params);
  const pageId = parseInt(unwrappedParams.pageId, 10);

  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/editions/1');
      const data = await res.json();
      if (data.success) {
        setEdition(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageId]);

  const targetPage = edition?.pages?.find((p) => p.id === pageId);
  const hotspots = targetPage?.hotspots || [];
  const articles = edition?.articles || [];

  const handleSaveHotspot = async (hotspotData) => {
    try {
      const res = await fetch('/api/hotspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotspotData),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Hotspot saved');
        setTimeout(() => setStatusMsg(null), 2000);
        await loadData();
        return data.data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleDeleteHotspot = async (hotspotId) => {
    try {
      const res = await fetch(`/api/hotspots/${hotspotId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('Hotspot removed');
        setTimeout(() => setStatusMsg(null), 2000);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateArticle = async (articleData) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        return data.data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Studio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-slate-100">
              {targetPage?.pageTitle || `Page ${pageId}`}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono border border-slate-700">
              Page {targetPage?.pageNumber || 1}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {statusMsg && (
            <span className="text-xs text-emerald-400 font-semibold animate-pulse">
              ✓ {statusMsg}
            </span>
          )}
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Reader View</span>
          </Link>
        </div>
      </div>

      {/* Mapping Canvas Workspace */}
      <div className="min-h-[750px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading || !targetPage ? (
          <div className="p-16 text-center text-sm text-slate-400">Loading Page Scan Workspace...</div>
        ) : (
          <HotspotMappingCanvas
            page={targetPage}
            articles={articles}
            hotspots={hotspots}
            onSaveHotspot={handleSaveHotspot}
            onDeleteHotspot={handleDeleteHotspot}
            onCreateArticle={handleCreateArticle}
          />
        )}
      </div>
    </div>
  );
}

