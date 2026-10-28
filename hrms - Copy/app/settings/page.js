'use client';

import React from 'react';
import SettingsManagement from '@/components/settings/SettingsManagement';
import { useData } from '@/context/DataContext';

export default function SettingsPage() {
  const { settings, setSettings, refreshAllData } = useData();

  return (
    <SettingsManagement
      settings={settings}
      onSettingsUpdated={(updatedSettings) => {
        setSettings(updatedSettings);
        refreshAllData();
      }}
    />
  );
}
