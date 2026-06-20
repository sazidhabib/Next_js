'use client';

import React from 'react';
import Link from 'next/link';
import { useEditorStore } from '../../store/editorStore';

interface EditorHeaderProps {
  onExportClick: () => void;
}

export default function EditorHeader({ onExportClick }: EditorHeaderProps) {
  const currentProjectName = useEditorStore((state) => {
    // Show the first project's name or custom fallback
    return state.projects[0]?.name || 'Project Alpha_V1';
  });

  return (
    <header className="flex justify-between items-center w-full px-panel-padding h-toolbar-height z-50 bg-surface border-b border-outline-variant fixed top-0 left-0 right-0">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-95 transition-opacity">
          CineFlow Pro
        </Link>
        <div className="text-xs bg-surface-container-high border border-outline-variant px-2 py-0.5 rounded font-mono-data text-on-surface-variant max-w-[120px] sm:max-w-none truncate">
          {currentProjectName}
        </div>
        <nav className="hidden lg:flex gap-4">
          <Link className="text-primary font-bold border-b-2 border-primary pb-0.5 font-label-caps text-label-caps" href="#">
            File
          </Link>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Edit
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Sequence
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Clip
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Graphics
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            View
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded transition-all text-xl block cursor-pointer">
          notifications
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded transition-all text-xl block cursor-pointer">
          settings
        </button>
        
        <button className="px-4 py-1.5 bg-surface-container-highest border border-outline-variant text-on-surface rounded font-label-caps text-label-caps hover:bg-surface-bright transition-all cursor-pointer">
          Share
        </button>
        <button 
          onClick={onExportClick}
          className="px-4 py-1.5 bg-primary text-on-primary rounded font-label-caps text-label-caps font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/10"
        >
          Export
        </button>
        
        <div className="w-8 h-8 rounded-full overflow-hidden ml-2 border border-outline-variant flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH0pVIY_MOg3rrLUk7mhO6Pge3q7hln_2dTNfaDhmiIW0nilOspZUHXyKSb4-BCMVzMx1_edVgBBlJrXMfDf4fG_p2tA-F8MhpzlZTUvw14uTs4LXmMbXtrAEIHLVX1bah4ziOaJMupqOCgzbKz30kmqncdG17qfB8Ke-VzadqEutusgqa55F-BofK_rNWZPB4wI7PgxbbSr7_slwIRqYJzHvsv8jT1VSJJCF5sjF8MMou5dtf0PWDFaN814mSf3WPtEF7g0oDqwmc"
          />
        </div>
      </div>
    </header>
  );
}
