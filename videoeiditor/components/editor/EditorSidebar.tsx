'use client';

import React from 'react';
import { editorStore } from '../../store/editorStore';

interface EditorSidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onEffectsClick: () => void;
}

export default function EditorSidebar({ activeTool, setActiveTool, onEffectsClick }: EditorSidebarProps) {
  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
    
    // Custom triggers based on tool selection
    if (toolName === 'text') {
      // Add a default text clip on the playhead time
      const currentTime = editorStore.getState().playheadTime;
      editorStore.addTextClip(currentTime);
    } else if (toolName === 'effects') {
      onEffectsClick();
    }
  };

  return (
    <aside className="fixed left-0 top-toolbar-height bottom-0 flex flex-col items-center py-panel-padding z-40 bg-surface-container border-r border-outline-variant w-16">
      {/* Icon logo representation */}
      <div className="mb-4 flex flex-col items-center gap-1 opacity-60">
        <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center text-on-primary-container">
          <span className="material-symbols-outlined text-sm font-bold block">movie</span>
        </div>
      </div>

      {/* Toolbox buttons */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        <button
          onClick={() => handleToolClick('select')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'select'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Selection (V)"
        >
          <span className="material-symbols-outlined block">near_me</span>
        </button>

        <button
          onClick={() => handleToolClick('blade')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'blade'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Blade / Split (C)"
        >
          <span className="material-symbols-outlined block">content_cut</span>
        </button>

        <button
          onClick={() => handleToolClick('text')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'text'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Add Text Layer (T)"
        >
          <span className="material-symbols-outlined block">title</span>
        </button>

        <button
          onClick={() => handleToolClick('transitions')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'transitions'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Transitions Library"
        >
          <span className="material-symbols-outlined block">animation</span>
        </button>

        <button
          onClick={() => handleToolClick('effects')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'effects'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Effects & Filters"
        >
          <span className="material-symbols-outlined block">auto_fix_high</span>
        </button>

        <button
          onClick={() => handleToolClick('audio')}
          className={`mx-2 p-2 rounded-lg flex items-center justify-center transition-all ${
            activeTool === 'audio'
              ? 'bg-primary text-on-primary scale-95'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          }`}
          title="Audio Library"
        >
          <span className="material-symbols-outlined block">volume_up</span>
        </button>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2 w-full mt-auto">
        <button
          className="text-on-surface-variant mx-2 p-2 rounded-lg flex items-center justify-center hover:bg-surface-container-highest hover:text-on-surface"
          title="Help"
        >
          <span className="material-symbols-outlined block">help</span>
        </button>
        <button
          className="text-on-surface-variant mx-2 p-2 rounded-lg flex items-center justify-center hover:bg-surface-container-highest hover:text-on-surface"
          title="Trash"
        >
          <span className="material-symbols-outlined block">delete</span>
        </button>
      </div>
    </aside>
  );
}
