'use client';

import React, { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import ItemModal from '@/components/ItemModal';
import CartDrawer from '@/components/CartDrawer';
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
    setCartItems((prev) => [...prev, customizedItem]);
    toast.success(`Added "${customizedItem.name || 'item'}" to cart!`);
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
      ? restaurant.deliveryZones.map((z, idx) => ({
          ...z,
          color: defaultZoneColors[idx % defaultZoneColors.length].bg,
          minOrder: z.minOrderAmount || 0,
          fee: z.deliveryFee || 0,
        }))
      : [
          { name: 'Zone 1: Local Center (0-3 km)', minOrder: 0.0, fee: 1.99, color: '#ea580c', radiusKm: 3 },
          { name: 'Zone 2: Inner Ring (3-5 km)', minOrder: 15.0, fee: 2.5, color: '#f59e0b', radiusKm: 5 },
          { name: 'Zone 3: Metro Area (5-8 km)', minOrder: 15.0, fee: 2.5, color: '#06b6d4', radiusKm: 8 },
          { name: 'Zone 4: Outer Ring (8-12 km)', minOrder: 15.0, fee: 3.99, color: '#3b82f6', radiusKm: 12 },
          { name: 'Zone 5: Extended District (12-16 km)', minOrder: 15.0, fee: 3.99, color: '#a855f7', radiusKm: 16 },
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

          {/* Right Action Icons: Menu, Info (Active toggle), Cart, Close */}
          <div className="flex items-stretch h-14 border-l border-slate-300">
            {/* Category Menu Jump Button */}
            <button
              onClick={() => {
                setActiveTab('menu');
                setIsCategoryMenuOpen(!isCategoryMenuOpen);
              }}
              title="Browse Categories"
              className={`px-3.5 sm:px-4 flex items-center justify-center border-r border-slate-300 transition-colors cursor-pointer ${
                activeTab === 'menu' && !isCategoryMenuOpen
                  ? 'text-slate-800 hover:bg-slate-200/70'
                  : 'text-orange-600 bg-slate-200'
              }`}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Restaurant Info & Delivery Zones Button (Active Toggle) */}
            <button
              onClick={() => {
                setActiveTab(activeTab === 'info' ? 'menu' : 'info');
                setIsCategoryMenuOpen(false);
              }}
              title="Restaurant Information & Delivery Zones"
              className={`px-3.5 sm:px-4 flex items-center justify-center border-r border-slate-300 transition-colors cursor-pointer ${
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
              className="px-4 sm:px-5 flex items-center justify-center gap-1.5 text-slate-800 hover:text-orange-600 hover:bg-slate-200/70 border-r border-slate-300 transition-colors relative cursor-pointer font-bold text-sm"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              {cartCount > 0 ? (
                <span className="bg-red-600 text-white text-[11px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center -ml-1">
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
              className="px-3.5 sm:px-4 flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* =========================================================
          VIEW A: RESTAURANT INFO & DELIVERY ZONES (SCREENSHOT 2)
         ========================================================= */}
      {activeTab === 'info' ? (
        <div className="max-w-5xl w-full mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200">
          {/* 1. Visualized Delivery Map Canvas with Zone Rings */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
            {/* Map Tile Background (OpenStreetMap / Google Map realistic styled tiles) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80')",
                filter: 'saturate(0.85) contrast(1.05)',
              }}
            ></div>
            <div className="absolute inset-0 bg-slate-900/10 backdrop-brightness-95"></div>

            {/* Interactive SVG Concentric Delivery Zone Rings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Zone 5 Ring (Purple) */}
              <circle
                cx="400"
                cy="190"
                r="165"
                fill="rgba(168, 85, 247, 0.12)"
                stroke="#a855f7"
                strokeWidth={hoveredZoneIndex === 4 ? '3' : '1.8'}
                strokeDasharray="4 2"
              />
              {/* Zone 4 Ring (Blue) */}
              <circle
                cx="400"
                cy="190"
                r="130"
                fill="rgba(59, 130, 246, 0.14)"
                stroke="#3b82f6"
                strokeWidth={hoveredZoneIndex === 3 ? '3' : '1.8'}
              />
              {/* Zone 3 Ring (Cyan) */}
              <circle
                cx="400"
                cy="190"
                r="95"
                fill="rgba(6, 182, 212, 0.16)"
                stroke="#06b6d4"
                strokeWidth={hoveredZoneIndex === 2 ? '3.5' : '2'}
              />
              {/* Zone 2 Ring (Yellow) */}
              <circle
                cx="400"
                cy="190"
                r="65"
                fill="rgba(245, 158, 11, 0.20)"
                stroke="#f59e0b"
                strokeWidth={hoveredZoneIndex === 1 ? '3.5' : '2'}
              />
              {/* Zone 1 Ring (Orange Inner) */}
              <circle
                cx="400"
                cy="190"
                r="38"
                fill="rgba(234, 88, 12, 0.25)"
                stroke="#ea580c"
                strokeWidth={hoveredZoneIndex === 0 ? '4' : '2.5'}
              />

              {/* Center Map Pin (Red Marker) */}
              <g transform="translate(388, 160)">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"
                  fill="#ef4444"
                  stroke="#991b1b"
                  strokeWidth="1"
                />
                <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
              </g>
            </svg>

            {/* Map UI Badges & Attribution (Google Maps style) */}
            <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>{restaurant?.name || 'Restaurant Location'}</span>
            </div>

            <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-600 shadow-xs">
              Delivery Zone Radius Engine
            </div>
          </div>

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
                        Min - ${zone.minOrder.toFixed(2)}, Fee - ${zone.fee.toFixed(2)}
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

          {/* 3. Deal / Promotion Banner Overlay */}
          <div className="max-w-5xl mx-auto w-full px-4 -mt-10 sm:-mt-14 relative z-20 mb-6">
            <div className="bg-black/90 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white overflow-hidden relative">
              <div className="space-y-1 text-center sm:text-left z-10">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  10% off all collection orders
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Exclusively on our official online ordering portal!
                </p>
                <div className="pt-2 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    <Tag className="w-3 h-3" />
                    Deal applied automatically at checkout
                  </span>
                </div>
              </div>

              {/* Promo Dishes Thumbnail Collage */}
              <div className="flex items-center -space-x-4 shrink-0 z-10">
                <img
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80"
                  alt="Promo Dish 1"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&auto=format&fit=crop&q=80"
                  alt="Promo Dish 2"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80"
                  alt="Promo Dish 3"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* 4. Main Menu Feed - Two Column GloriaFood Style */}
          <main className="max-w-5xl w-full mx-auto px-4 py-4 flex-1 space-y-12">
            {restaurant?.categories?.map((cat) => {
              const items = cat.items || [];
              if (items.length === 0) return null;

              // Split items for 2-column GloriaFood layout
              const midpoint = Math.ceil(items.length / 2);
              const leftItems = items.slice(0, midpoint);
              const rightItems = items.slice(midpoint);

              const featuredItemWithImg =
                items.find((it) => it.imageUrl) || items[0];

              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="scroll-mt-20 space-y-4"
                >
                  {/* Category Header */}
                  <div className="border-b-2 border-slate-900/10 pb-1.5 flex items-baseline justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight font-sans">
                      {cat.name}
                    </h2>
                  </div>

                  {/* Two Column Menu Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                    {/* Left Column Items */}
                    <div className="space-y-1 divide-y divide-slate-100">
                      {leftItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenItem(item)}
                          className="group py-2.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-orange-600 transition-colors leading-snug">
                              {item.name}
                            </h3>
                            <span className="font-extrabold text-slate-900 text-sm sm:text-[15px] shrink-0">
                              {item.basePrice.toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Right Column (Featured Image Top + Remaining Items) */}
                    <div className="space-y-3">
                      {featuredItemWithImg?.imageUrl && (
                        <div
                          onClick={() => handleOpenItem(featuredItemWithImg)}
                          className="w-full h-36 sm:h-44 rounded-xl overflow-hidden shadow-xs cursor-pointer group relative border border-slate-200"
                        >
                          <img
                            src={featuredItemWithImg.imageUrl}
                            alt={featuredItemWithImg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                            <span className="font-extrabold text-xs sm:text-sm drop-shadow-md truncate">
                              {featuredItemWithImg.name}
                            </span>
                            <span className="font-black text-xs sm:text-sm bg-orange-600 px-2 py-0.5 rounded-md shrink-0 shadow-md">
                              ${featuredItemWithImg.basePrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 divide-y divide-slate-100">
                        {rightItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleOpenItem(item)}
                            className="group py-2.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-orange-600 transition-colors leading-snug">
                                {item.name}
                              </h3>
                              <span className="font-extrabold text-slate-900 text-sm sm:text-[15px] shrink-0">
                                {item.basePrice.toFixed(2)}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            )}
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
        <div className="sticky bottom-3 left-0 right-0 z-40 px-4 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                {cartCount} items
              </span>
              <span>View Your Order</span>
            </div>
            <span>${cartTotal.toFixed(2)}</span>
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
    </div>
  );
}
