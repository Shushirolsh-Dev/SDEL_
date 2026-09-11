import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import type { HomeAttendanceStrings } from '../../i18n/types.app';

interface HomeAttendanceCardProps {
  strings: HomeAttendanceStrings;
  attendancePercentage: number;
  attendedCount: number;
  totalScheduled: number;
}

const HomeAttendanceCard: React.FC<HomeAttendanceCardProps> = ({
  strings,
  attendancePercentage,
  attendedCount,
  totalScheduled,
}) => {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            {strings.sectionLabel}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {attendancePercentage}%
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
          {attendancePercentage >= 75 ? (
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
              Math.max(0, attendancePercentage)
            )}%`,
          }}
        />
      </div>

      <div className="mt-4 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{strings.attendedCount(attendedCount)}</span>
        <span>{strings.totalCount(totalScheduled)}</span>
      </div>
    </section>
  );
};

export default HomeAttendanceCard;