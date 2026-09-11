import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LandingHeroStrings } from '../i18n/landing';

interface LandingHeroProps {
  currentText: string;
  strings: LandingHeroStrings;
  onGoSignup: () => void;
  onGoLogin: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({
  currentText,
  strings,
  onGoSignup,
  onGoLogin,
}) => {
  return (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-zinc-200 bg-white text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {strings.badge}
      </span>
      <h1 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tight text-zinc-900 leading-tight">
        {strings.headlinePrefix}{' '}
        <span className="inline-block text-center font-mono text-zinc-950 w-[5.5em]">
          {currentText}
          <span className="text-zinc-400 animate-pulse font-normal">
            |
          </span>
        </span>{' '}
        {strings.headlineSuffix}
      </h1>
      <p className="text-sm sm:text-base text-zinc-600 font-sans max-w-xl mx-auto leading-relaxed">
        {strings.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onGoSignup}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.15)] border border-zinc-950"
        >
          {strings.ctaPrimary}
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onGoLogin}
          className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 border border-zinc-300 font-mono text-xs font-bold hover:border-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          {strings.ctaSecondary}
        </button>
      </div>
    </div>
  );
};

export default LandingHero;