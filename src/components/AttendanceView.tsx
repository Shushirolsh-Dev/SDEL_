import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Flame,
  Clock3,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { TimetableEntry, AttendanceLog, ClassGroup } from '../types';

interface AttendanceViewProps {
  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string;
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

      if (streak > longestStreak) {
        longestStreak = streak;
      }
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

const getWeekDates = (startDate: string) => {
  const start = new Date(startDate);
  const days = [];

  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

    days.push({
      date: `${year}-${month}-${day}`,
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
}: AttendanceViewProps) {
  const [selectedWeekStart, setSelectedWeekStart] =
    useState<string>('2026-07-13');

  const [showAllDays, setShowAllDays] = useState(false);

  const joinedClassIds = joinedClasses.map((c) => c.id);

  const stats = calculateRealAttendanceStats(
    timetable,
    attendanceLogs,
    joinedClassIds,
    currentSimulatedTime
  );

  const weekDays = getWeekDates(selectedWeekStart);

  const visibleDays = showAllDays
    ? weekDays
    : weekDays.slice(0, 5);

  const handlePrevWeek = () => {
    if (selectedWeekStart === '2026-07-13') {
      setSelectedWeekStart('2026-07-06');
    } else if (selectedWeekStart === '2026-07-06') {
      setSelectedWeekStart('2026-06-29');
    }
  };

  const handleNextWeek = () => {
    if (selectedWeekStart === '2026-06-29') {
      setSelectedWeekStart('2026-07-06');
    } else if (selectedWeekStart === '2026-07-06') {
      setSelectedWeekStart('2026-07-13');
    }
  };

  const weekRangeLabel = () => {
    const monday = weekDays[0].date;
    const sunday = weekDays[6].date;

    return `${monday} — ${sunday}`;
  };

  const getDeviceTodayDate = () => {
    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const deviceToday = getDeviceTodayDate();

  return (
    <div
      className="space-y-7 pb-10"
      id="attendance-view-container"
    >
      {/* Header */}
      <section
        className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between"
        id="attendance-header"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <CalendarDays className="h-4 w-4" />
            </div>

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Academic Record
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            Attendance
          </h1>

          <p className="mt-1 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
            Track your attendance, streaks, and completed classes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900 sm:self-auto">
          <span
            className={`h-2 w-2 rounded-full ${
              stats.attendancePercentage >= 75
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            }`}
          />

          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            {stats.attendancePercentage >= 75
              ? 'Attendance Safe'
              : 'Needs Attention'}
          </span>
        </div>
      </section>

      {/* Summary */}
      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        id="attendance-summary-cards"
      >
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Attendance
            </span>

            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>

          <div className="mt-5 flex items-end gap-1">
            <span className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {stats.attendancePercentage}
            </span>

            <span className="mb-1 font-mono text-sm text-zinc-400">
              %
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-950 transition-all dark:bg-white"
              style={{
                width: `${Math.min(
                  stats.attendancePercentage,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            Target: 75%+
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Attended
            </span>

            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {stats.attendedCount}
          </div>

          <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
            Completed classes attended
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Missed
            </span>

            <XCircle className="h-4 w-4 text-red-500" />
          </div>

          <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {stats.missedCount}
          </div>

          <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
            Completed classes missed
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Cancelled
            </span>

            <ShieldCheck className="h-4 w-4 text-zinc-400" />
          </div>

          <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {stats.cancelledCount}
          </div>

          <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
            Safely excluded from stats
          </p>
        </div>
      </section>

      {/* Streak */}
      <section
        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        id="streak-details-box"
      >
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-zinc-950 dark:text-white" />

            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-zinc-900 dark:text-zinc-100">
              Attendance Streak
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <div className="p-5 sm:p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Current streak
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {stats.currentStreak}
              </span>

              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                consecutive classes
              </span>
            </div>

            <p className="mt-4 max-w-xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Attend every scheduled class to keep the streak alive.
              Cancelled classes do not break your streak. Missing a
              scheduled class resets it.
            </p>
          </div>

          <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 md:border-l md:border-t-0 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Current
                </span>

                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                  {stats.currentStreak} classes
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Longest
                </span>

                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                  {stats.longestStreak} classes
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </span>

                {stats.attendancePercentage >= 75 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Safe
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Low
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly history */}
      <section
        className="space-y-4"
        id="weekly-history-section"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
              Weekly attendance
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Review every scheduled class for the selected week.
            </p>
          </div>

          <div className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto">
            <button
              type="button"
              onClick={handlePrevWeek}
              disabled={selectedWeekStart === '2026-06-29'}
              aria-label="Previous week"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-25 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 text-center font-mono text-[10px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200 sm:min-w-[150px]">
              {weekRangeLabel()}
            </span>

            <button
              type="button"
              onClick={handleNextWeek}
              disabled={selectedWeekStart === '2026-07-13'}
              aria-label="Next week"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-25 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {joinedClasses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <CalendarDays className="mx-auto h-7 w-7 text-zinc-400" />

            <h4 className="mt-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">
              No classes yet
            </h4>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Join a class to start tracking your attendance.
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
                <div
                  key={day.date}
                  className="border-b border-zinc-100 p-4 last:border-b-0 dark:border-zinc-800 sm:p-5"
                  id={`week-day-row-${day.date}`}
                >
                  <div className="grid gap-4 md:grid-cols-[150px_1fr]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {day.dayName}
                        </span>

                        {day.date === deviceToday && (
                          <span className="rounded-full bg-zinc-950 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-950">
                            Today
                          </span>
                        )}
                      </div>

                      <span className="mt-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                        {day.date}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayEntries.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-4 dark:border-zinc-800">
                          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                            No classes scheduled
                          </span>
                        </div>
                      ) : (
                        dayEntries.map((entry) => {
                          let isPast = false;

                          if (day.date < deviceToday) {
                            isPast = true;
                          } else if (day.date === deviceToday) {
                            const [currH, currM] =
                              currentSimulatedTime
                                .split(':')
                                .map(Number);

                            const [endH, endM] =
                              entry.endTime.split(':').map(Number);

                            if (
                              currH * 60 + currM >=
                              endH * 60 + endM
                            ) {
                              isPast = true;
                            }
                          }

                          const isAttended =
                            attendanceLogs.some(
                              (log) =>
                                log.timetableEntryId === entry.id &&
                                log.date === day.date &&
                                log.status === 'attended'
                            );

                          return (
                            <div
                              key={entry.id}
                                                            className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                              id={`history-entry-${entry.id}-${day.date}`}
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                                    <Clock3 className="h-3 w-3" />
                                    {entry.startTime} — {entry.endTime}
                                  </span>

                                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                                    {entry.venue}
                                  </span>
                                </div>

                                <h5 className="mt-1.5 truncate text-sm font-bold text-zinc-900 dark:text-white">
                                  {entry.subject}
                                </h5>
                              </div>

                              <div className="shrink-0">
                                {entry.isCancelled ? (
                                  <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                                    Cancelled · Safe
                                  </span>
                                ) : isAttended ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                                    <CheckCircle className="h-3 w-3" />
                                    Attended
                                  </span>
                                ) : isPast ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                                    <XCircle className="h-3 w-3" />
                                    Missed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
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
                    ? 'Show less'
                    : `Show weekend · ${weekDays.length - 5} more days`}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}