import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { TimetableEntry, AttendanceLog, ClassGroup } from '../types';
import type { AttendanceStrings } from '../i18n/types.app';
import AttendanceHeader from './attendance/AttendanceHeader';
import AttendanceSummary from './attendance/AttendanceSummary';
import AttendanceStreakCard from './attendance/AttendanceStreakCard';
import AttendanceWeekHeader from './attendance/AttendanceWeekHeader';
import AttendanceDayRow from './attendance/AttendanceDayRow';

interface AttendanceViewProps {
  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string;
  strings: AttendanceStrings;
}

const getMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const toDateStr = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMondayOfWeek = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toDateStr(d);
};

const shiftWeek = (weekStart: string, delta: number): string => {
  const d = new Date(weekStart + 'T00:00:00');
  d.setDate(d.getDate() + delta * 7);
  return toDateStr(d);
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

  const cancelledCount = timetable.filter(
    (entry) =>
      entry.isCancelled && joinedClassIds.includes(entry.classId)
  ).length;

  let longestStreak = 0;
  let streak = 0;

  const sortedEntries = [...pastEntries].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) {
      return b.dayOfWeek - a.dayOfWeek;
    }
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

  return {
    totalScheduled,
    attendedCount,
    missedCount,
    attendancePercentage,
    currentStreak: streak,
    longestStreak,
    cancelledCount,
  };
};

interface WeekDay {
  date: string;
  dayName: string;
  dayOfWeek: number;
}

const getWeekDates = (
  startDate: string,
  dayNames: string[]
): WeekDay[] => {
  const start = new Date(startDate + 'T00:00:00');
  const days: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

    days.push({
      date: toDateStr(date),
      dayName: dayNames[dayOfWeek - 1],
      dayOfWeek,
    });
  }

  return days;
};

export default function AttendanceView({
  timetable,
  attendanceLogs,
  joinedClasses,
  currentSimulatedTime,
  strings,
}: AttendanceViewProps) {
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(
    () => getMondayOfWeek(new Date())
  );
  const [showAllDays, setShowAllDays] = useState(false);

  const joinedClassIds = joinedClasses.map((c) => c.id);

  const stats = calculateRealAttendanceStats(
    timetable,
    attendanceLogs,
    joinedClassIds,
    currentSimulatedTime
  );

  const weekDays = getWeekDates(
    selectedWeekStart,
    strings.week.weekDaysLong
  );

  const visibleDays = showAllDays ? weekDays : weekDays.slice(0, 5);

  const handlePrevWeek = () => {
    setSelectedWeekStart((prev) => shiftWeek(prev, -1));
  };

  const handleNextWeek = () => {
    setSelectedWeekStart((prev) => shiftWeek(prev, +1));
  };

  const weekRangeLabel = () => {
    const monday = weekDays[0].date;
    const sunday = weekDays[6].date;
    return `${monday} — ${sunday}`;
  };

  const deviceToday = toDateStr(new Date());

  const currentWeekMonday = getMondayOfWeek(new Date());
  const canGoForward = selectedWeekStart < currentWeekMonday;

  return (
    <div className="space-y-7 pb-10" id="attendance-view-container">
      <AttendanceHeader
        strings={strings.header}
        attendancePercentage={stats.attendancePercentage}
      />

      <AttendanceSummary
        strings={strings.summary}
        attendancePercentage={stats.attendancePercentage}
        attendedCount={stats.attendedCount}
        missedCount={stats.missedCount}
        cancelledCount={stats.cancelledCount}
      />

      <AttendanceStreakCard
        strings={strings.streak}
        currentStreak={stats.currentStreak}
        longestStreak={stats.longestStreak}
        attendancePercentage={stats.attendancePercentage}
      />

      <section className="space-y-4" id="weekly-history-section">
        <AttendanceWeekHeader
          strings={strings.week}
          weekRangeLabel={weekRangeLabel()}
          canGoBack={true}
          canGoForward={canGoForward}
          onPrev={handlePrevWeek}
          onNext={handleNextWeek}
        />

        {joinedClasses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <CalendarDays className="mx-auto h-7 w-7 text-zinc-400" />

            <h4 className="mt-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {strings.empty.noClassesTitle}
            </h4>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {strings.empty.noClassesSubtitle}
            </p>
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            id="weekly-logs-table"
          >
            {visibleDays.map((day) => {
              const dayEntries = timetable
                .filter(
                  (entry) =>
                    entry.dayOfWeek === day.dayOfWeek &&
                    joinedClassIds.includes(entry.classId)
                )
                .sort((a, b) =>
                  a.startTime.localeCompare(b.startTime)
                );

              return (
                <AttendanceDayRow
                  key={day.date}
                  weekStrings={strings.week}
                  statusStrings={strings.status}
                  dayName={day.dayName}
                  dayDate={day.date}
                  isToday={day.date === deviceToday}
                  dayEntries={dayEntries}
                  attendanceLogs={attendanceLogs}
                  currentSimulatedTime={currentSimulatedTime}
                  deviceToday={deviceToday}
                />
              );
            })}

            {weekDays.length > 5 && (
              <div className="border-t border-zinc-100 bg-zinc-50/70 p-3 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
                <button
                  type="button"
                  onClick={() => setShowAllDays(!showAllDays)}
                  className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >
                  {showAllDays
                    ? strings.week.showLess
                    : strings.week.showWeekend(weekDays.length - 5)}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}