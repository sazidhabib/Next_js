'use client';

import React from 'react';
import UserManagement from '@/components/users/UserManagement';
import { useData } from '@/context/DataContext';

export default function UsersPage() {
  const { employees, refreshAllData } = useData();

  return (
    <UserManagement
      employees={employees}
      onUpdated={refreshAllData}
    />
  );
}
