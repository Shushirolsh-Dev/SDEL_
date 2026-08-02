import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, X, AlertTriangle, Info } from 'lucide-react';
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
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
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

  // Form states
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [venue, setVenue] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Authorized manager checker (Representative or Assistant)
  const isManager = currentUserRole === 'representative' || currentUserRole === 'assistant';

  // Filtered entries for the active class
  const classEntries = timetable.filter((entry) => entry.classId === activeClassId);

  // Get active class details
  const activeClass = joinedClasses.find((c) => c.id === activeClassId);

  // Reset form
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

    if (!subject.trim()) {
      setErrorMsg('Subject name is required.');
      return;
    }
    if (!venue.trim()) {
      setErrorMsg('Venue is required.');
      return;
    }

    // Time validation
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
      // Editing
      onEditEntry(editingEntry.id, {
        subject,
        dayOfWeek,
        startTime,
        endTime,
        durationMinutes,
        venue,
        isCancelled,
      });
    } else {
      // Adding
      onAddEntry({
        classId: activeClassId,
        subject,
        dayOfWeek,
        startTime,
        endTime,
        durationMinutes,
        venue,
        isCancelled,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this timetable entry?')) {
      onDeleteEntry(id);
    }
  };

  // Group entries by day
  const groupedEntriesByDay = DAYS_OF_WEEK.map((day) => {
    const dayEntries = classEntries
      .filter((entry) => entry.dayOfWeek === day.value)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      ...day,
      entries: dayEntries,
    };
  });

  return (
    <div className="space-y-6" id="timetable-view-container">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Class Timetable
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Class: {activeClass ? `${activeClass.name} (${activeClass.code})` : 'None selected'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Day selection pills */}
          <div className="inline-flex border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-2.5 py-1 transition-colors cursor-pointer ${
                selectedDay === 'all' ? 'bg-zinc-900 dark:bg-zinc-800 text-white font-bold' : 'text-zinc-600 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              All Week
            </button>
            {DAYS_OF_WEEK.slice(0, 5).map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  selectedDay === day.value ? 'bg-zinc-900 dark:bg-zinc-800 text-white font-bold' : 'text-zinc-600 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {day.label.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Add entry button (authorized managers only) */}
          {isManager && activeClassId ? (
            <button
              id="btn-add-timetable-entry"
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 text-xs font-mono font-bold bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white border border-zinc-900 dark:border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Entry
            </button>
          ) : (
            isManager && (
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 px-3 py-1.5">
                Join/Create class to add entries
              </span>
            )
          )}
        </div>
      </div>

      {/* Role permission info indicator */}
      <div className="flex items-center gap-2 text-xs border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-600 dark:text-zinc-350">
        <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
        {isManager ? (
          <span>
            You have **{currentUserRole.toUpperCase()}** privileges. You can edit the shared timetable, reschedule rooms, and cancel entries.
          </span>
        ) : (
          <span>
            You are viewing the schedule as a **MEMBER**. You cannot modify the timetable entries or venues.
          </span>
        )}
      </div>

      {/* Main Timetable Day Grid */}
      {joinedClasses.length === 0 ? (
        <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500 dark:text-zinc-400 font-mono text-sm">
          Join a class to view the schedule.
        </div>
      ) : classEntries.length === 0 ? (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center space-y-2">
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">The timetable for this class is currently empty.</p>
          {isManager && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 text-xs font-mono font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              Add your first entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6" id="timetable-day-blocks">
          {groupedEntriesByDay
            .filter((day) => selectedDay === 'all' || selectedDay === day.value)
            .map((day) => {
              // Skip Saturday/Sunday if filtered "all" and they have no classes
              if (selectedDay === 'all' && (day.value === 6 || day.value === 7) && day.entries.length === 0) {
                return null;
              }

              return (
                <div key={day.value} id={`day-block-${day.value}`} className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                    {day.label} ({day.entries.length} {day.entries.length === 1 ? 'class' : 'classes'})
                  </h3>

                  {day.entries.length === 0 ? (
                    <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 italic pl-2 py-1">No classes scheduled</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.entries.map((entry) => (
                        <div
                          key={entry.id}
                          id={`entry-card-${entry.id}`}
                          className={`border p-4 bg-white dark:bg-zinc-900 relative transition-all rounded-none ${
                            entry.isCancelled ? 'opacity-50 border-zinc-100 dark:border-zinc-800/60' : 'border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                                {entry.startTime} - {entry.endTime} ({entry.durationMinutes}m)
                              </span>
                              <div className="flex items-center gap-1">
                                {entry.isCancelled && (
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                                    Cancelled
                                  </span>
                                )}
                                {entry.originalVenue && (
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                                    Room Shifted
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className={`font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 ${entry.isCancelled ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                              {entry.subject}
                            </h4>

                            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex flex-col gap-1">
                              <span>Venue: {entry.venue}</span>
                              {entry.originalVenue && (
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                  Originally scheduled in: {entry.originalVenue}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Management Controls Overlay / Bottom bar */}
                          {isManager && (
                            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2" id={`entry-actions-${entry.id}`}>
                              <button
                                id={`btn-edit-${entry.id}`}
                                onClick={() => handleOpenEditModal(entry)}
                                className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-950 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                id={`btn-delete-${entry.id}`}
                                onClick={() => handleDelete(entry.id)}
                                className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-200 dark:border-red-900/40 hover:border-red-400 dark:hover:border-red-600 bg-red-50 dark:bg-red-950/20 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Standard Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg tracking-tight text-zinc-950 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-400 text-xs font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Subject Name</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.value} value={day.value} className="bg-white dark:bg-zinc-950">
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Venue / Room</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Lab 3, IT Center"
                    className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs"
                  />
                </div>
              </div>

              {editingEntry && (
                <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-zinc-700 dark:text-zinc-300 text-[10px] uppercase">Class Cancellation</span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-450">Cancel entry to protect streaks</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCancelled}
                      onChange={(e) => setIsCancelled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white border border-zinc-900 dark:border-zinc-800 font-bold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
