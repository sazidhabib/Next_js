'use client';

import React from 'react';
import LeaveManagement from '@/components/leave/LeaveManagement';
import { useData } from '@/context/DataContext';

export default function LeavePage() {
  const { employees, refreshAllData } = useData();

  return (
    <LeaveManagement
      employees={employees}
      onUpdated={refreshAllData}
    />
  );
}
