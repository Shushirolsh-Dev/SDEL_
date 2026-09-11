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
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {strings.badge}
      </span>

      <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
        {strings.headlinePrefix}{' '}
        <span className="inline-block w-[5.5em] text-center font-mono text-zinc-900 dark:text-white">
          {currentText}
          <span className="ml-0.5 text-zinc-400 animate-pulse">
            |
          </span>
        </span>{' '}
        {strings.headlineSuffix}
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
        {strings.subtitle}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onGoSignup}
          className="group inline-flex w-full items-center justify-center gap-2 border border-zinc-950 bg-zinc-950 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:w-auto"
        >
          {strings.ctaPrimary}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onGoLogin}
          className="inline-flex w-full items-center justify-center border border-zinc-300 bg-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:border-zinc-900 dark:border-zinc-700 dark:bg-transparent dark:text-white dark:hover:border-white sm:w-auto"
        >
          {strings.ctaSecondary}
        </button>
      </div>
    </div>
  );
};

export default LandingHero;