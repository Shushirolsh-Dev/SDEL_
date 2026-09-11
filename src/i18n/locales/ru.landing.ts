import type { LandingStrings } from '../types.landing';

export const meta = {
  code: 'ru',
  nativeName: 'Русский',
};

const RU_LANDING: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Войти',
    joinFree: 'Регистрация',
    backToLogin: '← Назад ко входу',
    backToHome: '← На главную',
  },
  hero: {
    badge: 'Синхронизированные расписания',
    replacesLabel: 'Заменяет',
    headlinePrefix: 'Ваш учебный день,',
    headlineSuffix: 'наконец, в одном месте.',
    subtitle:
      'Thesdel — это система расписания и посещаемости в реальном времени для учебных заведений. Узнавайте об изменениях аудиторий, отменах и защищайте свою посещаемость — без хаоса в чатах.',
    ctaPrimary: 'Создать аккаунт',
    ctaSecondary: 'Войти',
    replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
  },
  features: {
    sectionLabel: 'Как это работает',
    sectionTitle: 'Создано вокруг вашего учебного дня.',
    step1Title: 'Централизованное расписание',
    step1Body:
      'Старосты публикуют активные курсы, даты и часы. Больше не нужно искать PDF в закреплённых чатах.',
    step2Title: 'Мгновенные уведомления',
    step2Body:
      'Занятие перенесли или отменили? Вы узнаете об этом до начала пары и сэкономите поездку в кампус.',
    step3Title: 'Защита серии посещений',
    step3Body:
      'Отслеживайте ежедневные записи и количество занятий. Автоматически защищайте свою посещаемость.',
  },
  footer: {
    builtBy: 'Разработано Litheral',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    about: 'О проекте',
    linksTagline: 'Ваше расписание — под контролем.',
    brandMark: 'THESDEL',
    descriptor: 'Student Digital Exchange Layer',
  },
  login: {
    topMarker: 'THESDEL / ВХОД',
    title: 'С возвращением.',
    subtitle:
      'Войдите, чтобы продолжить работу с вашим учебным пространством, расписанием и классами.',
    emailLabel: 'Электронная почта',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    forgotLink: 'Забыли?',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    submitIdle: 'Продолжить',
    submitLoading: 'Вход',
    newTo: 'Впервые в THESDEL?',
    createAccount: 'Создать аккаунт',
    footnote: 'Student Digital Exchange Layer',
    emptyFieldsError:
      'Введите адрес электронной почты и пароль.',
    fallbackProfileError:
      'Не удалось загрузить профиль. Обратитесь в поддержку.',
    genericError: 'Произошла ошибка при входе.',
    close: 'Закрыть',
  },
  forgot: {
    topMarker: 'THESDEL / ВОССТАНОВЛЕНИЕ',
    title: 'Сброс пароля.',
    subtitle:
      'Введите почту, привязанную к аккаунту, и мы отправим безопасную ссылку для сброса.',
    emailLabel: 'Электронная почта',
    emailPlaceholder: 'you@example.com',
    submitIdle: 'Отправить ссылку',
    submitLoading: 'Отправка',
    backToSignIn: 'Назад ко входу',
    successTitle: 'Ссылка отправлена',
    successBodyPrefix: 'Проверьте',
    successBodySuffix:
      'для инструкций по созданию нового пароля.',
    returnToSignIn: 'Вернуться ко входу',
    footnote: 'Безопасное восстановление доступа',
    emptyEmailError:
      'Введите адрес электронной почты.',
    genericError:
      'Произошла ошибка при запросе сброса пароля.',
    close: 'Закрыть',
  },
  signup: {
    topMarker: 'THESDEL / СОЗДАНИЕ АККАУНТА',
    title: 'Создайте аккаунт.',
    subtitle:
      'Настройте профиль THESDEL и присоединитесь к учебному сообществу.',
    sectionIdentity: '01 / Личные данные',
    sectionContact: '02 / Контакты',
    sectionRole: '03 / Роль',
    sectionSecurity: '04 / Безопасность',
    nameLabel: 'Полное имя',
    namePlaceholder: 'Ваше полное имя',
    usernameLabel: 'Имя пользователя',
    usernamePlaceholder: 'выберите_имя',
    usernameChecking: 'Проверка доступности...',
    usernameAvailable: 'Имя доступно',
    usernameUnavailable: 'Имя занято',
    usernameHint: '3–20 символов',
    emailLabel: 'Электронная почта',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Номер телефона',
    phonePlaceholder: 'Номер телефона',
    phoneHint:
      'Используется для связи по аккаунту и напоминаний.',
    roleQuestion: 'Как вы будете использовать THESDEL?',
    roleStudentTitle: 'Студент',
    roleStudentBody:
      'Присоединяйтесь к классам и управляйте расписанием.',
    roleRepTitle: 'Староста',
    roleRepBody:
      'Создавайте и управляйте расписанием своего класса.',
    passwordLabel: 'Пароль',
    passwordPlaceholder: 'Создайте пароль',
    passwordHint: 'Минимум 6 символов',
    passwordProtected: 'Защищено',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    termsPrefix: 'Я согласен с',
    termsOfService: 'Условиями использования',
    termsConjunction: 'и',
    privacyPolicy: 'Политикой конфиденциальности',
    termsSuffix: '.',
    submitIdle: 'Создать аккаунт',
    submitLoading: 'Создание аккаунта',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    footnote: 'Student Digital Exchange Layer',
    errorAllRequired: 'Все поля обязательны.',
    errorUsernameFormat:
      'Имя пользователя: 3–20 символов (буквы, цифры, подчёркивание).',
    errorUsernameTaken:
      'Это имя уже занято. Выберите другое.',
    errorPhoneInvalid: 'Введите корректный номер телефона.',
    errorTermsRequired:
      'Необходимо принять Условия и Политику конфиденциальности.',
    errorEmailRegistered:
      'Эта почта уже зарегистрирована. Войдите или используйте другую.',
    errorProfileCreate:
      'Не удалось создать профиль. Попробуйте ещё раз.',
    errorDuplicate:
      'Имя пользователя или почта уже заняты. Попробуйте ещё раз.',
    errorGenericRegistration:
      'Произошла ошибка при регистрации.',
    captchaLabel: 'Проверка',
    captchaQuestion: (a, b) => `Решите: ${a} + ${b} = ?`,
    captchaPlaceholder: 'Ответ',
    captchaNewQuestion: 'Новый вопрос',
    errorCaptchaRequired: 'Ответьте на проверочный вопрос.',
    errorCaptchaIncorrect: 'Неверный ответ. Попробуйте ещё раз.',
    errorRateLimited:
      'Слишком много попыток. Подождите несколько минут.',
  },