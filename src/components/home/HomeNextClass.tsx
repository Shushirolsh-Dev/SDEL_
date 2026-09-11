import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { HomeNextClassStrings } from '../../i18n/types.app';

interface NextClass {
  courseCode?: string;
  subject?: string;
  startTime: string;
  endTime: string;
  venue?: string;
}

interface HomeNextClassProps {
  strings: HomeNextClassStrings;
  nextClass: NextClass | null;
  isLive: boolean;
  liveCountdown: string;
}

const HomeNextClass: React.FC<HomeNextClassProps> = ({
  strings,
  nextClass,
  isLive,
  liveCountdown,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {isLive
                  ? strings.liveClassLabel
                  : strings.nextClassLabel}
              </span>

              {isLive && (
                <span className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </div>

            {nextClass ? (
              <>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {nextClass.courseCode ||
                    nextClass.subject ||
                    strings.fallbackClassName}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {nextClass.startTime} – {nextClass.endTime}
                  </span>

                  {nextClass.venue && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {nextClass.venue}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {strings.noMoreClassesTitle}
                </h2>

                <p className="mt-3 text-sm text-zinc-400">
                  {strings.noMoreClassesSubtitle}
                </p>
              </>
            )}
          </div>

          <div className="shrink-0">
            <p className="text-sm font-semibold text-amber-400">
              {liveCountdown}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeNextClass;