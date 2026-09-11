import React from 'react';
import {
  RefreshCw,
  X,
  Check,
  Trash2,
  ShieldAlert,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { ClassGroup, User } from '../../types';
import type { ClassModalsStrings } from '../../i18n/types.app';

type ConfirmAction =
  | { type: 'leave'; classId: string; className: string }
  | { type: 'delete'; classId: string; className: string }
  | { type: 'regenerate'; classId: string; className: string }
  | {
      type: 'remove-member';
      classId: string;
      memberId: string;
      memberName: string;
    }
  | {
      type: 'request-removal';
      classId: string;
      memberId: string;
      memberName: string;
    }
  | {
      type: 'reject-join';
      classId: string;
      userId: string;
      userName: string;
    };

interface ClassModalsProps {
  isCreating: boolean;
  isJoining: boolean;
  isRegenerating: boolean;
  loadingMessage: string;

  showTransferModal: boolean;
  activeClass: ClassGroup | undefined;
  currentUser: User;
  selectedTransferId: string;
  strings: ClassModalsStrings;
  getMemberName: (memberId: string) => string;
  onSelectTransfer: (id: string) => void;
  onCloseTransfer: () => void;
  onConfirmTransfer: () => void;

  confirmAction: ConfirmAction | null;
  onCancelConfirm: () => void;
  onConfirmAction: () => void;

  toast: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  onDismissToast: () => void;
}

const ClassModals: React.FC<ClassModalsProps> = ({
  isCreating,
  isJoining,
  isRegenerating,
  loadingMessage,
  showTransferModal,
  activeClass,
  currentUser,
  selectedTransferId,
  strings,
  getMemberName,
  onSelectTransfer,
  onCloseTransfer,
  onConfirmTransfer,
  confirmAction,
  onCancelConfirm,
  onConfirmAction,
  toast,
  onDismissToast,
}) => {
  return (
    <>
      {/* Loading modal */}
      {(isCreating || isJoining || isRegenerating) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <RefreshCw className="h-5 w-5 animate-spin text-zinc-700 dark:text-zinc-300" />
              </div>

              <div>
                <p className="text-sm font-black">
                  {isCreating
                    ? strings.loadingCreating
                    : isJoining
                    ? strings.loadingJoining
                    : strings.loadingUpdating}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {loadingMessage || strings.loadingFallback}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer ownership modal */}
      {showTransferModal && activeClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div>
                <p className="text-sm font-black">
                  {strings.transferTitle}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {strings.transferSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseTransfer}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-5">
              <div className="space-y-2">
                {activeClass.members
                  ?.filter(
                    (member) =>
                      member.id !== currentUser.id &&
                      (member.role === 'assistant' ||
                        member.role === 'admin')
                  )
                  .map((member) => {
                    const selected =
                      selectedTransferId === member.id;

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => onSelectTransfer(member.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selected
                            ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900'
                            : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black dark:bg-zinc-900">
                          {getMemberName(member.id)
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black">
                            {getMemberName(member.id)}
                          </p>
                          <p className="mt-0.5 text-xs capitalize text-zinc-500">
                            {member.role}
                          </p>
                        </div>

                        {selected && (
                          <Check className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-3 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={onCloseTransfer}
                className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {strings.cancelButton}
              </button>

              <button
                type="button"
                disabled={!selectedTransferId}
                onClick={onConfirmTransfer}
                className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {strings.transferConfirmButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                {confirmAction.type === 'delete' ? (
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                ) : confirmAction.type === 'regenerate' ? (
                  <RefreshCw className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                ) : confirmAction.type === 'reject-join' ? (
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                )}
              </div>

              <h3 className="mt-4 text-lg font-black">
                {confirmAction.type === 'delete'
                  ? strings.confirmDeleteTitle
                  : confirmAction.type === 'regenerate'
                  ? strings.confirmRegenerateTitle
                  : confirmAction.type === 'reject-join'
                  ? strings.confirmRejectJoinTitle
                  : confirmAction.type === 'remove-member'
                  ? strings.confirmRemoveMemberTitle
                  : strings.confirmRequestRemovalTitle}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {confirmAction.type === 'delete'
                  ? strings.confirmDeleteBody(
                      confirmAction.className
                    )
                  : confirmAction.type === 'regenerate'
                  ? strings.confirmRegenerateBody(
                      confirmAction.className
                    )
                  : confirmAction.type === 'reject-join'
                  ? strings.confirmRejectJoinBody(
                      confirmAction.userName
                    )
                  : confirmAction.type === 'remove-member'
                  ? strings.confirmRemoveMemberBody(
                      confirmAction.memberName
                    )
                  : strings.confirmRequestRemovalBody(
                      confirmAction.memberName
                    )}
              </p>
            </div>

            <div className="flex gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={onCancelConfirm}
                className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {strings.cancelButton}
              </button>

              <button
                type="button"
                onClick={onConfirmAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-black text-white transition ${
                  confirmAction.type === 'delete' ||
                  confirmAction.type === 'remove-member' ||
                  confirmAction.type === 'reject-join'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
                }`}
              >
                {confirmAction.type === 'delete'
                  ? strings.confirmDeleteButton
                  : confirmAction.type === 'regenerate'
                  ? strings.confirmRegenerateButton
                  : confirmAction.type === 'reject-join'
                  ? strings.confirmRejectButton
                  : confirmAction.type === 'remove-member'
                  ? strings.confirmRemoveButton
                  : strings.confirmRequestRemovalButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[120] w-[calc(100%-2.5rem)] max-w-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : (
                <Shield className="h-4 w-4 text-zinc-500" />
              )}
            </div>

            <p className="flex-1 text-xs font-bold leading-5 text-zinc-700 dark:text-zinc-300">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={onDismissToast}
              className="shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassModals;