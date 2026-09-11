import React from 'react';
import { Bell, ArrowLeft, RefreshCw } from 'lucide-react';
import type { NotificationsHeaderStrings } from '../../i18n/types.app';

interface NotificationsHeaderProps {
  strings: NotificationsHeaderStrings;
  isRefreshing: boolean;
  onBack: () => void;
  onRefresh?: () => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  strings,
  isRefreshing,
  onBack,
  onRefresh,
}) => {
  return (
    <header
      id="notifications-header"
      className="mb-5 flex items-center justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onBack}
          title={strings.backTitle}
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Bell className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
              {strings.title}
            </h1>

            <p className="text-[11px] text-zinc-500">
              {strings.subtitle}
            </p>
          </div>
        </div>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title={strings.refreshButton}
          className="flex h-9 items-center gap-2 border border-zinc-200 bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />

          <span className="hidden sm:inline">
            {isRefreshing
              ? strings.refreshingButton
              : strings.refreshButton}
          </span>
        </button>
      )}
    </header>
  );
};

export default NotificationsHeader;