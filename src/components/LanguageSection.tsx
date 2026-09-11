import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { AVAILABLE_LOCALES } from '../i18n/strings';

interface LanguageSectionProps {
  locale: string;
  onChange: (code: string) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  locale,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const current =
    AVAILABLE_LOCALES.find((l) => l.code === locale) ??
    AVAILABLE_LOCALES[0];

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
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          Display language
        </label>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-left text-sm font-semibold text-zinc-950 outline-none transition-all hover:border-zinc-300 focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700"
          >
            <span>{current?.nativeName ?? locale}</span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>

          {open && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              {AVAILABLE_LOCALES.map((l) => {
                const isActive = l.code === locale;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onChange(l.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-100 font-bold text-zinc-950 dark:bg-zinc-900 dark:text-white'
                        : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span>{l.nativeName}</span>
                    {isActive && (
                      <Check className="h-4 w-4 text-zinc-950 dark:text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
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