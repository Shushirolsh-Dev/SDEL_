import React from 'react';
import { CalendarDays } from 'lucide-react';
import type { AttendanceHeaderStrings } from '../../i18n/types.app';

interface AttendanceHeaderProps {
  strings: AttendanceHeaderStrings;
  attendancePercentage: number;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  strings,
  attendancePercentage,
}) => {
  const isSafe = attendancePercentage >= 75;

  return (
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
            {strings.sectionLabel}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
          {strings.title}
        </h1>

        <p className="mt-1 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
          {strings.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900 sm:self-auto">
        <span
          className={`h-2 w-2 rounded-full ${
            isSafe ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />

        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
          {isSafe ? strings.statusSafe : strings.statusNeedsAttention}
        </span>
      </div>
    </section>
  );
};

export default AttendanceHeader;