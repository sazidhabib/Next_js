'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Tag,
  FileText,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Lead News', bnName: 'প্রধান সংবাদ', color: 'rose', count: 1 },
  { id: 2, name: 'National', bnName: 'জাতীয় ও নগর', color: 'amber', count: 1 },
  { id: 3, name: 'Politics', bnName: 'রাজনীতি', color: 'orange', count: 1 },
  { id: 4, name: 'Business', bnName: 'বাণিজ্য ও অর্থনীতি', color: 'emerald', count: 1 },
  { id: 5, name: 'Sports', bnName: 'খেলাধুলা', color: 'sky', count: 1 },
  { id: 6, name: 'International', bnName: 'আন্তর্জাতিক', color: 'indigo', count: 1 },
  { id: 7, name: 'Editorial', bnName: 'সম্পাদকীয় ও মতামত', color: 'purple', count: 0 },
  { id: 8, name: 'Tech', bnName: 'তথ্যপ্রযুক্তি', color: 'teal', count: 0 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBn, setNewCatBn] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    const newCat = {
      id: Date.now(),
      name: newCatName,
      bnName: newCatBn || newCatName,
      color: 'amber',
      count: 0,
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatBn('');
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-sky-400" />
            <span>Sections &amp; Categories</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize newspaper beats, category tags, and editorial section designations.
          </p>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5">
        <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Publication Category</span>
        </h2>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Category Name (e.g. Entertainment)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Bengali Name (e.g. বিনোদন)"
            value={newCatBn}
            onChange={(e) => setNewCatBn(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            Add Section
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-between hover:border-slate-700 transition-all group"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">{cat.name}</h3>
              </div>
              <p className="text-xs text-slate-400">{cat.bnName}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
