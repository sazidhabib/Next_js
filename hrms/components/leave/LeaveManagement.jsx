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
  FileText,
  Edit,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Badge, Card } from '../ui';

const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave',
  'Maternity & Paternity Leave',
  'Bereavement Leave',
  'Emergency Leave',
  'Jury Service',
  'Unpaid Leave',
];

const LEAVE_STATUSES = ['Pending', 'Approved', 'Rejected', 'Cancelled'];

export default function LeaveManagement({ employees = [], onUpdated }) {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('requests'); // 'requests' | 'add' | 'edit'
  const [statusFilter, setStatusFilter] = useState('');
  const [editingLeave, setEditingLeave] = useState(null);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e - s;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const initialFormState = {
    id: '',
    employeeId: '',
    leaveType: 'Annual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    days: 1,
    reason: '',
    status: 'Pending',
    approvedBy: '',
  };

  const [form, setForm] = useState(initialFormState);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

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
    fetchUsers();
  }, [statusFilter]);

  const openAddTab = () => {
    setEditingLeave(null);
    const defaultEmp = employees?.[0]?.id || '';
    const today = new Date().toISOString().split('T')[0];
    const defaultApprover = users?.[0]?.name || 'Bishnu Hari';

    setForm({
      ...initialFormState,
      employeeId: defaultEmp,
      startDate: today,
      endDate: today,
      days: 1,
      approvedBy: defaultApprover,
    });
    setActiveSubTab('add');
  };

  const openEditTab = (leave) => {
    setEditingLeave(leave);
    setForm({
      id: leave.id || '',
      employeeId: leave.employeeId || '',
      leaveType: leave.leaveType || 'Annual Leave',
      startDate: leave.startDate || '',
      endDate: leave.endDate || '',
      days: leave.totalDays || leave.days || 1,
      reason: leave.reason || '',
      status: leave.status || 'Pending',
      approvedBy: leave.approvedBy || '',
    });
    setActiveSubTab('edit');
  };

  const handleDateChange = (field, value) => {
    const updated = { ...form, [field]: value };
    const s = field === 'startDate' ? value : form.startDate;
    const e = field === 'endDate' ? value : form.endDate;
    if (s && e) {
      updated.days = calculateDays(s, e);
    }
    setForm(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = activeSubTab === 'edit' && editingLeave;
      const url = isEdit ? `/api/leave/${editingLeave.id}` : '/api/leave';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        employeeId: parseInt(form.employeeId, 10) || form.employeeId,
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        totalDays: parseFloat(form.days) || 1,
        reason: form.reason,
        status: form.status,
        approvedBy: form.approvedBy,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(isEdit ? 'Leave request updated' : 'Leave request created');
        setActiveSubTab('requests');
        setEditingLeave(null);
        fetchLeaves();
        if (onUpdated) onUpdated();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Submit failed: ' + err.message);
    }
  };

  const handleQuickStatus = async (id, status) => {
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

  const pendingCount = leaves.filter((l) => (l.status || '').toUpperCase() === 'PENDING').length;

  return (
    <div className="space-y-4">
      {/* Module Navigation Card with System Style Sub-Tabs */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span>Leave & Absence Management</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Submit and approve statutory leaves, annual holidays, sick leaves and manager sign-offs
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'requests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Leave Requests</span>
          </button>

          <button
            type="button"
            onClick={openAddTab}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'add'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Leave Request</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!editingLeave && leaves.length > 0) {
                openEditTab(leaves[0]);
              } else if (editingLeave) {
                setActiveSubTab('edit');
              } else {
                alert('Please select a leave request from the list to edit');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'edit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit Leave Request</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Requests Table */}
      {activeSubTab === 'requests' && (
        <Card>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses ({leaves.length})</option>
                <option value="Pending">Pending Only ({pendingCount})</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <span className="text-xs text-zinc-500">{leaves.length} Total Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3">Employee</th>
                  <th className="px-3 sm:px-4 py-3">Leave Type</th>
                  <th className="px-3 sm:px-4 py-3">Duration & Dates</th>
                  <th className="px-3 sm:px-4 py-3">Days</th>
                  <th className="px-3 sm:px-4 py-3">Reason</th>
                  <th className="px-3 sm:px-4 py-3">Status</th>
                  <th className="px-3 sm:px-4 py-3">Approved By</th>
                  <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500 text-xs">
                      {loading ? 'Loading requests...' : 'No leave requests found.'}
                    </td>
                  </tr>
                ) : (
                  leaves.map((l) => {
                    const st = (l.status || 'Pending').toUpperCase();
                    return (
                      <tr key={l.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                        <td className="px-3 sm:px-4 py-3">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[140px]">
                            {l.employee?.firstName} {l.employee?.lastName}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {l.employee?.employeeCode || `EMP-${l.employeeId}`}
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

                        <td className="px-3 sm:px-4 py-3 text-xs font-bold">{l.totalDays || l.days || 1} d</td>

                        <td className="px-3 sm:px-4 py-3 text-xs text-zinc-500 max-w-[150px] truncate">
                          {l.reason || '-'}
                        </td>

                        <td className="px-3 sm:px-4 py-3">
                          <Badge
                            variant={
                              st === 'APPROVED'
                                ? 'success'
                                : st === 'PENDING'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {l.status}
                          </Badge>
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-xs text-zinc-600 dark:text-zinc-300">
                          {l.approvedBy || '-'}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => openEditTab(l)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {st === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleQuickStatus(l.id, 'Approved')}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleQuickStatus(l.id, 'Rejected')}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition"
                            title="Delete"
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
      )}

      {/* Sub-Tab 2 & 3: Create / Edit Leave Request Form */}
      {(activeSubTab === 'add' || activeSubTab === 'edit') && (
        <Card>
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {activeSubTab === 'edit' ? `Edit Leave Request #${form.id}` : 'Create Leave Request'}
            </h3>
            <p className="text-xs text-zinc-500">
              Submit employee leave booking with start/end duration, reason and manager assignment.
            </p>
          </div>

          <form onSubmit={handleSave} className="max-w-2xl space-y-4 text-xs">
            {/* Employee Id */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Employee Id: *
              </label>
              <select
                required
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Employee</option>
                {employees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode || `ID-${emp.id}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Leave Type: *
              </label>
              <select
                required
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {LEAVE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Start Date: *
                </label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  End Date: *
                </label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Days: *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Reason:
              </label>
              <textarea
                rows={4}
                placeholder="Reason for leave request..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Status:
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {LEAVE_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Approved by */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Approved by:
              </label>
              <select
                value={form.approvedBy}
                onChange={(e) => setForm({ ...form, approvedBy: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Approver / Manager</option>
                {users.length > 0 ? (
                  users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} {u.role?.name ? `(${u.role.name})` : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Bishnu Hari">Bishnu Hari</option>
                    <option value="Obi kazi">Obi kazi</option>
                    <option value="Kaiseer Kazi">Kaiseer Kazi</option>
                  </>
                )}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('requests')}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeSubTab === 'edit' ? 'Update Leave' : 'Request Leave'}</span>
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
