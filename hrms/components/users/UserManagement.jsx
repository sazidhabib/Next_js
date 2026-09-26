'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2, Key, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, Modal, Badge } from '../ui';

export default function UserManagement({ employees, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', employeeId: '', isActive: true });

  const fetchUsers = async () => {
    try {
      const [uRes, rRes] = await Promise.all([fetch('/api/users'), fetch('/api/roles')]);
      const uData = await uRes.json();
      const rData = await rRes.json();
      if (uData.success) setUsers(uData.users);
      if (rData.success) setRoles(rData.roles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      roleId: roles?.[0]?.id || '',
      employeeId: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchUsers();
        if (onUpdated) onUpdated();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete user account?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
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
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>System Users & Logins</span>
          </h3>
          <p className="text-xs text-zinc-500">Manage portal access credentials for administrators and staff</p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create User</span>
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-3">User</th>
                <th className="px-3 sm:px-4 py-3">Email</th>
                <th className="px-3 sm:px-4 py-3">Assigned Role</th>
                <th className="px-3 sm:px-4 py-3">Linked Employee</th>
                <th className="px-3 sm:px-4 py-3">Status</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-3 sm:px-4 py-3 font-bold text-xs">{u.name}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-zinc-500">{u.email}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {u.role?.name || 'Standard'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs">
                    {u.employee ? `${u.employee.firstName} ${u.employee.lastName}` : '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right">
                    <button onClick={() => handleDelete(u.id)} className="p-1 text-zinc-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create User Account">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Role *</label>
              <select
                required
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Linked Employee</label>
              <select
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="">None (Admin)</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
