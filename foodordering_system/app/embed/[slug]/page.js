'use client';

import React, { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import ItemModal from '@/components/ItemModal';
import CartDrawer from '@/components/CartDrawer';
import RestaurantZoneInfoMap from '@/components/RestaurantZoneInfoMap';
import {
  ShoppingBag,
  Info,
  Menu as MenuIcon,
  X,
  Clock,
  MapPin,
  Phone,
  Tag,
  Star,
  ChevronDown,
  UtensilsCrossed,
  Check,
  ShieldCheck,
  CreditCard,
  Globe,
  Calendar,
  Truck,
  Layers,
  ArrowRight,
  Gift,
  Sparkles,
  Copy,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
} from 'lucide-react';

export default function EmbedMenuPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug || 'bellavista-pizza';

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'info'
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [hoveredZoneIndex, setHoveredZoneIndex] = useState(null);

  // Offers modal & interactive state
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [copiedOfferCode, setCopiedOfferCode] = useState(null);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isOfferHovered, setIsOfferHovered] = useState(false);

  // Item customization modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [serviceType, setServiceType] = useState('DELIVERY');

  // Close message sender to parent window
  const handleCloseModal = () => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ type: 'CLOSE_FOOD_ORDERING_MODAL' }, '*');
      if (window.self === window.top) {
        window.location.href = `/menu/${slug}`;
      }
    }
  };

  // Fetch restaurant data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurant?slug=${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setRestaurant(json.data);
        }
      } catch (err) {
        console.error('Failed to load menu for embed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Cart Handlers
  const handleAddToCart = (customizedItem) => {
    const itemTotal = (customizedItem.unitPrice || customizedItem.basePrice || 0) * (customizedItem.quantity || 1);
    const newTotal = cartTotal + itemTotal;

    setCartItems((prev) => [...prev, customizedItem]);
    toast.success(`Added "${customizedItem.name || 'item'}" to cart!`);

    if (bestAutoOffer && bestAutoOffer.minOrderAmount > 0 && cartTotal < bestAutoOffer.minOrderAmount && newTotal >= bestAutoOffer.minOrderAmount) {
      setTimeout(() => {
        toast.success(`🎉 ${bestAutoOffer.title} Unlocked! Free Delivery applied to your order.`);
      }, 400);
    }
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const handleRemoveItem = (index) => {
    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    if (item?.name) {
      toast.info(`Removed "${item.name}" from cart`);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  const handleCopyOfferCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedOfferCode(code);
    toast.success(`Copied code "${code}"! Apply it at checkout.`);
    setTimeout(() => setCopiedOfferCode(null), 2500);
  };

  const activeOffers = (restaurant?.offers || []).filter((o) => o.isActive !== false);
  const bestAutoOffer = activeOffers.find((o) => o.isAutomatic && o.minOrderAmount > 0) || activeOffers[0];
  const currentFeaturedOffer = activeOffers[activeOfferIndex] || activeOffers[0];

  // Auto-swap featured offers every 5 seconds (pauses when hovered)
  useEffect(() => {
    if (activeOffers.length <= 1 || isOfferHovered) return;
    const timer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % activeOffers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeOffers.length, isOfferHovered]);

  const fallbackOfferBgs = [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80',
  ];
  const currentOfferBg = currentFeaturedOffer?.bannerImageUrl || fallbackOfferBgs[activeOfferIndex % fallbackOfferBgs.length];

  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  const handleOpenItem = (item) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Restaurant System...
        </p>
      </div>
    );
  }

  // Prepared Delivery Zones with fallback
  const defaultZoneColors = [
    { bg: '#ea580c', border: '#ea580c', label: 'Zone 1' },
    { bg: '#f59e0b', border: '#f59e0b', label: 'Zone 2' },
    { bg: '#06b6d4', border: '#06b6d4', label: 'Zone 3' },
    { bg: '#3b82f6', border: '#3b82f6', label: 'Zone 4' },
    { bg: '#a855f7', border: '#a855f7', label: 'Zone 5' },
  ];

  const deliveryZones =
    restaurant?.deliveryZones && restaurant.deliveryZones.length > 0
      ? restaurant.deliveryZones
          .filter((z) => !z.isHidden && z.isActive !== false)
          .map((z, idx) => ({
            ...z,
            color: z.color || defaultZoneColors[idx % defaultZoneColors.length].bg,
            minOrder: z.minOrderAmount || 0,
            fee: z.deliveryFee || 0,
          }))
      : [
          { name: 'Zone 1: Local Center (0-3 km)', minOrder: 0.0, fee: 1.99, color: '#ea580c', radiusKm: 3 },
          { name: 'Zone 2: Inner Ring (3-5 km)', minOrder: 15.0, fee: 2.5, color: '#f59e0b', radiusKm: 5 },
          { name: 'Zone 3: Metro Area (5-8 km)', minOrder: 15.0, fee: 2.5, color: '#06b6d4', radiusKm: 8 },
        ];

  // Operating Hours
  const operatingHours =
    restaurant?.operatingHours && restaurant.operatingHours.length > 0
      ? restaurant.operatingHours
      : [
          { day: 'Monday - Sunday', time: '16:00 - 23:00' },
        ];

  const defaultBanner =
    restaurant?.bannerUrl ||
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-orange-500 selection:text-white font-sans">
      {/* 1. GloriaFood Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#f4f4f5] border-b border-slate-300/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Restaurant Name Header */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide truncate">
              {restaurant?.name || 'BALTI MAHAL'}
            </h1>
          </div>

          {/* Right Action Icons: Deals, Menu, Info (Active toggle), Cart, Close */}
          <div className="flex items-stretch h-14 border-l border-slate-300">
            {/* Special Deals / Offers Button */}
            {activeOffers.length > 0 && (
              <button
                onClick={() => setIsOffersModalOpen(true)}
                title="Special Deals & Exclusive Offers"
                className="px-2.5 sm:px-4 flex items-center justify-center gap-1 sm:gap-1.5 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-r border-slate-300 transition-colors cursor-pointer text-xs font-bold shrink-0"
              >
                <Gift className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline">Deals</span>
                <span className="bg-amber-600 text-white text-[10px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center">
                  {activeOffers.length}
                </span>
              </button>
            )}

            {/* Category Menu Jump Button */}
            <button
              onClick={() => {
                if (activeTab !== 'menu') {
                  setActiveTab('menu');
                  setIsCategoryMenuOpen(true);
                } else {
                  setIsCategoryMenuOpen((prev) => !prev);
                }
              }}
              title="Browse Categories & Menu"
              className={`px-2.5 sm:px-4 flex items-center justify-center border-r border-slate-300 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'menu'
                  ? isCategoryMenuOpen
                    ? 'text-orange-600 bg-orange-50 font-black'
                    : 'text-orange-600 bg-white font-black shadow-inner'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
              }`}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Restaurant Info & Delivery Zones Button (Single-direction Tab Switch) */}
            <button
              onClick={() => {
                if (activeTab !== 'info') {
                  setActiveTab('info');
                  setIsCategoryMenuOpen(false);
                }
              }}
              title="Restaurant Information & Delivery Zones"
              className={`px-2.5 sm:px-4 flex items-center justify-center border-r border-slate-300 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'info'
                  ? 'text-orange-600 bg-white font-black shadow-inner'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
              }`}
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button with Red Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              title="View Cart"
              className="px-2.5 sm:px-5 flex items-center justify-center gap-1 sm:gap-1.5 text-slate-800 hover:text-orange-600 hover:bg-slate-200/70 border-r border-slate-300 transition-colors relative cursor-pointer font-bold text-xs sm:text-sm shrink-0"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {cartCount > 0 ? (
                <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center -ml-0.5">
                  {cartCount}
                </span>
              ) : (
                <span className="text-xs font-black text-red-600">0</span>
              )}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={handleCloseModal}
              title="Close Ordering Modal"
              className="px-2.5 sm:px-4 flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Quick Dropdown/Drawer */}
        {isCategoryMenuOpen && activeTab === 'menu' && (
          <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-3 animate-in slide-in-from-top-2">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">
                Jump To:
              </span>
              {restaurant?.categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setIsCategoryMenuOpen(false);
                    const el = document.getElementById(`cat-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-orange-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Top Promotional Offers Ribbon */}
      {activeOffers.length > 0 && (
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-1.5 sm:py-2 px-4 shadow-sm relative z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shrink-0 flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-300" />
                <span>OFFERS</span>
              </span>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar font-bold whitespace-nowrap">
                {activeOffers.map((off, idx) => (
                  <button
                    key={off.id || idx}
                    type="button"
                    onClick={() => {
                      if (off.code && !off.isAutomatic) handleCopyOfferCode(off.code);
                    }}
                    className="flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <span>{off.bannerText || off.title}</span>
                    {off.code && !off.isAutomatic ? (
                      <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-[10px] border border-white/20">
                        {off.code}
                      </span>
                    ) : off.isAutomatic ? (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold text-emerald-200">
                        Auto-Applied
                      </span>
                    ) : null}
                    {idx < activeOffers.length - 1 && <span className="text-orange-200 ml-1">•</span>}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOffersModalOpen(true)}
              className="font-extrabold hover:text-amber-200 shrink-0 text-[11px] sm:text-xs flex items-center gap-1 bg-black/20 hover:bg-black/30 px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 transition cursor-pointer whitespace-nowrap"
            >
              <span>View Deals ({activeOffers.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Smart Deal Unlock Progress Bar */}
      {cartItems.length > 0 && bestAutoOffer && bestAutoOffer.minOrderAmount > 0 && (
        <div className={`py-2 px-4 sticky top-14 z-30 shadow-xs backdrop-blur-xs transition-colors duration-300 ${
          cartTotal >= bestAutoOffer.minOrderAmount
            ? 'bg-emerald-50/95 border-b border-emerald-200'
            : 'bg-amber-50/95 border-b border-amber-200'
        }`}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className={`p-1 rounded-lg ${
                cartTotal >= bestAutoOffer.minOrderAmount
                  ? 'bg-emerald-500/20 text-emerald-700'
                  : 'bg-amber-500/20 text-amber-700'
              }`}>
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              {cartTotal >= bestAutoOffer.minOrderAmount ? (
                <span className="text-emerald-800 font-extrabold flex items-center gap-1.5 flex-wrap">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  <span>🎉 Deal Unlocked! {bestAutoOffer.title} Applied</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {bestAutoOffer.discountType === 'FREE_DELIVERY'
                      ? '£0.00 DELIVERY FEE'
                      : bestAutoOffer.discountType === 'SPEND_GET_FREE_ITEM'
                      ? 'FREE DISH REWARD'
                      : bestAutoOffer.discountType === 'BOGO'
                      ? 'BOGO FREE'
                      : 'PROMO SAVINGS'}
                  </span>
                </span>
              ) : (
                <span className="text-amber-950">
                  Add <strong className="text-orange-600 font-extrabold">£{(bestAutoOffer.minOrderAmount - cartTotal).toFixed(2)}</strong> more to unlock <strong className="text-amber-900 font-bold">{bestAutoOffer.title}</strong>!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-28 sm:w-40 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    cartTotal >= bestAutoOffer.minOrderAmount
                      ? 'bg-emerald-500'
                      : 'bg-linear-to-r from-orange-500 to-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (cartTotal / bestAutoOffer.minOrderAmount) * 100)}%` }}
                ></div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffersModalOpen(true)}
                className={`text-[11px] font-bold hover:underline cursor-pointer whitespace-nowrap ${
                  cartTotal >= bestAutoOffer.minOrderAmount ? 'text-emerald-700' : 'text-orange-700'
                }`}
              >
                All Deals ({activeOffers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW A: RESTAURANT INFO & DELIVERY ZONES (SCREENSHOT 2)
         ========================================================= */}
      {activeTab === 'info' ? (
        <div className="max-w-5xl w-full mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200">
          {/* 1. Visualized Leaflet Delivery Map with Interactive Zone Highlights */}
          <RestaurantZoneInfoMap
            restaurantLocation={{
              lat: restaurant?.latitude || 51.5133,
              lng: restaurant?.longitude || -0.1362,
              name: restaurant?.name || 'Restaurant Location',
            }}
            zones={deliveryZones}
            hoveredZoneIndex={hoveredZoneIndex}
            onHoverZone={setHoveredZoneIndex}
          />

          {/* Cookie & real-time order notice */}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            For reliable on screen review of your order status, in real-time, your data may be saved on this device by using cookies. Please read our Cookie Policy and change your settings at any time.
          </p>

          {/* 2. Two-Column Info & Rates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-2">
            {/* Left Column: Delivery fees, Delivery hours, Table reservation, Payment method, Phone */}
            <div className="space-y-6">
              {/* Delivery Fees Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1.5">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm sm:text-base">Delivery fees</h3>
                </div>

                <div className="space-y-2">
                  {deliveryZones.map((zone, idx) => (
                    <div
                      key={zone.id || idx}
                      onMouseEnter={() => setHoveredZoneIndex(idx)}
                      onMouseLeave={() => setHoveredZoneIndex(null)}
                      className={`flex items-center gap-2.5 text-xs font-semibold py-1 px-2 rounded-lg transition-colors ${
                        hoveredZoneIndex === idx ? 'bg-slate-100' : ''
                      }`}
                    >
                      {/* Colored Dot matching map ring */}
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: zone.color }}
                      ></span>
                      <span className="text-slate-800">
                        Min - £{zone.minOrder.toFixed(2)}, Fee - £{zone.fee.toFixed(2)}
                      </span>
                      {zone.name && (
                        <span className="text-[10px] text-slate-400 font-normal ml-auto truncate max-w-[150px]">
                          ({zone.name})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Hours */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Delivery</h3>
                </div>
                <p className="text-xs text-slate-600">Same as opening hours</p>
              </div>

              {/* Table Reservation */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <UtensilsCrossed className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Table reservation</h3>
                </div>
                <p className="text-xs text-slate-600">Same as opening hours</p>
              </div>

              {/* Payment Method */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Payment Method</h3>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">➔</span>
                    <span>Cash (Pickup, Delivery)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">➔</span>
                    <span>Card at pickup counter (Pickup)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">➔</span>
                    <span>Pay online (Pickup, Delivery)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">➔</span>
                    <span>Card online (G-Pay / Apple Pay / Card via Browser) (Pickup, Delivery)</span>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <Phone className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Phone</h3>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {restaurant?.phone || '+44 1905 611911'}
                </p>
              </div>
            </div>

            {/* Right Column: Opening Hours, Pickup, Languages, Address */}
            <div className="space-y-6">
              {/* Opening Hours Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1.5">
                  <Clock className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm sm:text-base">Opening Hours</h3>
                </div>

                <div className="space-y-1.5">
                  {operatingHours.map((hour, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs font-semibold py-1 text-slate-800"
                    >
                      <span>{hour.day || 'Monday - Sunday'}</span>
                      <span className="font-bold text-slate-900">{hour.time || '16:00 - 23:00'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Hours */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <ShoppingBag className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Pickup</h3>
                </div>
                <p className="text-xs text-slate-600">Same as opening hours</p>
              </div>

              {/* Languages Dropdown */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <Globe className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Languages</h3>
                </div>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer shadow-xs"
                  >
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="Italiano">Italiano</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-1">
                  <MapPin className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm">Address</h3>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {restaurant?.address || 'Balti Mahal 37 Astwood Road, Worcester WR3 8ER'}
                </p>
              </div>

              {/* Quick Action to switch back to menu */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('menu')}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Return to Menu & Order Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Branding Footer */}
          <div className="pt-8 text-center text-[11px] text-slate-400 border-t border-slate-200">
            <span>Powered by GloriaFood Multi-Tenant Platform Engine</span>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: FOOD ORDERING MENU (SCREENSHOT 1)
           ========================================================= */
        <>
          {/* 2. Top Food Banner Image */}
          <div className="relative w-full h-44 sm:h-56 md:h-64 bg-slate-900 overflow-hidden">
            <img
              src={defaultBanner}
              alt={restaurant?.name || 'Restaurant Food'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"></div>
          </div>

          {/* 3. Deal / Promotion Banner Overlay with Rich Background & Auto-Swapping */}
          <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 -mt-10 sm:-mt-14 relative z-20 mb-6">
            {activeOffers.length > 0 && currentFeaturedOffer ? (
              <div
                onMouseEnter={() => setIsOfferHovered(true)}
                onMouseLeave={() => setIsOfferHovered(false)}
                className="relative bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden group transition-all duration-300"
              >
                {/* Full-bleed background food image with subtle crossfade / Ken Burns scale */}
                <div
                  key={`offer-bg-${activeOfferIndex}`}
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 animate-in fade-in zoom-in-95 pointer-events-none"
                  style={{ backgroundImage: `url(${currentOfferBg})` }}
                />

                {/* Layered dark gradients for crystal-clear readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/45 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

                {/* Animated countdown progress bar for timed auto-swapping */}
                {activeOffers.length > 1 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
                    <div
                      key={`progress-${activeOfferIndex}-${isOfferHovered}`}
                      className={`h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 ${
                        isOfferHovered ? 'w-full opacity-60' : 'animate-offer-progress'
                      }`}
                    />
                  </div>
                )}

                {/* Desktop-only Previous / Next Offer side chevrons */}
                {activeOffers.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOfferIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
                      }}
                      aria-label="Previous Offer"
                      className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-orange-600 text-white items-center justify-center backdrop-blur-xs transition z-20 cursor-pointer border border-white/15 opacity-80 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOfferIndex((prev) => (prev + 1) % activeOffers.length);
                      }}
                      aria-label="Next Offer"
                      className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-orange-600 text-white items-center justify-center backdrop-blur-xs transition z-20 cursor-pointer border border-white/15 opacity-80 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Card Content Container */}
                <div className="p-3.5 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-white relative z-10 sm:pl-10 sm:pr-10">
                  <div
                    key={`offer-content-${activeOfferIndex}`}
                    className="space-y-1.5 sm:space-y-2 text-center md:text-left z-10 flex-1 min-w-0 animate-in fade-in duration-300 w-full"
                  >
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white bg-orange-600 px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        {currentFeaturedOffer.discountType === 'PERCENTAGE'
                          ? `${currentFeaturedOffer.discountValue}% OFF SPECIAL`
                          : currentFeaturedOffer.discountType === 'FREE_DELIVERY'
                          ? 'FREE DELIVERY SPECIAL'
                          : `£${currentFeaturedOffer.discountValue?.toFixed(2)} OFF DEAL`}
                      </span>

                      {currentFeaturedOffer.isAutomatic ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-300 bg-emerald-900/50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-xs">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          Auto-Applied at Checkout
                        </span>
                      ) : currentFeaturedOffer.code ? (
                        <button
                          type="button"
                          onClick={() => handleCopyOfferCode(currentFeaturedOffer.code)}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-400/40 cursor-pointer transition backdrop-blur-xs"
                          title="Click to copy promo code"
                        >
                          {copiedOfferCode === currentFeaturedOffer.code ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Code Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Code: <strong>{currentFeaturedOffer.code}</strong></span>
                            </>
                          )}
                        </button>
                      ) : null}

                      {isOfferHovered && activeOffers.length > 1 && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-black/40 px-2 py-0.5 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-xl font-black tracking-tight text-white line-clamp-1 drop-shadow-sm">
                      {currentFeaturedOffer.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-2xl drop-shadow-xs">
                      {currentFeaturedOffer.description || currentFeaturedOffer.bannerText || 'Exclusive promotional savings on your online order.'}
                    </p>

                    {/* Offer meta & interactive indicator pills */}
                    <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                      {currentFeaturedOffer.minOrderAmount > 0 && (
                        <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
                          Min Spend: <strong className="text-white font-bold">£{currentFeaturedOffer.minOrderAmount.toFixed(2)}</strong>
                        </span>
                      )}

                      {/* Interactive slide indicator dots with mobile touch chevrons */}
                      {activeOffers.length > 1 && (
                        <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full border border-white/10 backdrop-blur-xs">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveOfferIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
                            }}
                            aria-label="Previous Offer"
                            className="sm:hidden text-white/70 hover:text-white p-0.5 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {activeOffers.map((off, idx) => (
                              <button
                                key={off.id || idx}
                                type="button"
                                onClick={() => setActiveOfferIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                  activeOfferIndex === idx
                                    ? 'w-5 sm:w-6 bg-orange-500 shadow-xs shadow-orange-500/50'
                                    : 'w-2 bg-white/40 hover:bg-white/70'
                               }`}
                                title={`Deal ${idx + 1}: ${off.title}`}
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveOfferIndex((prev) => (prev + 1) % activeOffers.length);
                            }}
                            aria-label="Next Offer"
                            className="sm:hidden text-white/70 hover:text-white p-0.5 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsOffersModalOpen(true)}
                        className="text-orange-400 hover:text-orange-300 font-extrabold flex items-center gap-1 cursor-pointer text-xs underline underline-offset-2 ml-auto"
                      >
                        <span>View All Offers ({activeOffers.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Promo Graphic Thumbnail */}
                  <div className="hidden sm:flex items-center -space-x-3 shrink-0 z-10">
                    {currentFeaturedOffer.bannerImageUrl ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl relative group">
                        <img
                          src={currentFeaturedOffer.bannerImageUrl}
                          alt={currentFeaturedOffer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80"
                          alt="Promo Dish 1"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover shadow-lg"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80"
                          alt="Promo Dish 2"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover shadow-lg"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80"
                          alt="Promo Dish 3"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover shadow-lg"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    <Star className="w-3 h-3 fill-current" />
                    Official Online Ordering Portal
                  </span>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Freshly Prepared & Delivered Fast
                  </h2>
                  <p className="text-xs text-slate-300">
                    Direct ordering with 0% middleman commission fee and guaranteed quick prep times.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Kitchen</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Main Menu Feed - Two Column GloriaFood Style with Category Image & Left-aligned Dish Images */}
          <main className="max-w-5xl w-full mx-auto px-4 py-4 flex-1 space-y-12">
            {restaurant?.categories?.map((cat) => {
              const items = cat.items || [];
              if (items.length === 0) return null;

              // Split items for 2-column GloriaFood layout
              const midpoint = Math.ceil(items.length / 2);
              const leftItems = items.slice(0, midpoint);
              const rightItems = items.slice(midpoint);

              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="scroll-mt-20 space-y-4"
                >
                  {/* Category Header (Name Only) */}
                  <div className="border-b-2 border-slate-900/10 pb-1.5 flex items-baseline justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight font-sans">
                      {cat.name}
                    </h2>
                  </div>

                  {/* Mobile-Only Category Banner Image Card (Rendered directly after Category Name on mobile) */}
                  {cat.imageUrl && (
                    <div className="block md:hidden w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-xs relative border border-slate-200 bg-slate-900 group my-2">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-black text-xs uppercase tracking-wider bg-orange-600 px-2 py-0.5 rounded-md shadow-xs">
                          {cat.name}
                        </span>
                        {cat.description && (
                          <p className="text-[11px] text-slate-200 mt-1 line-clamp-1 drop-shadow-sm">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Two Column Menu Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                    {/* Left Column Items */}
                    <div className="space-y-2 divide-y divide-slate-100">
                      {leftItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenItem({ ...item, categoryName: cat.name, categoryId: cat.id })}
                          className="group py-2.5 px-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3.5"
                        >
                          {/* Left-aligned Dish Image */}
                          {item.imageUrl && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-orange-600 transition-colors leading-snug truncate">
                                {item.name}
                              </h3>
                              <span className="font-extrabold text-slate-900 text-sm sm:text-[15px] shrink-0">
                                £{item.basePrice.toFixed(2)}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column Items with Desktop-only Category Banner Image on Top */}
                    <div className="space-y-3">
                      {/* Show Category/Menu Image in the featured card slot on desktop only */}
                      {cat.imageUrl && (
                        <div className="hidden md:block w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-xs relative border border-slate-200 bg-slate-900 group">
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <span className="font-black text-xs uppercase tracking-wider bg-orange-600 px-2 py-0.5 rounded-md shadow-xs">
                              {cat.name}
                            </span>
                            {cat.description && (
                              <p className="text-[11px] text-slate-200 mt-1 line-clamp-1 drop-shadow-sm">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 divide-y divide-slate-100">
                        {rightItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleOpenItem({ ...item, categoryName: cat.name, categoryId: cat.id })}
                            className="group py-2.5 px-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3.5"
                          >
                            {/* Left-aligned Dish Image */}
                            {item.imageUrl && (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-orange-600 transition-colors leading-snug truncate">
                                  {item.name}
                                </h3>
                                <span className="font-extrabold text-slate-900 text-sm sm:text-[15px] shrink-0">
                                  £{item.basePrice.toFixed(2)}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </main>
        </>
      )}

      {/* Floating Bottom Cart Bar (Mobile Sticky) */}
      {cartCount > 0 && (
        <div className="sticky bottom-3 left-0 right-0 z-40 px-3 sm:hidden animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-500 hover:to-amber-500 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs sm:text-sm cursor-pointer border border-white/20"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-black/30 px-2 py-1 rounded-lg text-xs font-black shrink-0">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              {cartTotal >= (bestAutoOffer?.minOrderAmount || 25) ? (
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse shadow-xs">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>FREE DELIVERY</span>
                </span>
              ) : (
                <span className="truncate font-bold">View Your Order</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 font-black shrink-0">
              <span>£{cartTotal.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setSelectedItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        restaurant={restaurant}
        serviceType={serviceType}
        setServiceType={setServiceType}
      />

      {/* Exclusive Restaurant Deals & Offers Modal Popup */}
      {isOffersModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Exclusive Deals & Special Offers
                  </h3>
                  <p className="text-xs text-orange-100">
                    Apply promo codes at checkout or enjoy automated savings on qualifying orders.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffersModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {activeOffers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Tag className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-sm font-bold">No active promotional deals right now.</p>
                  <p className="text-xs text-slate-400">Check back soon for seasonal specials!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeOffers.map((off) => {
                    const isPct = off.discountType === 'PERCENTAGE';
                    const isFreeDel = off.discountType === 'FREE_DELIVERY';
                    const isBogo = off.discountType === 'BOGO';
                    const isSpendReward = off.discountType === 'SPEND_GET_FREE_ITEM';

                    return (
                      <div
                        key={off.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition duration-200"
                      >
                        {/* Offer Graphic Banner */}
                        <div className="relative h-28 bg-slate-950 overflow-hidden">
                          {off.bannerImageUrl ? (
                            <img
                              src={off.bannerImageUrl}
                              alt={off.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-r from-orange-600 to-amber-600 flex items-center justify-center text-white/50">
                              <Sparkles className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>

                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-orange-600 text-white uppercase tracking-wider shadow-xs">
                              {isPct
                                ? `${off.discountValue}% OFF`
                                : isFreeDel
                                ? 'FREE DELIVERY'
                                : isBogo
                                ? `BUY ${off.buyQuantity || 1} GET ${off.getQuantity || 1} FREE`
                                : isSpendReward
                                ? 'FREE DISH REWARD'
                                : `£${(off.discountValue || 0).toFixed(2)} OFF`}
                            </span>
                          </div>

                          {off.bannerText && (
                            <div className="absolute bottom-2 left-2.5 right-2.5">
                              <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs line-clamp-1">
                                {off.bannerText}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-slate-900 leading-tight">
                              {off.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {off.description || 'Applies at checkout when minimum order requirements are satisfied.'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              Min Spend: <strong>{off.minOrderAmount > 0 ? `£${off.minOrderAmount.toFixed(2)}` : 'None'}</strong>
                            </span>

                            {off.isAutomatic ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-[11px] flex items-center gap-1">
                                <Zap className="w-3 h-3 text-emerald-600" />
                                <span>Auto-Applied</span>
                              </span>
                            ) : off.code ? (
                              <button
                                type="button"
                                onClick={() => handleCopyOfferCode(off.code)}
                                className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg font-mono font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              >
                                {copiedOfferCode === off.code ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{off.code}</span>
                                  </>
                                )}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Offers automatically apply or validate with your cart at checkout.
              </span>
              <button
                type="button"
                onClick={() => setIsOffersModalOpen(false)}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
