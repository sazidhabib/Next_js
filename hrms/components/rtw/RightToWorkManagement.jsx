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
  Edit,
  FileText,
} from 'lucide-react';
import { Badge, Card } from '../ui';

const CHECK_METHODS = [
  'Online Share Code Check',
  'Manual Document Check',
  'Digital Identity Service Provider (IDSP)',
  'Home Office Employer Checking Service',
];

const DOCUMENT_TYPES = [
  'Passport',
  'Biometric Residence Permit (BRP)',
  'Home Office Online Share Code',
  'UK Birth / Adoption Certificate with National Insurance',
  'Certificate of Application (CoA)',
  'Application Registration Card (ARC)',
  'Visa Vignette / Passport Endorsement',
];

const OUTCOME_OPTIONS = [
  'Continuous Right to Work',
  'Time-Limited Right to Work',
  'Statutory Excuse Established',
  'Pending Verification',
  'Restricted / Work Hour Limited',
  'No Right to Work',
];

export default function RightToWorkManagement({ employees = [], onUpdated }) {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('rtw'); // 'rtw' | 'add' | 'edit'
  const [search, setSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);

  const initialFormState = {
    id: '',
    employeeId: '',
    checkDate: new Date().toISOString().split('T')[0],
    checkMethod: 'Online Share Code Check',
    documentType: 'Passport',
    documentRef: '',
    performedByUserId: '',
    outcome: 'Continuous Right to Work',
    followUpRequired: false,
    followUpDate: '',
    notes: '',
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
    fetchUsers();
  }, []);

  const openAddTab = () => {
    setEditingRecord(null);
    const defaultEmp = employees?.[0]?.id || '';
    const defaultUser = users?.[0]?.name || 'Bishnu';
    const today = new Date().toISOString().split('T')[0];

    setForm({
      ...initialFormState,
      employeeId: defaultEmp,
      performedByUserId: defaultUser,
      checkDate: today,
    });
    setActiveSubTab('add');
  };

  const openEditTab = (rec) => {
    setEditingRecord(rec);
    setForm({
      id: rec.id || '',
      employeeId: rec.employeeId || '',
      checkDate: rec.checkDate || '',
      checkMethod: rec.checkMethod || rec.checkType || 'Online Share Code Check',
      documentType: rec.documentType || 'Passport',
      documentRef: rec.documentRef || rec.documentRefNumber || '',
      performedByUserId: rec.performedByUserId || rec.verifiedBy || '',
      outcome: rec.outcome || 'Continuous Right to Work',
      followUpRequired: Boolean(rec.followUpRequired || rec.nextReviewDate),
      followUpDate: rec.followUpDate || rec.nextReviewDate || '',
      notes: rec.notes || '',
    });
    setActiveSubTab('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = activeSubTab === 'edit' && editingRecord;
      const url = isEdit ? `/api/rtw/${editingRecord.id}` : '/api/rtw';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        employeeId: parseInt(form.employeeId, 10) || form.employeeId,
        checkDate: form.checkDate,
        checkMethod: form.checkMethod,
        documentType: form.documentType,
        documentRef: form.documentRef,
        performedByUserId: form.performedByUserId,
        outcome: form.outcome,
        followUpRequired: form.followUpRequired,
        followUpDate: form.followUpRequired ? form.followUpDate : null,
        nextReviewDate: form.followUpRequired ? form.followUpDate : null,
        notes: form.notes,
        statutoryExcuseGranted: form.outcome !== 'No Right to Work',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(isEdit ? 'RTW Check updated successfully' : 'Right to Work Check added successfully');
        setActiveSubTab('rtw');
        setEditingRecord(null);
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
    const empName = `${r.employee?.firstName || ''} ${r.employee?.lastName || ''}`.toLowerCase();
    const docRef = (r.documentRef || r.documentRefNumber || '').toLowerCase();
    const verifier = (r.performedByUserId || r.verifiedBy || '').toLowerCase();
    return empName.includes(term) || docRef.includes(term) || verifier.includes(term);
  });

  return (
    <div className="space-y-4">
      {/* Module Title & System Style Sub-Tabs */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Right To Work (RTW) Compliance</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Home Office statutory excuse audit log, share codes, digital IDSP & manual document verification
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('rtw')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'rtw'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Right To Work</span>
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
            <span>Add Check</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!editingRecord && records.length > 0) {
                openEditTab(records[0]);
              } else if (editingRecord) {
                setActiveSubTab('edit');
              } else {
                alert('Please select a check record from the table to edit');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'edit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit Check</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: RTW Checks Table */}
      {activeSubTab === 'rtw' && (
        <Card>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee, document ref, officer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-medium text-zinc-500">{filtered.length} RTW Audit Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3">Check ID</th>
                  <th className="px-3 sm:px-4 py-3">Employee</th>
                  <th className="px-3 sm:px-4 py-3">Check Method</th>
                  <th className="px-3 sm:px-4 py-3">Check Date</th>
                  <th className="px-3 sm:px-4 py-3">Document Ref</th>
                  <th className="px-3 sm:px-4 py-3">Performed By</th>
                  <th className="px-3 sm:px-4 py-3">Outcome</th>
                  <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500 text-xs">
                      {loading ? 'Loading RTW records...' : 'No RTW audit records found.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec) => (
                    <tr key={rec.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                      <td className="px-3 sm:px-4 py-3 font-mono text-xs text-zinc-500">
                        #{rec.id}
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[140px]">
                          {rec.employee?.firstName} {rec.employee?.lastName}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {rec.employee?.employeeCode || `EMP-${rec.employeeId}`}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {rec.checkMethod || rec.checkType}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs font-medium">{rec.checkDate}</td>

                      <td className="px-3 sm:px-4 py-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        {rec.documentRef || rec.documentRefNumber || '-'}
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">
                        {rec.performedByUserId || rec.verifiedBy || '-'}
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        <Badge
                          variant={
                            rec.outcome?.includes('Continuous') || rec.statutoryExcuseGranted
                              ? 'success'
                              : rec.outcome?.includes('Time-Limited')
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {rec.outcome || (rec.statutoryExcuseGranted ? 'Statutory Excuse Granted' : 'Pending')}
                        </Badge>
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => openEditTab(rec)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                          title="Edit Check"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                          title="Delete Check"
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
      )}

      {/* Sub-Tab 2 & 3: Create / Edit Right To Work Check Form */}
      {(activeSubTab === 'add' || activeSubTab === 'edit') && (
        <Card>
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {activeSubTab === 'edit' ? `Edit Right To Work Check #${form.id}` : 'Create Right To Work Check'}
            </h3>
            <p className="text-xs text-zinc-500">
              Record statutory excuse validation, document reference, conducting officer and follow-up schedules.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* 2-Column Responsive Layout matching reference screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {/* Check Id */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Check Id:
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Auto Generated"
                    value={form.id ? `#${form.id}` : 'Auto Generated'}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-500 cursor-not-allowed font-mono"
                  />
                </div>

                {/* Employee Id */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Employee Id: *
                  </label>
                  <select
                    required
                    value={form.employeeId}
                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Employee</option>
                    {employees?.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employeeCode || emp.id} - {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Check Date */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Check Date: *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.checkDate}
                    onChange={(e) => setForm({ ...form, checkDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Check Method */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Check Method: *
                  </label>
                  <select
                    required
                    value={form.checkMethod}
                    onChange={(e) => setForm({ ...form, checkMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {CHECK_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Document Type:
                  </label>
                  <select
                    value={form.documentType}
                    onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {DOCUMENT_TYPES.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Ref */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Document Ref:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Passport number or Share Code"
                    value={form.documentRef}
                    onChange={(e) => setForm({ ...form, documentRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Performed By User Id */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Performed By User Id:
                  </label>
                  <select
                    value={form.performedByUserId}
                    onChange={(e) => setForm({ ...form, performedByUserId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Conducting Officer</option>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <option key={u.id} value={u.username || u.name}>
                          {u.username || u.name} - {u.name} {u.role?.name ? `(${u.role.name})` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Bishnu">Bishnu</option>
                        <option value="Obi">Obi</option>
                        <option value="Kaiseer">Kaiseer</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Outcome */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Outcome:
                  </label>
                  <select
                    value={form.outcome}
                    onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {OUTCOME_OPTIONS.map((out) => (
                      <option key={out} value={out}>
                        {out}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Follow Up Required & Follow Up Date */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="followUpReq"
                      checked={form.followUpRequired}
                      onChange={(e) => setForm({ ...form, followUpRequired: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                    />
                    <label htmlFor="followUpReq" className="font-semibold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer">
                      Follow Up Required
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Follow Up Date:
                    </label>
                    <input
                      type="date"
                      disabled={!form.followUpRequired}
                      value={form.followUpDate}
                      onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        form.followUpRequired
                          ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                          : 'bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Notes multi-line textarea */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Notes:
                  </label>
                  <textarea
                    rows={12}
                    placeholder="Enter statutory excuse notes, Home Office verification reference, follow-up remarks..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('rtw')}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeSubTab === 'edit' ? 'Update Check' : 'Add Check'}</span>
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
