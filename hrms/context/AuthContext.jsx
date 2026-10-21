'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  if (Array.isArray(perms)) return perms;
  if (typeof perms === 'string') {
    try {
      const parsed = JSON.parse(perms);
      if (Array.isArray(parsed)) return parsed;
      return [perms];
    } catch {
      return perms.split(',').map((p) => p.trim()).filter(Boolean);
    }
  }
  return [];
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
      // If server session check fails (network error), check local storage cache fallback
      const cached = localStorage.getItem('hrms_current_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Session verification notice:', error);
      const cached = localStorage.getItem('hrms_current_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch (e) {
          setUser(null);
        }
      }
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

  const canAccessTab = useCallback(
    (tabId) => {
      if (!user) return false;
      const role = user.roleName || user.role?.name || '';
      if (role === 'Admin' || role === 'Super Admin' || role === 'Restaurant Owner') return true;

      const perms = getUserPermissions(user);
      if (perms.includes('ALL')) return true;

      switch (tabId) {
        case 'dashboard':
          return (
            perms.includes('VIEW_DASHBOARD') ||
            perms.includes('VIEW_OWN_PROFILE') ||
            perms.includes('MANAGE_EMPLOYEES') ||
            perms.length > 0
          );

        case 'employees':
          return perms.includes('MANAGE_EMPLOYEES');

        case 'leave':
          return perms.includes('REQUEST_LEAVE') || perms.includes('APPROVE_LEAVES');

        case 'rota':
          return (
            perms.includes('MANAGE_ROTA') ||
            perms.includes('VIEW_ROTA') ||
            ((role === 'Manager' || role === 'HR Manager' || role === 'Department Head') && perms.includes('MANAGE_EMPLOYEES'))
          );

        case 'immigration':
          return perms.includes('MANAGE_IMMIGRATION') || perms.includes('MANAGE_COMPLIANCE');

        case 'rtw':
          return perms.includes('MANAGE_RTW') || perms.includes('MANAGE_COMPLIANCE');

        case 'departments':
          return perms.includes('VIEW_DEPARTMENT') || perms.includes('MANAGE_EMPLOYEES');

        case 'roles':
        case 'users':
          return perms.includes('MANAGE_USERS');

        case 'visatypes':
          return perms.includes('MANAGE_COMPLIANCE') || perms.includes('MANAGE_IMMIGRATION');

        case 'media':
          return (
            perms.includes('MANAGE_MEDIA') ||
            ((role === 'Manager' || role === 'HR Manager') && perms.includes('MANAGE_EMPLOYEES'))
          );

        case 'settings':
          return perms.includes('MANAGE_SETTINGS');

        default:
          return false;
      }
    },
    [user]
  );

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
