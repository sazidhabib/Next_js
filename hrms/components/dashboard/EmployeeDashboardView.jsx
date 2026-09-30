'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

export default function EmployeeDashboardView({ onNavigate }) {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [immigrationRecord, setImmigrationRecord] = useState(null);
  const [rtwRecord, setRtwRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const employeeId = user?.employeeId || user?.employee?.id;

  const fetchEmployeeData = async () => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [empRes, leaveRes, immRes, rtwRes] = await Promise.all([
        fetch(`/api/employees/${employeeId}`),
        fetch('/api/leave'),
        fetch('/api/immigration'),
        fetch('/api/rtw'),
      ]);

      if (empRes.ok) {
        const d = await empRes.json();
        if (d.success) setEmployeeData(d.employee);
      }

      if (leaveRes.ok) {
        const d = await leaveRes.json();
        if (d.success && Array.isArray(d.leaves)) {
          const myLeaves = d.leaves.filter((l) => l.employeeId === employeeId || l.employee_id === employeeId);
          setLeaves(myLeaves);
        }
      }

      if (immRes.ok) {
        const d = await immRes.json();
        if (d.success && Array.isArray(d.records)) {
          const myImm = d.records.find((r) => r.employeeId === employeeId || r.employee_id === employeeId);
          setImmigrationRecord(myImm);
        }
      }

      if (rtwRes.ok) {
        const d = await rtwRes.json();
        if (d.success && Array.isArray(d.records)) {
          const myRtw = d.records.find((r) => r.employeeId === employeeId || r.employee_id === employeeId);
          setRtwRecord(myRtw);
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
  }, [employeeId]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!employeeId) return;

    try {
      setIsSubmittingLeave(true);
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLeave,
          employeeId: employeeId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowLeaveModal(false);
        setNewLeave({ leaveType: 'ANNUAL', startDate: '', endDate: '', reason: '' });
        fetchEmployeeData();
      } else {
        alert(data.message || 'Failed to submit leave request');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  // Leave calculations
  const totalEntitlement = 28;
  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');
  const usedDays = approvedLeaves.reduce((acc, curr) => acc + (parseFloat(curr.totalDays) || 0), 0);
  const remainingDays = Math.max(0, totalEntitlement - usedDays);
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');

  // Days until visa expiry
  let daysUntilExpiry = null;
  if (immigrationRecord?.expiryDate) {
    const today = new Date();
    const exp = new Date(immigrationRecord.expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const emp = employeeData || user?.employee;

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
                <span>Employee Self-Service Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.name || 'Staff Member'}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100 mt-1">
                <span>{emp?.jobTitle || 'Team Member'}</span>
                <span>•</span>
                <span>{emp?.department?.name || emp?.department || 'Operations'}</span>
                <span>•</span>
                <span className="font-mono bg-white/15 px-2 py-0.5 rounded-md">{emp?.employeeCode || 'EMP-001'}</span>
              </div>
            </div>
          </div>

          {/* Quick Apply Leave Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-lg transition-all active:scale-98 flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {immigrationRecord?.visaType?.name || 'Skilled Worker'}
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
              <span className="text-xs text-zinc-500">Verified RTW</span>
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
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pending Leave Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{pendingLeaves.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Awaiting Manager sign-off</p>
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
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{emp?.weeklyHours || 40} hrs</div>
            <p className="text-xs text-zinc-500 mt-1">
              {emp?.isSponsoredWorker ? 'UKVI Sponsored Employment' : 'Permanent Contract'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Immigration & RTW Details vs Leave Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Compliance Card & Profile Summary */}
        <div className="lg:col-span-6 space-y-6">
          {/* Immigration & RTW Document Verification Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Right to Work & Visa</h3>
                  <p className="text-xs text-zinc-500">Official Home Office statutory record</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Visa Category</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {immigrationRecord?.visaType?.name || 'Skilled Worker Visa'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Visa Expiry Date</span>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {immigrationRecord?.expiryDate || '2026-11-15'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">BRP / eVisa Ref</span>
                <p className="text-sm font-mono font-medium text-zinc-800 dark:text-zinc-200">
                  {immigrationRecord?.brpOrEvisaNumber || 'BRP992019482'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">Share Code</span>
                <p className="text-sm font-mono font-medium text-zinc-800 dark:text-zinc-200">
                  {immigrationRecord?.shareCode || 'W87-29A-L90'}
                </p>
              </div>
            </div>

            {/* Compliance Reminder Banner */}
            <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Home Office Compliance Notice:</span> Please ensure any change in residential address, phone number, or passport renewal is reported to HR within 5 business days.
              </div>
            </div>
          </div>

          {/* Personal Info & Emergency Contact Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Personal & Emergency Details</h3>
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
                  <span>Contact Phone</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{emp?.phone || '+44 7700 900123'}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Emergency Contact</span>
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right truncate max-w-[220px]">
                  {emp?.emergencyContact || 'Amina Ahmed (+44 7700 900124)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: My Leave Applications & Activity */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">My Leave Applications</h3>
                  <p className="text-xs text-zinc-500">Track approvals and request time off</p>
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
                    className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Submit your first leave request
                  </button>
                </div>
              ) : (
                leaves.map((leave) => {
                  const isApproved = leave.status === 'APPROVED';
                  const isPending = leave.status === 'PENDING';
                  return (
                    <div key={leave.id} className="py-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {leave.leaveType || 'Annual'} Leave
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">({leave.totalDays || 1} days)</span>
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
                        {leave.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Apply for Leave</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
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
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
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
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

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
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLeave}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSubmittingLeave ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
