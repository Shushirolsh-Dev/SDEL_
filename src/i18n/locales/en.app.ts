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
  class: {
    header: {
      eyebrow: 'Class spaces',
      title: 'Your classes',
      subtitle:
        'Manage your class spaces, members, access and class codes.',
      tabMyClasses: 'My classes',
      tabCreateClass: 'Create class',
      emptyTitle: 'No classes yet',
      emptySubtitle:
        'Join an existing class with a class code or create a new class space.',
      emptyJoinButton: 'Join a class',
      emptyCreateButton: 'Create a class',
    },
    sidebar: {
      sectionLabel: 'Classes',
      membersSuffix: 'members',
      joinAnother: 'Join another class',
    },
    overview: {
      badgeClassSpace: 'Class space',
      badgeRepresentative: 'Representative',
      noDescription: 'No class description has been added yet.',
      visibilityPublic: 'Public',
      visibilityPrivate: 'Private',
      classCodeLabel: 'Class code',
      copyCodeTitle: 'Copy class code',
      membersLabel: 'Members',
      studentsSubtitle: 'students in this class',
    },
    requests: {
      joinRequestsTitle: 'Join requests',
      joinRequestsSubtitle:
        'Review students waiting to enter this class.',
      waitingForApproval: 'Waiting for approval',
      approveButton: 'Approve',
      denyButton: 'Deny',
      removalRequestsTitle: 'Removal requests',
      removalRequestsSubtitle:
        'Review requests to remove members.',
      memberRemovalRequested: 'Member removal requested',
      rejectButton: 'Reject',
    },
    members: {
      title: 'Members',
      subtitle: 'Students currently inside this class.',
      youBadge: 'You',
      roleRepresentative: 'Representative',
      roleAssistant: 'Assistant',
      roleMember: 'Member',
      demoteButton: 'Demote',
      promoteButton: 'Make assistant',
      removeButton: 'Remove',
      requestRemovalButton: 'Request removal',
      emptyMessage: 'No members yet.',
    },
    management: {
      title: 'Class management',
      subtitle: 'Manage access, ownership, and this class.',
      classCodeTitle: 'Class code',
      classCodeSubtitle:
        'Regenerate the code if it has been shared too widely.',
      regenerateButton: 'Regenerate',
      transferTitle: 'Transfer ownership',
      transferSubtitle:
        'Give another administrator ownership of this class.',
      transferButton: 'Transfer',
      leaveTitle: 'Leave class',
      leaveSubtitle: 'Remove yourself from this class.',
      leavingButton: 'Leaving...',
      leaveButton: 'Leave',
      deleteTitle: 'Delete class',
      deleteSubtitle:
        'Permanently remove this class and its membership.',
      deleteButton: 'Delete',
    },
    modals: {
      loadingCreating: 'Creating class',
      loadingJoining: 'Joining class',
      loadingUpdating: 'Updating class',
      loadingFallback: 'Please wait...',

      transferTitle: 'Transfer ownership',
      transferSubtitle:
        'Select an assistant to become the new owner.',
      cancelButton: 'Cancel',
      transferConfirmButton: 'Transfer',

      confirmDeleteTitle: 'Delete class?',
      confirmRegenerateTitle: 'Regenerate class code?',
      confirmRejectJoinTitle: 'Reject join request?',
      confirmRemoveMemberTitle: 'Remove member?',
      confirmRequestRemovalTitle: 'Request member removal?',

      confirmDeleteBody: (className) =>
        `This will permanently delete "${className}". This action cannot be undone.`,
      confirmRegenerateBody: (className) =>
        `The current code for "${className}" will stop working and a new code will be generated.`,
      confirmRejectJoinBody: (userName) =>
        `${userName}'s request to join this class will be rejected.`,
      confirmRemoveMemberBody: (memberName) =>
        `${memberName} will be removed from this class.`,
      confirmRequestRemovalBody: (memberName) =>
        `${memberName} will receive a removal request for this class.`,

      confirmDeleteButton: 'Delete',
      confirmRegenerateButton: 'Regenerate',
      confirmRejectButton: 'Reject',
      confirmRemoveButton: 'Remove',
      confirmRequestRemovalButton: 'Request removal',
    },
    join: {
      eyebrow: 'Join class',
      title: 'Enter a class code',
      subtitle:
        'Use the code provided by the class owner or representative.',
      classCodeLabel: 'Class code',
      classCodePlaceholder: 'Enter class code',
      verificationLabel: 'Verification',
      captchaQuestion: (a, b) => `Solve: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Answer',
      newQuestionButton: 'New question',
      emptyCodeError: 'Enter a class code.',
      incorrectCaptchaError: 'Incorrect answer.',
      joiningButton: 'Joining...',
      joinButton: 'Join class',
    },
    create: {
      eyebrow: 'Create class',
      title: 'Create a new class',
      subtitle:
        'Set up a space for your class, department, or study group.',
      nameLabel: 'Class name',
      namePlaceholder: 'e.g. MTH 102',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'What is this class for?',
      visibilityLabel: 'Visibility',
      visibilityPublicTitle: 'Public',
      visibilityPublicSubtitle:
        'Anyone with the class code can request to join.',
      visibilityPrivateTitle: 'Private',
      visibilityPrivateSubtitle:
        'Only people you approve can join this class.',
      verificationLabel: 'Verification',
      captchaQuestion: (a, b) => `Solve: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Answer',
      newQuestionButton: 'New question',
      emptyNameError: 'Enter a class name.',
      incorrectCaptchaError: 'Incorrect answer.',
      creatingButton: 'Creating...',
      createButton: 'Create class',
      createdWithCode: (code) => `Class created. Code: ${code}`,
      createdSuccess: 'Class created successfully.',
    },
    toast: {
      joiningClass: 'Joining class...',
      creatingClass: 'Creating class...',
      generatingCode: 'Generating new class code...',
      unableToJoin: 'Unable to join class.',
      unableToCreate: 'Unable to create class.',
      unableToRegenerate: 'Unable to regenerate class code.',
      joinApproved: 'Join request approved.',
      joinRejected: 'Join request rejected.',
      unableToApproveJoin: 'Unable to approve join request.',
      unableToRejectJoin: 'Unable to reject join request.',
      unableToCopyCode: 'Unable to copy class code.',
      leftClass: 'You left the class.',
      classDeleted: 'Class deleted.',
      memberRemoved: (name) => `${name} was removed.`,
      removalRequestSubmitted: 'Removal request submitted.',
      removalApproved: 'Removal approved.',
      removalRequestRejected: 'Removal request rejected.',
      nowAssistant: (name) => `${name} is now an assistant.`,
      nowMember: (name) => `${name} is now a member.`,
      ownershipTransferred: 'Ownership transferred.',
      unableToTransfer: 'Unable to transfer ownership.',
    },
  },
  settings: {
    header: {
      backButton: 'Profile',
      eyebrow: 'Account',
      title: 'Settings',
      subtitle: 'Manage your preferences and class controls.',
    },
    theme: {
      sectionLabel: 'Appearance',
      sectionTitle: 'Theme',
      systemTitle: 'System',
      systemSubtitle: 'Follow your device',
      darkTitle: 'Dark',
      darkSubtitle: 'Always use dark mode',
    },
    language: {
      sectionLabel: 'Preferences',
      title: 'Language',
      dropdownLabel: 'Display language',
      hint: 'The interface will display in this language across the app.',
    },
    visibility: {
      sectionLabel: 'Class management',
      title: 'Class visibility',
      subtitle:
        'Control whether students can join your classes immediately or require approval.',
      applyAllTitle: 'Apply to all classes',
      applyAllSubtitle: 'Change every class you own at once.',
      publicButton: 'Public',
      privateButton: 'Private',
      yourClassesLabel: 'Your classes',
      classSingular: 'class',
      classPlural: 'classes',
      emptyTitle: 'No classes owned yet.',
      emptySubtitle: 'Classes you create will appear here.',
      joinCodeLabel: 'Join code ·',
            updatingButton: 'Updating',
      makePrivateButton: 'Make private',
      makePublicButton: 'Make public',
      alertGlobalEmpty:
        'You do not own any classes to apply global visibility settings.',
      alertGlobalConfirm: (visibility) =>
        `Are you sure you want to change all your owned classes to ${visibility}?`,
      alertGlobalSuccess: (visibility) =>
        `Success: All your owned classes are now ${visibility}.`,
      alertGlobalFailed: (message) =>
        `Failed to apply global visibility: ${message}`,
      alertToggleFailed: (message) =>
        `Failed to update visibility: ${message}`,
    },
    danger: {
      sectionLabel: 'Account',
      title: 'Danger zone',
      deleteTitle: 'Delete your account',
      deleteSubtitle:
        'Permanently remove your account, classes, memberships, attendance records and related data.',
      deleteButton: 'Delete account',
    },
    deleteModal: {
      eyebrow: 'Permanent action',
      title: 'Delete account?',
      subtitle:
        'This action cannot be undone. Your account and associated data will be permanently deleted.',
      passwordLabel: 'Confirm with password',
      passwordPlaceholder: 'Enter your password',
      confirmLabel:
        'I understand that deleting my account is permanent and cannot be undone.',
      cancelButton: 'Cancel',
      deleteButton: 'Delete permanently',
      deletingButton: 'Deleting',
      errorPasswordRequired:
        'Please enter your password to authorize this action.',
      errorConfirmRequired:
        'You must check the confirmation box to proceed.',
      errorPasswordIncorrect:
        'Password verification failed. Please enter your correct current password.',
      errorProfileDelete:
        'Failed to delete profile. Please contact support.',
      errorAuthDelete:
        'Failed to delete auth user. Please contact support.',
      errorGeneric:
        'An unexpected error occurred during account deletion.',
    },
    footer: {
      title: 'Settings',
      subtitle: 'Manage your account and preferences.',
    },
  },
};

export default EN;