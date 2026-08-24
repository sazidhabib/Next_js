'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import ItemModal from '@/components/ItemModal';
import CartDrawer from '@/components/CartDrawer';
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
    setIsCartOpen(true);
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
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

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

  // Filter items by category, search query, and dietary tag
  const filterItem = (item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === 'ALL' ||
      (item.dietaryTags &&
        item.dietaryTags.some(
          (t) => t.toLowerCase() === selectedTag.toLowerCase()
        ));

    return matchesSearch && matchesTag;
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

  const allDietaryTags = ['ALL', 'Vegetarian', 'Spicy', 'Popular', 'Gourmet', 'Vegan'];

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
                <span className="text-slate-300">Min. Delivery</span>
                <span className="font-bold text-white">$15.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category & Filter Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({cat.items?.length || 0})
              </button>
            ))}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">
              Filter:
            </span>
            {allDietaryTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag === 'ALL'
                  ? 'All Items'
                  : tag === 'Vegetarian'
                  ? '🌱 Vegetarian'
                  : tag === 'Spicy'
                  ? '🌶️ Spicy'
                  : tag === 'Popular'
                  ? '⭐ Popular'
                  : tag === 'Vegan'
                  ? '🌿 Vegan'
                  : `✨ ${tag}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Menu Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-12">
        {restaurant?.categories?.map((cat) => {
          const visibleItems = cat.items?.filter(filterItem) || [];
          if (visibleItems.length === 0 && (searchQuery || selectedTag !== 'ALL')) {
            return null;
          }

          return (
            <section
              key={cat.id}
              id={`section-${cat.id}`}
              className="scroll-mt-40 space-y-5"
            >
              {/* Category Header */}
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    {/* Item Image */}
                    <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Dietary Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {item.dietaryTags?.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-900 font-extrabold text-sm shadow-md">
                        ${item.basePrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Item Body */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 mt-2">
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
