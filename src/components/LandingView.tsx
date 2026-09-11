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
   LANDING STRINGS — inline, no external file
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

export interface LandingStrings {
  header: LandingHeaderStrings;
  hero: LandingHeroStrings;
  features: LandingFeatureGridStrings;
  footer: LandingFooterStrings;
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
      {/* HEADER */}
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

      {/* MAIN */}
      <main className="flex w-full flex-1 flex-col">
        {activeScreen === 'landing' && (
          <div
            id="landing-screen"
            className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8"
          >
            {/* HERO */}
            <div className="flex flex-1 items-center justify-center py-24 sm:py-32">
              <LandingHero
                currentText={currentText}
                strings={strings.hero}
                onGoSignup={goSignup}
                onGoLogin={goLogin}
              />
            </div>

            {/* FEATURES */}
            <LandingFeatureGrid strings={strings.features} />

            {/* LINKS */}
            <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-zinc-200 py-8 dark:border-zinc-800 sm:flex-row sm:items-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
                Your school schedule, organized.
              </p>

              <nav className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
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
            <ForgotPasswordScreen onGoLogin={goLogin} />
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

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
            THESDEL
          </p>

          <p className="flex min-h-[16px] items-center gap-1 font-mono text-[10px] text-zinc-400">
            <span>{footerText}</span>
            <span className="animate-pulse">|</span>
          </p>

          <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 sm:block">
            Student Digital Exchange Layer
          </p>
        </div>
      </footer>
    </div>
  );
}