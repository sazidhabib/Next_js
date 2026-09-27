'use client';

import React, { useState } from 'react';
import {
  ProductItem,
  ProductStatus,
} from '@/lib/types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  Send,
  Check,
  Search,
  Filter,
  Package,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface StagingTabProps {
  products: ProductItem[];
  isSyncingActive: boolean;
  onEditProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onBatchAction: (action: string, productIds?: string[]) => Promise<void>;
  onSyncProducts: (productIds?: string[]) => Promise<void>;
}

export function StagingTab({
  products,
  isSyncingActive,
  onEditProduct,
  onDeleteProduct,
  onBatchAction,
  onSyncProducts,
}: StagingTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductStatus>('ALL');

  // Categories list
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Status badge helper
  const renderStatus = (status: ProductStatus, error?: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Check className="w-3 h-3" /> Approved
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> Ingestion Bot
          </span>
        );
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Synced to Admin
          </span>
        );
      case 'failed':
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-help"
            title={error || 'Failed during admin form ingestion'}
          >
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Batch Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, SKU, model..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
              {(['ALL', 'pending', 'approved', 'synced', 'failed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-colors capitalize ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Operations */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onBatchAction('approve_all')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-sky-400" /> Approve All
            </button>

            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => onBatchAction('approve_selected', selectedIds)}
                  className="px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 text-xs font-medium rounded-xl border border-sky-800/60 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Approve ({selectedIds.length})
                </button>

                <button
                  onClick={() => onBatchAction('delete_selected', selectedIds)}
                  className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-medium rounded-xl border border-rose-900/50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.length})
                </button>
              </>
            )}

            {/* PROMINENT SYNC BUTTON */}
            <button
              onClick={() => onSyncProducts(selectedIds.length > 0 ? selectedIds : undefined)}
              disabled={isSyncingActive || products.length === 0}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              {isSyncingActive ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Bot Ingesting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {selectedIds.length > 0
                      ? `Sync Selected (${selectedIds.length}) to Admin`
                      : 'Sync Approved to Admin'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Items Table / Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-300">No staged products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {products.length === 0
              ? 'Visit the "Target Scraper" tab to extract products from your targeted website into this staging list.'
              : 'Try clearing your search or status filter to see other products.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                    />
                  </th>
                  <th className="py-3 px-4 w-16">Image</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Model / SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const firstImg = p.images?.[0];

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(p.id)}
                          className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                        />
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative group">
                          {firstImg ? (
                            <img
                              src={firstImg}
                              alt={p.title}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as any).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                          {p.images && p.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-slate-900/90 text-[9px] font-mono px-1 rounded-tl text-slate-400">
                              +{p.images.length - 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Specs */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate text-sm" title={p.title}>
                          {p.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          {p.sourceUrl && (
                            <a
                              href={p.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                              title="Inspect original target page"
                            >
                              <span>source</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          {p.localImages && p.localImages.length > 0 && (
                            <span className="text-emerald-400 text-[10px]">
                              • {p.localImages.length} cached for upload
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Model / SKU */}
                      <td className="py-3 px-4 font-mono text-slate-400">{p.model}</td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-emerald-400">
                        ৳{p.price.toLocaleString()}
                        {p.regularPrice && p.regularPrice > p.price && (
                          <div className="text-[10px] text-slate-500 line-through">
                            ৳{p.regularPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">{renderStatus(p.status, p.errorMessage)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit product details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {p.status === 'pending' && (
                            <button
                              onClick={() => onBatchAction('approve_selected', [p.id])}
                              className="p-1.5 text-sky-400 hover:text-sky-300 rounded-lg hover:bg-sky-950/40 transition-colors"
                              title="Approve for publishing"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onSyncProducts([p.id])}
                            disabled={isSyncingActive}
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-950/40 transition-colors disabled:opacity-40"
                            title="Sync this product to Admin Panel now"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
