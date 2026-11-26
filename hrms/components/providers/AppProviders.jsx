'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

export default function AppProviders({ children, initialSettings }) {
  return (
    <AuthProvider>
      <DataProvider initialSettings={initialSettings}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </DataProvider>
    </AuthProvider>
  );
}
