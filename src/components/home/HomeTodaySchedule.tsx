import React from 'react';
import { Check, MapPin, RotateCw } from 'lucide-react';
import { TimetableEntry, AttendanceLog } from '../../types';
import type { HomeScheduleStrings } from '../../i18n/types.app';

interface HomeTodayScheduleProps {
  strings: HomeScheduleStrings;
  todayEntries: TimetableEntry[];
  attendanceLogs: AttendanceLog[];
  deviceToday: string;
  currentMinutes: number;
  getMinutes: (timeStr: string) => number;
  isRefreshing: boolean;
  showRefresh: boolean;
  onRefresh: () => void;
  onMarkAttendance: (entryId: string, date: string) => void;
}

const HomeTodaySchedule: React.FC<HomeTodayScheduleProps> = ({
  strings,
  todayEntries,
  attendanceLogs,
  deviceToday,
  currentMinutes,
  getMinutes,
  isRefreshing,
  showRefresh,
  onRefresh,
  onMarkAttendance,
}) => {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            {strings.sectionTitle}
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {strings.sectionSubtitle}
          </p>
        </div>

        {showRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
          >
            <RotateCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />

            {isRefreshing
              ? strings.refreshing
              : strings.refresh}
          </button>
        )}
      </div>

      {todayEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="font-semibold text-zinc-900 dark:text-white">
            {strings.emptyTitle}
          </p>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {strings.emptySubtitle}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {todayEntries.map((entry) => {
            const start = getMinutes(entry.startTime);
            const end = getMinutes(entry.endTime);

            const isLive =
              currentMinutes >= start &&
              currentMinutes < end &&
              !entry.isCancelled;

            const attendance = attendanceLogs.find(
              (log) =>
                log.timetableEntryId === entry.id &&
                log.date === deviceToday
            );

            const isMarked = attendance?.status === 'attended';

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
                        strings.fallbackClassName}
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
                          {strings.liveBadge}
                        </span>
                      )}

                      {entry.isCancelled && (
                        <span className="font-semibold text-rose-600 dark:text-rose-400">
                          {strings.cancelledBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!entry.isCancelled && (
                  <button
                    type="button"
                    onClick={() =>
                      onMarkAttendance(entry.id, deviceToday)
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
                      ? strings.presentButton
                      : strings.markButton}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HomeTodaySchedule;