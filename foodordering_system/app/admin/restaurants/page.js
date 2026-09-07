'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  Code,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Sparkles,
  Share2,
  UserCheck,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';
import LocationSetupWizardModal from '@/components/LocationSetupWizardModal';

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const { selectedRestaurant, selectRestaurant } = useAdmin();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardEditData, setWizardEditData] = useState(null);
  const [embedModalResto, setEmbedModalResto] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(''), 3000);
  };

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
      toast.success(msg);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(msg);
      toast.error(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleOpenAddLocation = () => {
    setWizardEditData(null);
    setIsWizardOpen(true);
  };

  const handleOpenEditLocation = (resto) => {
    setWizardEditData(resto);
    setIsWizardOpen(true);
  };

  // Delete Restaurant
  const handleDeleteRestaurant = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete location "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/restaurants?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `Location "${name}" removed.`);
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-orange-600/20 text-orange-400 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Locations & Setup
            </span>
            <span className="text-xs text-slate-400">Multi-Branch Management</span>
          </div>
          <h1 className="text-2xl font-black text-white">Restaurant Locations</h1>
          <p className="text-xs text-slate-400 font-medium">
            Setup new branches, pinpoint storefront entrances on the map, assign managers, and manage delivery zones.
          </p>
        </div>

        <button
          onClick={handleOpenAddLocation}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-black text-white">
              Registered Branches ({restaurants.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-3">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading restaurant locations...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No locations registered yet. Click "Add New Location" to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Branch / Restaurant</th>
                  <th className="p-3.5">Location & Map Coordinates</th>
                  <th className="p-3.5">Manager / Contact</th>
                  <th className="p-3.5">Fulfillment</th>
                  <th className="p-3.5">Prep / Tax</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {restaurants.map((resto) => {
                  const isSelected = selectedRestaurant?.id === resto.id;
                  const managerName = resto.managerFirstName
                    ? `${resto.managerFirstName} ${resto.managerLastName || ''}`.trim()
                    : null;
                  return (
                    <tr key={resto.id} className={`hover:bg-slate-850 transition-colors ${isSelected ? 'bg-orange-500/5' : ''}`}>
                      <td className="p-3.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              selectRestaurant(resto);
                              router.push('/admin/zones');
                            }}
                            className="text-orange-400 hover:text-orange-300 font-black hover:underline text-left text-sm flex items-center gap-1.5 cursor-pointer focus:outline-none"
                          >
                            <Building2 className="w-4 h-4 text-orange-500 shrink-0" />
                            <span>{resto.name}</span>
                          </button>
                          {isSelected && (
                            <span className="bg-orange-500/15 text-orange-400 font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              Active Context
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-medium line-clamp-1 max-w-xs">
                          {resto.description || 'No description provided.'}
                        </p>
                      </td>

                      <td className="p-3.5 text-slate-300 max-w-xs">
                        <span className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="truncate font-medium">{resto.address}</div>
                            {resto.latitude && resto.longitude ? (
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                📍 {Number(resto.latitude).toFixed(4)}, {Number(resto.longitude).toFixed(4)}
                              </div>
                            ) : null}
                          </div>
                        </span>
                      </td>

                      <td className="p-3.5 space-y-1">
                        {managerName && (
                          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{managerName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{resto.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{resto.phone}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {resto.enableDelivery !== false && (
                            <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Delivery
                            </span>
                          )}
                          {resto.enablePickup !== false && (
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Pickup
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 space-y-1 text-slate-300 font-medium">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{resto.estimatedPrepTime || 25} mins</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <Percent className="w-3 h-3 text-slate-500" />
                          <span>{resto.taxRatePercent || 0}% tax</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            selectRestaurant(resto);
                            router.push('/admin/zones');
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                          title="Open Interactive Delivery Map"
                        >
                          <MapPin className="w-3.5 h-3.5 text-orange-400" />
                          <span className="hidden xl:inline">Map & Zones</span>
                        </button>

                        <button
                          onClick={() => setEmbedModalResto(resto)}
                          className="p-1.5 bg-orange-600/15 hover:bg-orange-600 text-orange-400 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                          title="Get Website Ordering Link & Modal Widget"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Embed</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditLocation(resto)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Edit Location"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(resto.id, resto.name)}
                          className="p-1.5 bg-slate-800/80 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Location"
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

      {/* GloriaFood Style Location Setup Wizard Modal */}
      <LocationSetupWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        editData={wizardEditData}
        onSuccess={(savedResto) => {
          fetchRestaurants();
          if (wizardEditData && selectedRestaurant?.id === wizardEditData.id) {
            selectRestaurant(savedResto);
          }
        }}
      />

      {/* Restaurant Setup / Embed Link & Widget Modal */}
      {embedModalResto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Setup Ready
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Modal Engine Active
                  </span>
                </div>
                <h3 className="font-black text-lg text-white">
                  Ordering Link & Website Modal Widget
                </h3>
                <p className="text-xs text-slate-400">
                  Tenant: <strong className="text-white">{embedModalResto.name}</strong> (/{embedModalResto.slug})
                </p>
              </div>

              <button
                onClick={() => setEmbedModalResto(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Ordering Link */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>Direct Customer Ordering Link</span>
                </label>
                <a
                  href={`${originUrl}/menu/${embedModalResto.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Open Storefront</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${originUrl}/menu/${embedModalResto.slug}`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-orange-400 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `${originUrl}/menu/${embedModalResto.slug}`,
                      'direct-menu-link'
                    )
                  }
                  className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedKey === 'direct-menu-link' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Website Modal Embed Snippet */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-orange-400" />
                  <span>Website Modal Button Snippet</span>
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  WordPress • Wix • Squarespace • Custom
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste this snippet onto your website. When any visitor clicks the button, the ordering system opens as a sleek modal popup!
              </p>
              <div className="relative">
                <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  <code>{`<!-- Food Ordering Modal Button -->\n<button type="button" data-restaurant="${embedModalResto.slug}" class="gl-order-btn" style="background-color:#ea580c;color:#fff;padding:12px 24px;border-radius:9999px;font-weight:700;border:none;cursor:pointer;">Order Online</button>\n<script src="${originUrl}/widget.js" async></script>`}</code>
                </pre>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `<!-- Food Ordering Modal Button -->\n<button type="button" data-restaurant="${embedModalResto.slug}" class="gl-order-btn" style="background-color:#ea580c;color:#fff;padding:12px 24px;border-radius:9999px;font-weight:700;border:none;cursor:pointer;">Order Online</button>\n<script src="${originUrl}/widget.js" async></script>`,
                      'embed-snippet'
                    )
                  }
                  className="absolute top-2.5 right-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  {copiedKey === 'embed-snippet' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="w-full sm:w-auto flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Test Live Modal Popup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmbedModalResto(null);
                  router.push('/admin/widget');
                }}
                className="w-full sm:w-auto flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30 cursor-pointer"
              >
                <span>Customize in Widget Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Test Modal Preview Overlay */}
      {isTestModalOpen && embedModalResto && (
        <div className="fixed inset-0 z-60 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-xs text-white font-bold">
                  🍴
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  Live Modal Preview: {embedModalResto.name}
                </span>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Embedded Iframe */}
            <div className="flex-1 bg-slate-50 relative">
              <iframe
                src={`${originUrl}/embed/${embedModalResto.slug}`}
                className="w-full h-full border-none"
                title="Live Ordering Modal Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
