import React, { useState, useEffect } from 'react';
import {
  TimetableEntry,
  AttendanceLog,
  ClassGroup,
  ClassUpdate,
  User,
} from '../types';
import type { HomeStrings } from '../i18n/types.app';
import HomeHeader from './home/HomeHeader';
import HomeNextClass from './home/HomeNextClass';
import HomeTodaySchedule from './home/HomeTodaySchedule';
import HomeAttendanceCard from './home/HomeAttendanceCard';
import HomeUpdates from './home/HomeUpdates';
import HomeRepBroadcast from './home/HomeRepBroadcast';
import HomeAdCard from './home/HomeAdCard';

interface HomeViewProps {
  currentUser: User;
  strings: HomeStrings;
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
    return endMins < currentMins && !entry.isCancelled;
  });

  const attendedCount = pastEntries.filter((entry) =>
    attendanceLogs.some(
      (log) =>
        log.timetableEntryId === entry.id &&
        log.status === 'attended'
    )
  ).length;

  const totalScheduled = pastEntries.length;
  const missedCount = totalScheduled - attendedCount;

  const attendancePercentage =
    totalScheduled > 0
      ? Math.round((attendedCount / totalScheduled) * 100)
      : 100;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  const sortedEntries = [...pastEntries].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return b.dayOfWeek - a.dayOfWeek;
    return b.startTime.localeCompare(a.startTime);
  });

  for (const entry of sortedEntries) {
    const attended = attendanceLogs.some(
      (log) =>
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
    longestStreak,
  };
};

export default function HomeView({
  currentUser,
  strings,
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
    strings.header.nameFallback;

  const [liveCountdown, setLiveCountdown] = useState('');
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState<string>('');

  const [userVotes, setUserVotes] = useState<
    Record<string, { votes: number; hasVoted: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem('thesdel_bulletin_votes');
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
      const stored = localStorage.getItem('thesdel_poll_votes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const getGreetingText = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return strings.header.greetingMorning;
    if (hour < 18) return strings.header.greetingAfternoon;
    return strings.header.greetingEvening;
  };

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreetingText());
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, [strings]);

  const handleForceRefresh = async () => {
    if (!onForceRefresh || isRefreshing) return;

    setIsRefreshing(true);

    try {
      await onForceRefresh();
    } catch (error) {
      console.error('Failed to refresh HomeView:', error);
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
    localStorage.setItem('thesdel_poll_votes', JSON.stringify(updated));
  };

  const filterBulletinUpdates = () =>
    updates.filter((up) => {
      if (
        up.description.startsWith('{') &&
        up.description.endsWith('}')
      ) {
        try {
          const parsed = JSON.parse(up.description);

          if (parsed.isAd) return true;

          if (parsed.isPoll) {
            const vote = pollVotes[up.id];

            if (vote?.submittedAt) {
              const elapsed = Date.now() - vote.submittedAt;
              if (elapsed >= 24 * 60 * 60 * 1000) return false;
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

  useEffect(() => {
    const bulletinUpdates = filterBulletinUpdates();

    if (bulletinUpdates.length > 0) {
      const lastReadId = localStorage.getItem(
        'thesdel_last_read_update_id'
      );

      const latestId = bulletinUpdates[0].id;

      if (lastReadId !== latestId) {
        setHasUnread(true);
        setIsAnnouncementOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updates, pollVotes]);

  const handleToggleAnnouncements = () => {
    setIsAnnouncementOpen((previous) => !previous);

    const bulletinUpdates = filterBulletinUpdates();

    if (bulletinUpdates.length > 0) {
      localStorage.setItem(
        'thesdel_last_read_update_id',
        bulletinUpdates[0].id
      );
      setHasUnread(false);
    }
  };

  const handleRegisterVote = (updateId: string) => {
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

  const joinedClassIds = joinedClasses.map((c) => c.id);

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
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const stats = calculateRealAttendanceStats(
    timetable,
    attendanceLogs,
    joinedClassIds,
    currentSimulatedTime
  );

  const currentMinutes = getMinutes(currentSimulatedTime);

  const liveEntry =
    todayEntries.find((entry) => {
      if (entry.isCancelled) return false;
      const start = getMinutes(entry.startTime);
      const end = getMinutes(entry.endTime);
      return currentMinutes >= start && currentMinutes < end;
    }) || null;

  const upcomingEntry =
    todayEntries.find((entry) => {
      if (entry.isCancelled) return false;
      const start = getMinutes(entry.startTime);
      return start > currentMinutes;
    }) || null;

  const displayNextClass = liveEntry || upcomingEntry || null;
  const nextClassIsLive = !!liveEntry;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const live = todayEntries.find((entry) => {
        if (entry.isCancelled) return false;
        const start = getMinutes(entry.startTime);
        const end = getMinutes(entry.endTime);
        return nowMinutes >= start && nowMinutes < end;
      });

      if (live) {
        const end = getMinutes(live.endTime);
        const remaining = end - nowMinutes;
        setLiveCountdown(
          strings.nextClass.liveCountdown(Math.max(0, remaining))
        );
        return;
      }

      const upcoming = todayEntries.find((entry) => {
        if (entry.isCancelled) return false;
        return getMinutes(entry.startTime) > nowMinutes;
      });

      if (upcoming) {
        const timeUntil = getMinutes(upcoming.startTime) - nowMinutes;
        const hours = Math.floor(timeUntil / 60);
        const minutes = timeUntil % 60;

        setLiveCountdown(
          hours > 0
            ? strings.nextClass.startsInHours(hours, minutes)
            : strings.nextClass.startsInMinutes(minutes)
        );
        return;
      }

      setLiveCountdown(strings.nextClass.noMoreClassesToday);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [todayEntries, strings]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activeAd =
    updates.find((up) => {
      if (
        !up.description.startsWith('{') ||
        !up.description.endsWith('}')
      ) {
        return false;
      }

      try {
        const parsed = JSON.parse(up.description);
        return parsed.isAd === true;
      } catch {
        return false;
      }
    }) || null;

  let activeAdData: any = null;

  if (activeAd) {
    try {
      const parsed = JSON.parse(activeAd.description);
      if (parsed.isAd) activeAdData = parsed;
    } catch {
      activeAdData = null;
    }
  }

  useEffect(() => {
    if (activeAd && onTrackAdEvent) {
      const sessionKey = `thesdel_ad_viewed_${activeAd.id}`;

      if (!sessionStorage.getItem(sessionKey)) {
        onTrackAdEvent(activeAd.id, 'view');
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [activeAd, onTrackAdEvent]);

  const bulletinUpdates = updates.filter((up) => {
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
        const parsed = JSON.parse(up.description);

        if (parsed.isAd) return false;

        if (parsed.isPoll) {
          const vote = pollVotes[up.id];

          if (vote?.submittedAt) {
            const elapsed = Date.now() - vote.submittedAt;
            if (elapsed >= 24 * 60 * 60 * 1000) return false;
          }

          return true;
        }
      } catch {}
    }

    return true;
  });

  const visibleBulletinUpdates = isAnnouncementOpen
    ? bulletinUpdates.slice(0, 5)
    : bulletinUpdates.slice(0, 3);

  const parseUpdate = (update: ClassUpdate) => {
    if (
      update.description.startsWith('{') &&
      update.description.endsWith('}')
    ) {
      try {
        return JSON.parse(update.description);
      } catch {
        return null;
      }
    }

    return null;
  };

  const getUpdateLabel = (update: ClassUpdate) => {
    if (update.type === 'cancellation') {
      return {
        text: strings.updates.labelCancelled,
        className:
          'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
      };
    }

    if (update.type === 'venue_change') {
      return {
        text: strings.updates.labelVenueChanged,
        className:
          'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
      };
    }

    if (update.classId === 'global') {
      return {
        text: strings.updates.labelGlobal,
        className:
          'text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      };
    }

    return {
      text: strings.updates.labelClassUpdate,
      className:
        'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800',
    };
  };

  const canBroadcast =
    (userRole === 'representative' || userRole === 'class_rep') &&
    !!onAddBroadcast &&
    !!activeClassId;

  return (
    <div className="space-y-8 pb-10" id="home-view-container">
      <HomeHeader
        strings={strings.header}
        greeting={greeting}
        firstName={firstName}
        formattedDate={formattedDate}
        hasUnread={hasUnread}
        onOpenNotifications={onNavigateToNotifications || (() => {})}
      />

      <HomeNextClass
        strings={strings.nextClass}
        nextClass={displayNextClass}
        isLive={nextClassIsLive}
        liveCountdown={liveCountdown}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <HomeTodaySchedule
          strings={strings.schedule}
          todayEntries={todayEntries}
          attendanceLogs={attendanceLogs}
          deviceToday={deviceToday}
          currentMinutes={currentMinutes}
          getMinutes={getMinutes}
          isRefreshing={isRefreshing}
          showRefresh={!!onForceRefresh}
          onRefresh={handleForceRefresh}
          onMarkAttendance={onMarkAttendance}
        />

        <aside className="space-y-6">
          <HomeAttendanceCard
            strings={strings.attendance}
            attendancePercentage={stats.attendancePercentage}
            attendedCount={stats.attendedCount}
            totalScheduled={stats.totalScheduled}
          />

          <HomeUpdates
            strings={strings.updates}
            updates={updates}
            visibleUpdates={visibleBulletinUpdates}
            isAnnouncementOpen={isAnnouncementOpen}
            hasUnread={hasUnread}
            canExpand={bulletinUpdates.length > 3}
            userVotes={userVotes}
            pollVotes={pollVotes}
            parseUpdate={parseUpdate}
            getUpdateLabel={getUpdateLabel}
            onToggleAnnouncements={handleToggleAnnouncements}
            onRegisterPollVote={handleRegisterPollVote}
            onRegisterVote={handleRegisterVote}
          />

          {canBroadcast && (
            <HomeRepBroadcast
              strings={strings.rep}
              activeClassId={activeClassId!}
              onSubmit={onAddBroadcast!}
            />
          )}

          {activeAdData && (
            <HomeAdCard
              strings={strings.ad}
              imageUrl={activeAdData.imageUrl}
              title={activeAdData.title}
              description={activeAdData.description}
              onClick={() => {
                if (activeAd && onTrackAdEvent) {
                  onTrackAdEvent(activeAd.id, 'click');
                }
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}