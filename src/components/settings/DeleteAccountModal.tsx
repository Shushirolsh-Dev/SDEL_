import React from 'react';
import {
  AlertTriangle,
  Lock,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import type { SettingsDeleteModalStrings } from '../../i18n/types.app';

interface DeleteAccountModalProps {
  isOpen: boolean;
  password: string;
  confirmed: boolean;
  error: string;
  isDeleting: boolean;
  strings: SettingsDeleteModalStrings;
  onPasswordChange: (value: string) => void;
  onConfirmedChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  password,
  confirmed,
  error,
  isDeleting,
  strings,
  onPasswordChange,
  onConfirmedChange,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="delete-account-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-zinc-100 px-6 py-6 dark:border-zinc-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">
                {strings.eyebrow}
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                {strings.title}
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {strings.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="delete-password"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"
            >
              {strings.passwordLabel}
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                id="delete-password"
                type="password"
                value={password}
                onChange={(event) =>
                  onPasswordChange(event.target.value)
                }
                disabled={isDeleting}
                placeholder={strings.passwordPlaceholder}
                className="w-full border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-500"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) =>
                onConfirmedChange(event.target.checked)
              }
              disabled={isDeleting}
              className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
            />

            <span className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {strings.confirmLabel}
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-4 dark:border-red-950 dark:bg-red-950/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />

              <p className="text-sm leading-relaxed text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="border border-zinc-200 px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
            >
              {strings.cancelButton}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting || !password || !confirmed}
              className="inline-flex items-center justify-center gap-2 border border-red-600 bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {strings.deletingButton}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {strings.deleteButton}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;