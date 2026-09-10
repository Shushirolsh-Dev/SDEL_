import React, { useState } from 'react';
import { User, ClassGroup } from '../types';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import {
  ShieldAlert,
  Trash2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Check,
  Globe,
  Eye,
  EyeOff,
  Monitor,
} from 'lucide-react';
import { trackClick } from '../utils/tracker';

interface SettingsViewProps {
  currentUser: User;
  classes: ClassGroup[];
  onBack?: () => void;
}

export default function SettingsView({
  currentUser,
  classes,
  onBack,
}: SettingsViewProps) {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useAppStore();

  const ownedClasses = classes.filter(
    (c) => c.ownerId === currentUser.id
  );

  const [updatingClassId, setUpdatingClassId] =
    useState<string | null>(null);

  const [isUpdatingGlobal, setIsUpdatingGlobal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');

  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const [deleteError, setDeleteError] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleVisibility = async (
    classId: string,
    currentVisibility: 'public' | 'private'
  ) => {
    const nextVisibility =
      currentVisibility === 'public' ? 'private' : 'public';

    setUpdatingClassId(classId);

    try {
      trackClick('Button: Toggle Class Visibility');

      const { error } = await supabase
        .from('classes')
        .update({ visibility: nextVisibility })
        .eq('id', classId);

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ['classes'],
      });
    } catch (err: any) {
      alert(
        `Failed to update visibility: ${err.message || err}`
      );
    } finally {
      setUpdatingClassId(null);
    }
  };

  const handleGlobalVisibility = async (
    nextVisibility: 'public' | 'private'
  ) => {
    if (ownedClasses.length === 0) {
      alert(
        'You do not own any classes to apply global visibility settings.'
      );
      return;
    }

    const confirmMsg = `Are you sure you want to change all your owned classes to ${nextVisibility.toUpperCase()}?`;

    if (!confirm(confirmMsg)) return;

    setIsUpdatingGlobal(true);

    try {
      trackClick('Button: Toggle Global Visibility');

      const { error } = await supabase
        .from('classes')
        .update({ visibility: nextVisibility })
        .eq('owner_id', currentUser.id);

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ['classes'],
      });

      alert(
        `Success: All your owned classes are now ${nextVisibility}.`
      );
    } catch (err: any) {
      alert(
        `Failed to apply global visibility: ${err.message || err}`
      );
    } finally {
      setIsUpdatingGlobal(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError(
        'Please enter your password to authorize this action.'
      );
      return;
    }

    if (!deleteConfirmed) {
      setDeleteError(
        'You must check the confirmation box to proceed.'
      );
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      trackClick('Button: Delete Account Confirm Attempt');

      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email: currentUser.email,
          password: deletePassword,
        });

      if (authError) {
        setDeleteError(
          'Password verification failed. Please enter your correct current password.'
        );
        setIsDeleting(false);
        return;
      }

      await supabase
        .from('class_members')
        .delete()
        .eq('user_id', currentUser.id);

      await supabase
        .from('pending_removals')
        .delete()
        .eq('user_id', currentUser.id);

      await supabase
        .from('pending_removals')
        .delete()
        .eq('requested_by', currentUser.id);

      await supabase
        .from('attendance_logs')
        .delete()
        .eq('user_id', currentUser.id);

      await supabase
        .from('ad_analytics')
        .delete()
        .eq('user_id', currentUser.id);

      await supabase
        .from('updates')
        .delete()
        .eq('user_id', currentUser.id);

      await supabase
        .from('classes')
        .delete()
        .eq('owner_id', currentUser.id);

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', currentUser.id);

      if (profileError) {
        console.error(
          'Error deleting profile:',
          profileError
        );
        setDeleteError(
          'Failed to delete profile. Please contact support.'
        );
        setIsDeleting(false);
        return;
      }

      const { error: authDeleteError } =
        await supabase.rpc('admin_delete_user', {
          user_id: currentUser.id,
        });

      if (authDeleteError) {
        console.error(
          'Error deleting auth user:',
          authDeleteError
        );
        setDeleteError(
          'Failed to delete auth user. Please contact support.'
        );
        setIsDeleting(false);
        return;
      }

      await supabase.auth.signOut();

      trackClick('Action: Delete Account Success');

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = window.location.origin + '/';
    } catch (err: any) {
      console.error(
        'Unhandled delete account exception:',
        err
      );

      setDeleteError(
        err.message ||
          'An unexpected error occurred during account deletion.'
      );

      setIsDeleting(false);
    }
  };

  return (
<div
  id="settings-view-container"
  className="mx-auto min-h-full w-full max-w-4xl bg-zinc-50 px-4 py-6 dark:bg-black sm:px-6 lg:px-8"
>
  {/* HEADER */}
  <header className="mb-8">
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white"
      >
        <span className="text-sm">←</span>
        Profile
      </button>
    )}

    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Account
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Manage your preferences and class controls.
        </p>
      </div>
    </div>
  </header>

  {/* APPEARANCE */}
  <section
    id="settings-theme-section"
    className="mb-5 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
  >
    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-900">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
          Appearance
        </p>

        <h2 className="mt-1 text-sm font-bold text-zinc-950 dark:text-white">
          Theme
        </h2>
      </div>

      <Monitor className="h-4 w-4 text-zinc-400" />
    </div>

    <div className="p-5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setTheme('system');
            document.documentElement.classList.remove('dark');
          }}
          className={`group flex items-center justify-between border px-4 py-3 text-left transition-colors ${
            theme === 'system'
              ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <div>
            <span className="block text-xs font-bold">
              System
            </span>

            <span
              className={`mt-0.5 block text-[9px] ${
                theme === 'system'
                  ? 'text-white/60 dark:text-zinc-950/60'
                  : 'text-zinc-400'
              }`}
            >
              Follow your device
            </span>
          </div>

          {theme === 'system' && (
            <Check className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setTheme('dark');
            document.documentElement.classList.add('dark');
          }}
          className={`group flex items-center justify-between border px-4 py-3 text-left transition-colors ${
            theme === 'dark'
              ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <div>
            <span className="block text-xs font-bold">
              Dark
            </span>

            <span
              className={`mt-0.5 block text-[9px] ${
                theme === 'dark'
                  ? 'text-white/60 dark:text-zinc-950/60'
                  : 'text-zinc-400'
              }`}
            >
              Always use dark mode
            </span>
          </div>

          {theme === 'dark' && (
            <Check className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  </section>

  {/* CLASS VISIBILITY */}
  {currentUser.role === 'representative' && (
    <section
      id="settings-visibility-section"
      className="mb-5 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-900">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Class management
          </p>

          <h2 className="mt-1 text-sm font-bold text-zinc-950 dark:text-white">
            Class visibility
          </h2>
        </div>

        <Globe className="h-4 w-4 text-zinc-400" />
      </div>

      <div className="space-y-5 p-5">
        <p className="max-w-2xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Control whether students can join your classes
          immediately or require approval.
        </p>

        {ownedClasses.length > 0 && (
          <div className="border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Apply to all classes
              </p>

              <p className="mt-0.5 text-[9px] text-zinc-400">
                Change every class you own at once.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() =>
                  handleGlobalVisibility('public')
                }
                disabled={isUpdatingGlobal}
                className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {isUpdatingGlobal ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}

                Public
              </button>

              <button
                type="button"
                onClick={() =>
                  handleGlobalVisibility('private')
                }
                disabled={isUpdatingGlobal}
                className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {isUpdatingGlobal ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}

                Private
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              Your classes
            </p>

            {ownedClasses.length > 0 && (
              <span className="text-[9px] font-medium text-zinc-400">
                {ownedClasses.length}{' '}
                {ownedClasses.length === 1
                  ? 'class'
                  : 'classes'}
              </span>
            )}
          </div>

          {ownedClasses.length === 0 ? (
            <div className="border border-dashed border-zinc-200 px-4 py-6 text-center dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                No classes owned yet.
              </p>

              <p className="mt-1 text-[9px] text-zinc-400">
                Classes you create will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 border border-zinc-200 dark:divide-zinc-900 dark:border-zinc-800">
              {ownedClasses.map((cls) => {
                const visibility =
                  cls.visibility || 'public';
                const isUpdating =
                  updatingClassId === cls.id;

                return (
                  <div
                    key={cls.id}
                    className="flex flex-col gap-3 bg-white px-4 py-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-950 dark:hover:bg-zinc-900/50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-xs font-bold text-zinc-950 dark:text-white">
                          {cls.name}
                        </h3>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            visibility === 'private'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}
                        >
                          {visibility === 'private' ? (
                            <EyeOff className="h-2.5 w-2.5" />
                          ) : (
                            <Eye className="h-2.5 w-2.5" />
                          )}

                          {visibility}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] text-zinc-400">
                        Join code ·{' '}
                        <span className="font-mono">
                          {cls.code}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisibility(
                          cls.id,
                          visibility
                        )
                      }
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 border border-zinc-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Updating
                        </>
                      ) : visibility === 'public' ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Make private
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
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
  )}
      {/* DANGER ZONE */}
      <section
        id="settings-danger-section"
        className="mb-8 overflow-hidden border border-red-200/70 bg-white dark:border-red-950/70 dark:bg-zinc-950"
      >
        <div className="flex items-center gap-3 border-b border-red-100 px-5 py-4 dark:border-red-950/60">
          <div className="flex h-8 w-8 items-center justify-center border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20">
            <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">
              Account
            </p>

            <h2 className="mt-1 text-sm font-bold text-zinc-950 dark:text-white">
              Danger zone
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              Delete your account
            </p>

            <p className="mt-1 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Permanently remove your account, classes, memberships,
              attendance records and related data.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-red-200 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete account
          </button>
        </div>
      </section>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          id="delete-account-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isDeleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-zinc-100 px-5 py-5 dark:border-zinc-900">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">
                    Permanent action
                  </p>

                  <h2 className="mt-1 text-base font-bold tracking-tight text-zinc-950 dark:text-white">
                    Delete account?
                  </h2>

                  <p className="mt-1 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    This action cannot be undone. Your account and
                    associated data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="delete-password"
                  className="mb-2 block text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
                >
                  Confirm with password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

                  <input
                    id="delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(event) =>
                      setDeletePassword(event.target.value)
                    }
                    disabled={isDeleting}
                    placeholder="Enter your password"
                    className="w-full border border-zinc-200 bg-zinc-50 py-3 pl-9 pr-3 text-xs text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-500"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-black">
                <input
                  type="checkbox"
                  checked={deleteConfirmed}
                  onChange={(event) =>
                    setDeleteConfirmed(event.target.checked)
                  }
                  disabled={isDeleting}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-red-600"
                />

                <span className="text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  I understand that deleting my account is permanent
                  and cannot be undone.
                </span>
              </label>

              {deleteError && (
                <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-3 dark:border-red-950 dark:bg-red-950/20">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />

                  <p className="text-[10px] leading-relaxed text-red-700 dark:text-red-400">
                    {deleteError}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteConfirmed(false);
                    setDeleteError('');
                  }}
                  disabled={isDeleting}
                  className="border border-zinc-200 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeleting ||
                    !deletePassword ||
                    !deleteConfirmed
                  }
                  className="inline-flex items-center justify-center gap-2 border border-red-600 bg-red-600 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer
        id="settings-footer"
        className="border-t border-zinc-200 py-5 text-center dark:border-zinc-900"
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400">
          Settings
        </p>

        <p className="mt-1 text-[9px] text-zinc-400">
          Manage your account and preferences.
        </p>
      </footer>
    </div>
  );
}

export default SettingsView;