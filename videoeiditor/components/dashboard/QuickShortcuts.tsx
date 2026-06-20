'use client';

import React from 'react';

export default function QuickShortcuts() {
  return (
    <div className="bento-card rounded-xl p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="font-headline-md text-headline-md font-bold mb-4">Quick Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-highest rounded transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary block">auto_fix_high</span>
              <span className="text-sm font-medium">Auto-generate Proxies</span>
            </div>
            <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              arrow_forward
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-highest rounded transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary block">movie_edit</span>
              <span className="text-sm font-medium">Consolidate Project</span>
            </div>
            <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              arrow_forward
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-highest rounded transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-[#ffb95f] block">folder_zip</span>
              <span className="text-sm font-medium">Archive to Cold Storage</span>
            </div>
            <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              arrow_forward
            </span>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-outline-variant flex items-center gap-3 mt-6">
        <span className="material-symbols-outlined text-on-surface-variant block">speed</span>
        <span className="text-xs text-on-surface-variant">
          System performance: <span className="text-secondary font-bold">Optimal</span>
        </span>
      </div>
    </div>
  );
}
