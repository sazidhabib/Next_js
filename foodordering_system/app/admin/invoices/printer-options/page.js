'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '@/lib/adminContext';
import { Printer, Save, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PrinterOptionsPage() {
  const { selectedRestaurant } = useAdmin();
  const [customerTemplates, setCustomerTemplates] = useState([]);
  const [kitchenTemplates, setKitchenTemplates] = useState([]);
  const [activeCustomerTemplateId, setActiveCustomerTemplateId] = useState('');
  const [activeKitchenTemplateId, setActiveKitchenTemplateId] = useState('');
  const [kitchenPrinterIp, setKitchenPrinterIp] = useState('');
  const [kitchenPrinterPort, setKitchenPrinterPort] = useState('9100');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'

  // Network scanning & testing states
  const [scanning, setScanning] = useState(false);
  const [testing, setTesting] = useState(false);
  const [scannedPrinters, setScannedPrinters] = useState([]);
  const [testMessage, setTestMessage] = useState(null);

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
          setKitchenPrinterIp(settingsJson.data.kitchenPrinterIp || '');
          setKitchenPrinterPort(settingsJson.data.kitchenPrinterPort || '9100');
        }
      } catch (err) {
        console.error('Error loading printer options data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedRestaurant]);

  // Scan network for thermal printers
  const handleScanNetwork = async () => {
    setScanning(true);
    setScannedPrinters([]);
    setTestMessage(null);
    try {
      const res = await fetch('/api/admin/printer-scan');
      const json = await res.json();
      if (json.success) {
        setScannedPrinters(json.printers || []);
        if (json.printers && json.printers.length === 0) {
          setTestMessage({ success: false, text: 'No active printers found on port 9100. You can enter the IP manually.' });
          toast.info('No active printers detected on subnet. Enter IP manually.');
        } else {
          toast.success(`Found ${json.printers.length} active printer(s) on network!`);
        }
      } else {
        toast.error(json.error || 'Failed to scan local subnet');
      }
    } catch (err) {
      console.error('Subnet scan error:', err);
      toast.error('Network error while scanning subnet');
    } finally {
      setScanning(false);
    }
  };

  // Test printer connection
  const handleTestConnection = async () => {
    if (!kitchenPrinterIp) return;
    setTesting(true);
    setTestMessage(null);
    try {
      const res = await fetch('/api/admin/printer-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: kitchenPrinterIp, port: kitchenPrinterPort }),
      });
      const json = await res.json();
      if (json.success) {
        setTestMessage({ success: true, text: '✅ Printer connected successfully!' });
        toast.success('Printer connection verified successfully!');
      } else {
        setTestMessage({ success: false, text: `❌ ${json.error || 'Connection failed'}` });
        toast.error(json.error || 'Printer connection failed');
      }
    } catch (err) {
      console.error('Test connection error:', err);
      setTestMessage({ success: false, text: '❌ Network timeout or invalid IP address' });
      toast.error('Network timeout or invalid IP address');
    } finally {
      setTesting(false);
    }
  };

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
          kitchenPrinterIp: kitchenPrinterIp || null,
          kitchenPrinterPort: kitchenPrinterPort ? parseInt(kitchenPrinterPort) : 9100,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaveStatus('success');
        toast.success('Printer options updated successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        toast.error(json.error || 'Failed to update printer options');
      }
    } catch (err) {
      console.error('Error updating printer options:', err);
      setSaveStatus('error');
      toast.error('Network error updating printer options');
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
          Select customized templates and configure local network ESC/POS thermal printers for kitchen and prep tickets.
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

          {/* Network Printer Configuration */}
          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Network Kitchen Printer</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase">
                ESC/POS Raw TCP
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Configure a network ESC/POS thermal receipt printer (raw TCP socket on port 9100) to automatically print kitchen copies on incoming orders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Printer IP Address</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.100"
                  value={kitchenPrinterIp}
                  onChange={(e) => setKitchenPrinterIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Printer Port</label>
                <input
                  type="number"
                  placeholder="9100"
                  value={kitchenPrinterPort}
                  onChange={(e) => setKitchenPrinterPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleScanNetwork}
                disabled={scanning}
                className="bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    <span>Searching Subnet...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Search Network Printers</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !kitchenPrinterIp}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-55 disabled:cursor-not-allowed text-white text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {testing ? 'Testing...' : 'Test Printer Connection'}
              </button>
            </div>

            {/* Scan results selector */}
            {scannedPrinters.length > 0 && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-400">Available printers found on network:</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const [ip, port] = e.target.value.split(':');
                      setKitchenPrinterIp(ip);
                      setKitchenPrinterPort(port);
                    }
                  }}
                  className="w-full bg-slate-950 border border-emerald-800 rounded-xl p-3.5 text-xs text-white focus:outline-none font-semibold"
                >
                  <option value="">-- Choose one of the detected printers --</option>
                  {scannedPrinters.map((p, idx) => (
                    <option key={idx} value={`${p.ip}:${p.port}`}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Test result messages */}
            {testMessage && (
              <p className={`text-xs font-bold pt-1 ${testMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {testMessage.text}
              </p>
            )}
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
