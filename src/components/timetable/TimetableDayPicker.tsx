import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { TimetableDayStrings } from '../../i18n/types.app';

interface TimetableDayPickerProps {
  strings: TimetableDayStrings;
  value: number;
  onChange: (day: number) => void;
}

const TimetableDayPicker: React.FC<TimetableDayPickerProps> = ({
  strings,
  value,
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

  const days = strings.labels.map((label, i) => ({
    value: i + 1,
    label,
  }));

  const current = days.find((d) => d.value === value) ?? days[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-sm text-zinc-900 outline-none transition hover:border-zinc-300 focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-700 dark:focus:border-zinc-500"
      >
        <span>{current?.label ?? ''}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {days.map((day) => {
            const isActive = day.value === value;
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => {
                  onChange(day.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-100 font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white'
                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
                }`}
              >
                <span>{day.label}</span>
                {isActive && (
                  <Check className="h-4 w-4 text-zinc-950 dark:text-white" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimetableDayPicker;