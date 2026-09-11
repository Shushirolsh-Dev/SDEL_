import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { TimetableEntry, ClassGroup, Role } from '../types';
import type { TimetableStrings } from '../i18n/types.app';
import TimetableHeader from './timetable/TimetableHeader';
import TimetableEntryCard from './timetable/TimetableEntryCard';
import TimetableFormModal from './timetable/TimetableFormModal';
import TimetableDeleteModal from './timetable/TimetableDeleteModal';

interface TimetableViewProps {
  timetable: TimetableEntry[];
  joinedClasses: ClassGroup[];
  activeClassId: string;
  strings: TimetableStrings;
  onAddEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  onEditEntry: (
    id: string,
    updatedFields: Partial<TimetableEntry>
  ) => void;
  onDeleteEntry: (id: string) => void;
  currentUserRole: Role;
}

export default function TimetableView({
  timetable,
  joinedClasses,
  activeClassId,
  strings,
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
      setErrorMsg(strings.form.errorSubjectRequired);
      return;
    }

    if (!cleanVenue) {
      setErrorMsg(strings.form.errorVenueRequired);
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal >= endTotal) {
      setErrorMsg(strings.form.errorTimeOrder);
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

  const groupedEntriesByDay = strings.days.labels.map((_, i) => ({
    value: i + 1,
    entries: classEntries
      .filter((entry) => entry.dayOfWeek === i + 1)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const visibleDays = groupedEntriesByDay.filter((day) => {
    if (selectedDay !== 'all') {
      return selectedDay === day.value;
    }
    return day.entries.length > 0;
  });

  const dayLabel = (value: number) =>
    strings.days.labels[value - 1] ?? '';

  const classLabel = (count: number) =>
    count === 1 ? 'class' : 'classes';

  return (
    <div className="space-y-6 pb-10" id="timetable-view-container">
      <TimetableHeader
        strings={strings.header}
        days={strings.days}
        activeClassName={activeClass?.name ?? null}
        activeClassCode={activeClass?.code ?? null}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        showAddButton={isManager && !!activeClassId}
        onAddClick={handleOpenAddModal}
      />

      <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />

        <div className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {isManager ? (
            <>
              {strings.permission.managerPrefix}{' '}
              <span className="font-bold uppercase text-zinc-900 dark:text-white">
                {currentUserRole}
              </span>{' '}
              {strings.permission.managerSuffix}
            </>
          ) : (
            <>
              {strings.permission.memberPrefix}{' '}
              <span className="font-bold uppercase text-zinc-900 dark:text-white">
                {strings.permission.memberMiddle}
              </span>
              {strings.permission.memberSuffix}
            </>
          )}
        </div>
      </div>

      {joinedClasses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-800">
          <Calendar className="mx-auto mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-700" />

          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {strings.empty.noClassTitle}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {strings.empty.noClassSubtitle}
          </p>
        </div>
      ) : classEntries.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <Calendar className="mx-auto mb-4 h-8 w-8 text-zinc-300 dark:text-zinc-700" />

          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {strings.empty.emptyTitle}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {strings.empty.emptySubtitle}
          </p>

          {isManager && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              {strings.empty.addFirstClassButton}
            </button>
          )}
        </div>
      ) : visibleDays.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <CheckCircle2 className="mx-auto mb-3 h-7 w-7 text-zinc-300 dark:text-zinc-700" />

          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {strings.empty.nothingScheduledTitle}
          </p>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {strings.empty.nothingScheduledSubtitle}
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
                    {dayLabel(day.value)}
                  </h3>

                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
                    {day.entries.length} {classLabel(day.entries.length)}
                  </p>
                </div>

                <div className="ml-4 h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {day.entries.map((entry) => (
                  <TimetableEntryCard
                    key={entry.id}
                    strings={strings.entryCard}
                    entry={entry}
                    isManager={isManager}
                    onEdit={handleOpenEditModal}
                    onDelete={handleRequestDelete}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {deleteTarget && (
        <TimetableDeleteModal
          strings={strings.deleteDialog}
          entry={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isModalOpen && (
        <TimetableFormModal
          strings={strings.form}
          days={strings.days}
          editingEntry={editingEntry}
          subject={subject}
          dayOfWeek={dayOfWeek}
          startTime={startTime}
          endTime={endTime}
          venue={venue}
          isCancelled={isCancelled}
          errorMsg={errorMsg}
          onChangeSubject={setSubject}
          onChangeDay={setDayOfWeek}
          onChangeStartTime={setStartTime}
          onChangeEndTime={setEndTime}
          onChangeVenue={setVenue}
          onChangeIsCancelled={setIsCancelled}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}