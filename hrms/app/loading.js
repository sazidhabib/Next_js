'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Loading() {
  const [logo, setLogo] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('hrms_public_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          return parsed?.appLogo || '';
        }
      } catch (e) {}
    }
    return '';
  });

  const [appName, setAppName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('hrms_public_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          return parsed?.appName || 'HRMS Pro';
        }
      } catch (e) {}
    }
    return 'HRMS Pro';
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.settings) {
          if (data.settings.appLogo) setLogo(data.settings.appLogo);
          if (data.settings.appName) setAppName(data.settings.appName);
          try {
            localStorage.setItem('hrms_public_settings', JSON.stringify(data.settings));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4 select-none">
      {logo ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 animate-pulse">
            <img
              src={logo}
              alt={appName}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {appName && (
            <h2 className="text-lg font-bold tracking-tight text-white/90">
              {appName}
            </h2>
          )}
        </div>
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      )}
      <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        <span>Connecting to secure workspace...</span>
      </div>
    </div>
  );
}
