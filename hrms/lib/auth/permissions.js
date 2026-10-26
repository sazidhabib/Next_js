/**
 * HRMS Permissions & RBAC Schema
 * Granular Section + Action (View, Edit, Delete) + Workflow Permissions
 */

export const PERMISSION_ACTIONS = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
};

export const PERMISSION_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard & Overview',
    description: 'System metrics, operational activity overview, and executive stats',
    actions: ['VIEW'],
    viewPerm: 'VIEW_DASHBOARD',
  },
  {
    id: 'employees',
    label: 'Employee Records',
    description: 'Employee profiles, job assignments, contacts, emergency info, and documents',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_EMPLOYEES',
    editPerm: 'EDIT_EMPLOYEES',
    deletePerm: 'DELETE_EMPLOYEES',
  },
  {
    id: 'rota',
    label: 'Rota & Scheduling',
    description: 'Work shifts, weekly rosters, attendance logging, and timesheets',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_ROTA',
    editPerm: 'EDIT_ROTA',
    deletePerm: 'DELETE_ROTA',
  },
  {
    id: 'leave',
    label: 'Leave Management',
    description: 'Leave request records, holiday balances, and company-wide calendar',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_LEAVE',
    editPerm: 'EDIT_LEAVE',
    deletePerm: 'DELETE_LEAVE',
  },
  {
    id: 'immigration',
    label: 'Immigration & Visas',
    description: 'Visa tracking, share codes, sponsorship compliance, and expiry alerts',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_IMMIGRATION',
    editPerm: 'EDIT_IMMIGRATION',
    deletePerm: 'DELETE_IMMIGRATION',
  },
  {
    id: 'rtw',
    label: 'Right To Work (RTW)',
    description: 'Right to work document verification, checks, and audit trails',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_RTW',
    editPerm: 'EDIT_RTW',
    deletePerm: 'DELETE_RTW',
  },
  {
    id: 'departments',
    label: 'Departments',
    description: 'Organization units, department codes, and branch divisions',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_DEPARTMENTS',
    editPerm: 'EDIT_DEPARTMENTS',
    deletePerm: 'DELETE_DEPARTMENTS',
  },
  {
    id: 'roles',
    label: 'Roles & RBAC',
    description: 'Role creation, access privilege matrix, and security permissions',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_ROLES',
    editPerm: 'EDIT_ROLES',
    deletePerm: 'DELETE_ROLES',
  },
  {
    id: 'users',
    label: 'User Accounts',
    description: 'System login credentials, role assignments, and account status',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_USERS',
    editPerm: 'EDIT_USERS',
    deletePerm: 'DELETE_USERS',
  },
  {
    id: 'visatypes',
    label: 'Visa Categories',
    description: 'Visa definitions, working hour restrictions, and sponsorship rules',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_VISATYPES',
    editPerm: 'EDIT_VISATYPES',
    deletePerm: 'DELETE_VISATYPES',
  },
  {
    id: 'media',
    label: 'Media Library',
    description: 'Uploaded attachments, profile photos, documents, and compliance assets',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_MEDIA',
    editPerm: 'EDIT_MEDIA',
    deletePerm: 'DELETE_MEDIA',
  },
  {
    id: 'settings',
    label: 'System Settings',
    description: 'Application branding, email notifications, and system configurations',
    actions: ['VIEW', 'EDIT', 'DELETE'],
    viewPerm: 'VIEW_SETTINGS',
    editPerm: 'EDIT_SETTINGS',
    deletePerm: 'DELETE_SETTINGS',
  },
];

export const WORKFLOW_PERMISSIONS = [
  {
    code: 'VIEW_OWN_PROFILE',
    label: 'View Own Profile',
    description: 'Allows an employee user to view and manage their own employee profile',
    category: 'Employee Self-Service',
  },
  {
    code: 'REQUEST_LEAVE',
    label: 'Request Leave',
    description: 'Allows an employee user to submit their own leave / holiday requests',
    category: 'Employee Self-Service',
  },
  {
    code: 'APPROVE_LEAVES',
    label: 'Approve / Reject Leaves',
    description: 'Allows managers / supervisors to review, approve, or reject employee leave requests',
    category: 'Management Workflows',
  },
];

// Helper to look up a section config by ID or permission code
export function getSectionById(sectionId) {
  return PERMISSION_SECTIONS.find((s) => s.id === sectionId);
}

// Generate the permission code for a given section and action
export function getPermissionCode(sectionId, action) {
  const section = getSectionById(sectionId);
  if (!section) return null;
  const upper = action.toUpperCase();
  if (upper === 'VIEW') return section.viewPerm;
  if (upper === 'EDIT') return section.editPerm;
  if (upper === 'DELETE') return section.deletePerm;
  return null;
}

// Map legacy permissions for seamless backward compatibility
export const LEGACY_PERMISSION_MAP = {
  MANAGE_EMPLOYEES: ['VIEW_EMPLOYEES', 'EDIT_EMPLOYEES', 'DELETE_EMPLOYEES'],
  MANAGE_ROTA: ['VIEW_ROTA', 'EDIT_ROTA', 'DELETE_ROTA'],
  MANAGE_IMMIGRATION: ['VIEW_IMMIGRATION', 'EDIT_IMMIGRATION', 'DELETE_IMMIGRATION'],
  MANAGE_RTW: ['VIEW_RTW', 'EDIT_RTW', 'DELETE_RTW'],
  MANAGE_COMPLIANCE: [
    'VIEW_IMMIGRATION', 'EDIT_IMMIGRATION',
    'VIEW_RTW', 'EDIT_RTW',
    'VIEW_VISATYPES', 'EDIT_VISATYPES'
  ],
  VIEW_DEPARTMENT: ['VIEW_DEPARTMENTS'],
  MANAGE_USERS: [
    'VIEW_USERS', 'EDIT_USERS', 'DELETE_USERS',
    'VIEW_ROLES', 'EDIT_ROLES', 'DELETE_ROLES'
  ],
  MANAGE_MEDIA: ['VIEW_MEDIA', 'EDIT_MEDIA', 'DELETE_MEDIA'],
  MANAGE_SETTINGS: ['VIEW_SETTINGS', 'EDIT_SETTINGS', 'DELETE_SETTINGS'],
};

// Expand a raw permissions array to resolve legacy tokens
export function expandPermissions(rawPerms = []) {
  let list = [];
  if (Array.isArray(rawPerms)) {
    list = rawPerms;
  } else if (typeof rawPerms === 'string') {
    try {
      const parsed = JSON.parse(rawPerms);
      if (Array.isArray(parsed)) list = parsed;
      else list = [rawPerms];
    } catch {
      list = rawPerms.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }

  if (list.includes('ALL')) return ['ALL'];

  const expanded = new Set();
  for (const perm of list) {
    if (LEGACY_PERMISSION_MAP[perm]) {
      for (const p of LEGACY_PERMISSION_MAP[perm]) {
        expanded.add(p);
      }
    } else {
      expanded.add(perm);
    }
  }
  return Array.from(expanded);
}

// Standard Role definitions
export const STANDARD_ROLE_PRESETS = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    description: 'Master root account with unrestricted system access',
    permissions: ['ALL'],
  },
  ADMIN: {
    name: 'Admin',
    description: 'Full system operations control',
    permissions: ['ALL'],
  },
  RESTAURANT_OWNER: {
    name: 'Restaurant Owner',
    description: 'Business owner with compliance and executive oversight',
    permissions: ['ALL'],
  },
  HR_MANAGER: {
    name: 'HR Manager',
    description: 'Manage employees, RTW checks, visas, and leaves',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_EMPLOYEES', 'EDIT_EMPLOYEES', 'DELETE_EMPLOYEES',
      'VIEW_ROTA', 'EDIT_ROTA',
      'VIEW_LEAVE', 'EDIT_LEAVE', 'DELETE_LEAVE', 'APPROVE_LEAVES',
      'VIEW_IMMIGRATION', 'EDIT_IMMIGRATION', 'DELETE_IMMIGRATION',
      'VIEW_RTW', 'EDIT_RTW', 'DELETE_RTW',
      'VIEW_DEPARTMENTS', 'EDIT_DEPARTMENTS',
      'VIEW_VISATYPES', 'EDIT_VISATYPES',
      'VIEW_MEDIA', 'EDIT_MEDIA',
    ],
  },
  MANAGER: {
    name: 'Manager',
    description: 'Store and kitchen manager with approval authority',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_EMPLOYEES', 'EDIT_EMPLOYEES',
      'VIEW_ROTA', 'EDIT_ROTA',
      'VIEW_LEAVE', 'EDIT_LEAVE', 'APPROVE_LEAVES',
      'VIEW_DEPARTMENTS',
      'VIEW_MEDIA',
    ],
  },
  EMPLOYEE: {
    name: 'Employee',
    description: 'Self-service portal for personal profile, rota, and leave applications',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_OWN_PROFILE',
      'REQUEST_LEAVE',
      'VIEW_LEAVE',
      'VIEW_ROTA',
    ],
  },
};
