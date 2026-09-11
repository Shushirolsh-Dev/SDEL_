import React, { useState } from 'react';
import { User } from '../types';

import {
  useCyclingTypewriter,
  useOnceTypewriter,
} from '../hooks/useTypewriter';

import LandingHeader, {
  HeaderStrings,
} from './LandingHeader';
import LandingHero, { HeroStrings } from './LandingHero';
import LandingPillars, {
  PillarsStrings,
} from './LandingPillars';
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
   STRINGS — the single source of truth for all landing copy.
   To add a new language later, copy this object, translate
   the values, and swap which one gets passed into the
   components below. No component edits required.
   ============================================================ */

interface LandingStrings {
  header: HeaderStrings;
  hero: HeroStrings;
  pillars: PillarsStrings;
  footer: {
    builtBy: string;
    terms: string;
    privacy: string;
    about: string;
  };
  replacesWords: string[];
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
    eyebrow: 'University Schedule Infrastructure',
    replacesLabel: 'Replaces',
    headlineLine1: 'Your class,',
    headlineLine2: 'finally in one place.',
    subtitle:
      'A real-time timetable and attendance layer built for university classes. Spot room shifts, track cancellations, and protect your attendance record — without the group-chat noise.',
    ctaPrimary: 'Create Account',
    ctaSecondary: 'Sign In',
    trustRealTime: 'Real-time Sync',
    trustOffline: 'Offline-First',
    trustNoAds: 'No Ads',
  },

  pillars: {
    sectionLabel: 'How It Works',
    pillars: [
      {
        number: '01',
        title: 'Centralized Schedule',
        body: 'Representatives publish active courses, dates, and hours. No more scouring pinned chat history for PDFs.',
      },
      {
        number: '02',
        title: 'Instant Venue Alerts',
        body: 'Class relocated or cancelled? Dynamic live warnings reach you before the session starts, saving wasted campus trips.',
      },
      {
        number: '03',
        title: 'Streak Safe-Guards',
        body: 'Track daily logs and class counts. Protect your attendance requirements automatically, with verification built in.',
      },
    ],
  },

  footer: {
    builtBy: 'Built by Litheral',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    about: 'About',
  },

  replacesWords: ['WhatsApp', 'Telegram', 'Discord'],
};

/* Optional: add more locales here later */
const LOCALES: Record<string, LandingStrings> = {
  en: EN,
};

/* ============================================================
   COMPONENT
   ============================================================ */

interface LandingViewProps {
  onLoginSuccess: (user: User) => void;
  classesCount: number;
  /* Optional: pass a locale key once your i18n feature lands */
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

  const strings = LOCALES[locale] ?? EN;

  const currentText = useCyclingTypewriter(
    strings.replacesWords
  );

  const footerText = useOnceTypewriter(
    strings.footer.builtBy
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-950 selection:bg-zinc-900 selection:text-white"
      id="thesdel-auth-container"
    >
      <LandingHeader
        activeScreen={activeScreen}
        strings={strings.header}
        onGoLanding={() => setActiveScreen('landing')}
        onGoLogin={() => setActiveScreen('login')}
        onGoSignup={() => setActiveScreen('signup')}
        onBack={() => {
          if (activeScreen === 'forgot_password') {
            setActiveScreen('login');
          } else {
            setActiveScreen('landing');
          }
        }}
      />

      <main className="flex w-full flex-1 flex-col">
        {activeScreen === 'landing' && (
          <div className="animate-fade-in">
            {/* Hero — generous vertical rhythm, no cards */}
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
              <LandingHero
                currentText={currentText}
                strings={strings.hero}
                onGoSignup={() => setActiveScreen('signup')}
                onGoLogin={() => setActiveScreen('login')}
              />
            </div>

            {/* Pillars — separated by whitespace, not borders */}
            <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 sm:pb-32">
              <LandingPillars strings={strings.pillars} />
            </div>

            {/* Micro footer links — inline, mono, muted */}
            <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-zinc-200 pt-8">
                <button
                  onClick={() => setActiveScreen('terms')}
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-zinc-950 cursor-pointer"
                >
                  {strings.footer.terms}
                </button>
                <button
                  onClick={() => setActiveScreen('privacy')}
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-zinc-950 cursor-pointer"
                >
                  {strings.footer.privacy}
                </button>
                <button
                  onClick={() => setActiveScreen('about')}
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-zinc-950 cursor-pointer"
                >
                  {strings.footer.about}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'signup' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <SignUpScreen
              onLoginSuccess={onLoginSuccess}
              onGoLogin={() => setActiveScreen('login')}
              onGoTerms={() => setActiveScreen('terms')}
              onGoPrivacy={() => setActiveScreen('privacy')}
            />
          </div>
        )}

        {activeScreen === 'login' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <LoginScreen
              onLoginSuccess={onLoginSuccess}
              onGoSignup={() => setActiveScreen('signup')}
              onGoForgotPassword={() =>
                setActiveScreen('forgot_password')
              }
            />
          </div>
        )}

        {activeScreen === 'forgot_password' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <ForgotPasswordScreen
              onGoLogin={() => setActiveScreen('login')}
            />
          </div>
        )}

        {activeScreen === 'terms' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <TermsScreen
              onReturnToSignup={() => setActiveScreen('signup')}
            />
          </div>
        )}

        {activeScreen === 'privacy' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <PrivacyScreen
              onReturnToSignup={() => setActiveScreen('signup')}
            />
          </div>
        )}

        {activeScreen === 'about' && (
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <AboutScreen
              onReturnToLanding={() =>
                setActiveScreen('landing')
              }
            />
          </div>
        )}
      </main>

      {/* Footer — quiet, mono, no card */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
            {footerText}
            <span className="ml-1 inline-block text-zinc-300 animate-pulse">
              |
            </span>
          </p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-300">
            v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}