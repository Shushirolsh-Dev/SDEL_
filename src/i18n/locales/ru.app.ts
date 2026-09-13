import type { AppStrings } from '../types.app';

export const meta = {
  code: 'ru',
  nativeName: 'Русский',
};

const RU: AppStrings = {
  header: {
    brand: 'THESDEL',
    syncSynced: 'СИНХРОНИЗИРОВАНО',
    syncPending: 'В ОЧЕРЕДИ:',
    console: 'Консоль',
  },
  nav: {
    today: 'Сегодня',
    timetable: 'Расписание',
    attendance: 'Посещаемость',
    class: 'Класс',
    profile: 'Профиль',
  },
  toast: {
    classCodeNotFound: (code) =>
      `Код класса "${code}" не найден.`,
    alreadyJoined:
      'Вы уже присоединились или отправили заявку в этот класс.',
    errorJoining: (message) =>
      `Ошибка присоединения к классу: ${message}`,
    requestSubmitted:
      'Ваша заявка на вступление отправлена на одобрение.',
    enrolledSuccess: (className) =>
      `Вы успешно записаны в "${className}"!`,
    joinApproved: 'Заявка на вступление одобрена!',
    joinDenied: 'Заявка на вступление отклонена.',
    removalRequestSent:
      'Запрос на удаление отправлен старосте класса.',
    memberRemoved: 'Участник успешно удалён.',
    removalApproved: 'Удаление участника одобрено.',
    removalRejected: 'Удаление участника отклонено.',
    codeChanged: (code) => `Код класса изменён на: ${code}`,
    attendanceMarked: 'Посещаемость отмечена!',
    timetableAdded: 'Запись добавлена в расписание!',
    timetableUpdated: 'Запись расписания обновлена!',
    timetableDeleted: 'Запись расписания удалена.',
    memberPromoted: 'Участник повышен до ассистента!',
    assistantDemoted: 'Ассистент понижен до участника.',
    classDeleted: 'Класс успешно удалён.',
    mustBeLoggedIn:
      'Вы должны войти в систему, чтобы покинуть класс.',
    cannotLeaveAsRep:
      'Вы староста класса. Вы должны удалить класс или сначала назначить ассистента.',
    selectAssistantToTransfer:
      'Пожалуйста, выберите ассистента для передачи прав.',
    leaveFailed:
      'Не удалось покинуть класс. Попробуйте ещё раз.',
    leftClass: 'Вы успешно покинули класс.',
    transferFailed:
      'Не удалось передать права. Попробуйте ещё раз.',
    roleUpdateFailed:
      'Не удалось обновить роль. Попробуйте ещё раз.',
    roleUpdateFailedSelf:
      'Не удалось обновить вашу роль. Попробуйте ещё раз.',
    ownershipTransferred: (name) =>
      `Права переданы ${name}. Теперь вы участник.`,
    leaveAfterTransferFailed:
      'Права переданы, но не удалось покинуть класс. Попробуйте выйти ещё раз.',
    leftAfterTransfer:
      'Вы успешно покинули класс после передачи прав.',
  },
  confirm: {
    transferOwnershipToOne: (name) =>
      `Вы староста класса. Передать права ${name} и покинуть класс?`,
  },
  broadcast: {
    classRepMarker: 'Староста',
    classCreated: (name, author, code) =>
      `Класс "${name}" создан старостой ${author} с уникальным кодом: ${code}`,
    entryAdded: (subject, day, startTime) =>
      `Добавлено занятие в расписание: ${subject} в ${day} в ${startTime}.`,
    venueChanged: (subject, from, to) =>
      `${subject}: аудитория изменена с ${from} на ${to}. `,
    classCancelled: (subject) =>
      `${subject}: занятие официально ОТМЕНЕНО. `,
    cancellationReverted: (subject) =>
      `${subject}: отмена занятия отменена. `,
    entryDeleted: (subject) =>
      `Расписание ${subject} навсегда удалено.`,
    dayNames: [
      'понедельник',
      'вторник',
      'среду',
      'четверг',
      'пятницу',
      'субботу',
      'воскресенье',
    ],
  },
  profile: {
    roleFallback: 'Студент',
    studentFallback: 'Студент',
    settingsButton: 'Настройки',
    logoutButton: 'Выйти',
  },
  notifications: {
    header: {
      backTitle: 'Назад',
      title: 'Уведомления',
      subtitle: 'Объявления и обновления класса',
      refreshButton: 'Обновить',
      refreshingButton: 'Обновление',
    },
    empty: {
      title: 'Нет нового',
      subtitle:
        'Официальные объявления и важные обновления появятся здесь.',
    },
    card: {
      labelCancelled: 'ОТМЕНЕНО',
      labelUrgent: 'СРОЧНО',
      labelVenueChanged: 'АУДИТОРИЯ ИЗМЕНЕНА',
      labelInfo: 'ИНФО',
      labelSponsored: 'СПОНСОР',
      labelAdSpace: 'РЕКЛАМА',
      sponsoredSpotlight: 'Спонсорская публикация',
      byLabel: 'От',
      teamLabel: 'КОМАНДА THESDEL',
      agreedButton: (count) => `Согласен · ${count}`,
      agreeButton: (count) => `Согласиться · ${count}`,
      adLearnMore: 'Подробнее',
      pollSectionLabel: 'Опрос класса',
      pollResponseRegistered: 'Ответ зарегистрирован',
      pollResponseRecorded: 'Ваш ответ записан.',
      pollSelected: 'Выбрано:',
      pollYourResponse: 'Ваш ответ',
      pollLineCounter: (current, max) =>
        `${current}/${max} строк`,
      pollTextareaPlaceholder: 'Напишите ваш ответ...',
      pollSubmitResponse: 'Отправить ответ',
      pollSubmitAnswer: 'Отправить ответ',
      pollDefaultYes: 'Да',
      pollDefaultNo: 'Нет',
    },
    rep: {
      title: 'Объявление старосты',
      subtitle: 'Отправьте официальное обновление вашему классу',
      textareaPlaceholder:
        'Поделитесь советом, напоминанием, изменением расписания или важным объявлением...',
      counterLabel: (current, max) => `${current}/${max}`,
      visibleToMembers: 'Видно участникам класса',
      postButton: 'Опубликовать',
      postingButton: 'Публикация',
      successMessage: 'Объявление опубликовано',
    },
  },
  home: {
    header: {
      todayLabel: 'Сегодня',
      greetingMorning: 'Доброе утро',
      greetingAfternoon: 'Добрый день',
      greetingEvening: 'Добрый вечер',
      nameFallback: 'Студент',
      openNotifications: 'Открыть уведомления',
    },
    nextClass: {
      liveClassLabel: 'Сейчас идёт',
      nextClassLabel: 'Следующее занятие',
      fallbackClassName: 'Занятие',
      noMoreClassesTitle: 'Больше занятий нет',
      noMoreClassesSubtitle: 'Ваш учебный день свободен.',
      liveCountdown: (minutes) =>
        `СЕЙЧАС · ${minutes} мин осталось`,
      startsInHours: (hours, minutes) =>
        `Начнётся через ${hours}ч ${minutes}м`,
      startsInMinutes: (minutes) =>
        `Начнётся через ${minutes}м`,
      noMoreClassesToday: 'Больше занятий на сегодня нет',
    },
    schedule: {
      sectionTitle: 'Сегодня',
      sectionSubtitle: 'Ваше расписание',
      refreshing: 'Обновление...',
      refresh: 'Обновить',
      emptyTitle: 'Сегодня занятий нет',
      emptySubtitle:
        'Отдохните или займитесь чем-нибудь полезным.',
      fallbackClassName: 'Занятие',
      liveBadge: 'СЕЙЧАС',
      cancelledBadge: 'ОТМЕНЕНО',
      presentButton: 'Отмечено',
      markButton: 'Отметить',
    },
    attendance: {
      sectionLabel: 'Посещаемость',
      attendedCount: (count) => `${count} посещено`,
      totalCount: (count) => `из ${count}`,
    },
    updates: {
      sectionTitle: 'Обновления',
      showLess: 'Свернуть',
      viewAll: 'Все',
      noUpdates: 'Пока нет обновлений.',
      reacted: 'Отреагировано',
      acknowledge: 'Подтвердить',
      labelCancelled: 'ОТМЕНЕНО',
      labelVenueChanged: 'АУДИТОРИЯ ИЗМЕНЕНА',
      labelGlobal: 'ОБЩЕЕ',
      labelClassUpdate: 'ОБНОВЛЕНИЕ КЛАССА',
    },
    rep: {
      title: 'Староста',
      subtitle: 'Отправьте сообщение классу.',
      textareaPlaceholder: 'Напишите объявление...',
      sending: 'Отправка...',
      broadcast: 'Отправить',
      successMessage: 'Сообщение отправлено.',
    },
    ad: {
      sponsoredLabel: 'Спонсор',
      altFallback: 'Спонсор',
    },
  },
  timetable: {
    header: {
      sectionLabel: 'Учебное расписание',
      title: 'Расписание',
      noClassSelected: 'Класс не выбран',
      weekButton: 'Неделя',
      addClassButton: 'Добавить занятие',
    },
    permission: {
      managerPrefix: 'У вас есть права',
      managerSuffix:
        '. Вы можете управлять общим расписанием.',
      memberPrefix: 'Вы просматриваете расписание как',
      memberMiddle: 'участник',
      memberSuffix:
        '. Только руководители класса могут изменять записи.',
    },
    empty: {
      noClassTitle: 'Пока нет класса',
      noClassSubtitle:
        'Присоединитесь или создайте класс, чтобы просмотреть расписание.',
      emptyTitle: 'Расписание пустое',
      emptySubtitle:
        'Для этого класса ещё не добавлено ни одного занятия.',
      addFirstClassButton: 'Добавить первое занятие',
      nothingScheduledTitle: 'Ничего не запланировано',
      nothingScheduledSubtitle:
        'На этот день занятий не запланировано.',
    },
    days: {
      labels: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ],
      short: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    },
    entryCard: {
      cancelledBadge: 'Отменено',
      roomShiftedBadge: 'Аудитория изменена',
      originallyLabel: 'Изначально:',
      minutesSuffix: 'мин',
      editButton: 'Изменить',
      deleteButton: 'Удалить',
    },
    form: {
      newClassEyebrow: 'Новое занятие',
      editClassEyebrow: 'Управление занятием',
      addTitle: 'Добавить занятие',
      editTitle: 'Изменить занятие',
      subjectLabel: 'Предмет',
      subjectPlaceholder: 'например, Программная инженерия',
      dayLabel: 'День',
      venueLabel: 'Аудитория',
      venuePlaceholder: 'например, ауд. 1',
      startsLabel: 'Начало',
      endsLabel: 'Конец',
      cancelClassTitle: 'Отменить занятие',
      cancelClassSubtitle:
        'Оставить занятие видимым, но пометить как отменённое.',
      cancelButton: 'Отмена',
      saveChangesButton: 'Сохранить',
      addClassButton: 'Добавить',
      errorSubjectRequired:
        'Название предмета обязательно.',
      errorVenueRequired: 'Аудитория обязательна.',
      errorTimeOrder:
        'Время начала должно быть раньше времени окончания.',
    },
    deleteDialog: {
      title: 'Удалить это занятие?',
      descriptionPrefix: 'Вы собираетесь удалить',
      descriptionSuffix:
        'из общего расписания. Это действие нельзя отменить.',
      keepButton: 'Оставить',
      removeButton: 'Удалить',
    },
  },
  attendance: {
    header: {
      sectionLabel: 'Учебная запись',
      title: 'Посещаемость',
      subtitle:
        'Отслеживайте посещаемость, серии и завершённые занятия.',
      statusSafe: 'Посещаемость в норме',
      statusNeedsAttention: 'Требует внимания',
    },
    summary: {
      attendanceLabel: 'Посещаемость',
      targetLabel: 'Цель: 75%+',
      attendedLabel: 'Посещено',
      attendedSubtitle: 'Посещённые завершённые занятия',
      missedLabel: 'Пропущено',
      missedSubtitle: 'Пропущенные завершённые занятия',
      cancelledLabel: 'Отменено',
      cancelledSubtitle: 'Исключено из статистики',
    },
    streak: {
      sectionTitle: 'Серия посещений',
      currentStreakLabel: 'Текущая серия',
      consecutiveSuffix: 'занятий подряд',
      explanation:
        'Посещайте каждое занятие, чтобы сохранить серию. Отменённые занятия не прерывают серию. Пропуск занятия сбрасывает её.',
      currentRow: 'Текущая',
      longestRow: 'Самая длинная',
      classesSuffix: 'занятий',
      statusRow: 'Статус',
      statusSafe: 'В норме',
      statusLow: 'Низкая',
    },
    week: {
      sectionTitle: 'Посещаемость за неделю',
      sectionSubtitle:
        'Просмотрите все занятия выбранной недели.',
      todayBadge: 'Сегодня',
      noClassesScheduled: 'Занятий нет',
      showLess: 'Свернуть',
      showWeekend: (count) =>
        `Показать выходные · ещё ${count} дней`,
      weekDaysLong: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ],
      weekDaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    },
    status: {
      cancelledSafe: 'Отменено · безопасно',
      attended: 'Посещено',
      missed: 'Пропущено',
      upcoming: 'Предстоящее',
    },
    empty: {
      noClassesTitle: 'Пока нет классов',
      noClassesSubtitle:
        'Присоединитесь к классу, чтобы отслеживать посещаемость.',
    },
  },
  class: {
    header: {
      eyebrow: 'Классы',
      title: 'Ваши классы',
      subtitle:
        'Управляйте классами, участниками, доступом и кодами.',
      tabMyClasses: 'Мои классы',
      tabCreateClass: 'Создать класс',
      emptyTitle: 'Пока нет классов',
      emptySubtitle:
        'Присоединитесь к классу по коду или создайте новый.',
      emptyJoinButton: 'Присоединиться',
      emptyCreateButton: 'Создать класс',
    },
    sidebar: {
      sectionLabel: 'Классы',
      membersSuffix: 'участников',
      joinAnother: 'Присоединиться к другому классу',
    },
    overview: {
      badgeClassSpace: 'Класс',
      badgeRepresentative: 'Староста',
      noDescription: 'Описание класса пока не добавлено.',
      visibilityPublic: 'Публичный',
      visibilityPrivate: 'Приватный',
      classCodeLabel: 'Код класса',
      copyCodeTitle: 'Скопировать код',
      membersLabel: 'Участники',
      studentsSubtitle: 'студентов в этом классе',
    },
    requests: {
      joinRequestsTitle: 'Заявки на вступление',
      joinRequestsSubtitle:
        'Просмотрите студентов, ожидающих вступления.',
      waitingForApproval: 'Ожидает одобрения',
      approveButton: 'Одобрить',
      denyButton: 'Отклонить',
      removalRequestsTitle: 'Запросы на удаление',
      removalRequestsSubtitle:
        'Просмотрите запросы на удаление участников.',
      memberRemovalRequested: 'Запрошено удаление участника',
      rejectButton: 'Отклонить',
    },
    members: {
      title: 'Участники',
      subtitle: 'Студенты, состоящие в этом классе.',
      youBadge: 'Вы',
      roleRepresentative: 'Староста',
      roleAssistant: 'Ассистент',
      roleMember: 'Участник',
      demoteButton: 'Понизить',
      promoteButton: 'Сделать ассистентом',
      removeButton: 'Удалить',
      requestRemovalButton: 'Запросить удаление',
      emptyMessage: 'Пока нет участников.',
    },
    management: {
      title: 'Управление классом',
      subtitle: 'Управляйте доступом, правами и классом.',
      classCodeTitle: 'Код класса',
      classCodeSubtitle:
        'Обновите код, если он стал слишком известен.',
      regenerateButton: 'Обновить код',
      transferTitle: 'Передать права',
      transferSubtitle:
        'Передайте права другому администратору класса.',
      transferButton: 'Передать',
      leaveTitle: 'Покинуть класс',
      leaveSubtitle: 'Удалить себя из этого класса.',
      leavingButton: 'Выход...',
      leaveButton: 'Выйти',
      deleteTitle: 'Удалить класс',
      deleteSubtitle:
        'Навсегда удалить этот класс и всех участников.',
      deleteButton: 'Удалить',
    },
    modals: {
      loadingCreating: 'Создание класса',
      loadingJoining: 'Присоединение к классу',
      loadingUpdating: 'Обновление класса',
      loadingFallback: 'Пожалуйста, подождите...',

      transferTitle: 'Передать права',
      transferSubtitle:
        'Выберите ассистента, который станет новым владельцем.',
      cancelButton: 'Отмена',
      transferConfirmButton: 'Передать',

      confirmDeleteTitle: 'Удалить класс?',
      confirmRegenerateTitle: 'Обновить код класса?',
      confirmRejectJoinTitle: 'Отклонить заявку?',
      confirmRemoveMemberTitle: 'Удалить участника?',
      confirmRequestRemovalTitle: 'Запросить удаление участника?',

      confirmDeleteBody: (className) =>
        `Класс "${className}" будет удалён навсегда. Это действие нельзя отменить.`,
      confirmRegenerateBody: (className) =>
        `Текущий код для "${className}" перестанет работать, будет создан новый.`,
      confirmRejectJoinBody: (userName) =>
        `Заявка ${userName} на вступление в этот класс будет отклонена.`,
      confirmRemoveMemberBody: (memberName) =>
        `${memberName} будет удалён из этого класса.`,
      confirmRequestRemovalBody: (memberName) =>
        `${memberName} получит запрос на удаление из этого класса.`,

      confirmDeleteButton: 'Удалить',
      confirmRegenerateButton: 'Обновить',
      confirmRejectButton: 'Отклонить',
      confirmRemoveButton: 'Удалить',
      confirmRequestRemovalButton: 'Запросить удаление',
    },
    join: {
      eyebrow: 'Присоединиться к классу',
      title: 'Введите код класса',
      subtitle:
        'Используйте код, предоставленный старостой класса.',
      classCodeLabel: 'Код класса',
      classCodePlaceholder: 'Введите код класса',
      verificationLabel: 'Проверка',
      captchaQuestion: (a, b) => `Решите: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Ответ',
      newQuestionButton: 'Новый вопрос',
      emptyCodeError: 'Введите код класса.',
      incorrectCaptchaError: 'Неверный ответ.',
      joiningButton: 'Присоединение...',
      joinButton: 'Присоединиться',
    },
    create: {
      eyebrow: 'Создать класс',
      title: 'Создать новый класс',
      subtitle:
        'Создайте пространство для класса, кафедры или группы.',
      nameLabel: 'Название класса',
      namePlaceholder: 'например, МАТ 102',
      descriptionLabel: 'Описание',
      descriptionPlaceholder: 'Для чего этот класс?',
      visibilityLabel: 'Видимость',
      visibilityPublicTitle: 'Публичный',
      visibilityPublicSubtitle:
        'Любой с кодом класса может отправить заявку.',
      visibilityPrivateTitle: 'Приватный',
      visibilityPrivateSubtitle:
        'Только одобренные вами люди могут присоединиться.',
      verificationLabel: 'Проверка',
      captchaQuestion: (a, b) => `Решите: ${a} + ${b} = ?`,
      captchaPlaceholder: 'Ответ',
      newQuestionButton: 'Новый вопрос',
      emptyNameError: 'Введите название класса.',
      incorrectCaptchaError: 'Неверный ответ.',
      creatingButton: 'Создание...',
      createButton: 'Создать класс',
      createdWithCode: (code) =>
        `Класс создан. Код: ${code}`,
      createdSuccess: 'Класс успешно создан.',
    },
    toast: {
      joiningClass: 'Присоединение к классу...',
      creatingClass: 'Создание класса...',
      generatingCode: 'Создание нового кода...',
      unableToJoin: 'Не удалось присоединиться.',
      unableToCreate: 'Не удалось создать класс.',
      unableToRegenerate: 'Не удалось обновить код.',
      joinApproved: 'Заявка одобрена.',
      joinRejected: 'Заявка отклонена.',
      unableToApproveJoin: 'Не удалось одобрить заявку.',
      unableToRejectJoin: 'Не удалось отклонить заявку.',
      unableToCopyCode: 'Не удалось скопировать код.',
      leftClass: 'Вы покинули класс.',
      classDeleted: 'Класс удалён.',
      memberRemoved: (name) => `${name} удалён.`,
      removalRequestSubmitted: 'Запрос на удаление отправлен.',
      removalApproved: 'Удаление одобрено.',
      removalRequestRejected: 'Запрос на удаление отклонён.',
      nowAssistant: (name) =>
        `${name} теперь ассистент.`,
      nowMember: (name) => `${name} теперь участник.`,
      ownershipTransferred: 'Права переданы.',
      unableToTransfer: 'Не удалось передать права.',
    },
  },
  settings: {
    header: {
      backButton: 'Профиль',
      eyebrow: 'Аккаунт',
      title: 'Настройки',
      subtitle: 'Управляйте настройками и классами.',
    },
    theme: {
      sectionLabel: 'Оформление',
      sectionTitle: 'Тема',
      systemTitle: 'Системная',
      systemSubtitle: 'Как на устройстве',
      lightTitle: 'Светлая',
      lightSubtitle: 'Всегда светлая тема',
      darkTitle: 'Тёмная',
      darkSubtitle: 'Всегда тёмная тема',
    },
    language: {
      sectionLabel: 'Предпочтения',
      title: 'Язык',
      dropdownLabel: 'Язык интерфейса',
      hint: 'Интерфейс будет отображаться на этом языке.',
    },
    visibility: {
      sectionLabel: 'Управление классом',
      title: 'Видимость класса',
      subtitle:
        'Определите, могут ли студенты присоединяться сразу или требуют одобрения.',
      applyAllTitle: 'Применить ко всем классам',
      applyAllSubtitle: 'Изменить все ваши классы сразу.',
      applyAllPublicSubtitle:
        'Любой с кодом может присоединиться сразу',
      applyAllPrivateSubtitle:
        'Новые участники требуют одобрения',
      publicButton: 'Публичный',
      privateButton: 'Приватный',
      yourClassesLabel: 'Ваши классы',
      classSingular: 'класс',
      classPlural: 'классов',
      emptyTitle: 'Пока нет классов.',
      emptySubtitle: 'Созданные классы появятся здесь.',
      joinCodeLabel: 'Код ·',
      updatingButton: 'Обновление',
      makePrivateButton: 'Сделать приватным',
      makePublicButton: 'Сделать публичным',
      classPublicSubtitle:
        'Любой с кодом может присоединиться сразу',
      classPrivateSubtitle:
        'Новые участники требуют одобрения',
      alertGlobalEmpty:
        'У вас нет классов, чтобы применить глобальные настройки.',
      alertGlobalConfirm: (visibility) =>
        `Вы уверены, что хотите изменить все ваши классы на ${visibility}?`,
      alertGlobalSuccess: (visibility) =>
        `Готово: все ваши классы теперь ${visibility}.`,
      alertGlobalFailed: (message) =>
        `Не удалось применить: ${message}`,
      alertToggleFailed: (message) =>
        `Не удалось обновить видимость: ${message}`,
    },
    danger: {
      sectionLabel: 'Аккаунт',
      title: 'Опасная зона',
      deleteTitle: 'Удалить аккаунт',
      deleteSubtitle:
        'Навсегда удалить аккаунт, классы, участие, посещаемость и связанные данные.',
      deleteButton: 'Удалить аккаунт',
    },
    deleteModal: {
      eyebrow: 'Необратимое действие',
      title: 'Удалить аккаунт?',
      subtitle:
        'Это действие нельзя отменить. Ваш аккаунт и связанные данные будут удалены навсегда.',
      passwordLabel: 'Подтвердите пароль',
      passwordPlaceholder: 'Введите пароль',
      confirmLabel:
        'Я понимаю, что удаление аккаунта необратимо и не может быть отменено.',
      cancelButton: 'Отмена',
      deleteButton: 'Удалить навсегда',
      deletingButton: 'Удаление',
      errorPasswordRequired:
        'Введите пароль для подтверждения.',
      errorConfirmRequired:
        'Необходимо поставить галочку.',
      errorPasswordIncorrect:
        'Неверный пароль. Введите текущий пароль.',
      errorProfileDelete:
        'Не удалось удалить профиль. Обратитесь в поддержку.',
      errorAuthDelete:
        'Не удалось удалить аккаунт. Обратитесь в поддержку.',
      errorGeneric:
        'Произошла непредвиденная ошибка при удалении.',
    },
    footer: {
      title: 'Настройки',
      subtitle: 'Управляйте аккаунтом и настройками.',
    },
  },
};

export default RU;