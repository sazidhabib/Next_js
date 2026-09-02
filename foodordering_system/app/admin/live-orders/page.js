'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  Bell,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bike,
  Printer,
  ChevronRight,
  MapPin,
  Phone,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { playOrderIncomingSound } from '@/components/AudioAlert';

export default function LiveOrdersReceiver() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Kitchen is at maximum capacity');
  const [thermalReceiptOrder, setThermalReceiptOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'

  // Fetch orders regularly
  const fetchLiveOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success && json.data) {
        const fetched = json.data;
        const pendingCount = fetched.filter((o) => o.status === 'PENDING').length;

        // Trigger sound if there are pending orders
        if (pendingCount > 0 && soundEnabled) {
          playOrderIncomingSound();
        }

        setOrders(fetched);
      }
    } catch (err) {
      console.error('Error fetching live orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 3500);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Order Actions
  const handleAcceptOrder = async (orderId, prepMinutes) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED', prepMinutes }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Order accepted (${prepMinutes} min prep time)!`);
        setSelectedOrder(null);
        fetchLiveOrders();
      } else {
        toast.error(json.error || 'Failed to accept order');
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      toast.error('Network error accepting order');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        toast.info(`Order status updated to ${status}`);
        setSelectedOrder(null);
        fetchLiveOrders();
      } else {
        toast.error(json.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Network error updating order status');
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.warning('Order rejected');
        setRejectModalOpen(false);
        setSelectedOrder(null);
        fetchLiveOrders();
      } else {
        toast.error(json.error || 'Failed to reject order');
      }
    } catch (err) {
      console.error('Error rejecting order:', err);
      toast.error('Network error rejecting order');
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter(
    (o) => o.status === 'ACCEPTED' || o.status === 'PREPARING'
  );
  const readyOrders = orders.filter(
    (o) => o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY'
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'REJECTED'
  );

  const getFilteredList = () => {
    switch (activeTab) {
      case 'PENDING':
        return pendingOrders;
      case 'PREPARING':
        return preparingOrders;
      case 'READY':
        return readyOrders;
      case 'COMPLETED':
        return completedOrders;
      default:
        return pendingOrders;
    }
  };

  const displayedOrders = getFilteredList();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Console Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Kitchen Order Receiver</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE CONSOLE
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Audio Toggle & Storefront link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Audio Alert ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Audio Muted</span>
              </>
            )}
          </button>

          <Link
            href="/menu/bellavista-pizza"
            target="_blank"
            className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-md transition-all"
          >
            Open Storefront ↗
          </Link>
        </div>
      </header>

      {/* Urgent Incoming Orders Banner */}
      {pendingOrders.length > 0 && (
        <div className="animate-urgent-bg text-white px-4 py-2.5 text-center font-bold text-xs sm:text-sm flex items-center justify-center shadow-lg">
          <div className="animate-urgent-content">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>
              {pendingOrders.length} New Incoming Order(s) waiting for acceptance!
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>New Incoming</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {pendingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PREPARING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'PREPARING'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>In Kitchen (Cooking)</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {preparingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('READY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'READY'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Ready / Dispatched</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {readyOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Completed / History</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {completedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-bold">Synchronizing with kitchen queue...</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-300">No orders in this queue</h3>
            <p className="text-xs text-slate-500">
              When customer orders arrive, they will appear here with live alert chimes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedOrders.map((order) => {
              const isPending = order.status === 'PENDING';
              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isPending
                      ? 'border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-orange-400">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            order.orderType === 'DELIVERY'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {order.orderType}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">
                        {order.customerName}
                      </h3>
                      <p className="text-xs text-slate-400">{order.customerPhone}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white">
                        ${order.totalAmount?.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.paymentMethod === 'CARD_ONLINE' ? '💳 Paid' : '💵 Cash'}
                      </p>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 text-xs">
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-1.5 text-slate-300 bg-slate-800/40 p-2 rounded-xl text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                      </div>
                    )}

                    <div className="space-y-2 divide-y divide-slate-800">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100">
                              <span className="text-orange-400 mr-1.5 font-extrabold">
                                {item.quantity}x
                              </span>
                              {item.itemName}
                            </span>
                            <span className="text-slate-400">${item.itemTotal?.toFixed(2)}</span>
                          </div>

                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="text-[10px] text-slate-400 pl-4 space-y-0.5">
                              {item.selectedOptions.map((opt, oIdx) => (
                                <p key={oIdx}>• {opt.optionName}</p>
                              ))}
                            </div>
                          )}

                          {item.specialNotes && (
                            <p className="text-[10px] text-amber-300 italic bg-amber-950/40 p-1 rounded pl-2">
                              Note: {item.specialNotes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.specialNotes && (
                      <div className="mt-2 p-2 bg-slate-800/80 border border-slate-700 rounded-xl text-[11px] text-amber-200">
                        <span className="font-bold text-amber-400">Order Note: </span>
                        {order.specialNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
                    {isPending ? (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                          Select Prep Time to Accept:
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[15, 25, 35, 45].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => handleAcceptOrder(order.id, mins)}
                              className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
                            >
                              +{mins}m
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRejectModalOpen(true);
                            }}
                            className="flex-1 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setThermalReceiptOrder(order)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                            title="Print Thermal Kitchen Ticket"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : order.status === 'ACCEPTED' || order.status === 'PREPARING' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              order.id,
                              order.orderType === 'DELIVERY'
                                ? 'OUT_FOR_DELIVERY'
                                : 'READY_FOR_PICKUP'
                            )
                          }
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>
                            {order.orderType === 'DELIVERY'
                              ? 'Dispatch (Out for Delivery)'
                              : 'Mark Ready for Pickup'}
                          </span>
                        </button>
                        <button
                          onClick={() => setThermalReceiptOrder(order)}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    ) : order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Order Delivered / Completed</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Status: <span className="font-bold text-slate-200">{order.status}</span></span>
                        <button
                          onClick={() => setThermalReceiptOrder(order)}
                          className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reject Order Modal */}
      {rejectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-white">
                Reject Order {selectedOrder.orderNumber}?
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Please select a structured reason for rejection. The customer will be informed immediately.
            </p>

            <div className="space-y-2">
              {[
                'Kitchen is at maximum capacity',
                'Item(s) in order are out of stock',
                'Delivery address is outside service zone',
                'Restaurant is closing soon',
              ].map((reason) => (
                <div
                  key={reason}
                  onClick={() => setRejectionReason(reason)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    rejectionReason === reason
                      ? 'bg-red-500/20 border-red-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  {reason}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 80mm Thermal Receipt Preview Modal */}
      {thermalReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white text-black p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Printable 80mm Container */}
            <div id="thermal-receipt" className="space-y-3 font-mono text-xs">
              <div className="text-center space-y-1 border-b border-black pb-2">
                <h2 className="font-bold text-sm uppercase">BELLA VISTA PIZZERIA</h2>
                <p className="text-[10px]">742 Evergreen Terrace, Downtown Plaza</p>
                <p className="text-[10px]">Tel: +1 (555) 345-6789</p>
              </div>

              <div className="flex justify-between font-bold text-xs py-1 border-b border-dashed border-black">
                <span>ORDER {thermalReceiptOrder.orderNumber}</span>
                <span>{thermalReceiptOrder.orderType}</span>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <p>Customer: {thermalReceiptOrder.customerName}</p>
                <p>Phone: {thermalReceiptOrder.customerPhone}</p>
                {thermalReceiptOrder.deliveryAddress && (
                  <p>Address: {thermalReceiptOrder.deliveryAddress}</p>
                )}
                <p>Time: {new Date(thermalReceiptOrder.createdAt).toLocaleTimeString()}</p>
              </div>

              <div className="border-t border-b border-black py-2 space-y-2">
                {thermalReceiptOrder.items?.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>{it.quantity}x {it.itemName}</span>
                      <span>${it.itemTotal?.toFixed(2)}</span>
                    </div>
                    {it.selectedOptions?.map((o, oIdx) => (
                      <p key={oIdx} className="text-[10px] pl-2">
                        + {o.optionName}
                      </p>
                    ))}
                    {it.specialNotes && (
                      <p className="text-[10px] italic pl-2">** {it.specialNotes}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${thermalReceiptOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${thermalReceiptOrder.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>${thermalReceiptOrder.deliveryFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-black">
                  <span>TOTAL:</span>
                  <span>${thermalReceiptOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px]">
                <p>Payment: {thermalReceiptOrder.paymentMethod}</p>
                <p className="pt-1">*** KITCHEN COPY ***</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2 no-print">
              <button
                onClick={() => setThermalReceiptOrder(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
