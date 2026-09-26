'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { Badge, Card, Modal } from '../ui';

export default function LeaveManagement({ employees, onUpdated }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    totalDays: 1,
    reason: '',
  });

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let url = '/api/leave';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLeaves(data.leaveRequests);
      }
    } catch (err) {
      console.error('Fetch leave error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const openAdd = () => {
    setForm({
      employeeId: employees?.[0]?.id || '',
      leaveType: 'ANNUAL',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalDays: 1,
      reason: '',
    });
    setIsModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('Leave request submitted');
        setIsModalOpen(false);
        fetchLeaves();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Submit failed: ' + err.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeaves();
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Cancel this leave request?')) return;
    try {
      const res = await fetch(`/api/leave/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchLeaves();
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const pendingCount = leaves.filter((l) => l.status === 'PENDING').length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span>Leave & Absence Management</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Process annual leave, sick leave and manager approval workflows
          </p>
        </div>

        <button
          onClick={openAdd}
          className="self-start sm:self-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply For Leave</span>
        </button>
      </div>

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Only ({pendingCount})</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <span className="text-xs text-zinc-500">{leaves.length} Total Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 sm:px-4 py-3">Employee</th>
                <th className="px-3 sm:px-4 py-3">Type</th>
                <th className="px-3 sm:px-4 py-3">Duration & Dates</th>
                <th className="px-3 sm:px-4 py-3">Days</th>
                <th className="px-3 sm:px-4 py-3">Reason</th>
                <th className="px-3 sm:px-4 py-3">Status</th>
                <th className="px-3 sm:px-4 py-3 text-right">Approvals / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500 text-xs">
                    {loading ? 'Loading...' : 'No leave requests found.'}
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[140px]">
                        {l.employee?.firstName} {l.employee?.lastName}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {l.employee?.employeeCode}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {l.leaveType}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs">
                      <div className="font-medium text-zinc-800 dark:text-zinc-200">
                        {l.startDate} to {l.endDate}
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-xs font-bold">{l.totalDays} d</td>

                    <td className="px-3 sm:px-4 py-3 text-xs text-zinc-500 max-w-[150px] truncate">
                      {l.reason || '-'}
                    </td>

                    <td className="px-3 sm:px-4 py-3">
                      <Badge
                        variant={
                          l.status === 'APPROVED'
                            ? 'success'
                            : l.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {l.status}
                      </Badge>
                    </td>

                    <td className="px-3 sm:px-4 py-3 text-right space-x-1.5">
                      {l.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'APPROVED')}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'REJECTED')}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply For Leave">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
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
                Leave Type *
              </label>
              <select
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <option value="ANNUAL">Annual Leave (Holiday)</option>
                <option value="SICK">Sick Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
                <option value="PATERNITY">Paternity Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Total Days *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={form.totalDays}
                onChange={(e) => setForm({ ...form, totalDays: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Reason</label>
            <textarea
              rows={2}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
