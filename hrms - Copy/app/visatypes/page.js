'use client';

import React from 'react';
import VisaTypeManagement from '@/components/visatypes/VisaTypeManagement';
import { useData } from '@/context/DataContext';

export default function VisaTypesPage() {
  const { visaTypes, refreshAllData } = useData();

  return (
    <VisaTypeManagement
      visaTypes={visaTypes}
      onUpdated={refreshAllData}
    />
  );
}
