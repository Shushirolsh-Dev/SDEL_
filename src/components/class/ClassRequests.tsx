import React from 'react';
import {
  UserPlus,
  ShieldAlert,
  Check,
  X,
} from 'lucide-react';
import { ClassGroup, PendingRemoval } from '../types';

interface ClassRequestsProps {
  activeClass: ClassGroup;
  pendingRemovals: PendingRemoval[];
  pendingRemovalCount: number;
  processingJoinId: string | null;
  getMemberName: (memberId: string) => string;
  onApproveJoin: (classId: string, userId: string) => void;
  onRejectJoinRequest: (classId: string, userId: string, userName: string) => void;
  onApproveRemoval: (classId: string, memberId: string) => void;
  onRejectRemoval: (classId: string, memberId: string) => void;
}

const ClassRequests: React.FC<ClassRequestsProps> = ({
  activeClass,
  pendingRemovals,
  pendingRemovalCount,
  processingJoinId,
  getMemberName,
  onApproveJoin,
  onRejectJoinRequest,
  onApproveRemoval,
  onRejectRemoval,
}) => {
  const joinRequests = (activeClass as any).joinRequests || [];

  return (
    <>
      {joinRequests.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-zinc-500" />
                <h3 className="text-sm font-black">Join requests</h3>
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                Review students waiting to enter this class.
              </p>
            </div>

            <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              {joinRequests.length}
            </span>
          </div>

          <div className="space-y-2">
            {joinRequests.map((request: any) => {
              const userId =
                request.userId || request.id || request.studentId;

              const userName =
                request.userName ||
                request.name ||
                getMemberName(userId);

              const processing = processingJoinId === userId;

              return (
                <div
                  key={userId}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                      {String(userName).charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-black">
                        {userName}
                      </p>

                      <p className="text-[10px] text-zinc-400">
                        Waiting for approval
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() =>
                        onApproveJoin(activeClass.id, userId)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-2 text-[10px] font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      <Check className="h-3 w-3" />
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() =>
                        onRejectJoinRequest(
                          activeClass.id,
                          userId,
                          userName
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      <X className="h-3 w-3" />
                      Deny
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pendingRemovalCount > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-zinc-500" />
                <h3 className="text-sm font-black">
                  Removal requests
                </h3>
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                Review requests to remove members.
              </p>
            </div>

            <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              {pendingRemovalCount}
            </span>
          </div>

          <div className="space-y-2">
            {pendingRemovals
              .filter((request) => request.classId === activeClass.id)
              .map((request) => {
                const memberName = getMemberName(request.memberId);

                return (
                  <div
                    key={`${request.classId}-${request.memberId}`}
                    className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                        {memberName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-black">
                          {memberName}
                        </p>

                        <p className="text-[10px] text-zinc-400">
                          Member removal requested
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onApproveRemoval(
                            activeClass.id,
                            request.memberId
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-2 text-[10px] font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onRejectRemoval(
                            activeClass.id,
                            request.memberId
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        <X className="h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default ClassRequests;
