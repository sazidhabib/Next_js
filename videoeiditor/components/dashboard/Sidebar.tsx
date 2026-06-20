'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  activeTab?: string;
}

export default function Sidebar({ activeTab = 'home' }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-toolbar-height bottom-0 w-16 flex flex-col items-center py-panel-padding z-40 border-r border-outline-variant bg-surface-container">
      <div className="flex flex-col gap-2 w-full items-center">
        <Link 
          href="/" 
          className={`w-10 h-10 flex items-center justify-center rounded-lg mx-2 my-1 transition-all ${
            activeTab === 'home' 
              ? 'bg-primary text-on-primary active:scale-90' 
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
          title="Home"
        >
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link 
          href="/editor" 
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant mx-2 my-1 hover:bg-surface-container-highest rounded-lg transition-all"
          title="Templates / Editor"
        >
          <span className="material-symbols-outlined">auto_fix_high</span>
        </Link>
        <Link 
          href="/editor" 
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant mx-2 my-1 hover:bg-surface-container-highest rounded-lg transition-all"
          title="Media Library"
        >
          <span className="material-symbols-outlined">perm_media</span>
        </Link>
        <button 
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant mx-2 my-1 hover:bg-surface-container-highest rounded-lg transition-all"
          title="Collaboration"
        >
          <span className="material-symbols-outlined">group</span>
        </button>
      </div>
      
      <div className="mt-auto flex flex-col gap-2 w-full items-center">
        <button 
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant mx-2 my-1 hover:bg-surface-container-highest rounded-lg transition-all"
          title="Help"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center text-on-surface-variant mx-2 my-1 hover:bg-surface-container-highest rounded-lg transition-all"
          title="Trash"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </aside>
  );
}
