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
  Gift,
  Utensils,
  CheckSquare,
  Square,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';
import MediaPickerModal from '@/components/MediaPickerModal';

export default function AdminOffersPage() {
  const { user, selectedRestaurant, loading: adminLoading } = useAdmin();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'AUTOMATIC' | 'CODE' | 'BOGO' | 'FREE_REWARD'
  const [copiedCode, setCopiedCode] = useState(null);

  // Menu items & Categories for dish selection
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [dishSearch, setDishSearch] = useState('');
  const [dishCategoryFilter, setDishCategoryFilter] = useState('ALL');

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
  const [formDiscountType, setFormDiscountType] = useState('PERCENTAGE'); // 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY' | 'BOGO' | 'SPEND_GET_FREE_ITEM'
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

  // New fields for BOGO & Spend Threshold Rewards
  const [formApplicableItemIds, setFormApplicableItemIds] = useState([]);
  const [formFreeRewardItemIds, setFormFreeRewardItemIds] = useState([]);
  const [formBuyQuantity, setFormBuyQuantity] = useState(1);
  const [formGetQuantity, setFormGetQuantity] = useState(1);

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const targetParam = selectedRestaurant?.id
        ? `?restaurantId=${encodeURIComponent(selectedRestaurant.id)}`
        : selectedRestaurant?.slug
        ? `?slug=${encodeURIComponent(selectedRestaurant.slug)}`
        : '';
      const res = await fetch(`/api/admin/offers${targetParam}`);
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

  // Fetch menu dishes for multi-select
  const fetchMenu = async () => {
    try {
      const activeSlug = selectedRestaurant?.slug || 'bellavista-pizza';
      const res = await fetch(`/api/restaurant?slug=${encodeURIComponent(activeSlug)}`);
      const json = await res.json();
      if (json.success && json.data) {
        const cats = json.data.categories || [];
        setMenuCategories(cats);
        const allDishes = [];
        cats.forEach((c) => {
          (c.items || []).forEach((item) => {
            allDishes.push({ ...item, categoryName: c.name });
          });
        });
        setMenuItems(allDishes);
      }
    } catch (e) {
      console.warn('Error loading menu dishes:', e);
    }
  };

  useEffect(() => {
    if (!adminLoading) {
      fetchOffers();
      fetchMenu();
    }
  }, [selectedRestaurant?.id, selectedRestaurant?.slug, adminLoading]);

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
    setFormApplicableItemIds([]);
    setFormFreeRewardItemIds([]);
    setFormBuyQuantity(1);
    setFormGetQuantity(1);
    setDishSearch('');
    setDishCategoryFilter('ALL');
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
    setFormApplicableItemIds(Array.isArray(offer.applicableItemIds) ? offer.applicableItemIds : []);
    setFormFreeRewardItemIds(Array.isArray(offer.freeRewardItemIds) ? offer.freeRewardItemIds : []);
    setFormBuyQuantity(offer.buyQuantity || 1);
    setFormGetQuantity(offer.getQuantity || 1);
    setDishSearch('');
    setDishCategoryFilter('ALL');
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
      setFormCode('');
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
    } else if (preset === 'BOGO_PIZZA') {
      setFormTitle('Buy 1 Pizza Get 1 Free (BOGO)');
      setFormDescription('Buy any artisanal stone-oven pizza and get a second one 100% free!');
      setFormCode('BOGOPIZZA');
      setFormIsAutomatic(false);
      setFormDiscountType('BOGO');
      setFormBuyQuantity(1);
      setFormGetQuantity(1);
      setFormMinOrderAmount(0);
      setFormMaxDiscountAmount('');
      setFormBannerText('🍕 BUY 1 GET 1 FREE ON SELECTED PIZZAS (CODE: BOGOPIZZA)');
      setFormBannerImageUrl('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80');
      // Auto-select pizza dishes if available
      const pizzaItems = menuItems.filter((i) => i.categoryName?.toLowerCase().includes('pizza') || i.name?.toLowerCase().includes('pizza'));
      if (pizzaItems.length > 0) {
        setFormApplicableItemIds(pizzaItems.map((i) => i.id));
      }
    } else if (preset === 'SPEND30_REWARD') {
      setFormTitle('Free Dessert or Side on Orders £30+');
      setFormDescription('Spend £30 or more to unlock your choice of 1 complimentary dessert, side, or drink at checkout!');
      setFormCode('');
      setFormIsAutomatic(true);
      setFormDiscountType('SPEND_GET_FREE_ITEM');
      setFormMinOrderAmount(30);
      setFormMaxDiscountAmount('');
      setFormBannerText('🎁 FREE COMPLIMENTARY DISH UNLOCKED ON ORDERS £30+');
      setFormBannerImageUrl('https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80');
      // Auto-select dessert/sides items if available
      const dessertSides = menuItems.filter((i) => 
        i.categoryName?.toLowerCase().includes('dessert') || 
        i.categoryName?.toLowerCase().includes('side') || 
        i.categoryName?.toLowerCase().includes('drink') ||
        i.categoryName?.toLowerCase().includes('appetizer')
      );
      if (dessertSides.length > 0) {
        setFormFreeRewardItemIds(dessertSides.map((i) => i.id));
      }
    }
  };

  // Toggle item selection helper
  const handleToggleApplicableItem = (itemId) => {
    setFormApplicableItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleFreeRewardItem = (itemId) => {
    setFormFreeRewardItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Save (Create or Update)
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Offer title is required');
      return;
    }

    if (formDiscountType === 'BOGO' && formApplicableItemIds.length === 0) {
      toast.warning('Please select at least one qualifying dish for the Buy 1 Get 1 Free promotion.');
      return;
    }

    if (formDiscountType === 'SPEND_GET_FREE_ITEM' && formFreeRewardItemIds.length === 0) {
      toast.warning('Please select at least one eligible free reward dish for customers to choose from.');
      return;
    }

    setSaving(true);
    const payload = {
      restaurantId: selectedRestaurant?.id || selectedRestaurant?.slug || undefined,
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
      applicableItemIds: formApplicableItemIds,
      freeRewardItemIds: formFreeRewardItemIds,
      buyQuantity: parseInt(formBuyQuantity) || 1,
      getQuantity: parseInt(formGetQuantity) || 1,
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
          if (json.data) {
            setOffers((prev) => prev.map((o) => (o.id === json.data.id ? json.data : o)));
          }
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
          if (json.data) {
            setOffers((prev) => [json.data, ...prev.filter((o) => o.id !== json.data.id)]);
          }
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
    if (filterType === 'BOGO') return offer.discountType === 'BOGO';
    if (filterType === 'FREE_REWARD') return offer.discountType === 'SPEND_GET_FREE_ITEM';
    return true;
  });

  // Filtered menu items for modal dish selector
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      !dishSearch ||
      item.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(dishSearch.toLowerCase()));

    const matchesCategory =
      dishCategoryFilter === 'ALL' ||
      item.categoryId === dishCategoryFilter ||
      item.categoryName === dishCategoryFilter;

    return matchesSearch && matchesCategory;
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
                Create promotional discount codes, Buy 1 Get 1 Free, spend threshold free dishes, and automatic delivery threshold banners.
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
            { key: 'BOGO', label: '🍕 BOGO (Buy 1 Get 1)' },
            { key: 'FREE_REWARD', label: '🎁 Free Dish Reward' },
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
              Create special discounts, BOGO deals, and spend threshold free dishes to attract more customers.
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
            const isBogo = offer.discountType === 'BOGO';
            const isSpendReward = offer.discountType === 'SPEND_GET_FREE_ITEM';

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
                      {isBogo ? (
                        <Gift className="w-10 h-10 opacity-30 text-amber-400" />
                      ) : isSpendReward ? (
                        <Utensils className="w-10 h-10 opacity-30 text-emerald-400" />
                      ) : (
                        <Sparkles className="w-10 h-10 opacity-30" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                  {/* Top Status & Type Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        isBogo
                          ? 'bg-amber-500/90 text-white'
                          : isSpendReward
                          ? 'bg-emerald-600/90 text-white'
                          : isPercentage
                          ? 'bg-orange-500/90 text-white'
                          : isFreeDelivery
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-blue-500/90 text-white'
                      }`}
                    >
                      {isBogo
                        ? `BUY ${offer.buyQuantity || 1} GET ${offer.getQuantity || 1} FREE`
                        : isSpendReward
                        ? `FREE DISH ON £${offer.minOrderAmount || 30}+`
                        : isPercentage
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

                    {isBogo && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Qualifying Items:</span>
                        <span className="font-bold text-amber-400">
                          {Array.isArray(offer.applicableItemIds) && offer.applicableItemIds.length > 0
                            ? `${offer.applicableItemIds.length} Selected Dishes`
                            : 'All Menu Items'}
                        </span>
                      </div>
                    )}

                    {isSpendReward && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Reward Choices:</span>
                        <span className="font-bold text-emerald-400">
                          {Array.isArray(offer.freeRewardItemIds) && offer.freeRewardItemIds.length > 0
                            ? `${offer.freeRewardItemIds.length} Free Dish Options`
                            : 'All Menu Items'}
                        </span>
                      </div>
                    )}

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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
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
                    Configure promotional rules, discount tiers, BOGO pairings, and free reward gifts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
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
                    🍕 £5 Off (£30+)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('BOGO_PIZZA')}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-600/30 hover:border-amber-500/50 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>🍕 Buy 1 Get 1 Free</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('SPEND30_REWARD')}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>🎁 Free Dish on £30+</span>
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

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <label
                    onClick={() => setFormDiscountType('PERCENTAGE')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'PERCENTAGE'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Percent className="w-5 h-5" />
                    <span className="text-[11px]">Percentage (%)</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('FIXED_AMOUNT')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'FIXED_AMOUNT'
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="text-[11px]">Fixed Amount (£)</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('FREE_DELIVERY')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'FREE_DELIVERY'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-[11px]">Free Delivery</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('BOGO')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'BOGO'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Gift className="w-5 h-5" />
                    <span className="text-[11px]">Buy 1 Get 1 Free</span>
                  </label>

                  <label
                    onClick={() => setFormDiscountType('SPEND_GET_FREE_ITEM')}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition ${
                      formDiscountType === 'SPEND_GET_FREE_ITEM'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                    <span className="text-[11px]">Free Dish Reward</span>
                  </label>
                </div>

                {/* Percentage / Fixed Amount Inputs */}
                {(formDiscountType === 'PERCENTAGE' || formDiscountType === 'FIXED_AMOUNT') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                )}

                {/* Free Delivery Inputs */}
                {formDiscountType === 'FREE_DELIVERY' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Min Basket Spend to Unlock Free Delivery (£)
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
                  </div>
                )}

                {/* BOGO Configuration & Dish Selection */}
                {formDiscountType === 'BOGO' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Buy Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={formBuyQuantity}
                          onChange={(e) => setFormBuyQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Get Free Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={formGetQuantity}
                          onChange={(e) => setFormGetQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Min Cart Spend (Optional)</label>
                        <input
                          type="number"
                          min="0"
                          value={formMinOrderAmount}
                          onChange={(e) => setFormMinOrderAmount(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Dish Multi-Select for BOGO */}
                    <div className="space-y-2 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <Gift className="w-4 h-4" />
                          <span>Select Qualifying Dishes for Buy 1 Get 1 Free ({formApplicableItemIds.length} selected):</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormApplicableItemIds(menuItems.map((i) => i.id))}
                            className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                          >
                            Select All
                          </button>
                          <span className="text-slate-600">|</span>
                          <button
                            type="button"
                            onClick={() => setFormApplicableItemIds([])}
                            className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {/* Search and Category Filter for Dishes */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search dish name..."
                          value={dishSearch}
                          onChange={(e) => setDishSearch(e.target.value)}
                          className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                        />
                        <select
                          value={dishCategoryFilter}
                          onChange={(e) => setDishCategoryFilter(e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        >
                          <option value="ALL">All Categories</option>
                          {menuCategories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dishes Grid */}
                      <div className="max-h-48 overflow-y-auto bg-slate-900 p-2 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {filteredMenuItems.map((item) => {
                          const isSelected = formApplicableItemIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleApplicableItem(item.id)}
                              className={`p-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <span className="font-semibold truncate">{item.name}</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 shrink-0">£{item.basePrice?.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Spend Threshold Free Dish Configuration */}
                {formDiscountType === 'SPEND_GET_FREE_ITEM' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Target Cart Spend Threshold (£) <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          required
                          value={formMinOrderAmount}
                          onChange={(e) => setFormMinOrderAmount(e.target.value)}
                          placeholder="e.g. 30.00"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                        <p className="text-[10px] text-slate-400">
                          When customer reaches this cart total, they unlock 1 free choice from the selected reward dishes.
                        </p>
                      </div>
                    </div>

                    {/* Dish Multi-Select for Free Reward Choice */}
                    <div className="space-y-2 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Utensils className="w-4 h-4" />
                          <span>Select Eligible Free Reward Dishes for Customer to Choose ({formFreeRewardItemIds.length} selected):</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormFreeRewardItemIds(menuItems.map((i) => i.id))}
                            className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                          >
                            Select All
                          </button>
                          <span className="text-slate-600">|</span>
                          <button
                            type="button"
                            onClick={() => setFormFreeRewardItemIds([])}
                            className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      {/* Search and Category Filter for Free Reward Dishes */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search reward dish name..."
                          value={dishSearch}
                          onChange={(e) => setDishSearch(e.target.value)}
                          className="flex-1 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                        />
                        <select
                          value={dishCategoryFilter}
                          onChange={(e) => setDishCategoryFilter(e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        >
                          <option value="ALL">All Categories</option>
                          {menuCategories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dishes Grid for Free Reward */}
                      <div className="max-h-48 overflow-y-auto bg-slate-900 p-2 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {filteredMenuItems.map((item) => {
                          const isSelected = formFreeRewardItemIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleFreeRewardItem(item.id)}
                              className={`p-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <span className="font-semibold truncate">{item.name}</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 shrink-0">£{item.basePrice?.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trigger & Coupon Code Settings */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Apply to Cart</span>
                    <span className="text-[11px] text-slate-400">
                      Automatically applies as soon as the cart reaches the minimum spend or qualifying dishes without needing a promo code.
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
                      placeholder="e.g. BOGOPIZZA"
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
