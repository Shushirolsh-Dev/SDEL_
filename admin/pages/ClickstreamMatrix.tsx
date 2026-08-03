import React, { useState, useEffect } from 'react';
import { Fingerprint, Clock, Zap, MousePointerClick } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface ClickstreamMatrixProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function ClickstreamMatrix({
  analytics,
  loading,
  onRefresh
}: ClickstreamMatrixProps) {
  const [trackingMetrics, setTrackingMetrics] = useState<any>(null);

  const loadLocalMetrics = () => {
    try {
      const stored = localStorage.getItem('thesdel_activity_metrics');
      if (stored) {
        setTrackingMetrics(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading tracking metrics in clickstream panel:', e);
    }
  };

  useEffect(() => {
    loadLocalMetrics();
    // Auto refresh local metrics every 3 seconds for simulated hot stream feel
    const interval = setInterval(loadLocalMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6" id="dashboard-clickstream-matrix-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Live Student Activity & Duration Matrix
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Aggregated real-time clickstream events, section focus durations, and interactive session heatmaps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded font-mono font-bold text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-1.5"></span>
            ACTIVE INGESTION STREAMING
          </span>
          <button
            onClick={() => {
              loadLocalMetrics();
              onRefresh();
            }}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 border border-zinc-900 dark:border-zinc-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Refreshing...' : 'Force Sync'}
          </button>
        </div>
      </div>

      {trackingMetrics ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Duration Stay Tracker */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Clock className="w-4 h-4 text-indigo-500" /> Focus Duration Stay (Seconds)
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans">
              Measures the total combined seconds students spend active on each page of the app.
            </p>
            <div className="space-y-3.5 pt-2">
              {Object.entries(trackingMetrics.views).map(([viewName, seconds]: [string, any]) => {
                const totalSeconds = (Object.values(trackingMetrics.views) as any[]).reduce((a: number, b: any) => a + Number(b), 1);
                const viewPercentage = Math.min(100, Math.round((Number(seconds) / totalSeconds) * 100));
                return (
                  <div key={viewName} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="capitalize font-medium text-zinc-700 dark:text-zinc-300">{viewName} Screen</span>
                      <span className="font-bold text-zinc-950 dark:text-zinc-50">{seconds}s ({viewPercentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-none overflow-hidden">
                      <div className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500" style={{ width: `${viewPercentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Interaction Heatmap Index */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Zap className="w-4 h-4 text-amber-500" /> Interactive Heatmap Index
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans">
              Aggregated click counts across primary student layout buttons and navbar elements.
            </p>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 pt-2">
              {Object.entries(trackingMetrics.clicks).map(([label, count]: [string, any]) => (
                <div key={label} className="flex justify-between items-center py-3 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <span className="truncate pr-2">{label}</span>
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold border border-zinc-200/60 dark:border-zinc-700/60 font-mono">
                    {count} clicks
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Live Clickstream Event Log */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <MousePointerClick className="w-4 h-4 text-emerald-500" /> Clickstream Event Logs
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans">
              Real-time feed of specific clicks as they happen in active user sessions.
            </p>
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pt-2 pr-1">
              {trackingMetrics.recentClicks.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono italic">No click events logged yet.</p>
              ) : (
                trackingMetrics.recentClicks.map((log: any, idx: number) => (
                  <div key={idx} className="text-xs font-mono border-l-2 border-indigo-500 dark:border-indigo-400 pl-3 py-1 bg-zinc-50 dark:bg-zinc-950/30">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                      <span className="uppercase text-indigo-600 dark:text-indigo-400 font-bold">{log.view} View</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium">{log.element}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
          <Fingerprint className="w-10 h-10 text-zinc-300 mx-auto mb-3 animate-pulse" />
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Waiting for live tracking telemetry data to initialize...</p>
        </div>
      )}
    </div>
  );
}
