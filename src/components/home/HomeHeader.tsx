import React from 'react';
import { Bell } from 'lucide-react';
import type { HomeHeaderStrings } from '../../i18n/types.app';

interface HomeHeaderProps {
  strings: HomeHeaderStrings;
  greeting: string;
  firstName: string;
  formattedDate: string;
  hasUnread: boolean;
  onOpenNotifications: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  strings,
  greeting,
  firstName,
  formattedDate,
  hasUnread,
  onOpenNotifications,
}) => {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          {strings.todayLabel}
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
          {greeting}, {firstName}.
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {formattedDate}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
        aria-label={strings.openNotifications}
      >
        <Bell className="h-5 w-5" />

        {hasUnread && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
        )}
      </button>
    </header>
  );
};

export default HomeHeader;