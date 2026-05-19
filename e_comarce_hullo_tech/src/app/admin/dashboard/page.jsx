"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Grid, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Layers,
  FolderOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('settings'); // Default tab

  // Data states
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    footerText: '',
    socialLinks: {}
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading/Error states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form states
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    slug: '',
    price: '',
    category: '',
    image: '',
    specs: '',
    description: '',
    featured: false,
    brand: '',
    model: '',
    stock: true
  });
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: '',
    icon: '',
    slug: '',
    image: ''
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (!savedToken || !savedUser) {
      router.push('/admin/login');
    } else {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // Load active tab data
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [activeTab, token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'settings') {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) setProducts(data.data);

        // Fetch categories for product dropdown
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.data);
      } else if (activeTab === 'categories') {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) setCategories(data.data);
      }
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
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

  // Settings Handlers
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showNotification('Settings updated successfully!');
      } else {
        showNotification(data.message || 'Failed to update settings', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    } finally {
      setActionLoading(false);
    }
  };

  // Category Handlers
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
        setIsCategoryModalOpen(false);
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
        fetchData();
      } else {
        showNotification(data.message || 'Delete failed', false);
      }
    } catch (err) {
      showNotification('Network error occurred.', false);
    }
  };

  // Product Handlers
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
      images: [productForm.image] // Use single image as array for standard product layout
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
        setIsProductModalOpen(false);
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
      description: product.description || '',
      featured: product.featured || false,
      brand: product.brand || '',
      model: product.model || '',
      stock: product.stock !== undefined ? product.stock : true
    });
    setIsProductModalOpen(true);
  };

  const openCategoryEdit = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      icon: category.icon || 'FolderOpen',
      slug: category.slug,
      image: category.image || ''
    });
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold tracking-wide">HulloTech</h2>
              <span className="text-xs text-slate-400">Admin Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left ${
              activeTab === 'settings' 
                ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Site Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left ${
              activeTab === 'products' 
                ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Product Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left ${
              activeTab === 'categories' 
                ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span>Category Manager</span>
          </button>
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

        {/* Tab Headers */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {activeTab === 'settings' && 'Site Settings'}
              {activeTab === 'products' && 'Product Directory'}
              {activeTab === 'categories' && 'Category Directory'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'settings' && 'Control site titles, meta descriptors, and contact details.'}
              {activeTab === 'products' && 'Add, edit, and track products directly sync’d to database.'}
              {activeTab === 'categories' && 'Configure and list dynamic e-commerce layout categories.'}
            </p>
          </div>

          {activeTab !== 'settings' && (
            <button
              onClick={() => {
                if (activeTab === 'products') {
                  setProductForm({
                    id: null, name: '', slug: '', price: '', category: categories[0]?.slug || '', 
                    image: '', specs: '', description: '', featured: false, brand: '', model: '', stock: true
                  });
                  setIsProductModalOpen(true);
                } else {
                  setCategoryForm({ id: null, name: '', icon: 'FolderOpen', slug: '', image: '' });
                  setIsCategoryModalOpen(true);
                }
              }}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/10 transition self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'products' ? 'Add Product' : 'Add Category'}</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading dynamic panel contents...</p>
          </div>
        ) : (
          <>
            {/* SITE CONFIGURATION TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="max-w-4xl space-y-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Site Title</label>
                    <input
                      type="text"
                      required
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Site Support Email</label>
                    <input
                      type="email"
                      required
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Site Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Contact Address</label>
                    <input
                      type="text"
                      required
                      value={settings.contactAddress}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Site Meta Description</label>
                    <textarea
                      rows="3"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Footer Rights / Copyright Text</label>
                    <input
                      type="text"
                      value={settings.footerText}
                      onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-lg shadow-blue-500/10 flex items-center"
                  >
                    {actionLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                    Save Settings
                  </button>
                </div>
              </form>
            )}

            {/* PRODUCT INVENTORY TAB */}
            {activeTab === 'products' && (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {products.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">No products found. Start by seeding or adding a product.</div>
                ) : (
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
                            <td className="p-4 font-semibold text-slate-100">${product.price}</td>
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
                )}
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {categories.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">No categories found. Start by seeding or adding a category.</div>
                ) : (
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
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* PRODUCT FORM MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-slate-100">{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition">
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
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Slug (URL friendly)</label>
                  <input
                    type="text" required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Price ($)</label>
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
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text" required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Key Specs (Comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                    placeholder="Intel i7, RTX 4070, 16GB RAM"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
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
                  onClick={() => setIsProductModalOpen(false)}
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

      {/* CATEGORY FORM MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-slate-100">{categoryForm.id ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition">
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
                  onClick={() => setIsCategoryModalOpen(false)}
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
    </div>
  );
}
