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
      startsInHours: (hours, minutes) =>
        `Starts in ${hours}h ${minutes}m`,
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
      edited: 'Edited',
      editBroadcast: 'Edit broadcast',
      deleteBroadcast: 'Delete broadcast',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      deleteBroadcastTitle: 'Delete this broadcast?',
      deleteBroadcastMessage: 'This cannot be undone.',
      dateLocale: 'en-US',
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
      managerSuffix:
        'privileges. You can manage the shared timetable.',
      memberPrefix: 'You are viewing this timetable as a',
      memberMiddle: 'member',
      memberSuffix:
        '. Only class managers can modify entries.',
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
      sectionLabel: 'Class',
      title: 'Class',
      backButton: 'Back',
    },
    empty: {
      title: 'No class selected',
      subtitle:
        'Select a class to view its members and details.',
    },
    info: {
      classCode: 'Class code',
      members: 'Members',
      representative: 'Representative',
      assistant: 'Assistant',
      member: 'Member',
    },
    actions: {
      joinClass: 'Join class',
      createClass: 'Create class',
      leaveClass: 'Leave class',
      transferOwnership: 'Transfer ownership',
      promote: 'Promote',
      demote: 'Demote',
      remove: 'Remove',
    },
    join: {
      title: 'Join a class',
      subtitle: 'Enter the class code provided by your representative.',
      placeholder: 'Enter class code',
      button: 'Join class',
      loading: 'Joining...',
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
      lightTitle: 'Light',
      lightSubtitle: 'Always use light mode',
      darkTitle: 'Dark',
      darkSubtitle: 'Always use dark mode',
    },

    language: {
      sectionLabel: 'Preferences',
      title: 'Language',
      dropdownLabel: 'Display language',
      hint: 'The interface will display in this language across the app.',
    },

    notifications: {
      sectionLabel: 'Preferences',
      title: 'Notifications',
      description: 'Get important THESDEL updates on this device.',
      enable: 'Enable notifications',
      enabled: 'Notifications enabled',
    },

    visibility: {
      sectionLabel: 'Privacy',
      title: 'Class visibility',
      description:
        'Control whether your classes can be discovered by other students.',
      publicTitle: 'Public',
      publicSubtitle: 'Students can discover this class.',
      privateTitle: 'Private',
      privateSubtitle: 'Only students with the class code can join.',
      globalTitle: 'Apply to all classes',
      globalDescription:
        'Change the visibility of all classes you own.',
      publicButton: 'Make all public',
      privateButton: 'Make all private',
      updating: 'Updating...',
      alertToggleFailed: (message) =>
        `Failed to update visibility: ${message}`,
      alertGlobalEmpty: 'You do not own any classes.',
      alertGlobalConfirm: (visibility) =>
        `Make all your classes ${visibility}?`,
      alertGlobalSuccess: (visibility) =>
        `All your classes are now ${visibility}.`,
      alertGlobalFailed: (message) =>
        `Failed to update class visibility: ${message}`,
    },

    danger: {
      sectionLabel: 'Danger zone',
      title: 'Delete account',
      description:
        'Permanently delete your account and associated data.',
      button: 'Delete account',
    },

    deleteModal: {
      title: 'Delete account',
      description:
        'This action is permanent and cannot be undone.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      confirmLabel:
        'I understand that my account and data will be permanently deleted.',
      cancelButton: 'Cancel',
      deleteButton: 'Delete account',
      deletingButton: 'Deleting...',
      errorPasswordRequired: 'Please enter your password.',
      errorConfirmRequired:
        'Please confirm that you understand this action.',
      errorPasswordIncorrect: 'Incorrect password.',
      errorProfileDelete: 'Failed to delete your profile.',
      errorAuthDelete: 'Failed to delete your authentication account.',
      errorGeneric: 'Something went wrong. Please try again.',
    },

    footer: {
      title: 'Settings',
      subtitle: 'Manage your account and preferences.',
    },
  },

  landing: {
    header: {
      brand: 'THESDEL',
      signIn: 'Sign in',
      joinFree: 'Join free',
      installApp: 'Install app',
      backToLogin: 'Back to login',
      backToHome: 'Back to home',
    },
    hero: {
      badge: 'Built for students',
      replacesLabel: 'Replaces',
      headlinePrefix: 'Your student life,',
      headlineSuffix: 'organized.',
      subtitle:
        'Manage your classes, timetable, attendance, and academic life in one place.',
      ctaPrimary: 'Get started',
      ctaSecondary: 'Sign in',
      replacesWords: [
        'spreadsheets',
        'WhatsApp groups',
        'paper notes',
      ],
    },
    features: {
      sectionLabel: 'How it works',
      sectionTitle: 'Everything students need.',
      step1Title: 'Join your class',
      step1Body:
        'Use your class code to join your academic community.',
      step2Title: 'Stay organized',
      step2Body:
        'Keep your timetable and attendance in one place.',
      step3Title: 'Stay informed',
      step3Body:
        'Get important class announcements and updates.',
    },
    footer: {
      builtBy: 'Built for students',
      terms: 'Terms',
      privacy: 'Privacy',
      about: 'About',
      linksTagline: 'Learn. Grow. Become.',
      brandMark: 'THESDEL',
      descriptor: 'The Student Digital Exchange Layer',
    },
    login: {
      topMarker: 'WELCOME BACK',
      title: 'Sign in',
      subtitle: 'Continue to your student workspace.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotLink: 'Forgot password?',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      submitIdle: 'Sign in',
      submitLoading: 'Signing in...',
      newTo: 'New to THESDEL?',
      createAccount: 'Create an account',
      footnote: 'Your student workspace, in one place.',
      emptyFieldsError: 'Please enter your email and password.',
      fallbackProfileError:
        'Could not load your profile. Please try again.',
      genericError: 'Unable to sign in. Please try again.',
      close: 'Close',
    },
    forgot: {
      topMarker: 'ACCOUNT RECOVERY',
      title: 'Forgot password?',
      subtitle:
        'Enter your email and we will send you a password reset link.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      submitIdle: 'Send reset link',
      submitLoading: 'Sending...',
      backToSignIn: 'Back to sign in',
      successTitle: 'Check your email',
      successBodyPrefix:
        'We sent a password reset link to',
      successBodySuffix: '.',
      returnToSignIn: 'Return to sign in',
      footnote: 'Your student workspace, in one place.',
      emptyEmailError: 'Please enter your email.',
      genericError:
        'Unable to send the reset email. Please try again.',
      close: 'Close',
    },
    signup: {
      topMarker: 'CREATE ACCOUNT',
      title: 'Join THESDEL',
      subtitle:
        'Create your student account and get started.',
      sectionIdentity: 'Identity',
      sectionContact: 'Contact',
      sectionRole: 'Role',
      sectionSecurity: 'Security',
      nameLabel: 'Full name',
      namePlaceholder: 'Your full name',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Choose a username',
      usernameChecking: 'Checking...',
      usernameAvailable: 'Username available',
      usernameUnavailable: 'Username unavailable',
      usernameHint:
        'Use 3–20 characters with letters, numbers, and underscores.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      phoneLabel: 'Phone number',
      phonePlaceholder: 'Phone number',
      phoneHint: 'Use a valid phone number.',
      phoneChecking: 'Checking...',
      phoneAvailable: 'Phone number available',
      phoneUnavailable: 'Phone number already registered',
      roleQuestion: 'What is your role?',
      roleStudentTitle: 'Student',
      roleStudentBody: 'Join classes and manage your academic life.',
      roleRepTitle: 'Class representative',
      roleRepBody:
        'Manage your class and keep members informed.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a password',
      passwordHint: 'Use a strong password.',
      passwordProtected: 'Your password is securely protected.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      termsPrefix: 'I agree to the',
      termsOfService: 'Terms of Service',
      termsConjunction: 'and',
      privacyPolicy: 'Privacy Policy',
      termsSuffix: '.',
      submitIdle: 'Create account',
      submitLoading: 'Creating account...',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      footnote: 'Your student workspace, in one place.',
      errorAllRequired: 'Please complete all required fields.',
      errorUsernameFormat: 'Invalid username format.',
      errorUsernameTaken: 'Username is already taken.',
      errorPhoneInvalid: 'Invalid phone number.',
      errorPhoneTaken: 'Phone number is already registered.',
      errorTermsRequired:
        'You must agree to the Terms of Service and Privacy Policy.',
      errorEmailRegistered:
        'An account with this email already exists.',
      errorProfileCreate:
        'Unable to create your profile. Please try again.',
      errorDuplicate:
        'An account with these details already exists.',
      errorGenericRegistration:
        'Unable to create your account. Please try again.',
      captchaLabel: 'Verification',
      captchaQuestion: (a, b) => `What is ${a} + ${b}?`,
      captchaPlaceholder: 'Answer',
      captchaNewQuestion: 'New question',
      errorCaptchaRequired: 'Please answer the verification question.',
      errorCaptchaIncorrect: 'Incorrect answer.',
      errorRateLimited:
        'Too many attempts. Please wait and try again.',
    },
    legal: {
      terms: {
        eyebrow: 'LEGAL',
        title: 'Terms of Service',
        description:
          'Please review the terms that govern your use of THESDEL.',
        footerLabel: 'THESDEL',
        buttonLabel: 'Back',
        sections: [],
      },
      privacy: {
        eyebrow: 'LEGAL',
        title: 'Privacy Policy',
        description:
          'Learn how THESDEL handles your information.',
        footerLabel: 'THESDEL',
        buttonLabel: 'Back',
        sections: [],
      },
      about: {
        eyebrow: 'ABOUT',
        title: 'About THESDEL',
        description:
          'The Student Digital Exchange Layer.',
        footerLabel: 'THESDEL',
        buttonLabel: 'Back',
        sections: [],
      },
    },
  },
};

export default EN;
