'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Link as LinkIcon, Check, Eye, Move } from 'lucide-react';

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

  const selectedHotspot = hotspots.find((h) => h.id === selectedHotspotId);

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
              {hotspots.map((h) => {
                const isSelected = h.id === selectedHotspotId;
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
                        : 'border border-rose-500 bg-rose-500/15 hover:bg-rose-500/30'
                    }`}
                  >
                    {activeMode !== 'preview' && (
                      <div className="absolute top-0 left-0 bg-slate-900/90 text-white text-[10px] font-mono px-1 py-0.5 rounded-br">
                        #{h.id} {articles.find((a) => a.id === h.articleId)?.title?.slice(0, 15) || 'Article'}
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

      {/* Right Sidebar: Hotspot Properties & Article Linking */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col overflow-y-auto">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800">
          Hotspot Properties
        </h3>

        {selectedHotspot ? (
          <div className="space-y-5">
            {/* Coordinate Details */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Hotspot ID:</span>
                <span className="text-slate-200">#{selectedHotspot.id}</span>
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
                if (confirm('Delete this hotspot?')) {
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
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
            <LinkIcon className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <p>Select a hotspot on the canvas or draw a new box to link it with an article headline.</p>
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
