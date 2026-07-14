export type Role = 'member' | 'representative' | 'assistant';
export type SubscriptionPlan = 'free' | 'basic' | 'premium';

export interface CustomReminder {
  id: string;
  message: string;
  course: string;
  dateTime: string; // YYYY-MM-DDTHH:MM
}

export interface ReminderSettings {
  masterWhatsAppReminders: boolean;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string; // "HH:MM"
  classStartReminderEnabled: boolean;
  classStartReminderTime: number; // minutes before class, e.g., 15
  attendanceNotMarkedEnabled: boolean;
  streakAtRiskEnabled: boolean;
  venueChangeEnabled: boolean;
  customReminders: CustomReminder[];
  reminderAllowance: number; // e.g., 100
  remindersSent: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string; // Login / sign-up phone
  plan?: SubscriptionPlan;
  whatsappNumber?: string; // The one WhatsApp reminder number
  isReminderNumberLocked?: boolean;
  reminderSettings?: ReminderSettings;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  ownerId: string; // Class Representative who created it
  assistantIds: string[]; // Assistant IDs
  memberIds: string[]; // Member IDs
}

export interface TimetableEntry {
  id: string;
  classId: string;
  subject: string;
  dayOfWeek: number; // 1 = Monday, ..., 7 = Sunday
  startTime: string; // "HH:MM" 24-hour format
  endTime: string; // "HH:MM" 24-hour format
  durationMinutes: number;
  venue: string;
  originalVenue?: string; // Used to show exact venue change
  venueChangedAt?: string; // ISO timestamp
  isCancelled?: boolean;
  cancelledAt?: string;
}

export type ClassOccurrenceStatus = 'upcoming' | 'live' | 'completed' | 'cancelled' | 'missed';

export interface ClassOccurrence {
  id: string; // Unique for this specific date-entry combination: `${entry.id}_${date}`
  entry: TimetableEntry;
  date: string; // "YYYY-MM-DD"
  startTime: Date;
  endTime: Date;
  status: ClassOccurrenceStatus;
  attendanceMarked?: boolean;
}

export interface AttendanceLog {
  id: string;
  classId: string;
  timetableEntryId: string;
  date: string; // "YYYY-MM-DD"
  status: 'attended' | 'missed';
  timestamp: string; // ISO string when marked
}

export interface ClassUpdate {
  id: string;
  classId: string;
  userId?: string;
  userName: string;
  type: 'venue_change' | 'cancellation' | 'entry_added' | 'entry_edited' | 'entry_deleted';
  description: string;
  timestamp: string; // ISO string
}

export interface NotificationPreferences {
  classStartingSoon: boolean;
  attendanceNotMarked: boolean;
  streakAtRisk: boolean;
  timetableOrVenueChanges: boolean;
}

export interface PendingRemoval {
  id: string;
  classId: string;
  userId: string;
  requestedBy: string;
  createdAt: string;
}

