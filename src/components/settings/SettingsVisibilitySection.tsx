import React, { useState, useEffect } from 'react';
import {
  Globe,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Check,
  ChevronRight,
} from 'lucide-react';
import { ClassGroup, User } from '../../types';
import type { SettingsVisibilityStrings } from '../../i18n/types.app';

interface SettingsVisibilitySectionProps {
  currentUser: User;
  ownedClasses: ClassGroup[];
  updatingClassId: string | null;
  isUpdatingGlobal: boolean;
  strings: SettingsVisibilityStrings;
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
  strings,
  onToggleVisibility,
  onGlobalVisibility,
}) => {
  const [openSheet, setOpenSheet] = useState<
    null | { type: 'global' } | { type: 'class'; classId: string }
  >(null);

  useEffect(() => {
    if (openSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openSheet]);

  if (currentUser.role !== 'representative') return null;

  const activeClass =
    openSheet?.type === 'class'
      ? ownedClasses.find((c) => c.id === openSheet.classId)
      : undefined;

  const handleSelectGlobal = (next: 'public' | 'private') => {
    onGlobalVisibility(next);
    setOpenSheet(null);
  };

  const handleSelectClass = (
    classId: string,
    currentVisibility: 'public' | 'private'
  ) => {
    onToggleVisibility(classId, currentVisibility);
    setOpenSheet(null);
  };

  return (
    <>
      <section
        id="settings-visibility-section"
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
              {strings.subtitle}
            </p>
          </div>
        </div>

        {ownedClasses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 py-6 text-center dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {strings.emptyTitle}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              {strings.emptySubtitle}
            </p>
          </div>
        ) : (
          <>
            {/* Global action row */}
            <button
              type="button"
              onClick={() => setOpenSheet({ type: 'global' })}
              disabled={isUpdatingGlobal}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left transition-all hover:border-zinc-300 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {strings.applyAllTitle}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {strings.applyAllSubtitle}
                </p>
              </div>

              {isUpdatingGlobal ? (
                <RefreshCw className="h-4 w-4 shrink-0 animate-spin text-zinc-400" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
              )}
            </button>

            {/* Per-class list */}
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                {strings.yourClassesLabel}
              </p>

              <span className="text-xs font-medium text-zinc-400">
                {ownedClasses.length}{' '}
                {ownedClasses.length === 1
                  ? strings.classSingular
                  : strings.classPlural}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {ownedClasses.map((cls) => {
                  const visibility = cls.visibility || 'public';
                  const isUpdating = updatingClassId === cls.id;

                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() =>
                        setOpenSheet({
                          type: 'class',
                          classId: cls.id,
                        })
                      }
                      disabled={isUpdating}
                      className="flex w-full items-center justify-between gap-3 bg-white px-4 py-4 text-left transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/50"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
                          {cls.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-zinc-400">
                          {strings.joinCodeLabel}{' '}
                          <span className="font-mono">{cls.code}</span>
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-zinc-400" />
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              visibility === 'private'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                            }`}
                          >
                            {visibility === 'private' ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}

                            {visibility === 'private'
                              ? strings.privateButton
                              : strings.publicButton}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Bottom Sheet — Global */}
      {openSheet?.type === 'global' && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          onClick={() => setOpenSheet(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg rounded-t-3xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-900">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                {strings.applyAllTitle}
              </h3>

              <button
                type="button"
                onClick={() => setOpenSheet(null)}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-2 py-2">
              <button
                type="button"
                onClick={() => handleSelectGlobal('public')}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-zinc-500" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {strings.publicButton}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {strings.applyAllPublicSubtitle}
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGlobal('private')}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-3">
                  <EyeOff className="h-4 w-4 text-zinc-500" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {strings.privateButton}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {strings.applyAllPrivateSubtitle}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="h-6" />
          </div>
        </div>
      )}

      {/* Bottom Sheet — Per Class */}
      {openSheet?.type === 'class' && activeClass && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          onClick={() => setOpenSheet(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg rounded-t-3xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-900">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                  {activeClass.name}
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {strings.joinCodeLabel}{' '}
                  <span className="font-mono">{activeClass.code}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenSheet(null)}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-2 py-2">
              {(() => {
                const currentVis =
                  activeClass.visibility || 'public';

                return (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectClass(activeClass.id, currentVis)
                      }
                      disabled={currentVis === 'public'}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors ${
                        currentVis === 'public'
                          ? 'bg-zinc-100 dark:bg-zinc-900'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-zinc-500" />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                            {strings.publicButton}
                          </p>

                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {strings.classPublicSubtitle}
                          </p>
                        </div>
                      </div>

                      {currentVis === 'public' && (
                        <Check className="h-4 w-4 shrink-0 text-zinc-950 dark:text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectClass(activeClass.id, currentVis)
                      }
                      disabled={currentVis === 'private'}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors ${
                        currentVis === 'private'
                          ? 'bg-zinc-100 dark:bg-zinc-900'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <EyeOff className="h-4 w-4 text-zinc-500" />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                            {strings.privateButton}
                          </p>

                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {strings.classPrivateSubtitle}
                          </p>
                        </div>
                      </div>

                      {currentVis === 'private' && (
                        <Check className="h-4 w-4 shrink-0 text-zinc-950 dark:text-white" />
                      )}
                    </button>
                  </>
                );
              })()}
            </div>

            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsVisibilitySection;