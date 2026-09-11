import React from 'react';
import { BookOpen } from 'lucide-react';
import type { LandingHeaderStrings } from './LandingView';

type Screen =
  | 'landing'
  | 'login'
  | 'signup'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'forgot_password';

interface LandingHeaderProps {
  activeScreen: Screen;
  strings: LandingHeaderStrings;
  onGoLanding: () => void;
  onGoLogin: () => void;
  onGoSignup: () => void;
  onBack: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  activeScreen,
  strings,
  onGoLanding,
  onGoLogin,
  onGoSignup,
  onBack,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={onGoLanding}
          className="flex items-center gap-3 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <BookOpen className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.16em] text-zinc-950 dark:text-white">
            {strings.brand}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {activeScreen === 'landing' ? (
            <>
              <button
                onClick={onGoLogin}
                className="rounded-lg px-3.5 py-2 font-mono text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white cursor-pointer"
              >
                {strings.signIn}
              </button>
              <button
                onClick={onGoSignup}
                className="rounded-lg bg-zinc-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 cursor-pointer"
              >
                {strings.joinFree}
              </button>
            </>
          ) : (
            <button
              onClick={onBack}
              className="rounded-lg border border-zinc-200 px-3.5 py-2 font-mono text-xs font-bold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white cursor-pointer"
            >
              {activeScreen === 'forgot_password'
                ? strings.backToLogin
                : strings.backToHome}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;