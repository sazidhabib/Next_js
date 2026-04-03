"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";

export default function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio?limit=100', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(data.data.demos || []);
      }
    } catch (error) {
      console.error('Fetch portfolio error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPortfolio(portfolio.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredPortfolio = portfolio.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
          <p className="text-zinc-400 mt-1">Manage your portfolio items</p>
        </div>
        <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search portfolio items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading...</div>
      ) : filteredPortfolio.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-400">No portfolio items found</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">Featured</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredPortfolio.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{item.title}</p>
                      {item.client_name && (
                        <p className="text-zinc-500 text-sm">{item.client_name}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-400">{item.category_title || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.featured ? (
                        <Eye className="w-5 h-5 text-primary" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-zinc-600" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-zinc-400 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
