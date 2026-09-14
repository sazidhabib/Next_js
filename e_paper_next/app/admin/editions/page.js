'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink,
  Crosshair,
  X,
  AlertCircle,
} from 'lucide-react';

export default function EditionsManager() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    publishDate: new Date().toISOString().split('T')[0],
    editionType: 'National',
    language: 'bn',
    status: 'published',
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchEditions = async () => {
    try {
      const res = await fetch('/api/editions');
      const data = await res.json();
      if (data.success) {
        setEditions(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const handleCreateEdition = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Edition created successfully!' });
        setShowModal(false);
        setFormData({
          title: '',
          publishDate: new Date().toISOString().split('T')[0],
          editionType: 'National',
          language: 'bn',
          status: 'published',
        });
        await fetchEditions();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create edition' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Error saving edition' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDeleteEdition = async (id) => {
    if (!confirm('Are you sure you want to delete this edition?')) return;
    try {
      const res = await fetch(`/api/editions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Edition deleted' });
        await fetchEditions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-amber-400" />
            <span>Editions &amp; Print Issues</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule, publish, and manage daily newspaper editions and regional supplements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Edition</span>
        </button>
      </div>

      {/* Alert Banner */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Editions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading editions...</div>
        ) : editions.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No editions found</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Create your first edition
            </button>
          </div>
        ) : (
          editions.map((ed) => (
            <div
              key={ed.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                    {ed.editionType || 'National'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1 ${
                      ed.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {ed.status === 'published' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span className="capitalize">{ed.status || 'Published'}</span>
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ed.publishDate}</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">{ed.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Language: <span className="text-slate-300 uppercase font-semibold">{ed.language || 'bn'}</span> &bull; Total Pages: <span className="text-amber-300 font-semibold">{ed.pages?.length || 5}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/admin/editions/${ed.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Manage Pages</span>
                </Link>

                <Link
                  href={`/admin/map/1`}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/30 transition-all flex items-center space-x-1.5"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Hotspot Studio</span>
                </Link>

                <Link
                  href={`/`}
                  target="_blank"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
                  title="Preview in Reader"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDeleteEdition(ed.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors"
                  title="Delete edition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-amber-400" />
                <span>Create New Newspaper Edition</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEdition} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Edition Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. আজকের পত্রিকা - ঢাকা সিটি"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publish Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Edition Type</label>
                  <select
                    value={formData.editionType}
                    onChange={(e) => setFormData({ ...formData, editionType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="National">National (জাতীয়)</option>
                    <option value="Dhaka City">Dhaka City (ঢাকা সিটি)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Supplement">Weekend Supplement (সাপ্তাহিক)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="bn">Bengali (বাংলা)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Create Edition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
