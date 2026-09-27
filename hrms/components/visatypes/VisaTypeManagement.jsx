'use client';

import React, { useState, useEffect } from 'react';
import { FileBadge, Plus, Edit, Trash2, Search, ShieldCheck } from 'lucide-react';
import { Card, Modal, Badge } from '../ui';

export default function VisaTypeManagement({ visaTypes = [], onUpdated }) {
  const [list, setList] = useState(visaTypes);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState(null);
  const [search, setSearch] = useState('');

  const initialForm = {
    name: '',
    requiresSponsorship: false,
    notes: '',
  };

  const [form, setForm] = useState(initialForm);

  const fetchVisaTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visatypes');
      const data = await res.json();
      if (data.success) {
        setList(data.visaTypes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visaTypes && visaTypes.length > 0) {
      setList(visaTypes);
    } else {
      fetchVisaTypes();
    }
  }, [visaTypes]);

  const openAdd = () => {
    setEditingVisa(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setEditingVisa(v);
    setForm({
      name: v.name || '',
      requiresSponsorship: Boolean(v.requiresSponsorship),
      notes: v.notes || v.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a Visa Name');
      return;
    }

    try {
      const url = editingVisa ? `/api/visatypes/${editingVisa.id}` : '/api/visatypes';
      const method = editingVisa ? 'PUT' : 'POST';

      const payload = {
        name: form.name.trim(),
        requiresSponsorship: form.requiresSponsorship,
        notes: form.notes,
        description: form.notes,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchVisaTypes();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete Visa Type "${name}"?`)) return;
    try {
      const res = await fetch(`/api/visatypes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchVisaTypes();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = list.filter((v) => {
    const term = search.toLowerCase();
    return (
      (v.name && v.name.toLowerCase().includes(term)) ||
      (v.notes && v.notes.toLowerCase().includes(term)) ||
      (v.description && v.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <FileBadge className="w-5 h-5 text-indigo-600" />
            <span>VISA Types</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure Home Office visa categories, Certificate of Sponsorship requirement flags, and notes
          </p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Visa Type</span>
        </button>
      </div>

      {/* Main Table Card */}
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search visa types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-zinc-500">{filtered.length} Visa Types</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">Visa Type ID</th>
                <th className="px-3 sm:px-4 py-3">Visa Name</th>
                <th className="px-3 sm:px-4 py-3">Requires Sponsor</th>
                <th className="px-3 sm:px-4 py-3">Notes</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                    {loading ? 'Loading visa types...' : 'No visa types found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                    <td className="px-3 sm:px-4 py-3 font-mono text-xs text-zinc-500">#{v.id}</td>

                    <td className="px-3 sm:px-4 py-3 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      {v.name}
                    </td>

                    <td className="px-3 sm:px-4 py-3">
                      {v.requiresSponsorship ? (
                        <Badge variant="purple">Requires Sponsor</Badge>
                      ) : (
                        <Badge variant="default">No Sponsor</Badge>
                      )}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs text-zinc-500 max-w-[240px] truncate">
                      {v.notes || v.description || '-'}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => openEdit(v)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                        title="Edit Visa Type"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id, v.name)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete Visa Type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVisa ? 'Edit Visa Type' : 'Add Visa Type'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Visa Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Skilled Worker"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="modalReqSponsor"
              checked={form.requiresSponsorship}
              onChange={(e) => setForm({ ...form, requiresSponsorship: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
            />
            <label
              htmlFor="modalReqSponsor"
              className="font-semibold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer"
            >
              Requires Sponsor
            </label>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Notes:
            </label>
            <textarea
              rows={4}
              placeholder="Enter visa notes, conditions, or sponsorship requirements..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition"
            >
              {editingVisa ? 'Update Visa Type' : 'Save Visa Type'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
