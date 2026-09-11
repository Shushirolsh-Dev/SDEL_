import React from 'react';
import {
  Users,
  Crown,
  UserCog,
  UserCheck,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { ClassGroup, User, Role } from '../../types';
import type { ClassMembersStrings } from '../../i18n/types.app';

interface ClassMembersCardProps {
  activeClass: ClassGroup;
  currentUser: User;
  currentUserRole: Role;
  strings: ClassMembersStrings;
  getMemberName: (memberId: string) => string;
  onPromote: (
    classId: string,
    memberId: string,
    memberName: string
  ) => void;
  onDemote: (
    classId: string,
    memberId: string,
    memberName: string
  ) => void;
  onRemoveMember: (
    classId: string,
    memberId: string,
    memberName: string
  ) => void;
  onRequestRemoval: (
    classId: string,
    memberId: string,
    memberName: string
  ) => void;
}

const ClassMembersCard: React.FC<ClassMembersCardProps> = ({
  activeClass,
  currentUser,
  currentUserRole,
  strings,
  getMemberName,
  onPromote,
  onDemote,
  onRemoveMember,
  onRequestRemoval,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-black">
                {strings.title}
              </h3>
            </div>

            <p className="mt-1 text-xs text-zinc-400">
              {strings.subtitle}
            </p>
          </div>

          <span className="text-xs font-black text-zinc-400">
            {activeClass.members?.length || 0}
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {(activeClass.members || []).map((member: any) => {
          const memberId = member.id;
          const memberName =
            member.name ||
            member.fullName ||
            getMemberName(memberId);

          const memberRole =
            member.role ||
            (memberId === activeClass.ownerId ? 'owner' : 'member');

          const isCurrentUser = memberId === currentUser.id;

          const isOwner =
            memberId === activeClass.ownerId ||
            memberId === activeClass.representativeId;

          const canManageMember =
            activeClass.ownerId === currentUser.id;

          return (
            <div
              key={memberId}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  {memberName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-xs font-black">
                      {memberName}
                    </p>

                    {isCurrentUser && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                        {strings.youBadge}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-400">
                    {memberRole === 'owner' || isOwner ? (
                      <>
                        <Crown className="h-3 w-3" />
                        {strings.roleRepresentative}
                      </>
                    ) : memberRole === 'assistant' ||
                      memberRole === 'admin' ? (
                      <>
                        <UserCog className="h-3 w-3" />
                        {strings.roleAssistant}
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" />
                        {strings.roleMember}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {canManageMember && !isCurrentUser && !isOwner && (
                <div className="flex flex-wrap items-center gap-2">
                  {memberRole === 'assistant' ||
                  memberRole === 'admin' ? (
                    <button
                      type="button"
                      onClick={() =>
                        onDemote(
                          activeClass.id,
                          memberId,
                          memberName
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      <UserCheck className="h-3 w-3" />
                      {strings.demoteButton}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onPromote(
                          activeClass.id,
                          memberId,
                          memberName
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      <UserCog className="h-3 w-3" />
                      {strings.promoteButton}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onRemoveMember(
                        activeClass.id,
                        memberId,
                        memberName
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    {strings.removeButton}
                  </button>
                </div>
              )}

              {!canManageMember &&
                !isCurrentUser &&
                !isOwner &&
                (currentUserRole === 'assistant' ||
                  currentUserRole === 'admin') && (
                  <button
                    type="button"
                    onClick={() =>
                      onRequestRemoval(
                        activeClass.id,
                        memberId,
                        memberName
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-500 transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <ShieldAlert className="h-3 w-3" />
                    {strings.requestRemovalButton}
                  </button>
                )}
            </div>
          );
        })}

        {(!activeClass.members ||
          activeClass.members.length === 0) && (
          <div className="p-8 text-center">
            <Users className="mx-auto h-5 w-5 text-zinc-400" />
            <p className="mt-2 text-xs font-bold text-zinc-500">
              {strings.emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassMembersCard;