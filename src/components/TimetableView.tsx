import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Info,
  Clock3,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { TimetableEntry, ClassGroup, Role } from '../types';

interface TimetableViewProps {
  timetable: TimetableEntry[];
  joinedClasses: ClassGroup[];
  activeClassId: string;
  onAddEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  onEditEntry: (id: string, updatedFields: Partial<TimetableEntry>) => void;
  onDeleteEntry: (id: string) => void;
  currentUserRole: Role;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
  { value: 7, label: 'Sunday', short: 'Sun' },
];

export default function TimetableView({
  timetable,
  joinedClasses,
  activeClassId,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  currentUserRole,
}: TimetableViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TimetableEntry | null>(null);

  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [venue, setVenue] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isManager =
    currentUserRole === 'representative' ||
    currentUserRole === 'assistant';

  const classEntries = timetable
    .filter((entry) => entry.classId === activeClassId)
    .sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }

      return a.startTime.localeCompare(b.startTime);
    });

  const activeClass = joinedClasses.find(
    (classItem) => classItem.id === activeClassId
  );

  const resetForm = () => {
    setSubject('');
    setDayOfWeek(1);
    setStartTime('09:00');
    setEndTime('10:30');
    setVenue('');
    setIsCancelled(false);
    setErrorMsg('');
    setEditingEntry(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setSubject(entry.subject);
    setDayOfWeek(entry.dayOfWeek);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setVenue(entry.venue);
    setIsCancelled(!!entry.isCancelled);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanSubject = subject.trim();
    const cleanVenue = venue.trim();

    if (!cleanSubject) {
      setErrorMsg('Subject name is required.');
      return;
    }

    if (!cleanVenue) {
      setErrorMsg('Venue is required.');
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal >= endTotal) {
      setErrorMsg('Start time must be before end time.');
      return;
    }

    const durationMinutes = endTotal - startTotal;

    if (editingEntry) {
      onEditEntry(editingEntry.id, {
        subject: cleanSubject,
        dayOfWeek,
        startTime,
        endTime,
        durationMinutes,
        venue: cleanVenue,
        isCancelled,
      });
    } else {
      onAddEntry({
        classId: activeClassId,
        subject: cleanSubject,
        dayOfWeek,
        startTime,
        endTime,
        durationMinutes,
        venue: cleanVenue,
        isCancelled,
      });
    }

    closeModal();
  };

  const handleRequestDelete = (entry: TimetableEntry) => {
    setDeleteTarget(entry);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    onDeleteEntry(deleteTarget.id);
    setDeleteTarget(null);
  };

  const groupedEntriesByDay = DAYS_OF_WEEK.map((day) => ({
    ...day,
    entries: classEntries
      .filter((entry) => entry.dayOfWeek === day.value)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const visibleDays = groupedEntriesByDay.filter((day) => {
    if (selectedDay !== 'all') {
      return selectedDay === day.value;
    }

    return day.entries.length > 0;
  });

  return (
    <div
      className="space-y-6 pb-10"
      id="timetable-view-container"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Calendar className="h-4 w-4" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Academic Schedule
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Timetable
          </h2>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {activeClass
              ? `${activeClass.name} · ${activeClass.code}`
              : 'No class selected'}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Day selector */}
          <div className="flex overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
            <button
              type="button"
              onClick={() => setSelectedDay('all')}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
                selectedDay === 'all'
                  ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Week
            </button>

            {DAYS_OF_WEEK.slice(0, 5).map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => setSelectedDay(day.value)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  selectedDay === day.value
                    ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>

          {isManager && activeClassId && (
            <button
              id="btn-add-timetable-entry"
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Add class
            </button>
          )}
        </div>
      </div>

      {/* Permission banner */}
      <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />

        <div className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {isManager ? (
            <>
              You have{' '}
              <span className="font-bold uppercase text-zinc-900 dark:text-white">
                {currentUserRole}
              </span>{' '}
              privileges. You can manage the shared timetable.
            </>
          ) : (
            <>
              You are viewing this timetable as a{' '}
              <span className="font-bold uppercase text-zinc-900 dark:text-white">
                member
              </span>
              . Only class managers can modify entries.
            </>
          )}
        </div>
      </div>

      {/* No classes joined */}
      {joinedClasses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-800">
          <Calendar className="mx-auto mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-700" />

          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No class yet
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Join or create a class to start viewing its shared timetable.
          </p>
        </div>
      ) : classEntries.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <Calendar className="mx-auto mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-700" />

          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Timetable is empty
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            There are no classes scheduled for this class group yet.
          </p>

          {isManager && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Add first class
            </button>
          )}
        </div>
      ) : visibleDays.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <CheckCircle2 className="mx-auto mb-3 h-7 w-7 text-zinc-300 dark:text-zinc-700" />

          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Nothing scheduled
          </p>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            No classes are scheduled for this day.
          </p>
        </div>
      ) : (
        <div className="space-y-8" id="timetable-day-blocks">
          {visibleDays.map((day) => (
            <section
              key={day.value}
              id={`day-block-${day.value}`}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    {day.label}
                  </h3>

                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                    {day.entries.length}{' '}
                    {day.entries.length === 1 ? 'class' : 'classes'}
                  </p>
                </div>

                <div className="h-px flex-1 bg-zinc-100 ml-4 dark:bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {day.entries.map((entry) => (
                  <article
                    key={entry.id}
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
                              Cancelled
                            </span>
                          )}

                          {entry.originalVenue && (
                            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                              Room shifted
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
                            Originally: {entry.originalVenue}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 text-[10px] font-medium text-zinc-400">
                        {entry.durationMinutes} min
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
                          onClick={() => handleOpenEditModal(entry)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          id={`btn-delete-${entry.id}`}
                          onClick={() => handleRequestDelete(entry)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
{/* Delete confirmation */}
      {deleteTarget && (
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
              Remove this class?
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              You are about to remove{' '}
              <span className="font-semibold text-zinc-900 dark:text-white">
                {deleteTarget.subject}
              </span>{' '}
              from the shared timetable. This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
              >
                Keep class
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {isModalOpen && (
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
                  {editingEntry ? 'Manage class' : 'New class'}
                </p>

                <h3
                  id="timetable-modal-title"
                  className="mt-1 text-lg font-bold tracking-tight text-zinc-950 dark:text-white"
                >
                  {editingEntry
                    ? 'Edit timetable entry'
                    : 'Add timetable entry'}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5 p-6"
            >
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-500"
                />
              </div>

              {/* Day + venue */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="day-of-week"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Day
                  </label>

                  <select
                    id="day-of-week"
                    value={dayOfWeek}
                    onChange={(e) =>
                      setDayOfWeek(Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option
                        key={day.value}
                        value={day.value}
                      >
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Venue
                  </label>

                  <input
                    id="venue"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. LT 1"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-time"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Starts
                  </label>

                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    Ends
                  </label>

                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Cancellation */}
              {editingEntry && (
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      Cancel class
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                      Keep the entry visible but mark it as cancelled.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isCancelled}
                      onChange={(e) =>
                        setIsCancelled(e.target.checked)
                      }
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full bg-zinc-200 transition peer-checked:bg-red-600 peer-focus:outline-none after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5 dark:bg-zinc-800" />
                  </label>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  {editingEntry ? 'Save changes' : 'Add class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}