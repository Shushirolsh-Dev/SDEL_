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

export interface AppStrings {
  header: HeaderStrings;
  nav: NavStrings;
  toast: ToastStrings;
  confirm: ConfirmStrings;
  broadcast: BroadcastStrings;
}