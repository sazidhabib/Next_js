"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  Package,
  AlertCircle,
  Check,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  LayoutDashboard,
  Settings,
  Grid,
  LogOut,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminProducts() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  const generateSlug = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric, spaces, hyphens
      .replace(/\s+/g, '-') // replace spaces with hyphen
      .replace(/-+/g, '-') // replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // trim hyphens from ends
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    slug: '',
    price: '',
    category: '',
    image: '',
    specs: '',
    specifications: {},
    warranty: '',
    description: '',
    featured: false,
    brand: '',
    model: '',
    stock: true
  });

  // Wait for auth check to complete
  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchData();
    }
  }, [isAuthorized, token, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.data);

      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const isEdit = productForm.id !== null;
    const url = isEdit ? `/api/products/${productForm.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    // Parse specs array from string
    const specsArray = productForm.specs
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      specs: specsArray,
      specifications: productForm.specifications,
      images: [productForm.image] // Use single image as array
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showNotification(data.message || 'Action failed', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Product deleted successfully!');
        fetchData();
      } else {
        showNotification(data.message || 'Delete failed', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    }
  };

  const openProductEdit = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      category: product.category,
      image: product.image,
      specs: Array.isArray(product.specs) ? product.specs.join(', ') : '',
      specifications: product.specifications || {},
      warranty: product.warranty || '',
      description: product.description || '',
      featured: product.featured || false,
      brand: product.brand || '',
      model: product.model || '',
      stock: product.stock !== undefined ? product.stock : true
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddProduct = () => {
    setProductForm({
      id: null,
      name: '',
      slug: '',
      price: '',
      category: categories[0]?.slug || '',
      image: '',
      specs: '',
      specifications: {
        "Basic Information": { "Product Name": "", "Model": "", "Warranty": "" }
      },
      warranty: '',
      description: '',
      featured: false,
      brand: '',
      model: '',
      stock: true
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
              <Package className="w-6 h-6" />
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
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15"
          >
            <Package className="w-5 h-5" />
            <span>Product Inventory</span>
          </Link>

          <Link
            href="/admin/categories"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Grid className="w-5 h-5" />
            <span>Category Manager</span>
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
              Product Inventory
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Add, edit, and track products directly sync'd to database.
            </p>
          </div>

          <button
            onClick={openAddProduct}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/10 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading dynamic panel contents...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="py-20 text-center text-slate-400">No products found. Start by seeding or adding a product.</div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 text-sm font-medium">
                        <th className="p-4 pl-6">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4 text-center">Featured</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4 pl-6 flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded bg-slate-850" />
                            <div>
                              <span className="font-semibold text-slate-100 block">{product.name}</span>
                              <span className="text-xs text-slate-400 font-mono">{product.model || 'No model'}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-blue-400">{product.category}</td>
                          <td className="p-4 font-semibold text-slate-100">৳{product.price}</td>
                          <td className="p-4">{product.brand}</td>
                          <td className="p-4 text-center">
                            {product.featured ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Featured</span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {product.stock ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">In Stock</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Out</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => openProductEdit(product)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition">
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

        {/* Product Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100">
                  {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Product Name</label>
                    <input
                      type="text" required
                      value={productForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setProductForm(prev => ({
                          ...prev,
                          name,
                          slug: generateSlug(name)
                        }));
                      }}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Slug (URL friendly)</label>
                    <input
                      type="text" required
                      value={productForm.slug}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Price (৳)</label>
                    <input
                      type="number" required step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Brand</label>
                    <input
                      type="text" required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Model</label>
                    <input
                      type="text" required
                      value={productForm.model}
                      onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Warranty</label>
                    <input
                      type="text"
                      value={productForm.warranty}
                      onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                      placeholder="e.g. 1 Year, 3 Years"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Image URL</label>
                    <input
                      type="text" required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Key Features (Comma-separated)</label>
                    <input
                      type="text"
                      value={productForm.specs}
                      onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                      placeholder="Intel i7, RTX 4070, 16GB RAM"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Detailed Specifications Editor */}
                  <div className="md:col-span-2 mt-4 p-5 border border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-200">Structured Specifications</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const sectionName = window.prompt("Enter new section name (e.g., Processor):");
                          if (sectionName && !productForm.specifications[sectionName]) {
                            setProductForm(prev => ({
                              ...prev,
                              specifications: { ...prev.specifications, [sectionName]: {} }
                            }));
                          }
                        }}
                        className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Section
                      </button>
                    </div>

                    <div className="space-y-6">
                      {Object.entries(productForm.specifications || {}).map(([section, fields]) => (
                        <div key={section} className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-950/30">
                          <div className="bg-slate-800/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/50">
                            <span className="font-semibold text-slate-300">{section}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const fieldName = window.prompt(`Enter new field name for "${section}" (e.g., RAM):`);
                                  if (fieldName) {
                                    setProductForm(prev => ({
                                      ...prev,
                                      specifications: {
                                        ...prev.specifications,
                                        [section]: { ...prev.specifications[section], [fieldName]: "" }
                                      }
                                    }));
                                  }
                                }}
                                className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded"
                              >
                                + Field
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Remove section "${section}"?`)) {
                                    const newSpecs = { ...productForm.specifications };
                                    delete newSpecs[section];
                                    setProductForm(prev => ({ ...prev, specifications: newSpecs }));
                                  }
                                }}
                                className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            {Object.entries(fields).length === 0 && <div className="text-sm text-slate-500 italic">No fields yet. Click "+ Field" to add.</div>}
                            {Object.entries(fields).map(([key, value]) => (
                              <div key={key} className="flex items-start gap-3">
                                <div className="w-1/3 pt-2 text-sm text-slate-400 font-medium truncate" title={key}>
                                  {key}
                                </div>
                                <div className="w-2/3 flex gap-2">
                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => {
                                      setProductForm(prev => ({
                                        ...prev,
                                        specifications: {
                                          ...prev.specifications,
                                          [section]: { ...prev.specifications[section], [key]: e.target.value }
                                        }
                                      }));
                                    }}
                                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                    placeholder={`Value for ${key}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSpecs = { ...productForm.specifications };
                                      delete newSpecs[section][key];
                                      setProductForm(prev => ({ ...prev, specifications: newSpecs }));
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                                    title="Remove field"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-6 pt-2">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded bg-slate-950 border-slate-800 focus:ring-0"
                      />
                      <span className="text-sm text-slate-300">Featured Product</span>
                    </label>
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded bg-slate-950 border-slate-800 focus:ring-0"
                      />
                      <span className="text-sm text-slate-300">In Stock</span>
                    </label>
                  </div>
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
                    {actionLoading ? 'Saving...' : 'Save Product'}
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