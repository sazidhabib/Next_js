'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { ScraperTab } from '@/components/ScraperTab';
import { StagingTab } from '@/components/StagingTab';
import { AdminConfigTab } from '@/components/AdminConfigTab';
import { LogsTab } from '@/components/LogsTab';
import { EditProductModal } from '@/components/EditProductModal';
import {
  AppStore,
  ProductItem,
  ScraperConfig,
  AdminConfig,
} from '@/lib/types';
import {
  Globe,
  Layers,
  Shield,
  Terminal,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [store, setStore] = useState<AppStore | null>(null);
  const [activeTab, setActiveTab] = useState<'scraper' | 'staging' | 'admin' | 'logs'>('staging');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complete application state
  const fetchStore = useCallback(async () => {
    try {
      const res = await fetch('/api/store');
      if (res.ok) {
        const data = await res.json();
        setStore(data);
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
    // Poll every 3 seconds to keep live status in sync
    const interval = setInterval(fetchStore, 3000);
    return () => clearInterval(interval);
  }, [fetchStore]);

  // Handler: Start Scraping
  const handleStartScraping = async (config: ScraperConfig) => {
    try {
      await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      await fetchStore();
      // Switch tab to staging or logs so user can see progress
      setActiveTab('staging');
    } catch (err) {
      console.error('Error initiating scraper:', err);
    }
  };

  // Handler: Save Scraper Config
  const handleSaveScraperConfig = async (config: ScraperConfig) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scraperConfig: config }),
      });
      await fetchStore();
    } catch (err) {
      console.error('Error saving scraper config:', err);
    }
  };

  // Handler: Save Admin Config
  const handleSaveAdminConfig = async (config: AdminConfig) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminConfig: config }),
      });
      await fetchStore();
    } catch (err) {
      console.error('Error saving admin config:', err);
    }
  };

  // Handler: Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      await fetchStore();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Handler: Save Edited Product
  const handleSaveProductEdit = async (id: string, updates: Partial<ProductItem>) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await fetchStore();
    } catch (err) {
      console.error('Error saving product edits:', err);
    }
  };

  // Handler: Batch Actions
  const handleBatchAction = async (action: string, productIds?: string[]) => {
    try {
      await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productIds }),
      });
      await fetchStore();
    } catch (err) {
      console.error('Error performing batch action:', err);
    }
  };

  // Handler: Sync Products to Admin via Playwright Bot
  const handleSyncProducts = async (productIds?: string[]) => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });
      await fetchStore();
      // Auto switch to logs or keep in staging
    } catch (err) {
      console.error('Error triggering admin sync:', err);
    }
  };

  // Handler: Clear Logs
  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      await fetchStore();
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  };

  if (isLoading || !store) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">Initializing AutoPost Agent Environment...</span>
      </div>
    );
  }

  const pendingCount = store.products.filter((p) => p.status === 'pending').length;
  const approvedCount = store.products.filter((p) => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        isScrapingActive={store.isScrapingActive}
        isSyncingActive={store.isSyncingActive}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6 flex-1">
        {/* KPI Summary Cards */}
        <StatsOverview products={store.products} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('staging')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'staging'
                ? 'border-indigo-500 text-white bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Staging & Review Queue</span>
            {store.products.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {store.products.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'scraper'
                ? 'border-indigo-500 text-white bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Target Scraper & Priority Setup</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
              {store.scraperConfig.priorityCategories?.length || 0} categories
            </span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'admin'
                ? 'border-indigo-500 text-white bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Admin Panel Bot Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-white bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Agent Terminal & Logs</span>
            {store.logs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="pt-2">
          {activeTab === 'staging' && (
            <StagingTab
              products={store.products}
              isSyncingActive={store.isSyncingActive}
              onEditProduct={(p) => setEditingProduct(p)}
              onDeleteProduct={handleDeleteProduct}
              onBatchAction={handleBatchAction}
              onSyncProducts={handleSyncProducts}
            />
          )}

          {activeTab === 'scraper' && (
            <ScraperTab
              config={store.scraperConfig}
              isScrapingActive={store.isScrapingActive}
              onStartScraping={handleStartScraping}
              onSaveConfig={handleSaveScraperConfig}
            />
          )}

          {activeTab === 'admin' && (
            <AdminConfigTab
              config={store.adminConfig}
              onSaveConfig={handleSaveAdminConfig}
            />
          )}

          {activeTab === 'logs' && (
            <LogsTab
              logs={store.logs}
              onClearLogs={handleClearLogs}
              onRefresh={fetchStore}
            />
          )}
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProductEdit}
        />
      )}
    </div>
  );
}
