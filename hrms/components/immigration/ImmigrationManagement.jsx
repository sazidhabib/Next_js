'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Badge, Card, Modal } from '../ui';

export default function ImmigrationManagement({ employees, visaTypes, onUpdated }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    visaTypeId: '',
    passportNumber: '',
    brpOrEvisaNumber: '',
    issueDate: '',
    expiryDate: '',
    shareCode: '',
    sponsorCosNumber: '',
    notes: '',
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/immigration');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Fetch immigration error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openAdd = () => {
    setEditingRecord(null);
    setForm({
      employeeId: employees?.[0]?.id || '',
      visaTypeId: visaTypes?.[0]?.id || '',
      passportNumber: '',
      brpOrEvisaNumber: '',
      issueDate: '',
      expiryDate: '',
      shareCode: '',
      sponsorCosNumber: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (rec) => {
    setEditingRecord(rec);
    setForm({
      employeeId: rec.employeeId,
      visaTypeId: rec.visaTypeId,
      passportNumber: rec.passportNumber || '',
      brpOrEvisaNumber: rec.brpOrEvisaNumber || '',
      issueDate: rec.issueDate || '',
      expiryDate: rec.expiryDate || '',
      shareCode: rec.shareCode || '',
      sponsorCosNumber: rec.sponsorCosNumber || '',
      notes: rec.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingRecord ? `/api/immigration/${editingRecord.id}` : '/api/immigration';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert(editingRecord ? 'Record updated' : 'Record created');
        setIsModalOpen(false);
        fetchRecords();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this immigration record?')) return;
    try {
      const res = await fetch(`/api/immigration/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = records.filter((r) => {
    const term = search.toLowerCase();
    const empName = `${r.employee?.firstName} ${r.employee?.lastName}`.toLowerCase();
    return (
      empName.includes(term) ||
      (r.shareCode && r.shareCode.toLowerCase().includes(term)) ||
      (r.visaType?.name && r.visaType.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header with Title & Add Record Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-blue-600" />
            <span>Immigration & Visa Compliance Hub</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time UK Home Office visa expiry tracking and sponsorship verification
          </p>
        </div>

        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Visa</span>
        </button>
      </div>

      {/* Search and Table */}
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, share code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <span className="text-xs text-zinc-500">{filtered.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">Employee</th>
                <th className="px-3 sm:px-4 py-3">Visa Category</th>
                <th className="px-3 sm:px-4 py-3">Share Code / BRP</th>
                <th className="px-3 sm:px-4 py-3">CoS Number</th>
                <th className="px-3 sm:px-4 py-3">Expiry Date</th>
                <th className="px-3 sm:px-4 py-3">Compliance Status</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500 text-xs">
                    {loading ? 'Loading...' : 'No immigration records found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const today = new Date();
                  const exp = new Date(rec.expiryDate);
                  const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = diff <= 90 && diff > 0;
                  const isExpired = diff <= 0;

                  return (
                    <tr key={rec.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[140px]">
                          {rec.employee?.firstName} {rec.employee?.lastName}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {rec.employee?.employeeCode}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {rec.visaType?.name || 'N/A'}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs">
                        {rec.shareCode ? (
                          <span className="font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[11px]">
                            {rec.shareCode}
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">{rec.brpOrEvisaNumber || 'N/A'}</span>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        {rec.sponsorCosNumber || '-'}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs font-medium">
                        {rec.expiryDate}
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        {isExpired ? (
                          <Badge variant="danger">EXPIRED ({Math.abs(diff)}d ago)</Badge>
                        ) : isExpiringSoon ? (
                          <Badge variant="warning">Expiring in {diff}d</Badge>
                        ) : (
                          <Badge variant="success">Valid ({diff}d)</Badge>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => openEdit(rec)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Update Immigration Record' : 'Record New Immigration Document'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Employee *
              </label>
              <select
                required
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="">Select Employee</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Visa Category *
              </label>
              <select
                required
                value={form.visaTypeId}
                onChange={(e) => setForm({ ...form, visaTypeId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="">Select Visa Type</option>
                {visaTypes?.map((vt) => (
                  <option key={vt.id} value={vt.id}>
                    {vt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Passport Number
              </label>
              <input
                type="text"
                value={form.passportNumber}
                onChange={(e) => setForm({ ...form, passportNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                BRP / eVisa Number
              </label>
              <input
                type="text"
                value={form.brpOrEvisaNumber}
                onChange={(e) => setForm({ ...form, brpOrEvisaNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Home Office Share Code
              </label>
              <input
                type="text"
                placeholder="e.g. W87-29A-L90"
                value={form.shareCode}
                onChange={(e) => setForm({ ...form, shareCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Certificate of Sponsorship (CoS)
              </label>
              <input
                type="text"
                placeholder="e.g. COS-UK-2026-1234"
                value={form.sponsorCosNumber}
                onChange={(e) => setForm({ ...form, sponsorCosNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
