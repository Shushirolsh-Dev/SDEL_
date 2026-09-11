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
  home: {
    header: {
      todayLabel: 'Today',
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      nameFallback: 'Student',
      openNotifications: 'Open notifications',
    },
    nextClass: {
      liveClassLabel: 'Live class',
      nextClassLabel: 'Next class',
      fallbackClassName: 'Class',
      noMoreClassesTitle: 'No more classes',
      noMoreClassesSubtitle: 'Your academic day is clear.',
      liveCountdown: (minutes) => `LIVE NOW · ${minutes}m remaining`,
      startsInHours: (hours, minutes) => `Starts in ${hours}h ${minutes}m`,
      startsInMinutes: (minutes) => `Starts in ${minutes}m`,
      noMoreClassesToday: 'No more classes today',
    },
    schedule: {
      sectionTitle: 'Today',
      sectionSubtitle: 'Your class schedule',
      refreshing: 'Refreshing...',
      refresh: 'Refresh',
      emptyTitle: 'No classes today',
      emptySubtitle: 'Enjoy the free time or get ahead.',
      fallbackClassName: 'Class',
      liveBadge: 'LIVE',
      cancelledBadge: 'CANCELLED',
      presentButton: 'Present',
      markButton: 'Mark',
    },
    attendance: {
      sectionLabel: 'Attendance',
      attendedCount: (count) => `${count} attended`,
      totalCount: (count) => `${count} total`,
    },
    updates: {
      sectionTitle: 'Updates',
      showLess: 'Show less',
      viewAll: 'View all',
      noUpdates: 'No updates yet.',
      reacted: 'Reacted',
      acknowledge: 'Acknowledge',
      labelCancelled: 'CANCELLED',
      labelVenueChanged: 'VENUE CHANGED',
      labelGlobal: 'GLOBAL',
      labelClassUpdate: 'CLASS UPDATE',
    },
    rep: {
      title: 'Class rep',
      subtitle: 'Send a broadcast to your class.',
      textareaPlaceholder: 'Write an announcement...',
      sending: 'Sending...',
      broadcast: 'Broadcast',
      successMessage: 'Broadcast sent successfully.',
    },
    ad: {
      sponsoredLabel: 'Sponsored',
      altFallback: 'Sponsored',
    },
  },
  timetable: {
    header: {
      sectionLabel: 'Academic Schedule',
      title: 'Timetable',
      noClassSelected: 'No class selected',
      weekButton: 'Week',
      addClassButton: 'Add class',
    },
    permission: {
      managerPrefix: 'You have',
      managerSuffix: 'privileges. You can manage the shared timetable.',
      memberPrefix: 'You are viewing this timetable as a',
      memberMiddle: 'member',
      memberSuffix: '. Only class managers can modify entries.',
    },
    empty: {
      noClassTitle: 'No class yet',
      noClassSubtitle:
        'Join or create a class to start viewing its shared timetable.',
      emptyTitle: 'Timetable is empty',
      emptySubtitle:
        'There are no classes scheduled for this class group yet.',
      addFirstClassButton: 'Add first class',
      nothingScheduledTitle: 'Nothing scheduled',
      nothingScheduledSubtitle:
        'No classes are scheduled for this day.',
    },
    days: {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    entryCard: {
      cancelledBadge: 'Cancelled',
      roomShiftedBadge: 'Room shifted',
      originallyLabel: 'Originally:',
      minutesSuffix: 'min',
      editButton: 'Edit',
      deleteButton: 'Delete',
    },
    form: {
      newClassEyebrow: 'New class',
      editClassEyebrow: 'Manage class',
      addTitle: 'Add timetable entry',
      editTitle: 'Edit timetable entry',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'e.g. Software Engineering',
      dayLabel: 'Day',
      venueLabel: 'Venue',
      venuePlaceholder: 'e.g. LT 1',
      startsLabel: 'Starts',
      endsLabel: 'Ends',
      cancelClassTitle: 'Cancel class',
      cancelClassSubtitle:
        'Keep the entry visible but mark it as cancelled.',
      cancelButton: 'Cancel',
      saveChangesButton: 'Save changes',
      addClassButton: 'Add class',
      errorSubjectRequired: 'Subject name is required.',
      errorVenueRequired: 'Venue is required.',
      errorTimeOrder: 'Start time must be before end time.',
    },
    deleteDialog: {
      title: 'Remove this class?',
      descriptionPrefix: 'You are about to remove',
      descriptionSuffix:
        'from the shared timetable. This action cannot be undone.',
      keepButton: 'Keep class',
      removeButton: 'Remove',
    },
  },
  attendance: {
    header: {
      sectionLabel: 'Academic Record',
      title: 'Attendance',
      subtitle:
        'Track your attendance, streaks, and completed classes.',
      statusSafe: 'Attendance Safe',
      statusNeedsAttention: 'Needs Attention',
    },
    summary: {
      attendanceLabel: 'Attendance',
      targetLabel: 'Target: 75%+',
      attendedLabel: 'Attended',
      attendedSubtitle: 'Completed classes attended',
      missedLabel: 'Missed',
      missedSubtitle: 'Completed classes missed',
      cancelledLabel: 'Cancelled',
      cancelledSubtitle: 'Safely excluded from stats',
    },
    streak: {
      sectionTitle: 'Attendance Streak',
      currentStreakLabel: 'Current streak',
      consecutiveSuffix: 'consecutive classes',
      explanation:
        'Attend every scheduled class to keep the streak alive. Cancelled classes do not break your streak. Missing a scheduled class resets it.',
      currentRow: 'Current',
      longestRow: 'Longest',
      classesSuffix: 'classes',
      statusRow: 'Status',
      statusSafe: 'Safe',
      statusLow: 'Low',
    },
    week: {
      sectionTitle: 'Weekly attendance',
      sectionSubtitle:
        'Review every scheduled class for the selected week.',
      todayBadge: 'Today',
      noClassesScheduled: 'No classes scheduled',
      showLess: 'Show less',
      showWeekend: (count) => `Show weekend · ${count} more days`,
      weekDaysLong: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      weekDaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    status: {
      cancelledSafe: 'Cancelled · Safe',
      attended: 'Attended',
      missed: 'Missed',
      upcoming: 'Upcoming',
    },
    empty: {
      noClassesTitle: 'No classes yet',
      noClassesSubtitle:
        'Join a class to start tracking your attendance.',
    },
  },
};

export default EN;