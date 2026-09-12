export interface LandingHeaderStrings {
  brand: string;
  signIn: string;
  joinFree: string;
  backToLogin: string;
  backToHome: string;
}

export interface LandingHeroStrings {
  badge: string;
  replacesLabel: string;
  headlinePrefix: string;
  headlineSuffix: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  replacesWords: string[];
}

export interface LandingFeatureGridStrings {
  sectionLabel: string;
  sectionTitle: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
}

export interface LandingFooterStrings {
  builtBy: string;
  terms: string;
  privacy: string;
  about: string;
  linksTagline: string;
  brandMark: string;
  descriptor: string;
}

export interface LoginStrings {
  topMarker: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotLink: string;
  showPassword: string;
  hidePassword: string;
  submitIdle: string;
  submitLoading: string;
  newTo: string;
  createAccount: string;
  footnote: string;
  emptyFieldsError: string;
  fallbackProfileError: string;
  genericError: string;
  close: string;
}

export interface ForgotStrings {
  topMarker: string;
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitIdle: string;
  submitLoading: string;
  backToSignIn: string;
  successTitle: string;
  successBodyPrefix: string;
  successBodySuffix: string;
  returnToSignIn: string;
  footnote: string;
  emptyEmailError: string;
  genericError: string;
  close: string;
}

export interface SignUpStrings {
  topMarker: string;
  title: string;
  subtitle: string;
  sectionIdentity: string;
  sectionContact: string;
  sectionRole: string;
  sectionSecurity: string;
  nameLabel: string;
  namePlaceholder: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  usernameChecking: string;
  usernameAvailable: string;
  usernameUnavailable: string;
  usernameHint: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHint: string;
  phoneChecking: string;
  phoneAvailable: string;
  phoneUnavailable: string;
  roleQuestion: string;
  roleStudentTitle: string;
  roleStudentBody: string;
  roleRepTitle: string;
  roleRepBody: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHint: string;
  passwordProtected: string;
  showPassword: string;
  hidePassword: string;
  termsPrefix: string;
  termsOfService: string;
  termsConjunction: string;
  privacyPolicy: string;
  termsSuffix: string;
  submitIdle: string;
  submitLoading: string;
  alreadyHaveAccount: string;
  signIn: string;
  footnote: string;
  errorAllRequired: string;
  errorUsernameFormat: string;
  errorUsernameTaken: string;
  errorPhoneInvalid: string;
  errorPhoneTaken: string;
  errorTermsRequired: string;
  errorEmailRegistered: string;
  errorProfileCreate: string;
  errorDuplicate: string;
  errorGenericRegistration: string;
  captchaLabel: string;
  captchaQuestion: (a: number, b: number) => string;
  captchaPlaceholder: string;
  captchaNewQuestion: string;
  errorCaptchaRequired: string;
  errorCaptchaIncorrect: string;
  errorRateLimited: string;
}

export interface LegalSectionItem {
  number: string;
  title: string;
  body: string;
}

export interface LegalScreenStrings {
  eyebrow: string;
  title: string;
  description: string;
  footerLabel: string;
  buttonLabel: string;
  effectiveDateLabel?: string;
  effectiveDate?: string;
  sections: LegalSectionItem[];
}

export interface LegalStrings {
  terms: LegalScreenStrings;
  privacy: LegalScreenStrings;
  about: LegalScreenStrings;
}

export interface LandingStrings {
  header: LandingHeaderStrings;
  hero: LandingHeroStrings;
  features: LandingFeatureGridStrings;
  footer: LandingFooterStrings;
  login: LoginStrings;
  forgot: ForgotStrings;
  signup: SignUpStrings;
  legal: LegalStrings;
}