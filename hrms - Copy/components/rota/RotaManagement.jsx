'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CalendarClock,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  FileText,
  AlertCircle,
  Timer,
  Check,
  X,
  Coffee,
  LayoutGrid,
  CalendarDays,
  User,
  Search,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Card, Badge, Modal } from '../ui';
import { useAuth } from '@/context/AuthContext';

const SHIFT_PRESETS = {
  Early: { start: '09:00', end: '17:00', breakMin: 60, label: 'Early (09:00 - 17:00)' },
  Late: { start: '15:00', end: '23:00', breakMin: 60, label: 'Late (15:00 - 23:00)' },
  Day: { start: '10:00', end: '18:00', breakMin: 60, label: 'Day (10:00 - 18:00)' },
  Night: { start: '23:00', end: '07:00', breakMin: 60, label: 'Night (23:00 - 07:00)' },
  Custom: { start: '09:00', end: '17:00', breakMin: 30, label: 'Custom' },
};

function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d || 1);
  }
  return new Date(dateStr);
}

function formatLocalDate(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? parseLocalDate(d) : d;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonday(d) {
  const date = parseLocalDate(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return formatLocalDate(date);
}

function getCurrentMonthString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function calculateHours(start, end, breakMin = 0) {
  if (!start || !end) return 0;
  const [sH, sM] = start.split(':').map(Number);
  const [eH, eM] = end.split(':').map(Number);
  let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
  if (totalMin < 0) totalMin += 24 * 60; // Overnight shift
  totalMin -= (Number(breakMin) || 0);
  if (totalMin < 0) totalMin = 0;
  return parseFloat((totalMin / 60).toFixed(2));
}

function getDayName(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export default function RotaManagement({ employees = [] }) {
  const { user, canEdit, canDelete, hasPermission } = useAuth();
  const canEditRota = canEdit('rota');
  const canDeleteRota = canDelete('rota');
  const isEmployeeUser = user?.roleName === 'Employee' || (!canEditRota && !hasPermission('EDIT_ROTA'));
  const currentEmployeeId = user?.employeeId;

  const currentEmp = useMemo(
    () => employees.find((e) => String(e.id) === String(currentEmployeeId)),
    [employees, currentEmployeeId]
  );

  const selectableEmployees = useMemo(() => {
    return employees;
  }, [employees]);

  const canManageTimesheets = !isEmployeeUser && (canEditRota || hasPermission('EDIT_ROTA'));

  // Top Navigation Tab: 'table' (Weekly Rota Table) | 'calendar' (Calendar Rota) | 'timesheets'
  const [activeTab, setActiveTab] = useState('table');

  // Calendar Sub-Mode: 'matrix' (Team Weekly Matrix) | 'month' (Individual Employee Month View)
  const [calendarMode, setCalendarMode] = useState('matrix');
  const [selectedCalendarEmployeeId, setSelectedCalendarEmployeeId] = useState(
    (isEmployeeUser && currentEmployeeId) ? currentEmployeeId : ''
  );
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthString);

  // Common dates and filters
  const [weekCommencing, setWeekCommencing] = useState(() => getMonday(new Date()));
  const [matrixDepartmentFilter, setMatrixDepartmentFilter] = useState('ALL');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState('');

  // Data states
  const [shifts, setShifts] = useState([]);
  const [monthShifts, setMonthShifts] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Default to today's local date
  const todayLocalDate = formatLocalDate(new Date());

  // Interactive Shift Modal (View / Add / Update / Delete)
  const [shiftModal, setShiftModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    id: null,
    employeeId: (isEmployeeUser && currentEmployeeId) ? currentEmployeeId : '',
    shiftDate: todayLocalDate,
    shiftType: 'Early',
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 60,
    notes: '',
  });

  // Table Quick-entry form for Rota Shift
  const [shiftForm, setShiftForm] = useState({
    employeeId: (isEmployeeUser && currentEmployeeId) ? currentEmployeeId : '',
    shiftDate: todayLocalDate,
    shiftType: 'Early',
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 60,
    notes: '',
  });

  // Quick-entry form for Timesheet
  const [timesheetForm, setTimesheetForm] = useState({
    employeeId: (isEmployeeUser && currentEmployeeId) ? currentEmployeeId : '',
    workDate: todayLocalDate,
    clockIn: '09:00',
    clockOut: '17:00',
    breakMinutes: 60,
    notes: '',
  });

  // Edit Timesheet Modal
  const [editingTimesheet, setEditingTimesheet] = useState(null);

  // Default active employee fallback
  const defaultEmployeeId = employees[0]?.id || '';
  const currentSelectedEmpId = selectedCalendarEmployeeId || defaultEmployeeId;
  const currentShiftEmployeeId = shiftForm.employeeId || defaultEmployeeId;
  const currentTimesheetEmployeeId = timesheetForm.employeeId || defaultEmployeeId;

  useEffect(() => {
    if (!selectedCalendarEmployeeId && employees.length > 0) {
      setSelectedCalendarEmployeeId(employees[0].id);
    }
  }, [employees, selectedCalendarEmployeeId]);

  // Fetch shifts for the selected week (for table & matrix view)
  const fetchWeekShifts = useCallback(async () => {
    try {
      const res = await fetch(`/api/rota/shifts?week=${weekCommencing}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setShifts(data.shifts || []);
      }
    } catch (err) {
      console.error('Fetch week shifts error:', err);
    }
  }, [weekCommencing]);

  // Fetch shifts for month view (for individual employee month calendar)
  const fetchMonthShifts = useCallback(async () => {
    if (!currentSelectedEmpId) return;
    try {
      const res = await fetch(`/api/rota/shifts?month=${activeMonth}&employeeId=${currentSelectedEmpId}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setMonthShifts(data.shifts || []);
      }
    } catch (err) {
      console.error('Fetch month shifts error:', err);
    }
  }, [activeMonth, currentSelectedEmpId]);

  // Fetch timesheets
  const fetchTimesheets = useCallback(async () => {
    try {
      let url = `/api/rota/timesheets?week=${weekCommencing}&_t=${Date.now()}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setTimesheets(data.timesheets || []);
      }
    } catch (err) {
      console.error('Fetch timesheets error:', err);
    }
  }, [weekCommencing, statusFilter]);

  // Primary data synchronization effect without cascading renders
  useEffect(() => {
    let isCancelled = false;
    Promise.resolve().then(() => {
      if (!isCancelled) setLoading(true);
    });

    const timestamp = Date.now();
    const promises = [];
    if (activeTab === 'table' || (activeTab === 'calendar' && calendarMode === 'matrix')) {
      promises.push(
        fetch(`/api/rota/shifts?week=${weekCommencing}&_t=${timestamp}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
          .then((r) => r.json())
          .then((d) => {
            if (!isCancelled && d.success) setShifts(d.shifts || []);
          })
      );
    }

    if (activeTab === 'calendar' && calendarMode === 'month' && currentSelectedEmpId) {
      promises.push(
        fetch(`/api/rota/shifts?month=${activeMonth}&employeeId=${currentSelectedEmpId}&_t=${timestamp}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
          .then((r) => r.json())
          .then((d) => {
            if (!isCancelled && d.success) setMonthShifts(d.shifts || []);
          })
      );
    }

    if (activeTab === 'timesheets') {
      let url = `/api/rota/timesheets?week=${weekCommencing}&_t=${timestamp}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      promises.push(
        fetch(url, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
          .then((r) => r.json())
          .then((d) => {
            if (!isCancelled && d.success) setTimesheets(d.timesheets || []);
          })
      );
    }

    Promise.all(promises)
      .catch((err) => {
        if (!isCancelled) console.error('Data loading error:', err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeTab, calendarMode, weekCommencing, activeMonth, currentSelectedEmpId, statusFilter]);

  // Week navigation helpers
  const handlePrevWeek = () => {
    const cur = parseLocalDate(weekCommencing);
    cur.setDate(cur.getDate() - 7);
    const prev = formatLocalDate(cur);
    setWeekCommencing(prev);
    setShiftForm((f) => ({ ...f, shiftDate: prev }));
    setTimesheetForm((f) => ({ ...f, workDate: prev }));
  };

  const handleNextWeek = () => {
    const cur = parseLocalDate(weekCommencing);
    cur.setDate(cur.getDate() + 7);
    const next = formatLocalDate(cur);
    setWeekCommencing(next);
    setShiftForm((f) => ({ ...f, shiftDate: next }));
    setTimesheetForm((f) => ({ ...f, workDate: next }));
  };

  const handleCurrentWeek = () => {
    const curMonday = getMonday(new Date());
    const curToday = formatLocalDate(new Date());
    setWeekCommencing(curMonday);
    setShiftForm((f) => ({ ...f, shiftDate: curToday }));
    setTimesheetForm((f) => ({ ...f, workDate: curToday }));
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [y, m] = activeMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const newMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    setActiveMonth(newMonthStr);
  };

  const handleNextMonth = () => {
    const [y, m] = activeMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    const newMonthStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
    setActiveMonth(newMonthStr);
  };

  const handleCurrentMonth = () => {
    setActiveMonth(getCurrentMonthString());
  };

  // Format month label display (e.g. "October 2026")
  const activeMonthDisplay = useMemo(() => {
    const [y, m] = activeMonth.split('-').map(Number);
    const date = new Date(y, m - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [activeMonth]);

  // Compute 7 days of the active week for the Team Matrix View
  const weekDays = useMemo(() => {
    const days = [];
    const start = parseLocalDate(weekCommencing);
    const todayStr = formatLocalDate(new Date());

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = formatLocalDate(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const [y, m, dayNum] = dateStr.split('-');
      days.push({
        dateStr,
        dayName,
        fullDayName,
        dayNum,
        displayLabel: `${dayNum}/${m}`,
        isToday: dateStr === todayStr,
      });
    }
    return days;
  }, [weekCommencing]);

  // Compute 35-42 days grid for the Monthly Calendar View
  const monthGridDays = useMemo(() => {
    const [year, monthNum] = activeMonth.split('-').map(Number);
    const firstDayOfMonth = new Date(year, monthNum - 1, 1);
    const lastDayOfMonth = new Date(year, monthNum, 0);
    const todayStr = formatLocalDate(new Date());

    // Align to Monday
    const startDay = new Date(firstDayOfMonth);
    const dayOfWeek = startDay.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDay.setDate(startDay.getDate() + diffToMonday);

    const days = [];
    const current = new Date(startDay);
    while (days.length < 35 || (days.length < 42 && current <= lastDayOfMonth)) {
      const dateStr = formatLocalDate(current);
      const isCurrentMonth = current.getMonth() === monthNum - 1;
      const dayNum = current.getDate();
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth,
        isToday: dateStr === todayStr,
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [activeMonth]);

  // Filter employees for the Team Matrix
  const filteredMatrixEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept =
        matrixDepartmentFilter === 'ALL' ||
        String(emp.departmentId || emp.department_id) === String(matrixDepartmentFilter) ||
        emp.department?.name?.toLowerCase().includes(matrixDepartmentFilter.toLowerCase());

      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const code = (emp.employeeCode || '').toLowerCase();
      const matchesSearch =
        !matrixSearchQuery.trim() ||
        fullName.includes(matrixSearchQuery.toLowerCase()) ||
        code.includes(matrixSearchQuery.toLowerCase());

      return matchesDept && matchesSearch;
    });
  }, [employees, matrixDepartmentFilter, matrixSearchQuery]);

  // Open Shift Modal for Add or Edit or View
  const openShiftModalForAdd = (employeeId, dateStr) => {
    if (!canEditRota || isEmployeeUser) return;
    const empId = employeeId || currentSelectedEmpId;
    const date = dateStr || formatLocalDate(new Date());
    setShiftModal({
      isOpen: true,
      mode: 'add',
      id: null,
      employeeId: empId,
      shiftDate: date,
      shiftType: 'Early',
      startTime: '09:00',
      endTime: '17:00',
      breakMinutes: 60,
      notes: '',
    });
  };

  const openShiftModalForEdit = (shift) => {
    setShiftModal({
      isOpen: true,
      mode: (canEditRota && !isEmployeeUser) ? 'edit' : 'view',
      id: shift.id,
      employeeId: shift.employeeId,
      shiftDate: shift.shiftDate,
      shiftType: shift.shiftType || 'Early',
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakMinutes: shift.breakMinutes || 0,
      notes: shift.notes || '',
    });
  };

  const handlePresetSelectInModal = (type) => {
    const preset = SHIFT_PRESETS[type] || SHIFT_PRESETS.Custom;
    setShiftModal((prev) => ({
      ...prev,
      shiftType: type,
      startTime: preset.start,
      endTime: preset.end,
      breakMinutes: preset.breakMin,
    }));
  };

  // Submit Shift Modal (Create or Update)
  const handleSaveShiftModal = async (e) => {
    e.preventDefault();
    if (shiftModal.mode === 'view' || !canEditRota || isEmployeeUser) {
      setShiftModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }
    if (!shiftModal.employeeId || !shiftModal.shiftDate) {
      alert('Please specify employee and shift date');
      return;
    }

    try {
      const isEdit = shiftModal.mode === 'edit';
      const endpoint = isEdit ? `/api/rota/shifts/${shiftModal.id}` : '/api/rota/shifts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: shiftModal.employeeId,
          shiftDate: shiftModal.shiftDate,
          shiftType: shiftModal.shiftType,
          startTime: shiftModal.startTime,
          endTime: shiftModal.endTime,
          breakMinutes: shiftModal.breakMinutes,
          notes: shiftModal.notes,
        }),
      });

      const data = await res.json();
      if (data.success && data.shift) {
        const savedShift = data.shift;
        setShiftModal((prev) => ({ ...prev, isOpen: false }));

        // Real-time optimistic update
        setShifts((prev) => {
          const exists = prev.some((s) => Number(s.id) === Number(savedShift.id));
          if (exists) return prev.map((s) => (Number(s.id) === Number(savedShift.id) ? savedShift : s));
          return [...prev, savedShift].sort((a, b) =>
            a.shiftDate.localeCompare(b.shiftDate) || (Number(a.id) - Number(b.id))
          );
        });
        setMonthShifts((prev) => {
          const exists = prev.some((s) => Number(s.id) === Number(savedShift.id));
          if (exists) return prev.map((s) => (Number(s.id) === Number(savedShift.id) ? savedShift : s));
          return [...prev, savedShift].sort((a, b) =>
            a.shiftDate.localeCompare(b.shiftDate) || (Number(a.id) - Number(b.id))
          );
        });

        // Ensure week aligns if shift was scheduled for a different week
        const shiftMonday = getMonday(savedShift.shiftDate);
        if (shiftMonday !== weekCommencing) {
          setWeekCommencing(shiftMonday);
        }

        // Background server re-sync
        fetchWeekShifts();
        fetchMonthShifts();
      } else {
        alert('Operation failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error saving shift: ' + err.message);
    }
  };

  // Delete shift from modal or grid
  const handleDeleteShift = async (id) => {
    if (!canDeleteRota || isEmployeeUser) {
      alert('You do not have permission to delete shifts.');
      return;
    }
    if (!confirm('Are you sure you want to remove this shift from the rota?')) return;
    try {
      const res = await fetch(`/api/rota/shifts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setShiftModal((prev) => ({ ...prev, isOpen: false }));
        setShifts((prev) => prev.filter((s) => s.id !== id));
        setMonthShifts((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Error deleting shift: ' + err.message);
    }
  };

  // Table Add Shift Handler
  const handleAddShiftFromTable = async (e) => {
    e.preventDefault();
    if (!canEditRota || isEmployeeUser) {
      alert('You do not have permission to schedule shifts.');
      return;
    }
    const empId = shiftForm.employeeId || defaultEmployeeId;
    const shiftDate = shiftForm.shiftDate || formatLocalDate(new Date());
    if (!empId || !shiftDate) {
      alert('Please select an employee and shift date');
      return;
    }

    try {
      const res = await fetch('/api/rota/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shiftForm,
          employeeId: empId,
          shiftDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.shift) {
        const newShift = data.shift;

        // Real-time optimistic update
        setShifts((prev) => {
          const exists = prev.some((s) => Number(s.id) === Number(newShift.id));
          if (exists) return prev.map((s) => (Number(s.id) === Number(newShift.id) ? newShift : s));
          return [...prev, newShift].sort((a, b) =>
            a.shiftDate.localeCompare(b.shiftDate) || (Number(a.id) - Number(b.id))
          );
        });
        setMonthShifts((prev) => {
          const exists = prev.some((s) => Number(s.id) === Number(newShift.id));
          if (exists) return prev.map((s) => (Number(s.id) === Number(newShift.id) ? newShift : s));
          return [...prev, newShift].sort((a, b) =>
            a.shiftDate.localeCompare(b.shiftDate) || (Number(a.id) - Number(b.id))
          );
        });

        // Ensure week aligns if shift was scheduled for another week
        const shiftMonday = getMonday(shiftDate);
        if (shiftMonday !== weekCommencing) {
          setWeekCommencing(shiftMonday);
        }

        setShiftForm((prev) => ({ ...prev, notes: '' }));
        // Background sync
        fetchWeekShifts();
      } else {
        alert('Failed to add shift: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error creating shift: ' + err.message);
    }
  };

  // Add Timesheet Handler
  const handleAddTimesheet = async (e) => {
    e.preventDefault();
    if (!canEditRota || isEmployeeUser) {
      alert('You do not have permission to add timesheets.');
      return;
    }
    const empId = timesheetForm.employeeId || defaultEmployeeId;
    const workDate = timesheetForm.workDate || formatLocalDate(new Date());
    if (!empId || !workDate) {
      alert('Please select an employee and work date');
      return;
    }

    try {
      const res = await fetch('/api/rota/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...timesheetForm,
          employeeId: empId,
          workDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.timesheet) {
        const newTimesheet = data.timesheet;

        // Real-time optimistic update
        setTimesheets((prev) => {
          const exists = prev.some((t) => t.id === newTimesheet.id);
          if (exists) return prev.map((t) => (t.id === newTimesheet.id ? newTimesheet : t));
          return [newTimesheet, ...prev];
        });

        // Ensure week aligns if timesheet was recorded for another week
        const workMonday = getMonday(workDate);
        if (workMonday !== weekCommencing) {
          setWeekCommencing(workMonday);
        }

        setTimesheetForm((prev) => ({ ...prev, notes: '' }));
        // Background sync
        fetchTimesheets();
      } else {
        alert('Failed to add timesheet: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error creating timesheet: ' + err.message);
    }
  };

  // Timesheet Status Approval
  const handleSetApprovalStatus = async (id, status) => {
    // Real-time optimistic update
    setTimesheets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalStatus: status } : t))
    );

    try {
      const res = await fetch(`/api/rota/timesheets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: status }),
      });
      const data = await res.json();
      if (data.success && data.timesheet) {
        setTimesheets((prev) =>
          prev.map((t) => (t.id === id ? data.timesheet : t))
        );
      } else if (!data.success) {
        alert('Failed to update status: ' + data.error);
        fetchTimesheets();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
      fetchTimesheets();
    }
  };

  const handleDeleteTimesheet = async (id) => {
    if (!canManageTimesheets || isEmployeeUser) {
      alert('You do not have permission to delete timesheets.');
      return;
    }
    if (!confirm('Are you sure you want to delete this timesheet entry?')) return;
    try {
      const res = await fetch(`/api/rota/timesheets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTimesheets((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Error deleting timesheet: ' + err.message);
    }
  };

  const handleUpdateTimesheet = async (e) => {
    e.preventDefault();
    if (!editingTimesheet || !canManageTimesheets || isEmployeeUser) {
      setEditingTimesheet(null);
      return;
    }
    try {
      const res = await fetch(`/api/rota/timesheets/${editingTimesheet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTimesheet),
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.timesheet || editingTimesheet;
        setTimesheets((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setEditingTimesheet(null);
        fetchTimesheets();
      } else {
        alert('Failed to update timesheet: ' + data.error);
      }
    } catch (err) {
      alert('Error updating timesheet: ' + err.message);
    }
  };

  const displayShifts = useMemo(() => {
    return shifts;
  }, [shifts]);

  const displayTimesheets = useMemo(() => {
    return timesheets;
  }, [timesheets]);

  // KPIs
  const totalPlannedHours = useMemo(() => {
    return displayShifts.reduce((acc, s) => acc + (parseFloat(s.plannedHours) || 0), 0);
  }, [displayShifts]);

  const totalPaidHours = useMemo(() => {
    return displayTimesheets.reduce((acc, t) => acc + (parseFloat(t.paidHours) || 0), 0);
  }, [displayTimesheets]);

  const pendingTimesheetsCount = useMemo(() => {
    return displayTimesheets.filter((t) => t.approvalStatus === 'Pending').length;
  }, [displayTimesheets]);

  const modalPlannedHours = calculateHours(
    shiftModal.startTime,
    shiftModal.endTime,
    shiftModal.breakMinutes
  );

  const shiftFormPlannedHours = calculateHours(
    shiftForm.startTime,
    shiftForm.endTime,
    shiftForm.breakMinutes
  );

  const timesheetFormPaidHours = calculateHours(
    timesheetForm.clockIn,
    timesheetForm.clockOut,
    timesheetForm.breakMinutes
  );

  // Helper mapping: get shift color classes based on shift type
  const getShiftBadgeStyles = (type) => {
    switch (type) {
      case 'Early':
        return 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100';
      case 'Late':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100';
      case 'Night':
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100';
      case 'Day':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & KPI Cards */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <span>Employee Rota & Timesheets</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {`${employees.length} ${employees.length === 1 ? 'Employee' : 'Employees'}`}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Interactive calendar rota, weekly team matrix, shift scheduling, and staff timesheets
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation Header (Table vs Calendar vs Timesheets) */}
          <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Weekly Table</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                {displayShifts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar Rota</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                New
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timesheets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'timesheets'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timesheets</span>
              {pendingTimesheetsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
                  {pendingTimesheetsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <span className="text-zinc-500 text-[11px] font-medium">Scheduled Shifts</span>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-0.5">
              {displayShifts.length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-zinc-500 text-[11px] font-medium">Total Planned Hours</span>
            <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">
              {totalPlannedHours.toFixed(2)}h
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-zinc-500 text-[11px] font-medium">Timesheet Paid Hours</span>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
              {totalPaidHours.toFixed(2)}h
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
            <span className="text-zinc-500 text-[11px] font-medium">Pending Approvals</span>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5">
              {pendingTimesheetsCount}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CALENDAR ROTA SYSTEM (VIEW MODE: DUAL TEAM MATRIX & MONTH VIEW)         */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Calendar Toolbar */}
          <Card>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
              {/* Dual View Mode Selector */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-zinc-500 text-xs">Calendar Mode:</span>
                <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => setCalendarMode('matrix')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                      calendarMode === 'matrix'
                        ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Team Schedule Matrix (Weekly)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarMode('month')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                      calendarMode === 'month'
                        ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Individual Month Calendar</span>
                  </button>
                </div>
              </div>

              {/* Mode-Specific Navigation Controls */}
              {calendarMode === 'matrix' ? (
                /* Matrix Navigation: Prev / Next Week */
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-1 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={handlePrevWeek}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                      title="Previous week"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="font-mono font-semibold px-2 text-zinc-800 dark:text-zinc-200">
                      Week of {formatDateDisplay(weekCommencing)}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextWeek}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                      title="Next week"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCurrentWeek}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300 transition"
                  >
                    Current Week
                  </button>

                  {/* Add Shift Button */}
                  {canEditRota && !isEmployeeUser && (
                    <button
                      type="button"
                      onClick={() => openShiftModalForAdd()}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Shift</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Month Navigation: Employee Selector & Prev / Next Month */
                <div className="flex flex-wrap items-center gap-2">
                  {/* Select Employee */}
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <select
                      value={currentSelectedEmpId}
                      onChange={(e) => setSelectedCalendarEmployeeId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {selectableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.employeeCode ? `${emp.employeeCode} - ` : ''}{emp.firstName} {emp.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Switcher */}
                  <div className="flex items-center space-x-1 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                      title="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="font-semibold px-2 text-zinc-800 dark:text-zinc-200 min-w-[110px] text-center">
                      {activeMonthDisplay}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                      title="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCurrentMonth}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300 transition"
                  >
                    This Month
                  </button>

                  {canEditRota && !isEmployeeUser && (
                    <button
                      type="button"
                      onClick={() => openShiftModalForAdd(currentSelectedEmpId, activeMonth === getCurrentMonthString() ? formatLocalDate(new Date()) : `${activeMonth}-01`)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Schedule Shift</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* CALENDAR VIEW MODE 1: TEAM SCHEDULE MATRIX */}
          {calendarMode === 'matrix' && (
            <Card>
              <div className="space-y-3">
                {/* Search & Filter row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Team Rota Matrix:
                    </span>
                    <span className="text-zinc-400">
                      Click any shift to update/delete, or click <strong className="text-blue-600">+</strong> on an empty day to schedule.
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative w-48">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={matrixSearchQuery}
                        onChange={(e) => setMatrixSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Matrix Grid Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                        <th className="py-3 px-3.5 w-60 sticky left-0 z-10 bg-zinc-50/95 dark:bg-zinc-800/95 backdrop-blur-xs">
                          Employee ({filteredMatrixEmployees.length})
                        </th>
                        {weekDays.map((day) => (
                          <th
                            key={day.dateStr}
                            className={`py-2.5 px-3 min-w-[130px] text-center border-l border-zinc-200/60 dark:border-zinc-800 ${
                              day.isToday
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                                : ''
                            }`}
                          >
                            <div className="font-bold">{day.fullDayName}</div>
                            <div className={`text-[10px] font-mono mt-0.5 ${day.isToday ? 'font-bold' : 'text-zinc-400'}`}>
                              {day.displayLabel}
                            </div>
                          </th>
                        ))}
                        <th className="py-3 px-3 text-center border-l border-zinc-200/60 dark:border-zinc-800 w-24">
                          Weekly Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                      {filteredMatrixEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-zinc-400">
                            No employees match your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredMatrixEmployees.map((emp) => {
                          // Get all shifts for this employee in this week
                          const empShifts = shifts.filter((s) => Number(s.employeeId) === Number(emp.id));
                          const empTotalHours = empShifts.reduce((acc, s) => acc + (parseFloat(s.plannedHours) || 0), 0);

                          return (
                            <tr key={emp.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                              {/* Employee Profile Cell (Sticky Left) */}
                              <td className="py-2.5 px-3.5 sticky left-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs border-r border-zinc-100 dark:border-zinc-800/80 shadow-xs">
                                <div className="flex items-center space-x-2.5">
                                  {emp.photoUrl ? (
                                    <img
                                      src={emp.photoUrl}
                                      alt=""
                                      className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                                      {emp.firstName?.[0] || 'E'}
                                    </div>
                                  )}
                                  <div className="truncate">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                      {emp.firstName} {emp.lastName}
                                    </p>
                                    <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 mt-0.5">
                                      <span className="font-mono text-blue-600 dark:text-blue-400">
                                        {emp.employeeCode || `EMP${String(emp.id).padStart(3, '0')}`}
                                      </span>
                                      {emp.department?.name && (
                                        <>
                                          <span>•</span>
                                          <span className="truncate max-w-[80px]">{emp.department.name}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 7 Days Matrix Columns */}
                              {weekDays.map((day) => {
                                const dayShifts = empShifts.filter((s) => s.shiftDate === day.dateStr);

                                return (
                                  <td
                                    key={day.dateStr}
                                    className={`py-2 px-2.5 border-l border-zinc-100 dark:border-zinc-800/60 align-top relative group/cell ${
                                      day.isToday ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                                    }`}
                                  >
                                    {dayShifts.length > 0 ? (
                                      <div className="space-y-1.5">
                                        {dayShifts.map((dayShift) => (
                                          <div
                                            key={dayShift.id}
                                            onClick={() => openShiftModalForEdit(dayShift)}
                                            className={`p-2 rounded-xl border transition cursor-pointer shadow-2xs group/card relative ${getShiftBadgeStyles(
                                              dayShift.shiftType
                                            )}`}
                                            title={dayShift.notes ? `Notes: ${dayShift.notes}` : canEditRota && !isEmployeeUser ? 'Click to edit shift' : 'Click to view shift details'}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-bold text-[10px] tracking-wide uppercase">
                                                {dayShift.shiftType}
                                              </span>
                                              <span className="font-mono font-bold text-[10px]">
                                                {parseFloat(dayShift.plannedHours).toFixed(1)}h
                                              </span>
                                            </div>

                                            <div className="text-[11px] font-mono font-bold mt-1">
                                              {dayShift.startTime} - {dayShift.endTime}
                                            </div>

                                            {dayShift.breakMinutes > 0 && (
                                              <div className="text-[9px] opacity-75 mt-0.5">
                                                {dayShift.breakMinutes}m break
                                              </div>
                                            )}

                                            {/* Hover Quick Edit Icon */}
                                            {canEditRota && !isEmployeeUser && (
                                              <div className="absolute top-1 right-1 opacity-0 group-hover/card:opacity-100 transition p-0.5 rounded bg-white/80 dark:bg-black/60 shadow">
                                                <Edit2 className="w-2.5 h-2.5" />
                                              </div>
                                            )}
                                          </div>
                                        ))}

                                        {/* Add Another Shift Button on Day */}
                                        {canEditRota && !isEmployeeUser && (
                                          <button
                                            type="button"
                                            onClick={() => openShiftModalForAdd(emp.id, day.dateStr)}
                                            className="w-full py-1 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50/40 text-[10px] text-zinc-400 hover:text-blue-600 font-semibold flex items-center justify-center space-x-1 transition"
                                            title={`Add another shift for ${emp.firstName}`}
                                          >
                                            <Plus className="w-2.5 h-2.5" />
                                            <span>Add Shift</span>
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      /* Empty Slot */
                                      canEditRota && !isEmployeeUser ? (
                                        <div
                                          onClick={() => openShiftModalForAdd(emp.id, day.dateStr)}
                                          className="h-16 rounded-xl border border-dashed border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition flex items-center justify-center cursor-pointer group/add"
                                          title={`Schedule shift for ${emp.firstName} on ${day.dayName}`}
                                        >
                                          <span className="text-[11px] text-zinc-400 opacity-0 group-hover/add:opacity-100 transition font-semibold flex items-center space-x-1">
                                            <Plus className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="text-blue-600 font-bold">Add</span>
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="h-16 flex items-center justify-center text-zinc-300 dark:text-zinc-700 text-[10px]">
                                          —
                                        </div>
                                      )
                                    )}
                                  </td>
                                );
                              })}

                              {/* Weekly Total Hours Column */}
                              <td className="py-2.5 px-3 text-center border-l border-zinc-100 dark:border-zinc-800/80">
                                <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                                  {empTotalHours.toFixed(1)}h
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>

                    {/* Matrix Summary Row */}
                    <tfoot>
                      <tr className="border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 text-[11px] font-bold">
                        <td className="py-3 px-3.5 text-zinc-600 dark:text-zinc-300 sticky left-0 z-10 bg-zinc-50 dark:bg-zinc-800">
                          Total Planned Hours:
                        </td>
                        {weekDays.map((day) => {
                          const dayTotal = shifts
                            .filter((s) => s.shiftDate === day.dateStr)
                            .reduce((acc, s) => acc + (parseFloat(s.plannedHours) || 0), 0);

                          return (
                            <td key={day.dateStr} className="py-3 px-3 text-center font-mono text-zinc-700 dark:text-zinc-300">
                              {dayTotal > 0 ? (
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  {dayTotal.toFixed(1)}h
                                </span>
                              ) : (
                                <span className="text-zinc-400">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {totalPlannedHours.toFixed(1)}h
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* CALENDAR VIEW MODE 2: INDIVIDUAL EMPLOYEE MONTH VIEW */}
          {calendarMode === 'month' && (
            <Card>
              <div className="space-y-4">
                {/* Employee Month Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const emp = employees.find((e) => Number(e.id) === Number(currentSelectedEmpId));
                      return (
                        <>
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                            {emp?.firstName?.[0] || 'E'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {emp ? `${emp.firstName} ${emp.lastName}` : 'Employee'}
                            </span>
                            <span className="ml-2 font-mono text-xs text-blue-600 dark:text-blue-400">
                              {emp?.employeeCode}
                            </span>
                            <span className="text-zinc-400 text-[11px] block">
                              Schedule for {activeMonthDisplay}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-zinc-500">
                      Total Shifts:{' '}
                      <strong className="text-zinc-800 dark:text-zinc-200">{monthShifts.length}</strong>
                    </span>
                    <span className="text-zinc-500">
                      Monthly Planned Hours:{' '}
                      <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                        {monthShifts.reduce((acc, s) => acc + (parseFloat(s.plannedHours) || 0), 0).toFixed(1)}h
                      </strong>
                    </span>
                  </div>
                </div>

                {/* 7-Column Month Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-xs">
                  {/* Days of week header */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <div
                      key={d}
                      className="text-center font-bold text-[11px] py-1.5 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      {d}
                    </div>
                  ))}

                  {/* 35-42 Date Cells */}
                  {monthGridDays.map((day) => {
                    const dayShifts = monthShifts.filter((s) => s.shiftDate === day.dateStr);

                    return (
                      <div
                        key={day.dateStr}
                        onClick={() => {
                          if (canEditRota && !isEmployeeUser && dayShifts.length === 0) {
                            openShiftModalForAdd(currentSelectedEmpId, day.dateStr);
                          }
                        }}
                        className={`min-h-[105px] p-2 rounded-xl border transition flex flex-col justify-between group relative ${dayShifts.length === 0 && (!canEditRota || isEmployeeUser) ? 'cursor-default' : 'cursor-pointer'} ${
                          day.isToday
                            ? 'border-blue-500/80 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500/50'
                            : day.isCurrentMonth
                            ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                            : 'border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/40 opacity-40 hover:opacity-80'
                        }`}
                      >
                        {/* Top: Day Number & Today indicator */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              day.isToday
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {day.dayNum}
                          </span>

                          {/* Quick Add icon on hover */}
                          {canEditRota && !isEmployeeUser && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openShiftModalForAdd(currentSelectedEmpId, day.dateStr);
                              }}
                              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition"
                              title="Add shift on this date"
                            >
                              <Plus className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                          )}
                        </div>

                        {/* Middle: Shift Cards for this day */}
                        <div className="space-y-1 my-1">
                          {dayShifts.map((shift) => (
                            <div
                              key={shift.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openShiftModalForEdit(shift);
                              }}
                              className={`p-1.5 rounded-lg border text-[10px] font-medium transition cursor-pointer shadow-2xs hover:scale-101 ${getShiftBadgeStyles(
                                shift.shiftType
                              )}`}
                              title={canEditRota && !isEmployeeUser ? 'Click to edit or delete' : 'Click to view shift details'}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span>{shift.shiftType}</span>
                                <span className="font-mono">{parseFloat(shift.plannedHours).toFixed(1)}h</span>
                              </div>
                              <div className="font-mono text-[9px] mt-0.5">
                                {shift.startTime} - {shift.endTime}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom: Empty Day indicator */}
                        {dayShifts.length === 0 && (
                          <div className="text-[10px] text-zinc-300 dark:text-zinc-600 italic">
                            No shift
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEEKLY TABLE & TIMESHEET CONTROLS (CLASSIC VIEW)                       */}
      {/* ========================================================================= */}
      {activeTab !== 'calendar' && (
        <Card>
          <div className="space-y-4">
            {/* Week Commencing Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Week commencing:
                </span>
                <input
                  type="date"
                  value={weekCommencing}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const monday = getMonday(val);
                      setWeekCommencing(monday);
                      const curMonday = getMonday(new Date());
                      const targetDate = monday === curMonday ? formatLocalDate(new Date()) : monday;
                      setShiftForm((f) => ({ ...f, shiftDate: targetDate }));
                      setTimesheetForm((f) => ({ ...f, workDate: targetDate }));
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePrevWeek}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
                    title="Previous week"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextWeek}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
                    title="Next week"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCurrentWeek}
                    className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition"
                  >
                    Current Week
                  </button>
                </div>

                <button
                  type="button"
                  onClick={activeTab === 'table' ? fetchWeekShifts : fetchTimesheets}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition"
                >
                  Load week
                </button>
              </div>

              {/* Status Filter for timesheet tab */}
              {activeTab === 'timesheets' && (
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-500">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quick-Entry Form 1: Weekly Rota (Table Mode) */}
            {canEditRota && !isEmployeeUser && activeTab === 'table' && (
              <form onSubmit={handleAddShiftFromTable} className="text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2.5 items-end">
                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Shift date
                    </label>
                    <input
                      type="date"
                      required
                      value={shiftForm.shiftDate || formatLocalDate(new Date())}
                      onChange={(e) => setShiftForm({ ...shiftForm, shiftDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Employee
                    </label>
                    <select
                      required
                      disabled={isEmployeeUser}
                      value={currentShiftEmployeeId}
                      onChange={(e) => setShiftForm({ ...shiftForm, employeeId: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none truncate disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {selectableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.employeeCode ? `${emp.employeeCode} - ` : ''}{emp.firstName} {emp.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Shift type
                    </label>
                    <select
                      value={shiftForm.shiftType}
                      onChange={(e) => {
                        const type = e.target.value;
                        const preset = SHIFT_PRESETS[type] || SHIFT_PRESETS.Custom;
                        setShiftForm({
                          ...shiftForm,
                          shiftType: type,
                          startTime: preset.start,
                          endTime: preset.end,
                          breakMinutes: preset.breakMin,
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Early">Early (09:00 - 17:00)</option>
                      <option value="Late">Late (15:00 - 23:00)</option>
                      <option value="Day">Day (10:00 - 18:00)</option>
                      <option value="Night">Night (23:00 - 07:00)</option>
                      <option value="Custom">Custom Shift</option>
                    </select>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Start (HH:mm)
                    </label>
                    <input
                      type="time"
                      required
                      value={shiftForm.startTime}
                      onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Finish (HH:mm)
                    </label>
                    <input
                      type="time"
                      required
                      value={shiftForm.endTime}
                      onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1 truncate">
                      Unpaid break (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={shiftForm.breakMinutes}
                      onChange={(e) => setShiftForm({ ...shiftForm, breakMinutes: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-1 flex items-center space-x-1.5">
                    <button
                      type="submit"
                      className="w-full px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add shift</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex-1 min-w-[200px] flex items-center space-x-2">
                    <span className="text-zinc-500 text-[11px]">Notes:</span>
                    <input
                      type="text"
                      placeholder="Optional shift notes..."
                      value={shiftForm.notes}
                      onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-200/60 dark:border-blue-900/40">
                    <Timer className="w-3 h-3" />
                    <span>Calculated Hours: {shiftFormPlannedHours.toFixed(2)}h</span>
                  </div>
                </div>
              </form>
            )}

            {/* Quick-Entry Form 2: Timesheets */}
            {canEditRota && !isEmployeeUser && activeTab === 'timesheets' && (
              <form onSubmit={handleAddTimesheet} className="text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2.5 items-end">
                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Work date
                    </label>
                    <input
                      type="date"
                      required
                      value={timesheetForm.workDate || formatLocalDate(new Date())}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, workDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Employee
                    </label>
                    <select
                      required
                      disabled={isEmployeeUser}
                      value={currentTimesheetEmployeeId}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, employeeId: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none truncate disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {selectableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.employeeCode ? `${emp.employeeCode} - ` : ''}{emp.firstName} {emp.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Clock in (HH:mm)
                    </label>
                    <input
                      type="time"
                      required
                      value={timesheetForm.clockIn}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, clockIn: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Clock out (HH:mm)
                    </label>
                    <input
                      type="time"
                      required
                      value={timesheetForm.clockOut}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, clockOut: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1 truncate">
                      Unpaid break (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={timesheetForm.breakMinutes}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, breakMinutes: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="lg:col-span-2 flex items-center space-x-1.5">
                    <button
                      type="submit"
                      className="w-full px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add timesheet</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex-1 min-w-[200px] flex items-center space-x-2">
                    <span className="text-zinc-500 text-[11px]">Notes:</span>
                    <input
                      type="text"
                      placeholder="Optional timesheet notes..."
                      value={timesheetForm.notes}
                      onChange={(e) => setTimesheetForm({ ...timesheetForm, notes: e.target.value })}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40">
                    <Timer className="w-3 h-3" />
                    <span>Paid Hours: {timesheetFormPaidHours.toFixed(2)}h</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN DATA TABLE (WEEKLY TABLE VIEW OR TIMESHEETS VIEW)                  */}
      {/* ========================================================================= */}
      {activeTab !== 'calendar' && (
        <Card>
          <div className="overflow-x-auto">
            {activeTab === 'table' ? (
              /* TAB 1: WEEKLY ROTA TABLE */
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-3">ShiftId</th>
                    <th className="py-3 px-3">EmployeeCode</th>
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">ShiftDate</th>
                    <th className="py-3 px-3">DayName</th>
                    <th className="py-3 px-3">StartTime</th>
                    <th className="py-3 px-3">EndTime</th>
                    <th className="py-3 px-3">BreakMinutes</th>
                    <th className="py-3 px-3">PlannedHours</th>
                    <th className="py-3 px-3">ShiftType</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="text-center py-12 text-zinc-400">
                        Loading shifts for week commencing {formatDateDisplay(weekCommencing)}...
                      </td>
                    </tr>
                  ) : displayShifts.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center py-12 text-zinc-400">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-xs">No shifts scheduled for this week</p>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Use the quick entry bar or switch to the Calendar Rota view.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayShifts.map((shift) => {
                      const emp = shift.employee;
                      return (
                        <tr
                          key={shift.id}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition group"
                        >
                          <td className="py-3 px-3 font-mono text-zinc-500 dark:text-zinc-400">
                            #{shift.id}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {emp?.employeeCode || `EMP${String(shift.employeeId).padStart(3, '0')}`}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              {emp?.photoUrl ? (
                                <img
                                  src={emp.photoUrl}
                                  alt=""
                                  className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                                  {emp?.firstName?.[0] || 'E'}
                                </div>
                              )}
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                {emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${shift.employeeId}`}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                            {formatDateDisplay(shift.shiftDate)}
                          </td>

                          <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-semibold">
                            {shift.dayName}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {shift.startTime}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-rose-600 dark:text-rose-400">
                            {shift.endTime}
                          </td>

                          <td className="py-3 px-3 text-zinc-500 font-mono">
                            {shift.breakMinutes}m
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {parseFloat(shift.plannedHours).toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                shift.shiftType === 'Early'
                                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                  : shift.shiftType === 'Late'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : shift.shiftType === 'Night'
                                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                              }`}
                            >
                              {shift.shiftType}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-zinc-500 max-w-[160px] truncate" title={shift.notes}>
                            {shift.notes || '—'}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {canEditRota && !isEmployeeUser ? (
                              <div className="flex items-center justify-end space-x-1 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={() => openShiftModalForEdit(shift)}
                                  className="p-1 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                  title="Edit shift"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteShift(shift.id)}
                                  className="p-1 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                  title="Delete shift"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  type="button"
                                  onClick={() => openShiftModalForEdit(shift)}
                                  className="p-1 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                  title="View shift details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              /* TAB 2: TIMESHEETS TABLE */
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-3">TimesheetId</th>
                    <th className="py-3 px-3">EmployeeCode</th>
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">WorkDate</th>
                    <th className="py-3 px-3">DayName</th>
                    <th className="py-3 px-3">ClockIn</th>
                    <th className="py-3 px-3">ClockOut</th>
                    <th className="py-3 px-3">BreakMinutes</th>
                    <th className="py-3 px-3">PaidHours</th>
                    <th className="py-3 px-3">ApprovalStatus</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="text-center py-12 text-zinc-400">
                        Loading timesheets for week commencing {formatDateDisplay(weekCommencing)}...
                      </td>
                    </tr>
                  ) : displayTimesheets.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center py-12 text-zinc-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-xs">No timesheets recorded for this week</p>
                        <p className="text-[11px] text-zinc-500 mt-1">Use the quick entry bar above to add timesheets.</p>
                      </td>
                    </tr>
                  ) : (
                    displayTimesheets.map((ts) => {
                      const emp = ts.employee;
                      return (
                        <tr
                          key={ts.id}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition group"
                        >
                          <td className="py-3 px-3 font-mono text-zinc-500 dark:text-zinc-400">
                            #{ts.id}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {emp?.employeeCode || `EMP${String(ts.employeeId).padStart(3, '0')}`}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              {emp?.photoUrl ? (
                                <img
                                  src={emp.photoUrl}
                                  alt=""
                                  className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                                  {emp?.firstName?.[0] || 'E'}
                                </div>
                              )}
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                {emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${ts.employeeId}`}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                            {formatDateDisplay(ts.workDate)}
                          </td>

                          <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-semibold">
                            {ts.dayName}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {ts.clockIn}
                          </td>

                          <td className="py-3 px-3 font-mono font-semibold text-rose-600 dark:text-rose-400">
                            {ts.clockOut}
                          </td>

                          <td className="py-3 px-3 text-zinc-500 font-mono">
                            {ts.breakMinutes}m
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {parseFloat(ts.paidHours).toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ts.approvalStatus === 'Approved'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : ts.approvalStatus === 'Rejected'
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              }`}
                            >
                              {ts.approvalStatus}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-zinc-500 max-w-[160px] truncate" title={ts.notes}>
                            {ts.notes || '—'}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {canManageTimesheets ? (
                              <div className="flex items-center justify-end space-x-1">
                                {ts.approvalStatus !== 'Approved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetApprovalStatus(ts.id, 'Approved')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition"
                                    title="Approve Timesheet"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {ts.approvalStatus !== 'Rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetApprovalStatus(ts.id, 'Rejected')}
                                    className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
                                    title="Reject Timesheet"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setEditingTimesheet(ts)}
                                  className="p-1 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                  title="Edit timesheet"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteTimesheet(ts.id)}
                                  className="p-1 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                  title="Delete timesheet"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-zinc-400 text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>
                Rota loaded for week commencing{' '}
                <strong className="text-zinc-700 dark:text-zinc-300 font-mono">
                  {formatDateDisplay(weekCommencing)}
                </strong>
                .
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span>
                Total shifts: <strong>{shifts.length}</strong>
              </span>
              <span>
                Planned hours: <strong>{totalPlannedHours.toFixed(2)}h</strong>
              </span>
              <span>
                Actual paid hours: <strong>{totalPaidHours.toFixed(2)}h</strong>
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SHIFT MODAL (CREATE / UPDATE / DELETE)                      */}
      {/* ========================================================================= */}
      {shiftModal.isOpen && (
        <Modal
          isOpen={shiftModal.isOpen}
          onClose={() => setShiftModal((prev) => ({ ...prev, isOpen: false }))}
          title={
            shiftModal.mode === 'view'
              ? 'Shift Details'
              : shiftModal.mode === 'edit'
              ? `Edit Shift #${shiftModal.id}`
              : 'Schedule Employee Shift'
          }
        >
          <form onSubmit={handleSaveShiftModal} className="space-y-4 text-xs">
            {/* Quick Presets Bar */}
            {shiftModal.mode !== 'view' && (
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Quick Shift Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(SHIFT_PRESETS).map((key) => {
                    const isPresetActive = shiftModal.shiftType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handlePresetSelectInModal(key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          isPresetActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {key} ({SHIFT_PRESETS[key].start}-{SHIFT_PRESETS[key].end})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Employee *
                </label>
                <select
                  required
                  disabled={shiftModal.mode === 'view' || isEmployeeUser}
                  value={shiftModal.employeeId}
                  onChange={(e) => setShiftModal({ ...shiftModal, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {selectableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeCode ? `${emp.employeeCode} - ` : ''}{emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Shift Date *
                </label>
                <input
                  type="date"
                  required
                  disabled={shiftModal.mode === 'view'}
                  value={shiftModal.shiftDate}
                  onChange={(e) => setShiftModal({ ...shiftModal, shiftDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Start Time (HH:mm) *
                </label>
                <input
                  type="time"
                  required
                  disabled={shiftModal.mode === 'view'}
                  value={shiftModal.startTime}
                  onChange={(e) => setShiftModal({ ...shiftModal, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Finish Time (HH:mm) *
                </label>
                <input
                  type="time"
                  required
                  disabled={shiftModal.mode === 'view'}
                  value={shiftModal.endTime}
                  onChange={(e) => setShiftModal({ ...shiftModal, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Unpaid Break (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  disabled={shiftModal.mode === 'view'}
                  value={shiftModal.breakMinutes}
                  onChange={(e) => setShiftModal({ ...shiftModal, breakMinutes: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center disabled:opacity-80 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Calculated Planned Hours
                </label>
                <div className="w-full px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 font-mono font-bold text-blue-700 dark:text-blue-300 text-center">
                  {modalPlannedHours.toFixed(2)} Hours
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Notes
              </label>
              <textarea
                rows={2}
                disabled={shiftModal.mode === 'view'}
                placeholder="Optional shift notes (station, prep, front of house)..."
                value={shiftModal.notes || ''}
                onChange={(e) => setShiftModal({ ...shiftModal, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              {shiftModal.mode === 'edit' && canDeleteRota && !isEmployeeUser ? (
                <button
                  type="button"
                  onClick={() => handleDeleteShift(shiftModal.id)}
                  className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Shift</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShiftModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  {shiftModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {shiftModal.mode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/20"
                  >
                    {shiftModal.mode === 'edit' ? 'Save Changes' : 'Schedule Shift'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 6. EDIT TIMESHEET MODAL                                                   */}
      {/* ========================================================================= */}
      {editingTimesheet && (
        <Modal
          isOpen={!!editingTimesheet}
          onClose={() => setEditingTimesheet(null)}
          title={`Edit Timesheet #${editingTimesheet.id}`}
        >
          <form onSubmit={handleUpdateTimesheet} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Employee
                </label>
                <select
                  disabled={isEmployeeUser}
                  value={editingTimesheet.employeeId}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {selectableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeCode ? `${emp.employeeCode} - ` : ''}{emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Work Date
                </label>
                <input
                  type="date"
                  value={editingTimesheet.workDate}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, workDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Clock In (HH:mm)
                </label>
                <input
                  type="time"
                  value={editingTimesheet.clockIn}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, clockIn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Clock Out (HH:mm)
                </label>
                <input
                  type="time"
                  value={editingTimesheet.clockOut}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, clockOut: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Unpaid Break (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={editingTimesheet.breakMinutes}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, breakMinutes: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Approval Status
                </label>
                <select
                  value={editingTimesheet.approvalStatus}
                  onChange={(e) => setEditingTimesheet({ ...editingTimesheet, approvalStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Notes
              </label>
              <textarea
                rows={2}
                value={editingTimesheet.notes || ''}
                onChange={(e) => setEditingTimesheet({ ...editingTimesheet, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingTimesheet(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
