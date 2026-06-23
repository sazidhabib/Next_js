'use client';

import React from 'react';
import { useEditorStore, editorStore, getClipFromState } from '../../store/editorStore';

interface EffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EffectsModal({ isOpen, onClose }: EffectsModalProps) {
  const selectedClip = useEditorStore((state) => getClipFromState(state, state.selectedClipId));
  const selectedClipId = selectedClip?.id || null;

  const handleApplyEffect = (effectName: string) => {
    if (!selectedClipId || !selectedClip) return;
    const currentEffects = selectedClip.appliedEffects || [];
    if (!currentEffects.includes(effectName)) {
      editorStore.updateClip(selectedClipId, {
        appliedEffects: [...currentEffects, effectName],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-[500px] h-full bg-surface border-l border-outline-variant flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary block">auto_fix_high</span>
            <h2 className="font-headline-md text-headline-md font-bold">VFX & Filter Library</h2>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-white text-lg block cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {!selectedClip ? (
            <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-center text-on-surface-variant text-xs space-y-2">
              <span className="material-symbols-outlined text-3xl opacity-30 block">info</span>
              <p>Please select a video clip on the timeline first to apply filters.</p>
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg text-xs text-primary flex items-center justify-between">
              <span>Applying filter to: <strong>{selectedClip.name}</strong></span>
              <span className="material-symbols-outlined text-sm font-bold block">verified</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Trending Effects</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Chromatic Aberration', category: 'Glitch', details: 'Splits RGB edge channels', border: 'hover:border-primary' },
                { name: 'Emerald Forest', category: 'LUT Cinema', details: 'Cool deep forest cinematic grade', border: 'hover:border-secondary' },
                { name: 'Vintage 35mm', category: 'LUT Film', details: 'Retro grain with high contrast', border: 'hover:border-tertiary' },
                { name: 'VHS Overdrive', category: 'Glitch Distortion', details: 'Standard tracking line wobble', border: 'hover:border-red-500' },
                { name: 'Radial Motion', category: 'Blur Transition', details: 'Circular speed lines blur', border: 'hover:border-primary' },
                { name: 'Digital Flux', category: 'Transition', details: 'RGB shifting transition leak', border: 'hover:border-purple-500' }
              ].map((fx, idx) => (
                <div 
                  key={idx}
                  className={`effect-card group relative bg-surface-container-high border border-outline-variant rounded-lg overflow-hidden transition-all ${fx.border}`}
                >
                  <div className="h-24 bg-surface-container-lowest flex items-center justify-center relative overflow-hidden">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant/40 block">filter_hdr</span>
                    
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-xs">
                      <button 
                        disabled={!selectedClip}
                        onClick={() => handleApplyEffect(fx.name)}
                        className={`px-3 py-1.5 rounded-full font-label-caps text-label-caps font-bold shadow-lg transition-all text-xs cursor-pointer ${
                          selectedClip
                            ? 'bg-primary text-on-primary hover:scale-105 active:scale-95'
                            : 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-semibold text-xs text-on-surface truncate max-w-[120px]">{fx.name}</h4>
                      <span className="bg-surface-container-highest text-on-surface-variant text-[8px] px-1 rounded uppercase font-bold">{fx.category}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-tight">{fx.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
