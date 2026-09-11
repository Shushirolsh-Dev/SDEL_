import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import type { TimetableHeaderStrings, TimetableDayStrings } from '../../i18n/types.app';

interface TimetableHeaderProps {
  strings: TimetableHeaderStrings;
  days: TimetableDayStrings;
  activeClassName: string | null;
  activeClassCode: string | null;
  selectedDay: number | 'all';
  onSelectDay: (day: number | 'all') => void;
  showAddButton: boolean;
  onAddClick: () => void;
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  strings,
  days,
  activeClassName,
  activeClassCode,
  selectedDay,
  onSelectDay,
  showAddButton,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Calendar className="h-4 w-4" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            {strings.sectionLabel}
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {strings.title}
        </h2>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {activeClassName
            ? `${activeClassName} · ${activeClassCode}`
            : strings.noClassSelected}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
          <button
            type="button"
            onClick={() => onSelectDay('all')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
              selectedDay === 'all'
                ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            {strings.weekButton}
          </button>

          {days.short.slice(0, 5).map((short, i) => {
            const dayValue = i + 1;
            return (
              <button
                key={short}
                type="button"
                onClick={() => onSelectDay(dayValue)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  selectedDay === dayValue
                    ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {short}
              </button>
            );
          })}
        </div>

        {showAddButton && (
          <button
            id="btn-add-timetable-entry"
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            {strings.addClassButton}
          </button>
        )}
      </div>
    </div>
  );
};

export default TimetableHeader;