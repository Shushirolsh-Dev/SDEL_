import React from 'react';
import { Monitor, Check } from 'lucide-react';

type Theme = 'system' | 'dark';

interface SettingsThemeSectionProps {
  theme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

const SettingsThemeSection: React.FC<SettingsThemeSectionProps> = ({
  theme,
  onSelectTheme,
}) => {
  return (
    <section
      id="settings-theme-section"
      className="mb-5 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-900">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            Appearance
          </p>

          <h2 className="mt-1 text-base font-bold text-zinc-950 dark:text-white">
            Theme
          </h2>
        </div>

        <Monitor className="h-5 w-5 text-zinc-400" />
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectTheme('system')}
            className={`group flex items-center justify-between border px-5 py-4 text-left transition-colors ${
              theme === 'system'
                ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <div>
              <span className="block text-sm font-bold">System</span>

              <span
                className={`mt-0.5 block text-xs ${
                  theme === 'system'
                    ? 'text-white/60 dark:text-zinc-950/60'
                    : 'text-zinc-400'
                }`}
              >
                Follow your device
              </span>
            </div>

            {theme === 'system' && <Check className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => onSelectTheme('dark')}
            className={`group flex items-center justify-between border px-5 py-4 text-left transition-colors ${
              theme === 'dark'
                ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <div>
              <span className="block text-sm font-bold">Dark</span>

              <span
                className={`mt-0.5 block text-xs ${
                  theme === 'dark'
                    ? 'text-white/60 dark:text-zinc-950/60'
                    : 'text-zinc-400'
                }`}
              >
                Always use dark mode
              </span>
            </div>

            {theme === 'dark' && <Check className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SettingsThemeSection;