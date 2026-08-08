"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  LayoutDashboard,
  Settings,
  Package,
  Grid,
  FileImage,
  LogOut,
  Eye,
  RefreshCw,
  Search,
  Check,
  X,
  Printer,
  ClipboardList,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrders() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order for Details View
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Shop details for Invoice
  const [shopDetails, setShopDetails] = useState({
    siteTitle: 'HulloTech',
    contactEmail: 'support@hullotech.com',
    contactPhone: '+880 1234 567890',
    contactAddress: 'Dhaka, Bangladesh'
  });

  // Fetch settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setShopDetails({
            siteTitle: data.data.siteTitle || 'HulloTech',
            contactEmail: data.data.contactEmail || 'support@hullotech.com',
            contactPhone: data.data.contactPhone || '+880 1234 567890',
            contactAddress: data.data.contactAddress || 'Dhaka, Bangladesh'
          });
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  // Fetch Orders
  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Auth checking & initial fetch
  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchOrders();
      
      // Auto polling every 15 seconds to check for new orders
      const pollInterval = setInterval(() => {
        fetchOrders(true);
      }, 15000);

      return () => clearInterval(pollInterval);
    }
  }, [isAuthorized, token, authLoading]);

  // Update Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Order #${orderId} updated to ${newStatus}`);
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Failed to update order status.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      setError('Network error occurred.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    handleAdminLogout();
  };

  // Print Invoice
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!selectedOrder) return;

    // Helper to render date
    const dateStr = new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const subtotal = Number(selectedOrder.totalAmount) - Number(selectedOrder.deliveryCharge || 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${selectedOrder.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; padding: 0; font-size: 14px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #3b82f6; margin: 0; font-size: 28px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 35px; }
            .details-col { width: 48%; }
            .details-title { font-weight: bold; text-transform: uppercase; color: #999; font-size: 11px; letter-spacing: 1px; margin-bottom: 8px; }
            .details-val { line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { border-bottom: 2px solid #eee; padding: 10px 0; text-align: left; color: #666; font-size: 12px; text-transform: uppercase; }
            td { border-bottom: 1px solid #f9f9f9; padding: 12px 0; }
            .totals { display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 280px; margin-bottom: 8px; }
            .total-row.grand { font-size: 18px; font-weight: bold; border-top: 1px solid #eee; padding-top: 10px; color: #3b82f6; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            @media print {
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <script>
            window.onload = function() {
              window.print();
            };
            window.onafterprint = function() {
              window.close();
            };
          </script>
          <div class="header">
            <div>
              <h1>${shopDetails.siteTitle}</h1>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">Invoice Receipt</div>
            </div>
            <div class="text-right" style="font-size: 12px; color: #666;">
              <strong>${shopDetails.siteTitle} Store</strong><br />
              ${shopDetails.contactPhone}<br />
              ${shopDetails.contactEmail}<br />
              ${shopDetails.contactAddress}
            </div>
          </div>

          <div class="details">
            <div class="details-col">
              <div class="details-title">Order Info</div>
              <div class="details-val">
                <strong>ID:</strong> #HT-${selectedOrder.id}<br />
                <strong>Date:</strong> ${dateStr}<br />
                <strong>Payment Method:</strong> ${selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : selectedOrder.paymentMethod}<br />
                <strong>Payment Status:</strong> Pending COD Confirmation
              </div>
            </div>
            <div class="details-col">
              <div class="details-title">Customer & Shipping</div>
              <div class="details-val">
                <strong>Name:</strong> ${selectedOrder.customerName}<br />
                <strong>Phone:</strong> ${selectedOrder.customerPhone}<br />
                <strong>Email:</strong> ${selectedOrder.customerEmail}<br />
                <strong>Address:</strong> ${selectedOrder.shippingAddress}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 20%;">Price</th>
                <th class="text-right" style="width: 25%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.items ? selectedOrder.items.map(item => `
                <tr>
                  <td>${item.product?.name || `Product #${item.productId}`}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">৳${Math.round(item.price).toLocaleString()}</td>
                  <td class="text-right"><strong>৳${Math.round(item.price * item.quantity).toLocaleString()}</strong></td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" class="text-center" style="color:#999;">Order items cached locally</td>
                </tr>
              `}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>৳${Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Delivery Fee:</span>
              <span>${Number(selectedOrder.deliveryCharge || 0) === 0 ? "Free" : `৳${Math.round(selectedOrder.deliveryCharge || 0)}`}</span>
            </div>
            <div class="total-row grand">
              <span>Total:</span>
              <span>৳${Math.round(selectedOrder.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Loading indicator for auth
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
    return null; // Hook will redirect
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Toast Notifications */}
      {success && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center shadow-lg shadow-emerald-950/20 animate-fade-in-down">
          <Check className="w-5 h-5 mr-2" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center shadow-lg shadow-red-950/20 animate-fade-in-down">
          <X className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <ClipboardList className="w-6 h-6" />
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
            href="/admin/orders"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15"
          >
            <ClipboardList className="w-5 h-5" />
            <span>Orders Management</span>
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
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
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

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
            <p className="text-slate-400 text-sm mt-1">
              Verify customer details, approve Cash-on-Delivery shipments, and generate receipts.
            </p>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Data
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'processing', label: 'Processing' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <span className="text-slate-400 text-sm">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-300">No Orders Found</h3>
            <p className="text-slate-500 text-xs mt-1">There are no orders that match your current selection criteria.</p>
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredOrders.map(order => {
                    const dateVal = new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    });
                    
                    return (
                      <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-200">#HT-{order.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-100">{order.customerName}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{order.customerEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-medium">{order.customerPhone}</td>
                        <td className="px-6 py-4 text-slate-400">{dateVal}</td>
                        <td className="px-6 py-4 font-bold text-slate-200">৳{Math.round(order.totalAmount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetailsModal(true);
                              }}
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <select
                              value={order.status}
                              disabled={actionLoading}
                              onChange={e => handleUpdateStatus(order.id, e.target.value)}
                              className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details & Invoice Inspector Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Order details: #HT-{selectedOrder.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                
                {/* Status bar */}
                <div className="bg-slate-950/55 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-2 items-center">
                    <span className="text-slate-400">Current Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      selectedOrder.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      selectedOrder.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      selectedOrder.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Change to:</span>
                    <div className="flex gap-1.5">
                      {['processing', 'completed', 'cancelled'].map(stat => (
                        <button
                          key={stat}
                          onClick={() => handleUpdateStatus(selectedOrder.id, stat)}
                          disabled={actionLoading || selectedOrder.status === stat}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-xs font-bold rounded-lg hover:bg-slate-800 transition capitalize text-slate-200"
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer and address columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/20 border border-slate-800/50 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" /> Customer Information
                    </h4>
                    <p className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-semibold">{selectedOrder.customerName}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-semibold">{selectedOrder.customerPhone}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-400">{selectedOrder.customerEmail}</span></p>
                  </div>
                  
                  <div className="bg-slate-950/20 border border-slate-800/50 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" /> Delivery Address
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-medium">{selectedOrder.shippingAddress}</p>
                    <p className="flex justify-between pt-2 border-t border-slate-800/50"><span className="text-slate-500">Method:</span> <span className="font-semibold text-blue-400 uppercase">{selectedOrder.paymentMethod}</span></p>
                  </div>
                </div>

                {/* Order items table */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800">
                    <h4 className="font-bold text-slate-300 flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" /> Order Items
                    </h4>
                  </div>
                  
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs bg-slate-900/20 font-semibold uppercase">
                        <th className="px-4 py-2.5">Product ID</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Price</th>
                        <th className="px-4 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <tr key={index} className="text-slate-300">
                          <td className="px-4 py-3 font-semibold">{item.product?.name || `Product #${item.productId}`}</td>
                          <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">৳{Math.round(item.price).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-100 font-bold">৳{Math.round(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="bg-slate-950/40 p-4 border-t border-slate-800 flex flex-col items-end gap-2 text-xs">
                    <div className="flex justify-between w-64 text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-200">
                        ৳{Math.round(Number(selectedOrder.totalAmount) - Number(selectedOrder.deliveryCharge || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between w-64 text-slate-400">
                      <span>Delivery Charge:</span>
                      <span className="font-semibold text-slate-200">
                        {Number(selectedOrder.deliveryCharge || 0) === 0 ? "Free" : `৳${Math.round(selectedOrder.deliveryCharge || 0)}`}
                      </span>
                    </div>
                    <div className="flex justify-between w-64 border-t border-slate-800 pt-2 text-sm text-slate-100 font-extrabold">
                      <span>Grand Total:</span>
                      <span className="text-blue-400">৳{Math.round(selectedOrder.totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 flex gap-3 bg-slate-900/50 justify-end">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center gap-2 text-xs"
                >
                  <Printer className="w-4 h-4" /> Print / PDF Invoice
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-xs"
                >
                  Close View
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
