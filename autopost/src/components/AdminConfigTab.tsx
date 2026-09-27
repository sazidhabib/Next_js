'use client';

import React, { useState } from 'react';
import {
  AdminConfig,
} from '@/lib/types';
import {
  Shield,
  Eye,
  EyeOff,
  Sliders,
  Check,
  Code,
  ExternalLink,
  Sparkles,
  Lock,
  Monitor,
} from 'lucide-react';

interface AdminConfigTabProps {
  config: AdminConfig;
  onSaveConfig: (config: AdminConfig) => Promise<void>;
}

export function AdminConfigTab({ config, onSaveConfig }: AdminConfigTabProps) {
  const [formData, setFormData] = useState<AdminConfig>(config);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvancedSelectors, setShowAdvancedSelectors] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof AdminConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectorChange = (selField: keyof AdminConfig['selectors'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      selectors: {
        ...prev.selectors,
        [selField]: value,
      },
    }));
  };

  const handleApplyMockPreset = () => {
    setFormData((prev) => ({
      ...prev,
      adminLoginUrl: 'http://localhost:3002/mock-admin/login',
      adminUsername: 'admin@mystore.com',
      adminPassword: 'Password123!',
      newProductUrl: 'http://localhost:3002/mock-admin/products/new',
      headless: false,
      slowMoMs: 500,
      selectors: {
        loginUserSelector: 'input[name="email"], #email',
        loginPasswordSelector: 'input[name="password"], #password',
        loginSubmitSelector: 'button[type="submit"], #login-btn',
        titleSelector: 'input[name="title"], #title',
        slugSelector: 'input[name="slug"], #slug',
        priceSelector: 'input[name="price"], #price',
        regularPriceSelector: 'input[name="regular_price"], #regular-price',
        categorySelector: 'select[name="category"], #category',
        subcategorySelector: 'select[name="subcategory"], #subcategory',
        subSubcategorySelector: 'select[name="sub_subcategory"], #sub-subcategory',
        brandSelector: 'input[name="brand"], #brand',
        modelSelector: 'input[name="model"], #model',
        warrantySelector: 'input[name="warranty"], #warranty',
        mainImageInputSelector: '#main-product-image, input[type="file"]',
        galleryImageInputSelector: '#gallery-images, input[multiple]',
        keyFeaturesSelector: '#key-features, input[name="key_features"]',
        addSectionBtnSelector: '#add-section-btn, button:has-text("+ Add Section")',
        sectionTitleInputSelector: '.section-title-input',
        addFieldBtnSelector: '.add-field-btn, button:has-text("+ Field")',
        specLabelInputSelector: '.spec-label-input',
        specValueInputSelector: '.spec-value-input',
        descriptionSelector: 'textarea[name="description"], #description',
        featuredCheckboxSelector: '#featured-checkbox, input[name="featured"]',
        inStockCheckboxSelector: '#in-stock-checkbox, input[name="in_stock"]',
        saveButtonSelector: '#save-product-btn, button:has-text("Save Product")',
        successIndicatorSelector: '#product-created-alert',
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Overview & Preset Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Admin Panel Credentials & Bot Automation Settings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure how the Playwright bot navigates, authenticates, and fills products into your admin panel.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApplyMockPreset}
            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-xl border border-indigo-500/30 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Apply Built-in Mock Admin Preset
          </button>
        </div>

        {/* URLs & Auth Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Login URL *
            </label>
            <input
              type="text"
              value={formData.adminLoginUrl}
              onChange={(e) => handleChange('adminLoginUrl', e.target.value)}
              placeholder="e.g. https://yourstore.com/admin/login"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              New Product Form URL *
            </label>
            <input
              type="text"
              value={formData.newProductUrl}
              onChange={(e) => handleChange('newProductUrl', e.target.value)}
              placeholder="e.g. https://yourstore.com/admin/products/new"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Username / Email *
            </label>
            <input
              type="text"
              value={formData.adminUsername}
              onChange={(e) => handleChange('adminUsername', e.target.value)}
              placeholder="admin@yourstore.com"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Admin Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bot Execution Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/80 mt-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-xs font-semibold text-white">Browser Visibility Mode</h4>
                <p className="text-[11px] text-slate-400">
                  {formData.headless
                    ? 'Headless (Silent background execution)'
                    : 'Visible Browser (Watch bot type and upload in real-time)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('headless', !formData.headless)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                !formData.headless
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {!formData.headless ? 'Visible Mode' : 'Silent / Headless'}
            </button>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Bot Typing & Action Speed</h4>
              <p className="text-[11px] text-slate-400">Delay between keystrokes / form clicks: {formData.slowMoMs}ms</p>
            </div>
            <input
              type="range"
              min={100}
              max={1500}
              step={100}
              value={formData.slowMoMs}
              onChange={(e) => handleChange('slowMoMs', Number(e.target.value))}
              className="w-32 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Advanced Selectors Accordion */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Admin Form Selector Mapping</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedSelectors(!showAdvancedSelectors)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {showAdvancedSelectors ? 'Hide Custom Selectors' : 'Show / Edit Custom Selectors'}
          </button>
        </div>

        {showAdvancedSelectors && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
            {Object.entries(formData.selectors).map(([key, val]) => (
              <div key={key}>
                <label className="block text-[11px] font-sans font-medium text-slate-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  value={val || ''}
                  onChange={(e) =>
                    handleSelectorChange(key as keyof AdminConfig['selectors'], e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{savedSuccess ? 'Settings Saved Successfully' : 'Save Admin Configuration'}</span>
        </button>
      </div>
    </form>
  );
}
