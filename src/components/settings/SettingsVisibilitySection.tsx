import React from 'react';
import {
  Globe,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { ClassGroup, User } from '../types';

interface SettingsVisibilitySectionProps {
  currentUser: User;
  ownedClasses: ClassGroup[];
  updatingClassId: string | null;
  isUpdatingGlobal: boolean;
  onToggleVisibility: (
    classId: string,
    currentVisibility: 'public' | 'private'
  ) => void;
  onGlobalVisibility: (next: 'public' | 'private') => void;
}

const SettingsVisibilitySection: React.FC<
  SettingsVisibilitySectionProps
> = ({
  currentUser,
  ownedClasses,
  updatingClassId,
  isUpdatingGlobal,
  onToggleVisibility,
  onGlobalVisibility,
}) => {
  if (currentUser.role !== 'representative') return null;

  return (
    <section
      id="settings-visibility-section"
      className="mb-5 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-900">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            Class management
          </p>

          <h2 className="mt-1 text-base font-bold text-zinc-950 dark:text-white">
            Class visibility
          </h2>
        </div>

        <Globe className="h-5 w-5 text-zinc-400" />
      </div>

      <div className="space-y-6 p-6">
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Control whether students can join your classes immediately
          or require approval.
        </p>

        {ownedClasses.length > 0 && (
          <div className="border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Apply to all classes
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Change every class you own at once.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => onGlobalVisibility('public')}
                disabled={isUpdatingGlobal}
                className="flex items-center justify-center gap-2 bg-white px-4 py-4 text-xs font-bold uppercase tracking-wider text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {isUpdatingGlobal ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}

                Public
              </button>

              <button
                type="button"
                onClick={() => onGlobalVisibility('private')}
                disabled={isUpdatingGlobal}
                className="flex items-center justify-center gap-2 bg-white px-4 py-4 text-xs font-bold uppercase tracking-wider text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {isUpdatingGlobal ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}

                Private
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
              Your classes
            </p>

            {ownedClasses.length > 0 && (
              <span className="text-xs font-medium text-zinc-400">
                {ownedClasses.length}{' '}
                {ownedClasses.length === 1 ? 'class' : 'classes'}
              </span>
            )}
          </div>

          {ownedClasses.length === 0 ? (
            <div className="border border-dashed border-zinc-200 px-5 py-8 text-center dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                No classes owned yet.
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Classes you create will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 border border-zinc-200 dark:divide-zinc-900 dark:border-zinc-800">
              {ownedClasses.map((cls) => {
                const visibility = cls.visibility || 'public';
                const isUpdating = updatingClassId === cls.id;

                return (
                  <div
                    key={cls.id}
                    className="flex flex-col gap-4 bg-white px-5 py-5 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-950 dark:hover:bg-zinc-900/50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                          {cls.name}
                        </h3>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            visibility === 'private'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}
                        >
                          {visibility === 'private' ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}

                          {visibility}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-400">
                        Join code ·{' '}
                        <span className="font-mono">{cls.code}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleVisibility(cls.id, visibility)
                      }
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 border border-zinc-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Updating
                        </>
                      ) : visibility === 'public' ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Make private
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Make public
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SettingsVisibilitySection;
