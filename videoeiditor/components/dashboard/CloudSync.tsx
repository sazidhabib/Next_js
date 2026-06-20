'use client';

import React from 'react';

export default function CloudSync() {
  return (
    <div className="bento-card rounded-xl p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-headline-md font-bold">Cloud Sync Status</h3>
          <span className="text-xs font-mono-data text-secondary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse block"></span>
            Live
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Primary Workspace (S3-Region-1)</span>
            <span className="font-mono-data text-xs">428 GB / 1 TB</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[42%] transition-all duration-500"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant mt-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-on-surface-variant tracking-wider font-label-caps">Video Assets</span>
          <span className="text-lg font-bold">312.4 GB</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-on-surface-variant tracking-wider font-label-caps">Audio Files</span>
          <span className="text-lg font-bold">84.2 GB</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-on-surface-variant tracking-wider font-label-caps">Proxies</span>
          <span className="text-lg font-bold">31.4 GB</span>
        </div>
      </div>
    </div>
  );
}
