'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  BadgePercent,
  Plus,
  Search,
  Tag,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Percent,
  DollarSign,
  Truck,
  Edit2,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Zap,
  ShoppingBag,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';
import MediaPickerModal from '@/components/MediaPickerModal';

export default function AdminOffersPage() {
  const { selectedRestaurant } = useAdmin();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'AUTOMATIC' | 'CODE'
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formIsAutomatic, setFormIsAutomatic] = useState(false);
  const [formDiscountType, setFormDiscountType] = useState('PERCENTAGE'); // 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY'
  const [formDiscountValue, setFormDiscountValue] = useState(15);
  const [formMinOrderAmount, setFormMinOrderAmount] = useState(20);
  const [formMaxDiscountAmount, setFormMaxDiscountAmount] = useState(10);
  const [formServiceType, setFormServiceType] = useState('ALL');
  const [formBannerText, setFormBannerText] = useState('');
  const [formBannerImageUrl, setFormBannerImageUrl] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formUsageLimit, setFormUsageLimit] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const restaurantId = selectedRestaurant?.id || 'resto-bella-vista-001';

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/offers?restaurantId=${restaurantId}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOffers(json.data);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.error('Error loading offers:', err);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [restaurantId]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormTitle('');
    setFormDescription('');
    setFormCode('SAVE15');
    setFormIsAutomatic(false);
    setFormDiscountType('PERCENTAGE');
    setFormDiscountValue(15);
    setFormMinOrderAmount(20);
    setFormMaxDiscountAmount(10);
    setFormServiceType('ALL');
    setFormBannerText('🔥 15% OFF ORDERS OVER £20');
    setFormBannerImageUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80');
    setFormStartDate(new Date().toISOString().slice(0, 10));
    setFormEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setFormUsageLimit('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormTitle(offer.title || '');
    setFormDescription(offer.description || '');
    setFormCode(offer.code || '');
    setFormIsAutomatic(!!offer.isAutomatic);
    setFormDiscountType(offer.discountType || 'PERCENTAGE');
    setFormDiscountValue(offer.discountValue || 0);
    setFormMinOrderAmount(offer.minOrderAmount || 0);
    setFormMaxDiscountAmount(offer.maxDiscountAmount || '');
    setFormServiceType(offer.serviceType || 'ALL');
    setFormBannerText(offer.bannerText || '');
    setFormBannerImageUrl(offer.bannerImageUrl || '');
    setFormStartDate(offer.startDate ? offer.startDate.slice(0, 10) : '');
    setFormEndDate(offer.endDate ? offer.endDate.slice(0, 10) : '');
    setFormUsageLimit(offer.usageLimit || '');
    setFormIsActive(offer.isActive !== false);
    setIsModalOpen(true);
  };

  // Quick Preset Application
  const applyPreset = (preset) => {
    if (preset === 'WELCOME20') {
      setFormTitle('New Customer Welcome 20% Off');
      setFormDescription('Get 20% discount on your first online order. Min spend £20.');
      setFormCode('WELCOME20');
      setFormIsAutomatic(false);
      setFormDiscountType('PERCENTAGE');
      setFormDiscountValue(20);
      setFormMinOrderAmount(20);
      setFormMaxDiscountAmount(10);
      setFormBannerText('🎉 20% OFF YOUR FIRST ORDER (CODE: WELCOME20)');
      setFormBannerImageUrl('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80');
    } else if (preset === 'FREEDEL') {
      setFormTitle('Free Express Delivery on £25+');
      setFormDescription('Free delivery automatically applied for all qualifying orders over £25.');
      setFormCode('FREEDEL');
      setFormIsAutomatic(true);
      setFormDiscountType('FREE_DELIVERY');
      setFormDiscountValue(100);
      setFormMinOrderAmount(25);
      setFormMaxDiscountAmount('');
      setFormServiceType('DELIVERY');
      setFormBannerText('🚚 FREE DELIVERY UNLOCKED ON ORDERS £25+');
      setFormBannerImageUrl('https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80');
    } else if (preset === 'FLAT5') {
      setFormTitle('£5 Off Weekend Feast');
      setFormDescription('Enjoy £5 flat reduction when spending £30 or more.');
      setFormCode('FEAST5');
      setFormIsAutomatic(false);
      setFormDiscountType('FIXED_AMOUNT');
      setFormDiscountValue(5);
      setFormMinOrderAmount(30);
      setFormMaxDiscountAmount(5);
      setFormBannerText('🍕 £5 OFF ORDERS OVER £30 (CODE: FEAST5)');
      setFormBannerImageUrl('https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80');
    }
  };

  // Save (Create or Update)
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Offer title is required');
      return;
    }

    setSaving(true);
    const payload = {
      restaurantId,
      title: formTitle.trim(),
      description: formDescription.trim(),
      code: formIsAutomatic ? null : (formCode ? formCode.trim().toUpperCase() : null),
      isAutomatic: formIsAutomatic,
      discountType: formDiscountType,
      discountValue: parseFloat(formDiscountValue) || 0,
      minOrderAmount: parseFloat(formMinOrderAmount) || 0,
      maxDiscountAmount: formMaxDiscountAmount ? parseFloat(formMaxDiscountAmount) : null,
      serviceType: formServiceType,
      bannerText: formBannerText.trim(),
      bannerImageUrl: formBannerImageUrl || null,
      startDate: formStartDate ? new Date(formStartDate).toISOString() : null,
      endDate: formEndDate ? new Date(formEndDate).toISOString() : null,
      usageLimit: formUsageLimit ? parseInt(formUsageLimit) : null,
      isActive: formIsActive,
    };

    try {
      if (editingOffer) {
        // Update
        const res = await fetch(`/api/admin/offers/${editingOffer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          toast.success('Offer updated successfully');
          setIsModalOpen(false);
          fetchOffers();
        } else {
          toast.error(json.error || 'Failed to update offer');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          toast.success('Offer created successfully');
          setIsModalOpen(false);
          fetchOffers();
        } else {
          toast.error(json.error || 'Failed to create offer');
        }
      }
    } catch (err) {
      console.error('Error saving offer:', err);
      toast.error('An error occurred while saving the offer');
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (offer) => {
    try {
      const nextState = !offer.isActive;
      const res = await fetch(`/api/admin/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      const json = await res.json();
      if (json.success) {
        toast.info(`Offer ${nextState ? 'activated' : 'paused'}`);
        setOffers((prev) =>
          prev.map((o) => (o.id === offer.id ? { ...o, isActive: nextState } : o))
        );
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  // Delete offer
  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to permanently delete this offer?')) return;
    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Offer removed');
        setOffers((prev) => prev.filter((o) => o.id !== offerId));
      }
    } catch (err) {
      toast.error('Failed to delete offer');
    }
  };

  // Copy code helper
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Metrics
  const activeCount = offers.filter((o) => o.isActive).length;
  const totalClaims = offers.reduce((sum, o) => sum + (o.usedCount || 0), 0);
  const totalDiscountGiven = offers.reduce((sum, o) => sum + (o.usedCount || 0) * (o.discountValue || 4.5), 0);
  const estimatedRevenue = totalClaims * 32.5;

  // Filtered offers
  const filteredOffers = offers.filter((offer) => {
    const matchesQuery =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.code && offer.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (filterType === 'ACTIVE') return offer.isActive;
    if (filterType === 'AUTOMATIC') return offer.isAutomatic;
    if (filterType === 'CODE') return !offer.isAutomatic && offer.code;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
              <BadgePercent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Offers & Promotions
              </h1>
              <p className="text-xs text-slate-400">
                Create promotional discount codes, free delivery thresholds, and automatic banners for your customer storefront.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-600/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Active Campaigns</span>
            <div className="text-xl font-extrabold text-white">{activeCount} of {offers.length}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Times Claimed</span>
            <div className="text-xl font-extrabold text-white">{totalClaims} orders</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Revenue Driven</span>
            <div className="text-xl font-extrabold text-white">£{estimatedRevenue.toFixed(0)}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Discounts</span>
            <div className="text-xl font-extrabold text-white">£{totalDiscountGiven.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search offers by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Offers' },
            { key: 'ACTIVE', label: 'Active Only' },
            { key: 'CODE', label: 'Coupon Codes' },
            { key: 'AUTOMATIC', label: 'Auto-Applied' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterType === tab.key
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Offers List / Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400">Loading promotional campaigns...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
            <Tag className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No promotional offers found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create special discounts and free delivery campaigns to attract more customers and drive repeat orders.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Offer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((offer) => {
            const isPercentage = offer.discountType === 'PERCENTAGE';
            const isFreeDelivery = offer.discountType === 'FREE_DELIVERY';
            const isFixed = offer.discountType === 'FIXED_AMOUNT';

            return (
              <div
                key={offer.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-700 ${
                  offer.isActive ? 'border-slate-800' : 'border-slate-800/60 opacity-70'
                }`}
              >
                {/* Banner Graphic Header */}
                <div className="relative h-36 bg-slate-950 overflow-hidden group">
                  {offer.bannerImageUrl ? (
                    <img
                      src={offer.bannerImageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center text-slate-600">
                      <Sparkles className="w-10 h-10 opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                  {/* Top Status & Type Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        isPercentage
                          ? 'bg-orange-500/90 text-white'
                          : isFreeDelivery
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-blue-500/90 text-white'
                      }`}
                    >
                      {isPercentage
                        ? `${offer.discountValue}% OFF`
                        : isFreeDelivery
                        ? 'FREE DELIVERY'
                        : `£${offer.discountValue?.toFixed(2)} OFF`}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(offer)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition backdrop-blur-md cursor-pointer ${
                        offer.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${offer.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                      <span>{offer.isActive ? 'ACTIVE' : 'PAUSED'}</span>
                    </button>
                  </div>

                  {/* Bottom Banner Ribbon Text */}
                  {offer.bannerText && (
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-[11px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 line-clamp-1">
                        {offer.bannerText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Offer Details Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {offer.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Code & Threshold */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Trigger Mode:</span>
                      {offer.isAutomatic ? (
                        <span className="font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Zap className="w-3 h-3" />
                          Auto-Applied
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md text-xs">
                            {offer.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(offer.code)}
                            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === offer.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Min Basket Spend:</span>
                      <span className="font-semibold text-slate-200">
                        {offer.minOrderAmount > 0 ? `£${offer.minOrderAmount.toFixed(2)}` : 'No minimum'}
                      </span>
                    </div>

                    {offer.maxDiscountAmount && isPercentage && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Max Discount Cap:</span>
                        <span className="font-semibold text-slate-200">
                          £{offer.maxDiscountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Redemptions:</span>
                      <span className="font-bold text-slate-300">
                        {offer.usedCount || 0} {offer.usageLimit ? `/ ${offer.usageLimit}` : 'claims'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(offer)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Offer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingOffer ? 'Edit Promotion Campaign' : 'Create Promotional Offer'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure promotional rules, discount tiers, and banner image.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Buttons (Only in Create mode) */}
            {!editingOffer && (
              <div className="p-4 bg-slate-800/40 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  ⚡ Quick Campaign Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('WELCOME20')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600/30 hover:border-orange-500/50 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    🎉 20% First Order
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('FREEDEL')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    🚚 Free Delivery £25+
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('FLAT5')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600/30 hover:border-blue-500/50 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    🍕 £5 Off Feast (£30+)
                  </button>
                </div>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveOffer} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Banner Graphic Image Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Offer Banner Graphic / Thumbnail</span>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choose / Upload Banner Image</span>
                  </button>
                </label>

                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="w-24 h-16 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0 relative">
                    {formBannerImageUrl ? (
                      <img
                        src={formBannerImageUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL or pick from media library..."
                      value={formBannerImageUrl}
                      onChange={(e) => setFormBannerImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      Displays in storefront top marquee, deals carousel, and checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Campaign Title <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Pizza Feast 20% Off"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Storefront Ribbon Banner Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🔥 20% OFF ORDERS OVER £25"
                    value={formBannerText}
                    onChange={(e) => setFormBannerText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Description / Terms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valid on all wood-fired pizzas for delivery orders over £25. Cannot be combined with other offers."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Discount Mechanics */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Discount Mechanics & Logic
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setFormDiscountType('PERCENTAGE')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'PERCENTAGE'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Percent className="w-5 h-5" />
                    <span className="text-xs font-bold">Percentage (%)</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('FIXED_AMOUNT')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'FIXED_AMOUNT'
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xs font-bold">Fixed Amount (£)</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('FREE_DELIVERY')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'FREE_DELIVERY'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-xs font-bold">Free Delivery</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formDiscountType !== 'FREE_DELIVERY' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        {formDiscountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (£)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formDiscountValue}
                        onChange={(e) => setFormDiscountValue(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Min Basket Subtotal (£)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formMinOrderAmount}
                      onChange={(e) => setFormMinOrderAmount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  {formDiscountType === 'PERCENTAGE' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Max Cap (£) (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="e.g. 10.00"
                        value={formMaxDiscountAmount}
                        onChange={(e) => setFormMaxDiscountAmount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Trigger & Coupon Code Settings */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Apply to Cart</span>
                    <span className="text-[11px] text-slate-400">
                      Automatically applies as soon as the cart reaches the minimum spend without needing a promo code.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsAutomatic}
                    onChange={(e) => setFormIsAutomatic(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                {!formIsAutomatic && (
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-300">
                      Promo Coupon Code <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={!formIsAutomatic}
                      placeholder="e.g. SUMMER20"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-orange-400 uppercase placeholder-slate-500"
                    />
                  </div>
                )}
              </div>

              {/* Service Mode & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Fulfillment Scope</label>
                  <select
                    value={formServiceType}
                    onChange={(e) => setFormServiceType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="ALL">All Orders (Delivery & Pickup)</option>
                    <option value="DELIVERY">Delivery Orders Only</option>
                    <option value="PICKUP">Pickup Orders Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">End / Expiry Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Status and Limits */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-white cursor-pointer">
                    Publish & Activate Campaign Immediately
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer flex items-center gap-2"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>{editingOffer ? 'Save Changes' : 'Publish Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Banner Upload */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        currentImage={formBannerImageUrl}
        onSelectImage={(url) => {
          setFormBannerImageUrl(url);
          setIsMediaPickerOpen(false);
          toast.success('Banner image selected!');
        }}
        title="Select or Upload Offer Banner Image"
      />
    </div>
  );
}
