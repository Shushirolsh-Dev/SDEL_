import { ClassGroup, TimetableEntry, AttendanceLog, ClassUpdate, User, NotificationPreferences } from './types';

// Production Initial Values (Zero Mock Data)
export const INITIAL_USER: User = {
  id: '',
  name: '',
  email: '',
  role: 'member',
  phone: '',
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

export const INITIAL_CLASSES: ClassGroup[] = [];
export const INITIAL_TIMETABLE: TimetableEntry[] = [];
export const INITIAL_ATTENDANCE: AttendanceLog[] = [];
export const INITIAL_UPDATES: ClassUpdate[] = [];

export const INITIAL_PREFERENCES: NotificationPreferences = {
  classStartingSoon: true,
  attendanceNotMarked: true,
  streakAtRisk: true,
  timetableOrVenueChanges: true,
};

// SIMULATED_TODAY is now dynamically computed from the user's current device local date
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
export const SIMULATED_TODAY = `${year}-${month}-${day}`;

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
 */
export function calculateAttendanceStats(
  timetable: TimetableEntry[],
  attendanceLogs: AttendanceLog[],
  joinedClassIds: string[],
  currentSimulatedTime: string // "HH:MM"
) {
  // Let's gather all past completed classes.
  // Generate a complete list of past dates from 2 weeks ago to today.
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 21); // Trace past 3 weeks
  const endDate = new Date();
  
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
    const y = tempDate.getFullYear();
    const m = String(tempDate.getMonth() + 1).padStart(2, '0');
    const dNum = String(tempDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dNum}`;
    const dayOfWeek = tempDate.getDay() === 0 ? 7 : tempDate.getDay();

    const dayEntries = timetable.filter(
      (entry) => entry.dayOfWeek === dayOfWeek && joinedClassIds.includes(entry.classId)
    );

    dayEntries.forEach((entry) => {
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

  // Sort occurrences chronologically
  occurrences.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  let totalScheduled = 0;
  let attendedCount = 0;
  let missedCount = 0;
  let cancelledCount = 0;

  const streakSequence: { date: string; subject: string; status: 'attended' | 'missed' | 'skipped' }[] = [];

  occurrences.forEach((occ) => {
    const log = attendanceLogs.find(
      (l) => l.timetableEntryId === occ.entryId && l.date === occ.date && l.status === 'attended'
    );

    if (occ.isCancelled) {
      cancelledCount++;
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
      if (log) {
        totalScheduled++;
        attendedCount++;
        streakSequence.push({ date: occ.date, subject: occ.subject, status: 'attended' });
      }
    }
  });

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  streakSequence.forEach((item) => {
    if (item.status === 'attended') {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else if (item.status === 'missed') {
      tempStreak = 0;
    }
  });

  const nonSkippedSequence = streakSequence.filter((item) => item.status !== 'skipped');
  for (let i = nonSkippedSequence.length - 1; i >= 0; i--) {
    if (nonSkippedSequence[i].status === 'attended') {
      currentStreak++;
    } else if (nonSkippedSequence[i].status === 'missed') {
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
