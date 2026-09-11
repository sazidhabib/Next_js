'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  Sparkles,
  Layers,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';
import MediaPickerModal from '@/components/MediaPickerModal';

export default function AdminMenuPage() {
  const { selectedRestaurant } = useAdmin();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('');

  // Category Modal State (Add & Edit)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  // Dish Modal State (Add & Edit)
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishTargetCat, setDishTargetCat] = useState('');
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishSaving, setDishSaving] = useState(false);

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'category' | 'dish'
  const [mediaPickerTitle, setMediaPickerTitle] = useState('Media Library');

  const activeSlug = selectedRestaurant?.slug || 'bellavista-pizza';

  const loadMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/restaurant?slug=${activeSlug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setRestaurant(json.data);
        if (json.data.categories && json.data.categories.length > 0) {
          // Keep active category if still valid, otherwise default to first
          setActiveCategoryId((prev) => {
            const exists = json.data.categories.some((c) => c.id === prev);
            return exists ? prev : json.data.categories[0].id;
          });
          setDishTargetCat((prev) => {
            const exists = json.data.categories.some((c) => c.id === prev);
            return exists ? prev : json.data.categories[0].id;
          });
        } else {
          setActiveCategoryId('');
          setDishTargetCat('');
        }
      }
    } catch (err) {
      console.error('Error loading menu:', err);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [activeSlug]);

  // ==========================================
  // MEDIA PICKER HANDLERS
  // ==========================================
  const openCategoryMediaPicker = () => {
    setMediaPickerTarget('category');
    setMediaPickerTitle('Select Category Image');
    setIsMediaPickerOpen(true);
  };

  const openDishMediaPicker = () => {
    setMediaPickerTarget('dish');
    setMediaPickerTitle('Select Dish Image');
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelected = (imageUrl) => {
    if (mediaPickerTarget === 'category') {
      setCatImage(imageUrl);
    } else if (mediaPickerTarget === 'dish') {
      setDishImage(imageUrl);
    }
  };

  // ==========================================
  // CATEGORY ACTIONS (CREATE / EDIT / DELETE)
  // ==========================================
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatImage('');
    setIsCatModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name || '');
    setCatDesc(cat.description || '');
    setCatImage(cat.imageUrl || '');
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.warning('Please enter category name');
      return;
    }

    try {
      setCatSaving(true);
      if (editingCategory) {
        // Update existing category
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-category',
            categoryId: editingCategory.id,
            categoryData: {
              name: catName.trim(),
              description: catDesc.trim(),
              imageUrl: catImage.trim() || null,
            },
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success(`Category "${catName}" updated!`);
          setIsCatModalOpen(false);
          loadMenu();
        } else {
          toast.error(json.error || 'Failed to update category');
        }
      } else {
        // Create new category
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-category',
            restaurantId: restaurant?.id,
            categoryData: {
              name: catName.trim(),
              description: catDesc.trim(),
              imageUrl: catImage.trim() || null,
            },
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success(`Category "${catName}" created!`);
          setIsCatModalOpen(false);
          await loadMenu();
          if (json.data?.id) {
            setActiveCategoryId(json.data.id);
            setDishTargetCat(json.data.id);
          }
        } else {
          toast.error(json.error || 'Failed to create category');
        }
      }
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error('Network error saving category');
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${cat.name}" and all its dishes?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-category',
          categoryId: cat.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.info(`Category "${cat.name}" deleted.`);
        loadMenu();
      } else {
        toast.error(json.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Network error deleting category');
    }
  };

  // ==========================================
  // DISH ACTIONS (CREATE / EDIT / DELETE / STOCK)
  // ==========================================
  const openAddDishModal = () => {
    setEditingDish(null);
    setDishTargetCat(activeCategoryId || restaurant?.categories?.[0]?.id || '');
    setDishName('');
    setDishDesc('');
    setDishPrice('');
    setDishImage('');
    setIsDishModalOpen(true);
  };

  const openEditDishModal = (item, catId) => {
    setEditingDish(item);
    setDishTargetCat(catId);
    setDishName(item.name || '');
    setDishDesc(item.description || '');
    setDishPrice(item.basePrice !== undefined ? String(item.basePrice) : '');
    setDishImage(item.imageUrl || '');
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    if (!dishName.trim() || dishPrice === '' || !dishTargetCat) {
      toast.warning('Please enter dish name, target category, and base price.');
      return;
    }

    try {
      setDishSaving(true);
      if (editingDish) {
        // Update existing dish
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-item',
            itemId: editingDish.id,
            itemData: {
              categoryId: dishTargetCat,
              name: dishName.trim(),
              description: dishDesc.trim(),
              basePrice: parseFloat(dishPrice) || 0,
              imageUrl: dishImage.trim() || null,
            },
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success(`"${dishName}" updated!`);
          setIsDishModalOpen(false);
          loadMenu();
        } else {
          toast.error(json.error || 'Failed to update dish');
        }
      } else {
        // Create new dish
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-item',
            categoryId: dishTargetCat,
            itemData: {
              name: dishName.trim(),
              description: dishDesc.trim(),
              basePrice: parseFloat(dishPrice) || 0,
              imageUrl: dishImage.trim() || null,
              isFeatured: true,
              isAvailable: true,
            },
          }),
        });
        const json = await res.json();
        if (json.success) {
          toast.success(`"${dishName}" added to menu!`);
          setIsDishModalOpen(false);
          loadMenu();
        } else {
          toast.error(json.error || 'Failed to add dish');
        }
      }
    } catch (err) {
      console.error('Error saving dish:', err);
      toast.error('Network error saving dish');
    } finally {
      setDishSaving(false);
    }
  };

  const handleDeleteDish = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-item',
          itemId: item.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.info(`"${item.name}" deleted.`);
        loadMenu();
      } else {
        toast.error(json.error || 'Failed to delete dish');
      }
    } catch (err) {
      console.error('Error deleting dish:', err);
      toast.error('Network error deleting dish');
    }
  };

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
        setRestaurant((prev) => {
          if (!prev) return prev;
          const next = JSON.parse(JSON.stringify(prev));
          for (const cat of next.categories || []) {
            for (const it of cat.items || []) {
              if (it.id === itemId) {
                it.isAvailable = !it.isAvailable;
                toast.info(`"${it.name}" is now ${it.isAvailable ? 'in stock' : 'sold out'}`);
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

  const activeCategory = restaurant?.categories?.find(
    (c) => c.id === activeCategoryId
  );

  const filteredItems = activeCategory?.items?.filter((it) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.name?.toLowerCase().includes(q) ||
      it.description?.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            <span>Targeted Menu & Category Manager</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create custom categories, upload high-resolution dish images, adjust pricing, and manage live availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddCategoryModal}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-orange-400" />
            <span>+ Add Category</span>
          </button>

          <button
            onClick={openAddDishModal}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Quick Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>Menu Categories ({restaurant?.categories?.length || 0})</span>
          </span>

          {activeCategory && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditCategoryModal(activeCategory)}
                className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-orange-400" />
                <span>Edit &quot;{activeCategory.name}&quot;</span>
              </button>

              <button
                onClick={() => handleDeleteCategory(activeCategory)}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-red-900/40 transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {restaurant?.categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer ${
                activeCategoryId === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-5 h-5 rounded-md object-cover border border-white/20"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-orange-400/60" />
              )}
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeCategoryId === cat.id
                    ? 'bg-orange-700 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {cat.items?.length || 0}
              </span>
            </button>
          ))}

          <button
            onClick={openAddCategoryModal}
            className="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-950 border border-dashed border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/50 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Dishes List in Active Category */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-bold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading restaurant menu...</span>
        </div>
      ) : !activeCategory ? (
        <div className="py-20 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 p-6">
          <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mx-auto">
            <FolderPlus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No categories created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by adding your first targeted category (e.g. Starters, Main Course, Sourdough Pizzas, Desserts).
          </p>
          <button
            onClick={openAddCategoryModal}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Category Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{activeCategory.name}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({filteredItems.length} dishes)
                </span>
              </h2>
              {activeCategory.description && (
                <p className="text-xs text-slate-400 mt-0.5">{activeCategory.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 w-44 sm:w-56"
                />
              </div>

              <button
                onClick={openAddDishModal}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dish</span>
              </button>
            </div>
          </div>

          {/* Dishes Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-16 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 p-6">
              <p className="text-xs text-slate-400">
                {searchQuery
                  ? `No dishes match "${searchQuery}".`
                  : `No dishes added to "${activeCategory.name}" yet.`}
              </p>
              <button
                onClick={openAddDishModal}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                + Add a dish to {activeCategory.name}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
                >
                  {/* Image & Price */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center gap-2 p-4 text-center border-b border-slate-800/80 select-none">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <UtensilsCrossed className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          No image uploaded
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-extrabold text-xs shadow-md border border-white/10">
                      £{item.basePrice?.toFixed(2)}
                    </div>

                    {/* Quick Edit/Delete Overlay in top-left */}
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <button
                        onClick={() => openEditDishModal(item, activeCategory.id)}
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-orange-600 text-white backdrop-blur-md transition-all cursor-pointer"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDish(item)}
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-red-600 text-white backdrop-blur-md transition-all cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm leading-snug">{item.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Modifiers badge if any */}
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

                    {/* Stock Toggle Footer & Edit Action */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        ></span>
                        <span className="text-[11px] font-bold text-slate-300">
                          {item.isAvailable ? 'Available' : 'Sold Out'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStock(item.id)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            item.isAvailable
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              : 'bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300'
                          }`}
                        >
                          {item.isAvailable ? 'Mark Out' : 'Enable'}
                        </button>

                        <button
                          onClick={() => openEditDishModal(item, activeCategory.id)}
                          className="text-[11px] font-bold text-orange-400 hover:text-orange-300 px-2 py-1 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          CATEGORY MODAL (ADD & EDIT)
         ========================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-orange-400" />
                <span>{editingCategory ? 'Edit Category' : 'Create Targeted Category'}</span>
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Starters & Appetizers, Sourdough Pizzas, Desserts"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description (Optional)</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief note about this category shown to customers..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Category Image Picker */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Category Image</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto WebP Optimized
                  </span>
                </label>

                {catImage ? (
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img
                      src={catImage}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={openCategoryMediaPicker}
                        className="image-overlay-btn bg-slate-900/95 hover:bg-slate-800 text-white! px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-slate-700 cursor-pointer"
                        style={{ color: '#ffffff' }}
                      >
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-white!" style={{ color: '#ffffff' }}>Change Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatImage('')}
                        className="bg-rose-600 hover:bg-rose-500 text-white! px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                        style={{ color: '#ffffff' }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white!" />
                        <span className="text-white!" style={{ color: '#ffffff' }}>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openCategoryMediaPicker}
                    className="w-full border-2 border-dashed border-slate-700 hover:border-orange-500/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/60 transition-colors flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-white">
                      Choose / Upload Category Image
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Pick from Media Library or upload a new photo
                    </p>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={catSaving}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {catSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DISH MODAL (ADD & EDIT WITH MEDIA PICKER)
         ========================================================= */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                <span>{editingDish ? 'Edit Dish' : 'Add New Dish'}</span>
              </h3>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              {/* Target Category Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Target Category *</label>
                <select
                  value={dishTargetCat}
                  onChange={(e) => setDishTargetCat(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                >
                  {restaurant?.categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dish Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Dish Name *</label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Quattro Formaggi Supreme"
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Base Price (£) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Base Price (£) *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-bold text-slate-400 text-sm">£</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    placeholder="18.50"
                    required
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-7 p-2.5 text-xs font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Ingredients, culinary notes, and preparation style..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Dish Image Picker */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Dish Image</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto WebP Optimized
                  </span>
                </label>

                {dishImage ? (
                  <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img
                      src={dishImage}
                      alt="Dish Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={openDishMediaPicker}
                        className="image-overlay-btn bg-slate-900/95 hover:bg-slate-800 text-white! px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-slate-700 cursor-pointer"
                        style={{ color: '#ffffff' }}
                      >
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-white!" style={{ color: '#ffffff' }}>Change Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDishImage('')}
                        className="bg-rose-600 hover:bg-rose-500 text-white! px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                        style={{ color: '#ffffff' }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white!" />
                        <span className="text-white!" style={{ color: '#ffffff' }}>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openDishMediaPicker}
                    className="w-full border-2 border-dashed border-slate-700 hover:border-orange-500/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/60 transition-colors flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-xs font-bold text-white">
                      Choose / Upload Dish Image
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Pick from Media Library or upload a new photo
                    </p>
                  </button>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dishSaving}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {dishSaving ? 'Saving...' : editingDish ? 'Save Changes' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CENTRALIZED REUSABLE MEDIA PICKER MODAL
         ========================================================= */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleMediaSelected}
        currentImage={mediaPickerTarget === 'category' ? catImage : dishImage}
        title={mediaPickerTitle}
      />
    </div>
  );
}
