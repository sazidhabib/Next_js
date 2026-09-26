'use client';

import React, { useState } from 'react';
import { FileBadge, Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { Card, Modal, Badge } from '../ui';

export default function VisaTypeManagement({ visaTypes, onUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Work Visa',
    requiresSponsorship: false,
    maxWeeklyHours: 40,
    description: '',
  });

  const openAdd = () => {
    setEditingVisa(null);
    setForm({
      name: '',
      code: '',
      category: 'Work Visa',
      requiresSponsorship: false,
      maxWeeklyHours: 40,
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setEditingVisa(v);
    setForm({
      name: v.name,
      code: v.code || '',
      category: v.category || 'Work Visa',
      requiresSponsorship: Boolean(v.requiresSponsorship),
      maxWeeklyHours: v.maxWeeklyHours || 40,
      description: v.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingVisa ? `/api/visatypes/${editingVisa.id}` : '/api/visatypes';
      const method = editingVisa ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        if (onUpdated) onUpdated();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete Visa Category?')) return;
    try {
      const res = await fetch(`/api/visatypes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <FileBadge className="w-5 h-5 text-indigo-600" />
            <span>Visa Categories & Types</span>
          </h3>
          <p className="text-xs text-zinc-500">Define Home Office visa categories, hour limits, and sponsorship flags</p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Visa Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {visaTypes?.map((v) => (
          <Card key={v.id} className="relative group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {v.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">{v.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{v.description || 'UK Visa track'}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => openEdit(v)} className="p-1.5 text-zinc-400 hover:text-indigo-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(v.id)} className="p-1.5 text-zinc-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Max {v.maxWeeklyHours || 40} hrs/wk</span>
              {v.requiresSponsorship ? (
                <Badge variant="purple">Requires CoS</Badge>
              ) : (
                <Badge variant="default">Unsponsored</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVisa ? 'Edit Visa Category' : 'Create Visa Category'}>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Visa Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Skilled Worker Visa"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                placeholder="Work / Study / Family"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Max Weekly Hours</label>
              <input
                type="number"
                value={form.maxWeeklyHours}
                onChange={(e) => setForm({ ...form, maxWeeklyHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="reqSponsor"
              checked={form.requiresSponsorship}
              onChange={(e) => setForm({ ...form, requiresSponsorship: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
            />
            <label htmlFor="reqSponsor" className="font-semibold text-zinc-800 dark:text-zinc-200">
              Requires Certificate of Sponsorship (CoS)
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
              Save Visa Type
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
