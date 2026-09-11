import React from 'react';
import { Clock3, MapPin, Edit2, Trash2 } from 'lucide-react';
import { TimetableEntry } from '../../types';
import type { TimetableEntryCardStrings } from '../../i18n/types.app';

interface TimetableEntryCardProps {
  strings: TimetableEntryCardStrings;
  entry: TimetableEntry;
  isManager: boolean;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (entry: TimetableEntry) => void;
}

const TimetableEntryCard: React.FC<TimetableEntryCardProps> = ({
  strings,
  entry,
  isManager,
  onEdit,
  onDelete,
}) => {
  return (
    <article
      id={`entry-card-${entry.id}`}
      className={`group rounded-xl border bg-white p-4 transition dark:bg-zinc-950 ${
        entry.isCancelled
          ? 'border-red-200 opacity-60 dark:border-red-950'
          : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <Clock3 className="h-3 w-3" />
              {entry.startTime} – {entry.endTime}
            </span>

            {entry.isCancelled && (
              <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-700 dark:bg-red-950/30 dark:text-red-400">
                {strings.cancelledBadge}
              </span>
            )}

            {entry.originalVenue && (
              <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                {strings.roomShiftedBadge}
              </span>
            )}
          </div>

          <h4
            className={`text-base font-bold tracking-tight text-zinc-950 dark:text-white ${
              entry.isCancelled ? 'line-through' : ''
            }`}
          >
            {entry.subject}
          </h4>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{entry.venue}</span>
          </div>

          {entry.originalVenue && (
            <p className="mt-1 text-[10px] text-zinc-400">
              {strings.originallyLabel} {entry.originalVenue}
            </p>
          )}
        </div>

        <span className="shrink-0 text-[10px] font-medium text-zinc-400">
          {entry.durationMinutes} {strings.minutesSuffix}
        </span>
      </div>

      {isManager && (
        <div
          className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800"
          id={`entry-actions-${entry.id}`}
        >
          <button
            type="button"
            id={`btn-edit-${entry.id}`}
            onClick={() => onEdit(entry)}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
          >
            <Edit2 className="h-3.5 w-3.5" />
            {strings.editButton}
          </button>

          <button
            type="button"
            id={`btn-delete-${entry.id}`}
            onClick={() => onDelete(entry)}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {strings.deleteButton}
          </button>
        </div>
      )}
    </article>
  );
};

export default TimetableEntryCard;