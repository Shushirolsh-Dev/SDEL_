import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, ChevronLeft, ChevronRight, HelpCircle, AlertTriangle } from 'lucide-react';
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
  const cancelledCount = timetable.filter(entry => entry.isCancelled && joinedClassIds.includes(entry.classId)).length;

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
    longestStreak,
    cancelledCount
  };
};

const getWeekDates = (startDate: string) => {
  const start = new Date(startDate);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.push({
      date: `${year}-${month}-${day}`,
      dayName: dayNames[dayOfWeek - 1],
      dayOfWeek
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
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>('2026-07-13');
  const [showAllDays, setShowAllDays] = useState(false);

  const joinedClassIds = joinedClasses.map((c) => c.id);
  const stats = calculateRealAttendanceStats(timetable, attendanceLogs, joinedClassIds, currentSimulatedTime);

  const weekDays = getWeekDates(selectedWeekStart);
  const visibleDays = showAllDays ? weekDays : weekDays.slice(0, 5);

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
    return `${monday} to ${sunday}`;
  };

  const getDeviceTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const deviceToday = getDeviceTodayDate();

  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  return (
    <div className="space-y-8" id="attendance-view-container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="attendance-summary-cards">
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Attendance Rate</span>
          <span className="text-3xl font-bold tracking-tight font-mono text-zinc-950 dark:text-zinc-100 block mt-1">
            {stats.attendancePercentage}%
          </span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">Target limit: &ge;75%</span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Classes Attended</span>
          <span className="text-3xl font-bold tracking-tight font-mono text-zinc-950 dark:text-zinc-100 block mt-1">
            {stats.attendedCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">Total classes attended</span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Classes Missed</span>
          <span className="text-3xl font-bold tracking-tight font-mono text-zinc-950 dark:text-zinc-100 block mt-1 text-zinc-800 dark:text-zinc-200">
            {stats.missedCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">Unattended completed</span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Cancelled (Streak Safe)</span>
          <span className="text-3xl font-bold tracking-tight font-mono text-zinc-950 dark:text-zinc-100 block mt-1 text-zinc-500 dark:text-zinc-400">
            {stats.cancelledCount}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">Excluded from stats</span>
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 rounded-none" id="streak-details-box">
        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3 font-mono">
          Attendance Streak Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase">Active Streak Sequence</span>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-mono flex items-baseline gap-1">
              {stats.currentStreak}
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">consecutive attended classes</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Streak increases with every scheduled class you mark attended. If a class is cancelled, your streak is preserved and passes safely over that gap. Missing a scheduled class resets the active streak.
            </p>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 pt-4 md:pt-0 md:pl-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 dark:text-zinc-405">Current Streak:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.currentStreak} classes</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 dark:text-zinc-405">Longest Career Streak:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.longestStreak} classes</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono pb-1">
              <span className="text-zinc-500 dark:text-zinc-405">Streak Status:</span>
              {stats.attendancePercentage >= 75 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px] border border-emerald-200 dark:border-emerald-950/40 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20">
                  SAFE
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px] border border-amber-200 dark:border-amber-950/40 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20">
                  LOW COMPLIANCE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4" id="weekly-history-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-2">
          <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">Attendance Log by Week</h3>
          
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handlePrevWeek}
              disabled={selectedWeekStart === '2026-06-29'}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-800 text-zinc-950 dark:text-zinc-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-zinc-800 dark:text-zinc-200">{weekRangeLabel()}</span>
            <button
              onClick={handleNextWeek}
              disabled={selectedWeekStart === '2026-07-13'}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-800 text-zinc-950 dark:text-zinc-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {joinedClasses.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-400 dark:text-zinc-500 font-mono text-xs">
            Join a class first to view your weekly history.
          </div>
        ) : (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800" id="weekly-logs-table">
            {visibleDays.map((day) => {
              const dayEntries = timetable
                .filter((entry) => entry.dayOfWeek === day.dayOfWeek && joinedClassIds.includes(entry.classId))
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div key={day.date} className="p-4" id={`week-day-row-${day.date}`}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block font-mono">{day.dayName}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">{day.date}</span>
                    </div>

                    <div className="md:col-span-3 space-y-3">
                      {dayEntries.length === 0 ? (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono italic">No classes scheduled on this day</span>
                      ) : (
                        dayEntries.map((entry) => {
                          let isPast = false;
                          if (day.date < deviceToday) {
                            isPast = true;
                          } else if (day.date === deviceToday) {
                            const [currH, currM] = currentSimulatedTime.split(':').map(Number);
                            const [endH, endM] = entry.endTime.split(':').map(Number);
                            if (currH * 60 + currM >= endH * 60 + endM) {
                              isPast = true;
                            }
                          }

                          const isAttended = attendanceLogs.some(
                            (l) => l.timetableEntryId === entry.id && l.date === day.date && l.status === 'attended'
                          );

                          return (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between border border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950"
                              id={`history-entry-${entry.id}-${day.date}`}
                            >
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                                  {entry.startTime} - {entry.endTime}
                                </span>
                                <h5 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 tracking-tight">
                                  {entry.subject}
                                </h5>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                                  Venue: {entry.venue}
                                </span>
                              </div>

                              <div>
                                {entry.isCancelled ? (
                                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
                                    Cancelled (Safe)
                                  </span>
                                ) : isAttended ? (
                                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-950/40 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Attended
                                  </span>
                                ) : isPast ? (
                                  <span className="text-[10px] font-mono uppercase font-bold text-red-800 dark:text-red-400 border border-red-200 dark:border-red-950/40 px-2 py-1 bg-red-50 dark:bg-red-950/20 flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Missed
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
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
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 text-center border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setShowAllDays(!showAllDays)}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showAllDays ? 'Show Less' : `Read More (${weekDays.length - 5} more days)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}