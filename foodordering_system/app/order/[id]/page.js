'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  UtensilsCrossed,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  ArrowLeft,
  Printer,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { playOrderIncomingSound } from '@/components/AudioAlert';

export default function OrderTrackingPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastStatus, setLastStatus] = useState(null);
  const [now, setNow] = useState(Date.now());

  // 1-second live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll for live status updates
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        if (lastStatus && lastStatus !== json.data.status) {
          playOrderIncomingSound();
        }
        setLastStatus(json.data.status);
        setOrder(json.data);
      }
    } catch (err) {
      console.error('Polling error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 2500); // live polling every 2.5s
    return () => clearInterval(interval);
  }, [orderId, lastStatus]);

  if (loading && !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-700">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Order Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          We could not find an order matching identifier "{orderId}".
        </p>
        <Link
          href="/menu/bellavista-pizza"
          className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
        >
          Return to Menu
        </Link>
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
      desc: prepMinutes ? `Confirmed ${prepMinutes}m prep` : 'Cooking in kitchen',
      icon: ChefHat,
    },
    {
      label: order.orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
      desc: order.orderType === 'DELIVERY' ? 'Driver on the way' : 'Waiting on counter',
      icon: order.orderType === 'DELIVERY' ? Bike : UtensilsCrossed,
    },
    { label: 'Completed', desc: 'Enjoy your meal!', icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/menu/bellavista-pizza"
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              Order {order.orderNumber}
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Status Card (GloriaFood Animated Hero) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-center space-y-6">
          {/* Status Indicator Icon */}
          <div className="relative inline-flex items-center justify-center">
            {order.status === 'PENDING' && (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-500/20 animate-ring-pulse flex items-center justify-center">
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
          <div className="space-y-3 max-w-lg mx-auto">
            {order.status === 'PENDING' && (
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Waiting for Kitchen Confirmation...
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  The restaurant order console is currently ringing. You will receive an immediate confirmation with the exact preparation time once accepted.
                </p>
              </div>
            )}

            {isCooking && (
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kitchen Confirmed: {prepMinutes || 25} Minutes Prep Time</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Order Accepted & Cooking!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    The restaurant selected <strong className="text-slate-900 font-extrabold">{prepMinutes || 25} minutes</strong> preparation time for your order.
                  </p>
                </div>

                {/* Real-time Countdown Box */}
                <div className="bg-gradient-to-b from-orange-50/80 to-amber-50/40 border border-orange-200/80 rounded-2xl p-4 shadow-sm space-y-3 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
                        <Clock className="w-5 h-5 animate-spin" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Estimated Ready Time
                        </span>
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {readyTimeFormatted || `~${prepMinutes || 25} mins`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                        Live Countdown
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-orange-600">
                        {msLeft !== null && msLeft > 0
                          ? `${remainingMinutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`
                          : 'Almost Ready!'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
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
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Freshly cooked in {prepMinutes || 25} minutes</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-indigo-700">
                  {order.orderType === 'DELIVERY'
                    ? 'Driver Out For Delivery'
                    : 'Order Ready for Pickup!'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  {order.orderType === 'DELIVERY'
                    ? 'Your meal is packaged in thermal bags and headed your way.'
                    : `Your fresh order is waiting at the counter. Please present order ${order.orderNumber}.`}
                </p>
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Order Completed
                </h1>
                <p className="text-xs sm:text-sm text-emerald-600 font-semibold">
                  Thank you for ordering with Bella Vista Gourmet!
                </p>
              </div>
            )}

            {isRejected && (
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-red-600">
                  Order Could Not Be Accepted
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Reason: {order.rejectionReason || 'Kitchen is currently unavailable.'}
                </p>
              </div>
            )}
          </div>

          {/* Stepper Timeline */}
          {!isRejected && (
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-orange-500/20 scale-105' : ''}`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p
                          className={`text-[11px] sm:text-xs font-bold leading-tight ${
                            isDone ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">
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

        {/* Order Details & Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items Summary (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Ordered Dishes
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-4 space-y-1.5 bg-slate-50/40">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-orange-600 text-sm">
                        {item.quantity}x
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.itemName}
                      </h4>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      ${item.itemTotal?.toFixed(2)}
                    </span>
                  </div>

                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-slate-500 pl-6 space-y-0.5">
                      {item.selectedOptions.map((opt, oIdx) => (
                        <div key={oIdx} className="flex justify-between">
                          <span>• {opt.optionName}</span>
                          {opt.optionPrice > 0 && (
                            <span>+${opt.optionPrice.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.specialNotes && (
                    <p className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded pl-6">
                      Note: {item.specialNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${order.taxAmount?.toFixed(2)}</span>
              </div>
              {order.orderType === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee?.toFixed(2)}`}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-orange-600">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery metadata (1 col) */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Fulfillment Info
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Customer</span>
                <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
              </div>

              {order.deliveryAddress && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Delivery Address</span>
                  </span>
                  <p className="font-medium text-slate-800 leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Payment Mode</span>
                <p className="font-bold text-slate-900">
                  {order.paymentMethod === 'CARD_ONLINE'
                    ? '💳 Paid Online (Card)'
                    : '💵 Cash on Fulfillment'}
                </p>
              </div>

              {order.invoiceNumber && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Invoice Number</span>
                  <p className="font-mono font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded inline-block">
                    {order.invoiceNumber}
                  </p>
                </div>
              )}

              {/* Kitchen Prep Confirmation Details */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium block">Kitchen Timing</span>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Chosen Prep Time:</span>
                    <span className="font-extrabold text-slate-900">
                      {prepMinutes ? `${prepMinutes} minutes` : 'Pending acceptance'}
                    </span>
                  </div>
                  {readyTimeFormatted && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Target Time:</span>
                      <span className="font-bold text-orange-600">{readyTimeFormatted}</span>
                    </div>
                  )}
                  {order.acceptedAt && (
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Accepted At:</span>
                      <span>{new Date(order.acceptedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
