'use client';

import React from 'react';
import ImmigrationManagement from '@/components/immigration/ImmigrationManagement';
import { useData } from '@/context/DataContext';

export default function ImmigrationPage() {
  const { employees, visaTypes, refreshAllData } = useData();

  return (
    <ImmigrationManagement
      employees={employees}
      visaTypes={visaTypes}
      onUpdated={refreshAllData}
    />
  );
}
