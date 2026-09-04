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
  Plus,
  Minus,
  Timer,
  Sparkles,
  ExternalLink,
  Eye,
  Check,
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
  
  // Custom preparation timer state per order
  const [cardPrepTimes, setCardPrepTimes] = useState({});
  const [reviewOrderModal, setReviewOrderModal] = useState(null);
  const [extendTimeOrder, setExtendTimeOrder] = useState(null);
  const [extendMinutes, setExtendMinutes] = useState(10);

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

  // Prep time helpers
  const getOrderPrepMinutes = (orderId, fallback = 25) => {
    if (cardPrepTimes[orderId] !== undefined) {
      return cardPrepTimes[orderId];
    }
    return fallback;
  };

  const setOrderPrepMinutes = (orderId, mins) => {
    const val = Math.max(1, Math.min(180, Number(mins) || 25));
    setCardPrepTimes((prev) => ({
      ...prev,
      [orderId]: val,
    }));
  };

  const adjustMinutes = (orderId, delta, fallback = 25) => {
    const current = getOrderPrepMinutes(orderId, fallback);
    const nextVal = Math.max(5, Math.min(180, current + delta));
    setOrderPrepMinutes(orderId, nextVal);
  };

  const calculateReadyTimePreview = (minutes) => {
    const target = new Date(Date.now() + (Number(minutes) || 25) * 60 * 1000);
    return target.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Order Actions
  const handleAcceptOrder = async (orderId, prepMinutes) => {
    const mins = Math.max(1, Math.min(180, Number(prepMinutes) || 25));
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED', prepMinutes: mins }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Order accepted (${mins} min prep time)! Customer updated.`);
        setSelectedOrder(null);
        setReviewOrderModal(null);
        fetchLiveOrders();
      } else {
        toast.error(json.error || 'Failed to accept order');
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      toast.error('Network error accepting order');
    }
  };

  // Extend cooking time for already accepted orders
  const handleExtendPrepTime = async (order, addMinutes) => {
    const currentMins = order.prepMinutes || 25;
    const additional = Math.max(1, Number(addMinutes) || 10);
    const newTotalMinutes = currentMins + additional;
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prepMinutes: newTotalMinutes }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Prep time extended by +${additional}m (Total: ${newTotalMinutes}m)! Live countdown updated.`);
        setExtendTimeOrder(null);
        fetchLiveOrders();
      } else {
        toast.error(json.error || 'Failed to extend prep time');
      }
    } catch (err) {
      console.error('Error extending prep time:', err);
      toast.error('Network error extending prep time');
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
        setReviewOrderModal(null);
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
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Admin"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              GloriaFood Live Kitchen Receiver
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert MUTED'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="hidden sm:inline">Chimes Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>

          <button
            onClick={fetchLiveOrders}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh Live Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/menu/bellavista-pizza"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl transition-colors"
          >
            Open Storefront ↗
          </Link>
        </div>
      </header>

      {/* Urgent Incoming Orders Banner */}
      {pendingOrders.length > 0 && (
        <div className="animate-urgent-bg text-white px-4 py-2.5 text-center font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <Bell className="w-4 h-4 animate-bounce text-amber-200" />
            <span>
              {pendingOrders.length} New Incoming Order(s) waiting for acceptance!
            </span>
          </div>
          {pendingOrders[0] && (
            <button
              onClick={() => setReviewOrderModal(pendingOrders[0])}
              className="bg-white text-orange-700 hover:bg-orange-50 px-3 py-1 rounded-lg text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              Review #BV Order ↗
            </button>
          )}
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
            <span>Ready for Pickup / Out</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {readyOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>Completed / Archived</span>
            <span className="bg-slate-950/60 px-2 py-0.5 rounded-full text-[11px]">
              {completedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Order Cards Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-sm font-medium">Connecting to live order stream...</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3 mt-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No orders in this view</h3>
            <p className="text-xs text-slate-400">
              When customer orders arrive, they will appear here with live alert chimes and custom preparation timer controls.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedOrders.map((order) => {
              const isPending = order.status === 'PENDING';
              const isCooking = order.status === 'ACCEPTED' || order.status === 'PREPARING';
              const cardMins = getOrderPrepMinutes(order.id, 25);
              const previewReadyTime = calculateReadyTimePreview(cardMins);

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
                        {order.prepMinutes && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.prepMinutes}m
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">
                        {order.customerName}
                      </h3>
                      <p className="text-xs text-slate-400">{order.customerPhone}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white">
                        $${order.totalAmount?.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.paymentMethod === 'CARD_ONLINE' ? '💳 Paid Online' : '💵 Cash'}
                      </p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address if applicable */}
                  {order.deliveryAddress && (
                    <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 text-xs text-slate-400 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{order.deliveryAddress}</span>
                    </div>
                  )}

                  {/* Order Items Body */}
                  <div className="p-4 sm:p-5 flex-1 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs border-b border-slate-800/40 pb-2">
                          <div className="flex justify-between font-bold text-slate-200">
                            <span>
                              {item.quantity}x {item.itemName}
                            </span>
                            <span className="text-slate-400 font-mono">
                              $${item.itemTotal?.toFixed(2)}
                            </span>
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
                  <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                    {isPending ? (
                      <div className="space-y-2.5">
                        {/* Preparation Time Header & Estimated Ready Time Preview */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300 flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5 text-orange-400" />
                            <span>Select Prep Time:</span>
                          </span>
                          <span className="text-orange-400 font-mono text-[11px] font-bold bg-orange-950/40 border border-orange-800/50 px-2 py-0.5 rounded-md">
                            Ready ~{previewReadyTime}
                          </span>
                        </div>

                        {/* Quick Preset Buttons */}
                        <div className="grid grid-cols-6 gap-1">
                          {[15, 20, 25, 30, 45, 60].map((mins) => (
                            <button
                              key={mins}
                              onClick={() => setOrderPrepMinutes(order.id, mins)}
                              className={`py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                                cardMins === mins
                                  ? 'bg-orange-600 text-white ring-2 ring-orange-400 shadow-md scale-105'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                              title={`Choose ${mins} minutes`}
                            >
                              {mins}m
                            </button>
                          ))}
                        </div>

                        {/* Interactive Stepper & Direct Custom Minute Input */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-700/80 rounded-xl">
                          <span className="text-[11px] font-bold text-slate-400 pl-1">
                            Custom:
                          </span>
                          
                          <div className="flex items-center gap-1 flex-1 justify-center">
                            <button
                              type="button"
                              onClick={() => adjustMinutes(order.id, -5)}
                              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-black text-xs cursor-pointer active:scale-95 transition-all"
                              title="Decrease 5 minutes"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded-lg">
                              <input
                                type="number"
                                min="1"
                                max="180"
                                value={cardMins}
                                onChange={(e) => setOrderPrepMinutes(order.id, e.target.value)}
                                className="w-12 bg-transparent text-center font-mono font-black text-xs text-orange-400 focus:outline-hidden"
                              />
                              <span className="text-[10px] font-bold text-slate-400">mins</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => adjustMinutes(order.id, 5)}
                              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-black text-xs cursor-pointer active:scale-95 transition-all"
                              title="Increase 5 minutes"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Primary Accept Button with Selected Time */}
                        <button
                          onClick={() => handleAcceptOrder(order.id, cardMins)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Order with {cardMins}m Prep Time</span>
                        </button>

                        {/* Auxiliary Actions: Review Details / Reject / Print */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            onClick={() => setReviewOrderModal(order)}
                            className="flex-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRejectModalOpen(true);
                            }}
                            className="flex-1 bg-red-950/50 hover:bg-red-900/80 text-red-300 border border-red-900/40 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => setThermalReceiptOrder(order)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                            title="Print Thermal Ticket"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : isCooking ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs pb-1">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Confirmed: {order.prepMinutes || 25}m Prep</span>
                          </span>
                          {order.estimatedReadyAt && (
                            <span className="text-slate-400 font-mono text-[11px]">
                              Ready ~{new Date(order.estimatedReadyAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

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
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ChefHat className="w-4 h-4" />
                            <span>
                              {order.orderType === 'DELIVERY'
                                ? 'Dispatch Driver'
                                : 'Ready on Counter'}
                            </span>
                          </button>

                          {/* Extend Prep Time Button */}
                          <button
                            onClick={() => {
                              setExtendTimeOrder(order);
                              setExtendMinutes(10);
                            }}
                            className="bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Add extra preparation time to live customer countdown"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+Time</span>
                          </button>

                          <button
                            onClick={() => setThermalReceiptOrder(order)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                            title="Print Kitchen Ticket"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Order Completed</span>
                        </button>
                        <button
                          onClick={() => setThermalReceiptOrder(order)}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Status: <span className="font-bold text-slate-200">{order.status}</span></span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/order/${order.id}`}
                            target="_blank"
                            className="text-slate-400 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                          >
                            <span>Customer View</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => setThermalReceiptOrder(order)}
                            className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* GloriaFood Signature: Full Incoming Order Review & Accept Modal */}
      {reviewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-orange-400">
                    {reviewOrderModal.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      reviewOrderModal.orderType === 'DELIVERY'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {reviewOrderModal.orderType}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">
                  Incoming Order Confirmation
                </h2>
              </div>
              <button
                onClick={() => setReviewOrderModal(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-white">{reviewOrderModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-bold text-slate-200">{reviewOrderModal.customerPhone}</span>
              </div>
              {reviewOrderModal.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Address:</span>
                  <span className="font-medium text-slate-200 text-right max-w-xs">
                    {reviewOrderModal.deliveryAddress}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Payment:</span>
                <span className="font-bold text-emerald-400">
                  {reviewOrderModal.paymentMethod === 'CARD_ONLINE' ? '💳 Paid Online' : '💵 Cash on Delivery'}
                </span>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Order Items ({reviewOrderModal.items?.length || 0})
              </span>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto space-y-2">
                {reviewOrderModal.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-800/50 pb-1.5">
                    <div>
                      <span className="font-bold text-white">{it.quantity}x {it.itemName}</span>
                      {it.selectedOptions && it.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-slate-400">
                          {it.selectedOptions.map((o) => o.optionName).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-slate-300 font-bold">$${it.itemTotal?.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1 font-bold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-orange-400">$${reviewOrderModal.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Dedicated Preparation Time Selection */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-orange-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Custom Preparation Time</span>
                </span>
                <span className="text-xs font-mono font-black text-orange-400">
                  Target: ~{calculateReadyTimePreview(getOrderPrepMinutes(reviewOrderModal.id, 25))}
                </span>
              </div>

              {/* Preset Chips */}
              <div className="grid grid-cols-6 gap-1.5">
                {[15, 20, 25, 30, 45, 60].map((mins) => {
                  const isSelected = getOrderPrepMinutes(reviewOrderModal.id, 25) === mins;
                  return (
                    <button
                      key={mins}
                      onClick={() => setOrderPrepMinutes(reviewOrderModal.id, mins)}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white ring-2 ring-orange-400 shadow-md scale-105'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  );
                })}
              </div>

              {/* Stepper with +/- */}
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-400">Adjust Custom Minutes:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustMinutes(reviewOrderModal.id, -5)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={getOrderPrepMinutes(reviewOrderModal.id, 25)}
                    onChange={(e) => setOrderPrepMinutes(reviewOrderModal.id, e.target.value)}
                    className="w-14 bg-slate-950 border border-slate-700 rounded-lg py-1 text-center font-mono font-black text-sm text-orange-400 focus:outline-hidden"
                  />
                  <button
                    onClick={() => adjustMinutes(reviewOrderModal.id, 5)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * The customer live tracking screen will immediately display confirmed <strong className="text-white">{getOrderPrepMinutes(reviewOrderModal.id, 25)} minutes</strong> prep time and begin countdown.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() =>
                  handleAcceptOrder(
                    reviewOrderModal.id,
                    getOrderPrepMinutes(reviewOrderModal.id, 25)
                  )
                }
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white py-3 rounded-2xl text-sm font-black shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-5 h-5" />
                <span>
                  Accept Order with {getOrderPrepMinutes(reviewOrderModal.id, 25)}m Prep Time
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(reviewOrderModal);
                    setRejectModalOpen(true);
                  }}
                  className="flex-1 bg-red-950/50 hover:bg-red-900/80 text-red-300 border border-red-900/40 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => setThermalReceiptOrder(reviewOrderModal)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                  title="Print Ticket"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Kitchen Prep Time Modal */}
      {extendTimeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">
                Add Extra Prep Time - {extendTimeOrder.orderNumber}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Kitchen running late? Add extra minutes to this active order. The customer tracking countdown will immediately extend live.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setExtendMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    extendMinutes === mins
                      ? 'bg-amber-600 text-white font-black ring-2 ring-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  +{mins}m
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Custom extra mins:</span>
              <input
                type="number"
                min="1"
                max="60"
                value={extendMinutes}
                onChange={(e) => setExtendMinutes(Math.max(1, Number(e.target.value) || 5))}
                className="w-16 bg-slate-900 border border-slate-700 text-center text-amber-400 font-bold py-1 rounded-lg"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Current: <strong className="text-white">{extendTimeOrder.prepMinutes || 25}m</strong> ➔ New Total: <strong className="text-amber-400 font-bold">{(extendTimeOrder.prepMinutes || 25) + Number(extendMinutes)} mins</strong>
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setExtendTimeOrder(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExtendPrepTime(extendTimeOrder, extendMinutes)}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Apply +{extendMinutes}m
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
                {thermalReceiptOrder.prepMinutes && (
                  <p className="font-bold text-black">Prep Time: {thermalReceiptOrder.prepMinutes} mins</p>
                )}
              </div>

              <div className="border-t border-b border-black py-2 space-y-2">
                {thermalReceiptOrder.items?.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>{it.quantity}x {it.itemName}</span>
                      <span>$${it.itemTotal?.toFixed(2)}</span>
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
                  <span>$${thermalReceiptOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>$${thermalReceiptOrder.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>$${thermalReceiptOrder.deliveryFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-black">
                  <span>TOTAL:</span>
                  <span>$${thermalReceiptOrder.totalAmount?.toFixed(2)}</span>
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
