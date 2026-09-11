import React from 'react';
import { Globe } from 'lucide-react';
import { AVAILABLE_LOCALES } from '../i18n/strings';

interface LanguageSectionProps {
  locale: string;
  onChange: (code: string) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  locale,
  onChange,
}) => {
  return (
    <section
      id="settings-language-section"
      className="mb-5 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-900">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            Preferences
          </p>

          <h2 className="mt-1 text-base font-bold text-zinc-950 dark:text-white">
            Language
          </h2>
        </div>

        <Globe className="h-5 w-5 text-zinc-400" />
      </div>

      <div className="p-6">
        <label
          htmlFor="language-select"
          className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-zinc-500"
        >
          Display language
        </label>

        <div className="relative">
          <select
            id="language-select"
            value={locale}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none border border-zinc-200 bg-zinc-50 py-3.5 pl-4 pr-10 text-sm font-semibold text-zinc-950 outline-none transition-all hover:border-zinc-300 focus:border-zinc-950 focus:bg-white focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700 dark:focus:border-white dark:focus:ring-white"
          >
            {AVAILABLE_LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
            ▾
          </span>
        </div>

        <p className="mt-2 text-xs text-zinc-400">
          The interface will display in this language across the
          app.
        </p>
      </div>
    </section>
  );
};

export default LanguageSection;