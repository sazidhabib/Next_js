'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
}
