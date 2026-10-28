'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Palmtree,
  PieChart,
  AlertCircle,
  TrendingDown,
  Building2,
  Search,
  Check,
  Eye,
  X,
} from 'lucide-react';
import { Badge, Card, Modal } from '../ui';
import { useAuth } from '@/context/AuthContext';

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
  const { user, canEdit, canDelete, hasPermission } = useAuth();
  const canEditLeave = canEdit('leave');
  const canDeleteLeave = canDelete('leave');
  const canRequestLeave = hasPermission('REQUEST_LEAVE') || canEditLeave;
  const canApproveLeave = hasPermission('APPROVE_LEAVES') || canEditLeave;

  const isEmployeeUser = user?.roleName === 'Employee' || (!canApproveLeave && !canEditLeave);
  const currentEmployeeId = user?.employeeId;
  const currentEmp = useMemo(
    () => employees.find((e) => String(e.id) === String(currentEmployeeId)),
    [employees, currentEmployeeId]
  );
  const selectableEmployees = useMemo(() => {
    if (isEmployeeUser && currentEmp) {
      return [currentEmp];
    }
    return employees;
  }, [employees, isEmployeeUser, currentEmp]);

  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('requests'); // 'requests' | 'balances' | 'add' | 'edit'
  const [statusFilter, setStatusFilter] = useState('');
  const [balanceSearch, setBalanceSearch] = useState('');
  const [balanceDeptFilter, setBalanceDeptFilter] = useState('');
  const [editingLeave, setEditingLeave] = useState(null);
  const [previewLeave, setPreviewLeave] = useState(null);
  const [leaveEmployeeFilter, setLeaveEmployeeFilter] = useState('ALL');
  const [leaveSearchQuery, setLeaveSearchQuery] = useState('');

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

  useEffect(() => {
    if (isEmployeeUser && currentEmployeeId && !form.employeeId) {
      setForm((prev) => ({ ...prev, employeeId: currentEmployeeId }));
    }
  }, [isEmployeeUser, currentEmployeeId, form.employeeId]);

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

  // Helper to calculate Allowance, Used, and Remaining for any employee
  const getEmployeeHolidayStats = (employeeId, employeeAllowance) => {
    const emp = employees.find((e) => String(e.id) === String(employeeId));
    const allowance = parseFloat(employeeAllowance ?? emp?.holidayAllowance ?? 28);

    // Sum all approved annual leave days for this employee
    const approvedLeaves = leaves.filter((l) => {
      const matchEmp = String(l.employeeId) === String(employeeId);
      const isApproved = (l.status || '').toUpperCase() === 'APPROVED';
      const isAnnual = (l.leaveType || '').toUpperCase().includes('ANNUAL');
      return matchEmp && isApproved && isAnnual;
    });

    const used = approvedLeaves.reduce(
      (sum, curr) => sum + (parseFloat(curr.totalDays || curr.days) || 0),
      0
    );
    const remaining = Math.max(0, allowance - used);

    // Pending annual leaves
    const pendingLeaves = leaves.filter((l) => {
      const matchEmp = String(l.employeeId) === String(employeeId);
      const isPending = (l.status || '').toUpperCase() === 'PENDING';
      const isAnnual = (l.leaveType || '').toUpperCase().includes('ANNUAL');
      return matchEmp && isPending && isAnnual;
    });
    const pendingDays = pendingLeaves.reduce(
      (sum, curr) => sum + (parseFloat(curr.totalDays || curr.days) || 0),
      0
    );

    const percentUsed = allowance > 0 ? Math.min(100, Math.round((used / allowance) * 100)) : 0;

    return { allowance, used, remaining, pendingDays, pendingCount: pendingLeaves.length, percentUsed };
  };

  // Aggregate stats across visible employees (or only the logged-in employee if role is Employee)
  const aggregateStats = useMemo(() => {
    let totalAllowance = 0;
    let totalUsed = 0;
    let totalRemaining = 0;
    let lowBalanceCount = 0;

    const targetList = isEmployeeUser && currentEmployeeId
      ? employees.filter((e) => String(e.id) === String(currentEmployeeId))
      : employees;

    targetList.forEach((emp) => {
      const { allowance, used, remaining } = getEmployeeHolidayStats(emp.id, emp.holidayAllowance);
      totalAllowance += allowance;
      totalUsed += used;
      totalRemaining += remaining;
      if (remaining <= 5) lowBalanceCount += 1;
    });

    return { totalAllowance, totalUsed, totalRemaining, lowBalanceCount, count: targetList.length };
  }, [employees, leaves, isEmployeeUser, currentEmployeeId]);

  const displayLeaves = useMemo(() => {
    return leaves.filter((l) => {
      // Employee filter: 'ALL', 'MY', or specific employee ID
      if (leaveEmployeeFilter === 'MY' && currentEmployeeId) {
        if (String(l.employeeId) !== String(currentEmployeeId)) return false;
      } else if (leaveEmployeeFilter !== 'ALL' && String(l.employeeId) !== String(leaveEmployeeFilter)) {
        return false;
      }

      // Search query (filter by employee name, employee code, reason, or leave type)
      if (leaveSearchQuery.trim()) {
        const q = leaveSearchQuery.toLowerCase();
        const empName = `${l.employee?.firstName || ''} ${l.employee?.lastName || ''}`.toLowerCase();
        const empCode = (l.employee?.employeeCode || `EMP-${l.employeeId}`).toLowerCase();
        const reason = (l.reason || '').toLowerCase();
        const type = (l.leaveType || '').toLowerCase();
        if (!empName.includes(q) && !empCode.includes(q) && !reason.includes(q) && !type.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [leaves, leaveEmployeeFilter, leaveSearchQuery, currentEmployeeId]);

  const openAddTab = (preselectedEmpId = '') => {
    setEditingLeave(null);
    const defaultEmp = (isEmployeeUser && currentEmployeeId)
      ? currentEmployeeId
      : (preselectedEmpId || employees?.[0]?.id || '');
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
    if (!canEditLeave) {
      setPreviewLeave(leave);
      return;
    }
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
    if (!canRequestLeave && !canEditLeave) {
      alert('You do not have permission to submit or edit leave requests.');
      return;
    }
    if (dateConflicts.isBlocked) {
      alert(
        `Booking Blocked: 2 employees already have approved leave during this date period (${form.startDate} to ${form.endDate}):\n` +
        dateConflicts.conflictingEmployees.map((c) => `• ${c.employeeName} (${c.startDate} to ${c.endDate})`).join('\n') +
        '\n\nMaximum 2 concurrent employees allowed. A 3rd leave cannot be booked for these dates.'
      );
      return;
    }

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
        status: canApproveLeave ? form.status : 'Pending',
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
        alert('Error: ' + (data.error || 'Operation failed'));
      }
    } catch (err) {
      alert('Submit failed: ' + err.message);
    }
  };

  const handleQuickStatus = async (id, status) => {
    if (!canApproveLeave) {
      alert('You do not have permission to approve or reject leave requests.');
      return;
    }
    if ((status || '').toUpperCase() === 'APPROVED') {
      const targetLeave = leaves.find((l) => String(l.id) === String(id));
      if (targetLeave) {
        const tStart = new Date(targetLeave.startDate);
        const tEnd = new Date(targetLeave.endDate);
        const approvedConflicts = leaves.filter((l) => {
          if (String(l.id) === String(id)) return false;
          if (String(l.employeeId) === String(targetLeave.employeeId)) return false;
          if ((l.status || '').toUpperCase() !== 'APPROVED') return false;
          if (!l.startDate || !l.endDate) return false;
          const lStart = new Date(l.startDate);
          const lEnd = new Date(l.endDate);
          return tStart <= lEnd && tEnd >= lStart;
        });

        const distinctMap = new Map();
        approvedConflicts.forEach((l) => {
          const empId = String(l.employeeId);
          if (!distinctMap.has(empId)) {
            const emp = employees.find((e) => String(e.id) === empId) || l.employee;
            distinctMap.set(empId, emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${empId}`);
          }
        });

        if (distinctMap.size >= 2) {
          const names = Array.from(distinctMap.values()).join(', ');
          alert(
            `Approval Blocked!\n\n2 employees already have approved leave during this date period (${targetLeave.startDate} to ${targetLeave.endDate}):\n• ${names}\n\nMaximum 2 concurrent employees allowed per date period.`
          );
          return;
        }
      }
    }

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
      } else {
        alert('Status update failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteLeave) {
      alert('You do not have permission to delete leave requests.');
      return;
    }
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

  // Selected employee stats for Add/Edit Form live calculation
  const currentFormEmpStats = form.employeeId
    ? getEmployeeHolidayStats(form.employeeId)
    : null;

  // Live Concurrent Leave Conflict Detection (Max 2 Approved Employees during same date frame)
  const dateConflicts = useMemo(() => {
    if (!form.startDate || !form.endDate) {
      return { isBlocked: false, count: 0, conflictingEmployees: [] };
    }

    const targetStart = new Date(form.startDate);
    const targetEnd = new Date(form.endDate);

    if (isNaN(targetStart.getTime()) || isNaN(targetEnd.getTime())) {
      return { isBlocked: false, count: 0, conflictingEmployees: [] };
    }

    const approvedLeaves = leaves.filter((l) => {
      // Exclude current request if editing
      if (form.id && String(l.id) === String(form.id)) return false;
      // Exclude same employee
      if (form.employeeId && String(l.employeeId) === String(form.employeeId)) return false;
      // Only Approved leaves count toward capacity
      const st = (l.status || '').toUpperCase();
      if (st !== 'APPROVED') return false;

      if (!l.startDate || !l.endDate) return false;
      const lStart = new Date(l.startDate);
      const lEnd = new Date(l.endDate);
      return targetStart <= lEnd && targetEnd >= lStart;
    });

    const empMap = new Map();
    approvedLeaves.forEach((l) => {
      const empId = String(l.employeeId);
      if (!empMap.has(empId)) {
        const emp = employees.find((e) => String(e.id) === empId) || l.employee;
        empMap.set(empId, {
          ...l,
          employeeName: emp ? `${emp.firstName} ${emp.lastName}` : (l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : `Employee #${empId}`),
          employeeCode: emp?.employeeCode || '',
          department: emp?.department?.name || '',
        });
      }
    });

    const conflictingList = Array.from(empMap.values());
    return {
      isBlocked: conflictingList.length >= 2,
      count: conflictingList.length,
      conflictingEmployees: conflictingList,
    };
  }, [form.startDate, form.endDate, form.employeeId, form.id, leaves, employees]);

  // Filtered employees for Balances tab (Scoped strictly to own employee record for Employee role)
  const filteredEmployeesForBalances = useMemo(() => {
    const baseList = isEmployeeUser
      ? (currentEmployeeId && employees.filter((e) => String(e.id) === String(currentEmployeeId)).length > 0
          ? employees.filter((e) => String(e.id) === String(currentEmployeeId))
          : (user?.employee ? [user.employee] : []))
      : employees;

    return baseList.filter((emp) => {
      const query = balanceSearch.toLowerCase().trim();
      const matchSearch =
        !query ||
        `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase().includes(query) ||
        (emp.employeeCode || '').toLowerCase().includes(query) ||
        (emp.jobTitle || '').toLowerCase().includes(query);

      const matchDept =
        !balanceDeptFilter ||
        String(emp.departmentId) === String(balanceDeptFilter) ||
        emp.department?.name === balanceDeptFilter;

      return matchSearch && matchDept;
    });
  }, [employees, balanceSearch, balanceDeptFilter, isEmployeeUser, currentEmployeeId, user?.employee]);

  return (
    <div className="space-y-4">
      {/* Module Navigation Card with System Style Sub-Tabs */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span>Leave & Holiday Tracking</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Monitor Holiday Allowance, Used, and Remaining balances for every employee and approve statutory leaves
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
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-zinc-900 font-bold ml-1">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('balances')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'balances'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Palmtree className="w-4 h-4 text-emerald-500" />
            <span>{isEmployeeUser ? 'My Holiday Balance' : `Holiday Balances (${employees.length})`}</span>
          </button>

          {canRequestLeave && (
            <button
              type="button"
              onClick={() => openAddTab()}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
                activeSubTab === 'add'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{canEditLeave ? 'Add Leave Request' : 'Request Leave'}</span>
            </button>
          )}

          {activeSubTab === 'edit' && (
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-md shadow-blue-600/20 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>{canEditLeave ? 'Edit Leave Request' : 'View Leave Details'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab 1: Requests Table */}
      {activeSubTab === 'requests' && (
        <Card>
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search bar */}
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leave / employee..."
                  value={leaveSearchQuery}
                  onChange={(e) => setLeaveSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter by Employee */}
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-500 text-xs">Employee:</span>
                <select
                  value={leaveEmployeeFilter}
                  onChange={(e) => setLeaveEmployeeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[170px] truncate"
                >
                  <option value="ALL">All Employees</option>
                  {currentEmployeeId && <option value="MY">My Requests Only</option>}
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} {String(emp.id) === String(currentEmployeeId) ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-500 text-xs">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending Only ({pendingCount})</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-zinc-500 font-medium">
              Showing {displayLeaves.length} of {leaves.length} requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3">{isEmployeeUser ? 'Employee' : 'Employee & Balances'}</th>
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
                {displayLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500 text-xs">
                      {loading ? 'Loading requests...' : 'No leave requests found matching filter.'}
                    </td>
                  </tr>
                ) : (
                  displayLeaves.map((l) => {
                    const st = (l.status || 'Pending').toUpperCase();
                    const isOwnRecord = currentEmployeeId && String(l.employeeId) === String(currentEmployeeId);
                    const canViewBalance = !isEmployeeUser || isOwnRecord;
                    const stats = canViewBalance ? getEmployeeHolidayStats(l.employeeId, l.employee?.holidayAllowance) : null;

                    return (
                      <tr
                        key={l.id}
                        onClick={() => setPreviewLeave(l)}
                        className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition cursor-pointer group"
                      >
                        <td className="px-3 sm:px-4 py-3">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[150px]">
                            {l.employee?.firstName} {l.employee?.lastName}
                            {isOwnRecord && <span className="text-blue-600 dark:text-blue-400 font-normal ml-1">(You)</span>}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {l.employee?.employeeCode || `EMP-${l.employeeId}`}
                          </span>
                          {/* Live 3 Holiday Fields Preview per Row (Shown for own record or for managers) */}
                          {canViewBalance && stats && (
                            <div className="mt-1 flex items-center space-x-1.5 text-[10px] font-mono">
                              <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400" title="Holiday Allowance">
                                Allw: {stats.allowance}d
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-semibold" title="Holiday Used">
                                Used: {stats.used}d
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold ${
                                  stats.remaining <= 5
                                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                }`}
                                title="Holiday Remaining"
                              >
                                Rem: {stats.remaining}d
                              </span>
                            </div>
                          )}
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

                        <td className="px-3 sm:px-4 py-3 text-xs text-zinc-500 max-w-[150px] truncate" title={l.reason}>
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

                        <td className="px-3 sm:px-4 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewLeave(l)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                            title="Preview Leave Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEditLeave && (
                            <button
                              onClick={() => openEditTab(l)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                              title="Edit Leave"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {st === 'PENDING' && canApproveLeave && (
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
                          {canDeleteLeave && (
                            <button
                              onClick={() => handleDelete(l.id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Sub-Tab 2: Holiday Balances Overview Table for Every Employee */}
      {activeSubTab === 'balances' && (
        <div className="space-y-4">
          {/* Organization Holiday Balances KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500">
                  {isEmployeeUser ? 'My Holiday Allowance' : 'Total Org Allowance'}
                </span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Palmtree className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {aggregateStats.totalAllowance} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isEmployeeUser ? 'Personal annual entitlement' : `Across ${employees.length} employees`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500">
                  {isEmployeeUser ? 'My Holidays Used' : 'Total Holidays Used'}
                </span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {aggregateStats.totalUsed} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isEmployeeUser ? 'Approved personal bookings' : 'Approved holiday bookings'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500">
                  {isEmployeeUser ? 'My Balance Remaining' : 'Total Remaining'}
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {aggregateStats.totalRemaining} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isEmployeeUser ? 'Available personal balance' : 'Available company entitlement'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500">
                  {isEmployeeUser ? 'Balance Health' : 'Low Balance Staff'}
                </span>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {isEmployeeUser ? (
                  aggregateStats.totalRemaining <= 5 ? (
                    <span className="text-rose-600 dark:text-rose-400 text-lg sm:text-xl">Low ({aggregateStats.totalRemaining}d)</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl">Good ({aggregateStats.totalRemaining}d)</span>
                  )
                ) : (
                  <>
                    {aggregateStats.lowBalanceCount} <span className="text-xs font-normal text-zinc-500">staff</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isEmployeeUser ? 'Personal annual status' : '≤ 5 days remaining'}
              </p>
            </div>
          </div>

          {/* Master Employee Holiday Table */}
          <Card>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 flex items-center space-x-2">
                {!isEmployeeUser ? (
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employee by name, ID or role..."
                      value={balanceSearch}
                      onChange={(e) => setBalanceSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    My Annual Holiday Entitlement & Usage
                  </div>
                )}
              </div>

              <div className="text-xs text-zinc-500">
                {isEmployeeUser ? (
                  <span>Showing personal entitlement</span>
                ) : (
                  <span>Showing {filteredEmployeesForBalances.length} of {employees.length} employees</span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-4 py-3.5">Employee</th>
                    <th className="px-4 py-3.5">Department & Role</th>
                    <th className="px-4 py-3.5 text-center font-bold">Holiday Allowance</th>
                    <th className="px-4 py-3.5 text-center font-bold text-amber-600 dark:text-amber-400">
                      Holiday Used
                    </th>
                    <th className="px-4 py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      Holiday Remaining
                    </th>
                    <th className="px-4 py-3.5">Allowance Usage</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredEmployeesForBalances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-zinc-500 text-xs">
                        No employees found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployeesForBalances.map((emp) => {
                      const { allowance, used, remaining, pendingDays, pendingCount: pCount, percentUsed } =
                        getEmployeeHolidayStats(emp.id, emp.holidayAllowance);

                      return (
                        <tr key={emp.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  emp.photoUrl ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    emp.firstName + ' ' + emp.lastName
                                  )}&background=0D8ABC&color=fff`
                                }
                                alt={emp.firstName}
                                className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate">
                                  {emp.firstName} {emp.lastName}
                                </div>
                                <span className="font-mono text-[10px] text-zinc-400">
                                  {emp.employeeCode || `EMP-${emp.id}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                              {emp.jobTitle || 'Staff Member'}
                            </div>
                            <div className="text-[11px] text-zinc-500 flex items-center space-x-1">
                              <Building2 className="w-3 h-3" />
                              <span>{emp.department?.name || 'General'}</span>
                            </div>
                          </td>

                          {/* 1. Holiday Allowance */}
                          <td className="px-4 py-3.5 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono">
                              {allowance} days
                            </span>
                          </td>

                          {/* 2. Holiday Used */}
                          <td className="px-4 py-3.5 text-center">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-mono">
                                {used} days
                              </span>
                              {pCount > 0 && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                                  +{pendingDays}d pending
                                </p>
                              )}
                            </div>
                          </td>

                          {/* 3. Holiday Remaining */}
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black font-mono shadow-2xs ${
                                remaining <= 5
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                  : remaining <= 12
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              }`}
                            >
                              {remaining} days
                            </span>
                          </td>

                          {/* Usage Progress Bar */}
                          <td className="px-4 py-3.5 min-w-[140px]">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                                <span>{percentUsed}% taken</span>
                                <span>{remaining}d left</span>
                              </div>
                              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    percentUsed >= 85
                                      ? 'bg-rose-500'
                                      : percentUsed >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percentUsed}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Quick Action */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setLeaveEmployeeFilter(String(emp.id));
                                  setActiveSubTab('requests');
                                }}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center space-x-1"
                                title="View requests for this employee"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                <span>Requests</span>
                              </button>
                              {(!isEmployeeUser || String(emp.id) === String(currentEmployeeId)) && (
                                <button
                                  type="button"
                                  onClick={() => openAddTab(emp.id)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition shadow-2xs flex items-center space-x-1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Book</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Sub-Tab 3 & 4: Create / Edit Leave Request Form */}
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
                disabled={isEmployeeUser}
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {!isEmployeeUser && <option value="">Select Employee</option>}
                {selectableEmployees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode || `ID-${emp.id}`}) — Allw: {emp.holidayAllowance ?? 28}d
                  </option>
                ))}
              </select>
            </div>

            {/* Live Holiday Balance Card for Selected Employee */}
            {currentFormEmpStats && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs flex items-center space-x-1.5">
                    <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Employee Holiday Balance Tracker</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Annual Entitlement
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Holiday Allowance</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {currentFormEmpStats.allowance} days
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Holiday Used</p>
                    <p className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                      {currentFormEmpStats.used} days
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Holiday Remaining</p>
                    <p
                      className={`text-sm font-black mt-0.5 ${
                        currentFormEmpStats.remaining <= 5
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {currentFormEmpStats.remaining} days
                    </p>
                  </div>
                </div>

                {parseFloat(form.days) > currentFormEmpStats.remaining &&
                  (form.leaveType || '').toLowerCase().includes('annual') && (
                    <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 text-[11px] font-medium pt-0.5 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Notice: Requested booking ({form.days} days) exceeds remaining allowance ({currentFormEmpStats.remaining} days).
                      </span>
                    </div>
                  )}
              </div>
            )}

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
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-zinc-900 dark:text-zinc-100 focus:outline-none transition ${
                    dateConflicts.isBlocked
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                      : 'border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500'
                  }`}
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
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-zinc-900 dark:text-zinc-100 focus:outline-none transition ${
                    dateConflicts.isBlocked
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                      : 'border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Concurrent Leave Overlap Warning & Hard Blocking Alert */}
            {dateConflicts.isBlocked && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 space-y-2.5 animate-in fade-in">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="text-sm">Leave Booking Blocked (Maximum 2 Employees Reached)</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                  You cannot add a 3rd employee leave for this date period. The system rule requires that no more than <strong>2 employees</strong> have approved leave during the same date period.
                </p>
                <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-rose-200 dark:border-rose-900 space-y-1.5">
                  <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                    Already Approved Employees for this period:
                  </div>
                  {dateConflicts.conflictingEmployees.map((conf) => (
                    <div key={conf.id} className="flex items-center justify-between text-xs py-1 border-b last:border-b-0 border-rose-100 dark:border-zinc-800">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{conf.employeeName}</span>
                        {conf.employeeCode && (
                          <span className="text-[10px] text-zinc-500">({conf.employeeCode})</span>
                        )}
                        {conf.department && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {conf.department}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] font-medium text-rose-700 dark:text-rose-300">
                        {conf.startDate} to {conf.endDate}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 italic">
                  * Please choose different dates for this employee.
                </div>
              </div>
            )}

            {dateConflicts.count === 1 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-100 flex items-start space-x-2.5 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">1 Concurrent Booking Notice:</span> {dateConflicts.conflictingEmployees[0].employeeName} is already on approved leave for overlapping dates ({dateConflicts.conflictingEmployees[0].startDate} to {dateConflicts.conflictingEmployees[0].endDate}). <strong>1 slot remaining</strong> before concurrency lock.
                </div>
              </div>
            )}

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
                disabled={dateConflicts.isBlocked}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 ${
                  dateConflicts.isBlocked
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                {dateConflicts.isBlocked ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Booking Blocked (Max 2 Reached)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeSubTab === 'edit' ? 'Update Leave' : 'Request Leave'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW LEAVE MODAL (READONLY DETAILS FOR EMPLOYEES & MANAGERS)          */}
      {/* ========================================================================= */}
      {previewLeave && (
        <Modal
          isOpen={!!previewLeave}
          onClose={() => setPreviewLeave(null)}
          title={`Leave Request #${previewLeave.id}`}
        >
          {(() => {
            const emp = previewLeave.employee || employees.find((e) => String(e.id) === String(previewLeave.employeeId));
            const empName = emp ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() : `Employee #${previewLeave.employeeId}`;
            const stats = getEmployeeHolidayStats(previewLeave.employeeId, emp?.holidayAllowance);
            const st = (previewLeave.status || 'Pending').toUpperCase();

            return (
              <div className="space-y-4 text-xs">
                {/* Employee Header */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {emp?.photoUrl ? (
                      <img
                        src={emp.photoUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                        {empName ? empName.charAt(0) : 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {empName}
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center space-x-2 mt-0.5">
                        {emp?.employeeCode && (
                          <span className="font-mono bg-zinc-200/70 dark:bg-zinc-700/70 px-1.5 py-0.5 rounded text-[10px]">
                            {emp.employeeCode}
                          </span>
                        )}
                        <span>{emp?.jobTitle || 'Employee'}</span>
                        {emp?.department?.name && (
                          <span>• {emp.department.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      st === 'APPROVED'
                        ? 'success'
                        : st === 'PENDING'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {previewLeave.status || 'Pending'}
                  </Badge>
                </div>

                {/* Holiday Stats Balance Card (Only visible to managers or when viewing user's own request) */}
                {(!isEmployeeUser || (currentEmployeeId && String(previewLeave.employeeId) === String(currentEmployeeId))) && (
                  <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/50 text-center">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Total Allowance</span>
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{stats.allowance} days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Taken / Used</span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{stats.used} days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Remaining</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.remaining} days</span>
                    </div>
                  </div>
                )}

                {/* Leave Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">Leave Type</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mt-0.5 block">
                      {previewLeave.leaveType || 'Annual Leave'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">Total Days</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mt-0.5 block">
                      {previewLeave.totalDays || previewLeave.days || 1} day(s)
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">Start Date</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs mt-0.5 block">
                      {previewLeave.startDate || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">End Date</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs mt-0.5 block">
                      {previewLeave.endDate || '-'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">Reason / Details</span>
                    <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700/60 whitespace-pre-wrap">
                      {previewLeave.reason || 'No additional notes provided.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold block">Approved / Handled By</span>
                    <span className="text-zinc-700 dark:text-zinc-300 text-xs mt-0.5 block">
                      {previewLeave.approvedBy || 'Pending decision'}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {st === 'PENDING' && canApproveLeave && (
                      <>
                        <button
                          onClick={() => {
                            handleQuickStatus(previewLeave.id, 'Approved');
                            setPreviewLeave(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => {
                            handleQuickStatus(previewLeave.id, 'Rejected');
                            setPreviewLeave(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition"
                        >
                          Reject Request
                        </button>
                      </>
                    )}
                    {canEditLeave && (
                      <button
                        onClick={() => {
                          const target = previewLeave;
                          setPreviewLeave(null);
                          openEditTab(target);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        Edit Leave
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setPreviewLeave(null)}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
