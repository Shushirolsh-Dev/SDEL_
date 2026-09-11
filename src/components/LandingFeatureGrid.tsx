import React from 'react';
import { Calendar, Clock, Shield } from 'lucide-react';
import { LandingFeatureGridStrings } from '../i18n/landing';

interface LandingFeatureGridProps {
  strings: LandingFeatureGridStrings;
}

const LandingFeatureGrid: React.FC<LandingFeatureGridProps> = ({
  strings,
}) => {
  return (
    <div>
      <p className="mb-6 text-center font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400">
        {strings.sectionLabel}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Step 1 */}
        <div className="border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center border border-zinc-900 bg-zinc-50 font-mono text-xs font-bold text-zinc-900 dark:border-white dark:bg-zinc-900 dark:text-white">
              01
            </span>
            <Calendar className="h-4 w-4 text-zinc-400" />
          </div>

          <h3 className="mb-2 text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
            {strings.step1Title}
          </h3>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {strings.step1Body}
          </p>
        </div>

        {/* Step 2 */}
        <div className="border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center border border-zinc-900 bg-zinc-50 font-mono text-xs font-bold text-zinc-900 dark:border-white dark:bg-zinc-900 dark:text-white">
              02
            </span>
            <Clock className="h-4 w-4 text-zinc-400" />
          </div>

          <h3 className="mb-2 text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
            {strings.step2Title}
          </h3>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {strings.step2Body}
          </p>
        </div>

        {/* Step 3 */}
        <div className="border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center border border-zinc-900 bg-zinc-50 font-mono text-xs font-bold text-zinc-900 dark:border-white dark:bg-zinc-900 dark:text-white">
              03
            </span>
            <Shield className="h-4 w-4 text-zinc-400" />
          </div>

          <h3 className="mb-2 text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
            {strings.step3Title}
          </h3>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {strings.step3Body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingFeatureGrid;