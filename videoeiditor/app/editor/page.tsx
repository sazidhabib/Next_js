'use client';

import React, { useEffect, useState } from 'react';
import EditorHeader from '../../components/editor/EditorHeader';
import EditorSidebar from '../../components/editor/EditorSidebar';
import LibraryPanel from '../../components/editor/LibraryPanel';
import PreviewMonitor from '../../components/editor/PreviewMonitor';
import InspectorPanel from '../../components/editor/InspectorPanel';
import AICommandBar from '../../components/editor/AICommandBar';
import Timeline from '../../components/editor/Timeline';
import EffectsModal from '../../components/editor/EffectsModal';
import ExportModal from '../../components/editor/ExportModal';
import { editorStore } from '../../store/editorStore';

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState('select');
  const [libraryTab, setLibraryTab] = useState('media');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          editorStore.redo();
        } else {
          editorStore.undo();
        }
        return;
      }

      if (isMod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        editorStore.redo();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        editorStore.setPlaying(!editorStore.getState().isPlaying);
        return;
      }

      if (!isMod && e.key.toLowerCase() === 'v') {
        setActiveTool('select');
        return;
      }

      if (!isMod && e.key.toLowerCase() === 'c') {
        setActiveTool('blade');
        return;
      }

      if (!isMod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        editorStore.splitAtPlayhead();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedId = editorStore.getState().selectedClipId;
        if (selectedId) {
          e.preventDefault();
          editorStore.deleteClip(selectedId);
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.1;
        editorStore.setPlayheadTime(editorStore.getState().playheadTime - step);
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.1;
        editorStore.setPlayheadTime(editorStore.getState().playheadTime + step);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface select-none">
      {/* Editor Header */}
      <EditorHeader onExportClick={() => setIsExportOpen(true)} />

      {/* Editor Main Content container */}
      <div className="flex flex-1 pt-toolbar-height h-[calc(100vh-48px)] overflow-hidden">
        {/* Editor Side Toolbox Navbar */}
        <EditorSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onEffectsClick={() => setIsEffectsOpen(true)}
        />

        {/* Central Workspace area: columns left library, center player, right properties */}
        <div className="flex-1 ml-16 flex flex-col h-full overflow-hidden">
          {/* Upper row workspace split */}
          <div className="flex-1 flex overflow-hidden border-b border-outline-variant">
            {/* Left Library tabs panel */}
            <LibraryPanel activeTab={libraryTab} setActiveTab={setLibraryTab} />

            {/* Center preview display monitor player */}
            <PreviewMonitor />

            {/* Right inspector properties controller sidebar */}
            <InspectorPanel />
          </div>

          {/* AI Director Command Bar */}
          <AICommandBar />

          {/* Lower multi-track timeline controller */}
          <Timeline activeTool={activeTool} setActiveTool={setActiveTool} />
        </div>
      </div>

      {/* Effects modal */}
      <EffectsModal isOpen={isEffectsOpen} onClose={() => setIsEffectsOpen(false)} />

      {/* Export parameters render dialog */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
