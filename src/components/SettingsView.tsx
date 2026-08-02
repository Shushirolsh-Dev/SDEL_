import React, { useState } from 'react';
import { User, ClassGroup } from '../types';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Trash2, AlertTriangle, Lock, RefreshCw, Eye, EyeOff, Check, Globe, HelpCircle } from 'lucide-react';
import { trackClick } from '../utils/tracker';

interface SettingsViewProps {
  currentUser: User;
  classes: ClassGroup[];
  onBack?: () => void;
}

export default function SettingsView({ currentUser, classes, onBack }: SettingsViewProps) {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useAppStore();

  const ownedClasses = classes.filter((c) => c.ownerId === currentUser.id);

  const [updatingClassId, setUpdatingClassId] = useState<string | null>(null);
  const [isUpdatingGlobal, setIsUpdatingGlobal] = useState(false);

  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmCheckbox, setDeleteConfirmCheckbox] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const handleToggleVisibility = async (classId: string, currentVisibility: 'public' | 'private') => {
    const nextVisibility = currentVisibility === 'public' ? 'private' : 'public';
    setUpdatingClassId(classId);
    try {
      trackClick('Button: Toggle Class Visibility');
      const { error } = await supabase
        .from('classes')
        .update({ visibility: nextVisibility })
        .eq('id', classId);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['classes'] });
    } catch (err: any) {
      alert(`Failed to update visibility: ${err.message || err}`);
    } finally {
      setUpdatingClassId(null);
    }
  };

  const handleGlobalVisibility = async (nextVisibility: 'public' | 'private') => {
    if (ownedClasses.length === 0) {
      alert("You do not own any classes to apply global visibility settings.");
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
      
      await queryClient.invalidateQueries({ queryKey: ['classes'] });
      alert(`Success: All your owned classes are now ${nextVisibility}.`);
    } catch (err: any) {
      alert(`Failed to apply global visibility: ${err.message || err}`);
    } finally {
      setIsUpdatingGlobal(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to authorize this action.');
      return;
    }
    if (!deleteConfirmCheckbox) {
      setDeleteError('You must check the confirmation box to proceed.');
      return;
    }

    setIsSubmittingDelete(true);
    setDeleteError('');

    try {
      trackClick('Button: Delete Account Confirm Attempt');

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: deletePassword,
      });

      if (authError) {
        setDeleteError('Password verification failed. Please enter your correct current password.');
        setIsSubmittingDelete(false);
        return;
      }

      await supabase.from('class_members').delete().eq('user_id', currentUser.id);
      await supabase.from('pending_removals').delete().eq('user_id', currentUser.id);
      await supabase.from('pending_removals').delete().eq('requested_by', currentUser.id);
      await supabase.from('attendance_logs').delete().eq('user_id', currentUser.id);
      await supabase.from('ad_analytics').delete().eq('user_id', currentUser.id);
      await supabase.from('updates').delete().eq('user_id', currentUser.id);
      await supabase.from('classes').delete().eq('owner_id', currentUser.id);

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', currentUser.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        setDeleteError('Failed to delete profile. Please contact support.');
        setIsSubmittingDelete(false);
        return;
      }

      const { error: authDeleteError } = await supabase.rpc('admin_delete_user', {
        user_id: currentUser.id
      });

      if (authDeleteError) {
        console.error('Error deleting auth user:', authDeleteError);
        setDeleteError('Failed to delete auth user. Please contact support.');
        setIsSubmittingDelete(false);
        return;
      }

      await supabase.auth.signOut();

      trackClick('Action: Delete Account Success');

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = window.location.origin + '/';

    } catch (err: any) {
      console.error('Unhandled delete account exception:', err);
      setDeleteError(err.message || 'An unexpected error occurred during account deletion.');
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="settings-view-container">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-250 dark:border-zinc-800 hover:border-zinc-850 dark:hover:border-zinc-300 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-mono text-xs font-bold transition-all bg-white dark:bg-zinc-900 cursor-pointer"
          >
            ← Back to Profile
          </button>
        </div>
      )}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-none space-y-4" id="settings-theme-section">
        <div className="border-b border-zinc-150 dark:border-zinc-800 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
            App Visual Theme
          </h3>
          <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-0.5 font-bold border border-zinc-200 dark:border-zinc-700">
            {theme === 'dark' ? 'Dark Theme' : 'System Theme'}
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
          Choose between our focused dark theme or respect your operating system's settings (where light theme acts as the default).
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setTheme('system');
              document.documentElement.classList.remove('dark');
            }}
            className={`p-4 border text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-none ${
              theme === 'system'
                ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <span>System Default</span>
            <span className="text-[9px] font-sans font-normal opacity-75">Light is default fallback</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              document.documentElement.classList.add('dark');
            }}
            className={`p-4 border text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-none ${
              theme === 'dark'
                ? 'border-zinc-950 dark:border-zinc-100 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-[1px_1px_0px_rgba(0,0,0,0.15)]'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <span>Dark Mode</span>
            <span className="text-[9px] font-sans font-normal opacity-75">Always high-contrast dark</span>
          </button>
        </div>
      </div>

      {currentUser.role === 'representative' && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-none space-y-5" id="settings-visibility-section">
          <div className="border-b border-zinc-150 dark:border-zinc-800 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
              Class Group Visibility
            </h3>
            <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 px-2.5 py-0.5 font-bold border border-zinc-200 dark:border-zinc-700">
              Representative Controls
            </span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
            As a verified Class Representative, you can set classes to <strong>Public</strong> (anyone can join immediately using the code) or <strong>Private</strong> (students are marked as "pending" until approved by you or your assistant roster).
          </p>

          {ownedClasses.length > 0 && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
                ⚡ Global Bulk Visibility Actions:
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleGlobalVisibility('public')}
                  disabled={isUpdatingGlobal}
                  className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-950 dark:hover:border-zinc-100 font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingGlobal ? 'Updating...' : 'Set All to Public'}
                </button>
                <button
                  type="button"
                  onClick={() => handleGlobalVisibility('private')}
                  disabled={isUpdatingGlobal}
                  className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-950 dark:hover:border-zinc-100 font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingGlobal ? 'Updating...' : 'Set All to Private'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3.5">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500 block">
              Individual Class Visibility:
            </span>

            {ownedClasses.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-sans italic">
                You do not currently own any classes. Created classes will appear here automatically.
              </p>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-850 border border-zinc-200 dark:border-zinc-800">
                {ownedClasses.map((cls) => {
                  const visibility = cls.visibility || 'public';
                  const isUpdating = updatingClassId === cls.id;

                  return (
                    <div key={cls.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900">
                      <div>
                        <span className="font-bold text-zinc-950 dark:text-zinc-50 text-sm font-sans block">{cls.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5">Code: {cls.code}</span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                            visibility === 'private'
                              ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                              : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                          }`}>
                            {visibility}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(cls.id, visibility)}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 border font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer rounded-none ${
                          visibility === 'public'
                            ? 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                            : 'border-emerald-600 dark:border-emerald-500 hover:bg-emerald-650 text-emerald-650 dark:text-emerald-400'
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : visibility === 'public' ? (
                          <span>Make Private</span>
                        ) : (
                          <span>Make Public</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border border-red-200 dark:border-red-950 bg-red-50/10 dark:bg-red-950/5 p-6 md:p-8 rounded-none space-y-4 font-mono text-xs" id="settings-danger-zone">
        <div className="border-b border-red-150 dark:border-red-900/40 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-red-800 dark:text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
            Danger Zone
          </h3>
          <span className="text-[10px] uppercase bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 px-2 py-0.5 font-bold border border-red-200 dark:border-red-900/40">
            Irreversible Actions
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block font-sans">Permanently Expunge Account</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-sans block leading-relaxed max-w-xl">
              Permanently delete your profile, remove yourself from all academic groups, and revoke all active WhatsApp summary reminders. This action cannot be undone.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              trackClick('Button: Delete Account Init');
              setDeletePassword('');
              setDeleteConfirmCheckbox(false);
              setDeleteError('');
              setIsDeleteAccountOpen(true);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold border border-red-750 transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account...
          </button>
        </div>
      </div>

      {isDeleteAccountOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" id="account-deletion-modal">
          <div className="bg-white dark:bg-zinc-900 border border-red-300 dark:border-red-950 p-6 max-w-md w-full shadow-xl space-y-5 animate-fade-in text-xs">
            
            <div className="border-b border-red-150 dark:border-red-900 pb-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-red-600 dark:text-red-500 font-bold">
                Critical Danger Operation
              </span>
              <h3 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-zinc-100 mt-1 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-500 animate-pulse" />
                Delete Academic Account
              </h3>
            </div>

            <div className="p-3 border border-red-200 dark:border-red-900/30 bg-red-50/55 dark:bg-red-950/10 text-zinc-700 dark:text-zinc-300 space-y-2">
              <strong className="block text-red-800 dark:text-red-400 font-mono text-[10px] uppercase tracking-wider">
                ⚠️ Account Deletion Disclaimer:
              </strong>
              <p className="font-sans leading-relaxed text-[11px]">
                By completing this action, you understand and explicitly agree to the following terms:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] font-sans">
                <li>Your student record, schedule history, and registered WhatsApp channels will be **permanently expunged** from Sdel's databases.</li>
                <li>Your attendance check-in logs and accumulated study streak metrics will be **irrecoverably destroyed**.</li>
                <li>You will be immediately logged out and your current device sessions will be deleted.</li>
              </ul>
            </div>

            {deleteError && (
              <div className="p-3 border border-red-250 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Re-enter Account Password
                </label>
                <input
                  id="delete-account-password"
                  type="password"
                  placeholder="Type password to authorize"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError('');
                  }}
                  disabled={isSubmittingDelete}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-none focus:outline-none focus:border-red-600 dark:focus:border-red-550 font-mono text-xs"
                />
              </div>

              <label className="flex items-start gap-2.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                <input
                  id="delete-account-checkbox"
                  type="checkbox"
                  checked={deleteConfirmCheckbox}
                  onChange={(e) => {
                    setDeleteConfirmCheckbox(e.target.checked);
                    setDeleteError('');
                  }}
                  disabled={isSubmittingDelete}
                  className="mt-0.5 accent-red-600"
                />
                <span className="font-sans text-[11px] text-zinc-600 dark:text-zinc-400 select-none">
                  I understand that this action is final and my academic records cannot be recovered.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 font-mono">
              <button
                onClick={() => setIsDeleteAccountOpen(false)}
                disabled={isSubmittingDelete}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-600 dark:hover:border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteAccount}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingDelete ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}