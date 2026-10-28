'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Globe2,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Calendar,
  HeartPulse,
  BadgeCheck,
  IdCard,
} from 'lucide-react';

export default function EmployeeDashboardView({ onNavigate }) {
  const { user, canAccessTab, hasPermission } = useAuth();
  const [employeeData, setEmployeeData] = useState(() => user?.employee || null);
  const [leaves, setLeaves] = useState([]);
  const [allOrgLeaves, setAllOrgLeaves] = useState([]);
  const [immigrationRecord, setImmigrationRecord] = useState(
    () => user?.employee?.immigrationRecords?.[0] || null
  );
  const [rtwRecord, setRtwRecord] = useState(
    () => user?.employee?.rtwChecks?.[0] || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const canAccessLeave = canAccessTab('leave') || hasPermission('VIEW_LEAVE') || hasPermission('REQUEST_LEAVE') || hasPermission('APPROVE_LEAVES');
  const employeeId = user?.employeeId || user?.employee?.id;

  const fetchEmployeeData = async () => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const fetchPromises = [fetch(`/api/employees/${employeeId}`)];

      if (canAccessLeave) {
        fetchPromises.push(fetch('/api/leave'));
      }
      fetchPromises.push(fetch('/api/immigration'));
      fetchPromises.push(fetch('/api/rtw'));

      const results = await Promise.allSettled(fetchPromises);
      const empRes = results[0]?.status === 'fulfilled' ? results[0].value : null;

      if (empRes && empRes.ok) {
        const d = await empRes.json();
        if (d.success && d.employee) {
          setEmployeeData(d.employee);
          if (Array.isArray(d.employee.immigrationRecords) && d.employee.immigrationRecords.length > 0) {
            setImmigrationRecord(d.employee.immigrationRecords[0]);
          }
          if (Array.isArray(d.employee.rtwChecks) && d.employee.rtwChecks.length > 0) {
            setRtwRecord(d.employee.rtwChecks[0]);
          }
        }
      }

      if (canAccessLeave) {
        const leaveRes = results[1]?.status === 'fulfilled' ? results[1].value : null;
        if (leaveRes && leaveRes.ok) {
          const d = await leaveRes.json();
          const list = d.leaveRequests || d.leaves || [];
          setAllOrgLeaves(list);
          const myLeaves = list.filter(
            (l) => String(l.employeeId) === String(employeeId) || String(l.employee_id) === String(employeeId)
          );
          setLeaves(myLeaves);
        }
      }

      const immIdx = canAccessLeave ? 2 : 1;
      const immRes = results[immIdx]?.status === 'fulfilled' ? results[immIdx].value : null;
      if (immRes && immRes.ok) {
        const d = await immRes.json();
        if (d.success && Array.isArray(d.records)) {
          const myImm = d.records.find((r) => String(r.employeeId) === String(employeeId) || String(r.employee_id) === String(employeeId));
          if (myImm) setImmigrationRecord(myImm);
        }
      }

      const rtwIdx = canAccessLeave ? 3 : 2;
      const rtwRes = results[rtwIdx]?.status === 'fulfilled' ? results[rtwIdx].value : null;
      if (rtwRes && rtwRes.ok) {
        const d = await rtwRes.json();
        if (d.success && Array.isArray(d.records)) {
          const myRtw = d.records.find((r) => String(r.employeeId) === String(employeeId) || String(r.employee_id) === String(employeeId));
          if (myRtw) setRtwRecord(myRtw);
        }
      }
    } catch (e) {
      console.error('Error fetching employee dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId, canAccessLeave]);

  // Live Check for concurrent leave conflicts in employee portal (max 2 approved leaves)
  const modalConflict = useMemo(() => {
    if (!newLeave.startDate || !newLeave.endDate) {
      return { isBlocked: false, count: 0, conflictingEmployees: [] };
    }

    const targetStart = new Date(newLeave.startDate);
    const targetEnd = new Date(newLeave.endDate);
    if (isNaN(targetStart.getTime()) || isNaN(targetEnd.getTime())) {
      return { isBlocked: false, count: 0, conflictingEmployees: [] };
    }

    const approvedLeaves = allOrgLeaves.filter((l) => {
      if (String(l.employeeId) === String(employeeId) || String(l.employee_id) === String(employeeId)) return false;
      const st = (l.status || '').toUpperCase();
      if (st !== 'APPROVED') return false;
      if (!l.startDate || !l.endDate) return false;

      const lStart = new Date(l.startDate);
      const lEnd = new Date(l.endDate);
      return targetStart <= lEnd && targetEnd >= lStart;
    });

    const empMap = new Map();
    approvedLeaves.forEach((l) => {
      const empId = String(l.employeeId || l.employee_id);
      if (!empMap.has(empId)) {
        const empItem = l.employee;
        empMap.set(empId, {
          ...l,
          employeeName: empItem ? `${empItem.firstName} ${empItem.lastName}` : `Employee #${empId}`,
        });
      }
    });

    const conflictingList = Array.from(empMap.values());
    return {
      isBlocked: conflictingList.length >= 2,
      count: conflictingList.length,
      conflictingEmployees: conflictingList,
    };
  }, [newLeave.startDate, newLeave.endDate, allOrgLeaves, employeeId]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!employeeId) return;

    if (!newLeave.startDate || !newLeave.endDate) {
      alert('Please select both start and end date');
      return;
    }

    if (modalConflict.isBlocked) {
      alert('Leave booking is currently blocked: 2 or more colleagues already have approved leave during this period.');
      return;
    }

    try {
      setIsSubmittingLeave(true);
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId,
          leaveType: newLeave.leaveType,
          startDate: newLeave.startDate,
          endDate: newLeave.endDate,
          reason: newLeave.reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowLeaveModal(false);
        setNewLeave({
          leaveType: 'ANNUAL',
          startDate: '',
          endDate: '',
          reason: '',
        });
        fetchEmployeeData();
      } else {
        alert(data.error || 'Failed to submit leave request');
      }
    } catch (err) {
      alert('Error submitting leave: ' + err.message);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const emp = employeeData || user?.employee;

  // Leave calculations
  const totalEntitlement = parseFloat(emp?.holidayAllowance) || 28;
  const approvedLeaves = leaves.filter((l) => (l.status || '').toUpperCase() === 'APPROVED');
  const usedDays = approvedLeaves.reduce((acc, curr) => acc + (parseFloat(curr.totalDays || curr.days) || 0), 0);
  const remainingDays = Math.max(0, totalEntitlement - usedDays);
  const pendingLeaves = leaves.filter((l) => (l.status || '').toUpperCase() === 'PENDING');

  // Days until visa expiry
  const visaExp = immigrationRecord?.expiryDate || immigrationRecord?.visaExpiryDate || immigrationRecord?.visa_expiry_date;
  let daysUntilExpiry = null;
  if (visaExp) {
    const today = new Date();
    const exp = new Date(visaExp);
    const diffTime = exp.getTime() - today.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const formatAddress = () => {
    const parts = [
      emp?.addressLine1,
      emp?.addressLine2,
      emp?.city,
      emp?.postcode,
      emp?.country || 'United Kingdom',
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Profile Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 p-1 border-2 border-white/30 backdrop-blur-md overflow-hidden shrink-0 shadow-lg">
              {emp?.photoUrl ? (
                <img src={emp.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full bg-blue-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Employee Self-Service Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.name || `${emp?.firstName || ''} ${emp?.lastName || ''}`.trim() || 'Staff Member'}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100 mt-1">
                <span>{emp?.jobTitle || 'Team Member'}</span>
                <span>•</span>
                <span>{emp?.department?.name || emp?.department || 'Operations'}</span>
                <span>•</span>
                <span className="font-mono bg-white/15 px-2 py-0.5 rounded-md">{emp?.employeeCode || 'EMP-001'}</span>
              </div>
            </div>
          </div>

          {/* Quick Apply Leave Button (Only shown if leave access is granted) */}
          {canAccessLeave && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-lg transition-all active:scale-98 flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Leave</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {canAccessLeave ? (
          <>
            {/* Visa & RTW Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Immigration Status</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Globe2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {immigrationRecord?.visaType?.name || (emp?.isSponsoredWorker ? 'Skilled Worker' : 'Standard RTW')}
                </div>
                {daysUntilExpiry !== null ? (
                  <div
                    className={`mt-1.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      daysUntilExpiry <= 60
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {daysUntilExpiry <= 60 ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}</span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500">Verified Statutory RTW</span>
                )}
              </div>
            </div>

            {/* Annual Leave Remaining */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Leave Balance</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{remainingDays} Days</div>
                <p className="text-xs text-zinc-500 mt-1">
                  {usedDays} days used of {totalEntitlement} days entitlement
                </p>
              </div>
            </div>

            {/* Pending Requests */}
            <div
              onClick={() => {
                const el = document.getElementById('my-leave-applications');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigate) onNavigate('leave');
              }}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700/60 transition group"
              title="Click to view your pending leave applications"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pending Requests</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <span>{pendingLeaves.length}</span>
                  {pendingLeaves.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-normal">
                      Awaiting Sign-off
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {pendingLeaves.length === 1
                    ? '1 leave booking awaiting manager approval'
                    : pendingLeaves.length > 1
                    ? `${pendingLeaves.length} leave bookings awaiting manager approval`
                    : 'All submitted requests are resolved'}
                </p>
              </div>
            </div>

            {/* Working Hours / Contract */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Weekly Contract</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{emp?.weeklyHours || 37.5} hrs</div>
                <p className="text-xs text-zinc-500 mt-1">
                  {emp?.isSponsoredWorker ? 'UKVI Sponsored Worker' : 'Permanent Contract'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Employment Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Employment Status</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {emp?.status || 'ACTIVE'}
                </div>
                <p className="text-xs text-zinc-500 mt-1">Permanent Employee Record</p>
              </div>
            </div>

            {/* Department */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Department</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {emp?.department?.name || emp?.department || 'Operations'}
                </div>
                <p className="text-xs text-zinc-500 mt-1">{emp?.jobTitle || 'Team Member'}</p>
              </div>
            </div>

            {/* Contract Hours */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Contract Weekly Hours</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{emp?.weeklyHours || 37.5} hrs</div>
                <p className="text-xs text-zinc-500 mt-1">Regular weekly scheduled commitment</p>
              </div>
            </div>

            {/* Start Date */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Commencement Date</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {emp?.startDate || emp?.hireDate || 'Active'}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Hire Date: {emp?.hireDate || 'Recorded on file'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Detailed Profile Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Full width when leave access is disabled, or 6 cols when leave is active) */}
        <div className={`${canAccessLeave ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-6`}>
          {/* Personal Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <IdCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Personal Information</h3>
                <p className="text-xs text-zinc-500">Legal employee identity details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">First Name</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{emp?.firstName || '—'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Last Name</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{emp?.lastName || '—'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Date of Birth</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.dateOfBirth || emp?.dob || '—'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Gender</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.gender || 'Not specified'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Employee Code</span>
                <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{emp?.employeeCode || '—'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Nationality / Country</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.country || 'United Kingdom'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Contact & Address</h3>
                <p className="text-xs text-zinc-500">Communication and residential details</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{emp?.email || user?.email}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{emp?.phone || 'Not provided'}</span>
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="flex items-center space-x-2 text-zinc-500 pt-0.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Home Address</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right max-w-xs">
                  {formatAddress()}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Emergency & Next of Kin</h3>
                <p className="text-xs text-zinc-500">Primary point of contact in case of emergency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Emergency Contact</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {emp?.emergencyContact || emp?.emergency_contact || 'Not recorded on file'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Next of Kin</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {emp?.nextOfKin || emp?.next_of_kin || 'Not recorded on file'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Either Employment & RTW details, or Leave Applications if permitted */}
        <div className={`${canAccessLeave ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-6`}>
          {/* Employment & Contract Overview */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Employment Details</h3>
                <p className="text-xs text-zinc-500">Job position, terms, and service schedule</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Job Title</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{emp?.jobTitle || 'Team Member'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Department</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {emp?.department?.name || emp?.department || 'Operations'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Hire Date</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.hireDate || emp?.hire_date || '—'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Start Date</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.startDate || emp?.start_date || '—'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Weekly Hours</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{emp?.weeklyHours || 37.5} hours</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Worker Category</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {emp?.isSponsoredWorker ? 'UKVI Sponsored Worker' : 'Standard Employee'}
                </p>
              </div>
            </div>
          </div>

          {/* Right to Work & Visa Verification (Shown for all employees or sponsored workers) */}
          {(emp?.isSponsoredWorker || immigrationRecord || rtwRecord || user?.employee?.isSponsoredWorker) && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Right to Work & Immigration</h3>
                    <p className="text-xs text-zinc-500">Statutory Home Office compliance record</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Visa Category</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {immigrationRecord?.visaType?.name || (emp?.isSponsoredWorker ? 'Skilled Worker Visa' : 'Settled / UK National')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Visa Expiry Date</span>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {immigrationRecord?.expiryDate || immigrationRecord?.visaExpiryDate || immigrationRecord?.visa_expiry_date || 'Statutory Verified'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">BRP / eVisa Ref</span>
                  <p className="text-sm font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {immigrationRecord?.brpOrEvisaNumber || immigrationRecord?.brp_or_evisa_number || 'On file with HR'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Share Code</span>
                  <p className="text-sm font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {immigrationRecord?.shareCode || immigrationRecord?.share_code || 'Verified online'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Leave Section - Only visible if canAccessLeave is true */}
          {canAccessLeave && (
            <div id="my-leave-applications" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs scroll-mt-20">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">My Leave Applications</h3>
                    <p className="text-xs text-zinc-500">Track approvals and submit time-off</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('leave')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
                {leaves.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-sm">
                    <CalendarDays className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-60" />
                    <p>No leave requests found.</p>
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      + Submit your first leave request
                    </button>
                  </div>
                ) : (
                  leaves.map((leave) => {
                    const isApproved = (leave.status || '').toUpperCase() === 'APPROVED';
                    const isPending = (leave.status || '').toUpperCase() === 'PENDING';
                    return (
                      <div key={leave.id} className="py-3.5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {leave.leaveType || 'Annual'} Leave
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">({leave.totalDays || leave.days || 1} days)</span>
                          </div>
                          <p className="text-xs text-zinc-500">
                            {leave.startDate} to {leave.endDate}
                          </p>
                          {leave.reason && (
                            <p className="text-[11px] text-zinc-400 italic truncate max-w-xs">"{leave.reason}"</p>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : isPending
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {leave.status || 'Pending'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leave Application Modal (Only functional if leave access is granted) */}
      {canAccessLeave && showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Apply for Leave</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                  Leave Type
                </label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  <option value="ANNUAL">Annual Holiday</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                  <option value="EMERGENCY">Emergency / Compassionate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 transition ${
                      modalConflict.isBlocked
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 transition ${
                      modalConflict.isBlocked
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                  />
                </div>
              </div>

              {/* Conflict warning in Employee Modal */}
              {modalConflict.isBlocked && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-700 dark:text-rose-300">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Booking Not Allowed (Capacity Limit)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    2 employees already have approved leave booked for this date period. The system limit allows a maximum of 2 concurrent employees off at the same time.
                  </p>
                  <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400">
                    * Please select another date period for your request.
                  </div>
                </div>
              )}

              {modalConflict.count === 1 && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Notice: 1 colleague already has approved leave during these dates (1 slot left).</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                  Reason / Notes
                </label>
                <textarea
                  rows="3"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Provide context for manager review..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLeave || modalConflict.isBlocked}
                  className={`px-5 py-2 rounded-xl text-sm font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer ${
                    modalConflict.isBlocked
                      ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                  }`}
                >
                  {modalConflict.isBlocked ? (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>Booking Blocked (Max 2 Off)</span>
                    </>
                  ) : (
                    <span>{isSubmittingLeave ? 'Submitting...' : 'Submit Request'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
