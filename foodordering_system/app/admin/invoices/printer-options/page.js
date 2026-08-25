'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/adminContext';
import { Printer, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PrinterOptionsPage() {
  const { selectedRestaurant } = useAdmin();
  const [customerTemplates, setCustomerTemplates] = useState([]);
  const [kitchenTemplates, setKitchenTemplates] = useState([]);
  const [activeCustomerTemplateId, setActiveCustomerTemplateId] = useState('');
  const [activeKitchenTemplateId, setActiveKitchenTemplateId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    if (!selectedRestaurant) return;

    async function loadData() {
      try {
        setLoading(true);
        // Load templates and current printer settings
        const [templatesRes, settingsRes] = await Promise.all([
          fetch(`/api/admin/templates?restaurantId=${selectedRestaurant.id}`),
          fetch(`/api/admin/printer-settings?restaurantId=${selectedRestaurant.id}`),
        ]);

        const templatesJson = await templatesRes.json();
        const settingsJson = await settingsRes.json();

        if (templatesJson.success) {
          const allTemplates = templatesJson.data;
          setCustomerTemplates(allTemplates.filter((t) => t.type === 'CUSTOMER'));
          setKitchenTemplates(allTemplates.filter((t) => t.type === 'KITCHEN'));
        }

        if (settingsJson.success && settingsJson.data) {
          setActiveCustomerTemplateId(settingsJson.data.activeCustomerTemplateId || '');
          setActiveKitchenTemplateId(settingsJson.data.activeKitchenTemplateId || '');
        }
      } catch (err) {
        console.error('Error loading printer options data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedRestaurant]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant) return;
    setSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/admin/printer-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          activeCustomerTemplateId: activeCustomerTemplateId || null,
          activeKitchenTemplateId: activeKitchenTemplateId || null,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        alert(json.error || 'Failed to update printer options');
      }
    } catch (err) {
      console.error('Error updating printer options:', err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100 flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-400">Loading printer configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-3xl w-full mx-auto text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-white inline-flex items-center gap-2">
          <Printer className="w-6 h-6 text-orange-500" />
          <span>Printer Options</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select which customized templates should be used when printing receipts for customers and tickets for the kitchen.
        </p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
        <div className="space-y-5">
          {/* Customer Receipt Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
              Customer Receipt Template
            </label>
            <select
              value={activeCustomerTemplateId}
              onChange={(e) => setActiveCustomerTemplateId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
            >
              <option value="">-- Select Customer Template --</option>
              {customerTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Font: {t.fontSize}px)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-550">
              Used when printing receipts for customer checkouts, invoices, and delivery bags.
            </p>
          </div>

          {/* Kitchen Ticket Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
              Kitchen Ticket Template
            </label>
            <select
              value={activeKitchenTemplateId}
              onChange={(e) => setActiveKitchenTemplateId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
            >
              <option value="">-- Select Kitchen Template --</option>
              {kitchenTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Font: {t.fontSize}px)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-550">
              Used when printing preparation tickets for chef stations and packing tables.
            </p>
          </div>
        </div>

        {/* Action Button & Status Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-850">
          <div>
            {saveStatus === 'success' && (
              <span className="text-xs text-emerald-400 font-bold inline-flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Active printer configurations updated!
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-400 font-bold inline-flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Failed to save configurations.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs px-6 py-2.5 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-orange-600/10"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save active options</span>
          </button>
        </div>
      </form>
    </div>
  );
}
