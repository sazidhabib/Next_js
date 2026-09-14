'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Layers,
  Edit3,
  Plus,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Crosshair,
  FileText,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Upload,
} from 'lucide-react';
import PageUploadModal from '@/components/admin/PageUploadModal';

export default function AdminDashboard() {
  const [edition, setEdition] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const edRes = await fetch('/api/editions/1').then(r => r.json());
      const artData = await fetch('/api/articles').then(r => r.json());

      if (edRes.success) {
        setEdition(edRes.data);
      }
      if (artData.success) {
        setArticles(artData.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalPages = edition?.pages?.length || 0;
  const totalHotspots = edition?.pages?.reduce((acc, p) => acc + (p.hotspots?.length || 0), 0) || 0;
  const totalArticles = articles.length || edition?.articles?.length || 0;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-rose-500/10 border border-amber-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>E-Paper Publishing Studio 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Newspaper Editorial Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Manage print editions, high-resolution newspaper scans, interactive article bounding hotspots, and audio narration from one unified command center.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/editions"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Manage Editions</span>
            </Link>
            <Link
              href="/admin/map/1"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>Open Hotspot Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Edition</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{edition?.title ? '1 Edition' : '0'}</div>
            <p className="text-xs text-slate-400 mt-1 truncate">{edition?.title || 'No active edition'}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scans</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{totalPages} Pages</div>
            <p className="text-xs text-slate-400 mt-1">High-Res Layout Scans</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mapped Hotspots</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{totalHotspots} Zones</div>
            <p className="text-xs text-slate-400 mt-1">Clickable Article Boxes</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Newsroom Articles</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-100">{totalArticles} Stories</div>
            <p className="text-xs text-slate-400 mt-1">Full Unicode Content</p>
          </div>
        </div>
      </div>

      {/* Pages & Hotspot Mapping Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Edition Page Layouts &amp; Visual Studio</h2>
            <p className="text-xs text-slate-400">Select any page scan to draw bounding hotspots and link articles.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Scan</span>
            </button>
            <Link
              href="/admin/editions"
              className="text-xs font-semibold text-slate-400 hover:text-amber-300 flex items-center space-x-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <span>All Editions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading pages...</div>
          ) : (
            edition?.pages?.map((page) => (
              <div
                key={page.id}
                className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all p-3 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div>
                  <div className="relative aspect-[1/1.45] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 mb-3 group-hover:scale-[1.01] transition-transform">
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
                      <span>{page.hotspots?.length || 0} hotspots</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-200 truncate">{page.pageTitle}</h3>
                    <p className="text-[11px] text-slate-400">
                      {page.widthPx} &times; {page.heightPx} px
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/admin/map/${page.id}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold transition-all border border-amber-500/30"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Map Hotspots</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Link
          href="/admin/articles"
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start space-x-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
              Article Newsroom CMS
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Create and edit full article body, assign categories, authors, and preview TTS narration.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start space-x-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
              Sections &amp; Categories
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Organize Lead News, Politics, Sports, Business, Editorial, and regional sections.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start space-x-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              Publication Settings &amp; Tools
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure publication branding, social clippings watermark, and database controls.
            </p>
          </div>
        </Link>
      </div>

      {/* Page Upload Modal */}
      <PageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        editionId={edition?.id || 1}
        nextPageNumber={totalPages + 1}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
