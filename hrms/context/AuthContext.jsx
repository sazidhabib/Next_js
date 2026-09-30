'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const ROLE_PERMISSIONS = {
  'Super Admin': ['dashboard', 'employees', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  Admin: ['dashboard', 'employees', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  'Restaurant Owner': ['dashboard', 'employees', 'immigration', 'rtw', 'leave', 'departments', 'roles', 'users', 'visatypes', 'media', 'settings'],
  'HR Manager': ['dashboard', 'employees', 'immigration', 'rtw', 'leave', 'departments', 'visatypes', 'media'],
  'Department Head': ['dashboard', 'employees', 'leave', 'departments', 'media'],
  Manager: ['dashboard', 'employees', 'leave', 'departments', 'media'],
  Employee: ['dashboard', 'leave', 'media'],
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
      }
      // If server session check fails, check local storage cache fallback
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
      const role = user.roleName || 'Employee';
      if (role === 'Admin' || role === 'Super Admin') return true;

      const allowedTabs = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Employee'];
      return allowedTabs.includes(tabId);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permissionCode) => {
      if (!user) return false;
      if (user.roleName === 'Admin' || user.roleName === 'Restaurant Owner') return true;
      const perms = Array.isArray(user.permissions) ? user.permissions : [];
      return perms.includes('ALL') || perms.includes(permissionCode);
    },
    [user]
  );

  const value = {
    user,
    role: user?.roleName || 'Guest',
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    canAccessTab,
    hasPermission,
    checkSession,
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
