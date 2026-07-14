import React, { useState, useEffect } from 'react';
import { Play, Check, AlertCircle, Clock, MapPin, Award, ChevronRight } from 'lucide-react';
import { TimetableEntry, AttendanceLog, ClassGroup, ClassUpdate } from '../types';
import { calculateAttendanceStats, SIMULATED_TODAY, getDayOfWeekFromDate } from '../mockData';

interface HomeViewProps {
  timetable: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  joinedClasses: ClassGroup[];
  currentSimulatedTime: string; // "HH:MM"
  updates: ClassUpdate[];
  onMarkAttendance: (entryId: string, date: string) => void;
  userRole: string;
}

export default function HomeView({
  timetable,
  attendanceLogs,
  joinedClasses,
  currentSimulatedTime,
  updates,
  onMarkAttendance,
  userRole,
}: HomeViewProps) {
  const [currentTimeMins, setCurrentTimeMins] = useState(0);

  // Convert "HH:MM" to minutes from midnight
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    setCurrentTimeMins(getMinutes(currentSimulatedTime));
  }, [currentSimulatedTime]);

  const joinedClassIds = joinedClasses.map((c) => c.id);

  // Calculate current day of week for Monday July 13, 2026 (Day 1)
  const todayDayOfWeek = getDayOfWeekFromDate(SIMULATED_TODAY);

  // Get today's classes in joined groups
  const todayEntries = timetable
    .filter((entry) => entry.dayOfWeek === todayDayOfWeek && joinedClassIds.includes(entry.classId))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate overall stats
  const stats = calculateAttendanceStats(timetable, attendanceLogs, joinedClassIds, currentSimulatedTime);

  // Find next class countdown
  let nextClass: TimetableEntry | null = null;
  let nextClassTimeDiffMinutes = -1;
  let nextClassIsLive = false;
  let liveClassRemainingMinutes = -1;

  todayEntries.forEach((entry) => {
    if (entry.isCancelled) return;
    const startMins = getMinutes(entry.startTime);
    const endMins = getMinutes(entry.endTime);

    if (currentTimeMins < startMins) {
      // Upcoming
      if (!nextClass || startMins < getMinutes(nextClass.startTime)) {
        if (!nextClassIsLive) {
          nextClass = entry;
          nextClassTimeDiffMinutes = startMins - currentTimeMins;
        }
      }
    } else if (currentTimeMins >= startMins && currentTimeMins < endMins) {
      // Live now!
      nextClass = entry;
      nextClassIsLive = true;
      liveClassRemainingMinutes = endMins - currentTimeMins;
    }
  });

  // Render countdown string
  const renderCountdown = () => {
    if (nextClassIsLive && nextClass) {
      return (
        <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold animate-pulse">
          LIVE NOW ({liveClassRemainingMinutes}m left)
        </span>
      );
    }
    if (nextClass) {
      const hrs = Math.floor(nextClassTimeDiffMinutes / 60);
      const mins = nextClassTimeDiffMinutes % 60;
      const countdownStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      return (
        <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold">
          starts in {countdownStr} ({nextClass.subject})
        </span>
      );
    }
    return <span className="text-zinc-400 dark:text-zinc-500 font-mono">No more classes scheduled today</span>;
  };

  // Human readable date format for 2026-07-13
  const formattedDate = 'Monday, July 13, 2026';

  return (
    <div className="space-y-8" id="home-view-container">
      {/* Upper Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="home-status-grid">
        {/* Streak Stats */}
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

        {/* Attendance Percentage */}
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

        {/* Live / Next Class Countdown */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 rounded-none flex flex-col justify-between" id="countdown-card">
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">Next Class Alert</span>
            <div className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mt-2 leading-snug">
              {renderCountdown()}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span>Simulated Time: {currentSimulatedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-main-layout">
        {/* Today's Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-4" id="today-timeline">
          <div className="flex justify-between items-baseline border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Today’s Schedule</h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{formattedDate}</span>
          </div>

          {joinedClasses.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-12 text-center" id="empty-classes-prompt">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">You haven't joined any classes yet.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Go to the "Class" tab and enter a class code to join.</p>
            </div>
          ) : todayEntries.length === 0 ? (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center" id="no-classes-today">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">No classes scheduled for today (Monday).</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Enjoy your free time or check the Timetable tab.</p>
            </div>
          ) : (
            <div className="space-y-3" id="classes-list">
              {todayEntries.map((entry) => {
                const startMins = getMinutes(entry.startTime);
                const endMins = getMinutes(entry.endTime);

                // Determine dynamic status
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

                // Check attendance logs for this entry today
                const hasAttended = attendanceLogs.some(
                  (log) => log.timetableEntryId === entry.id && log.date === SIMULATED_TODAY && log.status === 'attended'
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
                      {/* Class Metadata */}
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

                      {/* Manual Attendance Action Button */}
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
                            onClick={() => onMarkAttendance(entry.id, SIMULATED_TODAY)}
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

        {/* Sidebar updates and fast info panel (1/3 width) */}
        <div className="space-y-6" id="home-sidebar">
          {/* Recent Class Announcements & Venue changes */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 rounded-none space-y-4" id="updates-panel">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 font-mono">
              Class Activity Log
            </h3>
            {updates.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">No recent venue changes or announcements.</p>
            ) : (
              <div className="space-y-3" id="announcements-list">
                {updates.map((upd) => (
                  <div key={upd.id} className="text-xs border-l-2 border-zinc-800 dark:border-zinc-600 pl-3 py-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      <span>{upd.userName}</span>
                      <span>
                        {new Date(upd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans">
                      {upd.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Promise Checklist Box */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-950 rounded-none space-y-3" id="quick-promise-panel">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Thesdel Promise Checklist
            </h3>
            <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-350 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✔</span>
                <span>Streak protection is enabled (cancelled classes never count against you).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✔</span>
                <span>Exact venue changes show original vs new locations clearly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✔</span>
                <span>Manual, self-reported checking is fully server-simulated and local-saved.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
