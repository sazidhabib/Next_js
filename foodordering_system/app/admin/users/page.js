'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  Trash2,
  Edit2,
  AlertCircle,
  X,
  Building2,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('STAFF_OPERATOR');
  const [password, setPassword] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  // Fetch all users
  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers(json.data);
        } else {
          setError(json.error || 'Failed to fetch users');
        }
      }
    } catch (err) {
      setError('Connection error fetching users');
    }
  }

  // Fetch all restaurants for dropdown
  async function fetchRestaurants() {
    try {
      const res = await fetch('/api/admin/restaurants');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRestaurants(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching restaurants for dropdown:', err);
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchRestaurants()]);
      setLoading(false);
    }
    loadData();
  }, []);

  const showToast = (type, msg) => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleOpenAddModal = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('STAFF_OPERATOR');
    setPassword('');
    setRestaurantId(restaurants[0]?.id || '');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setPassword('');
    
    // Find existing restaurant role assignment
    const currentAssigned = user.restaurantRoles?.[0]?.restaurantId || '';
    setRestaurantId(currentAssigned || (restaurants[0]?.id || ''));
    
    setIsEditModalOpen(true);
  };

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    // Only assign restaurant if role is RESTAURANT_ADMIN or STAFF_OPERATOR
    const assignedRestoId = (role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') ? restaurantId : undefined;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone, restaurantId: assignedRestoId }),
      });
      const json = await res.json();

      if (json.success) {
        setIsAddModalOpen(false);
        showToast('success', `User "${name}" created successfully.`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to create user');
      }
    } catch (err) {
      showToast('error', 'Error creating user');
    }
  };

  // Edit User
  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !role || !currentUser) return;

    // Only assign restaurant if role is RESTAURANT_ADMIN or STAFF_OPERATOR
    const assignedRestoId = (role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') ? restaurantId : undefined;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          name,
          email,
          phone,
          role,
          password: password || undefined,
          restaurantId: assignedRestoId,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setIsEditModalOpen(false);
        showToast('success', `User details updated successfully.`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to update user');
      }
    } catch (err) {
      showToast('error', 'Error updating user');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.success) {
        showToast('success', `User "${userName}" deleted successfully.`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to delete user');
      }
    } catch (err) {
      showToast('error', 'Error deleting user');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Platform Users Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, and manage role permission levels and restaurant assignments across the platform.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Platform User</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2.5 text-xs font-bold text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-2.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading database users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Contact Detail</th>
                  <th className="p-3.5">Active Role</th>
                  <th className="p-3.5">Assigned Restaurant</th>
                  <th className="p-3.5">Scope & Permissions</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  const assignedResto = u.restaurantRoles?.[0]?.restaurant?.name || '—';
                  return (
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
                        {u.phone && (
                          <p className="text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{u.phone}</span>
                          </p>
                        )}
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
                      <td className="p-3.5">
                        {u.role === 'SUPER_ADMIN' ? (
                          <span className="text-purple-400 font-bold">Platform-Wide</span>
                        ) : assignedResto !== '—' ? (
                          <span className="text-slate-200 font-bold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-orange-500" />
                            {assignedResto}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
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
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 bg-slate-800/80 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create New Platform User</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo Kitchen Dispatcher"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@bellavista.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 012-7777"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Role & Permission Scope</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Platform Master)</option>
                  <option value="RESTAURANT_ADMIN">RESTAURANT_ADMIN (Store Owner)</option>
                  <option value="STAFF_OPERATOR">STAFF_OPERATOR (Kitchen staff)</option>
                  <option value="CUSTOMER">CUSTOMER (Standard User)</option>
                </select>
              </div>

              {/* Show restaurant selection dropdown if role requires it */}
              {(role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="font-bold text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>Assign to Restaurant</span>
                  </label>
                  <select
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                  >
                    {restaurants.map((resto) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.name} (/{resto.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Modify User Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo Kitchen Dispatcher"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@bellavista.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 012-7777"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">Password</label>
                  <span className="text-[10px] text-slate-500">(Leave blank to keep current)</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Role & Permission Scope</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Platform Master)</option>
                  <option value="RESTAURANT_ADMIN">RESTAURANT_ADMIN (Store Owner)</option>
                  <option value="STAFF_OPERATOR">STAFF_OPERATOR (Kitchen staff)</option>
                  <option value="CUSTOMER">CUSTOMER (Standard User)</option>
                </select>
              </div>

              {/* Show restaurant selection dropdown if role requires it */}
              {(role === 'RESTAURANT_ADMIN' || role === 'STAFF_OPERATOR') && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="font-bold text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>Assign to Restaurant</span>
                  </label>
                  <select
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                  >
                    {restaurants.map((resto) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.name} (/{resto.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
