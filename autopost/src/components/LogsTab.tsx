'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentLog } from '@/lib/types';
import { Terminal, Trash2, CheckCircle2, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface LogsTabProps {
  logs: AgentLog[];
  onClearLogs: () => Promise<void>;
  onRefresh: () => void;
}

export function LogsTab({ logs, onClearLogs, onRefresh }: LogsTabProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((l) => (filterLevel === 'ALL' ? true : l.level === filterLevel));

  const renderBadge = (level: AgentLog['level']) => {
    switch (level) {
      case 'info':
        return <span className="text-sky-400 font-bold">[INFO]</span>;
      case 'success':
        return <span className="text-emerald-400 font-bold">[SUCCESS]</span>;
      case 'warn':
        return <span className="text-amber-400 font-bold">[WARN]</span>;
      case 'error':
        return <span className="text-rose-400 font-bold">[ERROR]</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-[650px]">
      {/* Console Header */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>agent_runtime_terminal.log</span>
            <span className="text-slate-600">({logs.length} entries)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Level filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 border border-slate-800 rounded-lg text-[11px]">
            {['ALL', 'info', 'success', 'warn', 'error'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded capitalize ${
                  filterLevel === lvl ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition-colors"
            title="Clear all logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Output */}
      <div
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 bg-slate-950/90 select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 py-10 text-center">No logs recorded yet.</div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed group hover:bg-slate-900/50 p-1 rounded">
                <span className="text-slate-600 shrink-0 text-[11px]">{timeStr}</span>
                <span className="shrink-0">{renderBadge(log.level)}</span>
                {log.category && (
                  <span className="text-indigo-400 shrink-0 text-[11px] font-semibold">[{log.category}]</span>
                )}
                <span className="text-slate-200 break-words flex-1">{log.message}</span>
                {log.details && (
                  <span className="text-slate-500 text-[10px] block w-full pl-6 mt-0.5">{log.details}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
