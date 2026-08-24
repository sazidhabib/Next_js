'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  AlertCircle,
  ShieldCheck,
  X,
  Clock,
  Percent,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const { selectedRestaurant, selectRestaurant } = useAdmin();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxRatePercent, setTaxRatePercent] = useState('8.5');
  const [estimatedPrepTime, setEstimatedPrepTime] = useState('25');
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [enablePickup, setEnablePickup] = useState(true);
  const [enableCash, setEnableCash] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableOnline, setEnableOnline] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');

  // Fetch all restaurants
  async function fetchRestaurants() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/restaurants');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRestaurants(json.data);
        } else {
          setError(json.error || 'Failed to fetch restaurants');
        }
      } else {
        setError('Unauthorized access to restaurants administration');
      }
    } catch (err) {
      setError('Connection error fetching restaurants');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRestaurants();
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

  const handleNameChange = (val, isEdit = false) => {
    setName(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleOpenAddModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setPhone('');
    setEmail('');
    setAddress('');
    setTaxRatePercent('8.5');
    setEstimatedPrepTime('25');
    setEnableDelivery(true);
    setEnablePickup(true);
    setEnableCash(true);
    setEnableCard(true);
    setEnableOnline(false);
    setStripePublishableKey('');
    setStripeSecretKey('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (resto) => {
    setCurrentRestaurant(resto);
    setName(resto.name);
    setSlug(resto.slug);
    setDescription(resto.description || '');
    setPhone(resto.phone);
    setEmail(resto.email);
    setAddress(resto.address);
    setTaxRatePercent(String(resto.taxRatePercent));
    setEstimatedPrepTime(String(resto.estimatedPrepTime));
    setEnableDelivery(resto.enableDelivery !== false);
    setEnablePickup(resto.enablePickup !== false);
    setEnableCash(resto.enableCash !== false);
    setEnableCard(resto.enableCard !== false);
    setEnableOnline(resto.enableOnline || false);
    setStripePublishableKey(resto.stripePublishableKey || '');
    setStripeSecretKey(resto.stripeSecretKey || '');
    setIsEditModalOpen(true);
  };

  // Add Restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!name || !slug || !phone || !email || !address) return;

    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          phone,
          email,
          address,
          taxRatePercent: parseFloat(taxRatePercent),
          estimatedPrepTime: parseInt(estimatedPrepTime),
          enableDelivery,
          enablePickup,
          enableCash,
          enableCard,
          enableOnline,
          stripePublishableKey: enableOnline ? stripePublishableKey : '',
          stripeSecretKey: enableOnline ? stripeSecretKey : '',
        }),
      });
      const json = await res.json();

      if (json.success) {
        setIsAddModalOpen(false);
        showToast('success', `Restaurant "${name}" created successfully.`);
        fetchRestaurants();
      } else {
        showToast('error', json.error || 'Failed to create restaurant');
      }
    } catch (err) {
      showToast('error', 'Error creating restaurant');
    }
  };

  // Edit Restaurant
  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    if (!name || !slug || !phone || !email || !address || !currentRestaurant) return;

    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentRestaurant.id,
          name,
          slug,
          description,
          phone,
          email,
          address,
          taxRatePercent: parseFloat(taxRatePercent),
          estimatedPrepTime: parseInt(estimatedPrepTime),
          enableDelivery,
          enablePickup,
          enableCash,
          enableCard,
          enableOnline,
          stripePublishableKey: enableOnline ? stripePublishableKey : '',
          stripeSecretKey: enableOnline ? stripeSecretKey : '',
        }),
      });
      const json = await res.json();

      if (json.success) {
        setIsEditModalOpen(false);
        showToast('success', `Restaurant "${name}" updated successfully.`);
        fetchRestaurants();
        if (selectedRestaurant?.id === currentRestaurant.id) {
          selectRestaurant(json.data);
        }
      } else {
        showToast('error', json.error || 'Failed to update restaurant');
      }
    } catch (err) {
      showToast('error', 'Error updating restaurant');
    }
  };

  // Delete Restaurant
  const handleDeleteRestaurant = async (id, name) => {
    if (!confirm(`Are you sure you want to delete restaurant "${name}"? All associated categories, menus, operating hours, delivery zones, and orders will be deleted.`)) return;

    try {
      const res = await fetch(`/api/admin/restaurants?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.success) {
        showToast('success', `Restaurant "${name}" deleted successfully.`);
        fetchRestaurants();
        if (selectedRestaurant?.id === id) {
          selectRestaurant(null);
        }
      } else {
        showToast('error', json.error || 'Failed to delete restaurant');
      }
    } catch (err) {
      showToast('error', 'Error deleting restaurant');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Restaurants Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register, configure, update and delete restaurant tenants in the database.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Restaurant</span>
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

      {/* Restaurants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading database restaurants...
          </div>
        ) : restaurants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold border-t border-slate-850">
            No restaurants registered yet. Click "Add Restaurant" to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Restaurant</th>
                  <th className="p-3.5">URL Slug</th>
                  <th className="p-3.5">Contact Detail</th>
                  <th className="p-3.5">Location Address</th>
                  <th className="p-3.5">Estimated Prep</th>
                  <th className="p-3.5">Tax Rate</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {restaurants.map((resto) => {
                  const isSelected = selectedRestaurant?.id === resto.id;
                  return (
                    <tr key={resto.id} className={`hover:bg-slate-850 transition-colors ${isSelected ? 'bg-orange-500/5' : ''}`}>
                      <td className="p-3.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              selectRestaurant(resto);
                              router.push('/admin');
                            }}
                            className="text-orange-400 hover:text-orange-355 font-black hover:underline text-left text-sm flex items-center gap-1.5 cursor-pointer focus:outline-none"
                          >
                            <Building2 className="w-4 h-4 text-orange-550 shrink-0 animate-pulse" />
                            <span>{resto.name}</span>
                          </button>
                          {isSelected && (
                            <span className="bg-orange-500/15 text-orange-400 font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-medium line-clamp-1 max-w-xs">
                          {resto.description || 'No description provided.'}
                        </p>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">/{resto.slug}</td>
                      <td className="p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{resto.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-550" />
                          <span>{resto.phone}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{resto.address}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-550" />
                          <span>{resto.estimatedPrepTime} mins</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-bold">
                        <span className="flex items-center gap-0.5">
                          <Percent className="w-3.5 h-3.5 text-slate-550" />
                          <span>{resto.taxRatePercent}%</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(resto)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Edit Restaurant"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(resto.id, resto.name)}
                          className="p-1.5 bg-slate-800/80 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Restaurant"
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

      {/* Add Restaurant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add New Restaurant Tenant</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRestaurant} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Restaurant Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, false)}
                  placeholder="e.g. Sabor Latino Bistro"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">URL Slug (Unique path name)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. sabor-latino"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients about your restaurant's unique dishes..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@bistro.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3344"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Food Street, San Francisco, CA"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRatePercent}
                    onChange={(e) => setTaxRatePercent(e.target.value)}
                    placeholder="8.5"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Estimated Prep Time (mins)</label>
                  <input
                    type="number"
                    value={estimatedPrepTime}
                    onChange={(e) => setEstimatedPrepTime(e.target.value)}
                    placeholder="25"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Service & Payment options */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-orange-400 text-xs uppercase tracking-wider">Service & Payment Settings</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <span className="font-bold text-slate-400">Fulfillment Options</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableDelivery} onChange={(e) => setEnableDelivery(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enablePickup} onChange={(e) => setEnablePickup(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Pickup</span>
                    </label>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <span className="font-bold text-slate-400">Accepted Payments</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableCash} onChange={(e) => setEnableCash(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Cash</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableCard} onChange={(e) => setEnableCard(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Card Offline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableOnline} onChange={(e) => setEnableOnline(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Stripe Online</span>
                    </label>
                  </div>
                </div>

                {enableOnline && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-450">Stripe Publishable Key</label>
                      <input type="text" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_test_..." required className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-450">Stripe Secret Key</label>
                      <input type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." required className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 focus:outline-none" />
                    </div>
                  </div>
                )}
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
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Modify Restaurant Settings</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditRestaurant} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Restaurant Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  placeholder="e.g. Sabor Latino Bistro"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">URL Slug (Unique path name)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. sabor-latino"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients about your restaurant's unique dishes..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@bistro.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3344"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Food Street, San Francisco, CA"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRatePercent}
                    onChange={(e) => setTaxRatePercent(e.target.value)}
                    placeholder="8.5"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Estimated Prep Time (mins)</label>
                  <input
                    type="number"
                    value={estimatedPrepTime}
                    onChange={(e) => setEstimatedPrepTime(e.target.value)}
                    placeholder="25"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Service & Payment options */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-orange-400 text-xs uppercase tracking-wider">Service & Payment Settings</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <span className="font-bold text-slate-400">Fulfillment Options</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableDelivery} onChange={(e) => setEnableDelivery(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enablePickup} onChange={(e) => setEnablePickup(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Pickup</span>
                    </label>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <span className="font-bold text-slate-400">Accepted Payments</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableCash} onChange={(e) => setEnableCash(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Cash</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableCard} onChange={(e) => setEnableCard(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Card Offline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input type="checkbox" checked={enableOnline} onChange={(e) => setEnableOnline(e.target.checked)} className="rounded text-orange-500 focus:ring-0" />
                      <span>Enable Stripe Online</span>
                    </label>
                  </div>
                </div>

                {enableOnline && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-450">Stripe Publishable Key</label>
                      <input type="text" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_test_..." required className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-450">Stripe Secret Key</label>
                      <input type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." required className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>

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
