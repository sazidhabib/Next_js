"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/admin-auth';
import {
  Menu,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Loader2,
  Folder,
  FolderOpen,
  Link as LinkIcon
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminMenu() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected item tracking for editing/adding
  // Format: { level: 0|1|2, path: [catIdx, subIdx, subSubIdx] }
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'edit' | 'add-child' | 'add-root'
  
  // Editor form state
  const [formName, setFormName] = useState('');
  const [formHref, setFormHref] = useState('');

  useEffect(() => {
    if (isAuthorized && token) {
      fetchMenu();
    }
  }, [isAuthorized, token]);

  const parseMenuItems = (menuData) => {
    if (!menuData) return [];
    if (Array.isArray(menuData)) return menuData;
    if (typeof menuData === 'string') {
      try {
        const parsed = JSON.parse(menuData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        const fetchedItems = parseMenuItems(data.data.menuItems);
        setMenuItems(fetchedItems);
      } else {
        setError('Failed to load menu configuration.');
      }
    } catch (err) {
      setError('Network error occurred while fetching settings.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  const saveMenu = async (updatedItems) => {
    const itemsToSave = updatedItems || menuItems;
    try {
      setActionLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ menuItems: itemsToSave })
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(parseMenuItems(data.data.menuItems));
        showNotification('Menu configurations saved successfully!');
        setSelectedItem(null);
        setEditMode(null);
      } else {
        showNotification(data.message || 'Failed to save menu configuration.', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // Sorting handlers
  const handleMoveUp = (level, path) => {
    const updated = JSON.parse(JSON.stringify(menuItems));
    if (level === 0) {
      const idx = path[0];
      if (idx > 0) {
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
      }
    } else if (level === 1) {
      const [cIdx, sIdx] = path;
      const subList = updated[cIdx].subCategories || [];
      if (sIdx > 0) {
        const temp = subList[sIdx];
        subList[sIdx] = subList[sIdx - 1];
        subList[sIdx - 1] = temp;
        updated[cIdx].subCategories = subList;
      }
    } else if (level === 2) {
      const [cIdx, sIdx, ssIdx] = path;
      const subSubList = updated[cIdx].subCategories[sIdx].subCategories || [];
      if (ssIdx > 0) {
        const temp = subSubList[ssIdx];
        subSubList[ssIdx] = subSubList[ssIdx - 1];
        subSubList[ssIdx - 1] = temp;
        updated[cIdx].subCategories[sIdx].subCategories = subSubList;
      }
    }
    setMenuItems(updated);
    saveMenu(updated);
  };

  const handleMoveDown = (level, path) => {
    const updated = JSON.parse(JSON.stringify(menuItems));
    if (level === 0) {
      const idx = path[0];
      if (idx < updated.length - 1) {
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
      }
    } else if (level === 1) {
      const [cIdx, sIdx] = path;
      const subList = updated[cIdx].subCategories || [];
      if (sIdx < subList.length - 1) {
        const temp = subList[sIdx];
        subList[sIdx] = subList[sIdx + 1];
        subList[sIdx + 1] = temp;
        updated[cIdx].subCategories = subList;
      }
    } else if (level === 2) {
      const [cIdx, sIdx, ssIdx] = path;
      const subSubList = updated[cIdx].subCategories[sIdx].subCategories || [];
      if (ssIdx < subSubList.length - 1) {
        const temp = subSubList[ssIdx];
        subSubList[ssIdx] = subSubList[ssIdx + 1];
        subSubList[ssIdx + 1] = temp;
        updated[cIdx].subCategories[sIdx].subCategories = subSubList;
      }
    }
    setMenuItems(updated);
    saveMenu(updated);
  };

  // Select Item for editing or adding
  const handleSelectItem = (level, path, mode) => {
    setSelectedItem({ level, path });
    setEditMode(mode);

    const updated = JSON.parse(JSON.stringify(menuItems));
    if (mode === 'edit') {
      let item;
      if (level === 0) {
        item = updated[path[0]];
      } else if (level === 1) {
        item = updated[path[0]].subCategories[path[1]];
      } else {
        item = updated[path[0]].subCategories[path[1]].subCategories[path[2]];
      }
      setFormName(item.name);
      setFormHref(item.href || '');
    } else if (mode === 'add-child') {
      setFormName('');
      setFormHref('');
    }
  };

  const handleStartAddRoot = () => {
    setSelectedItem(null);
    setEditMode('add-root');
    setFormName('');
    setFormHref('');
  };

  const handleDeleteItem = (level, path) => {
    if (!confirm("Are you sure you want to delete this menu item and all its nested children?")) {
      return;
    }

    const updated = JSON.parse(JSON.stringify(menuItems));
    if (level === 0) {
      updated.splice(path[0], 1);
    } else if (level === 1) {
      updated[path[0]].subCategories.splice(path[1], 1);
    } else if (level === 2) {
      updated[path[0]].subCategories[path[1]].subCategories.splice(path[2], 1);
    }

    setMenuItems(updated);
    saveMenu(updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification('Name field is required', false);
      return;
    }

    const updated = JSON.parse(JSON.stringify(menuItems));

    if (editMode === 'add-root') {
      updated.push({
        name: formName,
        href: formHref || `/${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        subCategories: []
      });
    } else if (editMode === 'add-child') {
      const { level, path } = selectedItem;
      if (level === 0) {
        const cat = updated[path[0]];
        if (!cat.subCategories) cat.subCategories = [];
        cat.subCategories.push({
          name: formName,
          href: formHref || `${cat.href}/${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          subCategories: []
        });
      } else if (level === 1) {
        const sub = updated[path[0]].subCategories[path[1]];
        if (!sub.subCategories) sub.subCategories = [];
        sub.subCategories.push({
          name: formName,
          href: formHref || `${sub.href}/${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        });
      }
    } else if (editMode === 'edit') {
      const { level, path } = selectedItem;
      if (level === 0) {
        updated[path[0]].name = formName;
        updated[path[0]].href = formHref;
      } else if (level === 1) {
        updated[path[0]].subCategories[path[1]].name = formName;
        updated[path[0]].subCategories[path[1]].href = formHref;
      } else if (level === 2) {
        updated[path[0]].subCategories[path[1]].subCategories[path[2]].name = formName;
        updated[path[0]].subCategories[path[1]].subCategories[path[2]].href = formHref;
      }
    }

    setMenuItems(updated);
    saveMenu(updated);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-400">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Notifications */}
      {success && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center shadow-lg shadow-emerald-950/20 animate-fade-in-down animate-pulse">
          <Check className="w-5 h-5 mr-2" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center shadow-lg shadow-red-950/20 animate-fade-in-down">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:max-h-screen md:overflow-y-auto flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Navigation Menu Manager</h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure, rearrange, and sort storefront categories bar up to 3 levels.
            </p>
          </div>
          <button
            onClick={handleStartAddRoot}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition active:scale-95 shadow-lg shadow-blue-600/15"
          >
            <Plus className="w-4 h-4" /> Add Root Category
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-slate-400">Loading menu configuration...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tree View list */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-220px)] space-y-4">
              <h2 className="text-base font-bold text-slate-300 pb-3 border-b border-slate-800">Storefront Menu Layout</h2>
              {!Array.isArray(menuItems) || menuItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Menu className="w-12 h-12 mx-auto opacity-20 mb-3" />
                  <p className="text-sm">No menu items configured. Add your first root category to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.isArray(menuItems) && menuItems.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-slate-950/40 rounded-xl border border-slate-900 overflow-hidden">
                      {/* Level 0: Root Category */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-900/50 transition gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Folder className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                          <span className="font-semibold text-sm text-slate-200 truncate">{cat.name}</span>
                          <span className="text-xs text-slate-500 truncate font-mono">({cat.href})</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleMoveUp(0, [catIdx])}
                            disabled={catIdx === 0}
                            className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(0, [catIdx])}
                            disabled={catIdx === menuItems.length - 1}
                            className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSelectItem(0, [catIdx], 'add-child')}
                            className="p-1 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition"
                            title="Add Sub-category"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSelectItem(0, [catIdx], 'edit')}
                            className="p-1 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(0, [catIdx])}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Level 1: Sub-category */}
                      {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                        <div className="pl-6 pr-3 py-2 border-t border-slate-900/60 bg-slate-950/20 space-y-2">
                          {cat.subCategories.map((sub, subIdx) => (
                            <div key={subIdx} className="bg-slate-950/30 rounded-lg border border-slate-900/50">
                              <div className="flex items-center justify-between p-2.5 hover:bg-slate-900/30 transition gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span className="font-medium text-xs text-slate-300 truncate">{sub.name}</span>
                                  <span className="text-[10px] text-slate-500 truncate font-mono">({sub.href})</span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleMoveUp(1, [catIdx, subIdx])}
                                    disabled={subIdx === 0}
                                    className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveDown(1, [catIdx, subIdx])}
                                    disabled={subIdx === cat.subCategories.length - 1}
                                    className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleSelectItem(1, [catIdx, subIdx], 'add-child')}
                                    className="p-1 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition"
                                    title="Add Sub-subcategory"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleSelectItem(1, [catIdx, subIdx], 'edit')}
                                    className="p-1 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                                    title="Edit"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(1, [catIdx, subIdx])}
                                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Level 2: Sub-subcategory */}
                              {Array.isArray(sub.subCategories) && sub.subCategories.length > 0 && (
                                <div className="pl-6 pr-2.5 pb-2 pt-1 border-t border-slate-900/30 space-y-1">
                                  {sub.subCategories.map((subSub, subSubIdx) => (
                                    <div
                                      key={subSubIdx}
                                      className="flex items-center justify-between p-2 rounded bg-slate-950/20 hover:bg-slate-900/20 transition border border-transparent hover:border-slate-900/30 gap-2"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="text-xs text-slate-400 truncate">{subSub.name}</span>
                                        <span className="text-[9px] text-slate-600 truncate font-mono">({subSub.href})</span>
                                      </div>
                                      <div className="flex items-center gap-0.5 shrink-0">
                                        <button
                                          onClick={() => handleMoveUp(2, [catIdx, subIdx, subSubIdx])}
                                          disabled={subSubIdx === 0}
                                          className="p-0.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          onClick={() => handleMoveDown(2, [catIdx, subIdx, subSubIdx])}
                                          disabled={subSubIdx === sub.subCategories.length - 1}
                                          className="p-0.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-20 disabled:pointer-events-none rounded transition"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          onClick={() => handleSelectItem(2, [catIdx, subIdx, subSubIdx], 'edit')}
                                          className="p-0.5 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                                          title="Edit"
                                        >
                                          <Edit className="w-2.5 h-2.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteItem(2, [catIdx, subIdx, subSubIdx])}
                                          className="p-0.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Editor Panel */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-300 pb-3 border-b border-slate-800 mb-5">
                {editMode === 'edit' ? 'Modify Item' : editMode === 'add-child' ? 'Create Child Link' : editMode === 'add-root' ? 'Create Root Category' : 'Select Item to Configure'}
              </h2>

              {!editMode ? (
                <div className="text-center py-12 text-slate-500 bg-slate-950/20 rounded-xl border border-slate-900/50">
                  <Edit className="w-10 h-10 mx-auto opacity-20 mb-3" />
                  <p className="text-sm">Click any item's buttons to edit it, add child categories under it, or rearrange their display ordering.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaming Processors"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm font-medium text-slate-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Link URL (href)</label>
                    <input
                      type="text"
                      placeholder="e.g. /component/processor/intel"
                      value={formHref}
                      onChange={(e) => setFormHref(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-sm font-medium text-slate-200 transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                      Leave empty to automatically generate a friendly relative link path based on the display name.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      {editMode === 'edit' ? 'Update Details' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(null);
                        setEditMode(null);
                      }}
                      className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 text-sm font-semibold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
