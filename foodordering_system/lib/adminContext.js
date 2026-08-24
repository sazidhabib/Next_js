'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          
          // Initialize activeRole from user session if not set yet
          const finalRole = data.user.role;
          setActiveRole((prev) => prev || finalRole);
          
          // If the user is not a Super Admin, lock their selectedRestaurant to their assigned restaurant
          if (finalRole !== 'SUPER_ADMIN' && data.user.associatedRestaurant) {
            setSelectedRestaurant(data.user.associatedRestaurant);
          } else {
            // Load selected restaurant from localStorage for Super Admins
            const savedResto = localStorage.getItem('selected_restaurant');
            if (savedResto) {
              try {
                setSelectedRestaurant(JSON.parse(savedResto));
              } catch (e) {
                // ignore
              }
            }
          }
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  const selectRestaurant = (resto) => {
    // If not super admin, block selecting different restaurants
    if (user && user.role !== 'SUPER_ADMIN') {
      return;
    }
    
    setSelectedRestaurant(resto);
    if (resto) {
      localStorage.setItem('selected_restaurant', JSON.stringify(resto));
    } else {
      localStorage.removeItem('selected_restaurant');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setUser(null);
      setSelectedRestaurant(null);
      localStorage.removeItem('selected_restaurant');
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        loading,
        activeRole,
        setActiveRole,
        selectedRestaurant,
        selectRestaurant,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
