import React, { useState } from 'react';
import { User, ClassGroup } from '../types';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { trackClick } from '../utils/tracker';

import SettingsHeader from './SettingsHeader';
import SettingsThemeSection from './SettingsThemeSection';
import LanguageSection from './LanguageSection';
import SettingsVisibilitySection from './SettingsVisibilitySection';
import SettingsDangerZone from './SettingsDangerZone';
import DeleteAccountModal from './DeleteAccountModal';

interface SettingsViewProps {
  currentUser: User;
  classes: ClassGroup[];
  onBack?: () => void;
  locale: string;
  onChangeLocale: (code: string) => void;
}

export default function SettingsView({
  currentUser,
  classes,
  onBack,
  locale,
  onChangeLocale,
}: SettingsViewProps) {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useAppStore();

  const ownedClasses = classes.filter(
    (c) => c.ownerId === currentUser.id
  );

  const [updatingClassId, setUpdatingClassId] = useState<
    string | null
  >(null);

  const [isUpdatingGlobal, setIsUpdatingGlobal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectTheme = (next: 'system' | 'dark') => {
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteConfirmed(false);
    setDeleteError('');
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

      const { error: authDeleteError } = await supabase.rpc(
        'admin_delete_user',
        {
          user_id: currentUser.id,
        }
      );

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
      className="mx-auto min-h-full w-full max-w-6xl bg-zinc-50 px-4 py-6 dark:bg-black sm:px-6 lg:px-8"
    >
      <SettingsHeader onBack={onBack} />

      <SettingsThemeSection
        theme={theme}
        onSelectTheme={handleSelectTheme}
      />

      <LanguageSection
        locale={locale}
        onChange={onChangeLocale}
      />

      <SettingsVisibilitySection
        currentUser={currentUser}
        ownedClasses={ownedClasses}
        updatingClassId={updatingClassId}
        isUpdatingGlobal={isUpdatingGlobal}
        onToggleVisibility={handleToggleVisibility}
        onGlobalVisibility={handleGlobalVisibility}
      />

      <SettingsDangerZone
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        password={deletePassword}
        confirmed={deleteConfirmed}
        error={deleteError}
        isDeleting={isDeleting}
        onPasswordChange={setDeletePassword}
        onConfirmedChange={setDeleteConfirmed}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
      />

      <footer
        id="settings-footer"
        className="border-t border-zinc-200 py-6 text-center dark:border-zinc-900"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
          Settings
        </p>

        <p className="mt-1 text-xs text-zinc-400">
          Manage your account and preferences.
        </p>
      </footer>
    </div>
  );
}