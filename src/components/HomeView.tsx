import React, { useState, useEffect } from 'react';
import { Play, Check, AlertCircle, Clock, MapPin, Award, ChevronRight, Bell, Megaphone, ThumbsUp, Send, RotateCw } from 'lucide-react';
import { TimetableEntry, AttendanceLog, ClassGroup, ClassUpdate } from '../types';

interface HomeViewProps {
  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string;
  updates: ClassUpdate[];
  onMarkAttendance: (entryId: string, date: string) => void;
  userRole: string;
  activeClassId?: string;
  onAddBroadcast?: (classId: string, description: string) => Promise<boolean>;
  onForceRefresh?: () => Promise<void>;
  onNavigateToNotifications?: () => void;
  onTrackAdEvent?: (adId: string, eventType: 'view' | 'click') => void;
}

const calculateRealAttendanceStats = (
  timetable: TimetableEntry[],
  attendanceLogs: AttendanceLog[],
  joinedClassIds: string[],
  currentTime: string
) => {
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMins = getMinutes(currentTime);
  const classEntries = timetable.filter(entry => joinedClassIds.includes(entry.classId));
  const pastEntries = classEntries.filter(entry => {
    const endMins = getMinutes(entry.endTime);
    return endMins < currentMins && !entry.isCancelled;
  });

  const attendedCount = pastEntries.filter(entry =>
    attendanceLogs.some(log =>
      log.timetableEntryId === entry.id &&
      log.status === 'attended'
    )
  ).length;

  const totalScheduled = pastEntries.length;
  const missedCount = totalScheduled - attendedCount;
  const attendancePercentage = totalScheduled > 0 ? Math.round((attendedCount / totalScheduled) * 100) : 100;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  const sortedEntries = [...pastEntries].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return b.dayOfWeek - a.dayOfWeek;
    return b.startTime.localeCompare(a.startTime);
  });

  for (const entry of sortedEntries) {
    const attended = attendanceLogs.some(log =>
      log.timetableEntryId === entry.id &&
      log.status === 'attended'
    );

    if (attended) {
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      break;
    }
  }
  currentStreak = streak;

  return {
    totalScheduled,
    attendedCount,
    missedCount,
    attendancePercentage,
    currentStreak,
    longestStreak
  };
};

export default function HomeView({
  timetable,
  attendanceLogs,
  joinedClasses,
  currentSimulatedTime,
  updates,
  onMarkAttendance,
  userRole,
  activeClassId,
  onAddBroadcast,
  onForceRefresh,
  onNavigateToNotifications,
  onTrackAdEvent,
}: HomeViewProps) {
  const [currentTimeMins, setCurrentTimeMins] = useState(0);
  const [visibleLogsCount, setVisibleLogsCount] = useState(5);
  const [liveCountdown, setLiveCountdown] = useState<string>('');

  const renderActivityDescription = (description: string) => {
    if (description.startsWith('{') && description.endsWith('}')) {
      try {
        const parsed = JSON.parse(description);
        if (parsed.isAd) {
          return `📢 [Sponsored Spotlight] ${parsed.adTitle || parsed.description || 'Campaign Promotion'}`;
        }
        if (parsed.isPoll) {
          return `📊 [Interactive Poll] ${parsed.question || 'Academic Survey'}`;
        }
      } catch (e) {
      }
    }
    return description;
  };

  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [classRepMsg, setClassRepMsg] = useState('');
  const [isSubmittingRepMsg, setIsSubmittingRepMsg] = useState(false);
  const [repSuccess, setRepSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    if (!onForceRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onForceRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };
  const [userVotes, setUserVotes] = useState<Record<string, { votes: number; hasVoted: boolean }>>(() => {
    const saved = localStorage.getItem('thesdel_bulletin_votes');
    return saved ? JSON.parse(saved) : {};
  });

  const [pollVotes, setPollVotes] = useState<Record<string, { votedChoice: string; textResponse?: string; submittedAt?: number }>>(() => {
    try {
      const stored = localStorage.getItem('thesdel_poll_votes');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const [pollTextInput, setPollTextInput] = useState<Record<string, string>>({});

  const handleRegisterPollVote = (pollId: string, choice: string, textResponse?: string) => {
    const updated = {
      ...pollVotes,
      [pollId]: {
        votedChoice: choice,
        textResponse,
        submittedAt: Date.now()
      }
    };
    setPollVotes(updated);
    localStorage.setItem('thesdel_poll_votes', JSON.stringify(updated));
  };

  useEffect(() => {
    const bulletinUpdates = updates.filter((up) => {
      if (up.description.startsWith('{') && up.description.endsWith('}')) {
        try {
          const parsed = JSON.parse(up.description);
          if (parsed.isAd) return true;
          if (parsed.isPoll) {
            const userVoteRecord = pollVotes[up.id];
            if (userVoteRecord && userVoteRecord.submittedAt) {
              const elapsed = Date.now() - userVoteRecord.submittedAt;
              if (elapsed >= 24 * 60 * 60 * 1000) {
                return false;
              }
            }
            return true;
          }
        } catch (e) {}
      }
      if (up.type === 'entry_added' || up.type === 'entry_edited' || up.type === 'entry_deleted') {
        return false;
      }
      return true;
    });

    if (bulletinUpdates.length > 0) {
      const lastReadId = localStorage.getItem('thesdel_last_read_update_id');
      const latestId = bulletinUpdates[0].id;
      if (lastReadId !== latestId) {
        setHasUnread(true);
        setIsAnnouncementOpen(true);
      }
    }
  }, [updates, pollVotes]);

  const handleToggleAnnouncements = () => {
    setIsAnnouncementOpen(!isAnnouncementOpen);
    const bulletinUpdates = updates.filter((up) => {
      if (up.description.startsWith('{') && up.description.endsWith('}')) {
        try {
          const parsed = JSON.parse(up.description);
          if (parsed.isAd) return true;
          if (parsed.isPoll) {
            const userVoteRecord = pollVotes[up.id];
            if (userVoteRecord && userVoteRecord.submittedAt) {
              const elapsed = Date.now() - userVoteRecord.submittedAt;
              if (elapsed >= 24 * 60 * 60 * 1000) {
                return false;
              }
            }
            return true;
          }
        } catch (e) {}
      }
      if (up.type === 'entry_added' || up.type === 'entry_edited' || up.type === 'entry_deleted') {
        return false;
      }
      return true;
    });

    if (bulletinUpdates.length > 0) {
      localStorage.setItem('thesdel_last_read_update_id', bulletinUpdates[0].id);
      setHasUnread(false);
    }
  };

  const handleRegisterVote = (updateId: string) => {
    const current = userVotes[updateId] || { votes: Math.floor(Math.abs(updateId.charCodeAt(0) % 20) + 2), hasVoted: false };
    if (current.hasVoted) return;

    const updated = {
      ...userVotes,
      [updateId]: {
        votes: current.votes + 1,
        hasVoted: true
      }
    };
    setUserVotes(updated);
    localStorage.setItem('thesdel_bulletin_votes', JSON.stringify(updated));
  };

  const handleClassRepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRepMsg.trim() || !onAddBroadcast || !activeClassId) return;

    setIsSubmittingRepMsg(true);
    const success = await onAddBroadcast(activeClassId, classRepMsg);
    setIsSubmittingRepMsg(false);

    if (success) {
      setClassRepMsg('');
      setRepSuccess(true);
      setTimeout(() => setRepSuccess(false), 3000);
    }
  };

  const getPillsForUpdate = (update: ClassUpdate) => {
    const desc = update.description.toLowerCase();
    const pills: string[] = [];
    
    if (update.classId === 'global') {
      pills.push('GLOBAL ANNOUNCEMENT');
    } else {
      pills.push('CLASS FEED');
    }

    if (desc.includes('ad ') || desc.includes('sponsor') || desc.includes('promo') || desc.includes('advert')) {
      pills.push('AD SPACE');
    } else if (desc.includes('urgent') || desc.includes('alert') || desc.includes('attention') || desc.includes('critical')) {
      pills.push('URGENT');
    } else if (desc.includes('feature') || desc.includes('update') || desc.includes('upgrade') || desc.includes('app')) {
      pills.push('FEATURE UPDATE');
    } else {
      pills.push('SYSTEM NOTICE');
    }
    return pills;
  };

  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    setCurrentTimeMins(getMinutes(currentSimulatedTime));
  }, [currentSimulatedTime]);

  const joinedClassIds = joinedClasses.map((c) => c.id);

  const getDeviceTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const deviceToday = getDeviceTodayDate();

  const todayDayOfWeek = (() => {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  })();

  const activeAd = updates.find(up => {
    if (up.description.startsWith('{') && up.description.endsWith('}')) {
      try {
        const parsed = JSON.parse(up.description);
        return parsed.isAd === true;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (activeAd && onTrackAdEvent) {
      const sessionKey = `thesdel_ad_viewed_${activeAd.id}`;
      if (!sessionStorage.getItem(sessionKey)) {
        onTrackAdEvent(activeAd.id, 'view');
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [activeAd, onTrackAdEvent]);

  const todayEntries = timetable
    .filter((entry) => entry.dayOfWeek === todayDayOfWeek && joinedClassIds.includes(entry.classId))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const stats = calculateRealAttendanceStats(timetable, attendanceLogs, joinedClassIds, currentSimulatedTime);

  let nextClass: TimetableEntry | null = null;
  let nextClassTimeDiffMinutes = -1;
  let nextClassIsLive = false;
  let liveClassRemainingMinutes = -1;

  const updateCountdown = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let foundNextClass: TimetableEntry | null = null;
    let foundNextClassIsLive = false;
    let foundLiveRemaining = -1;
    let foundTimeDiff = -1;

    for (const entry of todayEntries) {
      if (entry.isCancelled) continue;
      const startMins = getMinutes(entry.startTime);
      const endMins = getMinutes(entry.endTime);

      if (currentMinutes < startMins) {
        if (!foundNextClass || startMins < getMinutes(foundNextClass.startTime)) {
          if (!foundNextClassIsLive) {
            foundNextClass = entry;
            foundTimeDiff = startMins - currentMinutes;
          }
        }
      } else if (currentMinutes >= startMins && currentMinutes < endMins) {
        foundNextClass = entry;
        foundNextClassIsLive = true;
        foundLiveRemaining = endMins - currentMinutes;
      }
    }

    nextClass = foundNextClass;
    nextClassIsLive = foundNextClassIsLive;
    liveClassRemainingMinutes = foundLiveRemaining;
    nextClassTimeDiffMinutes = foundTimeDiff;

    if (foundNextClassIsLive && foundNextClass) {
      const mins = Math.max(0, foundLiveRemaining);
      setLiveCountdown(`LIVE NOW (${mins}m left)`);
    } else if (foundNextClass) {
      const totalMinutes = foundTimeDiff;
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const countdownStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      setLiveCountdown(`starts in ${countdownStr} (${foundNextClass.subject})`);
    } else {
      setLiveCountdown('No more classes scheduled today');
    }
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [todayEntries]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8" id="home-view-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="home-status-grid">
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-none flex flex-col justify-between" id="streak-card">
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">Current Streak</span>
            <div className="text-4xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 flex items-baseline gap-2">
              {stats.currentStreak}
              <span className="text-xs font-mono font-normal text-zinc-400 dark:text-zinc-500">classes</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Longest Streak: {stats.longestStreak}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Streak Safe</span>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-none flex flex-col justify-between" id="percentage-card">
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">Attendance Rate</span>
            <div className="text-4xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.attendancePercentage}%
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>{stats.attendedCount} of {stats.totalScheduled} past classes</span>
            <span className={`${stats.attendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} font-medium`}>
              {stats.attendancePercentage >= 75 ? 'Target safe' : 'Below 75% target'}
            </span>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-none flex flex-col justify-between" id="countdown-card">
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">Next Class Alert</span>
            <div className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mt-2 leading-snug">
              {liveCountdown}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-main-layout">
        <div className="lg:col-span-2 space-y-4" id="today-timeline">
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Today’s Schedule</h2>
              
              <button 
                onClick={onNavigateToNotifications}
                className="relative p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 focus:outline-none transition-colors cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="System Bulletin & Announcement Hub"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                )}
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{formattedDate}</span>
          </div>

          {activeAd && (() => {
            try {
              const parsed = JSON.parse(activeAd.description);
              if (parsed.isAd) {
                return (
                  <div 
                    onClick={() => {
                      if (onTrackAdEvent) onTrackAdEvent(activeAd.id, 'click');
                      if (parsed.adLink) {
                        window.open(parsed.adLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 p-4 rounded-none cursor-pointer hover:bg-amber-50/40 dark:hover:bg-amber-955/20 transition-all flex flex-col sm:flex-row gap-4 items-center justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-450 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">SPONSOR SPOTLIGHT</span>
                        <h4 className="text-xs font-bold font-sans text-zinc-900 dark:text-zinc-100 mt-0.5">{parsed.adTitle || 'Campaign Promotion'}</h4>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-normal mt-1">{parsed.description || 'Promoted partner offer'}</p>
                      </div>
                    </div>
                    {parsed.adButtonText && (
                      <span className="px-3 py-1.5 bg-amber-600 dark:bg-amber-750 text-white font-mono font-bold text-[10px] uppercase tracking-wider shrink-0">
                        {parsed.adButtonText}
                      </span>
                    )}
                  </div>
                );
              }
            } catch (e) {
              return null;
            }
          })()}

          {isAnnouncementOpen && (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 space-y-4" id="bulletin-announcement-hub">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                    Bulletin Board & Updates
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {onForceRefresh && (
                    <button
                      onClick={handleForceRefresh}
                      disabled={isRefreshing}
                      title="Pull-to-refresh latest announcements"
                      className="p-1 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors rounded-full cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
                    </button>
                  )}
                  <span className="text-[8px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800">
                    REAL-TIME SYNCED
                  </span>
                </div>
              </div>

              {(() => {
                const bulletinUpdates = updates.filter((up) => {
                  if (up.description.startsWith('{') && up.description.endsWith('}')) {
                    try {
                      const parsed = JSON.parse(up.description);
                      if (parsed.isAd || parsed.isPoll) return true;
                    } catch (e) {}
                  }
                  if (up.type === 'entry_added' || up.type === 'entry_edited' || up.type === 'entry_deleted') {
                    return false;
                  }
                  return true;
                });

                const getPillsForUpdate = (update: ClassUpdate): string[] => {
                  if (update.type === 'cancellation') return ['CANCELLED', 'URGENT'];
                  if (update.type === 'venue_change') return ['VENUE CHANGED', 'URGENT'];
                  return ['INFO'];
                };

                if (bulletinUpdates.length === 0) {
                  return <p className="text-[10px] font-mono text-zinc-400 py-2">No official announcements have been dispatched yet.</p>;
                }

                return (
                  <div className="space-y-3">
                    {bulletinUpdates.slice(0, 5).map((up) => {
                      let isAd = false;
                      let isPoll = false;
                      let parsedData: any = null;

                      if (up.description.startsWith('{') && up.description.endsWith('}')) {
                        try {
                          parsedData = JSON.parse(up.description);
                          if (parsedData.isAd) isAd = true;
                          if (parsedData.isPoll) isPoll = true;
                        } catch (e) {}
                      }

                      const pills = isAd 
                        ? ['SPONSORED', 'AD SPACE'] 
                        : isPoll 
                        ? [] 
                        : getPillsForUpdate(up);

                      const hasVoted = userVotes[up.id]?.hasVoted;
                      const voteCount = userVotes[up.id]?.votes || Math.floor(Math.abs(up.id.charCodeAt(0) % 15) + 3);
                      
                      const isClassRepAnnouncement = up.userId && (
                        up.userId.startsWith('user_rep') || 
                        up.userId.includes('rep') || 
                        up.userId.includes('asst') ||
                        up.userName.toLowerCase().includes('rep') ||
                        up.userName.toLowerCase().includes('asst')
                      );

                      return (
                        <div 
                          key={up.id} 
                          className={`border p-3.5 transition-all ${
                            isAd 
                              ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30 shadow-sm' 
                              : isPoll
                              ? 'bg-zinc-50 dark:bg-zinc-950/10 border-zinc-200 dark:border-zinc-800 shadow-sm'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {pills.map((p, idx) => (
                              <span 
                                key={idx} 
                                className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none border ${
                                  p === 'URGENT'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
                                    : p === 'AD SPACE' || p === 'SPONSORED'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40'
                                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800'
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                            {isAd && (
                              <span className="text-[8px] text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-wider ml-1">
                                • SPONSORED SPOTLIGHT
                              </span>
                            )}
                            <span className="text-[9px] text-zinc-400 font-mono ml-auto">
                              {new Date(up.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {isAd && parsedData && (
                            <div className="space-y-3 font-sans">
                              {parsedData.adImageUrl && (
                                <img 
                                  src={parsedData.adImageUrl} 
                                  alt="Campaign Promotion" 
                                  referrerPolicy="no-referrer"
                                  className="w-full max-h-40 object-cover border border-amber-200 dark:border-amber-900/30"
                                />
                              )}
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight leading-snug">
                                {parsedData.adTitle}
                              </h4>
                              <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed font-sans">
                                {parsedData.description}
                              </p>
                              {parsedData.adUrl && (
                                <a 
                                  href={parsedData.adUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold px-3 py-1.5 transition-all uppercase tracking-wider border border-amber-700 cursor-pointer"
                                >
                                  {parsedData.adActionText || 'Learn More'}
                                  <ChevronRight className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}

                          {isPoll && parsedData && (
                            <div className="space-y-3 font-sans border-l-2 border-zinc-400 dark:border-zinc-600 pl-3">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-start gap-1.5 leading-snug">
                                <Megaphone className="w-3.5 h-3.5 text-zinc-850 dark:text-zinc-150 shrink-0 mt-0.5 animate-pulse" />
                                {parsedData.question}
                              </h4>
                              <div className="pt-1">
                                <button
                                  onClick={onNavigateToNotifications}
                                  className="inline-flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-mono text-[9px] font-bold px-2.5 py-1.5 border border-zinc-950 transition-all uppercase tracking-wider cursor-pointer"
                                >
                                  <span>Respond Anonymously</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}

                          {!isAd && !isPoll && (
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans select-text">
                              {up.description}
                            </p>
                          )}

                          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                            <span className="text-[9px] text-zinc-450 dark:text-zinc-400 font-mono uppercase tracking-wider">
                              {isPoll ? 'From Thesdel team' : <>By: <span className="font-bold text-zinc-650 dark:text-zinc-300">{up.userName}</span></>}
                            </span>

                            {!isAd && !isPoll && !isClassRepAnnouncement ? (
                              <button
                                onClick={() => handleRegisterVote(up.id)}
                                disabled={hasVoted}
                                className={`px-2.5 py-1 text-[9px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                                  hasVoted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800 cursor-pointer'
                                }`}
                              >
                                <ThumbsUp className={`w-2.5 h-2.5 ${hasVoted ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                                <span>{hasVoted ? `Vote Counted (${voteCount})` : `Upvote / Agree (${voteCount})`}</span>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {userRole === 'representative' && onAddBroadcast && activeClassId && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Class Rep Broadcaster Console
                  </h4>
                  <form onSubmit={handleClassRepSubmit} className="space-y-2">
                    <textarea
                      value={classRepMsg}
                      onChange={(e) => setClassRepMsg(e.target.value)}
                      placeholder="Post a study tip, schedule reminder, or important classroom notice to your members..."
                      maxLength={250}
                      rows={2}
                      required
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                    <div className="flex justify-between items-center text-[9px] text-zinc-450 font-mono">
                      <span>Max 250 characters. Broadcast updates feed instantly.</span>
                      <button
                        type="submit"
                        disabled={isSubmittingRepMsg || !classRepMsg.trim()}
                        className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-800 dark:border-zinc-300 transition-colors"
                      >
                        {isSubmittingRepMsg ? 'Publishing...' : 'Broadcast Bulletin'}
                        <Send className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </form>
                  {repSuccess && (
                    <div className="mt-2 text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      ✓ Broadcast dispatched successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {joinedClasses.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-12 text-center" id="empty-classes-prompt">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">You haven't joined any classes yet.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Go to the "Class" tab and enter a class code to join.</p>
            </div>
          ) : todayEntries.length === 0 ? (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center" id="no-classes-today">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">No classes scheduled for today.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Enjoy your free time or check the Timetable tab.</p>
            </div>
          ) : (
            <div className="space-y-3" id="classes-list">
              {todayEntries.map((entry) => {
                const startMins = getMinutes(entry.startTime);
                const endMins = getMinutes(entry.endTime);

                let statusLabel: 'upcoming' | 'live' | 'completed' | 'cancelled' | 'missed' = 'upcoming';
                let statusText = 'Upcoming';
                let badgeStyle = 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950';

                if (entry.isCancelled) {
                  statusLabel = 'cancelled';
                  statusText = 'Cancelled';
                  badgeStyle = 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 line-through';
                } else if (currentTimeMins >= endMins) {
                  statusLabel = 'completed';
                  statusText = 'Completed';
                  badgeStyle = 'border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800';
                } else if (currentTimeMins >= startMins && currentTimeMins < endMins) {
                  statusLabel = 'live';
                  statusText = 'Live Now';
                  badgeStyle = 'border-emerald-200 dark:border-emerald-950/40 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20';
                }

                const hasAttended = attendanceLogs.some(
                  (log) => log.timetableEntryId === entry.id && log.date === deviceToday && log.status === 'attended'
                );

                const isInteractable = !entry.isCancelled && (statusLabel === 'live' || statusLabel === 'completed');

                return (
                  <div
                    key={entry.id}
                    id={`class-item-${entry.id}`}
                    className={`border p-4 transition-all duration-150 rounded-none bg-white dark:bg-zinc-900 ${
                      entry.isCancelled
                        ? 'opacity-60 border-zinc-100 dark:border-zinc-800'
                        : statusLabel === 'live'
                        ? 'border-blue-600 dark:border-blue-550 ring-1 ring-blue-600 ring-offset-0'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400">
                            {entry.startTime} - {entry.endTime}
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${badgeStyle}`}>
                            {statusText}
                          </span>
                          {hasAttended && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-emerald-200 dark:border-emerald-950/40 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Attended
                            </span>
                          )}
                          {!hasAttended && statusLabel === 'completed' && !entry.isCancelled && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-red-200 dark:border-red-950/40 text-red-800 dark:text-red-400 bg-red-50 dark:bg-red-950/20 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Missed Check-in
                            </span>
                          )}
                          {entry.isCancelled && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
                              Streak Safe
                            </span>
                          )}
                        </div>

                        <h3 className={`font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight ${entry.isCancelled ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                          {entry.subject}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                            {entry.venue}
                            {entry.originalVenue && (
                              <span className="text-zinc-400 dark:text-zinc-500 line-through text-[11px] ml-1">
                                (was {entry.originalVenue})
                              </span>
                            )}
                          </span>
                          <span>{entry.durationMinutes} mins</span>
                        </div>
                      </div>

                      <div>
                        {hasAttended ? (
                          <div className="px-4 py-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center gap-1.5 select-none w-full md:w-auto justify-center">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            Attendance Logged
                          </div>
                        ) : entry.isCancelled ? (
                          <div className="px-4 py-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 select-none text-center">
                            No Attendance Required
                          </div>
                        ) : isInteractable ? (
                          <button
                            id={`btn-mark-${entry.id}`}
                            onClick={() => onMarkAttendance(entry.id, deviceToday)}
                            className="px-4 py-2 text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors flex items-center gap-1.5 w-full md:w-auto justify-center shadow-sm cursor-pointer"
                          >
                            Mark attendance
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 select-none w-full md:w-auto text-center"
                          >
                            Check-in locked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6" id="home-sidebar">
        </div>
      </div>
    </div>
  );
}
