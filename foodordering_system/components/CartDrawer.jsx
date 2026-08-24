'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { playSuccessSound } from './AudioAlert';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurant,
  serviceType,
  setServiceType,
}) {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 789-0123');
  const [customerEmail, setCustomerEmail] = useState('sarah.j@example.com');
  const [deliveryAddress, setDeliveryAddress] = useState('450 Mission St, Apt 14B, San Francisco, CA');
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(restaurant?.deliveryZones?.[0]?.id || 'zone-1');
  const [timingType, setTimingType] = useState('ASAP'); // 'ASAP' | 'SCHEDULED'
  const [scheduledTime, setScheduledTime] = useState('19:30');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const selectedZone =
    restaurant?.deliveryZones?.find((z) => z.id === selectedZoneId) ||
    restaurant?.deliveryZones?.[0];

  let deliveryFee = 0;
  if (serviceType === 'DELIVERY') {
    if (selectedZone) {
      if (
        selectedZone.freeDeliveryThreshold &&
        subtotal >= selectedZone.freeDeliveryThreshold
      ) {
        deliveryFee = 0;
      } else {
        deliveryFee = selectedZone.deliveryFee || 2.99;
      }
    } else {
      deliveryFee = 2.99;
    }
  }

  const taxRate = (restaurant?.taxRatePercent || 8.5) / 100;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  // Zone Minimum Order Validation
  const minOrderAmount =
    serviceType === 'DELIVERY' ? selectedZone?.minOrderAmount || 15.0 : 0;
  const isBelowMinimum = subtotal > 0 && subtotal < minOrderAmount;
  const amountNeededForMin = Math.max(0, minOrderAmount - subtotal);

  // Free delivery threshold progress
  const freeThreshold = selectedZone?.freeDeliveryThreshold || 40.0;
  const freeDeliveryRemaining = Math.max(0, freeThreshold - subtotal);

  // Handle Checkout submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (isBelowMinimum) {
      setErrorMessage(
        `Minimum order for this delivery zone is $${minOrderAmount.toFixed(2)}. Please add $${amountNeededForMin.toFixed(2)} more.`
      );
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please enter your name and phone number.');
      return;
    }

    if (serviceType === 'DELIVERY' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        restaurantId: restaurant?.id,
        customerName,
        customerPhone,
        customerEmail,
        orderType: serviceType,
        deliveryAddress: serviceType === 'DELIVERY' ? deliveryAddress : null,
        deliveryZoneName: selectedZone?.name || 'Standard Zone',
        specialNotes,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
        paymentMethod,
        scheduledFor: timingType === 'SCHEDULED' ? scheduledTime : null,
        items: cartItems,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        playSuccessSound();
        onClearCart();
        onClose();
        router.push(`/order/${data.data.id || data.data.orderNumber}`);
      } else {
        setErrorMessage(data.error || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('Network error during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Your Order</h2>
              <span className="bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fulfillment Toggle inside cart */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setServiceType('DELIVERY')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                serviceType === 'DELIVERY'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🛵 Delivery
            </button>
            <button
              type="button"
              onClick={() => setServiceType('PICKUP')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                serviceType === 'PICKUP'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🛍️ Pickup
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-slate-800">
            {/* Free Delivery Banner Indicator */}
            {serviceType === 'DELIVERY' && selectedZone && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                {freeDeliveryRemaining > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                      <span>Add ${freeDeliveryRemaining.toFixed(2)} for FREE Delivery</span>
                      <span>${subtotal.toFixed(2)} / ${freeThreshold.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You unlocked FREE Delivery on this order!</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <p className="text-sm font-semibold">Your cart is empty</p>
                <p className="text-xs">Add delicious dishes from the menu to start ordering!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Dishes
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="p-3 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-orange-600">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Options List */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="text-[11px] text-slate-500 space-y-0.5 pl-2 border-l-2 border-orange-200">
                          {item.selectedOptions.map((opt, optIdx) => (
                            <div key={optIdx} className="flex justify-between">
                              <span>• {opt.optionName}</span>
                              {opt.optionPrice > 0 && (
                                <span className="text-slate-700 font-medium">
                                  +${opt.optionPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.specialNotes && (
                        <p className="text-[10px] text-amber-700 italic bg-amber-50/70 p-1 rounded">
                          Note: {item.specialNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            {cartItems.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer & Delivery Info
                </h3>

                {/* Delivery Zone Picker */}
                {serviceType === 'DELIVERY' && restaurant?.deliveryZones && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>Select Delivery Zone</span>
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
                    >
                      {restaurant.deliveryZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} (Fee: ${z.deliveryFee?.toFixed(2)} | Min: ${z.minOrderAmount?.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Address */}
                {serviceType === 'DELIVERY' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Delivery Street Address & Unit
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      required
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
                    />
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                {/* Timing (ASAP vs Scheduled) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>Order Timing</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTimingType('ASAP')}
                      className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        timingType === 'ASAP'
                          ? 'bg-orange-50 border-orange-500 text-orange-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      ⚡ ASAP (~30 mins)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimingType('SCHEDULED')}
                      className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                        timingType === 'SCHEDULED'
                          ? 'bg-orange-50 border-orange-500 text-orange-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      🕒 Pre-order for Later
                    </button>
                  </div>
                  {timingType === 'SCHEDULED' && (
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Payment Option</label>
                  <div className="space-y-1.5">
                    <div
                      onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'CASH_ON_DELIVERY'
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on {serviceType === 'DELIVERY' ? 'Delivery' : 'Pickup'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Pay upon receipt</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('CARD_ONLINE')}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'CARD_ONLINE'
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span>Credit / Debit Card Online</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">Instant Instant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Cost Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {serviceType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-orange-600 text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isBelowMinimum}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-98 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-orange-600/30 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Transmitting Order...</span>
                ) : isBelowMinimum ? (
                  <span>Min. Order ${minOrderAmount.toFixed(2)} (Need +${amountNeededForMin.toFixed(2)})</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
