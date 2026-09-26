'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Building2,
  DollarSign,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Save,
  Filter,
  Download,
} from 'lucide-react';
import { Badge, Card } from '../ui';

export default function EmployeeManagement({ departments, onEmployeeUpdated }) {
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'add' | 'edit'
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Selected employee for Edit
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form State matching screenshot 2
  const initialFormState = {
    employeeCode: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    jobTitle: '',
    departmentId: departments?.[0]?.id || '',
    hireDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    salary: '',
    weeklyHours: '37.5',
    isSponsoredWorker: false,
    emergencyContact: '',
    nextOfKin: '',
    photoUrl: '',
    status: 'ACTIVE',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let url = `/api/employees?search=${encodeURIComponent(searchQuery)}`;
      if (deptFilter) url += `&departmentId=${deptFilter}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [deptFilter, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setSelectedEmployee(null);
    setActiveSubTab('add');
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode || '',
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      gender: emp.gender || 'Male',
      dateOfBirth: emp.dateOfBirth || '',
      email: emp.email || '',
      phone: emp.phone || '',
      addressLine1: emp.addressLine1 || '',
      addressLine2: emp.addressLine2 || '',
      city: emp.city || '',
      postcode: emp.postcode || '',
      country: emp.country || 'United Kingdom',
      jobTitle: emp.jobTitle || '',
      departmentId: emp.departmentId || '',
      hireDate: emp.hireDate || '',
      startDate: emp.startDate || '',
      endDate: emp.endDate || '',
      salary: emp.salary || '',
      weeklyHours: emp.weeklyHours || '37.5',
      isSponsoredWorker: Boolean(emp.isSponsoredWorker),
      emergencyContact: emp.emergencyContact || '',
      nextOfKin: emp.nextOfKin || '',
      photoUrl: emp.photoUrl || '',
      status: emp.status || 'ACTIVE',
    });
    setActiveSubTab('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEdit = activeSubTab === 'edit' && selectedEmployee?.id;
      const url = isEdit ? `/api/employees/${selectedEmployee.id}` : '/api/employees';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        alert(isEdit ? 'Employee updated successfully!' : 'Employee added successfully!');
        fetchEmployees();
        if (onEmployeeUpdated) onEmployeeUpdated();
        setActiveSubTab('list');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Failed to save employee: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee?.id) return;
    if (!confirm(`Are you sure you want to delete employee ${selectedEmployee.firstName} ${selectedEmployee.lastName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${selectedEmployee.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        alert('Employee deleted successfully');
        fetchEmployees();
        if (onEmployeeUpdated) onEmployeeUpdated();
        setActiveSubTab('list');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    if (!employees || employees.length === 0) {
      alert('No employee records to export');
      return;
    }

    const headers = [
      'Employee Code',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Job Title',
      'Department',
      'Salary',
      'Weekly Hours',
      'Sponsored Worker',
      'Hire Date',
      'Status',
    ];

    const rows = employees.map((emp) => [
      `"${emp.employeeCode || ''}"`,
      `"${emp.firstName || ''}"`,
      `"${emp.lastName || ''}"`,
      `"${emp.email || ''}"`,
      `"${emp.phone || ''}"`,
      `"${emp.jobTitle || ''}"`,
      `"${emp.department?.name || ''}"`,
      `"${emp.salary || 0}"`,
      `"${emp.weeklyHours || 37.5}"`,
      `"${emp.isSponsoredWorker ? 'Yes' : 'No'}"`,
      `"${emp.hireDate || ''}"`,
      `"${emp.status || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hrms_employees_directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Sub-Navigation Tabs matching legacy layout - horizontally scrollable on mobile */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center space-x-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Employees ({employees.length})</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center space-x-2 whitespace-nowrap shrink-0 ${
              activeSubTab === 'add'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>

          {activeSubTab === 'edit' && (
            <button
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-md shadow-blue-600/20 flex items-center space-x-2 whitespace-nowrap shrink-0"
            >
              <Edit className="w-4 h-4" />
              <span>Edit ({selectedEmployee?.employeeCode})</span>
            </button>
          )}
        </div>

        {activeSubTab === 'list' && (
          <button
            onClick={handleExportCSV}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* ======================= TAB 1: LIST / DIRECTORY ======================= */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {/* Responsive Filter Bar */}
          <div className="p-3.5 sm:p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex items-center space-x-2">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>

          {/* Responsive Employee Data Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
                <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-4 sm:px-5 py-3.5">Employee</th>
                    <th className="px-3 sm:px-4 py-3.5">Job Title & Dept</th>
                    <th className="px-3 sm:px-4 py-3.5">Salary / Hours</th>
                    <th className="px-3 sm:px-4 py-3.5">Sponsored</th>
                    <th className="px-3 sm:px-4 py-3.5">Status</th>
                    <th className="px-4 sm:px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-zinc-500">
                        {loading ? 'Loading employees...' : 'No employees found.'}
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group"
                      >
                        <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                emp.photoUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  emp.firstName + ' ' + emp.lastName
                                )}&background=0D8ABC&color=fff`
                              }
                              alt={emp.firstName}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-2xs shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5 truncate">
                                <span className="truncate">
                                  {emp.firstName} {emp.lastName}
                                </span>
                                <span className="font-mono text-[10px] sm:text-xs px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                  {emp.employeeCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate">{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 sm:px-4 py-3.5 sm:py-4">
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{emp.jobTitle}</p>
                          <p className="text-[11px] text-zinc-500 flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{emp.department?.name || 'General'}</span>
                          </p>
                        </td>

                        <td className="px-3 sm:px-4 py-3.5 sm:py-4">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            £{Number(emp.salary || 0).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-zinc-500">{emp.weeklyHours || 37.5} hrs/wk</p>
                        </td>

                        <td className="px-3 sm:px-4 py-3.5 sm:py-4">
                          {emp.isSponsoredWorker ? (
                            <Badge variant="purple" className="flex items-center space-x-1 w-fit">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Sponsored</span>
                            </Badge>
                          ) : (
                            <span className="text-xs text-zinc-400">Non-Sponsored</span>
                          )}
                        </td>

                        <td className="px-3 sm:px-4 py-3.5 sm:py-4">
                          <Badge
                            variant={
                              emp.status === 'ACTIVE'
                                ? 'success'
                                : emp.status === 'ON_LEAVE'
                                ? 'info'
                                : 'danger'
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>

                        <td className="px-4 sm:px-5 py-3.5 sm:py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2 & 3: FORM (ADD / EDIT) ======================= */}
      {(activeSubTab === 'add' || activeSubTab === 'edit') && (
        <Card
          title={activeSubTab === 'edit' ? `Edit Employee (${formData.employeeCode || 'ID'})` : 'Add New Employee'}
          subtitle="Complete master employee record with personal, job and compliance parameters"
          action={
            <button
              onClick={() => setActiveSubTab('list')}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to List</span>
            </button>
          }
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* LEFT COLUMN: Personal Info & Address */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b pb-1">
                  Personal & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone No
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Department
                    </label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2 sm:pt-6">
                    <input
                      type="checkbox"
                      id="statusActive"
                      checked={formData.status === 'ACTIVE'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })
                      }
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="statusActive" className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Active Employee
                    </label>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Photo, Salary, Sponsorship, Next of Kin, Dates */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b pb-1">
                  Photo & Compensation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Employee ID / Code
                    </label>
                    <input
                      type="text"
                      placeholder="Auto (e.g. EMP-005)"
                      value={formData.employeeCode}
                      onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono font-bold"
                    />
                  </div>

                  {/* Photo Box Preview with Browse Photo Button matching legacy UI */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40">
                    <img
                      src={
                        formData.photoUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          formData.firstName || 'New'
                        )}&background=0D8ABC&color=fff`
                      }
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-zinc-200 mb-2 shadow-2xs"
                    />
                    <input
                      type="file"
                      id="employeePhotoUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, photoUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="employeePhotoUpload"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold cursor-pointer transition shadow-xs text-center w-full mb-1.5"
                    >
                      Browse Photo
                    </label>
                    <input
                      type="text"
                      placeholder="Or Paste Image URL"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full text-[10px] px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 text-center text-zinc-600 dark:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Salary (£ / Annual)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 35000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Weekly Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.weeklyHours}
                      onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-xl flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isSponsored"
                    checked={formData.isSponsoredWorker}
                    onChange={(e) => setFormData({ ...formData, isSponsoredWorker: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <div>
                    <label htmlFor="isSponsored" className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      IsSponsored Worker (Yes/No)
                    </label>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                      Flag for UK Home Office visa compliance & audit monitoring
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Name (Phone No) - Relation"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Next Of Kin
                  </label>
                  <input
                    type="text"
                    placeholder="Next of kin full name"
                    value={formData.nextOfKin}
                    onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                {/* ACTION BUTTONS matching legacy screenshot */}
                <div className="pt-4 space-y-2.5">
                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{activeSubTab === 'edit' ? 'Update Details' : 'Save Employee Details'}</span>
                  </button>

                  {activeSubTab === 'edit' && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full py-2 sm:py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Employee</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('list')}
                    className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    &lt;&lt; Back
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
