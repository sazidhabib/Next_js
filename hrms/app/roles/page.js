'use client';

import React from 'react';
import RoleManagement from '@/components/roles/RoleManagement';
import { useData } from '@/context/DataContext';

export default function RolesPage() {
  const { refreshAllData } = useData();

  return <RoleManagement onUpdated={refreshAllData} />;
}
