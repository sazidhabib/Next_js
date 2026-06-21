"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  Grid,
  AlertCircle,
  Check,
  Trash2,
  Edit,
  Plus,
  LayoutDashboard,
  Settings,
  Package,
  LogOut,
  X,
  FileImage
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCategories() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: '',
    icon: '',
    slug: '',
    image: ''
  });

  // Wait for auth check to complete
  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchCategories();
    }
  }, [isAuthorized, token, authLoading]);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    handleAdminLogout();
  };

  const showNotification = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const isEdit = categoryForm.id !== null;
    const url = isEdit ? `/api/categories/${categoryForm.id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showNotification(data.message || 'Action failed', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Category deleted successfully!');
        fetchCategories();
      } else {
        showNotification(data.message || 'Delete failed', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    }
  };

  const openCategoryEdit = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      icon: category.icon || 'FolderOpen',
      slug: category.slug,
      image: category.image || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddCategory = () => {
    setCategoryForm({
      id: null,
      name: '',
      icon: 'FolderOpen',
      slug: '',
      image: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect happens in useAdminAuth if not authorized
  if (!isAuthorized || !token) {
    return null; // Will redirect via useAdminAuth hook
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold tracking-wide">HulloTech</h2>
              <span className="text-xs text-slate-400">Admin Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Settings className="w-5 h-5" />
            <span>Site Configuration</span>
          </Link>

          <Link
            href="/admin/products"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Package className="w-5 h-5" />
            <span>Product Inventory</span>
          </Link>

          <Link
            href="/admin/categories"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15"
          >
            <Grid className="w-5 h-5" />
            <span>Category Manager</span>
          </Link>

          <Link
            href="/admin/media"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <FileImage className="w-5 h-5" />
            <span>Media Gallery</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-950/20 hover:text-red-400 border border-slate-700/50 hover:border-red-900/30 text-slate-300 py-2.5 rounded-xl transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        {/* Alerts / Notifications */}
        {success && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center shadow-lg shadow-emerald-950/20 animate-fade-in-down">
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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Category Manager
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure and list dynamic e-commerce layout categories.
            </p>
          </div>

          <button
            onClick={openAddCategory}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/10 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading dynamic panel contents...</p>
          </div>
        ) : (
          <>
            {categories.length === 0 ? (
              <div className="py-20 text-center text-slate-400">No categories found. Start by seeding or adding a category.</div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 text-sm font-medium">
                        <th className="p-4 pl-6">ID</th>
                        <th className="p-4">Category Name</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Icon Identifier</th>
                        <th className="p-4">Thumbnail Preview</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4 pl-6 text-slate-500 font-mono">#{category.id}</td>
                          <td className="p-4 font-semibold text-slate-100">{category.name}</td>
                          <td className="p-4 font-mono text-slate-400">{category.slug}</td>
                          <td className="p-4 text-blue-400 font-mono text-xs">{category.icon}</td>
                          <td className="p-4">
                            {category.image ? (
                              <img src={category.image} alt={category.name} className="w-8 h-8 object-cover rounded bg-slate-800" />
                            ) : (
                              <span className="text-slate-500 text-xs">No image</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => openCategoryEdit(category)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCategory(category.id)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Category Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100">
                  {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text" required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Headphones"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Slug (URL friendly)</label>
                  <input
                    type="text" required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. headphones-audio"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Icon (Lucide name)</label>
                  <input
                    type="text" required
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="e.g. Headphones"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Image URL / Icon Path</label>
                  <input
                    type="text"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="e.g. /headphones.jpg"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/10"
                  >
                    {actionLoading ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}