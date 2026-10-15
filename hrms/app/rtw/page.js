'use client';

import React from 'react';
import RightToWorkManagement from '@/components/rtw/RightToWorkManagement';
import { useData } from '@/context/DataContext';

export default function RightToWorkPage() {
  const { employees, refreshAllData } = useData();

  return (
    <RightToWorkManagement
      employees={employees}
      onUpdated={refreshAllData}
    />
  );
}
