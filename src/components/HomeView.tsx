import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertCircle,
  Clock,
  MapPin,
  ChevronRight,
  Bell,
  Megaphone,
  ThumbsUp,
  Send,
  RotateCw,
  ArrowUpRight,
} from 'lucide-react';
import {
  TimetableEntry,
  AttendanceLog,
  ClassGroup,
  ClassUpdate,
} from '../types';

interface HomeViewProps {
  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string;
  updates: ClassUpdate[];
  onMarkAttendance: (entryId: string, date: string) => void;
  userRole: string;
  activeClassId?: string;
  onAddBroadcast?: (
    classId: string,
    description: string
  ) => Promise<boolean>;
  onForceRefresh?: () => Promise<void>;
  onNavigateToNotifications?: () => void;
  onTrackAdEvent?: (
    adId: string,
    eventType: 'view' | 'click'
  ) => void;
}

/*
 * ---------------------------------------------------------
 * LOCALIZATION-READY UI COPY
 * ---------------------------------------------------------
 *
 * Keep user-facing text here.
 * When THESDEL adds more languages, this object can become
 * a locale dictionary without rebuilding the component.
 */

const TEXT = {
  today: 'Today',
  academicDay: 'Your academic day.',
  nextClass: 'Next class',
  liveNow: 'Live now',
  status: 'Status',
  startsIn: 'Starts in',
  noMoreClasses: 'No more classes.',
  schedule: 'Today’s schedule',
  nothingScheduled: 'Nothing scheduled',
  classScheduled: 'class',
  classesScheduled: 'classes',
  attendance: 'Attendance',
  currentStanding: 'Current standing',
  onTarget: 'On target',
  belowTarget: 'Below target',
  attended: 'Attended',
  missed: 'Missed',
  updates: 'Updates',
  bulletin: 'Bulletin',
  new: 'New',
  representative: 'Representative',
  broadcastToClass: 'Broadcast to class',
  sponsored: 'Sponsored',
} as const;

/*
 * ---------------------------------------------------------
 * USERNAME
 * ---------------------------------------------------------
 *
 * Read the existing locally stored THESDEL profile/user
 * rather than hardcoding a username.
 *
 * This intentionally checks several existing-style storage
 * locations so the dashboard remains usable across auth
 * versions.
 */

const getStoredUsername = (): string => {
  const storageKeys = [
    'thesdel_user',
    'thesdel_profile',
    'user',
    'profile',
  ];

  for (const key of storageKeys) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);

        const name =
          parsed?.username ||
          parsed?.userName ||
          parsed?.displayName ||
          parsed?.fullName ||
          parsed?.name;

        if (
          typeof name === 'string' &&
          name.trim()
        ) {
          return name.trim();
        }
      } catch {
        if (raw.trim()) {
          return raw.trim();
        }
      }
    } catch {}
  }

  return 'Student';
};

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';

  return 'Good evening';
};

const getMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const calculateRealAttendanceStats = (
  timetable: TimetableEntry[],
  attendanceLogs: AttendanceLog[],
  joinedClassIds: string[],
  currentTime: string
) => {
  const currentMins = getMinutes(currentTime);

  const classEntries = timetable.filter((entry) =>
    joinedClassIds.includes(entry.classId)
  );

  const pastEntries = classEntries.filter((entry) => {
    const endMins = getMinutes(entry.endTime);

    return (
      endMins < currentMins &&
      !entry.isCancelled
    );
  });

  const attendedCount = pastEntries.filter((entry) =>
    attendanceLogs.some(
      (log) =>
        log.timetableEntryId === entry.id &&
        log.status === 'attended'
    )
  ).length;

  const totalScheduled = pastEntries.length;
  const missedCount =
    totalScheduled - attendedCount;

  const attendancePercentage =
    totalScheduled > 0
      ? Math.round(
          (attendedCount / totalScheduled) * 100
        )
      : 100;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  const sortedEntries = [...pastEntries].sort(
    (a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return b.dayOfWeek - a.dayOfWeek;
      }

      return b.startTime.localeCompare(
        a.startTime
      );
    }
  );

  for (const entry of sortedEntries) {
    const attended = attendanceLogs.some(
      (log) =>
        log.timetableEntryId === entry.id &&
        log.status === 'attended'
    );

    if (attended) {
      streak++;

      if (streak > longestStreak) {
        longestStreak = streak;
      }
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
    longestStreak,
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
  const [currentTimeMins, setCurrentTimeMins] =
    useState(0);

  const [liveCountdown, setLiveCountdown] =
    useState('');

  const [
    isAnnouncementOpen,
    setIsAnnouncementOpen,
  ] = useState(false);

  const [hasUnread, setHasUnread] =
    useState(false);

  const [classRepMsg, setClassRepMsg] =
    useState('');

  const [
    isSubmittingRepMsg,
    setIsSubmittingRepMsg,
  ] = useState(false);

  const [repSuccess, setRepSuccess] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [username, setUsername] =
    useState('Student');

  const [greeting, setGreeting] =
    useState(getGreeting());

  const [userVotes, setUserVotes] = useState<
    Record<
      string,
      {
        votes: number;
        hasVoted: boolean;
      }
    >
  >(() => {
    try {
      const saved = localStorage.getItem(
        'thesdel_bulletin_votes'
      );

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [pollVotes, setPollVotes] = useState<
    Record<
      string,
      {
        votedChoice: string;
        textResponse?: string;
        submittedAt?: number;
      }
    >
  >(() => {
    try {
      const stored = localStorage.getItem(
        'thesdel_poll_votes'
      );

      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setUsername(getStoredUsername());
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    const interval = setInterval(
      updateGreeting,
      60000
    );

    return () => clearInterval(interval);
  }, []);

  const handleForceRefresh = async () => {
    if (!onForceRefresh || isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      await onForceRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegisterPollVote = (
    pollId: string,
    choice: string,
    textResponse?: string
  ) => {
    const updated = {
      ...pollVotes,
      [pollId]: {
        votedChoice: choice,
        textResponse,
        submittedAt: Date.now(),
      },
    };

    setPollVotes(updated);

    localStorage.setItem(
      'thesdel_poll_votes',
      JSON.stringify(updated)
    );
  };

  useEffect(() => {
    const bulletinUpdates = updates.filter((up) => {
      if (
        up.description.startsWith('{') &&
        up.description.endsWith('}')
      ) {
        try {
          const parsed = JSON.parse(
            up.description
          );

          if (parsed.isAd) return true;

          if (parsed.isPoll) {
            const vote = pollVotes[up.id];

            if (vote?.submittedAt) {
              const elapsed =
                Date.now() - vote.submittedAt;

              if (
                elapsed >=
                24 * 60 * 60 * 1000
              ) {
                return false;
              }
            }

            return true;
          }
        } catch {}
      }

      if (
        up.type === 'entry_added' ||
        up.type === 'entry_edited' ||
        up.type === 'entry_deleted'
      ) {
        return false;
      }

      return true;
    });

    if (bulletinUpdates.length > 0) {
      const lastReadId =
        localStorage.getItem(
          'thesdel_last_read_update_id'
        );

      const latestId =
        bulletinUpdates[0].id;

      if (lastReadId !== latestId) {
        setHasUnread(true);
        setIsAnnouncementOpen(true);
      }
    }
  }, [updates, pollVotes]);

  const handleToggleAnnouncements = () => {
    setIsAnnouncementOpen(
      (previous) => !previous
    );

    const bulletinUpdates = updates.filter((up) => {
      if (
        up.description.startsWith('{') &&
        up.description.endsWith('}')
      ) {
        try {
          const parsed = JSON.parse(
            up.description
          );

          if (parsed.isAd) return true;

          if (parsed.isPoll) {
            const vote = pollVotes[up.id];

            if (vote?.submittedAt) {
              const elapsed =
                Date.now() - vote.submittedAt;

              if (
                elapsed >=
                24 * 60 * 60 * 1000
              ) {
                return false;
              }
            }

            return true;
          }
        } catch {}
      }

      if (
        up.type === 'entry_added' ||
        up.type === 'entry_edited' ||
        up.type === 'entry_deleted'
      ) {
        return false;
      }

      return true;
    });

    if (bulletinUpdates.length > 0) {
      localStorage.setItem(
        'thesdel_last_read_update_id',
        bulletinUpdates[0].id
      );

      setHasUnread(false);
    }
  };

  const handleRegisterVote = (
    updateId: string
  ) => {
    const current = userVotes[updateId];

    if (current?.hasVoted) return;

    const updated = {
      ...userVotes,
      [updateId]: {
        votes: (current?.votes || 0) + 1,
        hasVoted: true,
      },
    };

    setUserVotes(updated);

    localStorage.setItem(
      'thesdel_bulletin_votes',
      JSON.stringify(updated)
    );
  };

  const handleClassRepSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !classRepMsg.trim() ||
      !onAddBroadcast ||
      !activeClassId
    ) {
      return;
    }

    setIsSubmittingRepMsg(true);

    const success = await onAddBroadcast(
      activeClassId,
      classRepMsg
    );

    setIsSubmittingRepMsg(false);

    if (success) {
      setClassRepMsg('');
      setRepSuccess(true);

      setTimeout(() => {
        setRepSuccess(false);
      }, 3000);
    }
  };

  useEffect(() => {
    setCurrentTimeMins(
      getMinutes(currentSimulatedTime)
    );
  }, [currentSimulatedTime]);

  const joinedClassIds = joinedClasses.map(
    (c) => c.id
  );

  const deviceToday = (() => {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');
  })();

  const todayDayOfWeek = (() => {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
  })();

  const todayEntries = timetable
    .filter(
      (entry) =>
        entry.dayOfWeek === todayDayOfWeek &&
        joinedClassIds.includes(entry.classId)
    )
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  const stats = calculateRealAttendanceStats(
    timetable,
    attendanceLogs,
    joinedClassIds,
    currentSimulatedTime
  );

  let nextClass: TimetableEntry | null = null;
  let nextClassIsLive = false;

  const updateCountdown = () => {
    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    let foundClass: TimetableEntry | null =
      null;

    let foundIsLive = false;
    let remaining = -1;
    let timeUntil = -1;

    for (const entry of todayEntries) {
      if (entry.isCancelled) continue;

      const start = getMinutes(
        entry.startTime
      );

      const end = getMinutes(
        entry.endTime
      );

      if (
        currentMinutes >= start &&
        currentMinutes < end
      ) {
        foundClass = entry;
        foundIsLive = true;
        remaining =
          end - currentMinutes;
        break;
      }

      if (
        currentMinutes < start &&
        (timeUntil === -1 ||
          start - currentMinutes <
            timeUntil)
      ) {
        foundClass = entry;
        foundIsLive = false;
        timeUntil =
          start - currentMinutes;
      }
    }

    nextClass = foundClass;
    nextClassIsLive = foundIsLive;

    if (foundIsLive && foundClass) {
      setLiveCountdown(
        `LIVE NOW · ${Math.max(
          0,
          remaining
        )}m remaining`
      );
    } else if (foundClass) {
      const hours = Math.floor(
        timeUntil / 60
      );

      const minutes = timeUntil % 60;

      setLiveCountdown(
        hours > 0
          ? `Starts in ${hours}h ${minutes}m`
          : `Starts in ${minutes}m`
      );
    } else {
      setLiveCountdown(
        'No more classes today'
      );
    }
  };

  useEffect(() => {
    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      60000
    );

    return () => clearInterval(interval);
  }, [todayEntries]);

  const formattedDate =
    new Date().toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );

  const activeAd = updates.find((up) => {
    if (
      up.description.startsWith('{') &&
      up.description.endsWith('}')
    ) {
      try {
        const parsed = JSON.parse(
          up.description
        );

        return parsed.isAd === true;
      } catch {
        return false;
      }
    }

    return false;
  });

  useEffect(() => {
    if (
      activeAd &&
      onTrackAdEvent
    ) {
      const sessionKey =
        `thesdel_ad_viewed_${activeAd.id}`;

      if (
        !sessionStorage.getItem(
          sessionKey
        )
      ) {
        onTrackAdEvent(
          activeAd.id,
          'view'
        );

        sessionStorage.setItem(
          sessionKey,
          'true'
        );
      }
    }
  }, [
    activeAd,
    onTrackAdEvent,
  ]);

  /*
   * ---------------------------------------------------------
   * DERIVED BULLETIN / UPDATE DATA
   * ---------------------------------------------------------
   */

  const bulletinUpdates = updates.filter(
    (up) => {
      if (
        up.type === 'entry_added' ||
        up.type === 'entry_edited' ||
        up.type === 'entry_deleted'
      ) {
        return false;
      }

      if (
        up.description.startsWith('{') &&
        up.description.endsWith('}')
      ) {
        try {
          const parsed = JSON.parse(
            up.description
          );

          if (parsed.isAd) return false;

          if (parsed.isPoll) {
            const vote = pollVotes[up.id];

            if (vote?.submittedAt) {
              const elapsed =
                Date.now() -
                vote.submittedAt;

              if (
                elapsed >=
                24 * 60 * 60 * 1000
              ) {
                return false;
              }
            }

            return true;
          }
        } catch {}
      }

      return true;
    }
  );

  const visibleBulletinUpdates =
    isAnnouncementOpen
      ? bulletinUpdates.slice(0, 5)
      : bulletinUpdates.slice(0, 3);

  /*
   * ---------------------------------------------------------
   * UPDATE HELPERS
   * ---------------------------------------------------------
   */

  const parseUpdate = (
    update: ClassUpdate
  ) => {
    if (
      update.description.startsWith('{') &&
      update.description.endsWith('}')
    ) {
      try {
        return JSON.parse(
          update.description
        );
      } catch {
        return null;
      }
    }

    return null;
  };

  const getUpdateLabel = (
    update: ClassUpdate
  ) => {
    if (update.type === 'cancellation') {
      return {
        text: 'CANCELLED',
        className:
          'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
      };
    }

    if (
      update.type === 'venue_change'
    ) {
      return {
        text: 'VENUE CHANGED',
        className:
          'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
      };
    }

    if (update.classId === 'global') {
      return {
        text: 'GLOBAL',
        className:
          'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      };
    }

    return {
      text: 'CLASS UPDATE',
      className:
        'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800',
    };
  };

  /*
   * ---------------------------------------------------------
   * ACTIVE AD DATA
   * ---------------------------------------------------------
   */

  let activeAdData: any = null;

  if (activeAd) {
    try {
      const parsed = JSON.parse(
        activeAd.description
      );

      if (parsed.isAd) {
        activeAdData = parsed;
      }
    } catch {
      activeAdData = null;
    }
  }

  /*
   * ---------------------------------------------------------
   * NEXT CLASS
   * ---------------------------------------------------------
   */

  const currentMinutes =
    getMinutes(currentSimulatedTime);

  const liveEntry = todayEntries.find(
    (entry) => {
      if (entry.isCancelled) return false;

      const start = getMinutes(
        entry.startTime
      );

      const end = getMinutes(
        entry.endTime
      );

      return (
        currentMinutes >= start &&
        currentMinutes < end
      );
    }
  );

  const upcomingEntry = todayEntries.find(
    (entry) => {
      if (entry.isCancelled) return false;

      const start = getMinutes(
        entry.startTime
      );

      return start > currentMinutes;
    }
  );

  const displayNextClass =
    liveEntry ||
    upcomingEntry ||
    null;

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div
      className="space-y-8 pb-10"
      id="home-view-container"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        id="home-header"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />

            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              {TEXT.today}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {greeting}, {username}.
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </p>
        </div>

                <button
          onClick={onNavigateToNotifications}
          className="relative self-start sm:self-auto flex items-center justify-center w-10 h-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />

          {hasUnread && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </>
          )}
        </button>
      </header>

      {/* =====================================================
          NEXT CLASS HERO
      ====================================================== */}

      <section
        id="next-class-hero"
        className="relative overflow-hidden border border-zinc-900 dark:border-zinc-100 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
      >
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    nextClassIsLive
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-amber-400'
                  }`}
                />

                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  {nextClassIsLive
                    ? TEXT.liveNow
                    : TEXT.nextClass}
                </span>
              </div>

              {displayNextClass ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl">
                    {displayNextClass.subject}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-zinc-300 dark:text-zinc-600">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5" />

                      {displayNextClass.startTime} —{' '}
                      {displayNextClass.endTime}
                    </span>

                    <span className="flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5" />

                      {displayNextClass.venue}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {TEXT.noMoreClasses}
                  </h2>

                  <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
                    {TEXT.nothingScheduled}
                  </p>
                </>
              )}
            </div>

            <div className="lg:text-right shrink-0">
              <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">
                {TEXT.status}
              </span>

              <span className="text-xl sm:text-2xl font-mono font-bold tracking-tight">
                {liveCountdown ||
                  'No more classes today'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8"
        id="home-main-layout"
      >
        {/* ===================================================
            LEFT / TODAY'S TIMELINE
        ==================================================== */}

        <main id="today-timeline">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                {TEXT.schedule}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {todayEntries.length === 0
                  ? TEXT.nothingScheduled
                  : `${todayEntries.length} ${
                      todayEntries.length === 1
                        ? TEXT.classScheduled
                        : TEXT.classesScheduled
                    } scheduled`}
              </p>
            </div>

            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {currentSimulatedTime}
            </span>
          </div>

          {joinedClasses.length === 0 ? (
            <div
              className="py-16 text-center border-b border-zinc-200 dark:border-zinc-800"
              id="empty-classes-prompt"
            >
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No classes connected.
              </p>

              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Join a class from the Class tab to build
                your schedule.
              </p>
            </div>
          ) : todayEntries.length === 0 ? (
            <div
              className="py-16 text-center border-b border-zinc-200 dark:border-zinc-800"
              id="no-classes-today"
            >
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No classes scheduled today.
              </p>

              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Your next classes will appear on the
                timetable.
              </p>
            </div>
          ) : (
            <div id="classes-list">
              {todayEntries.map((entry, index) => {
                const startMins = getMinutes(
                  entry.startTime
                );

                const endMins = getMinutes(
                  entry.endTime
                );

                let statusLabel:
                  | 'upcoming'
                  | 'live'
                  | 'completed'
                  | 'cancelled' = 'upcoming';

                if (entry.isCancelled) {
                  statusLabel = 'cancelled';
                } else if (
                  currentTimeMins >= endMins
                ) {
                  statusLabel = 'completed';
                } else if (
                  currentTimeMins >= startMins &&
                  currentTimeMins < endMins
                ) {
                  statusLabel = 'live';
                }

                const hasAttended =
                  attendanceLogs.some(
                    (log) =>
                      log.timetableEntryId ===
                        entry.id &&
                      log.date === deviceToday &&
                      log.status === 'attended'
                  );

                const isInteractable =
                  !entry.isCancelled &&
                  (statusLabel === 'live' ||
                    statusLabel === 'completed');

                const isLast =
                  index === todayEntries.length - 1;

                return (
                  <div
                    key={entry.id}
                    id={`class-item-${entry.id}`}
                    className={`relative grid grid-cols-[64px_18px_minmax(0,1fr)] md:grid-cols-[78px_20px_minmax(0,1fr)_auto] gap-3 md:gap-4 py-5 border-b border-zinc-200 dark:border-zinc-800 ${
                      statusLabel === 'live'
                        ? 'bg-amber-50/50 dark:bg-amber-950/10'
                        : ''
                    }`}
                  >
                    {/* TIME */}

                    <div className="pt-0.5 text-right">
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          statusLabel === 'live'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {entry.startTime}
                      </span>

                      <span className="block text-[9px] font-mono text-zinc-400 dark:text-zinc-600 mt-0.5">
                        {entry.endTime}
                      </span>
                    </div>

                    {/* TIMELINE */}

                    <div className="relative flex justify-center">
                      {!isLast && (
                        <span className="absolute top-3 bottom-[-21px] w-px bg-zinc-200 dark:bg-zinc-800" />
                      )}

                      <span
                        className={`relative z-10 mt-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                          statusLabel === 'live'
                            ? 'bg-amber-500 border-amber-500'
                            : statusLabel === 'completed'
                            ? 'bg-zinc-400 border-zinc-400 dark:bg-zinc-600 dark:border-zinc-600'
                            : statusLabel === 'cancelled'
                            ? 'bg-white border-zinc-300 dark:bg-zinc-950 dark:border-zinc-700'
                            : 'bg-white border-zinc-400 dark:bg-zinc-950 dark:border-zinc-500'
                        }`}
                      />
                    </div>

                    {/* CLASS CONTENT */}

                    <div
                      className={`min-w-0 ${
                        statusLabel === 'completed'
                          ? 'opacity-70'
                          : entry.isCancelled
                          ? 'opacity-55'
                          : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                            statusLabel === 'live'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        >
                          {statusLabel === 'live'
                            ? TEXT.liveNow
                            : statusLabel ===
                              'completed'
                            ? hasAttended
                              ? TEXT.attended
                              : 'Missed check-in'
                            : statusLabel ===
                              'cancelled'
                            ? 'Cancelled'
                            : 'Upcoming'}
                        </span>

                        {hasAttended && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3 h-3" />
                            {TEXT.attended}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base font-bold tracking-tight text-zinc-950 dark:text-white ${
                          entry.isCancelled
                            ? 'line-through'
                            : ''
                        }`}
                      >
                        {entry.subject}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {entry.venue}
                        </span>

                        <span>
                          {entry.durationMinutes} min
                        </span>
                      </div>

                      {entry.originalVenue && (
                        <p className="mt-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                          Originally:{' '}
                          <span className="line-through">
                            {entry.originalVenue}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* ACTION */}

                    <div className="col-start-3 md:col-start-4 md:self-center md:row-start-1">
                      {hasAttended ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Logged
                        </div>
                      ) : entry.isCancelled ? (
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                          No check-in
                        </span>
                      ) : isInteractable ? (
                        <button
                          id={`btn-mark-${entry.id}`}
                          onClick={() =>
                            onMarkAttendance(
                              entry.id,
                              deviceToday
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 border border-zinc-950 dark:border-white text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Mark attendance
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                          Check-in opens during class
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
{/* ===================================================
            RIGHT / SIDEBAR
        ==================================================== */}

        <aside
          id="home-sidebar"
          className="space-y-5"
        >
          {/* =================================================
              ATTENDANCE
          ================================================== */}

          <section
            id="attendance-summary"
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    {TEXT.attendance}
                  </p>

                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white mt-1">
                    {TEXT.currentStanding}
                  </h3>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                    stats.attendancePercentage >= 75
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {stats.attendancePercentage >= 75
                    ? TEXT.onTarget
                    : TEXT.belowTarget}
                </span>
              </div>

              <div className="flex items-end justify-between mt-6">
                <span className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {stats.attendancePercentage}%
                </span>

                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 pb-1">
                  {stats.attendedCount} / {stats.totalScheduled}{' '}
                  attended
                </span>
              </div>

              <div className="mt-4 h-1.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stats.attendancePercentage >= 75
                      ? 'bg-zinc-950 dark:bg-white'
                      : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      stats.attendancePercentage
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="p-4 border-r border-zinc-200 dark:border-zinc-800">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {TEXT.attended}
                </span>

                <span className="block text-lg font-bold text-zinc-950 dark:text-white mt-1">
                  {stats.attendedCount}
                </span>
              </div>

              <div className="p-4">
                <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {TEXT.missed}
                </span>

                <span className="block text-lg font-bold text-zinc-950 dark:text-white mt-1">
                  {stats.missedCount}
                </span>
              </div>
            </div>
          </section>

          {/* =================================================
              UPDATES
          ================================================== */}

          <section
            id="updates-panel"
            className={`border bg-white dark:bg-zinc-900 ${
              hasUnread
                ? 'border-amber-300 dark:border-amber-800'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      {TEXT.bulletin}
                    </p>

                    {hasUnread && (
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {TEXT.new}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white mt-1">
                    {TEXT.updates}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  {onForceRefresh && (
                    <button
                      onClick={handleForceRefresh}
                      disabled={isRefreshing}
                      className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                      title="Refresh updates"
                    >
                      <RotateCw
                        className={`w-3.5 h-3.5 ${
                          isRefreshing ? 'animate-spin' : ''
                        }`}
                      />
                    </button>
                  )}

                  {onNavigateToNotifications && (
                    <button
                      onClick={onNavigateToNotifications}
                      className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                      title="Open notifications"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {visibleBulletinUpdates.length === 0 ? (
              <div className="px-5 py-7 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  No new updates.
                </p>
              </div>
            ) : (
              <div className="border-t border-zinc-200 dark:border-zinc-800">
                {visibleBulletinUpdates.map((up) => {
                  const parsedData = parseUpdate(up);
                  const isPoll = parsedData?.isPoll === true;
                  const label = getUpdateLabel(up);
                  const hasVoted = userVotes[up.id]?.hasVoted === true;

                  const isClassRepAnnouncement = Boolean(
                    up.userId &&
                      (
                        up.userId.startsWith('user_rep') ||
                        up.userId.includes('rep') ||
                        up.userId.includes('asst') ||
                        up.userName.toLowerCase().includes('rep') ||
                        up.userName.toLowerCase().includes('asst')
                      )
                  );

                  return (
                    <article
                      key={up.id}
                      className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span
                          className={`px-1.5 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-wider ${label.className}`}
                        >
                          {isPoll
                            ? 'POLL'
                            : isClassRepAnnouncement
                            ? 'CLASS REP'
                            : label.text}
                        </span>

                        <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-600 shrink-0">
                          {new Date(up.timestamp).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>

                      {isPoll && parsedData ? (
                        <div>
                          <p className="text-xs font-semibold leading-relaxed text-zinc-900 dark:text-zinc-100">
                            {parsedData.question}
                          </p>

                          <button
                            onClick={onNavigateToNotifications}
                            className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            Respond anonymously
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {up.description}
                          </p>

                          <div className="flex items-center justify-between gap-3 mt-3">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-600 truncate">
                              {isClassRepAnnouncement
                                ? 'Class representative'
                                : `By ${up.userName}`}
                            </span>

                            <button
                              onClick={() => handleRegisterVote(up.id)}
                              disabled={hasVoted}
                              className={`shrink-0 inline-flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                hasVoted
                                  ? 'text-emerald-600 dark:text-emerald-400 cursor-default'
                                  : 'text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                              }`}
                            >
                              <ThumbsUp
                                className={`w-3 h-3 ${
                                  hasVoted ? 'fill-current' : ''
                                }`}
                              />

                              {hasVoted ? 'Agreed' : 'Agree'}
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {bulletinUpdates.length > 3 && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-3">
                <button
                  onClick={handleToggleAnnouncements}
                  className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {isAnnouncementOpen
                    ? 'Show less'
                    : `Show ${Math.min(
                        bulletinUpdates.length,
                        5
                      )} updates`}

                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${
                      isAnnouncementOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </section>
{/* =================================================
              CLASS REP CONSOLE
          ================================================== */}

          {userRole === 'representative' &&
            onAddBroadcast &&
            activeClassId && (
              <section
                id="class-rep-console"
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Megaphone className="w-3.5 h-3.5 text-zinc-500" />

                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      {TEXT.representative}
                    </p>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    {TEXT.broadcastToClass}
                  </h3>

                  <form
                    onSubmit={handleClassRepSubmit}
                    className="mt-4"
                  >
                    <textarea
                      value={classRepMsg}
                      onChange={(e) =>
                        setClassRepMsg(e.target.value)
                      }
                      placeholder="Share a reminder or important class notice..."
                      maxLength={250}
                      rows={3}
                      required
                      className="w-full resize-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex items-center justify-between gap-3 mt-2">
                      <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-600">
                        {classRepMsg.length}/250
                      </span>

                      <button
                        type="submit"
                        disabled={
                          isSubmittingRepMsg ||
                          !classRepMsg.trim()
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmittingRepMsg
                          ? 'Publishing...'
                          : 'Broadcast'}

                        <Send className="w-3 h-3" />
                      </button>
                    </div>

                    {repSuccess && (
                      <p className="mt-3 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Broadcast dispatched successfully.
                      </p>
                    )}
                  </form>
                </div>
              </section>
            )}

          {/* =================================================
              SPONSOR SPOTLIGHT
          ================================================== */}

          {activeAd && activeAdData && (
            <section
              id="sponsor-spotlight"
              className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10"
            >
              <button
                type="button"
                onClick={() => {
                  if (onTrackAdEvent) {
                    onTrackAdEvent(
                      activeAd.id,
                      'click'
                    );
                  }

                  const destination =
                    activeAdData.adUrl ||
                    activeAdData.adLink;

                  if (destination) {
                    window.open(
                      destination,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                className="w-full text-left p-5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />

                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                      {TEXT.sponsored}
                    </span>
                  </div>

                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>

                {activeAdData.adImageUrl && (
                  <img
                    src={activeAdData.adImageUrl}
                    alt="Sponsored promotion"
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover border border-amber-200 dark:border-amber-900/40 mb-4"
                  />
                )}

                <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
                  {activeAdData.adTitle ||
                    'Campaign promotion'}
                </h3>

                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 mt-1.5">
                  {activeAdData.description ||
                    'Promoted partner offer'}
                </p>

                {activeAdData.adActionText && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {activeAdData.adActionText}

                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}