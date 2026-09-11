import React from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';

interface SettingsDangerZoneProps {
  onDeleteClick: () => void;
}

const SettingsDangerZone: React.FC<SettingsDangerZoneProps> = ({
  onDeleteClick,
}) => {
  return (
    <section
      id="settings-danger-section"
      className="mb-8 overflow-hidden border border-red-200/70 bg-white dark:border-red-950/70 dark:bg-zinc-950"
    >
      <div className="flex items-center gap-3 border-b border-red-100 px-6 py-5 dark:border-red-950/60">
        <div className="flex h-10 w-10 items-center justify-center border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">
            Account
          </p>

          <h2 className="mt-1 text-base font-bold text-zinc-950 dark:text-white">
            Danger zone
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Delete your account
          </p>

          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Permanently remove your account, classes, memberships,
            attendance records and related data.
          </p>
        </div>

        <button
          type="button"
          onClick={onDeleteClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-red-200 px-5 py-3 text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete account
        </button>
      </div>
    </section>
  );
};

export default SettingsDangerZone;