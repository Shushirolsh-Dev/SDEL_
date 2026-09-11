import React from 'react';
import { BookOpen, Shield, Terminal } from 'lucide-react';
import { User, Role } from '../types';
import type { HeaderStrings } from '../i18n/types.app';

interface AppHeaderProps {
  user: User;
  currentUserRole: Role;
  pendingSyncCount: number;
  strings: HeaderStrings;
  onGoHome: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  currentUserRole,
  pendingSyncCount,
  strings,
  onGoHome,
}) => {
  return (
    <header
      className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30"
      id="thesdel-header"
    >
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onGoHome}
        >
          <BookOpen className="w-5 h-5 text-zinc-950 dark:text-zinc-50 shrink-0" />
          <span className="font-mono text-base font-bold tracking-wider text-zinc-950 dark:text-zinc-100">
            {strings.brand}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pendingSyncCount > 0 ? (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono border border-amber-200 dark:border-amber-950/40 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">
                {strings.syncPending}
              </span>{' '}
              <span>{pendingSyncCount}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono border border-emerald-200 dark:border-emerald-950/40 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{strings.syncSynced}</span>
            </div>
          )}

          {((user.role as string) === 'admin' ||
            (user.role as string) === 'investor') && (
            <button
              onClick={() => {
                window.location.hash = '#/admin';
              }}
              className="flex items-center gap-1.5 text-xs font-mono border border-zinc-900 bg-zinc-950 hover:bg-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-2.5 py-1 text-white transition-all cursor-pointer font-bold"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{strings.console}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-mono border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-950">
            <Shield className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">
              {currentUserRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;