'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Layers, Edit3, Plus, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seedMsg, setSeedMsg] = useState(null);

  const fetchEditionData = async () => {
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
    fetchEditionData();
  }, []);

  const handleResetSeed = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedMsg(data.message || 'Database reset successfully');
      fetchEditionData();
      setTimeout(() => setSeedMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public E-Paper Reader</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-rose-300 to-amber-100 bg-clip-text text-transparent">
              E-Paper Publishing &amp; Hotspot Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage newspaper editions, page scans, and visual clickable article hotspots.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetSeed}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>

        {seedMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-xs font-medium text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{seedMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading Edition Data...</div>
        ) : (
          <div className="space-y-6">
            {/* Active Edition Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {edition?.status?.toUpperCase() || 'PUBLISHED'}
                  </span>
                  <h2 className="text-xl font-bold text-slate-100">{edition?.title}</h2>
                  <p className="text-xs text-slate-400">
                    Publish Date: <span className="text-slate-200">{edition?.publishDate}</span> • Type: {edition?.editionType} • Language: {edition?.language}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="block text-lg font-extrabold text-amber-400">{edition?.pages?.length || 0}</span>
                    <span className="text-slate-400 text-[10px] uppercase">Pages</span>
                  </div>
                  <div className="text-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="block text-lg font-extrabold text-rose-400">{edition?.articles?.length || 0}</span>
                    <span className="text-slate-400 text-[10px] uppercase">Articles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pages & Hotspot Mapping Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Page Layouts &amp; Hotspot Mapping</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {edition?.pages?.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Thumbnail Preview */}
                      <div className="w-20 h-28 bg-slate-950 rounded border border-slate-800 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.thumbUrl || p.imageUrl}
                          alt={p.pageTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">Page {p.pageNumber}</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {p.hotspots?.length || 0} Hotspots
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100">{p.pageTitle}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          Resolution: {p.widthPx} × {p.heightPx} px
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <Link
                        href={`/admin/map/${p.id}`}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Launch Visual Hotspot Mapper</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
