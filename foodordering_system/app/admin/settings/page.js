'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Settings,
  Clock,
  Store,
  DollarSign,
  ShieldCheck,
  Check,
  CreditCard,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';

export default function AdminSettingsPage() {
  const { selectedRestaurant, selectRestaurant } = useAdmin();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxRate, setTaxRate] = useState(8.5);
  const [prepTime, setPrepTime] = useState(25);
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [enablePickup, setEnablePickup] = useState(true);
  const [enableDineIn, setEnableDineIn] = useState(false);
  const [enableCash, setEnableCash] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableOnline, setEnableOnline] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');

  const targetSlug = selectedRestaurant?.slug || 'bellavista-pizza';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurant?slug=${targetSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const r = json.data;
          setRestaurant(r);
          setName(r.name || '');
          setPhone(r.phone || '');
          setEmail(r.email || '');
          setAddress(r.address || '');
          setTaxRate(r.taxRatePercent || 0.0);
          setPrepTime(r.estimatedPrepTime || 25);
          setEnableDelivery(r.enableDelivery !== false);
          setEnablePickup(r.enablePickup !== false);
          setEnableDineIn(r.enableDineIn || false);
          setEnableCash(r.enableCash !== false);
          setEnableCard(r.enableCard !== false);
          setEnableOnline(r.enableOnline || false);
          setStripePublishableKey(r.stripePublishableKey || '');
          setStripeSecretKey(r.stripeSecretKey || '');
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [targetSlug]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: restaurant?.id,
          name,
          phone,
          email,
          address,
          taxRatePercent: parseFloat(taxRate),
          estimatedPrepTime: parseInt(prepTime),
          enableDelivery,
          enablePickup,
          enableDineIn,
          enableCash,
          enableCard,
          enableOnline,
          stripePublishableKey: enableOnline ? stripePublishableKey : '',
          stripeSecretKey: enableOnline ? stripeSecretKey : '',
        }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setSavedSuccess(true);
        toast.success('Restaurant settings saved successfully!');
        setRestaurant(data.data);
        if (selectedRestaurant?.id === restaurant?.id) {
          selectRestaurant(data.data);
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        const errorMsg = data.error || 'Failed to save configuration';
        setSaveError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      setSaveError('Network error saving settings');
      toast.error('Network error saving settings');
    }
  };

  const daysOfWeek = [
    { day: 'Monday', hours: '10:30 - 23:00' },
    { day: 'Tuesday', hours: '10:30 - 23:00' },
    { day: 'Wednesday', hours: '10:30 - 23:00' },
    { day: 'Thursday', hours: '10:30 - 23:30' },
    { day: 'Friday', hours: '10:30 - 00:00' },
    { day: 'Saturday', hours: '11:00 - 00:00' },
    { day: 'Sunday', hours: '11:00 - 22:30' },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-semibold max-w-5xl mx-auto">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-400">Loading Configuration Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Restaurant Profile & Operating Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage restaurant contact information, tax rates, operating windows, fulfillment channels, and payment settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
        {saveError && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <span>{saveError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-400" />
            <span>General Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Restaurant Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Default Prep Time (Mins)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-300">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Channels & Taxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Fulfillment Channels */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Fulfillment Channels
            </h3>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="font-bold text-slate-200">🛵 Online Delivery</span>
                <input
                  type="checkbox"
                  checked={enableDelivery}
                  onChange={(e) => setEnableDelivery(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="font-bold text-slate-200">🛍️ Customer Pickup</span>
                <input
                  type="checkbox"
                  checked={enablePickup}
                  onChange={(e) => setEnablePickup(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="font-bold text-slate-200">🍽️ Table Booking / Dine-in</span>
                <input
                  type="checkbox"
                  checked={enableDineIn}
                  onChange={(e) => setEnableDineIn(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
                />
              </label>
            </div>
          </div>

          {/* Tax Rate */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Tax Configuration</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Sales Tax / VAT Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Automatically calculated on order checkouts and displayed transparently on customer invoices and thermal kitchen print tickets.
              </p>
            </div>
          </div>
        </div>

        {/* Accepted Payment Configurations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <span>Accepted Payment Options</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-slate-200">Cash Payments</span>
                <span className="text-[10px] text-slate-500">Pay cash on delivery/pickup</span>
              </div>
              <input
                type="checkbox"
                checked={enableCash}
                onChange={(e) => setEnableCash(e.target.checked)}
                className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-slate-200">Offline Card Reader</span>
                <span className="text-[10px] text-slate-500">Pay via portable reader</span>
              </div>
              <input
                type="checkbox"
                checked={enableCard}
                onChange={(e) => setEnableCard(e.target.checked)}
                className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-slate-200">Online Card (Stripe)</span>
                <span className="text-[10px] text-slate-500">Digital checkout gateway</span>
              </div>
              <input
                type="checkbox"
                checked={enableOnline}
                onChange={(e) => setEnableOnline(e.target.checked)}
                className="w-4 h-4 accent-orange-600 cursor-pointer rounded"
              />
            </label>
          </div>

          {/* Stripe Key Fields */}
          {enableOnline && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fadeIn">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Stripe Publishable Key</label>
                <input
                  type="text"
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  placeholder="pk_test_..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Stripe Secret Key</label>
                <input
                  type="password"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  placeholder="sk_test_..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Operating Hours Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Weekly Operating Timetable</span>
          </h3>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
            {daysOfWeek.map((d, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 flex items-center justify-between"
              >
                <span className="font-bold text-slate-200">{d.day}</span>
                <span className="font-mono text-orange-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  {d.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
          >
            Save Restaurant Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
