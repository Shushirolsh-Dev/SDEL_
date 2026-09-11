import React from 'react';
import { Settings2, LogOut, Trash2 } from 'lucide-react';
import { ClassGroup, User } from '../types';

interface ClassManagementCardProps {
  activeClass: ClassGroup;
  currentUser: User;
  leavingClassId: string | null;
  onRegenerateClick: (classId: string, className: string) => void;
  onTransferClick: () => void;
  onLeaveClick: (classId: string, className: string) => void;
  onDeleteClick: (classId: string, className: string) => void;
}

const ClassManagementCard: React.FC<ClassManagementCardProps> = ({
  activeClass,
  currentUser,
  leavingClassId,
  onRegenerateClick,
  onTransferClick,
  onLeaveClick,
  onDeleteClick,
}) => {
  const isOwner = currentUser.id === activeClass.ownerId;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-zinc-500" />
          <h3 className="text-sm font-black">Class management</h3>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Manage access, ownership, and this class.
        </p>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {isOwner && (
          <>
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">Class code</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Regenerate the code if it has been shared too widely.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onRegenerateClick(activeClass.id, activeClass.name)
                }
                className="shrink-0 rounded-xl border border-zinc-300 px-3 py-2 text-xs font-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Regenerate
              </button>
            </div>

            {activeClass.members?.some(
              (member) =>
                member.id !== currentUser.id &&
                (member.role === 'assistant' ||
                  member.role === 'admin')
            ) && (
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    Transfer ownership
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Give another administrator ownership of this class.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onTransferClick}
                  className="shrink-0 rounded-xl bg-zinc-950 px-3 py-2 text-xs font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Transfer
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-bold">Leave class</p>
            <p className="mt-1 text-xs text-zinc-500">
              Remove yourself from this class.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onLeaveClick(activeClass.id, activeClass.name)
            }
            disabled={leavingClassId === activeClass.id}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-xs font-black transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <LogOut className="h-3.5 w-3.5" />
            {leavingClassId === activeClass.id
              ? 'Leaving...'
              : 'Leave'}
          </button>
        </div>

        {isOwner && (
          <div className="flex items-center justify-between gap-4 bg-zinc-50 px-5 py-4 dark:bg-zinc-900/40">
            <div className="min-w-0">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                Delete class
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Permanently remove this class and its membership.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onDeleteClick(activeClass.id, activeClass.name)
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagementCard;
