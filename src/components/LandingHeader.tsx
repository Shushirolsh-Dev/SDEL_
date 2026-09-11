import React from 'react';
import { BookOpen } from 'lucide-react';

type Screen =
  | 'landing'
  | 'login'
  | 'signup'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'forgot_password';

export interface HeaderStrings {
  brand: string;
  signIn: string;
  joinFree: string;
  backToLogin: string;
  backToHome: string;
}

interface LandingHeaderProps {
  activeScreen: Screen;
  strings: HeaderStrings;
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
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onGoLanding}
          className="group flex items-center gap-2.5 cursor-pointer"
          aria-label={strings.brand}
        >
          <span className="flex h-7 w-7 items-center justify-center border border-zinc-900 bg-zinc-950 text-white transition-transform group-hover:scale-[1.03]">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.16em] text-zinc-950">
            {strings.brand}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {activeScreen === 'landing' ? (
            <>
              <button
                onClick={onGoLogin}
                className="border border-transparent px-3.5 py-2 font-mono text-xs font-bold text-zinc-600 transition-colors hover:text-zinc-950 cursor-pointer"
              >
                {strings.signIn}
              </button>
              <button
                onClick={onGoSignup}
                className="border border-zinc-950 bg-zinc-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 cursor-pointer"
              >
                {strings.joinFree}
              </button>
            </>
          ) : (
            <button
              onClick={onBack}
              className="border border-zinc-200 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 cursor-pointer"
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