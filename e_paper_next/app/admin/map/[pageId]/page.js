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
      setLoading(true);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Studio Header */}
      <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-200">
              {targetPage?.pageTitle || `Page ${pageId}`}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
              Page {targetPage?.pageNumber || 1}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {statusMsg && (
            <span className="text-xs text-emerald-400 font-medium animate-pulse">
              ✓ {statusMsg}
            </span>
          )}
          <Link
            href="/"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test Reader View</span>
          </Link>
        </div>
      </header>

      {/* Mapping Canvas Workspace */}
      <main className="flex-1 overflow-hidden">
        {loading || !targetPage ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading Page Scan Workspace...</div>
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
      </main>
    </div>
  );
}
