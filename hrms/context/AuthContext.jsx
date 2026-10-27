'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { expandPermissions, getPermissionCode } from '@/lib/auth/permissions';

const AuthContext = createContext(null);

export const ROLE_PERMISSIONS = {
  'Super Admin': ['dashboard', 'employees', 'rota', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  Admin: ['dashboard', 'employees', 'rota', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  'Restaurant Owner': ['dashboard', 'employees', 'rota', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  'HR Manager': ['dashboard', 'employees', 'rota', 'immigration', 'rtw', 'leave', 'departments', 'visatypes', 'media'],
  'Department Head': ['dashboard', 'employees', 'rota', 'leave', 'departments', 'media'],
  Manager: ['dashboard', 'employees', 'rota', 'leave', 'departments', 'media'],
  Employee: ['dashboard', 'rota', 'leave', 'media'],
};

export const getUserPermissions = (user) => {
  if (!user) return [];
  let perms = user.permissions;
  if (!perms && user.role?.permissions) perms = user.role.permissions;
  let rawList = [];
  if (Array.isArray(perms)) {
    rawList = perms;
  } else if (typeof perms === 'string') {
    try {
      const parsed = JSON.parse(perms);
      if (Array.isArray(parsed)) rawList = parsed;
      else rawList = [perms];
    } catch {
      rawList = perms.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }
  return expandPermissions(rawList);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on mount
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('hrms_current_user', JSON.stringify(data.user));
          return;
        }
        setUser(null);
        localStorage.removeItem('hrms_current_user');
        return;
      }
      // If server session check fails or returns unauthenticated, clear session
      setUser(null);
      localStorage.removeItem('hrms_current_user');
    } catch (error) {
      console.warn('Session verification notice:', error);
      setUser(null);
      localStorage.removeItem('hrms_current_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      setUser(data.user);
      localStorage.setItem('hrms_current_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout notice:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('hrms_current_user');
    }
  };

  const hasPermission = useCallback(
    (permissionCode) => {
      if (!user) return false;
      const role = user.roleName || user.role?.name || '';
      if (role === 'Admin' || role === 'Super Admin' || role === 'Restaurant Owner') return true;
      const perms = getUserPermissions(user);
      return perms.includes('ALL') || perms.includes(permissionCode);
    },
    [user]
  );

  const canPerform = useCallback(
    (section, action) => {
      if (!user) return false;
      const role = user.roleName || user.role?.name || '';
      if (role === 'Admin' || role === 'Super Admin' || role === 'Restaurant Owner') return true;

      const perms = getUserPermissions(user);
      if (perms.includes('ALL')) return true;

      const targetPerm = getPermissionCode(section, action);
      if (targetPerm && perms.includes(targetPerm)) return true;

      // Special action mappings:
      if (action.toUpperCase() === 'VIEW') {
        // If user can edit or delete, they naturally can view
        const editPerm = getPermissionCode(section, 'EDIT');
        const deletePerm = getPermissionCode(section, 'DELETE');
        if (editPerm && perms.includes(editPerm)) return true;
        if (deletePerm && perms.includes(deletePerm)) return true;

        if (section === 'dashboard') {
          return perms.includes('VIEW_DASHBOARD') || perms.includes('VIEW_OWN_PROFILE') || perms.length > 0;
        }
        if (section === 'leave') {
          return perms.includes('REQUEST_LEAVE') || perms.includes('APPROVE_LEAVES') || perms.includes('VIEW_LEAVE');
        }
      }

      return false;
    },
    [user]
  );

  const canView = useCallback((section) => canPerform(section, 'VIEW'), [canPerform]);
  const canEdit = useCallback((section) => canPerform(section, 'EDIT'), [canPerform]);
  const canDelete = useCallback((section) => canPerform(section, 'DELETE'), [canPerform]);

  const canAccessTab = useCallback(
    (tabId) => {
      if (!user) return false;
      return canView(tabId);
    },
    [user, canView]
  );

  const value = {
    user,
    role: user?.roleName || 'Guest',
    permissions: getUserPermissions(user),
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    canAccessTab,
    hasPermission,
    canPerform,
    canView,
    canEdit,
    canDelete,
    checkSession,
    refreshUserSession: checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
