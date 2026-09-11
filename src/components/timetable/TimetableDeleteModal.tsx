import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { TimetableEntry } from '../../types';
import type { TimetableDeleteStrings } from '../../i18n/types.app';

interface TimetableDeleteModalProps {
  strings: TimetableDeleteStrings;
  entry: TimetableEntry;
  onCancel: () => void;
  onConfirm: () => void;
}

const TimetableDeleteModal: React.FC<TimetableDeleteModalProps> = ({
  strings,
  entry,
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>

        <h3
          id="delete-dialog-title"
          className="mt-4 text-base font-bold text-zinc-950 dark:text-white"
        >
          {strings.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {strings.descriptionPrefix}{' '}
          <span className="font-semibold text-zinc-900 dark:text-white">
            {entry.subject}
          </span>{' '}
          {strings.descriptionSuffix}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            {strings.keepButton}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            {strings.removeButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableDeleteModal;