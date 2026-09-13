import React from 'react';
import type { SettingsHeaderStrings } from '../../i18n/types.app';

interface SettingsHeaderProps {
  strings: SettingsHeaderStrings;
  onBack?: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  strings,
  onBack,
}) => {
  return (
    <header className="mb-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
        >
          <span className="shrink-0 text-base">←</span>
          <span className="truncate">{strings.backButton}</span>
        </button>
      )}

      <div className="flex min-w-0 items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            {strings.eyebrow}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {strings.title}
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {strings.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;