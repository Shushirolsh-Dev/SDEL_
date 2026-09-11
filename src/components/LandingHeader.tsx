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
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={onGoLanding}
          className="flex items-center gap-2 font-mono text-base font-bold tracking-wider text-zinc-950 cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-zinc-950" />
          <span>{strings.brand}</span>
        </button>

        <div className="flex items-center gap-2">
          {activeScreen === 'landing' ? (
            <>
              <button
                onClick={onGoLogin}
                className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {strings.signIn}
              </button>
              <button
                onClick={onGoSignup}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-950 text-white border border-zinc-950 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {strings.joinFree}
              </button>
            </>
          ) : (
            <button
              onClick={onBack}
              className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
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