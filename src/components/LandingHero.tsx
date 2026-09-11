import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface HeroStrings {
  eyebrow: string;
  replacesLabel: string;
  headlineLine1: string;
  headlineLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustRealTime: string;
  trustOffline: string;
  trustNoAds: string;
}

interface LandingHeroProps {
  currentText: string;
  strings: HeroStrings;
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
    <section className="relative mx-auto max-w-3xl">
      {/* Eyebrow */}
      <div className="mb-8 flex items-center justify-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-400">
          {strings.eyebrow}
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-center text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] text-zinc-950 sm:text-7xl">
        {strings.headlineLine1}
        <br />
        <span className="text-zinc-300">
          {strings.headlineLine2}
        </span>
      </h1>

      {/* Replaces ticker */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-zinc-200" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
          {strings.replacesLabel}
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-zinc-950">
          {currentText}
          <span className="ml-0.5 inline-block w-[0.6ch] animate-pulse text-zinc-400">
            |
          </span>
        </span>
        <span className="h-px w-10 bg-zinc-200" />
      </div>

      {/* Subtitle */}
      <p className="mx-auto mt-10 max-w-xl text-center text-base leading-relaxed text-zinc-600">
        {strings.subtitle}
      </p>

      {/* CTAs */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onGoSignup}
          className="group inline-flex w-full items-center justify-center gap-2 border border-zinc-950 bg-zinc-950 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-zinc-800 sm:w-auto"
        >
          {strings.ctaPrimary}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onGoLogin}
          className="inline-flex w-full items-center justify-center border border-zinc-300 bg-transparent px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-zinc-950 transition-colors hover:border-zinc-900 sm:w-auto"
        >
          {strings.ctaSecondary}
        </button>
      </div>

      {/* Trust row — text only, no card, no box */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
          {strings.trustRealTime}
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
          {strings.trustOffline}
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
          {strings.trustNoAds}
        </span>
      </div>
    </section>
  );
};

export default LandingHero;