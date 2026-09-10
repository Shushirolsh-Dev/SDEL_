import React from 'react';
import { Users, KeyRound, ChevronRight } from 'lucide-react';
import { ClassGroup } from '../types';
import { trackClick } from '../utils/tracker';

interface ClassSidebarProps {
  classes: ClassGroup[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onJoinAnother: () => void;
}

const ClassSidebar: React.FC<ClassSidebarProps> = ({
  classes,
  activeClassId,
  onSelectClass,
  onJoinAnother,
}) => {
  return (
    <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
            Classes
          </span>

          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            {classes.length}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {classes.map((classItem) => {
          const isActive = classItem.id === activeClassId;

          return (
            <button
              key={classItem.id}
              type="button"
              onClick={() => {
                onSelectClass(classItem.id);
                trackClick('class_select');
              }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-black'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? 'bg-white/10 dark:bg-black/10'
                    : 'bg-zinc-100 dark:bg-zinc-900'
                }`}
              >
                <Users
                  className={`h-4 w-4 ${
                    isActive
                      ? 'text-white dark:text-black'
                      : 'text-zinc-500'
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black">
                  {classItem.name}
                </p>

                <p
                  className={`mt-0.5 truncate text-[10px] ${
                    isActive
                      ? 'text-zinc-400 dark:text-zinc-500'
                      : 'text-zinc-400'
                  }`}
                >
                  {classItem.members?.length || 0} members
                </p>
              </div>

              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 transition ${
                  isActive
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={onJoinAnother}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Join another class
          <ChevronRight className="ml-auto h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default ClassSidebar;