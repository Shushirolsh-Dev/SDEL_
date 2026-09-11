import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AttendanceWeekStrings } from '../../i18n/types.app';

interface AttendanceWeekHeaderProps {
  strings: AttendanceWeekStrings;
  weekRangeLabel: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const AttendanceWeekHeader: React.FC<AttendanceWeekHeaderProps> = ({
  strings,
  weekRangeLabel,
  canGoBack,
  canGoForward,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
          {strings.sectionTitle}
        </h3>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {strings.sectionSubtitle}
        </p>
      </div>

      <div className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoBack}
          aria-label="Previous week"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-25 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-3 text-center font-mono text-[10px] font-bold tracking-tight text-zinc-800 dark:text-zinc-200 sm:min-w-[150px]">
          {weekRangeLabel}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoForward}
          aria-label="Next week"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-25 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AttendanceWeekHeader;