'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  UserCheck,
  FileCheck,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Badge, Card, Modal } from '../ui';

export default function RightToWorkManagement({ employees, onUpdated }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    checkType: 'ONLINE_SHARE_CODE',
    checkDate: new Date().toISOString().split('T')[0],
    nextReviewDate: '',
    verifiedBy: 'HR Compliance Officer',
    documentType: 'Share Code & Passport',
    documentRefNumber: '',
    statutoryExcuseGranted: true,
    status: 'VERIFIED',
    notes: '',
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rtw');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Fetch RTW error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openAdd = () => {
    setForm({
      employeeId: employees?.[0]?.id || '',
      checkType: 'ONLINE_SHARE_CODE',
      checkDate: new Date().toISOString().split('T')[0],
      nextReviewDate: '',
      verifiedBy: 'HR Compliance Officer',
      documentType: 'Share Code & Passport',
      documentRefNumber: '',
      statutoryExcuseGranted: true,
      status: 'VERIFIED',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rtw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('RTW Verification recorded successfully');
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
    if (!confirm('Delete this RTW audit record?')) return;
    try {
      const res = await fetch(`/api/rtw/${id}`, { method: 'DELETE' });
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
    return empName.includes(term) || (r.verifiedBy && r.verifiedBy.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Right to Work (RTW) Statutory Compliance</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit logs for Home Office statutory excuse checks and digital share code validations
          </p>
        </div>

        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Perform RTW Check</span>
        </button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, officer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <span className="text-xs text-zinc-500">{filtered.length} Audit Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">Employee</th>
                <th className="px-3 sm:px-4 py-3">Check Method</th>
                <th className="px-3 sm:px-4 py-3">Check Date</th>
                <th className="px-3 sm:px-4 py-3">Next Review Due</th>
                <th className="px-3 sm:px-4 py-3">Verified By</th>
                <th className="px-3 sm:px-4 py-3">Statutory Excuse</th>
                <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500 text-xs">
                    {loading ? 'Loading...' : 'No RTW audit records found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
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
                      <span className="font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {rec.checkType === 'ONLINE_SHARE_CODE'
                          ? 'Online Share Code'
                          : rec.checkType === 'MANUAL_DOCUMENT'
                          ? 'Manual Check'
                          : 'Digital IDSP'}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs font-medium">{rec.checkDate}</td>

                    <td className="px-3 sm:px-4 py-3 text-xs font-medium">
                      {rec.nextReviewDate ? (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          {rec.nextReviewDate}
                        </span>
                      ) : (
                        <span className="text-zinc-400">Continuous / None</span>
                      )}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">
                      {rec.verifiedBy}
                    </td>

                    <td className="px-3 sm:px-4 py-3">
                      {rec.statutoryExcuseGranted ? (
                        <Badge variant="success">Granted (Active)</Badge>
                      ) : (
                        <Badge variant="danger">Pending Review</Badge>
                      )}
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add RTW Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Right to Work Verification"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Check Method *
              </label>
              <select
                value={form.checkType}
                onChange={(e) => setForm({ ...form, checkType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="ONLINE_SHARE_CODE">Online Home Office Share Code Check</option>
                <option value="MANUAL_DOCUMENT">Manual Physical Document Check</option>
                <option value="DIGITAL_IDSP">Digital IDSP</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Verified By *
              </label>
              <input
                type="text"
                required
                value={form.verifiedBy}
                onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Check Date *
              </label>
              <input
                type="date"
                required
                value={form.checkDate}
                onChange={(e) => setForm({ ...form, checkDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Next Review Date
              </label>
              <input
                type="date"
                value={form.nextReviewDate}
                onChange={(e) => setForm({ ...form, nextReviewDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Document Description
              </label>
              <input
                type="text"
                value={form.documentType}
                onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Document Ref / Share Code
              </label>
              <input
                type="text"
                value={form.documentRefNumber}
                onChange={(e) => setForm({ ...form, documentRefNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="statutoryExcuse"
              checked={form.statutoryExcuseGranted}
              onChange={(e) => setForm({ ...form, statutoryExcuseGranted: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
            />
            <label htmlFor="statutoryExcuse" className="font-semibold text-zinc-800 dark:text-zinc-200">
              Statutory Excuse Established
            </label>
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
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              Save Verification Audit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
