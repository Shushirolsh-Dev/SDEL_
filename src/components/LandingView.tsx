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

interface LandingViewProps {
  onLoginSuccess: (user: User) => void;
  classesCount: number;
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
}: LandingViewProps) {
  const [activeScreen, setActiveScreen] =
    useState<Screen>('landing');

  const currentText = useCyclingTypewriter([
    'WhatsApp',
    'Telegram',
    'Discord',
  ]);

  const footerText = useOnceTypewriter('Built by Litheral');

  return (
    <div
      className="min-h-screen bg-zinc-50 text-zinc-950 flex flex-col font-sans selection:bg-zinc-900 selection:text-white"
      id="thesdel-auth-container"
    >
      <LandingHeader
        activeScreen={activeScreen}
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

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {activeScreen === 'landing' && (
          <div
            className="space-y-12 py-6 sm:py-12 animate-fade-in"
            id="landing-screen"
          >
            <LandingHero
              currentText={currentText}
              onGoSignup={() => setActiveScreen('signup')}
              onGoLogin={() => setActiveScreen('login')}
            />

            <LandingFeatureGrid />

            {/* Micro footer links */}
            <div className="flex justify-center gap-6 text-[11px] font-mono text-zinc-400 pt-4">
              <button
                onClick={() => setActiveScreen('terms')}
                className="hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveScreen('privacy')}
                className="hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveScreen('about')}
                className="hover:text-zinc-900 transition-colors cursor-pointer"
              >
                About
              </button>
            </div>
          </div>
        )}

        {activeScreen === 'signup' && (
          <SignUpScreen
            onLoginSuccess={onLoginSuccess}
            onGoLogin={() => setActiveScreen('login')}
            onGoTerms={() => setActiveScreen('terms')}
            onGoPrivacy={() => setActiveScreen('privacy')}
          />
        )}

        {activeScreen === 'login' && (
          <LoginScreen
            onLoginSuccess={onLoginSuccess}
            onGoSignup={() => setActiveScreen('signup')}
            onGoForgotPassword={() =>
              setActiveScreen('forgot_password')
            }
          />
        )}

        {activeScreen === 'forgot_password' && (
          <ForgotPasswordScreen
            onGoLogin={() => setActiveScreen('login')}
          />
        )}

        {activeScreen === 'terms' && (
          <TermsScreen
            onReturnToSignup={() => setActiveScreen('signup')}
          />
        )}

        {activeScreen === 'privacy' && (
          <PrivacyScreen
            onReturnToSignup={() => setActiveScreen('signup')}
          />
        )}

        {activeScreen === 'about' && (
          <AboutScreen
            onReturnToLanding={() =>
              setActiveScreen('landing')
            }
          />
        )}
      </main>

      {/* Tiny Footer */}
      <footer className="bg-zinc-950 py-4 border-t border-zinc-800 text-center text-white/50 text-[10px] font-mono">
        <p className="flex items-center justify-center gap-1 min-h-[16px]">
          <span>{footerText}</span>
          <span className="animate-pulse">|</span>
        </p>
      </footer>
    </div>
  );
}