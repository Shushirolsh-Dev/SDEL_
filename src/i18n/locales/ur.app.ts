import type { AppStrings } from '../types.app';

export const meta = {
  code: 'ur',
  nativeName: 'اردو',
};

const UR: AppStrings = {
  header: {
    brand: 'THESDEL',
    syncSynced: 'ہم وقت',
    syncPending: 'ہم وقت ہو رہا ہے:',
    console: 'کنسول',
  },

  nav: {
    today: 'آج',
    timetable: 'ٹائم ٹیبل',
    attendance: 'حاضری',
    class: 'کلاس',
    profile: 'پروفائل',
  },

  toast: {
    classCodeNotFound: (code) => `کلاس کوڈ "${code}" نہیں ملا۔`,
    alreadyJoined:
      'آپ پہلے ہی اس کلاس میں شامل ہو چکے ہیں یا شامل ہونے کی درخواست بھیج چکے ہیں۔',
    errorJoining: (message) => `کلاس میں شامل ہونے میں خرابی: ${message}`,
    requestSubmitted:
      'آپ کی کلاس میں داخلے کی درخواست منظوری کے لیے بھیج دی گئی ہے۔',
    enrolledSuccess: (className) =>
      `"${className}" میں کامیابی سے داخلہ ہو گیا!`,
    joinApproved: 'طالب علم کے شامل ہونے کی درخواست منظور ہو گئی!',
    joinDenied: 'طالب علم کے شامل ہونے کی درخواست مسترد کر دی گئی۔',
    removalRequestSent:
      'رکن کو ہٹانے کی درخواست کلاس نمائندے کو بھیج دی گئی ہے۔',
    memberRemoved: 'رکن کامیابی سے ہٹا دیا گیا۔',
    removalApproved: 'رکن کو ہٹانے کی درخواست منظور ہو گئی۔',
    removalRejected: 'رکن کو ہٹانے کی درخواست مسترد کر دی گئی۔',
    codeChanged: (code) => `کلاس کوڈ تبدیل کر کے ${code} کر دیا گیا۔`,
    attendanceMarked: 'حاضری درج کر دی گئی!',
    timetableAdded: 'ٹائم ٹیبل میں کلاس شامل کر دی گئی!',
    timetableUpdated: 'ٹائم ٹیبل کی کلاس اپ ڈیٹ کر دی گئی!',
    timetableDeleted: 'ٹائم ٹیبل کی کلاس حذف کر دی گئی۔',
    memberPromoted: 'رکن کو اسسٹنٹ بنا دیا گیا!',
    assistantDemoted: 'اسسٹنٹ کو دوبارہ رکن بنا دیا گیا۔',
    classDeleted: 'کلاس کامیابی سے حذف کر دی گئی۔',
    mustBeLoggedIn:
      'کلاس چھوڑنے کے لیے آپ کا لاگ اِن ہونا ضروری ہے۔',
    cannotLeaveAsRep:
      'آپ کلاس کے نمائندے ہیں۔ پہلے کلاس حذف کریں یا کسی کو اسسٹنٹ بنا کر ملکیت منتقل کریں۔',
    selectAssistantToTransfer:
      'ملکیت منتقل کرنے کے لیے ایک اسسٹنٹ منتخب کریں۔',
    leaveFailed:
      'کلاس چھوڑنے میں ناکامی ہوئی۔ دوبارہ کوشش کریں۔',
    leftClass:
      'آپ کامیابی سے کلاس چھوڑ چکے ہیں۔',
    transferFailed:
      'ملکیت منتقل کرنے میں ناکامی ہوئی۔ دوبارہ کوشش کریں۔',
    roleUpdateFailed:
      'کردار اپ ڈیٹ کرنے میں ناکامی ہوئی۔ دوبارہ کوشش کریں۔',
    roleUpdateFailedSelf:
      'آپ کا کردار اپ ڈیٹ کرنے میں ناکامی ہوئی۔ دوبارہ کوشش کریں۔',
    ownershipTransferred: (name) =>
      `ملکیت ${name} کو منتقل کر دی گئی۔ اب آپ ایک رکن ہیں۔`,
    leaveAfterTransferFailed:
      'ملکیت منتقل ہو گئی، لیکن کلاس چھوڑنے میں ناکامی ہوئی۔ دوبارہ کلاس چھوڑنے کی کوشش کریں۔',
    leftAfterTransfer:
      'ملکیت منتقل کرنے کے بعد آپ کامیابی سے کلاس چھوڑ چکے ہیں۔',
  },

  confirm: {
    transferOwnershipToOne: (name) =>
      `آپ کلاس کے نمائندے ہیں۔ کیا آپ ملکیت ${name} کو منتقل کر کے کلاس چھوڑنا چاہتے ہیں؟`,
  },

  broadcast: {
    classRepMarker: 'کلاس نمائندہ',
    classCreated: (name, author, code) =>
      `کلاس "${name}" نمائندہ ${author} نے بنائی ہے۔ منفرد کوڈ: ${code}`,
    entryAdded: (subject, day, startTime) =>
      `ٹائم ٹیبل میں شامل کیا گیا: ${subject}، ${day} کو ${startTime} بجے۔`,
    venueChanged: (subject, from, to) =>
      `${subject} کی کلاس ${from} سے ${to} میں منتقل کر دی گئی۔`,
    classCancelled: (subject) =>
      `${subject} کی کلاس باضابطہ طور پر منسوخ کر دی گئی (اسٹریک محفوظ ہے)۔`,
    cancellationReverted: (subject) =>
      `${subject} کی کلاس کی منسوخی واپس لے لی گئی۔`,
    entryDeleted: (subject) =>
      `${subject} کا شیڈول ٹائم ٹیبل سے مستقل طور پر حذف کر دیا گیا۔`,
    dayNames: [
      'پیر',
      'منگل',
      'بدھ',
      'جمعرات',
      'جمعہ',
      'ہفتہ',
      'اتوار',
    ],
  },

  profile: {
    roleFallback: 'طالب علم',
    studentFallback: 'طالب علم',
    settingsButton: 'ترتیبات',
    logoutButton: 'لاگ آؤٹ',
  },

  notifications: {
    header: {
      backTitle: 'واپس',
      title: 'اطلاعات',
      subtitle: 'کلاس کے اعلانات اور اپ ڈیٹس',
      refreshButton: 'ریفریش',
      refreshingButton: 'ریفریش ہو رہا ہے',
    },

    empty: {
      title: 'کچھ نیا نہیں',
      subtitle:
        'سرکاری اعلانات اور اہم کلاس اپ ڈیٹس یہاں ظاہر ہوں گی۔',
    },

    card: {
      labelCancelled: 'منسوخ',
      labelUrgent: 'فوری',
      labelVenueChanged: 'جگہ تبدیل',
      labelInfo: 'معلومات',
      labelSponsored: 'اسپانسر شدہ',
      labelAdSpace: 'اشتہاری جگہ',
      sponsoredSpotlight: 'اسپانسر شدہ نمایاں اطلاع',
      byLabel: 'از طرف',
      teamLabel: 'THESDEL ٹیم',
      agreedButton: (count) => `متفق · ${count}`,
      agreeButton: (count) => `اتفاق کریں · ${count}`,
      adLearnMore: 'مزید جانیں',
      pollSectionLabel: 'کلاس پول',
      pollResponseRegistered: 'جواب درج ہو گیا',
      pollResponseRecorded: 'آپ کا جواب درج کر لیا گیا ہے۔',
      pollSelected: 'منتخب:',
      pollYourResponse: 'آپ کا جواب',
      pollLineCounter: (current, max) =>
        `${current}/${max} لائنیں`,
      pollTextareaPlaceholder: 'اپنا جواب لکھیں...',
      pollSubmitResponse: 'جواب جمع کریں',
      pollSubmitAnswer: 'جواب جمع کریں',
      pollDefaultYes: 'ہاں',
      pollDefaultNo: 'نہیں',
    },

    rep: {
      title: 'نمائندے کا اعلان',
      subtitle: 'اپنی کلاس کو سرکاری اپ ڈیٹ بھیجیں',
      textareaPlaceholder:
        'مطالعے کی تجویز، یاد دہانی، شیڈول میں تبدیلی یا اہم کلاس اطلاع شیئر کریں...',
      counterLabel: (current, max) => `${current}/${max}`,
      visibleToMembers: 'کلاس کے اراکین کو نظر آئے گا',
      postButton: 'اعلان پوسٹ کریں',
      postingButton: 'پوسٹ ہو رہا ہے',
      successMessage: 'اعلان کامیابی سے پوسٹ ہو گیا',
    },
  },

  home: {
    header: {
      todayLabel: 'آج',
      greetingMorning: 'صبح بخیر',
      greetingAfternoon: 'دوپہر بخیر',
      greetingEvening: 'شام بخیر',
      nameFallback: 'طالب علم',
      openNotifications: 'اطلاعات کھولیں',
    },

    nextClass: {
      liveClassLabel: 'جاری کلاس',
      nextClassLabel: 'اگلی کلاس',
      fallbackClassName: 'کلاس',
      noMoreClassesTitle: 'مزید کوئی کلاس نہیں',
      noMoreClassesSubtitle: 'آپ کا تعلیمی دن مکمل ہو گیا ہے۔',
      liveCountdown: (minutes) =>
        `ابھی جاری ہے · ${minutes} منٹ باقی`,
      startsInHours: (hours, minutes) =>
        `${hours} گھنٹے ${minutes} منٹ میں شروع ہوگی`,
      startsInMinutes: (minutes) =>
        `${minutes} منٹ میں شروع ہوگی`,
      noMoreClassesToday: 'آج مزید کوئی کلاس نہیں',
    },

    schedule: {
      sectionTitle: 'آج',
      sectionSubtitle: 'آپ کا کلاس شیڈول',
      refreshing: 'ریفریش ہو رہا ہے...',
      refresh: 'ریفریش',
      emptyTitle: 'آج کوئی کلاس نہیں',
      emptySubtitle:
        'فارغ وقت سے لطف اٹھائیں یا آگے کی تیاری کریں۔',
      fallbackClassName: 'کلاس',
      liveBadge: 'جاری',
      cancelledBadge: 'منسوخ',
      presentButton: 'موجود',
      markButton: 'درج کریں',
    },

    attendance: {
      sectionLabel: 'حاضری',
      attendedCount: (count) => `${count} حاضر`,
      totalCount: (count) => `${count} کل`,
    },

    updates: {
      sectionTitle: 'اپ ڈیٹس',
      showLess: 'کم دکھائیں',
      viewAll: 'سب دیکھیں',
      noUpdates: 'ابھی کوئی اپ ڈیٹ نہیں۔',
      reacted: 'ردعمل دیا',
      acknowledge: 'تصدیق کریں',
      labelCancelled: 'منسوخ',
      labelVenueChanged: 'جگہ تبدیل',
      labelGlobal: 'عالمی',
      labelClassUpdate: 'کلاس اپ ڈیٹ',
      edited: 'ترمیم شدہ',
      editBroadcast: 'اعلان میں ترمیم کریں',
      deleteBroadcast: 'اعلان حذف کریں',
      cancel: 'منسوخ',
      save: 'محفوظ کریں',
      delete: 'حذف کریں',
      deleteBroadcastTitle: 'یہ اعلان حذف کریں؟',
      deleteBroadcastMessage: 'یہ عمل واپس نہیں کیا جا سکتا۔',
      dateLocale: 'ur-PK',
    },

    rep: {
      title: 'کلاس نمائندہ',
      subtitle: 'اپنی کلاس کو اعلان بھیجیں۔',
      textareaPlaceholder: 'اعلان لکھیں...',
      sending: 'بھیجا جا رہا ہے...',
      broadcast: 'اعلان',
      successMessage: 'اعلان کامیابی سے بھیج دیا گیا۔',
    },

    ad: {
      sponsoredLabel: 'اسپانسر شدہ',
      altFallback: 'اسپانسر شدہ',
    },
  },
  timetable: {
    header: {
      sectionLabel: 'تعلیمی شیڈول',
      title: 'ٹائم ٹیبل',
      noClassSelected: 'کوئی کلاس منتخب نہیں',
      weekButton: 'ہفتہ',
      addClassButton: 'کلاس شامل کریں',
    },

    permission: {
      managerPrefix: 'آپ کے پاس',
      managerSuffix:
        'اختیارات ہیں۔ آپ مشترکہ ٹائم ٹیبل کا انتظام کر سکتے ہیں۔',
      memberPrefix: 'آپ یہ ٹائم ٹیبل بطور',
      memberMiddle: 'رکن',
      memberSuffix:
        'دیکھ رہے ہیں۔ صرف کلاس مینیجرز اندراجات میں تبدیلی کر سکتے ہیں۔',
    },

    empty: {
      noClassTitle: 'ابھی کوئی کلاس نہیں',
      noClassSubtitle:
        'مشترکہ ٹائم ٹیبل دیکھنے کے لیے کسی کلاس میں شامل ہوں یا نئی کلاس بنائیں۔',
      emptyTitle: 'ٹائم ٹیبل خالی ہے',
      emptySubtitle:
        'اس کلاس گروپ کے لیے ابھی کوئی کلاس شیڈول نہیں کی گئی۔',
      addFirstClassButton: 'پہلی کلاس شامل کریں',
      nothingScheduledTitle: 'کچھ شیڈول نہیں',
      nothingScheduledSubtitle:
        'اس دن کے لیے کوئی کلاس شیڈول نہیں ہے۔',
    },

    days: {
      labels: [
        'پیر',
        'منگل',
        'بدھ',
        'جمعرات',
        'جمعہ',
        'ہفتہ',
        'اتوار',
      ],
      short: ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'],
    },

    entryCard: {
      cancelledBadge: 'منسوخ',
      roomShiftedBadge: 'کمرہ تبدیل',
      originallyLabel: 'اصل:',
      minutesSuffix: 'منٹ',
      editButton: 'ترمیم',
      deleteButton: 'حذف کریں',
    },

    form: {
      newClassEyebrow: 'نئی کلاس',
      editClassEyebrow: 'کلاس کا انتظام',
      addTitle: 'ٹائم ٹیبل میں کلاس شامل کریں',
      editTitle: 'ٹائم ٹیبل کی کلاس میں ترمیم کریں',
      subjectLabel: 'مضمون',
      subjectPlaceholder: 'مثلاً سافٹ ویئر انجینئرنگ',
      dayLabel: 'دن',
      venueLabel: 'جگہ',
      venuePlaceholder: 'مثلاً LT 1',
      startsLabel: 'شروع',
      endsLabel: 'اختتام',
      cancelClassTitle: 'کلاس منسوخ کریں',
      cancelClassSubtitle:
        'اندراج کو برقرار رکھتے ہوئے اسے منسوخ شدہ قرار دیں۔',
      cancelButton: 'منسوخ',
      saveChangesButton: 'تبدیلیاں محفوظ کریں',
      addClassButton: 'کلاس شامل کریں',
      errorSubjectRequired: 'مضمون کا نام ضروری ہے۔',
      errorVenueRequired: 'جگہ درج کرنا ضروری ہے۔',
      errorTimeOrder: 'شروع ہونے کا وقت اختتام کے وقت سے پہلے ہونا چاہیے۔',
    },

    deleteDialog: {
      title: 'یہ کلاس ہٹائیں؟',
      descriptionPrefix: 'آپ',
      descriptionSuffix:
        'کو مشترکہ ٹائم ٹیبل سے ہٹانے والے ہیں۔ یہ عمل واپس نہیں کیا جا سکتا۔',
      keepButton: 'کلاس برقرار رکھیں',
      removeButton: 'ہٹائیں',
    },
  },

  attendance: {
    header: {
      sectionLabel: 'تعلیمی ریکارڈ',
      title: 'حاضری',
      subtitle:
        'اپنی حاضری، اسٹریک اور مکمل کی گئی کلاسز کو ٹریک کریں۔',
      statusSafe: 'حاضری محفوظ',
      statusNeedsAttention: 'توجہ درکار ہے',
    },

    summary: {
      attendanceLabel: 'حاضری',
      targetLabel: 'ہدف: 75%+',
      attendedLabel: 'حاضر',
      attendedSubtitle: 'حاضر ہونے والی مکمل کلاسز',
      missedLabel: 'غیر حاضر',
      missedSubtitle: 'چھوڑی گئی مکمل کلاسز',
      cancelledLabel: 'منسوخ',
      cancelledSubtitle: 'اعداد و شمار سے محفوظ طور پر خارج',
    },

    streak: {
      sectionTitle: 'حاضری کی اسٹریک',
      currentStreakLabel: 'موجودہ اسٹریک',
      consecutiveSuffix: 'مسلسل کلاسز',
      explanation:
        'اسٹریک برقرار رکھنے کے لیے ہر مقررہ کلاس میں حاضر ہوں۔ منسوخ شدہ کلاسز اسٹریک نہیں توڑتیں۔ مقررہ کلاس میں غیر حاضری اسٹریک ختم کر دیتی ہے۔',
      currentRow: 'موجودہ',
      longestRow: 'طویل ترین',
      classesSuffix: 'کلاسز',
      statusRow: 'حالت',
      statusSafe: 'محفوظ',
      statusLow: 'کم',
    },

    week: {
      sectionTitle: 'ہفتہ وار حاضری',
      sectionSubtitle:
        'منتخب ہفتے کی ہر مقررہ کلاس کا جائزہ لیں۔',
      todayBadge: 'آج',
      noClassesScheduled: 'کوئی کلاس شیڈول نہیں',
      showLess: 'کم دکھائیں',
      showWeekend: (count) =>
        `ہفتہ وار تعطیلات دکھائیں · مزید ${count} دن`,
      weekDaysLong: [
        'پیر',
        'منگل',
        'بدھ',
        'جمعرات',
        'جمعہ',
        'ہفتہ',
        'اتوار',
      ],
      weekDaysShort: [
        'پیر',
        'منگل',
        'بدھ',
        'جمعرات',
        'جمعہ',
        'ہفتہ',
        'اتوار',
      ],
    },

    status: {
      cancelledSafe: 'منسوخ · محفوظ',
      attended: 'حاضر',
      missed: 'غیر حاضر',
      upcoming: 'آنے والی',
    },

    empty: {
      noClassesTitle: 'ابھی کوئی کلاس نہیں',
      noClassesSubtitle:
        'حاضری ٹریک کرنا شروع کرنے کے لیے کسی کلاس میں شامل ہوں۔',
    },
  },

  class: {
    header: {
      eyebrow: 'کلاس اسپیسز',
      title: 'آپ کی کلاسز',
      subtitle:
        'اپنی کلاس اسپیسز، ارکان، رسائی اور کلاس کوڈز کا انتظام کریں۔',
      tabMyClasses: 'میری کلاسز',
      tabCreateClass: 'کلاس بنائیں',
      emptyTitle: 'ابھی کوئی کلاس نہیں',
      emptySubtitle:
        'کلاس کوڈ کے ذریعے موجودہ کلاس میں شامل ہوں یا نئی کلاس اسپیس بنائیں۔',
      emptyJoinButton: 'کلاس میں شامل ہوں',
      emptyCreateButton: 'کلاس بنائیں',
    },

    sidebar: {
      sectionLabel: 'کلاسز',
      membersSuffix: 'ارکان',
      joinAnother: 'دوسری کلاس میں شامل ہوں',
    },

    overview: {
      badgeClassSpace: 'کلاس اسپیس',
      badgeRepresentative: 'نمائندہ',
      noDescription: 'ابھی کلاس کی کوئی تفصیل شامل نہیں کی گئی۔',
      visibilityPublic: 'عوامی',
      visibilityPrivate: 'نجی',
      classCodeLabel: 'کلاس کوڈ',
      copyCodeTitle: 'کلاس کوڈ کاپی کریں',
      membersLabel: 'ارکان',
      studentsSubtitle: 'اس کلاس میں طلبہ',
    },

    requests: {
      joinRequestsTitle: 'شامل ہونے کی درخواستیں',
      joinRequestsSubtitle:
        'اس کلاس میں شامل ہونے کے منتظر طلبہ کا جائزہ لیں۔',
      waitingForApproval: 'منظوری کا انتظار',
      approveButton: 'منظور کریں',
      denyButton: 'مسترد کریں',
      removalRequestsTitle: 'ہٹانے کی درخواستیں',
      removalRequestsSubtitle:
        'ارکان کو ہٹانے کی درخواستوں کا جائزہ لیں۔',
      memberRemovalRequested: 'رکن کو ہٹانے کی درخواست',
      rejectButton: 'مسترد کریں',
    },

    members: {
      title: 'ارکان',
      subtitle: 'اس کلاس میں موجود طلبہ۔',
      youBadge: 'آپ',
      roleRepresentative: 'نمائندہ',
      roleAssistant: 'اسسٹنٹ',
      roleMember: 'رکن',
      demoteButton: 'عہدہ کم کریں',
      promoteButton: 'اسسٹنٹ بنائیں',
      removeButton: 'ہٹائیں',
      requestRemovalButton: 'ہٹانے کی درخواست',
      emptyMessage: 'ابھی کوئی رکن نہیں۔',
    },

    management: {
      title: 'کلاس کا انتظام',
      subtitle: 'رسائی، ملکیت اور اس کلاس کا انتظام کریں۔',
      classCodeTitle: 'کلاس کوڈ',
      classCodeSubtitle:
        'اگر کوڈ بہت زیادہ شیئر ہو گیا ہے تو اسے دوبارہ بنائیں۔',
      regenerateButton: 'دوبارہ بنائیں',
      transferTitle: 'ملکیت منتقل کریں',
      transferSubtitle:
        'کسی دوسرے منتظم کو اس کلاس کی ملکیت دیں۔',
      transferButton: 'منتقل کریں',
      leaveTitle: 'کلاس چھوڑیں',
      leaveSubtitle: 'خود کو اس کلاس سے ہٹائیں۔',
      leavingButton: 'چھوڑا جا رہا ہے...',
      leaveButton: 'چھوڑیں',
      deleteTitle: 'کلاس حذف کریں',
      deleteSubtitle:
        'اس کلاس اور اس کی رکنیت کو مستقل طور پر ختم کریں۔',
      deleteButton: 'حذف کریں',
    },

    modals: {
      loadingCreating: 'کلاس بنائی جا رہی ہے',
      loadingJoining: 'کلاس میں شامل ہو رہے ہیں',
      loadingUpdating: 'اپ ڈیٹ کیا جا رہا ہے',
      loadingFallback: 'براہ کرم انتظار کریں...',

      transferTitle: 'ملکیت منتقل کریں',
      transferSubtitle:
        'نئے مالک کے طور پر ایک اسسٹنٹ منتخب کریں۔',
      cancelButton: 'منسوخ',
      transferConfirmButton: 'منتقل کریں',

      confirmDeleteTitle: 'کلاس حذف کریں؟',
      confirmRegenerateTitle: 'کلاس کوڈ دوبارہ بنائیں؟',
      confirmRejectJoinTitle: 'شامل ہونے کی درخواست مسترد کریں؟',
      confirmRemoveMemberTitle: 'رکن کو ہٹائیں؟',
      confirmRequestRemovalTitle: 'رکن کو ہٹانے کی درخواست کریں؟',

      confirmDeleteBody: (className) =>
        `"${className}" مستقل طور پر حذف ہو جائے گی۔ یہ عمل واپس نہیں کیا جا سکتا۔`,
      confirmRegenerateBody: (className) =>
        `"${className}" کا موجودہ کوڈ کام کرنا بند کر دے گا اور نیا کوڈ بنایا جائے گا۔`,
      confirmRejectJoinBody: (userName) =>
        `${userName} کی اس کلاس میں شامل ہونے کی درخواست مسترد کر دی جائے گی۔`,
      confirmRemoveMemberBody: (memberName) =>
        `${memberName} کو اس کلاس سے ہٹا دیا جائے گا۔`,
      confirmRequestRemovalBody: (memberName) =>
        `${memberName} کو اس کلاس کے لیے ہٹانے کی درخواست موصول ہوگی۔`,

      confirmDeleteButton: 'حذف کریں',
      confirmRegenerateButton: 'دوبارہ بنائیں',
      confirmRejectButton: 'مسترد کریں',
      confirmRemoveButton: 'ہٹائیں',
      confirmRequestRemovalButton: 'ہٹانے کی درخواست',
    },
    join: {
      eyebrow: 'کلاس میں شامل ہوں',
      title: 'کلاس کوڈ درج کریں',
      subtitle:
        'کلاس کے مالک یا نمائندے کی جانب سے فراہم کردہ کوڈ استعمال کریں۔',
      classCodeLabel: 'کلاس کوڈ',
      classCodePlaceholder: 'کلاس کوڈ درج کریں',
      verificationLabel: 'تصدیق',
      captchaQuestion: (a, b) => `حل کریں: ${a} + ${b} = ؟`,
      captchaPlaceholder: 'جواب',
      newQuestionButton: 'نیا سوال',
      emptyCodeError: 'کلاس کوڈ درج کریں۔',
      incorrectCaptchaError: 'غلط جواب۔',
      joiningButton: 'شامل ہو رہے ہیں...',
      joinButton: 'کلاس میں شامل ہوں',
    },

    create: {
      eyebrow: 'کلاس بنائیں',
      title: 'نئی کلاس بنائیں',
      subtitle:
        'اپنی کلاس، شعبے یا اسٹڈی گروپ کے لیے ایک اسپیس بنائیں۔',
      nameLabel: 'کلاس کا نام',
      namePlaceholder: 'مثلاً MTH 102',
      descriptionLabel: 'تفصیل',
      descriptionPlaceholder: 'یہ کلاس کس لیے ہے؟',
      visibilityLabel: 'مرئیت',
      visibilityPublicTitle: 'عوامی',
      visibilityPublicSubtitle:
        'کلاس کوڈ رکھنے والا کوئی بھی شخص شامل ہونے کی درخواست بھیج سکتا ہے۔',
      visibilityPrivateTitle: 'نجی',
      visibilityPrivateSubtitle:
        'صرف آپ کی منظوری سے لوگ شامل ہو سکتے ہیں۔',
      verificationLabel: 'تصدیق',
      captchaQuestion: (a, b) => `حل کریں: ${a} + ${b} = ؟`,
      captchaPlaceholder: 'جواب',
      newQuestionButton: 'نیا سوال',
      emptyNameError: 'کلاس کا نام درج کریں۔',
      incorrectCaptchaError: 'غلط جواب۔',
      creatingButton: 'بنائی جا رہی ہے...',
      createButton: 'کلاس بنائیں',
      createdWithCode: (code) => `کلاس بن گئی۔ کوڈ: ${code}`,
      createdSuccess: 'کلاس کامیابی سے بن گئی۔',
    },

    toast: {
      joiningClass: 'کلاس میں شامل ہو رہے ہیں...',
      creatingClass: 'کلاس بنائی جا رہی ہے...',
      generatingCode: 'نیا کلاس کوڈ بنایا جا رہا ہے...',
      unableToJoin: 'کلاس میں شامل نہیں ہو سکے۔',
      unableToCreate: 'کلاس نہیں بن سکی۔',
      unableToRegenerate: 'کلاس کوڈ دوبارہ نہیں بنایا جا سکا۔',
      joinApproved: 'شامل ہونے کی درخواست منظور ہو گئی۔',
      joinRejected: 'شامل ہونے کی درخواست مسترد کر دی گئی۔',
      unableToApproveJoin:
        'شامل ہونے کی درخواست منظور نہیں کی جا سکی۔',
      unableToRejectJoin:
        'شامل ہونے کی درخواست مسترد نہیں کی جا سکی۔',
      unableToCopyCode: 'کلاس کوڈ کاپی نہیں ہو سکا۔',
      leftClass: 'آپ نے کلاس چھوڑ دی۔',
      classDeleted: 'کلاس حذف کر دی گئی۔',
      memberRemoved: (name) => `${name} کو ہٹا دیا گیا۔`,
      removalRequestSubmitted:
        'ہٹانے کی درخواست جمع کر دی گئی۔',
      removalApproved: 'ہٹانے کی درخواست منظور ہو گئی۔',
      removalRequestRejected:
        'ہٹانے کی درخواست مسترد کر دی گئی۔',
      nowAssistant: (name) => `${name} اب اسسٹنٹ ہیں۔`,
      nowMember: (name) => `${name} اب رکن ہیں۔`,
      ownershipTransferred: 'ملکیت منتقل کر دی گئی۔',
      unableToTransfer: 'ملکیت منتقل نہیں کی جا سکی۔',
    },
  },

  settings: {
    header: {
      backButton: 'پروفائل',
      eyebrow: 'اکاؤنٹ',
      title: 'ترتیبات',
      subtitle: 'اپنی ترجیحات اور کلاس کنٹرولز کا انتظام کریں۔',
    },

    theme: {
      sectionLabel: 'ظاہری شکل',
      sectionTitle: 'تھیم',
      systemTitle: 'سسٹم',
      systemSubtitle: 'اپنے ڈیوائس کی سیٹنگ کے مطابق',
      lightTitle: 'لائٹ',
      lightSubtitle: 'ہمیشہ لائٹ موڈ استعمال کریں',
      darkTitle: 'ڈارک',
      darkSubtitle: 'ہمیشہ ڈارک موڈ استعمال کریں',
    },

    language: {
      sectionLabel: 'ترجیحات',
      title: 'زبان',
      dropdownLabel: 'ڈسپلے زبان',
      hint:
        'ایپ کا انٹرفیس پوری ایپ میں اسی زبان میں دکھایا جائے گا۔',
    },

    visibility: {
      sectionLabel: 'کلاس کا انتظام',
      title: 'کلاس کی مرئیت',
      subtitle:
        'طے کریں کہ طلبہ آپ کی کلاسز میں فوراً شامل ہو سکتے ہیں یا منظوری درکار ہوگی۔',
      applyAllTitle: 'تمام کلاسز پر لاگو کریں',
      applyAllSubtitle:
        'اپنی تمام کلاسز کو ایک ساتھ تبدیل کریں۔',
      applyAllPublicSubtitle:
        'کوڈ رکھنے والا کوئی بھی شخص فوراً شامل ہو سکتا ہے',
      applyAllPrivateSubtitle:
        'نئے ارکان کو شامل ہونے سے پہلے منظوری درکار ہوگی',
      publicButton: 'عوامی',
      privateButton: 'نجی',
      yourClassesLabel: 'آپ کی کلاسز',
      classSingular: 'کلاس',
      classPlural: 'کلاسز',
      emptyTitle: 'ابھی کوئی ملکیتی کلاس نہیں۔',
      emptySubtitle:
        'آپ کی بنائی ہوئی کلاسز یہاں ظاہر ہوں گی۔',
      joinCodeLabel: 'شامل ہونے کا کوڈ ·',
      updatingButton: 'اپ ڈیٹ ہو رہا ہے',
      makePrivateButton: 'نجی بنائیں',
      makePublicButton: 'عوامی بنائیں',
      classPublicSubtitle:
        'کوڈ رکھنے والا کوئی بھی شخص فوراً شامل ہو سکتا ہے',
      classPrivateSubtitle:
        'نئے ارکان کو شامل ہونے سے پہلے منظوری درکار ہوگی',
      alertGlobalEmpty:
        'آپ کے پاس عالمی مرئیت کی سیٹنگ لاگو کرنے کے لیے کوئی ملکیتی کلاس نہیں ہے۔',
      alertGlobalConfirm: (visibility) =>
        `کیا آپ واقعی اپنی تمام ملکیتی کلاسز کو ${visibility} کرنا چاہتے ہیں؟`,
      alertGlobalSuccess: (visibility) =>
        `کامیابی: آپ کی تمام ملکیتی کلاسز اب ${visibility} ہیں۔`,
      alertGlobalFailed: (message) =>
        `عالمی مرئیت لاگو کرنے میں ناکامی: ${message}`,
      alertToggleFailed: (message) =>
        `مرئیت اپ ڈیٹ کرنے میں ناکامی: ${message}`,
    },

    danger: {
      sectionLabel: 'اکاؤنٹ',
      title: 'خطرناک زون',
      deleteTitle: 'اپنا اکاؤنٹ حذف کریں',
      deleteSubtitle:
        'اپنا اکاؤنٹ، کلاسز، رکنیت، حاضری کے ریکارڈ اور متعلقہ ڈیٹا مستقل طور پر حذف کریں۔',
      deleteButton: 'اکاؤنٹ حذف کریں',
    },

    deleteModal: {
      eyebrow: 'مستقل کارروائی',
      title: 'اکاؤنٹ حذف کریں؟',
      subtitle:
        'یہ عمل واپس نہیں کیا جا سکتا۔ آپ کا اکاؤنٹ اور متعلقہ ڈیٹا مستقل طور پر حذف ہو جائے گا۔',
      passwordLabel: 'پاس ورڈ سے تصدیق کریں',
      passwordPlaceholder: 'اپنا پاس ورڈ درج کریں',
      confirmLabel:
        'میں سمجھتا ہوں کہ میرا اکاؤنٹ حذف کرنا مستقل عمل ہے اور اسے واپس نہیں کیا جا سکتا۔',
      cancelButton: 'منسوخ',
      deleteButton: 'مستقل طور پر حذف کریں',
      deletingButton: 'حذف کیا جا رہا ہے',
      errorPasswordRequired:
        'اس کارروائی کی اجازت دینے کے لیے اپنا پاس ورڈ درج کریں۔',
      errorConfirmRequired:
        'آگے بڑھنے کے لیے تصدیقی باکس کو منتخب کرنا ضروری ہے۔',
            errorPasswordIncorrect:
        'پاس ورڈ کی تصدیق ناکام ہوئی۔ براہ کرم اپنا درست موجودہ پاس ورڈ درج کریں۔',
      errorProfileDelete:
        'پروفائل حذف کرنے میں ناکامی ہوئی۔ براہ کرم سپورٹ سے رابطہ کریں۔',
      errorAuthDelete:
        'اکاؤنٹ حذف کرنے میں ناکامی ہوئی۔ براہ کرم سپورٹ سے رابطہ کریں۔',
      errorGeneric:
        'اکاؤنٹ حذف کرتے وقت ایک غیر متوقع خرابی پیش آگئی۔',
    },

    footer: {
      title: 'ترتیبات',
      subtitle: 'اپنے اکاؤنٹ اور ترجیحات کا انتظام کریں۔',
    },
  },
};

export default UR;