/* ============================================================
   APP STRINGS
   ------------------------------------------------------------
   Central translation source for the whole application.
   No component imports from another component here — this
   file is neutral, so App.tsx and LandingView.tsx can both
   import from it without a circular dependency.

   To add a language:
     1. Copy the EN object
     2. Rename it (e.g. FR), translate the values
     3. Add it to APP_LOCALES
     4. Pass locale="fr" wherever you read getAppStrings()
   ============================================================ */

/* ------------------------------------------------------------
   SHARED / HEADER
   ------------------------------------------------------------ */

export interface HeaderStrings {
  brand: string;
  syncSynced: string;
  syncPending: string;
  console: string;
}

/* ------------------------------------------------------------
   BOTTOM NAVIGATION
   ------------------------------------------------------------ */

export interface NavStrings {
  today: string;
  timetable: string;
  attendance: string;
  class: string;
  profile: string;
}

/* ------------------------------------------------------------
   TOASTS — everything showToast() can display
   ------------------------------------------------------------ */

export interface ToastStrings {
  classCodeNotFound: (code: string) => string;
  alreadyJoined: string;
  errorJoining: (message: string) => string;
  requestSubmitted: string;
  enrolledSuccess: (className: string) => string;
  joinApproved: string;
  joinDenied: string;
  removalRequestSent: string;
  memberRemoved: string;
  removalApproved: string;
  removalRejected: string;
  codeChanged: (code: string) => string;
  attendanceMarked: string;
  timetableAdded: string;
  timetableUpdated: string;
  timetableDeleted: string;
  memberPromoted: string;
  assistantDemoted: string;
  classDeleted: string;
  mustBeLoggedIn: string;
  cannotLeaveAsRep: string;
  selectAssistantToTransfer: string;
  leaveFailed: string;
  leftClass: string;
  transferFailed: string;
  roleUpdateFailed: string;
  roleUpdateFailedSelf: string;
  ownershipTransferred: (name: string) => string;
  leaveAfterTransferFailed: string;
  leftAfterTransfer: string;
}

/* ------------------------------------------------------------
   CONFIRM DIALOGS
   ------------------------------------------------------------ */

export interface ConfirmStrings {
  transferOwnershipToOne: (name: string) => string;
}

/* ------------------------------------------------------------
   BROADCAST / UPDATE MESSAGES (written to the `updates` table)
   ------------------------------------------------------------ */

export interface BroadcastStrings {
  classRepMarker: string;
  classCreated: (name: string, author: string, code: string) => string;
  entryAdded: (subject: string, day: string, startTime: string) => string;
  venueChanged: (subject: string, from: string, to: string) => string;
  classCancelled: (subject: string) => string;
  cancellationReverted: (subject: string) => string;
  entryDeleted: (subject: string) => string;
  dayNames: string[];
}

/* ------------------------------------------------------------
   MASTER SHAPE
   ------------------------------------------------------------ */

export interface AppStrings {
  header: HeaderStrings;
  nav: NavStrings;
  toast: ToastStrings;
  confirm: ConfirmStrings;
  broadcast: BroadcastStrings;
}

/* ------------------------------------------------------------
   ENGLISH
   ------------------------------------------------------------ */

const EN: AppStrings = {
  header: {
    brand: 'THESDEL',
    syncSynced: 'SYNCED',
    syncPending: 'PENDING SYNC:',
    console: 'Console',
  },
  nav: {
    today: 'Today',
    timetable: 'Timetable',
    attendance: 'Attendance',
    class: 'Class',
    profile: 'Profile',
  },
  toast: {
    classCodeNotFound: (code) => `Class code "${code}" not found.`,
    alreadyJoined:
      'You have already joined or requested to join this class.',
    errorJoining: (message) => `Error joining class: ${message}`,
    requestSubmitted:
      'Your enrollment request has been submitted for approval.',
    enrolledSuccess: (className) =>
      `Successfully enrolled in "${className}"!`,
    joinApproved: 'Student joining request approved!',
    joinDenied: 'Student joining request denied.',
    removalRequestSent: 'Removal request sent to Class Representative.',
    memberRemoved: 'Member removed successfully.',
    removalApproved: 'Member removal approved.',
    removalRejected: 'Member removal rejected.',
    codeChanged: (code) => `Class code changed to: ${code}`,
    attendanceMarked: 'Attendance marked!',
    timetableAdded: 'Timetable entry added!',
    timetableUpdated: 'Timetable entry updated!',
    timetableDeleted: 'Timetable entry deleted.',
    memberPromoted: 'Member promoted to Assistant!',
    assistantDemoted: 'Assistant demoted to Member.',
    classDeleted: 'Class deleted successfully.',
    mustBeLoggedIn: 'You must be logged in to leave a class.',
    cannotLeaveAsRep:
      'You are the class representative. You must delete the class or promote someone to assistant first.',
    selectAssistantToTransfer:
      'Please select an assistant to transfer ownership to.',
    leaveFailed: 'Failed to leave class. Please try again.',
    leftClass: 'You have successfully left the class.',
    transferFailed: 'Failed to transfer ownership. Please try again.',
    roleUpdateFailed: 'Failed to update role. Please try again.',
    roleUpdateFailedSelf:
      'Failed to update your role. Please try again.',
    ownershipTransferred: (name) =>
      `Ownership transferred to ${name}. You are now a member.`,
    leaveAfterTransferFailed:
      'Ownership transferred but failed to leave. Please try leaving again.',
    leftAfterTransfer:
      'You have successfully left the class after transferring ownership.',
  },
  confirm: {
    transferOwnershipToOne: (name) =>
      `You are the class representative. Transfer ownership to ${name} and leave the class?`,
  },
  broadcast: {
    classRepMarker: 'Class Representative',
    classCreated: (name, author, code) =>
      `Class "${name}" was created by representative ${author} with unique code: ${code}`,
    entryAdded: (subject, day, startTime) =>
      `Added timetable schedule: ${subject} on ${day}s at ${startTime}.`,
    venueChanged: (subject, from, to) =>
      `${subject} room was moved from ${from} to ${to}. `,
    classCancelled: (subject) =>
      `${subject} class schedule is officially CANCELLED (Streak Safe). `,
    cancellationReverted: (subject) =>
      `${subject} class cancellation has been reverted. `,
    entryDeleted: (subject) =>
      `Schedule for ${subject} was permanently removed from timetable.`,
    dayNames: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
};

/* ------------------------------------------------------------
   LOCALES REGISTRY
   ------------------------------------------------------------ */

export const APP_LOCALES: Record<string, AppStrings> = {
  en: EN,
};

export const DEFAULT_APP_LOCALE = 'en';

export function getAppStrings(
  locale: string | undefined
): AppStrings {
  if (!locale) return APP_LOCALES[DEFAULT_APP_LOCALE];
  return (
    APP_LOCALES[locale] ?? APP_LOCALES[DEFAULT_APP_LOCALE]
  );
}