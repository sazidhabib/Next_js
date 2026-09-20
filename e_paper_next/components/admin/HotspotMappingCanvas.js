'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Link as LinkIcon, Check, Eye, Move, Star, Crown } from 'lucide-react';

export default function HotspotMappingCanvas({
  page,
  articles = [],
  hotspots = [],
  onSaveHotspot,
  onDeleteHotspot,
  onCreateArticle,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Mode: 'draw' | 'select' | 'preview'
  const [activeMode, setActiveMode] = useState('draw');
  const [selectedHotspotId, setSelectedHotspotId] = useState(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [drawCurrent, setDrawCurrent] = useState(null);

  // New Article Modal State
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [newArticleData, setNewArticleData] = useState({
    title: '',
    subHeadline: '',
    category: 'Lead News',
    author: 'Staff Reporter',
    content: '',
  });

  // Calculate coordinates in relative %
  const getCoordinatesFromEvent = (e) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const handleMouseDown = (e) => {
    if (activeMode !== 'draw' || e.button !== 0) return;
    const coords = getCoordinatesFromEvent(e);
    setDrawStart(coords);
    setDrawCurrent(coords);
    setIsDrawing(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing) return;
    const coords = getCoordinatesFromEvent(e);
    setDrawCurrent(coords);
  }, [isDrawing]);

  const handleMouseUp = async () => {
    if (!isDrawing || !drawStart || !drawCurrent) return;
    setIsDrawing(false);

    const x = Math.min(drawStart.x, drawCurrent.x);
    const y = Math.min(drawStart.y, drawCurrent.y);
    const width = Math.abs(drawCurrent.x - drawStart.x);
    const height = Math.abs(drawCurrent.y - drawStart.y);

    if (width > 2 && height > 2) {
      // Default to first article or unassigned
      const defaultArticleId = articles[0]?.id || 1;
      const newHotspot = {
        pageId: page.id,
        articleId: defaultArticleId,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        width: Number(width.toFixed(2)),
        height: Number(height.toFixed(2)),
        displayOrder: hotspots.length + 1,
      };

      if (onSaveHotspot) {
        const saved = await onSaveHotspot(newHotspot);
        if (saved) setSelectedHotspotId(saved.id);
      }
    }

    setDrawStart(null);
    setDrawCurrent(null);
  };

  const selectedHotspotIndex = hotspots.findIndex((h) => h.id === selectedHotspotId);
  const selectedHotspot = selectedHotspotIndex !== -1 ? hotspots[selectedHotspotIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] bg-slate-950 text-slate-100">
      {/* Left / Center Canvas Area */}
      <div className="flex-1 flex flex-col border-r border-slate-800">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveMode('draw')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'draw'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Draw Bounding Box</span>
            </button>

            <button
              onClick={() => setActiveMode('select')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'select'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>Select &amp; Edit</span>
            </button>

            <button
              onClick={() => setActiveMode('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'preview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reader Preview</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {hotspots.length} Hotspots Mapped
          </span>
        </div>

        {/* Interactive Mapping Viewport */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`flex-1 relative overflow-auto p-4 flex items-center justify-center bg-slate-950 ${
            activeMode === 'draw' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        >
          <div className="relative shadow-2xl rounded-sm">
            {/* Page Scan */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={page?.imageUrl || '/sample-epaper/page_1.svg'}
              alt={page?.pageTitle || 'Page'}
              className="max-h-[80vh] w-auto select-none rounded shadow-2xl pointer-events-none"
              draggable={false}
            />

            {/* Render Existing Hotspots */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
              {hotspots.map((h, idx) => {
                const isSelected = h.id === selectedHotspotId;
                const hasManualLead = hotspots.some((item) => item.isLead);
                const isAutoLead = !hasManualLead && idx === 0;
                const isLeadStory = h.isLead || isAutoLead;

                return (
                  <div
                    key={h.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspotId(h.id);
                    }}
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      width: `${h.width}%`,
                      height: `${h.height}%`,
                    }}
                    className={`absolute transition-all rounded-sm ${
                      activeMode === 'preview'
                        ? 'hover:bg-rose-500/20 hover:ring-2 hover:ring-rose-500 cursor-pointer'
                        : isSelected
                        ? 'border-2 border-amber-400 bg-amber-400/30 shadow-lg'
                        : h.isLead
                        ? 'border-2 border-amber-500 bg-amber-500/20 shadow-md'
                        : 'border border-rose-500 bg-rose-500/15 hover:bg-rose-500/30'
                    }`}
                  >
                    {activeMode !== 'preview' && (
                      <div className="absolute top-0 left-0 flex items-center bg-slate-900/90 text-white text-[10px] font-mono px-1 py-0.5 rounded-br space-x-1">
                        {h.isLead && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                        <span>#{idx + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Currently Drawing Box */}
            {isDrawing && drawStart && drawCurrent && (
              <div
                style={{
                  left: `${Math.min(drawStart.x, drawCurrent.x)}%`,
                  top: `${Math.min(drawStart.y, drawCurrent.y)}%`,
                  width: `${Math.abs(drawCurrent.x - drawStart.x)}%`,
                  height: `${Math.abs(drawCurrent.y - drawStart.y)}%`,
                }}
                className="absolute z-20 border-2 border-dashed border-rose-400 bg-rose-500/30 pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Hotspot Properties & All Crop Images List */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col overflow-y-auto">
        {/* Sidebar Header & Tab Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedHotspotId(null)}
              className={`text-xs font-bold px-2.5 py-1 rounded-md transition ${
                !selectedHotspot
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Crops ({hotspots.length})
            </button>
            {selectedHotspot && (
              <button
                className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30"
              >
                Hotspot #{selectedHotspotIndex + 1}
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Page {page?.pageNumber || 1}
          </span>
        </div>

        {selectedHotspot ? (
          <div className="space-y-5">
            {/* Back to All Crops button */}
            <button
              onClick={() => setSelectedHotspotId(null)}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center space-x-1 transition"
            >
              <span>← View All {hotspots.length} Crop Images</span>
            </button>

            {/* Lead News Toggle Button */}
            <button
              onClick={() => {
                onSaveHotspot({
                  ...selectedHotspot,
                  isLead: !selectedHotspot.isLead,
                });
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                selectedHotspot.isLead
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1 rounded-lg ${selectedHotspot.isLead ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Star className={`w-4 h-4 ${selectedHotspot.isLead ? 'fill-current' : ''}`} />
                </div>
                <div className="text-left">
                  <div className="font-bold">
                    {selectedHotspot.isLead ? 'Page Lead News (Assigned)' : 'Set as Page Lead News'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {selectedHotspot.isLead
                      ? 'Opens automatically when readers load this page'
                      : 'Unset: First cut is used as auto lead'}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${selectedHotspot.isLead ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                {selectedHotspot.isLead ? 'ACTIVE LEAD' : 'SET LEAD'}
              </span>
            </button>

            {/* Cropped Image Snippet Preview */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Bounded Image Preview</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {selectedHotspot.width}% × {selectedHotspot.height}%
                </span>
              </div>
              <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 p-2 shadow-inner flex items-center justify-center">
                <div
                  className="relative overflow-hidden rounded border border-amber-500/50 shadow-md bg-white max-h-[220px] w-full"
                  style={{
                    aspectRatio: `${Math.max(0.1, selectedHotspot.width)} / ${Math.max(0.1, selectedHotspot.height)}`,
                  }}
                >
                  <img
                    src={page?.imageUrl || '/sample-epaper/page_1.svg'}
                    alt="Hotspot preview"
                    style={{
                      position: 'absolute',
                      width: `${(100 / Math.max(0.01, selectedHotspot.width)) * 100}%`,
                      height: `${(100 / Math.max(0.01, selectedHotspot.height)) * 100}%`,
                      left: `-${(selectedHotspot.x / Math.max(0.01, selectedHotspot.width)) * 100}%`,
                      top: `-${(selectedHotspot.y / Math.max(0.01, selectedHotspot.height)) * 100}%`,
                      maxWidth: 'none',
                    }}
                    className="select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Coordinate Details */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Box Number:</span>
                <span className="text-slate-200 font-semibold">#{selectedHotspotIndex + 1}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Position (X, Y):</span>
                <span className="text-slate-200">{selectedHotspot.x}%, {selectedHotspot.y}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dimensions (W, H):</span>
                <span className="text-slate-200">{selectedHotspot.width}% × {selectedHotspot.height}%</span>
              </div>
            </div>

            {/* Link to Article Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Linked Article
              </label>
              <select
                value={selectedHotspot.articleId || ''}
                onChange={(e) => {
                  onSaveHotspot({
                    ...selectedHotspot,
                    articleId: parseInt(e.target.value, 10),
                  });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    [{art.category}] {art.title.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Article Creator Button */}
            <button
              onClick={() => setIsNewArticleOpen(true)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Article for this Hotspot</span>
            </button>

            {/* Delete Hotspot Button */}
            <button
              onClick={() => {
                if (confirm(`Delete hotspot #${selectedHotspotIndex + 1}?`)) {
                  onDeleteHotspot(selectedHotspot.id);
                  setSelectedHotspotId(null);
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-900/50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Hotspot</span>
            </button>
          </div>
        ) : (
          /* List of ALL Crop Images on this Page */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Crop Snippets Gallery ({hotspots.length})
              </span>
              <span className="text-[11px] text-amber-400">Click to edit</span>
            </div>

            {hotspots.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl space-y-2 text-slate-500 text-xs">
                <LinkIcon className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                <p className="font-semibold text-slate-400">No Bounding Boxes Yet</p>
                <p>Click &quot;Draw Bounding Box&quot; and drag on the newspaper to create your first crop snippet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hotspots.map((h, idx) => {
                  const linkedArticle = articles.find((a) => a.id === h.articleId);
                  const hasManualLead = hotspots.some((item) => item.isLead);
                  const isAutoLead = !hasManualLead && idx === 0;

                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHotspotId(h.id)}
                      className={`group bg-slate-950 hover:bg-slate-800/80 border rounded-xl p-3 cursor-pointer transition-all shadow-sm flex space-x-3 items-center ${
                        h.isLead
                          ? 'border-amber-500/80 ring-1 ring-amber-500/30'
                          : isAutoLead
                          ? 'border-slate-700'
                          : 'border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      {/* Cropped Image Thumbnail */}
                      <div
                        className="relative overflow-hidden rounded border border-slate-700 bg-white w-20 flex-shrink-0 shadow-xs"
                        style={{
                          aspectRatio: `${Math.max(0.1, h.width)} / ${Math.max(0.1, h.height)}`,
                          maxHeight: '75px',
                        }}
                      >
                        <img
                          src={page?.imageUrl || '/sample-epaper/page_1.svg'}
                          alt={`Crop #${idx + 1}`}
                          style={{
                            position: 'absolute',
                            width: `${(100 / Math.max(0.01, h.width)) * 100}%`,
                            height: `${(100 / Math.max(0.01, h.height)) * 100}%`,
                            left: `-${(h.x / Math.max(0.01, h.width)) * 100}%`,
                            top: `-${(h.y / Math.max(0.01, h.height)) * 100}%`,
                            maxWidth: 'none',
                          }}
                          className="select-none pointer-events-none"
                          draggable={false}
                        />
                      </div>

                      {/* Info & Meta */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            #{idx + 1}
                          </span>
                          {h.isLead ? (
                            <span className="inline-flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>LEAD</span>
                            </span>
                          ) : isAutoLead ? (
                            <span className="inline-flex items-center space-x-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300/80 border border-slate-700">
                              <span>Auto Lead (1st Cut)</span>
                            </span>
                          ) : null}
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">
                            {h.width}% × {h.height}%
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                          {linkedArticle?.title || `Article #${h.articleId}`}
                        </h4>
                        <span className="inline-block text-[10px] text-slate-400 truncate">
                          {linkedArticle?.category || 'News'}
                        </span>
                      </div>

                      {/* Quick Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete hotspot #${idx + 1}?`)) {
                            onDeleteHotspot(h.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        title="Delete crop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Article Modal */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create New Article</h3>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Headline (Unicode)</label>
              <input
                type="text"
                value={newArticleData.title}
                onChange={(e) => setNewArticleData({ ...newArticleData, title: e.target.value })}
                placeholder="Enter article title..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={newArticleData.category}
                onChange={(e) => setNewArticleData({ ...newArticleData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Article Content (HTML/Text)</label>
              <textarea
                rows={4}
                value={newArticleData.content}
                onChange={(e) => setNewArticleData({ ...newArticleData, content: e.target.value })}
                placeholder="<p>Article body paragraph...</p>"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 font-mono"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsNewArticleOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newArticleData.title || !newArticleData.content) {
                    alert('Title and content are required');
                    return;
                  }
                  if (onCreateArticle) {
                    const created = await onCreateArticle({
                      ...newArticleData,
                      editionId: page.editionId || 1,
                    });
                    if (created && selectedHotspot) {
                      await onSaveHotspot({
                        ...selectedHotspot,
                        articleId: created.id,
                      });
                    }
                  }
                  setIsNewArticleOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Save &amp; Link Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
