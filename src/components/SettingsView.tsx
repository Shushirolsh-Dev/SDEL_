import React, { useState } from 'react';
import { User, ClassGroup } from '../types';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { trackClick } from '../utils/tracker';
import type { SettingsStrings } from '../i18n/types.app';

import SettingsHeader from './settings/SettingsHeader';
import SettingsThemeSection from './settings/SettingsThemeSection';
import SettingsLanguageSection from './settings/SettingsLanguageSection';
import SettingsVisibilitySection from './settings/SettingsVisibilitySection';
import SettingsDangerZone from './settings/SettingsDangerZone';
import DeleteAccountModal from './settings/DeleteAccountModal';

interface SettingsViewProps {
  currentUser: User;
  classes: ClassGroup[];
  strings: SettingsStrings;
  onBack?: () => void;
  locale: string;
  onChangeLocale: (code: string) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function SettingsView({
  currentUser,
  classes,
  strings,
  onBack,
  locale,
  onChangeLocale,
  onToast,
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
      onToast(
        strings.visibility.alertToggleFailed(
          err.message || String(err)
        ),
        'error'
      );
    } finally {
      setUpdatingClassId(null);
    }
  };

  const handleGlobalVisibility = async (
    nextVisibility: 'public' | 'private'
  ) => {
    if (ownedClasses.length === 0) {
      onToast(strings.visibility.alertGlobalEmpty, 'error');
      return;
    }

    const confirmMsg = strings.visibility.alertGlobalConfirm(
      nextVisibility.toUpperCase()
    );

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

      onToast(
        strings.visibility.alertGlobalSuccess(
          nextVisibility.toUpperCase()
        ),
        'success'
      );
    } catch (err: any) {
      onToast(
        strings.visibility.alertGlobalFailed(
          err.message || String(err)
        ),
        'error'
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
        strings.deleteModal.errorPasswordRequired
      );
      return;
    }

    if (!deleteConfirmed) {
      setDeleteError(
        strings.deleteModal.errorConfirmRequired
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
          strings.deleteModal.errorPasswordIncorrect
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
        setDeleteError(strings.deleteModal.errorProfileDelete);
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
        setDeleteError(strings.deleteModal.errorAuthDelete);
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
        err.message || strings.deleteModal.errorGeneric
      );

      setIsDeleting(false);
    }
  };

  return (
    <div
      id="settings-view-container"
      className="min-h-full w-full"
    >
      <div className="mx-auto w-full max-w-2xl">
        <SettingsHeader strings={strings.header} onBack={onBack} />

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          <SettingsThemeSection
            theme={theme}
            strings={strings.theme}
            onSelectTheme={handleSelectTheme}
          />

          <SettingsLanguageSection
            locale={locale}
            strings={strings.language}
            onChange={onChangeLocale}
          />

          <SettingsVisibilitySection
            currentUser={currentUser}
            ownedClasses={ownedClasses}
            updatingClassId={updatingClassId}
            isUpdatingGlobal={isUpdatingGlobal}
            strings={strings.visibility}
            onToggleVisibility={handleToggleVisibility}
            onGlobalVisibility={handleGlobalVisibility}
          />

          <SettingsDangerZone
            strings={strings.danger}
            onDeleteClick={() => setShowDeleteModal(true)}
          />
        </div>

        <DeleteAccountModal
          isOpen={showDeleteModal}
          password={deletePassword}
          confirmed={deleteConfirmed}
          error={deleteError}
          isDeleting={isDeleting}
          strings={strings.deleteModal}
          onPasswordChange={setDeletePassword}
          onConfirmedChange={setDeleteConfirmed}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteAccount}
        />

        <footer
          id="settings-footer"
          className="border-t border-zinc-200 py-6 text-center dark:border-zinc-800"
        >
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
            {strings.footer.title}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            {strings.footer.subtitle}
          </p>
        </footer>
      </div>
    </div>
  );
}