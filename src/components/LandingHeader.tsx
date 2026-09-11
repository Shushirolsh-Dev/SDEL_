import React from 'react';
import { BookOpen } from 'lucide-react';
import { LandingHeaderStrings } from '../i18n/landing';

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
    <header className="border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onGoLanding}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center border border-zinc-900 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950">
            <BookOpen className="h-4 w-4" />
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
                className="px-3.5 py-2 font-mono text-xs font-bold text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              >
                {strings.signIn}
              </button>
              <button
                onClick={onGoSignup}
                className="border border-zinc-950 bg-zinc-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 cursor-pointer"
              >
                {strings.joinFree}
              </button>
            </>
          ) : (
            <button
              onClick={onBack}
              className="border border-zinc-200 px-3.5 py-2 font-mono text-xs font-bold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white cursor-pointer"
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