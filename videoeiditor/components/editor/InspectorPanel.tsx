'use client';

import React, { useRef } from 'react';
import { useEditorStore, editorStore, getClipFromState } from '../../store/editorStore';

export default function InspectorPanel() {
  const selectedClip = useEditorStore((state) => getClipFromState(state, state.selectedClipId));
  const selectedClipId = selectedClip?.id || null;

  const startXRef = useRef(0);
  const startValRef = useRef(0);

  const handleUpdate = (updates: any) => {
    if (!selectedClipId) return;
    editorStore.updateClip(selectedClipId, updates);
  };

  const handleScrubStart = (e: React.MouseEvent, propName: string, initialVal: number, step = 1) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startValRef.current = initialVal;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startXRef.current;
      const newVal = parseFloat((startValRef.current + diff * step).toFixed(1));
      
      // Clamp specific properties
      if (propName === 'opacity') {
        handleUpdate({ opacity: Math.max(0, Math.min(100, newVal)) });
      } else if (propName === 'scale') {
        handleUpdate({ scale: Math.max(10, Math.min(200, newVal)) });
      } else if (propName === 'volume') {
        handleUpdate({ volume: Math.max(0, Math.min(100, newVal)) });
      } else if (propName === 'rotation') {
        handleUpdate({ rotation: newVal % 360 });
      } else {
        handleUpdate({ [propName]: newVal });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRemoveEffect = (effectName: string) => {
    if (!selectedClip) return;
    const currentEffects = selectedClip.appliedEffects || [];
    handleUpdate({
      appliedEffects: currentEffects.filter((e) => e !== effectName),
    });
  };

  const handleAddEffectClick = () => {
    if (!selectedClip) return;
    const currentEffects = selectedClip.appliedEffects || [];
    if (!currentEffects.includes('Chromatic Aberration')) {
      handleUpdate({
        appliedEffects: [...currentEffects, 'Chromatic Aberration'],
      });
    }
  };

  if (!selectedClip) {
    return (
      <section className="w-72 flex flex-col bg-surface border-l border-outline-variant h-full select-none justify-center items-center text-center p-6 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl opacity-30 block mb-2">info</span>
        <h3 className="font-semibold text-sm mb-1">No Selection</h3>
        <p className="text-xs opacity-50 max-w-[180px]">
          Select a clip on the timeline or double-click to load properties.
        </p>
      </section>
    );
  }

  const isVideo = selectedClip.type === 'video';
  const isAudio = selectedClip.type === 'audio';
  const isText = selectedClip.type === 'text';
  const isOverlay = selectedClip.type === 'overlay';

  return (
    <section className="w-72 flex flex-col bg-surface border-l border-outline-variant h-full select-none overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-outline-variant flex-shrink-0">
        <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Inspector</span>
        <button 
          onClick={() => editorStore.setSelectedClipId(null)}
          className="material-symbols-outlined text-on-surface-variant hover:text-white text-lg block cursor-pointer"
        >
          close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        
        {/* Info Clip Card */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3">
          <div className="text-[10px] text-primary uppercase font-bold font-mono-data mb-1">
            {selectedClip.type} CLIP
          </div>
          <div className="font-semibold text-xs text-on-surface truncate">
            {selectedClip.name}
          </div>
        </div>

        {/* Text Input Panel for titles */}
        {isText && (
          <div className="space-y-2">
            <label className="text-[10px] text-on-surface-variant uppercase font-label-caps font-bold">
              Text Content
            </label>
            <textarea
              value={selectedClip.text || ''}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface h-16 resize-none"
            />
          </div>
        )}

        {/* Transform settings (video & texts & overlays) */}
        {(isVideo || isText || isOverlay) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Transform</span>
              <button 
                onClick={() => handleUpdate({ scale: 100, positionX: 0, positionY: 0, rotation: 0 })}
                className="material-symbols-outlined text-[12px] text-on-surface-variant hover:text-white cursor-pointer"
                title="Reset transforms"
              >
                replay
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Position X</span>
                <span 
                  onMouseDown={(e) => handleScrubStart(e, 'positionX', selectedClip.positionX || 0, 1)}
                  className="text-primary scrubbable font-mono-data cursor-ew-resize hover:text-[#adc6ff]"
                >
                  {selectedClip.positionX || 0} px
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Position Y</span>
                <span 
                  onMouseDown={(e) => handleScrubStart(e, 'positionY', selectedClip.positionY || 0, 1)}
                  className="text-primary scrubbable font-mono-data cursor-ew-resize hover:text-[#adc6ff]"
                >
                  {selectedClip.positionY || 0} px
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Scale</span>
                <div className="flex items-center gap-1">
                  <span 
                    onMouseDown={(e) => handleScrubStart(e, 'scale', selectedClip.scale || 100, 1)}
                    className="text-primary scrubbable font-mono-data cursor-ew-resize hover:text-[#adc6ff]"
                  >
                    {(selectedClip.scale || 100).toFixed(1)}%
                  </span>
                  <span className="material-symbols-outlined text-[12px] text-on-surface-variant opacity-50">link</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Rotation</span>
                <span 
                  onMouseDown={(e) => handleScrubStart(e, 'rotation', selectedClip.rotation || 0, 0.5)}
                  className="text-primary scrubbable font-mono-data cursor-ew-resize hover:text-[#adc6ff]"
                >
                  {(selectedClip.rotation || 0).toFixed(1)}°
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Compositing (video & texts & overlays) */}
        {(isVideo || isText || isOverlay) && (
          <div className="pt-4 border-t border-outline-variant space-y-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Compositing</span>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Opacity</span>
                <span 
                  onMouseDown={(e) => handleScrubStart(e, 'opacity', selectedClip.opacity || 100, 1)}
                  className="text-primary scrubbable font-mono-data cursor-ew-resize hover:text-[#adc6ff]"
                >
                  {selectedClip.opacity ?? 100}%
                </span>
              </div>
              <div 
                className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  handleUpdate({ opacity: Math.round(pct * 100) });
                }}
              >
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${selectedClip.opacity ?? 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface-variant">Blend Mode</span>
                <div className="bg-surface-container-high border border-outline-variant px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <span>{selectedClip.blendMode || 'Normal'}</span>
                  <span className="material-symbols-outlined text-[12px] block">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Volume (audio & videos) */}
        {(isAudio || isVideo) && (
          <div className="pt-4 border-t border-outline-variant space-y-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Audio Mixer</span>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Volume</span>
                <span 
                  onMouseDown={(e) => handleScrubStart(e, 'volume', selectedClip.volume ?? 100, 1)}
                  className="text-secondary scrubbable font-mono-data cursor-ew-resize hover:text-white"
                >
                  {selectedClip.volume ?? 100} dB
                </span>
              </div>
              <div 
                className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  handleUpdate({ volume: Math.round(pct * 100) });
                }}
              >
                <div 
                  className="h-full bg-secondary rounded-full" 
                  style={{ width: `${selectedClip.volume ?? 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* VFX Filter Stack */}
        {(isVideo || isOverlay) && (
          <div className="pt-4 border-t border-outline-variant space-y-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-2">Applied Effects</span>
            
            <div className="flex flex-wrap gap-2">
              {selectedClip.appliedEffects?.map((effectName) => (
                <div 
                  key={effectName} 
                  className="bg-primary-container/20 border border-primary/30 px-2 py-1 rounded flex items-center gap-1.5 text-[10px]"
                >
                  <span className="text-primary font-bold">{effectName}</span>
                  <span 
                    onClick={() => handleRemoveEffect(effectName)}
                    className="material-symbols-outlined text-[10px] cursor-pointer hover:text-white block font-bold"
                  >
                    close
                  </span>
                </div>
              ))}
              
              <button 
                onClick={handleAddEffectClick}
                className="bg-surface-container-high border border-outline-variant border-dashed hover:border-primary hover:text-primary px-2.5 py-1 rounded text-[10px] text-on-surface-variant flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[10px] block font-bold">add</span>
                Add Chromatic Aberration
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* Rendering Cache Status */}
      <div className="mt-auto p-4 border-t border-outline-variant flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Rendering cache: 84%</span>
        </div>
        <div className="h-1 bg-surface-container rounded-full overflow-hidden">
          <div className="w-[84%] h-full bg-secondary"></div>
        </div>
      </div>

    </section>
  );
}
