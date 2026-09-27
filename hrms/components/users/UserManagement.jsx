'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Key, Search, ShieldCheck } from 'lucide-react';
import { Card, Modal, Badge } from '../ui';

export default function UserManagement({ employees = [], onUpdated }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');

  const initialForm = {
    username: '',
    name: '',
    roleId: '',
    isActive: true,
    password: '',
    employeeId: '',
  };

  const [form, setForm] = useState(initialForm);

  const fetchUsersAndRoles = async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([fetch('/api/users'), fetch('/api/roles')]);
      const uData = await uRes.json();
      const rData = await rRes.json();
      if (uData.success) setUsers(uData.users);
      if (rData.success) setRoles(rData.roles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const openAdd = () => {
    setEditingUser(null);
    setForm({
      username: '',
      name: '',
      roleId: roles?.[0]?.id || '',
      isActive: true,
      password: '',
      employeeId: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      username: u.username || u.name.toLowerCase().replace(/\s+/g, ''),
      name: u.name || '',
      roleId: u.roleId || u.role?.id || '',
      isActive: Boolean(u.isActive),
      password: '',
      employeeId: u.employeeId || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.name.trim()) {
      alert('Please fill in both User Name and Full Name');
      return;
    }
    if (!editingUser && !form.password) {
      alert('Password is required for a new user');
      return;
    }

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const payload = {
        username: form.username.trim(),
        name: form.name.trim(),
        roleId: form.roleId || null,
        isActive: form.isActive,
        employeeId: form.employeeId || null,
      };
      if (form.password) {
        payload.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchUsersAndRoles();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleResetPassword = async (u) => {
    const newPass = prompt(`Enter new password for ${u.name}:`);
    if (!newPass) return;

    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Password reset successfully');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete user account "${name}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchUsersAndRoles();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const uname = (u.username || '').toLowerCase();
    const fname = (u.name || '').toLowerCase();
    const rname = (u.role?.name || '').toLowerCase();
    return uname.includes(term) || fname.includes(term) || rname.includes(term);
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Users & Access Management</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage system users, assigned roles, credentials and account active status
          </p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Main Table Card */}
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, full name, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-zinc-500">{filtered.length} Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">User ID</th>
                <th className="px-3 sm:px-4 py-3">Username</th>
                <th className="px-3 sm:px-4 py-3">Full Name</th>
                <th className="px-3 sm:px-4 py-3">Role</th>
                <th className="px-3 sm:px-4 py-3 text-center">Active</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-500 text-xs">
                    {loading ? 'Loading users...' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                    <td className="px-3 sm:px-4 py-3 font-mono text-xs text-zinc-500">#{u.id}</td>

                    <td className="px-3 sm:px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                      {u.username || u.name}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-zinc-800 dark:text-zinc-200 font-medium">
                      {u.name}
                    </td>

                    <td className="px-3 sm:px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                        {u.role?.name || 'Manager'}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-center">
                      <Badge variant={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                        title="Update Info"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(u)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                        title="Reset Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete User"
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
        title={editingUser ? 'Update User Information' : 'Add New User'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* User Name */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              User Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bishnu"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bishnu Hari"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Role *
            </label>
            <select
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="modalUserActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
            />
            <label
              htmlFor="modalUserActive"
              className="font-semibold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer"
            >
              Active
            </label>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Password (New User / Reset Only)
            </label>
            <input
              type="password"
              placeholder={editingUser ? 'Leave blank to keep unchanged' : 'Enter password...'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-zinc-400 mt-1 italic">
              Leave blank when updating Full Name / Role / active status only.
            </p>
          </div>

          {/* Modal Actions */}
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition"
            >
              {editingUser ? 'Update Info' : 'Add New'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
