import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  currentText: string;
  onGoSignup: () => void;
  onGoLogin: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({
  currentText,
  onGoSignup,
  onGoLogin,
}) => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
      {/* STATUS */}
      <div className="mb-7 inline-flex items-center gap-2 border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          Built for university life
        </span>
      </div>

      {/* HEADLINE */}
      <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-zinc-950 sm:text-6xl dark:text-white">
        Your timetable should work
        <br className="hidden sm:block" /> for you, not against you.
      </h1>

      {/* ROTATING LINE */}
      <div className="mt-5 flex min-h-[32px] items-center justify-center">
        <span className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-400 sm:text-base">
          No more
        </span>

        <span className="mx-2 min-w-[145px] font-mono text-sm font-bold uppercase tracking-wider text-zinc-950 sm:text-base dark:text-white">
          {currentText}
          <span className="ml-0.5 font-normal text-zinc-400">
            |
          </span>
        </span>

        <span className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-400 sm:text-base">
          clutter.
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base dark:text-zinc-400">
        THESDEL keeps your university schedule organized in one
        place — helping you stay on top of classes, changes,
        cancellations, and everything that matters around them.
      </p>

      {/* ACTIONS */}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onGoSignup}
          className="group inline-flex w-full items-center justify-center gap-2 border border-zinc-950 bg-zinc-950 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-zinc-800 sm:w-auto dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Create student account

          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={onGoLogin}
          className="w-full border border-zinc-200 bg-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 sm:w-auto dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
        >
          Sign in
        </button>
      </div>

      {/* SMALL FOOTER LINE */}
      <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400">
        One place for your academic schedule
      </p>
    </section>
  );
};

export default LandingHero;