import React from 'react';
import { Flame, CheckCircle, AlertTriangle } from 'lucide-react';
import type { AttendanceStreakStrings } from '../../i18n/types.app';

interface AttendanceStreakCardProps {
  strings: AttendanceStreakStrings;
  currentStreak: number;
  longestStreak: number;
  attendancePercentage: number;
}

const AttendanceStreakCard: React.FC<AttendanceStreakCardProps> = ({
  strings,
  currentStreak,
  longestStreak,
  attendancePercentage,
}) => {
  const isSafe = attendancePercentage >= 75;

  return (
    <section
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      id="streak-details-box"
    >
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-zinc-950 dark:text-white" />

          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-zinc-900 dark:text-zinc-100">
            {strings.sectionTitle}
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.2fr_1fr]">
        <div className="p-5 sm:p-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {strings.currentStreakLabel}
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {currentStreak}
            </span>

            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {strings.consecutiveSuffix}
            </span>
          </div>

          <p className="mt-4 max-w-xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {strings.explanation}
          </p>
        </div>

        <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 md:border-l md:border-t-0 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.currentRow}
              </span>

              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                {currentStreak} {strings.classesSuffix}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.longestRow}
              </span>

              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                {longestStreak} {strings.classesSuffix}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.statusRow}
              </span>

              {isSafe ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <CheckCircle className="h-3 w-3" />
                  {strings.statusSafe}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  {strings.statusLow}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttendanceStreakCard;