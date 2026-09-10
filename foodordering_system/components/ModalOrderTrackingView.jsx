'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  UtensilsCrossed,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  Printer,
  Sparkles,
  X,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { playOrderIncomingSound } from './AudioAlert';
import PrintableInvoice from './PrintableInvoice';

export default function ModalOrderTrackingView({
  orderId,
  initialOrder = null,
  initialRestaurant = null,
  onClose,
}) {
  const [order, setOrder] = useState(initialOrder);
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [customerTemplate, setCustomerTemplate] = useState(null);
  const [kitchenTemplate, setKitchenTemplate] = useState(null);
  const [receiptType, setReceiptType] = useState('CUSTOMER'); // 'CUSTOMER' | 'KITCHEN'
  const [loading, setLoading] = useState(!initialOrder);
  const [lastStatus, setLastStatus] = useState(initialOrder?.status || null);
  const [now, setNow] = useState(Date.now());
  const [printReceiptModalOpen, setPrintReceiptModalOpen] = useState(false);

  // 1-second live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll for live status updates
  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        if (lastStatus && lastStatus !== json.data.status) {
          playOrderIncomingSound();
        }
        setLastStatus(json.data.status);
        setOrder(json.data);
        if (json.restaurant) setRestaurant(json.restaurant);
        if (json.customerTemplate) setCustomerTemplate(json.customerTemplate);
        if (json.kitchenTemplate) setKitchenTemplate(json.kitchenTemplate);
      }
    } catch (err) {
      console.error('Modal tracking polling error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 2500); // Polling every 2.5s
    return () => clearInterval(interval);
  }, [orderId, lastStatus]);

  if (loading && !order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="font-extrabold text-slate-800 text-sm">Connecting with Kitchen...</p>
          <p className="text-xs text-slate-400">Fetching live order status</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4 bg-white">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Order Information Unavailable</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            We could not retrieve order #{orderId}.
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  // Calculate timeline step
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'ACCEPTED':
      case 'PREPARING':
        return 1;
      case 'READY_FOR_PICKUP':
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'COMPLETED':
        return 3;
      case 'REJECTED':
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isRejected = order.status === 'REJECTED' || order.status === 'CANCELLED';

  // Live Prep & Ready Time Calculations
  const prepMinutes =
    order.prepMinutes ||
    (order.estimatedReadyAt && order.acceptedAt
      ? Math.round(
          (new Date(order.estimatedReadyAt).getTime() -
            new Date(order.acceptedAt).getTime()) /
            60000
        )
      : null);

  const estimatedReadyDate = order.estimatedReadyAt
    ? new Date(order.estimatedReadyAt)
    : null;
  const acceptedDate = order.acceptedAt ? new Date(order.acceptedAt) : null;

  const readyTimeFormatted = estimatedReadyDate
    ? estimatedReadyDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  const isCooking = order.status === 'ACCEPTED' || order.status === 'PREPARING';
  const msLeft = estimatedReadyDate ? estimatedReadyDate.getTime() - now : null;
  const totalSecondsLeft = msLeft !== null ? Math.max(0, Math.floor(msLeft / 1000)) : null;
  const remainingMinutes = totalSecondsLeft !== null ? Math.floor(totalSecondsLeft / 60) : null;
  const remainingSeconds = totalSecondsLeft !== null ? totalSecondsLeft % 60 : null;

  let progressPercent = 0;
  if (isCooking && acceptedDate && estimatedReadyDate) {
    const totalDuration = estimatedReadyDate.getTime() - acceptedDate.getTime();
    const elapsed = now - acceptedDate.getTime();
    if (totalDuration > 0) {
      progressPercent = Math.min(100, Math.max(8, Math.round((elapsed / totalDuration) * 100)));
    }
  } else if (order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_PICKUP') {
    progressPercent = 90;
  } else if (order.status === 'COMPLETED') {
    progressPercent = 100;
  }

  const steps = [
    { label: 'Order Sent', desc: 'Received by kitchen', icon: Clock },
    {
      label: 'Preparing',
      desc: prepMinutes ? `${prepMinutes}m prep` : 'In kitchen',
      icon: ChefHat,
    },
    {
      label: order.orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
      desc: order.orderType === 'DELIVERY' ? 'Driver on way' : 'On counter',
      icon: order.orderType === 'DELIVERY' ? Bike : UtensilsCrossed,
    },
    { label: 'Completed', desc: 'Enjoy meal', icon: PackageCheck },
  ];

  return (
    <div className="relative w-full bg-[#f8f9fa] flex flex-col overflow-hidden max-h-[90vh]">
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Live Order Tracking
          </span>
          <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
            #{order.orderNumber || order.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrintReceiptModalOpen(true)}
            className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* GloriaFood Hero Status Animation */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-5">
          {/* Animated Hero Icon */}
          <div className="relative inline-flex items-center justify-center">
            {order.status === 'PENDING' && (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-500/20 animate-ping flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/40">
                    <Clock className="w-7 h-7 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            {(order.status === 'ACCEPTED' || order.status === 'PREPARING') && (
              <div className="w-18 h-18 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border-4 border-amber-200 animate-pulse">
                <ChefHat className="w-9 h-9" />
              </div>
            )}

            {(order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY') && (
              <div className="w-18 h-18 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-4 border-indigo-200">
                <Bike className="w-9 h-9 animate-bounce" />
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            )}

            {isRejected && (
              <div className="w-18 h-18 rounded-full bg-red-100 text-red-600 flex items-center justify-center border-4 border-red-200">
                <AlertCircle className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Status Title & Real-time message */}
          <div className="space-y-2 max-w-lg mx-auto">
            {order.status === 'PENDING' && (
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Waiting for Kitchen Confirmation...
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  The restaurant order console is currently ringing. You will receive an immediate confirmation with the exact preparation time once accepted.
                </p>
              </div>
            )}

            {isCooking && (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kitchen Confirmed: {prepMinutes || 25} Minutes Prep Time</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Order Accepted & Cooking!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  The chef selected <strong className="text-slate-900 font-extrabold">{prepMinutes || 25} minutes</strong> preparation time for your order.
                </p>

                {/* Real-time Countdown Box */}
                <div className="bg-gradient-to-b from-orange-50/80 to-amber-50/30 border border-orange-200 rounded-2xl p-4 shadow-2xs space-y-3 text-left mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
                        <Clock className="w-4 h-4 animate-spin" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Target Ready Time
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          {readyTimeFormatted || `~${prepMinutes || 25} mins`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                        Live Countdown
                      </span>
                      <span className="text-sm sm:text-base font-mono font-black text-orange-600">
                        {msLeft !== null && msLeft > 0
                          ? `${remainingMinutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`
                          : 'Almost Ready!'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Kitchen Accepted</span>
                      <span className="text-orange-600 font-bold">{progressPercent}% Progress</span>
                      <span>Target: {readyTimeFormatted || `${prepMinutes || 25}m`}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_PICKUP') && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Freshly prepared in {prepMinutes || 25} minutes</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-indigo-700">
                  {order.orderType === 'DELIVERY'
                    ? 'Driver Out For Delivery'
                    : 'Order Ready for Pickup!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {order.orderType === 'DELIVERY'
                    ? 'Your meal is packed in thermal bags and headed your way.'
                    : `Your fresh order is waiting at the counter. Please show order ${order.orderNumber}.`}
                </p>
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Order Completed!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-600 font-semibold">
                  Thank you for ordering with {restaurant?.name || 'Bella Vista Gourmet'}!
                </p>
              </div>
            )}

            {isRejected && (
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-red-600">
                  Order Could Not Be Accepted
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Reason: {order.rejectionReason || 'Kitchen is currently at capacity.'}
                </p>
              </div>
            )}
          </div>

          {/* Stepper Timeline */}
          {!isRejected && (
            <div className="pt-4 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center space-y-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-orange-500/20 scale-105' : ''}`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p
                          className={`text-[10px] sm:text-xs font-bold leading-tight ${
                            isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[9px] text-slate-400 hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2-Columns: Items Summary & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left (7 cols): Dishes */}
          <div className="md:col-span-7 bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ordered Dishes
              </span>
              <span className="text-xs font-bold text-slate-700">
                {order.items?.length || 0} items
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 space-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-orange-600 text-xs">
                        {item.quantity}x
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {item.itemName}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 text-xs">
                      £{item.itemTotal?.toFixed(2)}
                    </span>
                  </div>

                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-[10px] text-slate-500 pl-5 space-y-0.5">
                      {item.selectedOptions.map((opt, oIdx) => (
                        <div key={oIdx} className="flex justify-between">
                          <span>• {opt.optionName}</span>
                          {opt.optionPrice > 0 && (
                            <span>+£{opt.optionPrice.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-2 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">£{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes Included</span>
                <span>£{order.taxAmount?.toFixed(2)}</span>
              </div>
              {order.orderType === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `£${order.deliveryFee?.toFixed(2)}`}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-£{order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-orange-600">£{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right (5 cols): Fulfillment & Customer info */}
          <div className="md:col-span-5 bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block pb-2 border-b border-slate-100">
              Delivery & Contact
            </span>

            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Customer</span>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
              </div>

              {order.deliveryAddress && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-600" />
                    <span>Delivery Address</span>
                  </span>
                  <p className="font-medium text-slate-800 leading-snug">
                    {order.deliveryAddress}
                  </p>
                </div>
              )}

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Payment Mode</span>
                <p className="font-bold text-slate-900">
                  {order.paymentMethod === 'CARD_ONLINE'
                    ? '💳 Paid Online (Card)'
                    : order.paymentMethod?.includes('CARD')
                    ? '💳 Card on Delivery'
                    : '💵 Cash on Fulfillment'}
                </p>
              </div>

              {order.invoiceNumber && (
                <div className="space-y-0.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Invoice #</span>
                  <p className="font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded inline-block text-[11px]">
                    {order.invoiceNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Back to Menu Action */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Back to Restaurant Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Receipt Preview & Print Modal */}
      {printReceiptModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900">Receipt #{order.orderNumber || order.id}</h3>
              </div>
              <button
                onClick={() => setPrintReceiptModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Type Toggle (Client Copy vs Kitchen Copy) */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 no-print">
              <button
                type="button"
                onClick={() => setReceiptType('CUSTOMER')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  receiptType === 'CUSTOMER'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Client Copy
              </button>
              <button
                type="button"
                onClick={() => setReceiptType('KITCHEN')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  receiptType === 'KITCHEN'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kitchen Copy
              </button>
            </div>

            {/* Receipt Content */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-center">
              <PrintableInvoice
                order={order}
                template={receiptType === 'CUSTOMER' ? customerTemplate : kitchenTemplate}
                type={receiptType}
                restaurant={restaurant}
              />
            </div>

            {/* Print Modal Footer Actions */}
            <div className="flex items-center gap-2 pt-1 no-print">
              <button
                onClick={() => setPrintReceiptModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-orange-600 hover:bg-orange-500 active:scale-98 text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
