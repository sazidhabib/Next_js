'use client';

import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Volume2,
  Crop,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sliders,
} from 'lucide-react';

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('আজকের পত্রিকা (Daily Newspaper)');
  const [tagline, setTagline] = useState('সত্য ও ন্যায়ের নির্ভীক কণ্ঠস্বর');
  const [defaultLang, setDefaultLang] = useState('bn');
  const [ttsVoice, setTtsVoice] = useState('bn-BD');
  const [ttsSpeed, setTtsSpeed] = useState('1.0');
  const [watermark, setWatermark] = useState('আজকের পত্রিকা - ই-পেপার ক্লিপ');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMsg({ type: 'success', text: 'Publication settings saved successfully!' });
      setTimeout(() => setMsg(null), 3000);
    }, 600);
  };

  const handleResetSeed = async () => {
    if (!confirm('This will reset the entire database to the default demo state. Continue?')) return;
    try {
      setResetting(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setMsg({ type: 'success', text: data.message || 'Database reset successfully!' });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to reset database' });
    } finally {
      setResetting(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>System Settings &amp; Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure publication branding, reader TTS voice playback, clipping marquee watermark, and database controls.
        </p>
      </div>

      {/* Alert Banner */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Publication Branding */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200">Publication Identity &amp; Masthead</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Newspaper Masthead Title</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Audio TTS & Reader Options */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Volume2 className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-200">Audio Narration (Web Speech TTS)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Narration Language</label>
              <select
                value={ttsVoice}
                onChange={(e) => setTtsVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="bn-BD">Bengali (Bangladesh) - bn-BD</option>
                <option value="bn-IN">Bengali (India) - bn-IN</option>
                <option value="en-US">English (US) - en-US</option>
                <option value="en-GB">English (UK) - en-GB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Speech Rate Speed</label>
              <select
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="0.8">0.8x (Slower)</option>
                <option value="1.0">1.0x (Normal)</option>
                <option value="1.2">1.2x (Faster)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Social Clipping Tool Watermark */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Crop className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">Reader Clipping Tool Branding</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Watermark / Masthead text added to exported PNG clips
            </label>
            <input
              type="text"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>

      {/* Section 4: Maintenance & Reset Data */}
      <div className="bg-rose-500/5 rounded-2xl border border-rose-500/20 p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-rose-500/20">
          <Database className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-rose-200">Maintenance &amp; Demo Database</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-200">Reset Demo Data &amp; Hotspots</p>
            <p className="text-[11px] text-slate-400">
              Restore initial newspaper editions, 5 multi-page layout scans, and sample mapped coordinates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetSeed}
            disabled={resetting}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/30 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset to Default State'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
