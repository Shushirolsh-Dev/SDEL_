import React from 'react';
import { Calendar, Clock, ShieldCheck } from 'lucide-react';
import type { LandingFeatureGridStrings } from './LandingView';

interface LandingFeatureGridProps {
  strings: LandingFeatureGridStrings;
}

const ICONS = [Calendar, Clock, ShieldCheck];
const NUMBERS = ['01', '02', '03'];

const LandingFeatureGrid: React.FC<LandingFeatureGridProps> = ({
  strings,
}) => {
  const items = [
    {
      number: NUMBERS[0],
      Icon: ICONS[0],
      title: strings.step1Title,
      body: strings.step1Body,
    },
    {
      number: NUMBERS[1],
      Icon: ICONS[1],
      title: strings.step2Title,
      body: strings.step2Body,
    },
    {
      number: NUMBERS[2],
      Icon: ICONS[2],
      title: strings.step3Title,
      body: strings.step3Body,
    },
  ];

  return (
    <section className="border-t border-zinc-200 pt-16 dark:border-zinc-800">
      {/* Section header — no card, no box */}
      <div className="mb-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">
            {strings.sectionLabel}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            {strings.sectionTitle}
          </h2>
        </div>
      </div>

      {/* Pillars — separated by hairlines between columns, no cards */}
      <div className="grid grid-cols-1 gap-px bg-zinc-200 dark:bg-zinc-800 md:grid-cols-3">
        {items.map(({ number, Icon, title, body }) => (
          <div
            key={number}
            className="flex flex-col bg-white py-10 dark:bg-black md:px-8 md:first:pl-0 md:last:pr-0"
          >
            {/* Icon row */}
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-white">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-zinc-300 dark:text-zinc-700">
                {number}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
              {title}
            </h3>

            {/* Body */}
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatureGrid;