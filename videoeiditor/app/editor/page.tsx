'use client';

import React, { useState } from 'react';
import EditorHeader from '../../components/editor/EditorHeader';
import EditorSidebar from '../../components/editor/EditorSidebar';
import LibraryPanel from '../../components/editor/LibraryPanel';
import PreviewMonitor from '../../components/editor/PreviewMonitor';
import InspectorPanel from '../../components/editor/InspectorPanel';
import Timeline from '../../components/editor/Timeline';
import EffectsModal from '../../components/editor/EffectsModal';
import ExportModal from '../../components/editor/ExportModal';

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState('select');
  const [libraryTab, setLibraryTab] = useState('media');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);

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
            <LibraryPanel 
              activeTab={libraryTab} 
              setActiveTab={setLibraryTab} 
            />

            {/* Center preview display monitor player */}
            <PreviewMonitor />

            {/* Right inspector properties controller sidebar */}
            <InspectorPanel />

          </div>

          {/* Lower multi-track timeline controller */}
          <Timeline />

        </div>

      </div>

      {/* Effects modal */}
      <EffectsModal 
        isOpen={isEffectsOpen} 
        onClose={() => setIsEffectsOpen(false)} 
      />

      {/* Export parameters render dialog */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />

    </div>
  );
}
