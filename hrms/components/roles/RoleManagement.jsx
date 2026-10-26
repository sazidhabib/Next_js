'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Key,
  CheckCircle2,
  Check,
  Eye,
  Edit3,
  Trash,
  UserCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card, Modal, Badge } from '../ui';
import { useAuth } from '@/context/AuthContext';
import {
  PERMISSION_SECTIONS,
  WORKFLOW_PERMISSIONS,
  expandPermissions,
  STANDARD_ROLE_PRESETS,
} from '@/lib/auth/permissions';

const parsePermissions = (perms) => {
  if (Array.isArray(perms)) return expandPermissions(perms);
  if (typeof perms === 'string') {
    try {
      const parsed = JSON.parse(perms);
      if (Array.isArray(parsed)) return expandPermissions(parsed);
      return expandPermissions([perms]);
    } catch {
      return expandPermissions(perms.split(',').map((p) => p.trim()).filter(Boolean));
    }
  }
  return [];
};

export default function RoleManagement({ onUpdated }) {
  const { canEdit, canDelete } = useAuth();
  const canEditRoles = canEdit('roles');
  const canDeleteRoles = canDelete('roles');

  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [saving, setSaving] = useState(false);

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
    setForm({
      name: '',
      description: '',
      permissions: ['VIEW_DASHBOARD'],
    });
    setIsModalOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setForm({
      name: role.name || '',
      description: role.description || '',
      permissions: parsePermissions(role.permissions),
    });
    setIsModalOpen(true);
  };

  // Toggle "ALL" permission
  const toggleAll = () => {
    setForm((prev) => {
      const current = Array.isArray(prev.permissions) ? prev.permissions : [];
      if (current.includes('ALL')) {
        return { ...prev, permissions: ['VIEW_DASHBOARD'] };
      }
      return { ...prev, permissions: ['ALL'] };
    });
  };

  // Toggle a single permission with View/Edit/Delete dependencies
  const togglePermission = (permCode, section = null, action = null) => {
    setForm((prev) => {
      const current = Array.isArray(prev.permissions) ? prev.permissions.filter((p) => p !== 'ALL') : [];
      const hasPerm = current.includes(permCode);

      let nextPerms = hasPerm
        ? current.filter((p) => p !== permCode)
        : [...current, permCode];

      // Dependency Rule:
      // If toggling on EDIT or DELETE, auto-enable VIEW for that section
      if (section && !hasPerm) {
        if (action === 'EDIT' || action === 'DELETE') {
          if (section.viewPerm && !nextPerms.includes(section.viewPerm)) {
            nextPerms.push(section.viewPerm);
          }
        }
      }

      // If unticking VIEW, auto-untick EDIT and DELETE for that section
      if (section && hasPerm && action === 'VIEW') {
        const toRemove = [];
        if (section.editPerm) toRemove.push(section.editPerm);
        if (section.deletePerm) toRemove.push(section.deletePerm);
        nextPerms = nextPerms.filter((p) => !toRemove.includes(p));
      }

      return { ...prev, permissions: nextPerms };
    });
  };

  // Toggle all permissions for an entire section
  const toggleSectionAll = (section) => {
    setForm((prev) => {
      const current = Array.isArray(prev.permissions) ? prev.permissions.filter((p) => p !== 'ALL') : [];
      const sectionPerms = [section.viewPerm, section.editPerm, section.deletePerm].filter(Boolean);
      const allChecked = sectionPerms.every((p) => current.includes(p));

      let nextPerms;
      if (allChecked) {
        // Remove all section perms
        nextPerms = current.filter((p) => !sectionPerms.includes(p));
      } else {
        // Add all section perms
        const set = new Set([...current, ...sectionPerms]);
        nextPerms = Array.from(set);
      }

      return { ...prev, permissions: nextPerms };
    });
  };

  // Apply a standard preset
  const applyPreset = (presetKey) => {
    const preset = STANDARD_ROLE_PRESETS[presetKey];
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || preset.name,
      description: prev.description || preset.description,
      permissions: [...preset.permissions],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
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
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete role "${name}"?`)) return;
    try {
      const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRoles();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const isAllSelected = Array.isArray(form.permissions) && form.permissions.includes('ALL');

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span>Roles & Permissions (RBAC)</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Configure granular section privileges (View, Edit, Delete) and employee workflows
          </p>
        </div>
        {canEditRoles && (
          <button
            onClick={openAdd}
            className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role</span>
          </button>
        )}
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => {
          const perms = parsePermissions(r.permissions);
          const isFullAdmin = perms.includes('ALL');

          return (
            <Card key={r.id} className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      {isFullAdmin && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          Full Admin
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">{r.description || 'Custom access role'}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {canEditRoles && (
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 text-zinc-400 hover:text-amber-600 transition"
                        title="Edit Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDeleteRoles && r.name !== 'Admin' && r.name !== 'Super Admin' && (
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 transition"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions Breakdown */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  {isFullAdmin ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center space-x-2">
                      <Key className="w-4 h-4 shrink-0" />
                      <span>Unrestricted System & Section Access (ALL)</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {PERMISSION_SECTIONS.map((sec) => {
                        const hasV = perms.includes(sec.viewPerm);
                        const hasE = sec.editPerm && perms.includes(sec.editPerm);
                        const hasD = sec.deletePerm && perms.includes(sec.deletePerm);
                        if (!hasV && !hasE && !hasD) return null;

                        const actions = [];
                        if (hasV) actions.push('View');
                        if (hasE) actions.push('Edit');
                        if (hasD) actions.push('Delete');

                        return (
                          <div
                            key={sec.id}
                            className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                          >
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{sec.label}</span>
                            <div className="flex gap-1">
                              {actions.map((act) => (
                                <span
                                  key={act}
                                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                    act === 'View'
                                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                      : act === 'Edit'
                                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                  }`}
                                >
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Workflows */}
                      {WORKFLOW_PERMISSIONS.some((w) => perms.includes(w.code)) && (
                        <div className="pt-1.5 flex flex-wrap gap-1">
                          {WORKFLOW_PERMISSIONS.filter((w) => perms.includes(w.code)).map((w) => (
                            <span
                              key={w.code}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                            >
                              {w.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Preset Buttons for Quick Setup */}
          {!editingRole && (
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="block text-[11px] font-semibold text-zinc-500 mb-2">
                Quick Setup: Choose a Role Template
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('EMPLOYEE')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 font-semibold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 transition text-[11px]"
                >
                  Employee Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('MANAGER')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 font-semibold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 transition text-[11px]"
                >
                  Manager Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('HR_MANAGER')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 font-semibold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 transition text-[11px]"
                >
                  HR Manager Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('ADMIN')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 font-semibold text-zinc-700 dark:text-zinc-200 hover:border-amber-500 transition text-[11px]"
                >
                  Admin (All) Preset
                </button>
              </div>
            </div>
          )}

          {/* Name & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Role Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Finance Officer, Shift Supervisor"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief summary of duties and access permissions"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Super Admin / Master Switch */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">
                Full Unrestricted Operations (ALL)
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                Bypasses all section restrictions and grants full read/write/delete privileges across the entire application.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleAll}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Section Permissions Matrix */}
          {!isAllSelected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    Section Privileges Matrix
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Tick View, Edit, or Delete for each section. Selecting Edit or Delete automatically grants View.
                  </p>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="py-2.5 px-3">Section / Module</th>
                      <th className="py-2.5 px-3 text-center w-20">View</th>
                      <th className="py-2.5 px-3 text-center w-20">Edit</th>
                      <th className="py-2.5 px-3 text-center w-20">Delete</th>
                      <th className="py-2.5 px-3 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {PERMISSION_SECTIONS.map((sec) => {
                      const hasView = form.permissions.includes(sec.viewPerm);
                      const hasEdit = sec.editPerm && form.permissions.includes(sec.editPerm);
                      const hasDelete = sec.deletePerm && form.permissions.includes(sec.deletePerm);
                      const sectionPerms = [sec.viewPerm, sec.editPerm, sec.deletePerm].filter(Boolean);
                      const allChecked = sectionPerms.every((p) => form.permissions.includes(p));

                      return (
                        <tr
                          key={sec.id}
                          className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition text-[11px]"
                        >
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{sec.label}</span>
                            <span className="text-[10px] text-zinc-400 block">{sec.description}</span>
                          </td>

                          {/* View Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={hasView}
                                onChange={() => togglePermission(sec.viewPerm, sec, 'VIEW')}
                                className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Edit Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            {sec.editPerm ? (
                              <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                <input
                                  type="checkbox"
                                  checked={hasEdit}
                                  onChange={() => togglePermission(sec.editPerm, sec, 'EDIT')}
                                  className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500 cursor-pointer"
                                />
                              </label>
                            ) : (
                              <span className="text-zinc-300 dark:text-zinc-700">—</span>
                            )}
                          </td>

                          {/* Delete Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            {sec.deletePerm ? (
                              <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                <input
                                  type="checkbox"
                                  checked={hasDelete}
                                  onChange={() => togglePermission(sec.deletePerm, sec, 'DELETE')}
                                  className="w-4 h-4 text-rose-600 rounded border-zinc-300 focus:ring-rose-500 cursor-pointer"
                                />
                              </label>
                            ) : (
                              <span className="text-zinc-300 dark:text-zinc-700">—</span>
                            )}
                          </td>

                          {/* Toggle All for this row */}
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => toggleSectionAll(sec)}
                              className="text-[10px] font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
                            >
                              {allChecked ? 'Clear' : 'Select All'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Employee Self-Service & Workflow Card */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    Employee Self-Service & Management Workflows
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Special permissions that enable specific user workflows such as applying for leave or managing personal profiles.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                  {WORKFLOW_PERMISSIONS.map((wp) => {
                    const isChecked = form.permissions.includes(wp.code);
                    return (
                      <label
                        key={wp.code}
                        onClick={() => togglePermission(wp.code)}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500 pointer-events-none"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-[11px]">
                            {wp.label}
                          </span>
                          <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">
                            {wp.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-amber-600/20 transition flex items-center space-x-1.5"
            >
              {saving && <span className="animate-spin text-xs">●</span>}
              <span>{editingRole ? 'Update Role' : 'Create Role'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
