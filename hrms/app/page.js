'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';
import { useData } from '@/context/DataContext';

export default function HomePage() {
  const { stats, alerts } = useData();
  const router = useRouter();

  const handleNavigate = (tab) => {
    if (!tab || tab === 'dashboard') {
      router.push('/');
    } else {
      router.push(`/${tab}`);
    }
  };

  return (
    <DashboardView
      stats={stats}
      alerts={alerts}
      onNavigate={handleNavigate}
    />
  );
}
