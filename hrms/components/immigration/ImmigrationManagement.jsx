'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  Search,
  FileText,
  Calendar,
  ShieldCheck,
  X,
  UserCheck,
} from 'lucide-react';
import { Badge, Card } from '../ui';
import MediaPickerModal from '../media/MediaPickerModal';

export default function ImmigrationManagement({ employees = [], visaTypes = [], onUpdated }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('records'); // 'records' | 'add' | 'edit'
  const [search, setSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const initialFormState = {
    id: '',
    employeeId: '',
    visaTypeId: '',
    nationality: '',
    niNumber: '',
    passportNumber: '',
    passportExpiryDate: '',
    brpNumber: '',
    visaStartDate: '',
    visaExpiryDate: '',
    sponsorLicenceNo: '0W01ABC89',
    cosNumber: '',
    isSkilledWorkerEligible: false,
    offeredSalary: '',
    salaryMeetsThreshold: false,
    rightToWorkStatus: 'Valid',
    notes: '',
    lastVerifiedDate: new Date().toISOString().split('T')[0],
    nextReviewDate: '',
    passportPhoto: '',
  };

  const [form, setForm] = useState(initialFormState);

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

  const handleSelectEmployee = (empId) => {
    const selectedEmp = employees.find((e) => String(e.id) === String(empId));
    setForm((prev) => ({
      ...prev,
      employeeId: empId,
      nationality: prev.nationality || (selectedEmp?.country || 'United Kingdom'),
      offeredSalary: prev.offeredSalary || (selectedEmp?.salary ? String(selectedEmp.salary) : ''),
    }));
  };

  const openAddTab = () => {
    setEditingRecord(null);
    const defaultEmp = employees?.[0]?.id || '';
    const defaultVisa = visaTypes?.[0]?.id || '';
    const today = new Date().toISOString().split('T')[0];
    
    setForm({
      ...initialFormState,
      employeeId: defaultEmp,
      visaTypeId: defaultVisa,
      lastVerifiedDate: today,
    });
    setActiveSubTab('add');
  };

  const openEditTab = (rec) => {
    setEditingRecord(rec);
    setForm({
      id: rec.id || '',
      employeeId: rec.employeeId || '',
      visaTypeId: rec.visaTypeId || '',
      nationality: rec.nationality || (rec.employee?.country || ''),
      niNumber: rec.niNumber || '',
      passportNumber: rec.passportNumber || '',
      passportExpiryDate: rec.passportExpiryDate || '',
      brpNumber: rec.brpNumber || rec.brpOrEvisaNumber || '',
      visaStartDate: rec.visaStartDate || rec.issueDate || '',
      visaExpiryDate: rec.visaExpiryDate || rec.expiryDate || '',
      sponsorLicenceNo: rec.sponsorLicenceNo || '0W01ABC89',
      cosNumber: rec.cosNumber || rec.sponsorCosNumber || '',
      isSkilledWorkerEligible: Boolean(rec.isSkilledWorkerEligible),
      offeredSalary: rec.offeredSalary || (rec.employee?.salary ? String(rec.employee.salary) : ''),
      salaryMeetsThreshold: Boolean(rec.salaryMeetsThreshold),
      rightToWorkStatus: rec.rightToWorkStatus || 'Valid',
      notes: rec.notes || '',
      lastVerifiedDate: rec.lastVerifiedDate || '',
      nextReviewDate: rec.nextReviewDate || '',
      passportPhoto: rec.passportPhoto || '',
    });
    setActiveSubTab('edit');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, passportPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = activeSubTab === 'edit' && editingRecord;
      const url = isEdit ? `/api/immigration/${editingRecord.id}` : '/api/immigration';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...form,
        employeeId: parseInt(form.employeeId, 10) || form.employeeId,
        visaTypeId: form.visaTypeId ? parseInt(form.visaTypeId, 10) : null,
        offeredSalary: form.offeredSalary ? parseFloat(form.offeredSalary) : 0,
        expiryDate: form.visaExpiryDate || form.expiryDate || null,
        issueDate: form.visaStartDate || form.issueDate || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert(isEdit ? 'Immigration record updated successfully' : 'Immigration record created successfully');
        setActiveSubTab('records');
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
    const empName = `${r.employee?.firstName || ''} ${r.employee?.lastName || ''}`.toLowerCase();
    const empCode = (r.employee?.employeeCode || '').toLowerCase();
    const pass = (r.passportNumber || '').toLowerCase();
    const cos = (r.cosNumber || r.sponsorCosNumber || '').toLowerCase();
    return (
      empName.includes(term) ||
      empCode.includes(term) ||
      pass.includes(term) ||
      cos.includes(term) ||
      (r.visaType?.name && r.visaType.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* Module Title & System Style Sub-Tabs */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-blue-600" />
              <span>Immigration Records Management</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              UK Home Office compliance, visa validity, sponsorship details & right to work records
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('records')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'records'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Immigration Records</span>
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
            <span>Add Immigration Record</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!editingRecord && records.length > 0) {
                openEditTab(records[0]);
              } else if (editingRecord) {
                setActiveSubTab('edit');
              } else {
                alert('Please select a record from the list to edit');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
              activeSubTab === 'edit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit Immigration Record</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Records Table */}
      {activeSubTab === 'records' && (
        <Card>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee, passport, CoS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-medium text-zinc-500">{filtered.length} Immigration Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3">ID / Emp ID</th>
                  <th className="px-3 sm:px-4 py-3">Employee</th>
                  <th className="px-3 sm:px-4 py-3">Visa Type</th>
                  <th className="px-3 sm:px-4 py-3">Passport / BRP</th>
                  <th className="px-3 sm:px-4 py-3">CoS Number</th>
                  <th className="px-3 sm:px-4 py-3">Expiry Date</th>
                  <th className="px-3 sm:px-4 py-3">RTW Status</th>
                  <th className="px-3 sm:px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500 text-xs">
                      {loading ? 'Loading immigration records...' : 'No immigration records found.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec) => {
                    const today = new Date();
                    const expStr = rec.visaExpiryDate || rec.expiryDate;
                    const exp = expStr ? new Date(expStr) : null;
                    const diff = exp ? Math.ceil((exp - today) / (1000 * 60 * 60 * 24)) : null;
                    const isExpiringSoon = diff !== null && diff <= 90 && diff > 0;
                    const isExpired = diff !== null && diff <= 0;

                    return (
                      <tr key={rec.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                        <td className="px-3 sm:px-4 py-3 font-mono text-xs text-zinc-500">
                          #{rec.id} <span className="text-[10px] text-zinc-400">({rec.employee?.employeeCode || rec.employeeId})</span>
                        </td>

                        <td className="px-3 sm:px-4 py-3">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate max-w-[140px]">
                            {rec.employee?.firstName} {rec.employee?.lastName}
                          </div>
                          <span className="text-[10px] text-zinc-400">
                            {rec.nationality || rec.employee?.country || 'UK'}
                          </span>
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-xs">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {rec.visaType?.name || 'Skilled Worker'}
                          </span>
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-xs font-mono">
                          <div>{rec.passportNumber || '-'}</div>
                          {(rec.brpNumber || rec.brpOrEvisaNumber) && (
                            <span className="text-[10px] text-zinc-400">
                              BRP: {rec.brpNumber || rec.brpOrEvisaNumber}
                            </span>
                          )}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                          {rec.cosNumber || rec.sponsorCosNumber || '-'}
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-xs font-medium">
                          <div>{expStr || '-'}</div>
                          {isExpired ? (
                            <span className="text-[10px] font-bold text-rose-600">EXPIRED</span>
                          ) : isExpiringSoon ? (
                            <span className="text-[10px] font-bold text-amber-600">({diff}d left)</span>
                          ) : diff !== null ? (
                            <span className="text-[10px] text-emerald-600 font-semibold">({diff}d)</span>
                          ) : null}
                        </td>

                        <td className="px-3 sm:px-4 py-3">
                          <Badge variant={rec.rightToWorkStatus === 'Valid' ? 'success' : 'warning'}>
                            {rec.rightToWorkStatus || 'Valid'}
                          </Badge>
                        </td>

                        <td className="px-3 sm:px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => openEditTab(rec)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
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

      {/* Sub-Tab 2 & 3: Add / Edit Immigration Record Form */}
      {(activeSubTab === 'add' || activeSubTab === 'edit') && (
        <Card>
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              {activeSubTab === 'edit' ? `Edit Immigration Record #${form.id}` : 'Create Immigration Record'}
            </h3>
            <p className="text-xs text-zinc-500">
              Complete all visa, Home Office sponsor compliance and document verification fields.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* 2-Column Responsive Layout matching reference screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {/* Immigration Record ID & Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Immigration Record Id
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Auto Generated"
                      value={form.id ? `#${form.id}` : 'Auto Generated'}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-500 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Employee Id *
                    </label>
                    <select
                      required
                      value={form.employeeId}
                      onChange={(e) => handleSelectEmployee(e.target.value)}
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
                </div>

                {/* Visa Type & Nationality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Visa Type *
                    </label>
                    <select
                      required
                      value={form.visaTypeId}
                      onChange={(e) => setForm({ ...form, visaTypeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select Visa Type</option>
                      {visaTypes?.map((vt) => (
                        <option key={vt.id} value={vt.id}>
                          {vt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. British, Nepalese, Indian"
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* NI Number & Passport Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      NI Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. QQ 12 34 56 A"
                      value={form.niNumber}
                      onChange={(e) => setForm({ ...form, niNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789"
                      value={form.passportNumber}
                      onChange={(e) => setForm({ ...form, passportNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Passport Expiry Date & BRP Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Passport Expiry Date
                    </label>
                    <input
                      type="date"
                      value={form.passportExpiryDate}
                      onChange={(e) => setForm({ ...form, passportExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      BRP Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BRP992019482"
                      value={form.brpNumber}
                      onChange={(e) => setForm({ ...form, brpNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visa Start Date & Visa Expiry Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Visa Start Date
                    </label>
                    <input
                      type="date"
                      value={form.visaStartDate}
                      onChange={(e) => setForm({ ...form, visaStartDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Visa Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.visaExpiryDate}
                      onChange={(e) => setForm({ ...form, visaExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sponsor Licence No & CoS Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Sponsor Licence No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0W01ABC89"
                      value={form.sponsorLicenceNo}
                      onChange={(e) => setForm({ ...form, sponsorLicenceNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      CoS Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. COS-UK-2026-1234"
                      value={form.cosNumber}
                      onChange={(e) => setForm({ ...form, cosNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skilled Worker Eligible & Salary Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id="skilledEligible"
                      checked={form.isSkilledWorkerEligible}
                      onChange={(e) => setForm({ ...form, isSkilledWorkerEligible: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700"
                    />
                    <label htmlFor="skilledEligible" className="font-semibold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer">
                      Skilled Worker Eligible: <span className="font-normal text-zinc-500">Yes/No</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Offered Salary (£)
                    </label>
                    <input
                      type="number"
                      step="100"
                      placeholder="e.g. 38700"
                      value={form.offeredSalary}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = parseFloat(val) || 0;
                        setForm({
                          ...form,
                          offeredSalary: val,
                          salaryMeetsThreshold: num >= 38700,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Salary Meets Threshold & Right To Work Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id="salaryThreshold"
                      checked={form.salaryMeetsThreshold}
                      onChange={(e) => setForm({ ...form, salaryMeetsThreshold: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700"
                    />
                    <label htmlFor="salaryThreshold" className="font-semibold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer">
                      Salary Meets Threshold: <span className="font-normal text-zinc-500">Yes/No</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Right To Work Status
                    </label>
                    <select
                      value={form.rightToWorkStatus}
                      onChange={(e) => setForm({ ...form, rightToWorkStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Valid">Valid (Continuous Right)</option>
                      <option value="Time-Limited">Time-Limited (Subject to Visa)</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Restricted">Restricted / 20h Limit</option>
                      <option value="Exempt">Exempt (Citizen / ILR)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Notes, Verification Dates & Passport Photo */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Notes Multi-line */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter compliance notes, verification records, or conditions..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Last Verified Date */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Last Verified Date
                  </label>
                  <input
                    type="date"
                    value={form.lastVerifiedDate}
                    onChange={(e) => setForm({ ...form, lastVerifiedDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Next Review Date */}
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Next Review Date
                  </label>
                  <input
                    type="date"
                    value={form.nextReviewDate}
                    onChange={(e) => setForm({ ...form, nextReviewDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Passport Photo Upload & Preview Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Passport Photo:
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-[11px] shadow-sm flex items-center space-x-1.5 transition"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose / Upload Photo</span>
                    </button>
                  </div>

                  {/* Photo Preview Container */}
                  <div className="w-full h-48 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center overflow-hidden relative group">
                    {form.passportPhoto ? (
                      <>
                        <img
                          src={form.passportPhoto}
                          alt="Passport Photo Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, passportPhoto: '' })}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 shadow transition"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4 text-zinc-400 flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-2 stroke-1 text-zinc-400" />
                        <span className="font-medium text-xs">No Passport Photo Uploaded</span>
                        <span className="text-[11px] text-zinc-500 mt-0.5">Click &quot;Choose / Upload Photo&quot; to attach</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('records')}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeSubTab === 'edit' ? 'Update Record' : 'Add Record'}</span>
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Centralized Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setForm((prev) => ({ ...prev, passportPhoto: url }))}
        initialUrl={form.passportPhoto}
        title="Select Passport & Visa Photo"
        preferredCategory="PASSPORT"
      />
    </div>
  );
}
