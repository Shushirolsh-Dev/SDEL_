import React from 'react';

interface TimetableTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const clampHour = (n: number) => Math.max(0, Math.min(23, n));
const clampMinute = (n: number) => Math.max(0, Math.min(59, n));

const TimetableTimeInput: React.FC<TimetableTimeInputProps> = ({
  value,
  onChange,
}) => {
  const [hh, mm] = value.split(':');

  const handleHourChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    if (digits === '') {
      onChange(`00:${mm}`);
      return;
    }
    const n = clampHour(parseInt(digits, 10));
    onChange(`${pad(n)}:${mm}`);
  };

  const handleMinuteChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    if (digits === '') {
      onChange(`${hh}:00`);
      return;
    }
    const n = clampMinute(parseInt(digits, 10));
    onChange(`${hh}:${pad(n)}`);
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        inputMode="numeric"
        value={hh}
        onChange={(e) => handleHourChange(e.target.value)}
        onBlur={() => {
          const n = clampHour(parseInt(hh || '0', 10));
          onChange(`${pad(n)}:${mm}`);
        }}
        maxLength={2}
        className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-2.5 text-center text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
      />
      <span className="text-sm font-bold text-zinc-400">:</span>
      <input
        type="text"
        inputMode="numeric"
        value={mm}
        onChange={(e) => handleMinuteChange(e.target.value)}
        onBlur={() => {
          const n = clampMinute(parseInt(mm || '0', 10));
          onChange(`${hh}:${pad(n)}`);
        }}
        maxLength={2}
        className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-2.5 text-center text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
      />
    </div>
  );
};

export default TimetableTimeInput;