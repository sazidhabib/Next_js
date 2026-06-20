'use client';

import React, { useState, useRef } from 'react';
import { useEditorStore, editorStore, MediaAsset } from '../../store/editorStore';

interface LibraryPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function LibraryPanel({ activeTab, setActiveTab }: LibraryPanelProps) {
  const mediaAssets = useEditorStore((state) => state.mediaAssets);
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const [searchQuery, setSearchQuery] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = mediaAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'image';
      
      const fileUrl = URL.createObjectURL(file);
      
      // Setup dummy duration for visual testing (video = 10s, audio = 30s, image = 5s)
      const duration = type === 'video' ? 10 : (type === 'audio' ? 30 : 5);

      editorStore.addMediaAsset({
        name: file.name,
        type,
        url: fileUrl,
        duration,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        thumbnail: type === 'video' 
          ? 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80' 
          : (type === 'audio'
            ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'
            : fileUrl),
      });
    }
  };

  const handleAddToTimeline = (asset: MediaAsset) => {
    const track = asset.type === 'video' ? 'V1' : (asset.type === 'audio' ? 'A1' : 'V2');
    editorStore.addClipToTrack(track, asset, playheadTime);
  };

  const handleAutoTranscribe = () => {
    if (transcribing) return;
    setTranscribing(true);
    
    // Simulate speech-to-text processing for 2 seconds
    setTimeout(() => {
      // Create subtitles at specific intervals on track V3 (Text)
      const subTimings = [
        { time: 1.0, duration: 3.5, text: "Hey guys! Welcome back to my editing channel." },
        { time: 5.5, duration: 4.0, text: "Today we are looking at this beautiful urban cyber city footage." },
        { time: 10.0, duration: 4.5, text: "Make sure to hit subscribe and check the links below." },
      ];

      subTimings.forEach((sub, index) => {
        const textClip = {
          id: `c_sub_${Date.now()}_${index}`,
          name: `Subtitle ${index + 1}`,
          type: 'text' as const,
          startTime: sub.time,
          duration: sub.duration,
          text: sub.text,
          opacity: 100,
          scale: 100,
          positionX: 0,
          positionY: 80, // Put it at the bottom of video preview
          rotation: 0,
          color: 'bg-black/60 border border-white/20 text-white px-2 py-0.5 rounded text-center font-bold tracking-tight',
        };
        
        editorStore.getState().tracks.V3.push(textClip);
      });

      editorStore.setPlayheadTime(1.0); // jump playhead to first subtitle
      setTranscribing(false);
    }, 2000);
  };

  return (
    <section className="w-80 flex flex-col bg-surface border-r border-outline-variant select-none h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-outline-variant overflow-x-auto no-scrollbar flex-shrink-0">
        {[
          { id: 'media', label: 'My Media' },
          { id: 'templates', label: 'Templates' },
          { id: 'elements', label: 'Elements' },
          { id: 'audio', label: 'Audio' },
          { id: 'text', label: 'Text / Captions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-label-caps text-label-caps whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'text-primary font-bold border-b border-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
        
        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <>
            <div className="p-3 flex items-center gap-2 flex-shrink-0">
              <div className="flex-1 bg-surface-container-low border border-outline-variant rounded px-2 py-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm opacity-50 block">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:ring-0 text-on-surface outline-none"
                  placeholder="Search media..."
                />
              </div>
              <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1 rounded cursor-pointer block">
                filter_list
              </button>
            </div>

            <div className="flex-1 p-3 grid grid-cols-2 gap-3 auto-rows-max">
              {/* Media Cards */}
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="flex flex-col group cursor-pointer">
                  <div className="aspect-video bg-surface-container-highest rounded border border-outline-variant overflow-hidden relative">
                    <img className="w-full h-full object-cover" src={asset.thumbnail} alt={asset.name} />
                    <span className="absolute bottom-1 right-1 px-1 bg-black/70 text-[9px] rounded font-mono-data">
                      {Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, '0')}
                    </span>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleAddToTimeline(asset)}
                        className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                        title="Add to timeline"
                      >
                        <span className="material-symbols-outlined text-sm block font-bold">add</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] mt-1 truncate text-on-surface-variant font-medium group-hover:text-primary transition-colors">
                    {asset.name}
                  </span>
                </div>
              ))}

              {/* Import placeholder */}
              <div 
                onClick={handleImportClick}
                className="flex flex-col cursor-pointer"
              >
                <div className="aspect-video bg-surface-container-high rounded border border-dashed border-outline-variant hover:border-primary flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined block text-lg font-bold">add</span>
                  <span className="text-[9px] font-label-caps uppercase mt-1">Import file</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*,audio/*,image/*"
                multiple
                className="hidden"
              />
            </div>
          </>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="p-4 space-y-4">
            <h4 className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Project Presets</h4>
            <div className="space-y-3">
              {[
                { name: '4K Intro Sequence', details: '3840x2160 • 60fps', desc: 'Pre-timed text placeholders and audio sweeps' },
                { name: '9:16 Shorts Template', details: '1080x1920 • 30fps', desc: 'Centered safety margin frames with light leak effects' },
                { name: 'Cinematic Cinematic Pan', details: '3840x1634 • 24fps', desc: 'Widescreen bars with warm golden grade settings' }
              ].map((tmpl, idx) => (
                <div key={idx} className="bento-card p-3 rounded-lg hover:border-primary cursor-pointer transition-colors" onClick={() => editorStore.createNewProject(tmpl.name)}>
                  <div className="font-semibold text-xs text-on-surface mb-0.5">{tmpl.name}</div>
                  <div className="text-[10px] text-primary font-mono-data mb-1">{tmpl.details}</div>
                  <div className="text-[10px] text-on-surface-variant">{tmpl.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="p-3 grid grid-cols-2 gap-3">
            {[
              { name: 'Light Leak Overlay', type: 'overlay', color: 'bg-yellow-500/20 border-yellow-500' },
              { name: 'Color Gradient Flare', type: 'overlay', color: 'bg-purple-500/20 border-purple-500' },
              { name: 'Film Grain Filter', type: 'overlay', color: 'bg-gray-500/20 border-gray-500' },
              { name: 'Glitch Distortion', type: 'overlay', color: 'bg-red-500/20 border-red-500' },
            ].map((el, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  const dummyAsset = {
                    id: `e_${idx}`,
                    name: el.name,
                    type: 'image' as const,
                    url: '',
                    duration: 8,
                    size: '0 MB',
                    thumbnail: '',
                  };
                  editorStore.addClipToTrack('V2', dummyAsset, playheadTime);
                }}
                className="border border-outline-variant hover:border-primary bg-surface-container-high rounded p-2 flex flex-col justify-between items-center text-center cursor-pointer transition-colors aspect-video"
              >
                <span className="material-symbols-outlined text-xl text-on-surface-variant block">broken_image</span>
                <span className="text-[10px] text-on-surface-variant mt-1 font-medium">{el.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'audio' && (
          <div className="p-3 space-y-2">
            {[
              { name: 'Upbeat Cinematic Beats.mp3', duration: 180, details: '128bpm • Vlog Pop' },
              { name: 'Moody Electronic Synth.wav', duration: 124, details: '95bpm • Sci-Fi Synth' },
              { name: 'Soft Acoustic Guitar.mp3', duration: 240, details: '78bpm • Chill Ambient' },
              { name: 'Swoosh Transition SFX.wav', duration: 3, details: 'SFX • Cinematic Sweep' },
            ].map((snd, idx) => (
              <div 
                key={idx} 
                className="bento-card p-3 rounded-lg flex items-center justify-between hover:border-primary transition-colors cursor-pointer group"
                onClick={() => {
                  const dummyAsset = {
                    id: `a_preset_${idx}`,
                    name: snd.name,
                    type: 'audio' as const,
                    url: '',
                    duration: snd.duration,
                    size: '4.2 MB',
                    thumbnail: '',
                  };
                  editorStore.addClipToTrack('A2', dummyAsset, playheadTime);
                }}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-on-surface truncate pr-2">{snd.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{snd.details}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-data text-on-surface-variant">
                    {Math.floor(snd.duration / 60)}:{(snd.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xs block font-bold">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TEXT & CAPTIONS TAB */}
        {activeTab === 'text' && (
          <div className="p-4 space-y-6">
            {/* Auto transcription */}
            <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary block">closed_caption</span>
                <span className="text-xs font-bold uppercase font-label-caps">AI Audio Transcription</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Scan audio tracks A1/A2 and generate automatic synchronized caption subtitles instantly using client speech engines.
              </p>
              <button 
                onClick={handleAutoTranscribe}
                disabled={transcribing}
                className={`w-full py-2 rounded font-label-caps text-label-caps font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  transcribing
                    ? 'bg-surface-container-highest text-on-surface-variant opacity-80 cursor-wait'
                    : 'bg-primary text-on-primary hover:brightness-105 active:scale-95 shadow-md'
                }`}
              >
                {transcribing ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin block">sync</span>
                    <span>Transcribing Audio...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs block">mic</span>
                    <span>Transcribe Speech</span>
                  </>
                )}
              </button>
            </div>

            {/* Text elements list */}
            <div className="space-y-3">
              <h4 className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Typography Elements</h4>
              
              <div 
                onClick={() => editorStore.addTextClip(playheadTime)}
                className="border border-outline-variant border-dashed p-3 rounded-lg hover:border-primary cursor-pointer text-center text-xs text-on-surface-variant hover:text-on-surface transition-colors"
              >
                + Add Custom Title
              </div>

              {[
                { name: 'Minimal Lower Third', desc: 'Subtitle alignment left-border', color: 'border-l-2 border-primary pl-2' },
                { name: 'Big Bold Cinematic Intro', desc: 'Centered, high tracking, caps', color: 'font-bold uppercase tracking-widest text-center' },
                { name: 'Glitch Title Overlay', desc: 'Separated RGB channel styling', color: 'text-secondary line-through' }
              ].map((style, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    const textClip = {
                      id: `c_txt_preset_${idx}`,
                      name: style.name,
                      type: 'text' as const,
                      startTime: playheadTime,
                      duration: 4,
                      text: style.name.toUpperCase(),
                      opacity: 100,
                      scale: 100,
                      positionX: 0,
                      positionY: idx === 0 ? 60 : 0,
                      rotation: 0,
                      color: 'bg-primary-container/20 border border-primary/30 text-primary',
                    };
                    editorStore.getState().tracks.V3.push(textClip);
                    editorStore.getState().selectedClipId = textClip.id;
                    editorStore.setPlayheadTime(playheadTime);
                  }}
                  className="bento-card p-3 rounded-lg hover:border-primary transition-colors cursor-pointer"
                >
                  <div className={`font-semibold text-xs mb-0.5 ${style.color}`}>{style.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{style.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
