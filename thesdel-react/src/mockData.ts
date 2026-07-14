import { ClassGroup, TimetableEntry, AttendanceLog, ClassUpdate, User, NotificationPreferences } from './types';

// Let's assume our user is Philip
export const INITIAL_USER: User = {
  id: 'user_1',
  name: 'Philip Jonathan',
  email: 'philipjonathanpeter24@gmail.com',
  role: 'member', // Default role. Can switch between member, representative, assistant
  phone: '+2348100240137',
  plan: 'free',
  whatsappNumber: '',
  isReminderNumberLocked: false,
  reminderSettings: {
    masterWhatsAppReminders: false,
    dailySummaryEnabled: false,
    dailySummaryTime: '08:00',
    classStartReminderEnabled: false,
    classStartReminderTime: 15,
    attendanceNotMarkedEnabled: false,
    streakAtRiskEnabled: false,
    venueChangeEnabled: false,
    customReminders: [],
    reminderAllowance: 100,
    remindersSent: 0
  }
};

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'class_swe301',
    name: 'Software Engineering Cohort A',
    code: 'SWE301',
    ownerId: 'user_rep_1', // Owned by a representative
    assistantIds: ['user_asst_1'],
    memberIds: ['user_1', 'user_2', 'user_3'],
  },
  {
    id: 'class_cs101',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    ownerId: 'user_1', // Owned by Philip (so he can test being representative!)
    assistantIds: [],
    memberIds: ['user_2', 'user_3'],
  }
];

export const INITIAL_TIMETABLE: TimetableEntry[] = [
  // Class: Software Engineering Cohort A (SWE301)
  {
    id: 'entry_1',
    classId: 'class_swe301',
    subject: 'Computer Architecture',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    venue: 'Room 402, Block C',
  },
  {
    id: 'entry_2',
    classId: 'class_swe301',
    subject: 'Software Engineering',
    dayOfWeek: 1, // Monday
    startTime: '11:00',
    endTime: '12:30',
    durationMinutes: 90,
    venue: 'Lab 3, IT Center',
  },
  {
    id: 'entry_3',
    classId: 'class_swe301',
    subject: 'Discrete Mathematics',
    dayOfWeek: 1, // Monday
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    venue: 'Lecture Hall B',
    originalVenue: 'Room 101, Main Block', // To demonstrate a venue change!
    venueChangedAt: '2026-07-12T14:30:00Z',
  },
  {
    id: 'entry_4',
    classId: 'class_swe301',
    subject: 'Database Systems',
    dayOfWeek: 2, // Tuesday
    startTime: '09:30',
    endTime: '11:00',
    durationMinutes: 90,
    venue: 'Seminar Room 1',
  },
  {
    id: 'entry_5',
    classId: 'class_swe301',
    subject: 'Web Development Lab',
    dayOfWeek: 2, // Tuesday
    startTime: '13:00',
    endTime: '15:00',
    durationMinutes: 120,
    venue: 'Lab 5, IT Center',
  },
  {
    id: 'entry_6',
    classId: 'class_swe301',
    subject: 'Software Engineering',
    dayOfWeek: 3, // Wednesday
    startTime: '11:00',
    endTime: '12:30',
    durationMinutes: 90,
    venue: 'Lab 3, IT Center',
  },
  {
    id: 'entry_7',
    classId: 'class_swe301',
    subject: 'Human Computer Interaction',
    dayOfWeek: 3, // Wednesday
    startTime: '15:00',
    endTime: '16:30',
    durationMinutes: 90,
    venue: 'Room 102, Block A',
  },
  {
    id: 'entry_8',
    classId: 'class_swe301',
    subject: 'Database Systems',
    dayOfWeek: 4, // Thursday
    startTime: '09:30',
    endTime: '11:00',
    durationMinutes: 90,
    venue: 'Seminar Room 1',
  },
  {
    id: 'entry_9',
    classId: 'class_swe301',
    subject: 'Computer Architecture',
    dayOfWeek: 4, // Thursday
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    venue: 'Room 402, Block C',
  },
  {
    id: 'entry_10',
    classId: 'class_swe301',
    subject: 'Discrete Mathematics',
    dayOfWeek: 5, // Friday
    startTime: '10:00',
    endTime: '11:30',
    durationMinutes: 90,
    venue: 'Lecture Hall B',
    isCancelled: true, // Demo cancellation!
    cancelledAt: '2026-07-13T05:00:00Z',
  },
  {
    id: 'entry_11',
    classId: 'class_swe301',
    subject: 'Technical Writing',
    dayOfWeek: 5, // Friday
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    venue: 'Room 201, Block B',
  },

  // Class: CS101 (Phillip's Owned)
  {
    id: 'entry_cs_1',
    classId: 'class_cs101',
    subject: 'Introduction to Python',
    dayOfWeek: 1, // Monday
    startTime: '10:00',
    endTime: '11:30',
    durationMinutes: 90,
    venue: 'Room 102, Tech Block',
  },
  {
    id: 'entry_cs_2',
    classId: 'class_cs101',
    subject: 'Computational Thinking',
    dayOfWeek: 3, // Wednesday
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    venue: 'Lab 1, Computing Centre',
  }
];

// Generate realistic historical attendance logs
// Today is Monday July 13, 2026. Let's seed logs for the past 2 weeks (June 29 - July 3, July 6 - July 10)
// To keep things simple, let's write out logs for SWE301 past entries
export const INITIAL_ATTENDANCE: AttendanceLog[] = [
  // Week of June 29 - July 3 (All scheduled classes attended except one cancellation which wasn't broken)
  { id: 'att_1', classId: 'class_swe301', timetableEntryId: 'entry_1', date: '2026-06-29', status: 'attended', timestamp: '2026-06-29T09:15:00Z' },
  { id: 'att_2', classId: 'class_swe301', timetableEntryId: 'entry_2', date: '2026-06-29', status: 'attended', timestamp: '2026-06-29T11:05:00Z' },
  { id: 'att_3', classId: 'class_swe301', timetableEntryId: 'entry_3', date: '2026-06-29', status: 'attended', timestamp: '2026-06-29T14:10:00Z' },
  { id: 'att_4', classId: 'class_swe301', timetableEntryId: 'entry_4', date: '2026-06-30', status: 'attended', timestamp: '2026-06-30T09:35:00Z' },
  { id: 'att_5', classId: 'class_swe301', timetableEntryId: 'entry_5', date: '2026-06-30', status: 'attended', timestamp: '2026-06-30T13:01:00Z' },
  { id: 'att_6', classId: 'class_swe301', timetableEntryId: 'entry_6', date: '2026-07-01', status: 'attended', timestamp: '2026-07-01T11:02:00Z' },
  { id: 'att_7', classId: 'class_swe301', timetableEntryId: 'entry_7', date: '2026-07-01', status: 'attended', timestamp: '2026-07-01T15:05:00Z' },
  { id: 'att_8', classId: 'class_swe301', timetableEntryId: 'entry_8', date: '2026-07-02', status: 'attended', timestamp: '2026-07-02T09:40:00Z' },
  { id: 'att_9', classId: 'class_swe301', timetableEntryId: 'entry_9', date: '2026-07-02', status: 'attended', timestamp: '2026-07-02T14:02:00Z' },
  // entry_10 on 2026-07-03 cancelled or skipped - let's say it was cancelled and not logged.
  { id: 'att_11', classId: 'class_swe301', timetableEntryId: 'entry_11', date: '2026-07-03', status: 'attended', timestamp: '2026-07-03T14:10:00Z' },

  // Week of July 6 - July 10 (All attended to maintain streak)
  { id: 'att_12', classId: 'class_swe301', timetableEntryId: 'entry_1', date: '2026-07-06', status: 'attended', timestamp: '2026-07-06T09:05:00Z' },
  { id: 'att_13', classId: 'class_swe301', timetableEntryId: 'entry_2', date: '2026-07-06', status: 'attended', timestamp: '2026-07-06T11:03:00Z' },
  { id: 'att_14', classId: 'class_swe301', timetableEntryId: 'entry_3', date: '2026-07-06', status: 'attended', timestamp: '2026-07-06T14:01:00Z' },
  { id: 'att_15', classId: 'class_swe301', timetableEntryId: 'entry_4', date: '2026-07-07', status: 'attended', timestamp: '2026-07-07T09:32:00Z' },
  { id: 'att_16', classId: 'class_swe301', timetableEntryId: 'entry_5', date: '2026-07-07', status: 'attended', timestamp: '2026-07-07T13:05:00Z' },
  { id: 'att_17', classId: 'class_swe301', timetableEntryId: 'entry_6', date: '2026-07-08', status: 'attended', timestamp: '2026-07-08T11:15:00Z' },
  { id: 'att_18', classId: 'class_swe301', timetableEntryId: 'entry_7', date: '2026-07-08', status: 'attended', timestamp: '2026-07-08T15:02:00Z' },
  { id: 'att_19', classId: 'class_swe301', timetableEntryId: 'entry_8', date: '2026-07-09', status: 'attended', timestamp: '2026-07-09T09:34:00Z' },
  { id: 'att_20', classId: 'class_swe301', timetableEntryId: 'entry_9', date: '2026-07-09', status: 'attended', timestamp: '2026-07-09T14:11:00Z' },
  // entry_10 on 2026-07-10 cancelled or skipped
  { id: 'att_22', classId: 'class_swe301', timetableEntryId: 'entry_11', date: '2026-07-10', status: 'attended', timestamp: '2026-07-10T14:05:00Z' },
];

export const INITIAL_UPDATES: ClassUpdate[] = [
  {
    id: 'upd_1',
    classId: 'class_swe301',
    userId: 'user_rep_1',
    userName: 'Sarah (Rep)',
    type: 'venue_change',
    description: 'Discrete Mathematics: Room changed to Lecture Hall B due to construction in Room 101.',
    timestamp: '2026-07-12T14:30:00Z',
  },
  {
    id: 'upd_2',
    classId: 'class_swe301',
    userId: 'user_rep_1',
    userName: 'Sarah (Rep)',
    type: 'cancellation',
    description: 'Discrete Mathematics: Friday lab is cancelled this week because of the national holiday.',
    timestamp: '2026-07-13T05:00:00Z',
  },
];

export const INITIAL_PREFERENCES: NotificationPreferences = {
  classStartingSoon: true,
  attendanceNotMarked: true,
  streakAtRisk: true,
  timetableOrVenueChanges: true,
};

// Date helper relative to simulated date: July 13, 2026 (Monday)
export const SIMULATED_TODAY = '2026-07-13';

// Helper to determine dayOfWeek from YYYY-MM-DD
export function getDayOfWeekFromDate(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00'); // avoid timezone shifts
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day === 0 ? 7 : day;
}

// Generate a date string (YYYY-MM-DD) offset by days from SIMULATED_TODAY
export function getDateWithOffset(offsetDays: number): string {
  const d = new Date(SIMULATED_TODAY + 'T12:00:00');
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the list of dates for a given week containing a dateStr
export function getWeekDates(dateStr: string): { date: string; dayName: string; dayOfWeek: number }[] {
  const baseDate = new Date(dateStr + 'T12:00:00');
  const currentDay = baseDate.getDay(); // 0-6
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + distanceToMonday);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    return {
      date: `${year}-${month}-${dateNum}`,
      dayName,
      dayOfWeek: idx + 1,
    };
  });
}

/**
 * Robust Attendance and Streak Calculations
 *
 * Algorithm details:
 * We need a clean sequence of classes that actually occurred up to the current simulated date and time.
 * For this sequence:
 * - If a class was cancelled (`isCancelled: true`), it is skipped completely.
 * - For others, if the student marked it as attended, it is 'attended'.
 * - If the class is in the past (completed) and there's no log, it is marked as 'missed'.
 * - If the class is currently "live" or "upcoming", we do not mark it missed yet (unless the day is fully past).
 *
 * Let's construct a daily historical list of class occurrences starting from 2026-06-29 (the start of the mock records).
 * This covers weeks:
 * Week 1: June 29 - July 3
 * Week 2: July 6 - July 10
 * Week 3: July 13 (today)
 */
export function calculateAttendanceStats(
  timetable: TimetableEntry[],
  attendanceLogs: AttendanceLog[],
  joinedClassIds: string[],
  currentSimulatedTime: string // "HH:MM" for July 13
) {
  // Let's gather all past completed classes.
  // We'll generate a complete list of past dates from 2026-06-29 to 2026-07-13.
  const startDate = new Date('2026-06-29T00:00:00');
  const endDate = new Date('2026-07-13T23:59:59');
  
  const occurrences: {
    entryId: string;
    classId: string;
    subject: string;
    venue: string;
    date: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isCancelled: boolean;
    isPast: boolean;
    isLive: boolean;
  }[] = [];

  const tempDate = new Date(startDate);
  while (tempDate <= endDate) {
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(tempDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;
    const dayOfWeek = tempDate.getDay() === 0 ? 7 : tempDate.getDay();

    // Find all timetable entries matching this dayOfWeek and in joined classes
    const dayEntries = timetable.filter(
      (entry) => entry.dayOfWeek === dayOfWeek && joinedClassIds.includes(entry.classId)
    );

    dayEntries.forEach((entry) => {
      // Check if it's in the past relative to 2026-07-13 + currentSimulatedTime
      let isPast = false;
      let isLive = false;

      if (dateStr < SIMULATED_TODAY) {
        isPast = true;
      } else if (dateStr === SIMULATED_TODAY) {
        const [currH, currM] = currentSimulatedTime.split(':').map(Number);
        const [endH, endM] = entry.endTime.split(':').map(Number);
        const [startH, startM] = entry.startTime.split(':').map(Number);
        
        const currMins = currH * 60 + currM;
        const endMins = endH * 60 + endM;
        const startMins = startH * 60 + startM;

        if (currMins >= endMins) {
          isPast = true;
        } else if (currMins >= startMins) {
          isLive = true;
        }
      }

      occurrences.push({
        entryId: entry.id,
        classId: entry.classId,
        subject: entry.subject,
        venue: entry.venue,
        date: dateStr,
        dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        isCancelled: !!entry.isCancelled,
        isPast,
        isLive,
      });
    });

    tempDate.setDate(tempDate.getDate() + 1);
  }

  // Sort occurrences chronologically (by date then start time)
  occurrences.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Calculate status for each past or active occurrence
  let totalScheduled = 0;
  let attendedCount = 0;
  let missedCount = 0;
  let cancelledCount = 0;

  // Track streak items in chronological order
  // A streak is counted on consecutive scheduled classes *attended* (ignoring cancelled).
  // When a student misses a past class, the streak breaks (resets to 0).
  const streakSequence: { date: string; subject: string; status: 'attended' | 'missed' | 'skipped' }[] = [];

  occurrences.forEach((occ) => {
    // Check if there is an attendance log
    const log = attendanceLogs.find(
      (l) => l.timetableEntryId === occ.entryId && l.date === occ.date && l.status === 'attended'
    );

    if (occ.isCancelled) {
      cancelledCount++;
      // Cancelled classes must NOT break the streak and do not count toward or against it.
      // So we record them as skipped.
      streakSequence.push({ date: occ.date, subject: occ.subject, status: 'skipped' });
      return;
    }

    if (occ.isPast) {
      totalScheduled++;
      if (log) {
        attendedCount++;
        streakSequence.push({ date: occ.date, subject: occ.subject, status: 'attended' });
      } else {
        missedCount++;
        streakSequence.push({ date: occ.date, subject: occ.subject, status: 'missed' });
      }
    } else if (occ.isLive) {
      // If it's live, we count it as scheduled. If they attended, great. If not, we don't break the streak yet because class is live.
      if (log) {
        totalScheduled++;
        attendedCount++;
        streakSequence.push({ date: occ.date, subject: occ.subject, status: 'attended' });
      }
    }
  });

  // Now calculate current and longest streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // For longest streak, scan the chronological sequence from left to right (past to present)
  streakSequence.forEach((item) => {
    if (item.status === 'attended') {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else if (item.status === 'missed') {
      tempStreak = 0;
    }
    // 'skipped' (cancelled) is ignored, preserving whatever streak size is active
  });

  // For current streak, let's trace backwards from the latest completed class
  // Let's filter out skipped entries first to trace actual attended/missed classes
  const nonSkippedSequence = streakSequence.filter((item) => item.status !== 'skipped');
  for (let i = nonSkippedSequence.length - 1; i >= 0; i--) {
    if (nonSkippedSequence[i].status === 'attended') {
      currentStreak++;
    } else if (nonSkippedSequence[i].status === 'missed') {
      // We hit a missed class, the active streak terminates here.
      break;
    }
  }

  const attendancePercentage = totalScheduled > 0 ? Math.round((attendedCount / totalScheduled) * 100) : 100;

  return {
    totalScheduled,
    attendedCount,
    missedCount,
    cancelledCount,
    attendancePercentage,
    currentStreak,
    longestStreak,
    streakSequence,
    occurrences,
  };
}
