'use client';

import React, { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import ItemModal from '@/components/ItemModal';
import CartDrawer from '@/components/CartDrawer';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Star,
  Search,
  Plus,
  X,
  ShoppingBag,
  ExternalLink,
  Flame,
  ShieldCheck,
  Phone,
} from 'lucide-react';

export default function EmbedMenuPage({ params }) {
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

  // Close message sender to parent window
  const handleCloseModal = () => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ type: 'CLOSE_FOOD_ORDERING_MODAL' }, '*');
      // If not framed, fallback to menu page
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
          if (json.data.categories && json.data.categories.length > 0) {
            setActiveCategory(json.data.categories[0].id);
          }
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-300">Loading online ordering system...</p>
      </div>
    );
  }

  const allDietaryTags = ['ALL', 'Vegetarian', 'Spicy', 'Popular', 'Gourmet', 'Vegan'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {/* Embed Modal Header */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 font-extrabold shadow-md shadow-orange-600/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {restaurant?.name || 'Online Ordering'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  4.9
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-orange-400 shrink-0" />
                <span>Prep: ~{restaurant?.estimatedPrepTime || 25} mins</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Accepting Orders</span>
              </p>
            </div>
          </div>

          {/* Right actions: Service Switcher, Cart button, Close button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Service Toggle */}
            <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setServiceType('DELIVERY')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  serviceType === 'DELIVERY'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setServiceType('PICKUP')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  serviceType === 'PICKUP'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pickup
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">${cartTotal.toFixed(2)}</span>
              {cartCount > 0 && (
                <span className="bg-white text-orange-600 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              aria-label="Close Ordering Modal"
              title="Close Modal"
              className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-850 px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Horizontal Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {restaurant?.categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const el = document.getElementById(`cat-section-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.name} ({cat.items?.length || 0})
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative shrink-0 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food items..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dietary Pills Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 sticky top-[105px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 mr-1 hidden sm:inline">
            Filters:
          </span>
          {allDietaryTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag === 'ALL' ? 'All' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Menu Feed */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 space-y-8">
        {restaurant?.categories?.map((cat) => {
          const visibleItems = cat.items?.filter(filterItem) || [];
          if (visibleItems.length === 0 && (searchQuery || selectedTag !== 'ALL')) {
            return null;
          }

          return (
            <section
              key={cat.id}
              id={`cat-section-${cat.id}`}
              className="scroll-mt-36 space-y-3.5"
            >
              <div className="border-b border-slate-200 pb-2 flex items-baseline justify-between">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {cat.name}
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {visibleItems.length} items
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-400 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Price Badge */}
                      <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-900 font-black text-xs shadow-md">
                        ${item.basePrice.toFixed(2)}
                      </div>

                      {/* Dietary Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                        {item.dietaryTags?.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-400">
                          {item.optionGroups?.length > 0 ? 'Customizable' : 'Standard'}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1 bg-orange-50 group-hover:bg-orange-600 text-orange-600 group-hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
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

      {/* Floating Bottom Cart Bar (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-3 left-3 right-3 z-30 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl shadow-xl flex items-center justify-between font-bold text-xs"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded-md">
              {cartCount} items
            </span>
            <span>View Cart</span>
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
