import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertCircle,
  Clock,
  MapPin,
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
  User,
} from '../types';

interface HomeViewProps {
  currentUser: User;

  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string;
  updates: ClassUpdate[];

  onMarkAttendance: (
    entryId: string,
    date: string
  ) => void;

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

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';

  return 'Good evening';
};

const getMinutes = (timeStr: string): number => {
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
  currentUser,
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
  const firstName =
    currentUser?.name?.trim().split(/\s+/)[0] ||
    'Student';

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
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting();

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
      console.error(
        'Failed to refresh HomeView:',
        error
      );
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

    try {
      const success =
        await onAddBroadcast(
          activeClassId,
          classRepMsg.trim()
        );

      if (success) {
        setClassRepMsg('');
        setRepSuccess(true);

        setTimeout(() => {
          setRepSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error(
        'Failed to send class broadcast:',
        error
      );
    } finally {
      setIsSubmittingRepMsg(false);
    }
  };

  const joinedClassIds =
    joinedClasses.map((c) => c.id);

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
        joinedClassIds.includes(
          entry.classId
        )
    )
    .sort((a, b) =>
      a.startTime.localeCompare(
        b.startTime
      )
    );

  const stats =
    calculateRealAttendanceStats(
      timetable,
      attendanceLogs,
      joinedClassIds,
      currentSimulatedTime
    );

  const currentMinutes =
    getMinutes(currentSimulatedTime);

  const liveEntry =
    todayEntries.find((entry) => {
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
    }) || null;

  const upcomingEntry =
    todayEntries.find((entry) => {
      if (entry.isCancelled) return false;

      const start = getMinutes(
        entry.startTime
      );

      return start > currentMinutes;
    }) || null;

  const displayNextClass =
    liveEntry || upcomingEntry || null;

  const nextClassIsLive =
    !!liveEntry;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      const nowMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      const live = todayEntries.find((entry) => {
        if (entry.isCancelled) {
          return false;
        }

        const start = getMinutes(
          entry.startTime
        );

        const end = getMinutes(
          entry.endTime
        );

        return (
          nowMinutes >= start &&
          nowMinutes < end
        );
      });

      if (live) {
        const end = getMinutes(
          live.endTime
        );

        const remaining =
          end - nowMinutes;

        setLiveCountdown(
          `LIVE NOW · ${Math.max(
            0,
            remaining
          )}m remaining`
        );

        return;
      }

      const upcoming = todayEntries.find(
        (entry) => {
          if (entry.isCancelled) {
            return false;
          }

          return (
            getMinutes(entry.startTime) >
            nowMinutes
          );
        }
      );

      if (upcoming) {
        const timeUntil =
          getMinutes(
            upcoming.startTime
          ) - nowMinutes;

        const hours = Math.floor(
          timeUntil / 60
        );

        const minutes = timeUntil % 60;

        setLiveCountdown(
          hours > 0
            ? `Starts in ${hours}h ${minutes}m`
            : `Starts in ${minutes}m`
        );

        return;
      }

      setLiveCountdown(
        'No more classes today'
      );
    };

    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      60000
    );

    return () =>
      clearInterval(interval);
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

  const activeAd =
    updates.find((up) => {
      if (
        !up.description.startsWith('{') ||
        !up.description.endsWith('}')
      ) {
        return false;
      }

      try {
        const parsed = JSON.parse(
          up.description
        );

        return parsed.isAd === true;
      } catch {
        return false;
      }
    }) || null;

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

  const bulletinUpdates =
    updates.filter((up) => {
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

          if (parsed.isAd) {
            return false;
          }

          if (parsed.isPoll) {
            const vote =
              pollVotes[up.id];

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
    });

  const visibleBulletinUpdates =
    isAnnouncementOpen
      ? bulletinUpdates.slice(0, 5)
      : bulletinUpdates.slice(0, 3);

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
    if (
      update.type === 'cancellation'
    ) {
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

    if (
      update.classId === 'global'
    ) {
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
return (
    <div
      className="space-y-8 pb-10"
      id="home-view-container"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Today
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            {greeting}, {firstName}.
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToNotifications}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />

          {hasUnread && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
          )}
        </button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {nextClassIsLive
                    ? 'Live class'
                    : 'Next class'}
                </span>

                {nextClassIsLive && (
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                )}
              </div>

              {displayNextClass ? (
                <>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    {displayNextClass.courseCode ||
                      displayNextClass.subject ||
                      'Class'}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {displayNextClass.startTime} –{' '}
                      {displayNextClass.endTime}
                    </span>

                    {displayNextClass.venue && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {displayNextClass.venue}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    No more classes
                  </h2>

                  <p className="mt-3 text-sm text-zinc-400">
                    Your academic day is clear.
                  </p>
                </>
              )}
            </div>

            <div className="shrink-0">
              <p className="text-sm font-semibold text-amber-400">
                {liveCountdown}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
                Today
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Your class schedule
              </p>
            </div>

            {onForceRefresh && (
              <button
                type="button"
                onClick={handleForceRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
              >
                <RotateCw
                  className={`h-4 w-4 ${
                    isRefreshing
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                {isRefreshing
                  ? 'Refreshing...'
                  : 'Refresh'}
              </button>
            )}
          </div>

          {todayEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-semibold text-zinc-900 dark:text-white">
                No classes today
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Enjoy the free time or get ahead.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {todayEntries.map((entry) => {
                const start = getMinutes(
                  entry.startTime
                );

                const end = getMinutes(
                  entry.endTime
                );

                const isLive =
                  currentMinutes >= start &&
                  currentMinutes < end &&
                  !entry.isCancelled;

                const attendance =
                  attendanceLogs.find(
                    (log) =>
                      log.entryId === entry.id &&
                      log.date === deviceToday
                  );

                const isMarked =
                  attendance?.status ===
                  'present';

                return (
                  <div
                    key={entry.id}
                    className={`group flex items-center gap-4 py-5 ${
                      isLive
                        ? 'bg-amber-50/50 dark:bg-amber-950/10'
                        : ''
                    }`}
                  >
                    <div className="w-20 shrink-0">
                      <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                        {entry.startTime}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {entry.endTime}
                      </p>
                    </div>

                    <div className="relative flex min-w-0 flex-1 items-center gap-4">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isLive
                            ? 'bg-amber-500'
                            : entry.isCancelled
                            ? 'bg-rose-500'
                            : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      />

                      <div className="min-w-0">
                        <p
                          className={`truncate font-semibold ${
                            entry.isCancelled
                              ? 'text-zinc-400 line-through'
                              : 'text-zinc-950 dark:text-white'
                          }`}
                        >
                          {entry.courseCode ||
                            entry.subject ||
                            'Class'}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {entry.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {entry.venue}
                            </span>
                          )}

                          {isLive && (
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              LIVE
                            </span>
                          )}

                          {entry.isCancelled && (
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              CANCELLED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!entry.isCancelled && (
                      <button
                        type="button"
                        onClick={() =>
                          onMarkAttendance(
                            entry.id,
                            deviceToday
                          )
                        }
                        disabled={isMarked}
                        className={`flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
                          isMarked
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />

                        {isMarked
                          ? 'Present'
                          : 'Mark'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {stats.attendancePercentage}%
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                {stats.attendancePercentage >=
                75 ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all dark:bg-white"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      stats.attendancePercentage
                    )
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {stats.attendedCount} attended
              </span>

              <span>
                {stats.totalScheduled} total
              </span>
            </div>
          </section>
<section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-zinc-500" />

                <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Updates
                </h2>

                {hasUnread && (
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                )}
              </div>

              {bulletinUpdates.length > 3 && (
                <button
                  type="button"
                  onClick={handleToggleAnnouncements}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >
                  {isAnnouncementOpen
                    ? 'Show less'
                    : 'View all'}
                </button>
              )}
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {visibleBulletinUpdates.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No updates yet.
                  </p>
                </div>
              ) : (
                visibleBulletinUpdates.map(
                  (update) => {
                    const parsed =
                      parseUpdate(update);

                    const label =
                      getUpdateLabel(update);

                    const poll =
                      parsed?.isPoll
                        ? parsed
                        : null;

                    const vote =
                      pollVotes[update.id];

                    return (
                      <div
                        key={update.id}
                        className="px-5 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`rounded-full border px-2 py-1 text-[9px] font-bold tracking-wide ${label.className}`}
                          >
                            {label.text}
                          </span>

                          <span className="text-[10px] text-zinc-400">
                            {new Date(
                              update.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                          {poll?.question ||
                            parsed?.message ||
                            update.description}
                        </p>

                        {poll && (
                          <div className="mt-4 space-y-2">
                            {poll.options?.map(
                              (
                                option: string
                              ) => (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={!!vote}
                                  onClick={() =>
                                    handleRegisterPollVote(
                                      update.id,
                                      option
                                    )
                                  }
                                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${
                                    vote?.votedChoice ===
                                    option
                                      ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                                  }`}
                                >
                                  <span>
                                    {option}
                                  </span>

                                  {vote?.votedChoice ===
                                    option && (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              )
                            )}
                          </div>
                        )}

                        {!poll && (
                          <button
                            type="button"
                            disabled={
                              userVotes[update.id]
                                ?.hasVoted
                            }
                            onClick={() =>
                              handleRegisterVote(
                                update.id
                              )
                            }
                            className="mt-3 flex items-center gap-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950 disabled:cursor-default disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />

                            {userVotes[update.id]
                              ?.hasVoted
                              ? 'Reacted'
                              : 'Acknowledge'}
                          </button>
                        )}
                      </div>
                    );
                  }
                )
              )}
            </div>
          </section>

          {userRole === 'class_rep' &&
            onAddBroadcast &&
            activeClassId && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-zinc-500" />

                  <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Class rep
                  </h2>
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Send a broadcast to your class.
                </p>

                <form
                  onSubmit={handleClassRepSubmit}
                  className="mt-4 space-y-3"
                >
                  <textarea
                    value={classRepMsg}
                    onChange={(e) =>
                      setClassRepMsg(
                        e.target.value
                      )
                    }
                    placeholder="Write an announcement..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
                  />

                  <button
                    type="submit"
                    disabled={
                      isSubmittingRepMsg ||
                      !classRepMsg.trim()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    <Send className="h-3.5 w-3.5" />

                    {isSubmittingRepMsg
                      ? 'Sending...'
                      : 'Broadcast'}
                  </button>
                </form>

                {repSuccess && (
                  <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Broadcast sent successfully.
                  </p>
                )}
              </section>
            )}

          {activeAdData && (
            <section
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              onClick={() => {
                if (
                  activeAd &&
                  onTrackAdEvent
                ) {
                  onTrackAdEvent(
                    activeAd.id,
                    'click'
                  );
                }
              }}
            >
              {activeAdData.imageUrl && (
                <img
                  src={activeAdData.imageUrl}
                  alt={
                    activeAdData.title ||
                    'Sponsored'
                  }
                  className="h-36 w-full object-cover"
                />
              )}

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Sponsored
                  </span>

                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>

                {activeAdData.title && (
                  <h3 className="mt-3 text-sm font-bold text-zinc-950 dark:text-white">
                    {activeAdData.title}
                  </h3>
                )}

                {activeAdData.description && (
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {activeAdData.description}
                  </p>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}