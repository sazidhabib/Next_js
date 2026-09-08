'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  Layout,
  Utensils,
  Receipt,
  CheckCircle2,
  Type,
} from 'lucide-react';

export default function InvoiceTemplatesPage() {
  const { selectedRestaurant } = useAdmin();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplateType, setNewTemplateType] = useState('CUSTOMER');
  const [newTemplateLayout, setNewTemplateLayout] = useState('anupam_classic');
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
        setEditingTemplate((prev) => ({
          ...prev,
          ...json.data,
          config: typeof json.data.config === 'string' ? JSON.parse(json.data.config) : json.data.config,
        }));
        toast.success('Template saved successfully!');
      } else {
        toast.error(json.error || 'Failed to save template');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Network error while saving template');
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
      let defaultConfig = {};

      if (newTemplateType === 'CUSTOMER') {
        if (newTemplateLayout === 'anupam_classic') {
          defaultConfig = {
            layoutStyle: 'anupam_classic',
            restaurantBrand: 'anupam',
            brandFontSize: 24,
            legalName: 'Sweet Paan Ltd',
            address: '85 Church Street\nGreat Malvern WR14 2AE',
            phone: '01684 573814',
            vatNumber: '240 6873 06',
            businessInfoFontSize: 11,
            tableNumber: '24/2',
            tableFontSize: 16,
            dateFontSize: 11,
            dateTime: true,
            items: true,
            itemsFontSize: 12,
            miscAmount: '0.00',
            subTotal: true,
            total: true,
            totalsFontSize: 12,
            splitBill: true,
            splitWays: 2,
            splitBillFontSize: 12,
            serviceChargeNote: true,
            serviceChargeText: 'Service Charge Not Included',
            serviceChargeFontSize: 12,
            thankYouNote: true,
            thankYouText: 'Thank You For Your Custom\nPlease Call Again',
            thankYouFontSize: 11,
            website: 'www.anupam.co.uk',
            websiteFontSize: 13,
          };
        } else {
          defaultConfig = {
            layoutStyle: 'standard',
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
            infoBox1: true,
            infoBox2: false,
            infoBox3: false,
            clientConfirmation: false,
          };
        }
      } else {
        // KITCHEN
        if (newTemplateLayout === 'anupam_course_grouped') {
          defaultConfig = {
            layoutStyle: 'anupam_course_grouped',
            headerTitle: 'Kitchen Copy',
            headerFontSize: 13,
            ticketNumber: '73',
            ticketNumberFontSize: 30,
            groupByCategory: true,
            categoryFontSize: 14,
            subCategoryTitle: 'Bread',
            subCategoryFontSize: 13,
            items: true,
            itemsFontSize: 12,
            specialSection: '** Tandoori Items **',
            specialSectionFontSize: 13,
            tableNumber: '24/2',
            tableFooterFontSize: 24,
            dateFooterFontSize: 11,
            dateTime: true,
          };
        } else {
          defaultConfig = {
            layoutStyle: 'standard',
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
        }
      }

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
          config: typeof json.data.config === 'string' ? JSON.parse(json.data.config) : json.data.config,
        });
        toast.success('Template created successfully!');
      } else {
        toast.error(json.error || 'Failed to create template');
      }
    } catch (err) {
      console.error('Error creating template:', err);
      toast.error('Network error while creating template');
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
          config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => [json.data, ...prev]);
        toast.success('Template duplicated successfully!');
      } else {
        toast.error(json.error || 'Failed to duplicate template');
      }
    } catch (err) {
      console.error('Error duplicating template:', err);
      toast.error('Error duplicating template');
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
        toast.success('Template deleted successfully!');
      } else {
        toast.error(json.error || 'Failed to delete template');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Error deleting template');
    }
  };

  // Reset to default settings
  const handleResetToDefault = () => {
    if (!editingTemplate) return;
    const layout = editingTemplate.config?.layoutStyle || 'standard';

    let defaultConfig = {};
    if (editingTemplate.type === 'CUSTOMER') {
      if (layout === 'anupam_classic') {
        defaultConfig = {
          layoutStyle: 'anupam_classic',
          restaurantBrand: 'anupam',
          brandFontSize: 24,
          legalName: 'Sweet Paan Ltd',
          address: '85 Church Street\nGreat Malvern WR14 2AE',
          phone: '01684 573814',
          vatNumber: '240 6873 06',
          businessInfoFontSize: 11,
          tableNumber: '24/2',
          tableFontSize: 16,
          dateFontSize: 11,
          dateTime: true,
          items: true,
          itemsFontSize: 12,
          miscAmount: '0.00',
          subTotal: true,
          total: true,
          totalsFontSize: 12,
          splitBill: true,
          splitWays: 2,
          splitBillFontSize: 12,
          serviceChargeNote: true,
          serviceChargeText: 'Service Charge Not Included',
          serviceChargeFontSize: 12,
          thankYouNote: true,
          thankYouText: 'Thank You For Your Custom\nPlease Call Again',
          thankYouFontSize: 11,
          website: 'www.anupam.co.uk',
          websiteFontSize: 13,
        };
      } else {
        defaultConfig = {
          layoutStyle: 'standard',
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
          infoBox1: true,
          infoBox2: false,
          infoBox3: false,
          clientConfirmation: false,
        };
      }
    } else {
      if (layout === 'anupam_course_grouped') {
        defaultConfig = {
          layoutStyle: 'anupam_course_grouped',
          headerTitle: 'Kitchen Copy',
          headerFontSize: 13,
          ticketNumber: '73',
          ticketNumberFontSize: 30,
          groupByCategory: true,
          categoryFontSize: 14,
          subCategoryTitle: 'Bread',
          subCategoryFontSize: 13,
          items: true,
          itemsFontSize: 12,
          specialSection: '** Tandoori Items **',
          specialSectionFontSize: 13,
          tableNumber: '24/2',
          tableFooterFontSize: 24,
          dateFooterFontSize: 11,
          dateTime: true,
        };
      } else {
        defaultConfig = {
          layoutStyle: 'standard',
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
      }
    }

    setEditingTemplate((prev) => ({
      ...prev,
      fontSize: 12,
      config: defaultConfig,
    }));
    toast.info('Template reset to default settings');
  };

  const getSectionVal = (key, field, defaultValue) => {
    const item = editingTemplate?.config?.[key];
    if (item === undefined) return defaultValue;
    if (typeof item === 'boolean') {
      if (field === 'visible') return item;
      return defaultValue;
    }
    if (typeof item === 'object' && item !== null) {
      if (item[field] !== undefined) return item[field];
      return defaultValue;
    }
    // String or number value directly stored
    if (field === 'value') return item;
    return defaultValue;
  };

  const updateConfigVal = (key, value) => {
    setEditingTemplate((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const updateSectionVal = (key, field, value) => {
    setEditingTemplate((prev) => {
      const current = prev.config?.[key];
      let updatedItem = {};
      if (typeof current === 'boolean') {
        updatedItem = {
          visible: current,
          fontSize: 12,
          value: key === 'onPremiseNumber' || key === 'tableNumber' ? '24/2' : '',
        };
      } else if (typeof current === 'object' && current !== null) {
        updatedItem = { ...current };
      } else {
        updatedItem = {
          visible: true,
          fontSize: 12,
          value: current || '',
        };
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

  // Helper to get layout style
  const getLayoutStyle = (template) => {
    if (!template) return 'standard';
    try {
      const cfg = typeof template.config === 'string' ? JSON.parse(template.config) : template.config;
      return cfg?.layoutStyle || 'standard';
    } catch {
      return 'standard';
    }
  };

  // Helper renderer for section font-size control row
  const renderFontSizeRow = (label, configKey, defaultValue = 12, min = 8, max = 40) => {
    const config = editingTemplate?.config || {};
    const currentVal = config[configKey] !== undefined ? config[configKey] : defaultValue;

    return (
      <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-800/40">
        <span className="text-slate-400 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateConfigVal(configKey, Math.max(min, Number(currentVal) - 1))}
            className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition-colors flex items-center justify-center text-xs"
          >
            -
          </button>
          <span className="font-mono font-bold text-orange-400 w-10 text-center">{currentVal}px</span>
          <button
            type="button"
            onClick={() => updateConfigVal(configKey, Math.min(max, Number(currentVal) + 1))}
            className="w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer transition-colors flex items-center justify-center text-xs"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // Render component settings toggles list
  const renderToggles = () => {
    if (!editingTemplate) return null;
    const config = editingTemplate.config || {};
    const layout = config.layoutStyle || 'standard';

    // -------------------------------------------------------------
    // 1. ANUPAM CLASSIC CLIENT BILL CONTROLS (With Section Font Sizes)
    // -------------------------------------------------------------
    if (editingTemplate.type === 'CUSTOMER' && layout === 'anupam_classic') {
      return (
        <div className="space-y-4">
          {/* Section 1: Branding & Header */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Restaurant Brand & Business Details</span>
            </h4>
            
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Header Brand Title (Lowercase/Clean)</label>
                <input
                  type="text"
                  value={config.restaurantBrand || 'anupam'}
                  onChange={(e) => updateConfigVal('restaurantBrand', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Brand Title Font Size', 'brandFontSize', 24, 14, 40)}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Legal / Company Name</label>
                <input
                  type="text"
                  value={config.legalName || 'Sweet Paan Ltd'}
                  onChange={(e) => updateConfigVal('legalName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Store Address</label>
                <textarea
                  rows={2}
                  value={config.address || '85 Church Street\nGreat Malvern WR14 2AE'}
                  onChange={(e) => updateConfigVal('address', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">Telephone Number</label>
                  <input
                    type="text"
                    value={config.phone || '01684 573814'}
                    onChange={(e) => updateConfigVal('phone', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">VAT Reg Number</label>
                  <input
                    type="text"
                    value={config.vatNumber || '240 6873 06'}
                    onChange={(e) => updateConfigVal('vatNumber', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {renderFontSizeRow('Business Info (Address, VAT, Tel) Font Size', 'businessInfoFontSize', 11, 8, 18)}
            </div>
          </div>

          {/* Section 2: Table & Date/Time */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Table & Timestamp Section
            </h4>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Table Number Identifier</label>
                <input
                  type="text"
                  value={config.tableNumber || '24/2'}
                  onChange={(e) => updateConfigVal('tableNumber', e.target.value)}
                  placeholder="e.g. 24/2"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Table Header Font Size', 'tableFontSize', 16, 10, 28)}
              {renderFontSizeRow('Date & Time Font Size', 'dateFontSize', 11, 8, 18)}
            </div>
          </div>

          {/* Section 3: Itemized List */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Itemized Listing & Prices
            </h4>
            <div className="pt-1">
              {renderFontSizeRow('Items & Price Text Size', 'itemsFontSize', 12, 9, 22)}
            </div>
          </div>

          {/* Section 4: Totals & Financials */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Totals & Financial Summary
            </h4>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Misc Line Surcharge / Discount</label>
                <input
                  type="text"
                  value={config.miscAmount || '0.00'}
                  onChange={(e) => updateConfigVal('miscAmount', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {renderFontSizeRow('Sub Total & Total Font Size', 'totalsFontSize', 12, 9, 22)}
            </div>
          </div>

          {/* Section 5: Split Bill */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Split Bill Breakdown
            </h4>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-300 font-medium">Enable Split Bill Calculator</span>
                <button
                  onClick={() => updateConfigVal('splitBill', !config.splitBill)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    config.splitBill !== false ? 'bg-orange-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform duration-200 ${
                      config.splitBill !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {config.splitBill !== false && (
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[11px] text-slate-400 font-bold">Split Ways Count:</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={config.splitWays || 2}
                    onChange={(e) => updateConfigVal('splitWays', parseInt(e.target.value) || 2)}
                    className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500 font-bold text-center"
                  />
                </div>
              )}

              {renderFontSizeRow('Split Bill Text Size', 'splitBillFontSize', 12, 8, 20)}
            </div>
          </div>

          {/* Section 6: Service Charge & Footer Message */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Service Charge & Closing Footer
            </h4>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-300 font-medium">Service Charge Notice Banner</span>
                <button
                  onClick={() => updateConfigVal('serviceChargeNote', !config.serviceChargeNote)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    config.serviceChargeNote !== false ? 'bg-orange-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform duration-200 ${
                      config.serviceChargeNote !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Service Charge Text</label>
                <input
                  type="text"
                  value={config.serviceChargeText || 'Service Charge Not Included'}
                  onChange={(e) => updateConfigVal('serviceChargeText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Service Charge Font Size', 'serviceChargeFontSize', 12, 8, 22)}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Thank You Closing Message</label>
                <textarea
                  rows={2}
                  value={config.thankYouText || 'Thank You For Your Custom\nPlease Call Again'}
                  onChange={(e) => updateConfigVal('thankYouText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Thank You Notes Font Size', 'thankYouFontSize', 11, 8, 18)}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Website URL Footer</label>
                <input
                  type="text"
                  value={config.website || 'www.anupam.co.uk'}
                  onChange={(e) => updateConfigVal('website', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Website URL Font Size', 'websiteFontSize', 13, 9, 24)}
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 2. ANUPAM COURSE GROUPED KITCHEN TICKET CONTROLS (With Category Font Sizes)
    // -------------------------------------------------------------
    if (editingTemplate.type === 'KITCHEN' && layout === 'anupam_course_grouped') {
      return (
        <div className="space-y-4">
          {/* Header & Ticket Callout */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Ticket Header & Order Number</span>
            </h4>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Header Title Text</label>
                <input
                  type="text"
                  value={config.headerTitle || 'Kitchen Copy'}
                  onChange={(e) => updateConfigVal('headerTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {renderFontSizeRow('Header Title Font Size', 'headerFontSize', 13, 9, 24)}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Ticket / Order Number Callout</label>
                <input
                  type="text"
                  value={config.ticketNumber || '73'}
                  onChange={(e) => updateConfigVal('ticketNumber', e.target.value)}
                  placeholder="e.g. 73"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {renderFontSizeRow('Ticket Number ( 73 ) Font Size', 'ticketNumberFontSize', 30, 16, 50)}
            </div>
          </div>

          {/* Categories & Sub-Categories */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Category & Sub-Category Typography</span>
            </h4>

            <div className="space-y-3 pt-1">
              <p className="text-[11px] text-slate-400">
                Adjust font sizes for main course headers (Starter, Main Dishes, Side Dishes, Rice) and sub-categories.
              </p>

              {renderFontSizeRow('Main Category Headers Font Size (Starter, Main, Side...)', 'categoryFontSize', 14, 9, 28)}
              {renderFontSizeRow('Order Item Listing Text Size', 'itemsFontSize', 12, 9, 24)}

              <div className="pt-2 border-t border-slate-800">
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Special / Tandoori Section Header</label>
                <input
                  type="text"
                  value={config.specialSection || '** Tandoori Items **'}
                  onChange={(e) => updateConfigVal('specialSection', e.target.value)}
                  placeholder="e.g. ** Tandoori Items **"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Special Section Header (** Tandoori Items **) Size', 'specialSectionFontSize', 13, 9, 26)}

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Sub-Category Title</label>
                <input
                  type="text"
                  value={config.subCategoryTitle || 'Bread'}
                  onChange={(e) => updateConfigVal('subCategoryTitle', e.target.value)}
                  placeholder="e.g. Bread"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {renderFontSizeRow('Sub-Category Title (Bread) Font Size', 'subCategoryFontSize', 13, 9, 26)}
            </div>
          </div>

          {/* Table & Timestamp Footer */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Bottom Table Identifier & Timestamp
            </h4>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Bottom Table Number Identifier</label>
                <input
                  type="text"
                  value={config.tableNumber || '24/2'}
                  onChange={(e) => updateConfigVal('tableNumber', e.target.value)}
                  placeholder="e.g. 24/2"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {renderFontSizeRow('Bottom Table Identifier (Table: 24/2) Font Size', 'tableFooterFontSize', 24, 12, 40)}
              {renderFontSizeRow('Bottom Timestamp (Date/Time) Font Size', 'dateFooterFontSize', 11, 8, 20)}
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // 3. STANDARD TEMPLATES CONTROLS
    // -------------------------------------------------------------
    const labels =
      editingTemplate.type === 'CUSTOMER'
        ? [
            { key: 'paymentMethod', label: 'Payment method' },
            { key: 'time', label: 'Time' },
            { key: 'estimatedDriveTime', label: 'Estimated drive time (delivery only)' },
            { key: 'direction', label: 'Direction (delivery only)' },
            { key: 'onPremiseNumber', label: 'On premise number' },
            { key: 'orderDetails', label: 'Order details' },
            { key: 'clientInfo', label: 'Client info' },
            { key: 'clientComment', label: 'Client comment' },
            { key: 'items', label: 'Items' },
            { key: 'isPaid', label: 'Is Paid' },
            { key: 'orderOnline', label: 'Order online' },
            { key: 'contactDetails', label: 'Contact details' },
            { key: 'infoBox1', label: 'Your info box 1' },
            { key: 'infoBox2', label: 'Your info box 2' },
            { key: 'infoBox3', label: 'Your info box 3' },
            { key: 'clientConfirmation', label: 'Client confirmation' },
          ]
        : [
            { key: 'header', label: 'Top Header banner (ASAP/Delivery details)' },
            { key: 'ticketHolderSpace', label: 'Ticket holder clamping margin' },
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
    const config = editingTemplate.config || {};
    const layout = config.layoutStyle || 'standard';
    const fs = `${editingTemplate.fontSize || 12}px`;

    // -------------------------------------------------------------
    // TEMPLATE 1: ANUPAM CLASSIC CLIENT BILL (Matches Image 1)
    // -------------------------------------------------------------
    if (editingTemplate.type === 'CUSTOMER' && layout === 'anupam_classic') {
      const brand = config.restaurantBrand || 'anupam';
      const brandFs = `${config.brandFontSize || 24}px`;
      const legalName = config.legalName || 'Sweet Paan Ltd';
      const address = config.address || '85 Church Street\nGreat Malvern WR14 2AE';
      const phone = config.phone || '01684 573814';
      const vatNumber = config.vatNumber || '240 6873 06';
      const businessInfoFs = `${config.businessInfoFontSize || 11}px`;
      const tableNumber = config.tableNumber || '24/2';
      const tableFs = `${config.tableFontSize || 16}px`;
      const dateFs = `${config.dateFontSize || 11}px`;
      const itemsFs = `${config.itemsFontSize || 12}px`;
      const totalsFs = `${config.totalsFontSize || 12}px`;
      const splitWays = config.splitWays || 2;
      const splitEach = (77.2 / splitWays).toFixed(2);
      const splitBillFs = `${config.splitBillFontSize || 12}px`;
      const serviceChargeText = config.serviceChargeText || 'Service Charge Not Included';
      const serviceChargeFs = `${config.serviceChargeFontSize || 12}px`;
      const thankYouText = config.thankYouText || 'Thank You For Your Custom\nPlease Call Again';
      const thankYouFs = `${config.thankYouFontSize || 11}px`;
      const website = config.website || 'www.anupam.co.uk';
      const websiteFs = `${config.websiteFontSize || 13}px`;

      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-black px-6 py-6 shadow-2xl rounded-sm font-sans max-w-[320px] w-full mx-auto space-y-3 text-left relative transition-all border border-slate-200 font-mono tracking-tight"
        >
          {/* Header Brand */}
          <div className="text-center space-y-1">
            <h2 style={{ fontSize: brandFs }} className="font-light tracking-wide lowercase font-sans">{brand}</h2>
            <div style={{ fontSize: businessInfoFs }} className="text-black font-normal space-y-0.5 leading-snug pt-1">
              <p>{legalName}</p>
              {address.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
              <p className="pt-0.5">
                <span>TelNo:{phone}</span> <span className="ml-1">VATNo:{vatNumber}</span>
              </p>
            </div>
          </div>

          {/* Table & Date */}
          <div className="text-center pt-2">
            <h3 style={{ fontSize: tableFs }} className="font-black tracking-tight">Table:( {tableNumber})</h3>
            <p style={{ fontSize: dateFs }} className="text-black">04/09/2026, 05:02 PM</p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-black/70 my-1"></div>

          {/* Itemized List */}
          <div style={{ fontSize: itemsFs }} className="space-y-1 font-normal">
            <div className="flex justify-between items-baseline">
              <span>1 King Pr On Puree</span>
              <span>11.00</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Mali M Tikka</span>
              <span>9.00</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Chamak Chicken</span>
              <span>18.00</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Chicken Biryani</span>
              <span>16.50</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Asparagus</span>
              <span>7.00</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Bhindi Bhaji</span>
              <span>6.00</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Mush P Rice</span>
              <span>5.50</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span>1 Nan</span>
              <span>4.20</span>
            </div>
          </div>

          {/* Misc & Subtotal */}
          <div style={{ fontSize: totalsFs }} className="pt-2 space-y-1">
            <div className="flex justify-between items-baseline">
              <span>Misc:</span>
              <span>£{config.miscAmount || '0.00'}</span>
            </div>
            <div className="border-t border-dashed border-black/70 my-1"></div>
            <div className="flex justify-between items-baseline">
              <span>Sub Total:</span>
              <span>£77.20</span>
            </div>
            <div className="border-t border-dashed border-black/70 my-1"></div>
            <div className="flex justify-between items-baseline font-black pt-0.5" style={{ fontSize: `calc(${totalsFs} + 3px)` }}>
              <span>Total:</span>
              <span>£77.20</span>
            </div>
          </div>

          {/* Split Bill & Footer */}
          {config.splitBill !== false && (
            <div style={{ fontSize: splitBillFs }} className="flex justify-between pt-1">
              <span>Split Bill {splitWays} way</span>
              <span>each £{splitEach}</span>
            </div>
          )}

          {config.serviceChargeNote !== false && (
            <div className="text-center pt-2">
              <p style={{ fontSize: serviceChargeFs }} className="font-extrabold tracking-tight">{serviceChargeText}</p>
            </div>
          )}

          {config.thankYouNote !== false && (
            <div style={{ fontSize: thankYouFs }} className="text-center space-y-0.5 pt-1">
              {thankYouText.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}

          {website && (
            <div className="text-center pt-2 pb-1">
              <p style={{ fontSize: websiteFs }} className="font-sans font-light">{website}</p>
            </div>
          )}
        </div>
      );
    }

    // -------------------------------------------------------------
    // TEMPLATE 2: ANUPAM KITCHEN ORDER TICKET (Matches Image 2)
    // -------------------------------------------------------------
    if (editingTemplate.type === 'KITCHEN' && layout === 'anupam_course_grouped') {
      const headerTitle = config.headerTitle || 'Kitchen Copy';
      const headerFs = `${config.headerFontSize || 13}px`;
      const ticketNumber = config.ticketNumber || '73';
      const ticketNumberFs = `${config.ticketNumberFontSize || 30}px`;
      const categoryFs = `${config.categoryFontSize || 14}px`;
      const subCategoryTitle = config.subCategoryTitle || 'Bread';
      const subCategoryFs = `${config.subCategoryFontSize || 13}px`;
      const itemsFs = `${config.itemsFontSize || 12}px`;
      const specialSection = config.specialSection || '** Tandoori Items **';
      const specialSectionFs = `${config.specialSectionFontSize || 13}px`;
      const tableNumber = config.tableNumber || '24/2';
      const tableFooterFs = `${config.tableFooterFontSize || 24}px`;
      const dateFooterFs = `${config.dateFooterFontSize || 11}px`;

      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-black px-6 py-6 shadow-2xl rounded-sm font-sans max-w-[320px] w-full mx-auto space-y-4 text-left relative transition-all border border-slate-200 font-mono"
        >
          {/* Top Title */}
          <div className="text-center">
            <span style={{ fontSize: headerFs }} className="underline font-bold tracking-wide">{headerTitle}</span>
          </div>

          {/* Large Ticket Number */}
          <div className="text-center py-1">
            <h2 style={{ fontSize: ticketNumberFs }} className="font-black tracking-widest leading-none">( {ticketNumber} )</h2>
          </div>

          {/* Course Group: Starter(s) */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">Starter(s)</span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>King Pr On Puree</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Mali M Tikka</span>
              </div>
            </div>
          </div>

          {/* Course Group: Main Dishes */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">Main Dishes</span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Chamak Chicken</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Chicken Biryani</span>
              </div>
            </div>
          </div>

          {/* Course Group: Side Dishes */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">Side Dishes</span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Asparagus</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Bhindi Bhaji</span>
              </div>
            </div>
          </div>

          {/* Course Group: Rice/Bread */}
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">Rice/Bread</span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Mush P Rice</span>
              </div>
            </div>
          </div>

          {/* Special Section: Tandoori / Bread */}
          <div className="space-y-1 pt-1">
            <div className="text-center font-bold">
              <p style={{ fontSize: specialSectionFs }}>{specialSection}</p>
              <p style={{ fontSize: subCategoryFs }} className="underline mt-1">{subCategoryTitle}</p>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1 pt-1">
              <div className="flex gap-3">
                <span className="font-bold">1</span>
                <span>Nan</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-black/70 my-2"></div>

          {/* Table & Timestamp Footer */}
          <div className="text-center space-y-1">
            <h3 style={{ fontSize: tableFooterFs }} className="font-black tracking-tight leading-tight">Table:( {tableNumber} )</h3>
            <p style={{ fontSize: dateFooterFs }} className="italic font-sans text-black">04/09/2026. 05:00 PM</p>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // TEMPLATE 3: STANDARD CUSTOMER RECEIPT (Boxed European Style)
    // -------------------------------------------------------------
    if (editingTemplate.type === 'CUSTOMER') {
      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-slate-900 px-5 pb-6 pt-3 shadow-2xl rounded-b-sm font-sans max-w-[340px] mx-auto space-y-4 text-left relative transition-all"
        >
          {/* Serrated top edge */}
          <div
            className="absolute top-[-6px] left-0 w-full h-[6px] bg-repeat-x"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpolygon points='0,6 5,0 10,6' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '10px 6px',
            }}
          />

          {/* Payment Method Option */}
          {getSectionVal('paymentMethod', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('paymentMethod', 'fontSize', 11)}px` }}
              className="space-y-0"
            >
              <div className="bg-black text-white px-2 py-1 font-bold uppercase text-left tracking-wide">
                Cash
              </div>
              <div className="border border-black p-2 font-bold flex justify-between">
                <span>EXP 2020-12</span>
                <span>ending in 5452</span>
              </div>
            </div>
          )}

          {/* Time & Fulfillment */}
          {getSectionVal('time', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('time', 'fontSize', 11)}px` }}
              className="bg-black text-white px-2 py-1 font-bold text-[11px] uppercase flex justify-between items-center tracking-wide"
            >
              <span>ASAP</span>
              <span>60 min</span>
            </div>
          )}

          {/* Estimated drive time */}
          {getSectionVal('estimatedDriveTime', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('estimatedDriveTime', 'fontSize', 11)}px` }}
              className="space-y-0"
            >
              <div className="bg-black text-white px-2 py-1 font-bold uppercase flex justify-between items-center tracking-wide">
                <span>Estimated drive time</span>
                <span>~ 10min</span>
              </div>
              <div className="border border-black p-2 leading-tight text-slate-800">
                Traffic situation on 25 August at 02:41 was taken into consideration.
              </div>
            </div>
          )}

          {/* Direction & QR code */}
          {getSectionVal('direction', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('direction', 'fontSize', 11)}px` }}
              className="space-y-0"
            >
              <div className="bg-black text-white px-2 py-1 font-bold uppercase flex justify-between items-center tracking-wide">
                <span>Delivery</span>
                <span>North 1km</span>
              </div>
              <div className="border border-black p-3 space-y-3">
                <div className="font-bold leading-tight text-slate-800">
                  <p>14th Test Street, Longbridge</p>
                  <p>1st Floor, Apartment 5B</p>
                </div>
                <div className="flex justify-center pt-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      'https://www.google.com/maps/search/?api=1&query=' +
                        encodeURIComponent('14th Test Street, Longbridge, 1st Floor, Apartment 5B')
                    )}`}
                    alt="Google Maps Navigation QR Code"
                    className="w-16 h-16"
                  />
                </div>
              </div>
            </div>
          )}

          {/* On premise order number */}
          {getSectionVal('onPremiseNumber', 'visible', false) && (
            <div
              style={{ fontSize: `${getSectionVal('onPremiseNumber', 'fontSize', 20)}px` }}
              className="border-b border-dashed border-slate-300 pb-2 text-center"
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">On Premise Order Number</span>
              <h4 className="font-black">#{getSectionVal('onPremiseNumber', 'value', '472')}</h4>
            </div>
          )}

          {/* Order Details Meta */}
          {getSectionVal('orderDetails', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('orderDetails', 'fontSize', 10)}px` }}
              className="space-y-1 text-[10px]"
            >
              <h5 className="font-extrabold text-slate-900">Order details:</h5>
              <div className="flex justify-between">
                <span className="text-slate-500">Number:</span>
                <span className="font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Placed at:</span>
                <span className="font-bold">25 August at 01:40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accepted at:</span>
                <span className="font-bold">25 August at 01:41</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment at:</span>
                <span className="font-bold">25 August at 02:41</span>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2" />
            </div>
          )}

          {/* Client Info Details */}
          {getSectionVal('clientInfo', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('clientInfo', 'fontSize', 10)}px` }}
              className="space-y-1 text-[10px]"
            >
              <h5 className="font-extrabold text-slate-900">Client info:</h5>
              <div className="flex justify-between">
                <span className="text-slate-500">First name:</span>
                <span className="font-bold">Abdul</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last name:</span>
                <span className="font-bold">Noman</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold">admin@paprikalongbridge.co.uk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold">+44 121 453 1122</span>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2" />
            </div>
          )}

          {/* Client Comment */}
          {getSectionVal('clientComment', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('clientComment', 'fontSize', 10)}px` }}
              className="space-y-2 text-[10px] text-slate-900"
            >
              <div className="border-t border-black" />
              <p className="font-bold flex items-center gap-1.5 py-0.5">
                <span className="text-xs">💬</span> Please call 123 at the intercom system.
              </p>
              <div className="border-b border-black" />
            </div>
          )}

          {/* Order Items Listing */}
          {getSectionVal('items', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('items', 'fontSize', 12)}px` }}
              className="space-y-3"
            >
              <h5 className="font-extrabold text-slate-900 text-[10px]">Items:</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-bold">
                    <span>2x Pizza Prosciutto</span>
                    <span>11.60</span>
                  </div>
                  <div className="pl-3 text-[10px] text-slate-650 space-y-0.5 mt-0.5">
                    <p>Size: Small</p>
                    <p>Crust: Fluffy</p>
                    <p>Toppings: Extra mozzarella (+1.50)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="space-y-1.5 text-[11px] text-slate-800 border-t border-dashed border-slate-300 pt-3">
            <div className="flex justify-between font-bold">
              <span>Sub-total:</span>
              <span>£20.60</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-xs">
              <span>Total:</span>
              <span>£20.60</span>
            </div>
          </div>

          {/* Is Paid footer checkbox */}
          {getSectionVal('isPaid', 'visible', true) && (
            <div
              style={{ fontSize: `${getSectionVal('isPaid', 'fontSize', 10)}px` }}
              className="flex items-center justify-center gap-8 border border-black p-3 text-[10px] font-bold"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-black inline-block" />
                <span>Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center text-[9px] font-bold">✓</span>
                <span>Not Paid</span>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // -------------------------------------------------------------
      // TEMPLATE 4: STANDARD KITCHEN TICKET
      // -------------------------------------------------------------
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

      return (
        <div
          style={{ fontSize: fs }}
          className="bg-white text-black p-6 shadow-2xl rounded-sm border-t-8 border-black font-sans max-w-[360px] mx-auto space-y-4 text-left transition-all"
        >
          {headerVisible && (
            <div style={{ fontSize: headerFs }} className="space-y-1">
              <div className="bg-black text-white px-3 py-1 font-bold uppercase text-left">
                Delivery
              </div>
              <div className="bg-black text-white px-3 py-1 font-bold uppercase flex justify-between">
                <span>ASAP</span>
                <span>60 min</span>
              </div>
              <div className="bg-black text-white px-3 py-1 font-bold uppercase text-left">
                25 August at 02:43
              </div>
            </div>
          )}

          {onPremiseNumberVisible && (
            <div style={{ fontSize: onPremiseNumberFs }} className="flex justify-between items-center border-b border-black pb-2">
              <span className="font-bold uppercase text-xs">Order Number</span>
              <span className="font-black">#{onPremiseNumberVal}</span>
            </div>
          )}

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
                <span>Customer:</span>
                <span className="font-bold">Abdul Noman</span>
              </div>
            </div>
          )}

          {clientCommentVisible && (
            <div style={{ fontSize: clientCommentFs }} className="flex items-start gap-1.5 text-black font-semibold pt-1">
              <span>💬</span>
              <span>Please call 123 at the intercom system.</span>
            </div>
          )}

          {itemsVisible && (
            <div style={{ fontSize: itemsFs }} className="space-y-3 border-t border-b border-black py-3">
              <p className="font-bold text-xs">Items</p>
              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1 space-y-0.5">
                  <p className="font-black text-black">
                    <span className="font-black mr-1">2x</span> Pizza Prosciutto
                  </p>
                  <p className="text-[10px] text-slate-650 pl-4">Size: Small</p>
                </div>
                <div className="w-4 h-4 border border-black shrink-0 mt-0.5"></div>
              </div>
            </div>
          )}

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
    const layout = getLayoutStyle(editingTemplate);

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
                  {editingTemplate.type === 'CUSTOMER' ? 'Client receipt' : 'Kitchen ticket'}
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-black uppercase">
                  {layout === 'anupam_classic'
                    ? 'Anupam Classic Bill'
                    : layout === 'anupam_course_grouped'
                    ? 'Course-Grouped KOT'
                    : 'Standard Layout'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Customize active fields, section font-sizes, and print components for this template.
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
                  <span>Base Global Font Size</span>
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
              <h3 className="font-extrabold text-sm text-white border-b border-slate-800 pb-3">Section Typography & Content Customization</h3>
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
            Build, preview, and switch between custom printable templates for client bills and kitchen preparation slips.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTemplateType('CUSTOMER');
            setNewTemplateLayout('anupam_classic');
            setNewTemplateName('');
            setIsAddModalOpen(true);
          }}
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
                  <th className="p-4">Design Preset</th>
                  <th className="p-4">Base Font</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {templates.map((template) => {
                  const layout = getLayoutStyle(template);

                  return (
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
                      <td className="p-4">
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {layout === 'anupam_classic'
                            ? 'Anupam Classic Bill'
                            : layout === 'anupam_course_grouped'
                            ? 'Course-Grouped KOT'
                            : 'Standard Ticket'}
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
                              config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config,
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
                  );
                })}
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
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Template Type</label>
                <select
                  value={newTemplateType}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setNewTemplateType(nextType);
                    setNewTemplateLayout(nextType === 'CUSTOMER' ? 'anupam_classic' : 'anupam_course_grouped');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                >
                  <option value="CUSTOMER">Client receipt (Front of house)</option>
                  <option value="KITCHEN">Kitchen essentials (Prep station)</option>
                </select>
              </div>

              {/* Design Preset Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Design Layout Preset</label>
                <select
                  value={newTemplateLayout}
                  onChange={(e) => setNewTemplateLayout(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold text-orange-400"
                >
                  {newTemplateType === 'CUSTOMER' ? (
                    <>
                      <option value="anupam_classic">✨ Anupam Classic Client Bill (Table & VAT)</option>
                      <option value="standard">Standard Boxed Client Receipt</option>
                    </>
                  ) : (
                    <>
                      <option value="anupam_course_grouped">✨ Anupam Course-Grouped KOT (Starter/Main/Side/Rice)</option>
                      <option value="standard">Standard Kitchen Prep Ticket</option>
                    </>
                  )}
                </select>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Restaurant Client Bill, Chef Order Ticket"
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
