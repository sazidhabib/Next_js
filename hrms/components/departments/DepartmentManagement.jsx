'use client';

import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Card, Modal } from '../ui';

export default function DepartmentManagement({ departments, onUpdated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const openAdd = () => {
    setEditingDept(null);
    setForm({ name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setForm({ name: dept.name, code: dept.code, description: dept.description || '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingDept ? `/api/departments/${editingDept.id}` : '/api/departments';
      const method = editingDept ? 'PUT' : 'POST';

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
    if (!confirm('Delete department?')) return;
    try {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
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
            <Building2 className="w-5 h-5 text-purple-600" />
            <span>Departments</span>
          </h3>
          <p className="text-xs text-zinc-500">Manage business departments and team divisions</p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {departments?.map((dept) => (
          <Card key={dept.id} className="relative group hover:border-purple-300 dark:hover:border-purple-800 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] sm:text-xs px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                  {dept.code}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">{dept.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{dept.description || 'No description'}</p>
              </div>
              <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                <button onClick={() => openEdit(dept)} className="p-1.5 text-zinc-500 hover:text-purple-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-zinc-500 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5" />
                <span>{dept.employees?.length || 0} Staff</span>
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Department Code *</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
            />
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
            <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
