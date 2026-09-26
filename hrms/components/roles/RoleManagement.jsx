'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Key } from 'lucide-react';
import { Card, Modal, Badge } from '../ui';

export default function RoleManagement({ onUpdated }) {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      if (data.success) setRoles(data.roles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAdd = () => {
    setEditingRole(null);
    setForm({ name: '', description: '', permissions: ['VIEW_DASHBOARD'] });
    setIsModalOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setForm({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingRole ? `/api/roles/${editingRole.id}` : '/api/roles';
      const method = editingRole ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchRoles();
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
            <Shield className="w-5 h-5 text-amber-600" />
            <span>Roles & Permissions (RBAC)</span>
          </h3>
          <p className="text-xs text-zinc-500">Configure role privileges and system access boundaries</p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {roles.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">{r.name}</h4>
                <p className="text-xs text-zinc-500 mt-1">{r.description || 'System access role'}</p>
              </div>
              <button onClick={() => openEdit(r)} className="p-1.5 text-zinc-400 hover:text-amber-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
              {(r.permissions || ['STANDARD']).map((perm, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {perm}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRole ? 'Edit Role' : 'Create Role'}>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Role Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700">
              Save Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
