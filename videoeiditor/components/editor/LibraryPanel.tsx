'use client';

import React, { useState, useRef } from 'react';
import { useEditorStore, editorStore, MediaAsset } from '../../store/editorStore';
import { probeMediaFile } from '../../lib/media/persistence';

interface LibraryPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function LibraryPanel({ activeTab, setActiveTab }: LibraryPanelProps) {
  const mediaAssets = useEditorStore((state) => state.mediaAssets);
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const [searchQuery, setSearchQuery] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeNotice, setTranscribeNotice] = useState<string | null>(null);
  const [analyzingAssetId, setAnalyzingAssetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = mediaAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const [importing, setImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImporting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileUrl = URL.createObjectURL(file);
        const probed = await probeMediaFile(file, fileUrl);

        const assetId = editorStore.addMediaAsset(
          {
            name: file.name,
            type: probed.type,
            url: fileUrl,
            duration: probed.duration,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            thumbnail: probed.thumbnail,
            isLocalFile: true,
            mimeType: file.type,
          },
          file
        );

        // Pre-stage local file onto server workspace for FFmpeg rendering
        const uploadForm = new FormData();
        uploadForm.append('assetId', assetId);
        uploadForm.append('file', file, file.name);
        void fetch('/api/media/upload', { method: 'POST', body: uploadForm }).catch(() => {});
      }
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleAddToTimeline = (asset: MediaAsset) => {
    const track = asset.type === 'video' ? 'V1' : asset.type === 'audio' ? 'A1' : 'V2';
    editorStore.addClipToTrack(track, asset, playheadTime);
  };

  const handleDragStart = (e: React.DragEvent, asset: MediaAsset) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAutoTranscribe = async () => {
    if (transcribing) return;
    setTranscribing(true);
    setTranscribeNotice('Running local Whisper speech-to-text...');

    try {
      const selectedId = editorStore.getState().selectedClipId;
      const result = await editorStore.generateCaptionsFromTimeline(selectedId);
      if (result.addedCount === 0) {
        setTranscribeNotice('No spoken words detected in the audio stream.');
      } else {
        setTranscribeNotice(
          `Added ${result.addedCount} synced caption${result.addedCount === 1 ? '' : 's'} (${result.engine || 'Whisper'}).`
        );
      }
    } catch (err) {
      setTranscribeNotice(err instanceof Error ? err.message : 'Transcription failed');
    } finally {
      setTranscribing(false);
    }
  };

  const handleAnalyzeAsset = async (e: React.MouseEvent, asset: MediaAsset) => {
    e.stopPropagation();
    if (analyzingAssetId) return;
    setAnalyzingAssetId(asset.id);
    try {
      await editorStore.analyzeMediaAsset(asset.id, {
        assetUrl: asset.url,
        assetName: asset.name,
        includeTranscript: false,
        includeScenes: asset.type === 'video',
        includeSilences: true,
        includeWaveform: true,
      });
    } catch (err) {
      console.error('Asset analysis failed:', err);
    } finally {
      setAnalyzingAssetId(null);
    }
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
          { id: 'text', label: 'Text / Captions' },
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
                <span className="material-symbols-outlined text-sm opacity-50 block font-sans">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs w-full focus:ring-0 text-on-surface outline-none"
                  placeholder="Search media..."
                />
              </div>
              <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1 rounded cursor-pointer block font-sans">
                filter_list
              </button>
            </div>

            <div className="flex-1 p-3 grid grid-cols-2 gap-3 auto-rows-max">
              {/* Media Cards */}
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex flex-col group cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, asset)}
                >
                  <div className="aspect-video bg-surface-container-highest rounded border border-outline-variant overflow-hidden relative">
                    <img className="w-full h-full object-cover" src={asset.thumbnail} alt={asset.name} />
                    <span className="absolute bottom-1 right-1 px-1 bg-black/70 text-[9px] rounded font-mono-data">
                      {Math.floor(asset.duration / 60)}:{Math.floor(asset.duration % 60).toString().padStart(2, '0')}
                    </span>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAddToTimeline(asset)}
                        className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        title="Add to timeline"
                      >
                        <span className="material-symbols-outlined text-sm block font-bold font-sans">add</span>
                      </button>
                      {asset.type !== 'image' && (
                        <button
                          onClick={(e) => handleAnalyzeAsset(e, asset)}
                          className="bg-surface text-on-surface w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer"
                          title="Analyze silences, scenes & waveform"
                        >
                          <span
                            className={`material-symbols-outlined text-sm block font-sans ${
                              analyzingAssetId === asset.id ? 'animate-spin' : ''
                            }`}
                          >
                            {analyzingAssetId === asset.id ? 'sync' : 'graphic_eq'}
                          </span>
                        </button>
                      )}
                    </div>
                    {asset.analysis && (
                      <span
                        className="absolute top-1 left-1 px-1 py-0.5 bg-secondary/85 text-on-secondary text-[8px] rounded font-mono-data font-bold"
                        title={`Silences: ${asset.analysis.silences.length} • Scenes: ${asset.analysis.scenes.length}`}
                      >
                        AI
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 truncate text-on-surface-variant font-medium group-hover:text-primary transition-colors">
                    {asset.name}
                  </span>
                </div>
              ))}

              {/* Import placeholder */}
              <div onClick={handleImportClick} className="flex flex-col cursor-pointer">
                <div className="aspect-video bg-surface-container-high rounded border border-dashed border-outline-variant hover:border-primary flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined block text-lg font-bold font-sans">
                    {importing ? 'sync' : 'add'}
                  </span>
                  <span className="text-[9px] font-label-caps uppercase mt-1">
                    {importing ? 'Probing...' : 'Import file'}
                  </span>
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
                {
                  name: '4K Intro Sequence',
                  details: '3840x2160 • 60fps',
                  desc: 'Pre-timed text placeholders and audio sweeps',
                },
                {
                  name: '9:16 Shorts Template',
                  details: '1080x1920 • 30fps',
                  desc: 'Centered safety margin frames with light leak effects',
                },
                {
                  name: 'Cinematic Cinematic Pan',
                  details: '3840x1634 • 24fps',
                  desc: 'Widescreen bars with warm golden grade settings',
                },
              ].map((tmpl, idx) => (
                <div
                  key={idx}
                  className="bento-card p-3 rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => editorStore.createNewProject(tmpl.name)}
                >
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
              {
                name: 'Light Leak Overlay',
                color: 'bg-yellow-500/20 border-yellow-500',
                thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Neon Grid Wave',
                color: 'bg-purple-500/20 border-purple-500',
                thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Film Grain Filter',
                color: 'bg-gray-500/20 border-gray-500',
                thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Glitch Displacement',
                color: 'bg-red-500/20 border-red-500',
                thumbnailUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80',
              },
            ].map((el, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => {
                  const dummyAsset = {
                    id: `e_${idx}`,
                    name: el.name,
                    type: 'image' as const,
                    url: el.thumbnailUrl,
                    duration: 8,
                    size: '0.1 MB',
                    thumbnail: el.thumbnailUrl,
                  };
                  handleDragStart(e, dummyAsset);
                }}
                onClick={() => {
                  const dummyAsset = {
                    id: `e_${idx}`,
                    name: el.name,
                    type: 'image' as const,
                    url: el.thumbnailUrl,
                    duration: 8,
                    size: '0.1 MB',
                    thumbnail: el.thumbnailUrl,
                  };
                  editorStore.addClipToTrack('V2', dummyAsset, playheadTime);
                }}
                className="border border-outline-variant hover:border-primary bg-surface-container-high rounded p-2 flex flex-col justify-between items-center text-center cursor-grab transition-colors aspect-video"
              >
                <span className="material-symbols-outlined text-xl text-on-surface-variant block font-sans">
                  broken_image
                </span>
                <span className="text-[10px] text-on-surface-variant mt-1 font-medium">{el.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'audio' && (
          <div className="p-3 space-y-2">
            {[
              {
                name: 'Upbeat Cinematic Beats.mp3',
                duration: 180,
                details: '128bpm • Vlog Pop',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              },
              {
                name: 'Moody Electronic Synth.wav',
                duration: 124,
                details: '95bpm • Sci-Fi Synth',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
              },
              {
                name: 'Soft Acoustic Guitar.mp3',
                duration: 240,
                details: '78bpm • Chill Ambient',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
              },
              {
                name: 'Swoosh Transition SFX.wav',
                duration: 3,
                details: 'SFX • Cinematic Sweep',
                url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
              },
            ].map((snd, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => {
                  const dummyAsset = {
                    id: `a_preset_${idx}`,
                    name: snd.name,
                    type: 'audio' as const,
                    url: snd.url,
                    duration: snd.duration,
                    size: '4.2 MB',
                    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
                  };
                  handleDragStart(e, dummyAsset);
                }}
                className="bento-card p-3 rounded-lg flex items-center justify-between hover:border-primary transition-colors cursor-grab group"
                onClick={() => {
                  const dummyAsset = {
                    id: `a_preset_${idx}`,
                    name: snd.name,
                    type: 'audio' as const,
                    url: snd.url,
                    duration: snd.duration,
                    size: '4.2 MB',
                    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
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
                  <button className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-xs block font-bold font-sans">add</span>
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
                <span className="material-symbols-outlined text-primary block font-sans">closed_caption</span>
                <span className="text-xs font-bold uppercase font-label-caps">AI Audio Transcription</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans">
                Runs local Whisper speech recognition on your selected clip (or A1/V1 tracks) via FFmpeg 16kHz PCM extraction and places synced captions on V3.
              </p>
              <button
                onClick={handleAutoTranscribe}
                disabled={transcribing}
                className={`w-full py-2 rounded font-label-caps text-label-caps font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  transcribing
                    ? 'bg-surface-container-highest text-on-surface-variant opacity-80 cursor-wait'
                    : 'bg-primary text-on-primary hover:brightness-105 active:scale-95 shadow-md font-sans'
                }`}
              >
                {transcribing ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin block font-sans">sync</span>
                    <span>Transcribing Speech...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs block font-sans">mic</span>
                    <span>Transcribe Speech</span>
                  </>
                )}
              </button>
              {transcribeNotice && (
                <p className="text-[10px] font-mono-data text-secondary leading-snug">
                  {transcribeNotice}
                </p>
              )}
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
                {
                  name: 'Minimal Lower Third',
                  desc: 'Subtitle alignment left-border',
                  color: 'border-l-2 border-primary pl-2',
                },
                {
                  name: 'Big Bold Cinematic Intro',
                  desc: 'Centered, high tracking, caps',
                  color: 'font-bold uppercase tracking-widest text-center',
                },
                {
                  name: 'Glitch Title Overlay',
                  desc: 'Separated RGB channel styling',
                  color: 'text-secondary line-through',
                },
              ].map((style, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const clipId = editorStore.addCustomClip('v3', {
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
                      color: 'bg-primary-container/20 border border-primary/30 text-primary px-3 py-1 rounded font-bold tracking-widest',
                    });
                    editorStore.setSelectedClipId(clipId);
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
