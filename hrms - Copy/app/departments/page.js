'use client';

import React from 'react';
import DepartmentManagement from '@/components/departments/DepartmentManagement';
import { useData } from '@/context/DataContext';

export default function DepartmentsPage() {
  const { departments, refreshAllData } = useData();

  return (
    <DepartmentManagement
      departments={departments}
      onUpdated={refreshAllData}
    />
  );
}
