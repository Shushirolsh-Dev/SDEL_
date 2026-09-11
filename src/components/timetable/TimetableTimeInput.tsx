import React, { useState, useEffect } from 'react';

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
  const [hhRaw, setHhRaw] = useState(value.split(':')[0] ?? '00');
  const [mmRaw, setMmRaw] = useState(value.split(':')[1] ?? '00');

  useEffect(() => {
    const [h, m] = value.split(':');
    setHhRaw(h ?? '00');
    setMmRaw(m ?? '00');
  }, [value]);

  const commitHour = () => {
    const digits = hhRaw.replace(/\D/g, '');
    const n = digits === '' ? 0 : clampHour(parseInt(digits, 10));
    const padded = pad(n);
    setHhRaw(padded);
    onChange(`${padded}:${mmRaw}`);
  };

  const commitMinute = () => {
    const digits = mmRaw.replace(/\D/g, '');
    const n = digits === '' ? 0 : clampMinute(parseInt(digits, 10));
    const padded = pad(n);
    setMmRaw(padded);
    onChange(`${hhRaw}:${padded}`);
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        inputMode="numeric"
        value={hhRaw}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 2);
          setHhRaw(v);
        }}
        onBlur={commitHour}
        maxLength={2}
        placeholder="00"
        className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-2.5 text-center text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
      />
      <span className="text-sm font-bold text-zinc-400">:</span>
      <input
        type="text"
        inputMode="numeric"
        value={mmRaw}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 2);
          setMmRaw(v);
        }}
        onBlur={commitMinute}
        maxLength={2}
        placeholder="00"
        className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-2.5 text-center text-sm font-bold text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500"
      />
    </div>
  );
};

export default TimetableTimeInput;