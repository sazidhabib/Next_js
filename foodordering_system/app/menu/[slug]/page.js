'use client';

import React, { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import ItemModal from '@/components/ItemModal';
import CartDrawer from '@/components/CartDrawer';
import RestaurantZoneInfoMap from '@/components/RestaurantZoneInfoMap';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Star,
  Sparkles,
  Search,
  Check,
  Plus,
  Info,
  ChevronRight,
  ShieldCheck,
  Phone,
  Flame,
  X,
  Truck,
  Tag,
  Copy,
  BadgePercent,
  Zap,
  CheckCircle2,
  Gift,
} from 'lucide-react';

export default function MenuPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug || 'bellavista-pizza';

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [serviceType, setServiceType] = useState('DELIVERY');

  // Zone info modal state
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [hoveredZoneIdx, setHoveredZoneIdx] = useState(null);

  // Offers modal state
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [copiedOfferCode, setCopiedOfferCode] = useState(null);

  // Item customization modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch restaurant data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurant?slug=${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setRestaurant(json.data);
          if (json.data.categories && json.data.categories.length > 0) {
            setActiveCategory(json.data.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load menu:', err);
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

  const handleCopyOfferCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedOfferCode(code);
    toast.success(`Copied code "${code}"! Apply it at checkout.`);
    setTimeout(() => setCopiedOfferCode(null), 2500);
  };

  const activeOffers = (restaurant?.offers || []).filter((o) => o.isActive);
  const bestAutoOffer = activeOffers.find((o) => o.isAutomatic && o.minOrderAmount > 0) || activeOffers[0];

  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  // Open item modal for customization
  const handleOpenItem = (item) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  // Filter items by search query
  const filterItem = (item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-700">
          Loading gourmet menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar
        restaurant={restaurant}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        serviceType={serviceType}
        setServiceType={setServiceType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Top Promotional Offers Ribbon */}
      {activeOffers.length > 0 && (
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-2 px-4 shadow-sm relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shrink-0 flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-300" />
                <span>OFFERS & DEALS</span>
              </span>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar font-bold whitespace-nowrap">
                {activeOffers.map((off) => (
                  <button
                    key={off.id}
                    type="button"
                    onClick={() => {
                      if (off.code) handleCopyOfferCode(off.code);
                      else setIsOffersModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <span>{off.bannerText || off.title}</span>
                    {off.code && (
                      <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-[11px] border border-white/20">
                        {off.code}
                      </span>
                    )}
                    <span className="text-orange-200 ml-1">•</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOffersModalOpen(true)}
              className="font-extrabold hover:text-amber-200 shrink-0 text-xs flex items-center gap-1 bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full border border-white/10 transition cursor-pointer"
            >
              <span>View Deals ({activeOffers.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src={
              restaurant?.bannerUrl ||
              'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop&q=80'
            }
            alt="Restaurant Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Wood-Fired & Artisanal
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  4.9 (420+ Reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {restaurant?.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {restaurant?.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="line-clamp-1">{restaurant?.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{restaurant?.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Fulfilment card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white space-y-3 shrink-0 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Service Mode</span>
                <span className="text-xs font-bold bg-orange-600 px-2 py-0.5 rounded-md">
                  {serviceType}
                </span>
              </div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-300">Est. Time</span>
                <span className="font-bold text-emerald-400">
                  {restaurant?.estimatedPrepTime || 25} - {(restaurant?.estimatedPrepTime || 25) + 15} mins
                </span>
              </div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-300">Delivery Zones</span>
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(true)}
                  className="text-orange-300 hover:text-orange-200 font-bold underline cursor-pointer text-xs flex items-center gap-1"
                >
                  <span>View Map & Fees</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeOffers.length > 0 && (
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Active Deals</span>
                  <button
                    type="button"
                    onClick={() => setIsOffersModalOpen(true)}
                    className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeOffers.length} Offers Available</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {restaurant?.categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const el = document.getElementById(`section-${cat.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                )}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === cat.id
                      ? 'bg-orange-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.items?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Deal Unlock Progress Bar */}
      {cartItems.length > 0 && bestAutoOffer && bestAutoOffer.minOrderAmount > 0 && (
        <div className="bg-amber-50/90 border-b border-amber-200 py-2.5 px-4 sticky top-30 z-20 shadow-xs backdrop-blur-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <div className="p-1 bg-amber-500/20 text-amber-700 rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
              {cartTotal >= bestAutoOffer.minOrderAmount ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  <span>🎉 Deal Unlocked! You qualify for {bestAutoOffer.title}!</span>
                </span>
              ) : (
                <span>
                  Add <strong className="text-orange-600">£{(bestAutoOffer.minOrderAmount - cartTotal).toFixed(2)}</strong> more to your cart to unlock <strong className="text-amber-900">{bestAutoOffer.title}</strong>!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-36 sm:w-48 bg-amber-200/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal / bestAutoOffer.minOrderAmount) * 100)}%` }}
                ></div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffersModalOpen(true)}
                className="text-[11px] font-bold text-orange-700 hover:underline cursor-pointer"
              >
                All Deals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {restaurant?.categories?.map((cat) => {
          const visibleItems = cat.items?.filter(filterItem) || [];
          if (visibleItems.length === 0 && searchQuery) return null;

          return (
            <section
              key={cat.id}
              id={`section-${cat.id}`}
              className="space-y-6 scroll-mt-36"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 pb-4">
                {cat.imageUrl && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Grid - 2 columns on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem({ ...item, categoryName: cat.name, categoryId: cat.id })}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex items-stretch p-3.5 sm:p-4 gap-3.5 sm:gap-4 cursor-pointer"
                  >
                    {/* Left: Dish Image (if available) */}
                    {item.imageUrl && (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 self-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Right: Dish Info & Actions */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                          <span className="font-extrabold text-slate-900 text-sm sm:text-base shrink-0">
                            £{item.basePrice.toFixed(2)}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.optionGroups && item.optionGroups.length > 0
                            ? 'Customizable'
                            : 'Standard Recipe'}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1 bg-orange-50 group-hover:bg-orange-600 text-orange-600 group-hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Mobile Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3.5 rounded-2xl shadow-xl shadow-orange-600/40 flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                {cartCount} items
              </span>
              <span>View Your Cart</span>
            </div>
            <span>£{cartTotal.toFixed(2)}</span>
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

      {/* Delivery Zones & Pricing Info Modal */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Delivery Zones & Fees Map
                </h3>
              </div>
              <button
                onClick={() => setIsZoneModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Interactive Zone Map */}
              <RestaurantZoneInfoMap
                restaurantLocation={{
                  lat: restaurant?.latitude || 51.5133,
                  lng: restaurant?.longitude || -0.1362,
                  name: restaurant?.name || 'Restaurant Location',
                }}
                zones={restaurant?.deliveryZones || []}
                hoveredZoneIndex={hoveredZoneIdx}
                onHoverZone={setHoveredZoneIdx}
              />

              {/* Delivery Zone Rates List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Configured Delivery Zones & Minimums
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(restaurant?.deliveryZones || []).map((zone, idx) => (
                    <div
                      key={zone.id || idx}
                      onMouseEnter={() => setHoveredZoneIdx(idx)}
                      onMouseLeave={() => setHoveredZoneIdx(null)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        hoveredZoneIdx === idx
                          ? 'bg-orange-50/70 border-orange-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: zone.color || '#ea580c' }}
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {zone.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-orange-600">
                          Fee: £{(zone.deliveryFee || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Min Order: £{(zone.minOrderAmount || 0).toFixed(2)}</span>
                        {zone.freeDeliveryThreshold > 0 && (
                          <span className="text-emerald-600 font-medium">
                            Free over £{zone.freeDeliveryThreshold.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsZoneModalOpen(false)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exclusive Restaurant Deals & Offers Modal */}
      {isOffersModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Exclusive Deals & Special Offers
                  </h3>
                  <p className="text-xs text-orange-100">
                    Apply promo codes at checkout or enjoy automated discounts on qualifying orders.
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

                    return (
                      <div
                        key={off.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition duration-200"
                      >
                        {/* Offer Graphic */}
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
                                : `£${off.discountValue?.toFixed(2)} OFF`}
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
                Offers automatically validate with your live cart items at checkout.
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
