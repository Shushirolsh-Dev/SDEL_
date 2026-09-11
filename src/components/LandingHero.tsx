import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { LandingHeroStrings } from '../i18n/types.landing';

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
    <div className="mx-auto max-w-3xl text-center">
      {/* Ticker */}
      <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
          Replaces
        </span>
        <span className="font-mono text-xs font-bold tabular-nums text-zinc-950 dark:text-white">
          {currentText}
          <span className="ml-0.5 inline-block w-[0.6ch] animate-pulse text-zinc-400">
            |
          </span>
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.035em] text-zinc-950 dark:text-white sm:text-7xl">
        {strings.headlinePrefix}
        <br />
        <span className="text-zinc-400 dark:text-zinc-500">
          {strings.headlineSuffix}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {strings.subtitle}
      </p>

      {/* CTAs */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onGoSignup}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:w-auto"
        >
          {strings.ctaPrimary}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onGoLogin}
          className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-200 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-zinc-950 transition-colors hover:border-zinc-950 dark:border-zinc-800 dark:text-white dark:hover:border-white sm:w-auto"
        >
          {strings.ctaSecondary}
        </button>
      </div>
    </div>
  );
};

export default LandingHero;