export interface HeaderStrings {
  brand: string;
  syncSynced: string;
  syncPending: string;
  console: string;
}

export interface NavStrings {
  today: string;
  timetable: string;
  attendance: string;
  class: string;
  profile: string;
}

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

export interface ConfirmStrings {
  transferOwnershipToOne: (name: string) => string;
}

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

export interface ProfileStrings {
  roleFallback: string;
  studentFallback: string;
  settingsButton: string;
  logoutButton: string;
}

export interface NotificationsHeaderStrings {
  backTitle: string;
  title: string;
  subtitle: string;
  refreshButton: string;
  refreshingButton: string;
}

export interface NotificationsEmptyStrings {
  title: string;
  subtitle: string;
}

export interface NotificationsCardStrings {
  labelCancelled: string;
  labelUrgent: string;
  labelVenueChanged: string;
  labelInfo: string;
  labelSponsored: string;
  labelAdSpace: string;
  sponsoredSpotlight: string;
  byLabel: string;
  teamLabel: string;
  agreedButton: (count: number) => string;
  agreeButton: (count: number) => string;
  adLearnMore: string;
  pollSectionLabel: string;
  pollResponseRegistered: string;
  pollResponseRecorded: string;
  pollSelected: string;
  pollYourResponse: string;
  pollLineCounter: (current: number, max: number) => string;
  pollTextareaPlaceholder: string;
  pollSubmitResponse: string;
  pollSubmitAnswer: string;
  pollDefaultYes: string;
  pollDefaultNo: string;
}

export interface NotificationsRepStrings {
  title: string;
  subtitle: string;
  textareaPlaceholder: string;
  counterLabel: (current: number, max: number) => string;
  visibleToMembers: string;
  postButton: string;
  postingButton: string;
  successMessage: string;
}

export interface NotificationsStrings {
  header: NotificationsHeaderStrings;
  empty: NotificationsEmptyStrings;
  card: NotificationsCardStrings;
  rep: NotificationsRepStrings;
}

export interface HomeHeaderStrings {
  todayLabel: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  nameFallback: string;
  openNotifications: string;
}

export interface HomeNextClassStrings {
  liveClassLabel: string;
  nextClassLabel: string;
  fallbackClassName: string;
  noMoreClassesTitle: string;
  noMoreClassesSubtitle: string;
  liveCountdown: (minutes: number) => string;
  startsInHours: (hours: number, minutes: number) => string;
  startsInMinutes: (minutes: number) => string;
  noMoreClassesToday: string;
}

export interface HomeScheduleStrings {
  sectionTitle: string;
  sectionSubtitle: string;
  refreshing: string;
  refresh: string;
  emptyTitle: string;
  emptySubtitle: string;
  fallbackClassName: string;
  liveBadge: string;
  cancelledBadge: string;
  presentButton: string;
  markButton: string;
}

export interface HomeAttendanceStrings {
  sectionLabel: string;
  attendedCount: (count: number) => string;
  totalCount: (count: number) => string;
}

export interface HomeUpdatesStrings {
  sectionTitle: string;
  showLess: string;
  viewAll: string;
  noUpdates: string;
  reacted: string;
  acknowledge: string;
  labelCancelled: string;
  labelVenueChanged: string;
  labelGlobal: string;
  labelClassUpdate: string;
}

export interface HomeRepStrings {
  title: string;
  subtitle: string;
  textareaPlaceholder: string;
  sending: string;
  broadcast: string;
  successMessage: string;
}

export interface HomeAdStrings {
  sponsoredLabel: string;
  altFallback: string;
}

export interface HomeStrings {
  header: HomeHeaderStrings;
  nextClass: HomeNextClassStrings;
  schedule: HomeScheduleStrings;
  attendance: HomeAttendanceStrings;
  updates: HomeUpdatesStrings;
  rep: HomeRepStrings;
  ad: HomeAdStrings;
}

export interface TimetableHeaderStrings {
  sectionLabel: string;
  title: string;
  noClassSelected: string;
  weekButton: string;
  addClassButton: string;
}

export interface TimetablePermissionStrings {
  managerPrefix: string;
  managerSuffix: string;
  memberPrefix: string;
  memberMiddle: string;
  memberSuffix: string;
}

export interface TimetableEmptyStrings {
  noClassTitle: string;
  noClassSubtitle: string;
  emptyTitle: string;
  emptySubtitle: string;
  addFirstClassButton: string;
  nothingScheduledTitle: string;
  nothingScheduledSubtitle: string;
}

export interface TimetableDayStrings {
  labels: string[];
  short: string[];
}

export interface TimetableEntryCardStrings {
  cancelledBadge: string;
  roomShiftedBadge: string;
  originallyLabel: string;
  minutesSuffix: string;
  editButton: string;
  deleteButton: string;
}

export interface TimetableFormStrings {
  newClassEyebrow: string;
  editClassEyebrow: string;
  addTitle: string;
  editTitle: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  dayLabel: string;
  venueLabel: string;
  venuePlaceholder: string;
  startsLabel: string;
  endsLabel: string;
  cancelClassTitle: string;
  cancelClassSubtitle: string;
  cancelButton: string;
  saveChangesButton: string;
  addClassButton: string;
  errorSubjectRequired: string;
  errorVenueRequired: string;
  errorTimeOrder: string;
}

export interface TimetableDeleteStrings {
  title: string;
  descriptionPrefix: string;
  descriptionSuffix: string;
  keepButton: string;
  removeButton: string;
}

export interface TimetableStrings {
  header: TimetableHeaderStrings;
  permission: TimetablePermissionStrings;
  empty: TimetableEmptyStrings;
  days: TimetableDayStrings;
  entryCard: TimetableEntryCardStrings;
  form: TimetableFormStrings;
  deleteDialog: TimetableDeleteStrings;
}

export interface AttendanceHeaderStrings {
  sectionLabel: string;
  title: string;
  subtitle: string;
  statusSafe: string;
  statusNeedsAttention: string;
}

export interface AttendanceSummaryStrings {
  attendanceLabel: string;
  targetLabel: string;
  attendedLabel: string;
  attendedSubtitle: string;
  missedLabel: string;
  missedSubtitle: string;
  cancelledLabel: string;
  cancelledSubtitle: string;
}

export interface AttendanceStreakStrings {
  sectionTitle: string;
  currentStreakLabel: string;
  consecutiveSuffix: string;
  explanation: string;
  currentRow: string;
  longestRow: string;
  classesSuffix: string;
  statusRow: string;
  statusSafe: string;
  statusLow: string;
}

export interface AttendanceWeekStrings {
  sectionTitle: string;
  sectionSubtitle: string;
  todayBadge: string;
  noClassesScheduled: string;
  showLess: string;
  showWeekend: (count: number) => string;
  weekDaysLong: string[];
  weekDaysShort: string[];
}

export interface AttendanceStatusStrings {
  cancelledSafe: string;
  attended: string;
  missed: string;
  upcoming: string;
}

export interface AttendanceEmptyStrings {
  noClassesTitle: string;
  noClassesSubtitle: string;
}

export interface AttendanceStrings {
  header: AttendanceHeaderStrings;
  summary: AttendanceSummaryStrings;
  streak: AttendanceStreakStrings;
  week: AttendanceWeekStrings;
  status: AttendanceStatusStrings;
  empty: AttendanceEmptyStrings;
}

export interface AppStrings {
  header: HeaderStrings;
  nav: NavStrings;
  toast: ToastStrings;
  confirm: ConfirmStrings;
  broadcast: BroadcastStrings;
  profile: ProfileStrings;
  notifications: NotificationsStrings;
  home: HomeStrings;
  timetable: TimetableStrings;
  attendance: AttendanceStrings;
}