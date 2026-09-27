'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft, Plus, CheckCircle2, Trash2 } from 'lucide-react';

export default function MockAdminCatalog() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('mock_admin_products') || '[]');
      setProducts(data);
    } catch {}
  }, []);

  const handleClear = () => {
    localStorage.removeItem('mock_admin_products');
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Store Catalog</h1>
              <p className="text-xs text-slate-400">Products ingested via AutoPost Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 border border-rose-900/50 bg-rose-950/20 px-3 py-1.5 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Mock Catalog
              </button>
            )}
            <Link
              href="/mock-admin/products/new"
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Product
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-medium text-slate-300">Catalog is currently empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Run the AutoPost Agent from the control dashboard to automatically ingest products here.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU / Model</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Sale Price</th>
                  <th className="py-3.5 px-4">Ingested At</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{p.title}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{p.model}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">${p.price}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{p.salePrice ? `$${p.salePrice}` : '—'}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleTimeString() : 'Recently'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
