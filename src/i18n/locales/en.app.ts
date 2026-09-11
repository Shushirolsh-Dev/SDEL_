import type { AppStrings } from '../types.app';

export const meta = {
  code: 'en',
  nativeName: 'English',
};

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
  profile: {
    roleFallback: 'Student',
    studentFallback: 'Student',
    settingsButton: 'Settings',
    logoutButton: 'Log out',
  },
  notifications: {
    header: {
      backTitle: 'Back',
      title: 'Notifications',
      subtitle: 'Class announcements and updates',
      refreshButton: 'Refresh',
      refreshingButton: 'Refreshing',
    },
    empty: {
      title: 'Nothing new',
      subtitle:
        'Official announcements and important class updates will appear here.',
    },
    card: {
      labelCancelled: 'CANCELLED',
      labelUrgent: 'URGENT',
      labelVenueChanged: 'VENUE CHANGED',
      labelInfo: 'INFO',
      labelSponsored: 'SPONSORED',
      labelAdSpace: 'AD SPACE',
      sponsoredSpotlight: 'Sponsored spotlight',
      byLabel: 'By',
      teamLabel: 'THESDEL TEAM',
      agreedButton: (count) => `Agreed · ${count}`,
      agreeButton: (count) => `Agree · ${count}`,
      adLearnMore: 'Learn More',
      pollSectionLabel: 'Class poll',
      pollResponseRegistered: 'Response registered',
      pollResponseRecorded: 'Your response has been recorded.',
      pollSelected: 'Selected:',
      pollYourResponse: 'Your response',
      pollLineCounter: (current, max) =>
        `${current}/${max} lines`,
      pollTextareaPlaceholder: 'Write your response...',
      pollSubmitResponse: 'Submit response',
      pollSubmitAnswer: 'Submit answer',
      pollDefaultYes: 'Yes',
      pollDefaultNo: 'No',
    },
    rep: {
      title: 'Representative broadcast',
      subtitle: 'Send an official update to your class',
      textareaPlaceholder:
        'Share a study tip, reminder, schedule change, or important class notice...',
      counterLabel: (current, max) => `${current}/${max}`,
      visibleToMembers: 'Visible to class members',
      postButton: 'Post broadcast',
      postingButton: 'Posting',
      successMessage: 'Broadcast posted successfully',
    },
  },
};

export default EN;