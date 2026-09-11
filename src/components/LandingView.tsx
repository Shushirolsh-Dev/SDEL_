import React, { useState } from 'react';
import { User } from '../types';

import {
  useCyclingTypewriter,
  useOnceTypewriter,
} from '../hooks/useTypewriter';

import { getLandingStrings } from '../i18n/strings';

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
                {strings.footer.linksTagline}
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
            <TermsScreen
              strings={strings.legal.terms}
              onReturnToSignup={goSignup}
            />
          </div>
        )}

        {activeScreen === 'privacy' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <PrivacyScreen
              strings={strings.legal.privacy}
              onReturnToSignup={goSignup}
            />
          </div>
        )}

        {activeScreen === 'about' && (
          <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <AboutScreen
              strings={strings.legal.about}
              onReturnToLanding={goLanding}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
            {strings.footer.brandMark}
          </p>

          <p className="flex min-h-[16px] items-center gap-1 font-mono text-[10px] text-zinc-400 sm:order-3">
            <span>{footerText}</span>
            <span className="animate-pulse">|</span>
          </p>

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 sm:order-2 sm:text-right">
            {strings.footer.descriptor}
          </p>
        </div>
      </footer>
    </div>
  );
}