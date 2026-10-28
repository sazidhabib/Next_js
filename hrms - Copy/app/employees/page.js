'use client';

import React from 'react';
import EmployeeManagement from '@/components/employees/EmployeeManagement';
import { useData } from '@/context/DataContext';

export default function EmployeesPage() {
  const { departments, refreshAllData } = useData();

  return (
    <EmployeeManagement
      departments={departments}
      onEmployeeUpdated={refreshAllData}
    />
  );
}
