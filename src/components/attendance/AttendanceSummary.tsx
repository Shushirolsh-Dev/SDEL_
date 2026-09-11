import React from 'react';
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { AttendanceSummaryStrings } from '../../i18n/types.app';

interface AttendanceSummaryProps {
  strings: AttendanceSummaryStrings;
  attendancePercentage: number;
  attendedCount: number;
  missedCount: number;
  cancelledCount: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  strings,
  attendancePercentage,
  attendedCount,
  missedCount,
  cancelledCount,
}) => {
  return (
    <section
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      id="attendance-summary-cards"
    >
      {/* Attendance % */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {strings.attendanceLabel}
          </span>

          <TrendingUp className="h-4 w-4 text-zinc-400" />
        </div>

        <div className="mt-5 flex items-end gap-1">
          <span className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {attendancePercentage}
          </span>

          <span className="mb-1 font-mono text-sm text-zinc-400">%</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-950 transition-all dark:bg-white"
            style={{
              width: `${Math.min(attendancePercentage, 100)}%`,
            }}
          />
        </div>

        <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
          {strings.targetLabel}
        </p>
      </div>

      {/* Attended */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {strings.attendedLabel}
          </span>

          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </div>

        <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {attendedCount}
        </div>

        <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
          {strings.attendedSubtitle}
        </p>
      </div>

      {/* Missed */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {strings.missedLabel}
          </span>

          <XCircle className="h-4 w-4 text-red-500" />
        </div>

        <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {missedCount}
        </div>

        <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
          {strings.missedSubtitle}
        </p>
      </div>

      {/* Cancelled */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {strings.cancelledLabel}
          </span>

          <ShieldCheck className="h-4 w-4 text-zinc-400" />
        </div>

        <div className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {cancelledCount}
        </div>

        <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
          {strings.cancelledSubtitle}
        </p>
      </div>
    </section>
  );
};

export default AttendanceSummary;