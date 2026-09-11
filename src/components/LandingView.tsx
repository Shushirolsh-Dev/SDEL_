import React, { useState } from 'react';
import { User } from '../types';

import {
  useCyclingTypewriter,
  useOnceTypewriter,
} from '../hooks/useTypewriter';

import LandingHeader from './LandingHeader';
import LandingHero from './LandingHero';
import LandingFeatureGrid from './LandingFeatureGrid';
import SignUpScreen from './SignUpScreen';
import {
  LoginScreen,
  ForgotPasswordScreen,
} from './LoginScreen';
import {
  TermsScreen,
  PrivacyScreen,
  AboutScreen,
} from './LegalScreens';

/* ============================================================
   LANDING STRINGS
   ============================================================ */

export interface LandingHeaderStrings {
  brand: string;
  signIn: string;
  joinFree: string;
  backToLogin: string;
  backToHome: string;
}

export interface LandingHeroStrings {
  badge: string;
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
  errorTermsRequired: string;
  errorEmailRegistered: string;
  errorProfileCreate: string;
  errorDuplicate: string;
  errorGenericRegistration: string;
}

export interface LandingStrings {
  header: LandingHeaderStrings;
  hero: LandingHeroStrings;
  features: LandingFeatureGridStrings;
  footer: LandingFooterStrings;
  login: LoginStrings;
  forgot: ForgotStrings;
  signup: SignUpStrings;
}

const EN: LandingStrings = {
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
};

const LANDING_LOCALES: Record<string, LandingStrings> = {
  en: EN,
};

const DEFAULT_LANDING_LOCALE = 'en';

function getLandingStrings(
  locale: string | undefined
): LandingStrings {
  if (!locale) return LANDING_LOCALES[DEFAULT_LANDING_LOCALE];
  return (
    LANDING_LOCALES[locale] ??
    LANDING_LOCALES[DEFAULT_LANDING_LOCALE]
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

interface LandingViewProps {
  onLoginSuccess: (user: User) => void;
  classesCount: number;
  locale?: string;
}

type Screen =
  | 'landing'
  | 'login'
  | 'signup'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'forgot_password';

export default function LandingView({
  onLoginSuccess,
  locale = 'en',
}: LandingViewProps) {
  const [activeScreen, setActiveScreen] =
    useState<Screen>('landing');

  const strings = getLandingStrings(locale);

  const currentText = useCyclingTypewriter(
    strings.hero.replacesWords
  );

  const footerText = useOnceTypewriter(
    strings.footer.builtBy
  );

  const goLanding = () => setActiveScreen('landing');
  const goLogin = () => setActiveScreen('login');
  const goSignup = () => setActiveScreen('signup');

  return (
    <div
      id="thesdel-auth-container"
      className="relative flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-black dark:text-white"
    >
      <LandingHeader
        activeScreen={activeScreen}
        strings={strings.header}
        onGoLanding={goLanding}
        onGoLogin={goLogin}
        onGoSignup={goSignup}
        onBack={() => {
          if (activeScreen === 'forgot_password') {
            setActiveScreen('login');
          } else if (
            activeScreen === 'terms' ||
            activeScreen === 'privacy'
          ) {
            setActiveScreen('signup');
          } else {
            setActiveScreen('landing');
          }
        }}
      />

      <main className="flex w-full flex-1 flex-col">
        {activeScreen === 'landing' && (
          <div
            id="landing-screen"
            className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8"
          >
            <div className="flex flex-1 items-center justify-center py-24 sm:py-32">
              <LandingHero
                currentText={currentText}
                strings={strings.hero}
                onGoSignup={goSignup}
                onGoLogin={goLogin}
              />
            </div>

            <LandingFeatureGrid strings={strings.features} />

            <div className="mt-24 grid grid-cols-1 gap-8 border-t border-zinc-200 py-10 dark:border-zinc-800 sm:grid-cols-2 sm:items-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
                Your school schedule, organized.
              </p>

              <nav className="flex items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setActiveScreen('terms')}
                  className="transition-colors hover:text-zinc-950 dark:hover:text-white"
                >
                  {strings.footer.terms}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScreen('privacy')}
                  className="transition-colors hover:text-zinc-950 dark:hover:text-white"
                >
                  {strings.footer.privacy}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveScreen('about')}
                  className="transition-colors hover:text-zinc-950 dark:hover:text-white"
                >
                  {strings.footer.about}
                </button>
              </nav>
            </div>
          </div>
        )}

        {activeScreen === 'signup' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <SignUpScreen
              strings={strings.signup}
              onLoginSuccess={onLoginSuccess}
              onGoLogin={goLogin}
              onGoTerms={() => setActiveScreen('terms')}
              onGoPrivacy={() => setActiveScreen('privacy')}
            />
          </div>
        )}

        {activeScreen === 'login' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <LoginScreen
              strings={strings.login}
              onLoginSuccess={onLoginSuccess}
              onGoSignup={goSignup}
              onGoForgotPassword={() =>
                setActiveScreen('forgot_password')
              }
            />
          </div>
        )}

        {activeScreen === 'forgot_password' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <ForgotPasswordScreen
              strings={strings.forgot}
              onGoLogin={goLogin}
            />
          </div>
        )}

        {activeScreen === 'terms' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <TermsScreen onReturnToSignup={goSignup} />
          </div>
        )}

        {activeScreen === 'privacy' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <PrivacyScreen onReturnToSignup={goSignup} />
          </div>
        )}

        {activeScreen === 'about' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <AboutScreen onReturnToLanding={goLanding} />
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
            THESDEL
          </p>

          <p className="flex min-h-[16px] items-center gap-1 font-mono text-[10px] text-zinc-400 sm:order-3">
            <span>{footerText}</span>
            <span className="animate-pulse">|</span>
          </p>

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 sm:order-2 sm:text-right">
            Student Digital Exchange Layer
          </p>
        </div>
      </footer>
    </div>
  );
}