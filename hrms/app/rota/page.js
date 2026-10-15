'use client';

import React from 'react';
import RotaManagement from '@/components/rota/RotaManagement';
import { useData } from '@/context/DataContext';

export default function RotaPage() {
  const { employees } = useData();

  return (
    <RotaManagement
      employees={employees || []}
    />
  );
}
