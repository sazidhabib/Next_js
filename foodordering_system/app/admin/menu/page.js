'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  UtensilsCrossed,
  Plus,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  Tag,
  Layers,
} from 'lucide-react';

export default function AdminMenuPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('');

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCatForAdd, setSelectedCatForAdd] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemTags, setNewItemTags] = useState('Popular,Chef Special');

  const loadMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/restaurant?slug=bellavista-pizza');
      const json = await res.json();
      if (json.success && json.data) {
        setRestaurant(json.data);
        if (json.data.categories && json.data.categories.length > 0) {
          setActiveCategoryId(json.data.categories[0].id);
          setSelectedCatForAdd(json.data.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Toggle in-stock / out-of-stock
  const handleToggleStock = async (itemId) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-availability',
          itemId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Update local state
        setRestaurant((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          for (const cat of next.categories) {
            for (const it of cat.items) {
              if (it.id === itemId) {
                it.isAvailable = !it.isAvailable;
                toast.info(`"${it.name}" is now ${it.isAvailable ? 'in stock' : 'out of stock'}`);
              }
            }
          }
          return next;
        });
      } else {
        toast.error(json.error || 'Failed to update item availability');
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      toast.error('Network error updating item');
    }
  };

  // Add new menu item
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !selectedCatForAdd) return;

    try {
      const payload = {
        action: 'add-item',
        categoryId: selectedCatForAdd,
        itemData: {
          name: newItemName,
          description: newItemDesc,
          basePrice: parseFloat(newItemPrice),
          imageUrl:
            newItemImage ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          dietaryTags: newItemTags.split(',').map((t) => t.trim()),
          isFeatured: true,
        },
      };

      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`"${newItemName}" added to menu!`);
        setIsAddModalOpen(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemPrice('');
        setNewItemImage('');
        loadMenu();
      } else {
        toast.error(json.error || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      toast.error('Network error adding menu item');
    }
  };

  const activeCategory = restaurant?.categories?.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Visual Menu & Modifier Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize dishes, categories, pricing, and modifier groups (Sizes, Crusts, Toppings).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Category Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {restaurant?.categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryId === cat.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.name} ({cat.items?.length || 0})
          </button>
        ))}
      </div>

      {/* Dishes List in Active Category */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-bold">
          Loading menu items...
        </div>
      ) : activeCategory ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white">
              {activeCategory.name}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {activeCategory.items?.length || 0} items configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCategory.items?.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-40 bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-extrabold text-xs">
                    ${item.basePrice?.toFixed(2)}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Modifiers badge */}
                  {item.optionGroups && item.optionGroups.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Modifier Groups:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.optionGroups.map((og, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-800 text-orange-300 text-[10px] px-2 py-0.5 rounded"
                          >
                            {og.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Toggle Footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      ></span>
                      <span className="text-xs font-bold text-slate-300">
                        {item.isAvailable ? 'In Stock (Available)' : 'Sold Out (Hidden)'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleStock(item.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Make Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Add New Dish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Target Category</label>
                <select
                  value={selectedCatForAdd}
                  onChange={(e) => setSelectedCatForAdd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                >
                  {restaurant?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Dish Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Quattro Formaggi Supreme"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Ingredients and culinary notes..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="18.50"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Dietary Tags</label>
                  <input
                    type="text"
                    value={newItemTags}
                    onChange={(e) => setNewItemTags(e.target.value)}
                    placeholder="Vegetarian, Chef Special"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                />
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
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
