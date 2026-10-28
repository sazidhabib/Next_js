'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

export default function AppProviders({ children, initialSettings }) {
  return (
    <AuthProvider>
      <DataProvider initialSettings={initialSettings}>{children}</DataProvider>
    </AuthProvider>
  );
}
