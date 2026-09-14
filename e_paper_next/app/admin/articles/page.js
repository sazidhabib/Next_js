'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Crosshair,
  User,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  Volume2,
} from 'lucide-react';

export default function ArticleNewsroom() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subHeadline: '',
    category: 'Lead News',
    author: 'নিজস্ব প্রতিবেদক',
    content: '',
    editionId: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      subHeadline: '',
      category: 'Lead News',
      author: 'নিজস্ব প্রতিবেদক',
      content: '',
      editionId: 1,
    });
    setShowModal(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      id: article.id,
      title: article.title || '',
      subHeadline: article.subHeadline || '',
      category: article.category || 'Lead News',
      author: article.author || 'নিজস্ব প্রতিবেদক',
      content: article.content || '',
      editionId: article.editionId || 1,
    });
    setShowModal(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const url = editingArticle ? `/api/articles/${editingArticle.id}` : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Article ${editingArticle ? 'updated' : 'created'} successfully!` });
        setShowModal(false);
        await fetchArticles();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save article' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Error occurred while saving article' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Article deleted successfully' });
        await fetchArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const categories = ['All', ...new Set(articles.map((a) => a.category).filter(Boolean))];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-400" />
            <span>Article Newsroom CMS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish unicode news stories, set authors, categories, and manage hotspot connections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Write New Article</span>
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

      {/* Filters & Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search headline, reporter, or story text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No articles match your search</p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-bold">
                    {art.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{art.author || 'Desk Report'}</span>
                  </span>
                  {art.hotspots && art.hotspots.length > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold flex items-center space-x-1">
                      <Crosshair className="w-3 h-3" />
                      <span>{art.hotspots.length} Linked Hotspot(s)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                      Unmapped
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-100 line-clamp-1">{art.title}</h2>
                {art.subHeadline && (
                  <p className="text-xs text-amber-300/80 line-clamp-1">{art.subHeadline}</p>
                )}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{art.content}</p>
              </div>

              <div className="flex items-center space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  onClick={() => openEditModal(art)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Story</span>
                </button>
                <button
                  onClick={() => handleDeleteArticle(art.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Article Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 custom-scrollbar">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>{editingArticle ? 'Edit Article Story' : 'Write New Article'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. প্রধানমন্ত্রীর সাথে বিদেশি প্রতিনিধির বৈঠক"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sub-Headline (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. দ্বিপক্ষীয় বাণিজ্য ও বিনিয়োগ সম্প্রসারণে আলোচনা"
                  value={formData.subHeadline}
                  onChange={(e) => setFormData({ ...formData, subHeadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lead News">Lead News (প্রধান সংবাদ)</option>
                    <option value="National">National (জাতীয়)</option>
                    <option value="Politics">Politics (রাজনীতি)</option>
                    <option value="Business">Business (বাণিজ্য)</option>
                    <option value="Sports">Sports (খেলাধুলা)</option>
                    <option value="International">International (আন্তর্জাতিক)</option>
                    <option value="Editorial">Editorial (সম্পাদকীয়)</option>
                    <option value="Tech">Tech &amp; Innovation (তথ্যপ্রযুক্তি)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author / Byline</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article Body *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write or paste full article body in Unicode Bengali or English..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
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
                  {submitting ? 'Saving...' : editingArticle ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
