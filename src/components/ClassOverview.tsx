import React from 'react';
import {
  Users,
  KeyRound,
  Crown,
  Copy,
  Check,
  Globe2,
  LockKeyhole,
} from 'lucide-react';
import { ClassGroup, User } from '../types';

interface ClassOverviewProps {
  activeClass: ClassGroup;
  currentUser: User;
  copiedCode: boolean;
  onCopyCode: (code?: string) => void;
}

const ClassOverview: React.FC<ClassOverviewProps> = ({
  activeClass,
  currentUser,
  copiedCode,
  onCopyCode,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 p-5 dark:border-zinc-800 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <Users className="h-3 w-3" />
                Class space
              </span>

              {(activeClass.ownerId === currentUser.id ||
                activeClass.representativeId === currentUser.id) && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white dark:bg-white dark:text-black">
                  <Crown className="h-3 w-3" />
                  Representative
                </span>
              )}
            </div>

            <h2 className="truncate text-xl font-black tracking-tight sm:text-2xl">
              {activeClass.name}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {activeClass.description ||
                'No class description has been added yet.'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {activeClass.visibility === 'public' ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[10px] font-bold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <Globe2 className="h-3.5 w-3.5" />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[10px] font-bold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <LockKeyhole className="h-3.5 w-3.5" />
                Private
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
              Class code
            </span>

            <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
          </div>

          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate text-lg font-black tracking-[0.18em]">
              {activeClass.code || '--------'}
            </code>

            <button
              type="button"
              onClick={() => onCopyCode(activeClass.code)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
              title="Copy class code"
            >
              {copiedCode ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-400">
              Members
            </span>

            <Users className="h-3.5 w-3.5 text-zinc-400" />
          </div>

          <p className="text-lg font-black">
            {activeClass.members?.length || 0}
          </p>

          <p className="mt-0.5 text-[11px] text-zinc-400">
            students in this class
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;