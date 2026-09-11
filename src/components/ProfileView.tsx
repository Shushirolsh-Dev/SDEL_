import React from 'react';
import { User, ClassGroup } from '../types';
import { LogOut, Settings } from 'lucide-react';
import { trackClick } from '../utils/tracker';
import type { ProfileStrings } from '../i18n/types.app';

interface ProfileViewProps {
  currentUser: User;
  joinedClasses: ClassGroup[];
  strings: ProfileStrings;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

export default function ProfileView({
  currentUser,
  joinedClasses,
  strings,
  onLogout,
  onOpenSettings,
}: ProfileViewProps) {
  const handleLogout = () => {
    trackClick('Button: Log Out');
    if (onLogout) {
      onLogout();
    }
  };

  const role =
    (currentUser as any).role ||
    (currentUser as any).user_role ||
    strings.roleFallback;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-700 dark:text-zinc-300">
              {currentUser.name
                ? currentUser.name.charAt(0).toUpperCase()
                : 'S'}
            </div>

            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {currentUser.name || strings.studentFallback}
              </h1>

              {currentUser.username && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  @{currentUser.username}
                </p>
              )}

              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider font-bold">
                {role}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-zinc-500" />

                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {strings.settingsButton}
                </span>
              </div>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 text-left border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-zinc-500" />

              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {strings.logoutButton}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}