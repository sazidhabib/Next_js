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
  const [expandedSection, setExpandedSection] = useState(null);

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

  const getSectionVal = (key, field, defaultValue) => {
    const item = editingTemplate?.config?.[key];
    if (item === undefined) return defaultValue;
    if (typeof item === 'boolean') {
      if (field === 'visible') return item;
      return defaultValue;
    }
    if (item[field] !== undefined) return item[field];
    return defaultValue;
  };

  const updateSectionVal = (key, field, value) => {
    setEditingTemplate((prev) => {
      const current = prev.config[key];
      let updatedItem = {};
      if (typeof current === 'boolean') {
        updatedItem = {
          visible: current,
          fontSize: 12,
          value: key === 'onPremiseNumber' ? '1' : '',
        };
      } else {
        updatedItem = { ...current };
      }
      updatedItem[field] = value;
      return {
        ...prev,
        config: {
          ...prev.config,
          [key]: updatedItem,
        },
      };
    });
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
        {labels.map((item) => {
          const isVisible = getSectionVal(item.key, 'visible', true);
          const currentFontSize = getSectionVal(item.key, 'fontSize', 12);
          const customValue = getSectionVal(item.key, 'value', item.key === 'onPremiseNumber' ? '1' : '');
          const isExpanded = expandedSection === item.key;

          return (
            <div
              key={item.key}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
            >
              {/* Header bar of accordion */}
              <div className="flex items-center justify-between p-3.5 select-none">
                <div
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  onClick={() => setExpandedSection(isExpanded ? null : item.key)}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  <span className="text-xs text-slate-200 font-semibold">{item.label}</span>
                </div>
                
                <button
                  onClick={() => updateSectionVal(item.key, 'visible', !isVisible)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                    isVisible ? 'bg-orange-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform duration-200 ${
                      isVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-950/40 space-y-4">
                  {/* Font Size controls */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Section Font Size:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateSectionVal(item.key, 'fontSize', Math.max(9, currentFontSize - 1))}
                        className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-orange-400 w-10 text-center">{currentFontSize}px</span>
                      <button
                        type="button"
                        onClick={() => updateSectionVal(item.key, 'fontSize', Math.min(32, currentFontSize + 1))}
                        className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Value override for On premise number */}
                  {item.key === 'onPremiseNumber' && (
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400 font-bold block">On Premise Order Number:</label>
                      <input
                        type="text"
                        value={customValue}
                        onChange={(e) => updateSectionVal(item.key, 'value', e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder:text-slate-650 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
          {getSectionVal('paymentMethod', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('paymentMethod', 'fontSize', 11)}px` }}
              className="bg-slate-100 p-2.5 rounded border border-slate-200 space-y-0.5"
            >
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
          {getSectionVal('time', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('time', 'fontSize', 11)}px` }}
              className="bg-slate-100 p-2.5 rounded border border-slate-200 flex justify-between items-center font-extrabold"
            >
              <span>ASAP Delivery</span>
              <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded">60 MIN</span>
            </div>
          )}

          {/* Estimated drive time */}
          {getSectionVal('estimatedDriveTime', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('estimatedDriveTime', 'fontSize', 11)}px` }}
              className="border border-slate-200 p-2.5 rounded space-y-1"
            >
              <span className="block font-bold text-[9px] text-slate-500 uppercase">Estimated Drive Time</span>
              <p className="font-bold">~10 mins (Calculated at 20:45)</p>
            </div>
          )}

          {/* Direction & QR code */}
          {getSectionVal('direction', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('direction', 'fontSize', 11)}px` }}
              className="border border-slate-200 p-2.5 rounded flex items-center gap-3"
            >
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
          {getSectionVal('onPremiseNumber', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('onPremiseNumber', 'fontSize', 20)}px` }}
              className="border-b border-dashed border-slate-200 pb-2 text-center"
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">On Premise Order Number</span>
              <h4 className="font-black">#{getSectionVal('onPremiseNumber', 'value', '472')}</h4>
            </div>
          )}

          {/* Order Details Meta */}
          {getSectionVal('orderDetails', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('orderDetails', 'fontSize', 10)}px` }}
              className="grid grid-cols-2 gap-2 text-[10px] border-b border-dashed border-slate-200 pb-2"
            >
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
          {getSectionVal('clientInfo', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('clientInfo', 'fontSize', 10)}px` }}
              className="space-y-0.5 text-[10px] border-b border-dashed border-slate-200 pb-2"
            >
              <span className="block font-bold text-slate-500 uppercase">Client Info</span>
              <p className="font-extrabold text-slate-800">Emma Watson</p>
              <p className="text-slate-600">+1 (555) 019-8765</p>
              <p className="text-slate-600">customer@example.com</p>
            </div>
          )}

          {/* Client Comment */}
          {getSectionVal('clientComment', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('clientComment', 'fontSize', 10)}px` }}
              className="bg-yellow-50 border border-yellow-200 p-2 rounded text-[10px] font-medium text-yellow-800"
            >
              💡 <span className="font-bold">Client comment:</span> "Please call 123 at the intercom system. No mushrooms, please!"
            </div>
          )}

          {/* Order Items Listing */}
          {getSectionVal('items', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('items', 'fontSize', 12)}px` }}
              className="space-y-2 border-b border-dashed border-slate-200 pb-3"
            >
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
          {getSectionVal('infoBox1', 'visible', false) && (
            <div
              style={{ fontSize: `${getSectionVal('infoBox1', 'fontSize', 10)}px` }}
              className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold"
            >
              ℹ️ Custom Information Box 1 Details
            </div>
          )}
          {getSectionVal('infoBox2', 'visible', false) && (
            <div
              style={{ fontSize: `${getSectionVal('infoBox2', 'fontSize', 10)}px` }}
              className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold"
            >
              ℹ️ Custom Information Box 2 Details
            </div>
          )}
          {getSectionVal('infoBox3', 'visible', false) && (
            <div
              style={{ fontSize: `${getSectionVal('infoBox3', 'fontSize', 10)}px` }}
              className="border border-slate-300 p-2 rounded text-[10px] text-center font-bold"
            >
              ℹ️ Custom Information Box 3 Details
            </div>
          )}

          {/* Client Confirmation Signature */}
          {getSectionVal('clientConfirmation', 'visible', false) && (
            <div
              style={{ fontSize: `${getSectionVal('clientConfirmation', 'fontSize', 10)}px` }}
              className="pt-6 border-t border-dashed border-slate-200 text-center space-y-8"
            >
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
          {getSectionVal('isPaid', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('isPaid', 'fontSize', 10)}px` }}
              className="flex items-center justify-center gap-6 border border-slate-300 p-2 rounded-lg text-[10px] font-bold"
            >
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
          {getSectionVal('orderOnline', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('orderOnline', 'fontSize', 10)}px` }}
              className="bg-slate-900 text-white text-center p-2 rounded text-[10px] font-bold"
            >
              Order Online: paprikalongbridge.co.uk
            </div>
          )}

          {/* Store contact details */}
          {getSectionVal('contactDetails', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('contactDetails', 'fontSize', 9)}px` }}
              className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2"
            >
              <p>Email: info@bellavistapizzeria.com</p>
              <p>Phone: +1 (555) 345-6789</p>
            </div>
          )}
        </div>
      );
    } else {
      // KITCHEN TICKET MOCKUP - Redesigned to be strictly black & white
      const headerVisible = getSectionVal('header', 'visible', true);
      const headerFs = `${getSectionVal('header', 'fontSize', 12)}px`;

      const onPremiseNumberVisible = getSectionVal('onPremiseNumber', 'visible', true);
      const onPremiseNumberFs = `${getSectionVal('onPremiseNumber', 'fontSize', 24)}px`;
      const onPremiseNumberVal = getSectionVal('onPremiseNumber', 'value', '1');

      const orderDetailsVisible = getSectionVal('orderDetails', 'visible', true);
      const orderDetailsFs = `${getSectionVal('orderDetails', 'fontSize', 10)}px`;

      const clientCommentVisible = getSectionVal('clientComment', 'visible', true);
      const clientCommentFs = `${getSectionVal('clientComment', 'fontSize', 10)}px`;

      const itemsVisible = getSectionVal('items', 'visible', true);
      const itemsFs = `${getSectionVal('items', 'fontSize', 12)}px`;

      const isPaidVisible = getSectionVal('isPaid', 'visible', true);
      const isPaidFs = `${getSectionVal('isPaid', 'fontSize', 12)}px`;

      const packagingStationVisible = getSectionVal('packagingStationQualityControl', 'visible', false);
      const packagingStationFs = `${getSectionVal('packagingStationQualityControl', 'fontSize', 9)}px`;

      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-black p-6 shadow-2xl rounded-sm border-t-8 border-black font-sans max-w-[360px] mx-auto space-y-4 text-left transition-all"
        >
          {/* Header Banner - Black Blocks with White Text */}
          {headerVisible && (
            <div style={{ fontSize: headerFs }} className="space-y-1">
              <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase text-left">
                Delivery
              </div>
              <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase flex justify-between">
                <span>ASAP</span>
                <span>60 min</span>
              </div>
              <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase text-left">
                25 August at 02:43
              </div>
            </div>
          )}

          {/* Ticket holder space option */}
          {config.ticketHolderSpace && (
            <div className="border border-dashed border-black py-4 text-center text-[9px] font-bold text-slate-500 rounded">
              [TICKET HOLDER CLAMPING MARGIN]
            </div>
          )}

          {/* On premise order number */}
          {onPremiseNumberVisible && (
            <div style={{ fontSize: onPremiseNumberFs }} className="flex justify-between items-center border-b border-black pb-2">
              <span className="font-bold uppercase text-xs">Order Number</span>
              <span className="font-black">#{onPremiseNumberVal}</span>
            </div>
          )}

          {/* Order Details Meta */}
          {orderDetailsVisible && (
            <div style={{ fontSize: orderDetailsFs }} className="space-y-1 border-b border-black pb-2 text-black">
              <p className="font-bold text-xs">Order details:</p>
              <div className="flex justify-between">
                <span>Number:</span>
                <span className="font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Accepted at:</span>
                <span className="font-bold">25 August at 01:43</span>
              </div>
              <div className="flex justify-between">
                <span>First name:</span>
                <span className="font-bold">Abdul</span>
              </div>
              <div className="flex justify-between">
                <span>Last name:</span>
                <span className="font-bold">Noman</span>
              </div>
            </div>
          )}

          {/* Client Comment / Note - Positioned right above items list */}
          {clientCommentVisible && (
            <div style={{ fontSize: clientCommentFs }} className="flex items-start gap-1.5 text-black font-semibold pt-1">
              <span>💬</span>
              <span>Please call 123 at the intercom system.</span>
            </div>
          )}

          {/* Order Items Listing with Checkboxes */}
          {itemsVisible && (
            <div style={{ fontSize: itemsFs }} className="space-y-3 border-t border-b border-black py-3">
              <p className="font-bold text-xs">Items</p>
              
              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1 space-y-0.5">
                  <p className="font-black text-black">
                    <span className="font-black mr-1">2x</span> Pizza Prosciutto
                  </p>
                  <p className="text-[10px] text-slate-650 pl-4">Size: Small</p>
                  <p className="text-[10px] text-slate-650 pl-4">Crust: Fluffy</p>
                  <p className="text-[10px] text-slate-650 pl-4">Toppings: Extra mozzarella</p>
                  <p className="text-[10px] text-black font-bold pl-4 flex items-center gap-1">
                    <span>💬</span> No mushrooms, please!
                  </p>
                </div>
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
              </div>

              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1 space-y-0.5">
                  <p className="font-black text-black">
                    <span className="font-black mr-1">1x</span> Pizza Prosciutto
                  </p>
                  <p className="text-[10px] text-slate-650 pl-4">Size: Medium</p>
                  <p className="text-[10px] text-slate-650 pl-4">Crust: Fluffy</p>
                  <p className="text-[10px] text-black font-bold pl-4 flex items-center gap-1">
                    <span>💬</span> No mushrooms, please!
                  </p>
                </div>
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
              </div>

              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1 space-y-0.5">
                  <p className="font-black text-black">
                    <span className="font-black mr-1">1x</span> Pizza Pepperoni
                  </p>
                  <p className="text-[10px] text-slate-650 pl-4">Size: Medium</p>
                  <p className="text-[10px] text-slate-650 pl-4">Crust: Crispy</p>
                </div>
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
              </div>
            </div>
          )}

          {/* Is Paid Indicator - Black Border Box */}
          {isPaidVisible && (
            <div style={{ fontSize: isPaidFs }} className="border border-black p-3 flex justify-center gap-8 font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="w-4 h-4 border border-black flex items-center justify-center text-[10px]"></span>
                <span>Paid</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="w-4 h-4 border border-black flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Not Paid</span>
              </label>
            </div>
          )}

          {/* Packaging station quality control box */}
          {packagingStationVisible && (
            <div style={{ fontSize: packagingStationFs }} className="border border-black p-2 text-center space-y-1.5">
              <span className="block font-bold text-[8.5px] uppercase tracking-wider">Packaging Station Check</span>
              <div className="flex justify-around text-[9px] font-bold">
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
