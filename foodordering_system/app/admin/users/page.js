'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  Check,
  UserCheck,
  ChefHat,
  Key,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 'u-1',
      name: 'Alexander Rossi',
      email: 'admin@foodplatform.com',
      phone: '+1 (555) 010-9999',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
    {
      id: 'u-2',
      name: 'Chef Marco Bellini',
      email: 'owner@bellavista.com',
      phone: '+1 (555) 012-3456',
      role: 'RESTAURANT_ADMIN',
      status: 'ACTIVE',
    },
    {
      id: 'u-3',
      name: 'Sofia Kitchen Manager',
      email: 'staff@bellavista.com',
      phone: '+1 (555) 014-7890',
      role: 'STAFF_OPERATOR',
      status: 'ACTIVE',
    },
    {
      id: 'u-4',
      name: 'Emma Watson',
      email: 'customer@example.com',
      phone: '+1 (555) 019-8765',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('STAFF_OPERATOR');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      role: newRole,
      status: 'ACTIVE',
    };

    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleRoleChange = (userId, targetRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Staff & RBAC Permission Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign multi-tenant roles across Super Admin, Restaurant Owners, and Kitchen Staff.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Assigned Role (RBAC)</th>
                <th className="p-3.5">Permissions</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white text-sm">{u.name}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {u.id}
                    </span>
                  </td>
                  <td className="p-3.5 space-y-0.5">
                    <p className="text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{u.email}</span>
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{u.phone}</span>
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'RESTAURANT_ADMIN'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : u.role === 'STAFF_OPERATOR'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-400 font-medium">
                    {u.role === 'SUPER_ADMIN'
                      ? 'Full Platform & Global DB Control'
                      : u.role === 'RESTAURANT_ADMIN'
                      ? 'Menu, Zones, Invoices, Hours, Staff'
                      : u.role === 'STAFF_OPERATOR'
                      ? 'Order Receiver & Ticket Printing'
                      : 'Storefront Browsing & Ordering'}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="RESTAURANT_ADMIN">RESTAURANT_ADMIN</option>
                      <option value="STAFF_OPERATOR">STAFF_OPERATOR</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-white">
              Add New Staff Account
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Staff Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Leo Kitchen Dispatcher"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff@bellavista.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 012-7777"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Role & Permission</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="STAFF_OPERATOR">STAFF_OPERATOR (Order Receiver)</option>
                  <option value="RESTAURANT_ADMIN">RESTAURANT_ADMIN (Full Manager)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Platform Master)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl font-bold shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
