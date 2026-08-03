import React, { useState, useEffect } from 'react';
import { AnalyticsSummary } from '../types';
import { BarChart } from '../charts/SimpleCharts';
import { AlertCircle, EyeOff, BarChart2, ShieldCheck, Activity, Megaphone, Send, Check } from 'lucide-react';

interface DashboardProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  isAdmin: boolean;
  activeClasses?: { id: string; name: string; code: string }[];
  onPostBroadcast?: (classId: string, type: 'venue_change' | 'cancellation' | 'entry_added', description: string) => Promise<boolean>;
}

export default function Dashboard({ 
  analytics, 
  loading, 
  error, 
  onRefresh, 
  isAdmin,
  activeClasses = [],
  onPostBroadcast
}: DashboardProps) {
  // User Activity Tracking real-time states
  const [trackingMetrics, setTrackingMetrics] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('thesdel_activity_metrics');
      if (stored) {
        setTrackingMetrics(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading tracking metrics in dashboard:', e);
    }
  }, []);

  // Broadcast Channel Form States
  const [broadcastClassId, setBroadcastClassId] = useState<string>('global');
  const [broadcastType, setBroadcastType] = useState<'venue_change' | 'cancellation' | 'entry_added'>('entry_added');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastPublishing, setBroadcastPublishing] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);

  // Poll configuration states
  const [isPoll, setIsPoll] = useState<boolean>(false);
  const [pollType, setPollType] = useState<'single' | 'multiple' | 'word'>('single');
  const [customChoices, setCustomChoices] = useState<string>('Agree, Disagree, Neutral');

  const handlePublishBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    if (!onPostBroadcast) return;

    setBroadcastPublishing(true);
    setBroadcastError(null);
    setBroadcastSuccess(false);

    try {
      let finalDescription = broadcastMessage.trim();
      if (isPoll) {
        const choicesArray = pollType === 'single'
          ? ['Yes', 'No']
          : pollType === 'multiple'
          ? customChoices.split(',').map(c => c.trim()).filter(Boolean)
          : [];
          
        const pollPayload = {
          isPoll: true,
          question: broadcastMessage.trim(),
          pollType,
          choices: choicesArray,
          pollVotes: choicesArray.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {}),
          pollResponses: [],
          timestamp: new Date().toISOString()
        };
        finalDescription = JSON.stringify(pollPayload);
      }

      const ok = await onPostBroadcast(broadcastClassId, broadcastType, finalDescription);
      if (ok) {
        setBroadcastSuccess(true);
        setBroadcastMessage('');
        setIsPoll(false);
        setTimeout(() => setBroadcastSuccess(false), 4000);
      } else {
        setBroadcastError('The database rejected the broadcast request. Check permissions.');
      }
    } catch (err: any) {
      setBroadcastError(err.message || 'Failed to publish broadcast');
    } finally {
      setBroadcastPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3" id="dashboard-loading">
        <div className="w-8 h-8 border-2 border-zinc-950 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-zinc-500">Retrieving aggregated analytical models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/10 p-6 rounded-lg text-center" id="dashboard-error">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-mono text-sm font-bold text-red-800 dark:text-red-400 mb-1">DATA FLOW TIMEOUT</h3>
        <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold"
        >
          RETRY TRANSACTION
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  // Pre-formatted funnel data for charts
  const funnelChartData = analytics.funnels.map(f => ({
    label: f.step,
    value: f.count
  }));

  return (
    <div className="space-y-6" id="admin-dashboard-page">
      {/* Privacy compliance notice banner */}
      <div className="flex items-start gap-3 border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Privacy Aggregator Active</h4>
          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
            All user data presented is pre-aggregated and scrubbed of PII. Raw database reads, IP traces, and private attendance values are restricted to protect the student registry.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Total Signups</p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.totalSignups}</p>
          <div className="mt-2 text-[10px] text-emerald-600 font-mono">Live Registry</div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Daily Active (DAU)</p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.dau}</p>
          <div className="mt-2 text-[10px] text-zinc-400 font-mono">Last 24 hours</div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Weekly Active (WAU)</p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.wau}</p>
          <div className="mt-2 text-[10px] text-zinc-400 font-mono">Last 7 days</div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Monthly Active (MAU)</p>
          <p className="text-2xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.mau}</p>
          <div className="mt-2 text-[10px] text-zinc-400 font-mono">Last 30 days</div>
        </div>
      </div>

      {/* Engagement Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Retention Rate</p>
          <p className="text-xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.retentionRate}%</p>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Cohort day-28 retention index</p>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Sessions Per Student</p>
          <p className="text-xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.avgSessionsPerUser}</p>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Average weekly session frequency</p>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Cohort Classes</p>
          <p className="text-xl font-mono font-bold mt-1 text-zinc-900 dark:text-zinc-100">{analytics.activeClassesCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Active student groups created</p>
        </div>
      </div>

      {/* Platform Broadcast Channel Hub */}
      {isAdmin && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6" id="dashboard-broadcast-channel-hub">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  Platform Broadcast Channel Hub
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1"></span>
                    LIVE BROADCASTER
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Deploy real-time notifications and system-wide channel updates directly to user feeds</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePublishBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Target Destination Channel</label>
                <select
                  value={broadcastClassId}
                  onChange={(e) => setBroadcastClassId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="global">GLOBAL FEED (All Registered Classes)</option>
                  <option value="class_reps">CLASS REPRESENTATIVES ONLY</option>
                  <option value="region_north">REGIONAL FEED: Northern Territory</option>
                  <option value="region_south">REGIONAL FEED: Southern Territory</option>
                  <option value="country_all">COUNTRY DIRECTORY: Nigeria National</option>
                  {activeClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      CLASS: {c.name.toUpperCase()} ({c.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Notification Alert Type</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="entry_added">OFFICIAL SYSTEM ADVISORY</option>
                  <option value="venue_change">HIGH-PRIORITY DIRECTIVE</option>
                  <option value="cancellation">ACADEMIC SUSPENSION NOTICE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Broadcast Message Content</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder={isPoll ? "e.g., Do you like the new streak tracking feature?" : "Enter system update details. Safe to schedule or transmit immediately."}
                rows={3}
                maxLength={500}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-xs font-mono text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-500 font-mono">
                <span>Supports plaintext & custom headers. Max 500 chars.</span>
                <span>{broadcastMessage.length}/500</span>
              </div>
            </div>

            {/* Poll Toggle & Options */}
            {isAdmin ? (
              <div className="border border-zinc-150 dark:border-zinc-800 p-4 bg-zinc-50/40 dark:bg-zinc-950/20 space-y-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                  <input
                    type="checkbox"
                    checked={isPoll}
                    onChange={(e) => setIsPoll(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-550 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold uppercase text-[10px]">Convert this Broadcast into an Interactive Poll/Survey</span>
                </label>

                {isPoll && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 animate-fade-in">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-zinc-400 mb-1">Response Format Type</label>
                      <select
                        value={pollType}
                        onChange={(e) => setPollType(e.target.value as any)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="single">Single Choice (Yes / No Presets)</option>
                        <option value="multiple">Multiple Custom Choices (Comma Separated)</option>
                        <option value="word">Open-Ended Word Answer (Short Text Input)</option>
                      </select>
                    </div>

                    {pollType === 'multiple' && (
                      <div>
                        <label className="block text-[9px] font-mono font-bold uppercase text-zinc-400 mb-1">Custom Choices (separated by commas)</label>
                        <input
                          type="text"
                          value={customChoices}
                          onChange={(e) => setCustomChoices(e.target.value)}
                          placeholder="e.g. Strongly Agree, Neutral, Disagree"
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-[8px] text-zinc-400 font-mono block mt-1">Separate options with commas to render distinct choice pill buttons.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-zinc-150 dark:border-zinc-850 p-3 bg-zinc-50 dark:bg-zinc-950/20 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                🔒 Interactive poll / feedback survey creation is restricted to administrators only.
              </div>
            )}

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Broadcast published successfully! Refreshing dynamic feeds...</span>
              </div>
            )}

            {broadcastError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{broadcastError}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={broadcastPublishing || !broadcastMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 text-white font-mono text-xs font-bold px-5 py-2.5 flex items-center gap-2 transition-colors cursor-pointer select-none"
              >
                {broadcastPublishing ? (
                  <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Publish Live Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Charts Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Funnel */}
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <BarChart2 className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Registration Funnel Conversion</h3>
          </div>
          <BarChart data={funnelChartData} color="#18181b" height={220} />
          
          <div className="mt-4 space-y-2">
            {analytics.funnels.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">{step.step}</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{step.count} ({step.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screen usage density */}
        <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Screen Usage Density</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                  <th className="pb-2 font-normal">Screen Module</th>
                  <th className="pb-2 text-right font-normal">Hit Count</th>
                  <th className="pb-2 text-right font-normal">Avg Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {analytics.screenUsage.map((screen, idx) => (
                  <tr key={idx} className="text-zinc-700 dark:text-zinc-300">
                    <td className="py-2.5 font-bold">{screen.screenName}</td>
                    <td className="py-2.5 text-right">{screen.viewCount.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-zinc-500">{screen.avgTimeSec}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 mt-6 pt-4 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
            <span>Total Interaction Events:</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {(analytics.totalClicks + (trackingMetrics ? (Object.values(trackingMetrics.clicks) as any[]).reduce((a: number, b: any) => a + Number(b), 0) : 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
