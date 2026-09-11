import React from 'react';
import { Calendar, Clock, ShieldCheck } from 'lucide-react';

export interface Pillar {
  number: string;
  title: string;
  body: string;
}

export interface PillarsStrings {
  sectionLabel: string;
  pillars: Pillar[];
}

interface LandingPillarsProps {
  strings: PillarsStrings;
}

const ICONS = [Calendar, Clock, ShieldCheck];

const LandingPillars: React.FC<LandingPillarsProps> = ({
  strings,
}) => {
  return (
    <section className="mx-auto max-w-5xl">
      {/* Section header — no card, just a labeled rule */}
      <div className="mb-16 flex items-center gap-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-400">
          {strings.sectionLabel}
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Pillars — three columns, no boxes, no borders */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
        {strings.pillars.map((pillar, i) => {
          const Icon = ICONS[i] ?? Calendar;

          return (
            <div key={pillar.number} className="flex flex-col">
              {/* Top: number + icon, mono, tight */}
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-zinc-300">
                  {pillar.number}
                </span>
                <Icon
                  className="h-5 w-5 text-zinc-400"
                  strokeWidth={1.75}
                />
              </div>

              {/* Divider rule under header, still no card */}
              <span className="mb-6 block h-px w-full bg-zinc-200" />

              {/* Title */}
              <h3 className="mb-3 text-lg font-bold tracking-tight text-zinc-950">
                {pillar.title}
              </h3>

              {/* Body */}
              <p className="text-sm leading-relaxed text-zinc-500">
                {pillar.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingPillars;