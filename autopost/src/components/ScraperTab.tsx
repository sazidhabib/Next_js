'use client';

import React, { useState } from 'react';
import { Play, ArrowUp, ArrowDown, Trash2, Plus, Globe, Sparkles, Sliders, Check, RefreshCw } from 'lucide-react';
import { PriorityCategory, ScraperConfig } from '@/lib/types';

interface ScraperTabProps {
  config: ScraperConfig;
  isScrapingActive: boolean;
  onStartScraping: (config: ScraperConfig) => Promise<void>;
  onSaveConfig: (config: ScraperConfig) => Promise<void>;
}

export function ScraperTab({ config, isScrapingActive, onStartScraping, onSaveConfig }: ScraperTabProps) {
  const [targetUrl, setTargetUrl] = useState(config.targetUrl);
  const [categories, setCategories] = useState<PriorityCategory[]>(config.priorityCategories || []);
  const [maxProducts, setMaxProducts] = useState(config.maxProductsPerCategory || 5);
  const [downloadImages, setDownloadImages] = useState(config.downloadImages ?? true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatUrl, setNewCatUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Move Category Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...categories];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    // re-assign priority numbers 1..N
    updated.forEach((c, i) => (c.priority = i + 1));
    setCategories(updated);
  };

  // Move Category Down
  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const updated = [...categories];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updated.forEach((c, i) => (c.priority = i + 1));
    setCategories(updated);
  };

  // Remove Category
  const removeCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    updated.forEach((c, i) => (c.priority = i + 1));
    setCategories(updated);
  };

  // Add Category
  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCategory: PriorityCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      url: newCatUrl.trim() || undefined,
      priority: categories.length + 1,
    };
    setCategories([...categories, newCategory]);
    setNewCatName('');
    setNewCatUrl('');
  };

  // Preset templates
  const applyPreset = (presetName: string) => {
    if (presetName === 'electronics') {
      setTargetUrl('https://dummyjson.com');
      setCategories([
        { id: 'cat-1', name: 'smartphones', priority: 1 },
        { id: 'cat-2', name: 'laptops', priority: 2 },
        { id: 'cat-3', name: 'tablets', priority: 3 },
      ]);
    } else if (presetName === 'lifestyle') {
      setTargetUrl('https://dummyjson.com');
      setCategories([
        { id: 'cat-1', name: 'fragrances', priority: 1 },
        { id: 'cat-2', name: 'skincare', priority: 2 },
        { id: 'cat-3', name: 'sunglasses', priority: 3 },
      ]);
    }
  };

  const handleSave = async () => {
    const updated: ScraperConfig = {
      targetUrl,
      priorityCategories: categories,
      maxProductsPerCategory: maxProducts,
      downloadImages,
    };
    await onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleStart = async () => {
    const current: ScraperConfig = {
      targetUrl,
      priorityCategories: categories,
      maxProductsPerCategory: maxProducts,
      downloadImages,
    };
    await onStartScraping(current);
  };

  return (
    <div className="space-y-6">
      {/* Target Website Settings */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" /> Target Website Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure the e-commerce store domain and crawler options.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Presets:</span>
            <button
              onClick={() => applyPreset('electronics')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              Tech / Gadgets
            </button>
            <button
              onClick={() => applyPreset('lifestyle')}
              type="button"
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              Lifestyle / Beauty
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Target Store URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example-store.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              The agent will navigate this domain, discover category listings, and parse product data.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Max Items per Category
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxProducts}
              onChange={(e) => setMaxProducts(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Controls depth of products extracted per priority category.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="downloadImages"
            checked={downloadImages}
            onChange={(e) => setDownloadImages(e.target.checked)}
            className="w-4 h-4 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
          />
          <label htmlFor="downloadImages" className="text-xs text-slate-300 cursor-pointer">
            Download & cache original high-res product media locally (Required for automatic Playwright image upload into Admin forms)
          </label>
        </div>
      </div>

      {/* Category Prioritization Manager */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Category Prioritization Queue
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Instruct the agent which category of products to scrape and add <strong>first</strong>. Items are processed from Priority #1 downwards.
            </p>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-2">
          {categories.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              No priority categories defined. Add one below to instruct the agent.
            </div>
          ) : (
            categories.map((cat, index) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-xs">
                    #{cat.priority}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white capitalize">{cat.name}</h4>
                    {cat.url ? (
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">{cat.url}</p>
                    ) : (
                      <p className="text-[11px] text-slate-500">Auto-navigated category</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Increase Priority (Scrape Sooner)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === categories.length - 1}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Decrease Priority (Scrape Later)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeCategory(cat.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="Remove Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Category Form */}
        <form onSubmit={addCategory} className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Laptops, Smartphones, Monitors..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="url"
              value={newCatUrl}
              onChange={(e) => setNewCatUrl(e.target.value)}
              placeholder="Optional direct category URL (e.g. https://site.com/laptops)"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Priority
            </button>
          </div>
        </form>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            {savedSuccess ? 'Configuration Saved' : 'Save Configuration'}
          </button>
        </div>

        <button
          onClick={handleStart}
          disabled={isScrapingActive || categories.length === 0}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isScrapingActive ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scraper In Progress...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Target Scraper Agent</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
