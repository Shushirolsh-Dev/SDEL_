import type { LandingStrings } from '../types.landing';

const EN_LANDING: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'Sign In',
    joinFree: 'Join Free',
    backToLogin: '← Back to Login',
    backToHome: '← Back to Home',
  },
  hero: {
    badge: 'Real-Time School Schedules',
    headlinePrefix: 'Your school day,',
    headlineSuffix: 'finally in one place.',
    subtitle:
      'Thesdel is a real-time timetable and attendance layer built for schools. Spot room shifts, track cancellations, and protect your attendance record — without the group-chat noise.',
    ctaPrimary: 'Create Account',
    ctaSecondary: 'Sign In',
    replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
  },
  features: {
    sectionLabel: 'How it works',
    sectionTitle: 'Built around your school day.',
    step1Title: 'Centralized Schedule',
    step1Body:
      'Representatives publish active courses, dates, and hours. No more scouring pinned chat history for PDFs.',
    step2Title: 'Instant Venue Alerts',
    step2Body:
      'Class relocated or cancelled? Live warnings reach you before the session starts, saving wasted trips.',
    step3Title: 'Streak Safe-Guards',
    step3Body:
      'Track daily logs and class counts. Protect your attendance record automatically, with verification built in.',
  },
  footer: {
    builtBy: 'Built by Litheral',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    about: 'About',
    linksTagline: 'Your school schedule, organized.',
    brandMark: 'THESDEL',
    descriptor: 'Student Digital Exchange Layer',
  },
  login: {
    topMarker: 'THESDEL / ACCESS',
    title: 'Welcome back.',
    subtitle:
      'Sign in to continue to your school space, schedule, and classes.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotLink: 'Forgot?',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    submitIdle: 'Continue',
    submitLoading: 'Signing in',
    newTo: 'New to THESDEL?',
    createAccount: 'Create an account',
    footnote: 'Student Digital Exchange Layer',
    emptyFieldsError: 'Please enter both email and password.',
    fallbackProfileError:
      'Unable to load your profile. Please contact support.',
    genericError: 'An error occurred during log in.',
    close: 'Close',
  },
  forgot: {
    topMarker: 'THESDEL / RECOVERY',
    title: 'Reset your password.',
    subtitle:
      "Enter the email connected to your account and we'll send you a secure reset link.",
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    submitIdle: 'Send reset link',
    submitLoading: 'Sending',
    backToSignIn: 'Back to sign in',
    successTitle: 'Reset link sent',
    successBodyPrefix: 'Check',
    successBodySuffix:
      'for instructions to create a new password.',
    returnToSignIn: 'Return to sign in',
    footnote: 'Secure account recovery',
    emptyEmailError: 'Please enter your email address.',
    genericError:
      'An error occurred during password reset request.',
    close: 'Close',
  },
  signup: {
    topMarker: 'THESDEL / CREATE ACCOUNT',
    title: 'Create your account.',
    subtitle:
      'Set up your THESDEL profile and join your school community.',
    sectionIdentity: '01 / Identity',
    sectionContact: '02 / Contact',
    sectionRole: '03 / Role',
    sectionSecurity: '04 / Security',
    nameLabel: 'Full name',
    namePlaceholder: 'Your full name',
    usernameLabel: 'Username',
    usernamePlaceholder: 'choose_a_username',
    usernameChecking: 'Checking availability...',
    usernameAvailable: 'Username available',
    usernameUnavailable: 'Username unavailable',
    usernameHint: '3–20 characters',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Phone number',
    phonePlaceholder: 'Phone number',
    phoneHint:
      'Used for account-related communication and reminders when enabled.',
    roleQuestion: 'How will you use THESDEL?',
    roleStudentTitle: 'Student',
    roleStudentBody:
      'Join classes and manage your school schedule.',
    roleRepTitle: 'Representative',
    roleRepBody:
      'Create and manage schedules for your class.',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a password',
    passwordHint: 'Minimum 6 characters',
    passwordProtected: 'Protected',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    termsPrefix: 'I agree to the',
    termsOfService: 'Terms of Service',
    termsConjunction: 'and',
    privacyPolicy: 'Privacy Policy',
    termsSuffix: '.',
    submitIdle: 'Create account',
    submitLoading: 'Creating account',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    footnote: 'Student Digital Exchange Layer',
    errorAllRequired: 'All fields are required.',
    errorUsernameFormat:
      'Username must be 3-20 characters (letters, numbers, underscore only).',
    errorUsernameTaken:
      'Username is already taken. Please choose another.',
    errorPhoneInvalid:
      'Please enter a valid phone number.',
    errorTermsRequired:
      'You must agree to the Terms of Service and Privacy Policy.',
    errorEmailRegistered:
      'This email is already registered. Please sign in or use a different email.',
    errorProfileCreate:
      'Failed to create profile. Please try again.',
    errorDuplicate:
      'Username or email already taken. Please try again.',
    errorGenericRegistration:
      'An error occurred during registration.',
  },
  legal: {
    terms: {
      eyebrow: 'Terms of Service',
      title: 'How THESDEL works.',
      description:
        'These terms explain the rules for using THESDEL, managing school spaces, and interacting with the services we provide.',
      footerLabel: 'THESDEL / TERMS',
      buttonLabel: 'Back to account',
      effectiveDateLabel: 'Effective date',
      effectiveDate: 'July 13, 2026',
      sections: [
        {
          number: '01',
          title: 'Accepting these terms',
          body: 'By creating an account or using THESDEL, you agree to these Terms of Service. If you do not agree with them, please do not use the platform.',
        },
        {
          number: '02',
          title: 'Your account',
          body: 'You are responsible for keeping your account information accurate and for protecting your login credentials. Accounts should be used by the person they were created for and should not be used to impersonate another person or organization.',
        },
        {
          number: '03',
          title: 'School spaces and representatives',
          body: 'THESDEL may allow students and authorized representatives to create and manage school spaces. Representatives may have additional permissions, including managing schedules, members, announcements, or other shared information within their assigned space.',
        },
        {
          number: '04',
          title: 'Schedules and shared information',
          body: 'THESDEL helps organize schedules and school information, but it is not the official source of record for your school. Always verify important dates, rooms, assessments, and other official information with the appropriate school authority.',
        },
        {
          number: '05',
          title: 'Notifications and external services',
          body: 'Some THESDEL features may use external services to deliver notifications or other functionality. Availability may depend on those services, network conditions, device settings, and applicable regulations.',
        },
        {
          number: '06',
          title: 'Acceptable use',
          body: 'You agree not to misuse THESDEL, interfere with its operation, attempt unauthorized access, distribute harmful content, or use the platform for unlawful activity.',
        },
        {
          number: '07',
          title: 'Availability and responsibility',
          body: 'THESDEL is provided on an “as available” basis. We work to keep the platform reliable, but uninterrupted availability cannot be guaranteed. Users remain responsible for acting on important school information and deadlines.',
        },
        {
          number: '08',
          title: 'Intellectual property',
          body: 'THESDEL, including its branding, interface, software, and original content, belongs to THESDEL or its respective rights holders. You may not copy, modify, distribute, or commercially exploit protected parts of the platform without permission.',
        },
        {
          number: '09',
          title: 'Changes to these terms',
          body: 'We may update these terms as THESDEL evolves. When material changes are made, the updated version will be published through the platform. Continued use of THESDEL after an update means you accept the revised terms.',
        },
      ],
    },
    privacy: {
      eyebrow: 'Privacy Policy',
      title: 'Your information matters.',
      description:
        'This policy explains what information THESDEL collects, why we use it, and the choices available to you.',
      footerLabel: 'THESDEL / PRIVACY',
      buttonLabel: 'Back to account',
      effectiveDateLabel: 'Effective date',
      effectiveDate: 'July 13, 2026',
      sections: [
        {
          number: '01',
          title: 'Information we collect',
          body: 'When you create an account, we may collect information such as your name, username, email address, phone number, account role, and other information you choose to provide.',
        },
        {
          number: '02',
          title: 'How we use your information',
          body: 'We use account information to provide THESDEL features, manage school spaces, authenticate users, communicate with you, maintain account security, and improve the reliability of the platform.',
        },
        {
          number: '03',
          title: 'School and shared data',
          body: 'Information such as schedules, class details, announcements, and other shared content may be visible to members of the relevant school space depending on the permissions associated with that space.',
        },
        {
          number: '04',
          title: 'Security',
          body: 'We use reasonable technical and organizational measures to protect information stored and processed through THESDEL. No online service can guarantee absolute security, so users should also protect their passwords and account access.',
        },
        {
          number: '05',
          title: 'Cookies and local storage',
          body: 'THESDEL may use cookies, local storage, and similar technologies to maintain sessions, remember preferences, and support core functionality. These technologies help the application work consistently across sessions.',
        },
        {
          number: '06',
          title: 'Third-party services',
          body: 'THESDEL may rely on trusted service providers for infrastructure, authentication, messaging, analytics, or other technical functions. These providers may process information only as needed to provide their services.',
        },
        {
          number: '07',
          title: 'Your choices',
          body: 'Depending on the feature and applicable law, you may be able to access, correct, update, or request deletion of information associated with your account.',
        },
        {
          number: '08',
          title: 'Policy updates',
          body: 'As THESDEL develops, this policy may change. Updated versions will be published through the platform with a revised effective date.',
        },
      ],
    },
    about: {
      eyebrow: 'About THESDEL',
      title: 'Built for school life.',
      description:
        'THESDEL is a digital layer designed to make everyday school coordination simpler, clearer, and easier to manage.',
      footerLabel: 'THESDEL / ABOUT',
      buttonLabel: 'Back to THESDEL',
      sections: [
        {
          number: '01',
          title: 'The idea',
          body: 'School life involves more than classes. Students move between schedules, people, announcements, deadlines, resources, and everyday coordination. THESDEL brings those pieces into one connected environment.',
        },
        {
          number: '02',
          title: 'One place for the school day',
          body: 'THESDEL is designed around the way students actually move through their day. Schedules, classes, announcements, study activity, shared resources, and other school tools can live together instead of being scattered across different platforms.',
        },
        {
          number: '03',
          title: 'Built around communities',
          body: 'Schools are communities, not just collections of individual users. THESDEL gives groups a shared space where members can stay aligned while authorized representatives can help coordinate information.',
        },
        {
          number: '04',
          title: 'Designed for real conditions',
          body: 'School environments can involve inconsistent connectivity, changing schedules, and large numbers of users. THESDEL is designed with reliability, clarity, and efficient access in mind.',
        },
        {
          number: '05',
          title: 'Our approach',
          body: 'We believe school technology should reduce friction rather than create more of it. That means keeping the experience focused, useful, and respectful of the people who depend on it every day.',
        },
      ],
    },
  },
};

export default EN_LANDING;