import React from 'react';
import { Clock3, CheckCircle, XCircle } from 'lucide-react';
import { TimetableEntry, AttendanceLog } from '../../types';
import type { AttendanceWeekStrings, AttendanceStatusStrings } from '../../i18n/types.app';

interface AttendanceDayRowProps {
  weekStrings: AttendanceWeekStrings;
  statusStrings: AttendanceStatusStrings;
  dayName: string;
  dayDate: string;
  isToday: boolean;
  dayEntries: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  currentSimulatedTime: string;
  deviceToday: string;
}

const AttendanceDayRow: React.FC<AttendanceDayRowProps> = ({
  weekStrings,
  statusStrings,
  dayName,
  dayDate,
  isToday,
  dayEntries,
  attendanceLogs,
  currentSimulatedTime,
  deviceToday,
}) => {
  const computeIsPast = (entry: TimetableEntry): boolean => {
    if (dayDate < deviceToday) return true;
    if (dayDate === deviceToday) {
      const [currH, currM] = currentSimulatedTime.split(':').map(Number);
      const [endH, endM] = entry.endTime.split(':').map(Number);
      if (currH * 60 + currM >= endH * 60 + endM) return true;
    }
    return false;
  };

  return (
    <div
      className="border-b border-zinc-100 p-4 last:border-b-0 dark:border-zinc-800 sm:p-5"
      id={`week-day-row-${dayDate}`}
    >
      <div className="grid gap-4 md:grid-cols-[150px_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {dayName}
            </span>

            {isToday && (
              <span className="rounded-full bg-zinc-950 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-950">
                {weekStrings.todayBadge}
              </span>
            )}
          </div>

          <span className="mt-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
            {dayDate}
          </span>
        </div>

        <div className="space-y-2">
          {dayEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-4 dark:border-zinc-800">
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                {weekStrings.noClassesScheduled}
              </span>
            </div>
          ) : (
            dayEntries.map((entry) => {
              const isPast = computeIsPast(entry);

              const isAttended = attendanceLogs.some(
                (log) =>
                  log.timetableEntryId === entry.id &&
                  log.date === dayDate &&
                  log.status === 'attended'
              );

              return (
                <div
                  key={entry.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                  id={`history-entry-${entry.id}-${dayDate}`}
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
                        {statusStrings.cancelledSafe}
                      </span>
                    ) : isAttended ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        {statusStrings.attended}
                      </span>
                    ) : isPast ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                        <XCircle className="h-3 w-3" />
                        {statusStrings.missed}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                        {statusStrings.upcoming}
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
};

export default AttendanceDayRow;