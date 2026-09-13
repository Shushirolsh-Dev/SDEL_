import React, { useState, useEffect } from 'react';
import { Globe, Check, ChevronDown, X } from 'lucide-react';
import { AVAILABLE_LOCALES } from '../../i18n/strings';
import type { SettingsLanguageStrings } from '../../i18n/types.app';

interface SettingsLanguageSectionProps {
  locale: string;
  strings: SettingsLanguageStrings;
  onChange: (code: string) => void;
}

const SettingsLanguageSection: React.FC<
  SettingsLanguageSectionProps
> = ({ locale, strings, onChange }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const current =
    AVAILABLE_LOCALES.find((l) => l.code === locale) ??
    AVAILABLE_LOCALES[0];

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <>
      <section
        id="settings-language-section"
        className="border-b border-zinc-200 py-6 dark:border-zinc-800"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <Globe className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
              {strings.title}
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {strings.hint}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left transition-all hover:border-zinc-300 active:scale-[0.995] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
        >
          <span className="text-sm font-semibold text-zinc-950 dark:text-white">
            {current?.nativeName ?? locale}
          </span>

          <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      </section>

      {/* Bottom Sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="relative w-full max-w-lg rounded-t-3xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-900">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                {strings.dropdownLabel}
              </h3>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Options list — max 6 visible, scroll for more */}
            <div
              className="overflow-y-auto px-2 py-2"
              style={{ maxHeight: 'min(60vh, 420px)' }}
            >
              {AVAILABLE_LOCALES.map((l) => {
                const isActive = l.code === locale;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelect(l.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-900'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isActive
                          ? 'font-bold text-zinc-950 dark:text-white'
                          : 'font-medium text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {l.nativeName}
                    </span>

                    {isActive && (
                      <Check className="h-4 w-4 shrink-0 text-zinc-950 dark:text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Safe area spacer for iOS */}
            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsLanguageSection;