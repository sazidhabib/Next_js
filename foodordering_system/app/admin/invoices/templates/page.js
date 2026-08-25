'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/adminContext';
import {
  Plus,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Copy,
  Edit2,
  RotateCcw,
  Save,
  Check,
  Eye,
  Settings,
  Printer,
  ChevronUp,
} from 'lucide-react';

export default function InvoiceTemplatesPage() {
  const { selectedRestaurant } = useAdmin();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplateType, setNewTemplateType] = useState('CUSTOMER');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  // Load templates
  useEffect(() => {
    if (!selectedRestaurant) return;
    async function loadTemplates() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/templates?restaurantId=${selectedRestaurant.id}`);
        const json = await res.json();
        if (json.success) {
          setTemplates(json.data);
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [selectedRestaurant]);

  // Handle Save
  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingTemplate.name,
          fontSize: editingTemplate.fontSize,
          config: editingTemplate.config,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? json.data : t))
        );
        alert('Template saved successfully!');
      } else {
        alert(json.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Network error while saving template');
    } finally {
      setSaving(false);
    }
  };

  // Handle Add
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    setSaving(true);
    try {
      const defaultConfig =
        newTemplateType === 'CUSTOMER'
          ? {
              paymentMethod: true,
              time: true,
              estimatedDriveTime: true,
              direction: true,
              onPremiseNumber: true,
              orderDetails: true,
              clientInfo: true,
              clientComment: true,
              items: true,
              isPaid: true,
              orderOnline: true,
              contactDetails: true,
              infoBox1: false,
              infoBox2: false,
              infoBox3: false,
              clientConfirmation: false,
            }
          : {
              header: true,
              onPremiseNumber: true,
              orderDetails: true,
              clientComment: true,
              items: true,
              isPaid: true,
              packagingStationQualityControl: false,
              previewOptions: true,
              ticketHolderSpace: true,
            };

      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          name: newTemplateName,
          type: newTemplateType,
          fontSize: 12,
          config: defaultConfig,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => [json.data, ...prev]);
        setNewTemplateName('');
        setIsAddModalOpen(false);
        // Open immediately in edit mode
        setEditingTemplate({
          ...json.data,
          config: JSON.parse(json.data.config),
        });
      } else {
        alert(json.error || 'Failed to create template');
      }
    } catch (err) {
      console.error('Error creating template:', err);
    } finally {
      setSaving(false);
    }
  };

  // Duplicate template
  const handleDuplicateTemplate = async (template) => {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          name: `${template.name} (Copy)`,
          type: template.type,
          fontSize: template.fontSize,
          config: JSON.parse(template.config),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => [json.data, ...prev]);
      } else {
        alert(json.error || 'Failed to duplicate template');
      }
    } catch (err) {
      console.error('Error duplicating template:', err);
    }
  };

  // Delete template
  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(json.error || 'Failed to delete template');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  // Reset to default settings
  const handleResetToDefault = () => {
    if (!editingTemplate) return;
    const defaultConfig =
      editingTemplate.type === 'CUSTOMER'
        ? {
            paymentMethod: true,
            time: true,
            estimatedDriveTime: true,
            direction: true,
            onPremiseNumber: true,
            orderDetails: true,
            clientInfo: true,
            clientComment: true,
            items: true,
            isPaid: true,
            orderOnline: true,
            contactDetails: true,
            infoBox1: false,
            infoBox2: false,
            infoBox3: false,
            clientConfirmation: false,
          }
        : {
            header: true,
            onPremiseNumber: true,
            orderDetails: true,
            clientComment: true,
            items: true,
            isPaid: true,
            packagingStationQualityControl: false,
            previewOptions: true,
            ticketHolderSpace: true,
          };
    setEditingTemplate((prev) => ({
      ...prev,
      fontSize: 12,
      config: defaultConfig,
    }));
  };

  // Toggle settings elements helper
  const toggleConfigItem = (key) => {
    setEditingTemplate((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: !prev.config[key],
      },
    }));
  };

  // Render component settings toggles list
  const renderToggles = () => {
    if (!editingTemplate) return null;
    const config = editingTemplate.config;

    const labels =
      editingTemplate.type === 'CUSTOMER'
        ? [
            { key: 'paymentMethod', label: 'Payment method' },
            { key: 'time', label: 'Time & Fulfillment' },
            { key: 'estimatedDriveTime', label: 'Estimated drive time (delivery only)' },
            { key: 'direction', label: 'Direction & QR code (delivery only)' },
            { key: 'onPremiseNumber', label: 'On premise order number' },
            { key: 'orderDetails', label: 'Order details meta' },
            { key: 'clientInfo', label: 'Client info details' },
            { key: 'clientComment', label: 'Client comment/notes' },
            { key: 'items', label: 'Order items listing' },
            { key: 'isPaid', label: 'Is Paid/Unpaid footer checkbox' },
            { key: 'orderOnline', label: 'Order online banner' },
            { key: 'contactDetails', label: 'Store contact details' },
            { key: 'infoBox1', label: 'Custom Info box 1' },
            { key: 'infoBox2', label: 'Custom Info box 2' },
            { key: 'infoBox3', label: 'Custom Info box 3' },
            { key: 'clientConfirmation', label: 'Client confirmation signature space' },
          ]
        : [
            { key: 'header', label: 'Top Header banner (ASAP/Delivery details)' },
            { key: 'onPremiseNumber', label: 'On premise order number' },
            { key: 'orderDetails', label: 'Order details meta' },
            { key: 'clientComment', label: 'Client comment/notes' },
            { key: 'items', label: 'Order items listing with checkboxes' },
            { key: 'isPaid', label: 'Paid / Not Paid indicator' },
            { key: 'packagingStationQualityControl', label: 'Packaging station quality control box' },
          ];

    return (
      <div className="space-y-3">
        {labels.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
          >
            <span className="text-xs text-slate-200 font-semibold">{item.label}</span>
            <button
              onClick={() => toggleConfigItem(item.key)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                config[item.key] ? 'bg-orange-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform duration-200 ${
                  config[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render receipt mockup dynamic HTML
  const renderReceiptMockup = () => {
    if (!editingTemplate) return null;
    const config = editingTemplate.config;
    const fs = `${editingTemplate.fontSize}px`;

    if (editingTemplate.type === 'CUSTOMER') {
      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-slate-900 p-6 shadow-2xl rounded-sm border-t-8 border-orange-500 font-sans max-w-[360px] mx-auto space-y-4 text-left transition-all"
        >
          {/* Header Store Profile */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-1">
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              {selectedRestaurant?.name || 'Bella Vista Gourmet'}
            </h3>
            <p className="text-[10px] text-slate-500">
              742 Evergreen Terrace, San Francisco, CA
            </p>
          </div>

          {/* Payment Method Option */}
          {config.paymentMethod && (
            <div className="bg-slate-100 p-2.5 rounded border border-slate-200 space-y-0.5">
              <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-500">
                Payment Method
              </span>
              <div className="flex justify-between font-extrabold">
                <span>CARD ONLINE</span>
                <span>EXP 2026-12 ending in 5452</span>
              </div>
            </div>
          )}

          {/* Time & Fulfillment */}
          {config.time && (
            <div className="bg-slate-100 p-2.5 rounded border border-slate-200 flex justify-between items-center font-extrabold">
              <span>ASAP Delivery</span>
              <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded">60 MIN</span>
            </div>
          )}

          {/* Estimated drive time */}
          {config.estimatedDriveTime && (
            <div className="border border-slate-200 p-2.5 rounded space-y-1">
              <span className="block font-bold text-[9px] text-slate-500 uppercase">Estimated Drive Time</span>
              <p className="font-bold">~10 mins (Calculated at 20:45)</p>
            </div>
          )}

          {/* Direction & QR code */}
          {config.direction && (
            <div className="border border-slate-200 p-2.5 rounded flex items-center gap-3">
              <div className="flex-1 space-y-0.5">
                <span className="block font-bold text-[9px] text-slate-500 uppercase">Delivery Address</span>
                <p className="font-bold leading-tight">14th Test Street, Longbridge, Apt 5B</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-[8px] font-bold">
                [QR CODE]
              </div>
            </div>
          )}

          {/* On premise order number */}
          {config.onPremiseNumber && (
            <div className="border-b border-dashed border-slate-200 pb-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">On Premise Order Number</span>
              <h4 className="text-xl font-black">#472</h4>
            </div>
          )}

          {/* Order Details Meta */}
          {config.orderDetails && (
            <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-dashed border-slate-200 pb-2">
              <div>
                <span className="block font-bold text-slate-500 uppercase">Order Ref</span>
                <span className="font-bold">ORD-9284920</span>
              </div>
              <div>
                <span className="block font-bold text-slate-500 uppercase">Placed At</span>
                <span className="font-bold">25 August at 20:04</span>
              </div>
            </div>
          )}

          {/* Client Info Details */}
          {config.clientInfo && (
            <div className="space-y-0.5 text-[10px] border-b border-dashed border-slate-200 pb-2">
              <span className="block font-bold text-slate-500 uppercase">Client Info</span>
              <p className="font-extrabold text-slate-800">Emma Watson</p>
              <p className="text-slate-600">+1 (555) 019-8765</p>
              <p className="text-slate-600">customer@example.com</p>
            </div>
          )}

          {/* Client Comment */}
          {config.clientComment && (
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-[10px] font-medium text-yellow-800">
              💡 <span className="font-bold">Client comment:</span> "Please call 123 at the intercom system. No mushrooms, please!"
            </div>
          )}

          {/* Order Items Listing */}
          {config.items && (
            <div className="space-y-2 border-b border-dashed border-slate-200 pb-3">
              <span className="block font-bold text-slate-500 uppercase text-[9px] tracking-wider">Items Ordered</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-bold">
                    <span>2x Pizza Prosciutto</span>
                    <span>$23.20</span>
                  </div>
                  <div className="pl-3 text-[9.5px] text-slate-500">
                    <p>Size: Small, Crust: Fluffy</p>
                    <p>Toppings: Extra mozzarella (+ $1.50)</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold">
                    <span>1x Pizza Pepperoni</span>
                    <span>$11.99</span>
                  </div>
                  <div className="pl-3 text-[9.5px] text-slate-500">
                    <p>Size: Medium, Crust: Crispy</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Info boxes */}
          {config.infoBox1 && (
            <div className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold">
              ℹ️ Custom Information Box 1 Details
            </div>
          )}
          {config.infoBox2 && (
            <div className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold">
              ℹ️ Custom Information Box 2 Details
            </div>
          )}
          {config.infoBox3 && (
            <div className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold">
              ℹ️ Custom Information Box 3 Details
            </div>
          )}

          {/* Client Confirmation Signature */}
          {config.clientConfirmation && (
            <div className="pt-6 border-t border-dashed border-slate-200 text-center space-y-8">
              <span className="text-[9px] uppercase font-bold text-slate-400">Client Signature Confirmation</span>
              <div className="w-48 mx-auto border-b border-slate-400"></div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="space-y-1.5 text-[10px] text-slate-600 pt-1.5">
            <div className="flex justify-between">
              <span>Sub-total:</span>
              <span>$35.19</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8.5%):</span>
              <span>$2.99</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-100 pt-1">
              <span>Total Amount:</span>
              <span>$38.18</span>
            </div>
          </div>

          {/* Is Paid footer checkbox */}
          {config.isPaid && (
            <div className="flex items-center justify-center gap-6 border border-slate-300 p-2 rounded-lg text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <input type="checkbox" id="mockPaid" defaultChecked />
                <label htmlFor="mockPaid">Paid</label>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="checkbox" id="mockNotPaid" />
                <label htmlFor="mockNotPaid">Not Paid</label>
              </div>
            </div>
          )}

          {/* Order Online Banner */}
          {config.orderOnline && (
            <div className="bg-slate-900 text-white text-center p-2 rounded text-[10px] font-bold">
              Order Online: paprikalongbridge.co.uk
            </div>
          )}

          {/* Store contact details */}
          {config.contactDetails && (
            <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2">
              <p>Email: info@bellavistapizzeria.com</p>
              <p>Phone: +1 (555) 345-6789</p>
            </div>
          )}
        </div>
      );
    } else {
      // KITCHEN TICKET MOCKUP
      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-slate-900 p-6 shadow-2xl rounded-sm border-t-8 border-slate-900 font-sans max-w-[360px] mx-auto space-y-4 text-left transition-all"
        >
          {/* Header Banner */}
          {config.header && (
            <div className="bg-slate-950 text-white p-3 rounded font-black text-center space-y-1">
              <div className="flex justify-between text-xs">
                <span>DELIVERY</span>
                <span>ASAP</span>
              </div>
              <div className="text-sm bg-orange-600 text-white px-2 py-0.5 rounded inline-block">
                60 MIN TIME WINDOW
              </div>
            </div>
          )}

          {/* Ticket holder space option */}
          {config.ticketHolderSpace && (
            <div className="border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center text-[9px] font-bold text-slate-400 rounded">
              [TICKET HOLDER CLAMPING MARGIN]
            </div>
          )}

          {/* On premise order number */}
          {config.onPremiseNumber && (
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
              <span className="font-bold text-xs uppercase text-slate-500">Order Number</span>
              <span className="text-2xl font-black">#472</span>
            </div>
          )}

          {/* Order Details Meta */}
          {config.orderDetails && (
            <div className="text-[10px] space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Ref: <strong className="text-slate-800">ORD-9284920</strong></span>
                <span>Accepted At: <strong className="text-slate-800">20:06</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Customer: <strong className="text-slate-800">Emma Watson</strong></span>
                <span>Delivery: <strong className="text-slate-800">ASAP (60 min)</strong></span>
              </div>
            </div>
          )}

          {/* Client Comment */}
          {config.clientComment && (
            <div className="bg-orange-50 border border-orange-200 p-2.5 rounded text-[10px] font-medium text-orange-950">
              ⚠️ <span className="font-extrabold text-orange-600">NOTE:</span> "No mushrooms, please! Intercom 123."
            </div>
          )}

          {/* Order Items Listing with Checkboxes */}
          {config.items && (
            <div className="space-y-3 border-t border-b border-dashed border-slate-300 py-3">
              <span className="block font-bold text-slate-500 uppercase text-[9px]">Items Preparation List</span>
              
              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">2x Pizza Prosciutto</p>
                  <p className="text-[10px] font-semibold text-slate-500 pl-4">Size: Small, Crust: Fluffy</p>
                  <p className="text-[10px] font-semibold text-slate-500 pl-4">Toppings: Extra mozzarella</p>
                </div>
                <div className="w-5 h-5 border-2 border-slate-400 rounded shrink-0"></div>
              </div>

              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">1x Pizza Pepperoni</p>
                  <p className="text-[10px] font-semibold text-slate-500 pl-4">Size: Medium, Crust: Crispy</p>
                </div>
                <div className="w-5 h-5 border-2 border-slate-400 rounded shrink-0"></div>
              </div>
            </div>
          )}

          {/* Is Paid Indicator */}
          {config.isPaid && (
            <div className="bg-slate-100 p-2 rounded text-center text-xs font-black border border-slate-200 flex justify-center gap-6">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" defaultChecked />
                <span>Paid</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" />
                <span>Not Paid</span>
              </label>
            </div>
          )}

          {/* Packaging station quality control box */}
          {config.packagingStationQualityControl && (
            <div className="border border-slate-400 p-2 rounded-lg text-center space-y-1.5">
              <span className="block font-bold text-[8.5px] uppercase tracking-wider text-slate-400">Packaging Station Check</span>
              <div className="flex justify-around text-[9px] font-bold text-slate-600">
                <span>[ ] Boxes</span>
                <span>[ ] Sauces</span>
                <span>[ ] Utensils</span>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // If loading lists
  if (loading && !editingTemplate) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100 flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-400">Loading invoice templates...</p>
        </div>
      </div>
    );
  }

  // --- EDITOR VIEW MODE ---
  if (editingTemplate) {
    return (
      <div className="p-4 sm:p-8 space-y-6 w-full max-w-7xl mx-auto text-slate-100">
        {/* Editor Top Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingTemplate(null)}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Edit: {editingTemplate.name}
                </h1>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded font-black uppercase">
                  {editingTemplate.type === 'CUSTOMER' ? 'Customer end' : 'Kitchen end'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Customize active fields, font-sizes, and print components for this template.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs px-3.5 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to default</span>
            </button>
            <button
              onClick={handleSaveTemplate}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-orange-600/10"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save template</span>
            </button>
          </div>
        </div>

        {/* Split Editor Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Paper Receipt Mockup preview */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center min-h-[500px]">
            <span className="block text-slate-500 font-extrabold uppercase text-[10px] tracking-widest text-center mb-6">
              Live Paper Receipt Mockup Preview
            </span>
            <div className="flex-1 flex items-center justify-center">
              {renderReceiptMockup()}
            </div>
          </div>

          {/* Right Panel: Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
              <h3 className="font-extrabold text-sm text-white">General Parameters</h3>
              
              {/* Name Editor */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Font Size Adjuster */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Base Font Size</span>
                  <span className="text-orange-400 font-black font-mono">{editingTemplate.fontSize}px</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-bold">10px</span>
                  <input
                    type="range"
                    min="10"
                    max="18"
                    step="1"
                    value={editingTemplate.fontSize}
                    onChange={(e) =>
                      setEditingTemplate((prev) => ({
                        ...prev,
                        fontSize: parseInt(e.target.value),
                      }))
                    }
                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">18px</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-sm text-white border-b border-slate-800 pb-3">Component Visibility Toggles</h3>
              {renderToggles()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST / MANAGEMENT VIEW MODE ---
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Invoice Templates</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and edit custom printable invoice templates for customers and the kitchen station.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-orange-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add template</span>
        </button>
      </div>

      {/* Grid List of Templates */}
      {templates.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-850 border-dashed p-12 rounded-3xl text-center space-y-3">
          <Settings className="w-8 h-8 text-slate-600 mx-auto animate-spin-slow" />
          <p className="text-sm font-bold text-slate-400">No invoice templates created yet.</p>
          <p className="text-xs text-slate-500">Create templates for client receipts or kitchen prep slips.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Template Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Base Font</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white text-sm">{template.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          template.type === 'CUSTOMER'
                            ? 'bg-emerald-500/25 text-emerald-300'
                            : 'bg-indigo-500/25 text-indigo-300'
                        }`}
                      >
                        {template.type === 'CUSTOMER' ? 'Client receipt' : 'Kitchen ticket'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{template.fontSize}px</td>
                    <td className="p-4 text-slate-400">
                      {new Date(template.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() =>
                          setEditingTemplate({
                            ...template,
                            config: JSON.parse(template.config),
                          })
                        }
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Edit template fields & style"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className="bg-slate-850 hover:bg-slate-750 text-slate-400 hover:text-white p-2 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Duplicate template"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="bg-slate-950 hover:bg-red-950/40 text-slate-500 hover:text-red-400 p-2 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Template Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form
            onSubmit={handleAddTemplate}
            className="bg-slate-900 border border-slate-800 text-slate-100 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-white">Add template</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Type Selector dropdown */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Template type</label>
                <select
                  value={newTemplateType}
                  onChange={(e) => setNewTemplateType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                >
                  <option value="CUSTOMER">Client receipt</option>
                  <option value="KITCHEN">Kitchen essentials</option>
                </select>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Customer Receipt, Kitchen Prep Slip"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-650 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-850">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-600/10"
              >
                {saving ? 'Creating...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
