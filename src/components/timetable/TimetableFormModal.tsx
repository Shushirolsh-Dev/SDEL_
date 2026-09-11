import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { TimetableEntry } from '../../types';
import type {
  TimetableFormStrings,
  TimetableDayStrings,
} from '../../i18n/types.app';
import TimetableDayPicker from './TimetableDayPicker';
import TimetableTimeInput from './TimetableTimeInput';

interface TimetableFormModalProps {
  strings: TimetableFormStrings;
  days: TimetableDayStrings;
  editingEntry: TimetableEntry | null;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  venue: string;
  isCancelled: boolean;
  errorMsg: string;
  onChangeSubject: (v: string) => void;
  onChangeDay: (v: number) => void;
  onChangeStartTime: (v: string) => void;
  onChangeEndTime: (v: string) => void;
  onChangeVenue: (v: string) => void;
  onChangeIsCancelled: (v: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

const TimetableFormModal: React.FC<TimetableFormModalProps> = ({
  strings,
  days,
  editingEntry,
  subject,
  dayOfWeek,
  startTime,
  endTime,
  venue,
  isCancelled,
  errorMsg,
  onChangeSubject,
  onChangeDay,
  onChangeStartTime,
  onChangeEndTime,
  onChangeVenue,
  onChangeIsCancelled,
  onSave,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timetable-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              {editingEntry
                ? strings.editClassEyebrow
                : strings.newClassEyebrow}
            </p>

            <h3
              id="timetable-modal-title"
              className="mt-1 text-lg font-bold tracking-tight text-zinc-950 dark:text-white"
            >
              {editingEntry
                ? strings.editTitle
                : strings.addTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-5 p-6">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              {strings.subjectLabel}
            </label>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => onChangeSubject(e.target.value)}
              placeholder={strings.subjectPlaceholder}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.dayLabel}
              </label>

              <TimetableDayPicker
                strings={days}
                value={dayOfWeek}
                onChange={onChangeDay}
              />
            </div>

            <div>
              <label
                htmlFor="venue"
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                {strings.venueLabel}
              </label>

              <input
                id="venue"
                type="text"
                value={venue}
                onChange={(e) => onChangeVenue(e.target.value)}
                placeholder={strings.venuePlaceholder}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.startsLabel}
              </label>

              <TimetableTimeInput
                value={startTime}
                onChange={onChangeStartTime}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {strings.endsLabel}
              </label>

              <TimetableTimeInput
                value={endTime}
                onChange={onChangeEndTime}
              />
            </div>
          </div>

          {editingEntry && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  {strings.cancelClassTitle}
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                  {strings.cancelClassSubtitle}
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isCancelled}
                  onChange={(e) =>
                    onChangeIsCancelled(e.target.checked)
                  }
                  className="peer sr-only"
                />

                <div className="h-6 w-11 rounded-full bg-zinc-200 transition peer-checked:bg-red-600 peer-focus:outline-none after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5 dark:bg-zinc-800" />
              </label>
            </div>
          )}

          <div className="flex gap-2 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {strings.cancelButton}
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {editingEntry
                ? strings.saveChangesButton
                : strings.addClassButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableFormModal;