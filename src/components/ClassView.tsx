import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  KeyRound,
  AlertCircle,
  Trash2,
  ShieldAlert,
  Check,
  RefreshCw,
  LogOut,
  Crown,
  UserCog,
  UserCheck,
  Copy,
  X,
  ArrowRight,
  LockKeyhole,
  Globe2,
  UserPlus,
  Settings2,
  ChevronRight,
} from 'lucide-react';
import { ClassGroup, User, Role, PendingRemoval } from '../types';
import { trackClick } from '../utils/tracker';

interface ClassViewProps {
  classes: ClassGroup[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onJoinClass: (code: string) => void;
  onCreateClass: (
    name: string,
    description: string,
    visibility: 'public' | 'private'
  ) => Promise<string>;
  onPromoteToAssistant: (classId: string, memberId: string) => void;
  onDemoteToMember: (classId: string, assistantId: string) => void;
  onDeleteClass: (classId: string) => void;
  onLeaveClass: (classId: string) => void;
  onTransferOwnership?: (
    classId: string,
    newOwnerId: string
  ) => Promise<void>;
  currentUser: User;
  currentUserRole: Role;
  pendingRemovals: PendingRemoval[];
  onRequestMemberRemoval: (classId: string, memberId: string) => void;
  onRemoveMemberInstantly: (classId: string, memberId: string) => void;
  onApproveMemberRemoval: (classId: string, memberId: string) => void;
  onRejectMemberRemoval: (classId: string, memberId: string) => void;
  onUpdateClassCode: (classId: string) => Promise<string>;
  memberNamesMap: Record<string, string>;
  onApproveJoinRequest?: (
    classId: string,
    userId: string
  ) => Promise<void>;
  onRejectJoinRequest?: (
    classId: string,
    userId: string
  ) => Promise<void>;
}

type ConfirmAction =
  | {
      type: 'leave';
      classId: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      type: 'delete';
      classId: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      type: 'regenerate';
      classId: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      type: 'remove-member';
      classId: string;
      memberId: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      type: 'request-removal';
      classId: string;
      memberId: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      type: 'reject-join';
      classId: string;
      memberId: string;
      title: string;
      description: string;
      confirmLabel: string;
    };

export default function ClassView({
  classes,
  activeClassId,
  onSelectClass,
  onJoinClass,
  onCreateClass,
  onPromoteToAssistant,
  onDemoteToMember,
  onDeleteClass,
  onLeaveClass,
  onTransferOwnership,
  currentUser,
  currentUserRole,
  pendingRemovals,
  onRequestMemberRemoval,
  onRemoveMemberInstantly,
  onApproveMemberRemoval,
  onRejectMemberRemoval,
  onUpdateClassCode,
  memberNamesMap,
  onApproveJoinRequest,
  onRejectJoinRequest,
}: ClassViewProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'join' | 'create'
  >('details');

  const [joinCode, setJoinCode] = useState('');
  const [classNameInput, setClassNameInput] = useState('');
  const [classDescriptionInput, setClassDescriptionInput] = useState('');
  const [classVisibilityInput, setClassVisibilityInput] =
    useState<'public' | 'private'>('public');

  const [captchaNum1, setCaptchaNum1] = useState(
    () => Math.floor(Math.random() * 9) + 1
  );
  const [captchaNum2, setCaptchaNum2] = useState(
    () => Math.floor(Math.random() * 9) + 1
  );
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [processingJoinId, setProcessingJoinId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState('');
  const [joinMessage, setJoinMessage] = useState('');

  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [leavingClassId, setLeavingClassId] = useState<string | null>(
    null
  );

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(
    null
  );

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  const loadingMessages = [
    'Creating class',
    'Setting up classroom',
    'Securing class code',
    'Preparing workspace',
    'Finalizing setup',
  ];

  const joinMessages = [
    'Checking class code',
    'Verifying access',
    'Securing enrollment',
    'Adding you to the roster',
  ];

  useEffect(() => {
    if (!isCreating) return;

    let index = 0;

    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isCreating]);

  useEffect(() => {
    if (!isJoining) return;

    let index = 0;

    setJoinMessage(joinMessages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % joinMessages.length;
      setJoinMessage(joinMessages[index]);
    }, 900);

    return () => clearInterval(interval);
  }, [isJoining]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copiedCode) return;

    const timer = setTimeout(() => {
      setCopiedCode(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [copiedCode]);

  const showToast = (
    type: 'success' | 'error' | 'info',
    message: string
  ) => {
    setToast({ type, message });
  };

  const regenerateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  const activeClass = classes.find((c) => c.id === activeClassId);

  const getMemberName = (id: string) => {
    if (id === currentUser.id) {
      return `${currentUser.name} (You)`;
    }

    if (memberNamesMap?.[id]) {
      return memberNamesMap[id];
    }

    return `Student (${id.substring(0, 8)})`;
  };

  const resetMessages = () => {
    setCaptchaError('');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    resetMessages();

    if (!joinCode.trim()) {
      showToast('error', 'Enter a class code to continue.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;

    if (parseInt(captchaAnswer, 10) !== expected) {
      setCaptchaError('Incorrect security answer.');
      regenerateCaptcha();
      return;
    }

    trackClick('Button: Join Class Code Submit');

    setIsJoining(true);
    setJoinMessage(joinMessages[0]);

    try {
      await Promise.resolve(onJoinClass(joinCode.trim()));

      setJoinCode('');
      setCaptchaAnswer('');
      regenerateCaptcha();
      setActiveTab('details');
    } catch (err) {
      showToast('error', 'Failed to join class. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    resetMessages();

    if (!classNameInput.trim()) {
      showToast('error', 'Class name is required.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;

    if (parseInt(captchaAnswer, 10) !== expected) {
      setCaptchaError('Incorrect security answer.');
      regenerateCaptcha();
      return;
    }

    setIsCreating(true);

    try {
      trackClick('Button: Create Class Submit');

      const code = await onCreateClass(
        classNameInput.trim(),
        classDescriptionInput.trim(),
        classVisibilityInput
      );

      showToast(
        'success',
        `Class created successfully. Code: ${code}`
      );

      setClassNameInput('');
      setClassDescriptionInput('');
      setClassVisibilityInput('public');
      setCaptchaAnswer('');
      regenerateCaptcha();
      setActiveTab('details');
    } catch (err) {
      showToast('error', 'Failed to create class. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const requestLeaveClass = (classId: string, className: string) => {
    const targetClass = classes.find((c) => c.id === classId);

    if (!targetClass) return;

    if (targetClass.ownerId === currentUser.id) {
      if (targetClass.assistantIds.length > 0) {
        setShowTransferModal(true);
        return;
      }

      showToast(
        'error',
        'You are the class representative. Transfer ownership or delete the class before leaving.'
      );

      return;
    }

    setConfirmAction({
      type: 'leave',
      classId,
      title: 'Leave class?',
      description: `You will lose access to "${className}" and its timetable.`,
      confirmLabel: 'Leave class',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const action = confirmAction;
    setConfirmAction(null);

    try {
      if (action.type === 'leave') {
        setLeavingClassId(action.classId);

        trackClick('Button: Leave Class');

        onLeaveClass(action.classId);

        showToast('success', 'You have left the class.');

        if (activeClassId === action.classId && classes.length > 1) {
          const remaining = classes.filter(
            (cls) => cls.id !== action.classId
          );

          if (remaining.length > 0) {
            onSelectClass(remaining[0].id);
          }
        }

        return;
      }

      if (action.type === 'delete') {
        trackClick('Button: Delete Class Success');

        onDeleteClass(action.classId);

        showToast('success', 'Class was permanently deleted.');

        return;
      }

      if (action.type === 'regenerate') {
        setIsRegenerating(true);

        trackClick('Button: Regenerate Class Code');

        const newCode = await onUpdateClassCode(action.classId);

        showToast(
          'success',
          `Class code changed to ${newCode}.`
        );

        return;
      }

      if (action.type === 'remove-member') {
        onRemoveMemberInstantly(
          action.classId,
          action.memberId
        );

        showToast('success', 'Member removed from the class.');

        return;
      }

      if (action.type === 'request-removal') {
        onRequestMemberRemoval(
          action.classId,
          action.memberId
        );

        showToast(
          'success',
          'Removal request sent to the Class Representative.'
        );

        return;
      }

      if (action.type === 'reject-join') {
        if (!onRejectJoinRequest) return;

        setProcessingJoinId(action.memberId);

        await onRejectJoinRequest(
          action.classId,
          action.memberId
        );

        showToast('success', 'Join request denied.');
      }
    } catch (err: any) {
      showToast(
        'error',
        err?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLeavingClassId(null);
      setIsRegenerating(false);
      setProcessingJoinId(null);
    }
  };

  const handleDelete = () => {
    if (!activeClass) return;

    if (currentUserRole !== 'representative') {
      showToast(
        'error',
        'Only Class Representatives can delete classes.'
      );
      return;
    }

    setConfirmAction({
      type: 'delete',
      classId: activeClass.id,
      title: 'Delete classroom?',
      description:
        'This permanently removes the classroom and all of its scheduled timetable entries. This action cannot be undone.',
      confirmLabel: 'Delete classroom',
    });
  };

  const handleRegenerateCode = () => {
    if (!activeClass) return;

    setConfirmAction({
      type: 'regenerate',
      classId: activeClass.id,
      title: 'Change class code?',
      description:
        'The current code will stop working immediately. Students using the old code will no longer be able to join with it.',
      confirmLabel: 'Change code',
    });
  };

  const handleApproveJoin = async (userId: string) => {
    if (!activeClass || !onApproveJoinRequest) return;

    setProcessingJoinId(userId);

    try {
      trackClick('Button: Approve Class Member Join');

      await onApproveJoinRequest(
        activeClass.id,
        userId
      );

      showToast('success', 'Student request approved.');
    } catch (err: any) {
      showToast(
        'error',
        err?.message || 'Failed to approve member.'
      );
    } finally {
      setProcessingJoinId(null);
    }
  };

  const handleRejectJoin = (userId: string) => {
    if (!activeClass || !onRejectJoinRequest) return;

    setConfirmAction({
      type: 'reject-join',
      classId: activeClass.id,
      memberId: userId,
      title: 'Deny join request?',
      description:
        'This student will not be added to the classroom.',
      confirmLabel: 'Deny request',
    });
  };

  const copyClassCode = async () => {
    if (!activeClass) return;

    try {
      await navigator.clipboard.writeText(activeClass.code);
      setCopiedCode(true);
      showToast('success', 'Class code copied.');
    } catch {
      showToast('error', 'Could not copy the class code.');
    }
  };

  const isUserAdminOrAssistantOfActiveClass =
    !!activeClass &&
    (activeClass.ownerId === currentUser.id ||
      activeClass.assistantIds.includes(currentUser.id));

  const pendingRemovalCount = activeClass
    ? pendingRemovals.filter(
        (pr) => pr.classId === activeClass.id
      ).length
    : 0;

  return (
    <div
      className="space-y-6 pb-10"
      id="class-view-container"
    >
      {/* Confirmation modal */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5 dark:border-zinc-800">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                  {confirmAction.type === 'delete' ||
                  confirmAction.type === 'remove-member' ? (
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : confirmAction.type === 'regenerate' ? (
                    <RefreshCw className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    {confirmAction.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {confirmAction.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 p-4 sm:flex-row sm:justify-end dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition ${
                  confirmAction.type === 'delete' ||
                  confirmAction.type === 'remove-member'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200'
                }`}
              >
                {confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ownership transfer modal */}
      {showTransferModal && activeClass && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20">
                    <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-950 dark:text-white">
                      Transfer ownership
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Required before you leave
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedTransferId(null);
                  }}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                You are the class representative. Select an assistant to
                transfer                 ownership to before leaving this classroom.
              </p>

              <div className="space-y-2">
                {activeClass.assistantIds.map((id) => {
                  const selected = selectedTransferId === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedTransferId(id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                        selected
                          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                          : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? 'bg-white/10 dark:bg-zinc-950/10'
                              : 'bg-zinc-100 dark:bg-zinc-900'
                          }`}
                        >
                          <UserCog
                            className={`h-4 w-4 ${
                              selected
                                ? 'text-white dark:text-zinc-950'
                                : 'text-zinc-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {getMemberName(id)}
                          </p>
                          <p
                            className={`mt-0.5 text-xs ${
                              selected
                                ? 'text-zinc-300 dark:text-zinc-600'
                                : 'text-zinc-500 dark:text-zinc-400'
                            }`}
                          >
                            Class Assistant
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-white bg-white text-zinc-950 dark:border-zinc-950 dark:bg-zinc-950 dark:text-white'
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedTransferId(null);
                  }}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    !selectedTransferId ||
                    !onTransferOwnership
                  }
                  onClick={async () => {
                    if (!selectedTransferId || !onTransferOwnership) {
                      return;
                    }

                    try {
                      await onTransferOwnership(
                        activeClass.id,
                        selectedTransferId
                      );

                      showToast(
                        'success',
                        'Ownership transferred successfully.'
                      );

                      setShowTransferModal(false);
                      setSelectedTransferId(null);
                    } catch (err: any) {
                      showToast(
                        'error',
                        err?.message ||
                          'Failed to transfer ownership.'
                      );
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Transfer ownership
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create loading modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <Plus className="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>

            <h3 className="mt-4 text-base font-bold text-zinc-950 dark:text-white">
              Creating your class
            </h3>

            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              {loadingMessage || 'Preparing classroom'}
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-zinc-950 dark:bg-white" />
            </div>
          </div>
        </div>
      )}

      {/* Join loading modal */}
      {isJoining && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <KeyRound className="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>

            <h3 className="mt-4 text-base font-bold text-zinc-950 dark:text-white">
              Joining class
            </h3>

            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              {joinMessage || 'Checking class access'}
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-zinc-950 dark:bg-white" />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-white text-zinc-900 dark:border-emerald-900 dark:bg-zinc-950 dark:text-white'
              : toast.type === 'error'
                ? 'border-red-200 bg-white text-zinc-900 dark:border-red-900 dark:bg-zinc-950 dark:text-white'
                : 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white'
          }`}
          role="status"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                : toast.type === 'error'
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
          </div>

          <p className="min-w-0 flex-1 text-sm font-medium">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Users className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                Classes
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your classrooms and membership
              </p>
            </div>
          </div>
        </div>

        <nav
          className="flex items-center gap-1 overflow-x-auto pb-px"
          aria-label="Class actions"
        >
          {[
            {
              id: 'details' as const,
              label: 'Your classes',
              icon: Users,
            },
            {
              id: 'join' as const,
              label: 'Join',
              icon: KeyRound,
            },
            {
              id: 'create' as const,
              label: 'Create',
              icon: Plus,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  active
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'details' && (
        <section id="details-section" className="space-y-5">
          {!classes.length ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <UserPlus className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
              </div>

              <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                No classes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Join an existing classroom with a class code or create one
                for your course.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveTab('join')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Join a class
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create a class
                </button>
              </div>
            </div>
          ) : (
            <div
              id="class-layout-grid"
              className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]"
            >
              {/* Class sidebar */}
              <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between px-2 py-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Your classes
                    </p>
                  </div>

                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    {classes.length}
                  </span>
                </div>

                <div
                  id="class-sidebar-list"
                  className="mt-2 space-y-1"
                >
                  {classes.map((cls) => {
                    const selected = cls.id === activeClassId;
                    const isOwner = cls.ownerId === currentUser.id;
                    const isAssistant = cls.assistantIds.includes(
                      currentUser.id
                    );

                    return (
                      <div
                        key={cls.id}
                        className="group flex items-center gap-1"
                      >
                        <button
                          id={`select-class-btn-${cls.id}`}
                          type="button"
                          onClick={() => onSelectClass(cls.id)}
                          className={`min-w-0 flex-1 rounded-xl px-3 py-3 text-left transition ${
                            selected
                              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                selected
                                  ? 'bg-white/10 dark:bg-zinc-950/10'
                                  : 'bg-zinc-100 dark:bg-zinc-900'
                              }`}
                            >
                              <Users
                                className={`h-3.5 w-3.5 ${
                                  selected
                                    ? 'text-white dark:text-zinc-950'
                                    : 'text-zinc-500'
                                }`}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {cls.name}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">
                                <span
                                  className={`truncate text-[10px] ${
                                    selected
                                      ? 'text-zinc-300 dark:text-zinc-600'
                                      : 'text-zinc-400'
                                  }`}
                                >
                                  {cls.code}
                                </span>

                                <span
                                  className={`h-1 w-1 shrink-0 rounded-full ${
                                    selected
                                      ? 'bg-zinc-500'
                                      : 'bg-zinc-300 dark:bg-zinc-700'
                                  }`}
                                />

                                <span
                                  className={`truncate text-[10px] font-semibold ${
                                    selected
                                      ? 'text-zinc-300 dark:text-zinc-600'
                                      : 'text-zinc-500 dark:text-zinc-400'
                                  }`}
                                >
                                  {isOwner
                                    ? 'Representative'
                                    : isAssistant
                                      ? 'Assistant'
                                      : 'Member'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() =>
                              requestLeaveClass(
                                cls.id,
                                cls.name
                              )
                            }
                            className="mr-1 hidden rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 group-hover:block dark:hover:bg-red-950/20 dark:hover:text-red-400"
                            aria-label={`Leave ${cls.name}`}
                          >
                            <LogOut className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('join')}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Join another class
                    <ChevronRight className="ml-auto h-3.5 w-3.5" />
                  </button>
                </div>
      {activeTab === 'join' && (
        <section id="join-card" className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <KeyRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                    Join a class
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Use the code shared by your class representative.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="input-join-code"
                  className="mb-2 block text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Class code
                </label>

                <input
                  id="input-join-code"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="THESDEL-XXXX"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 font-mono text-sm font-bold tracking-[0.18em] text-zinc-950 outline-none transition placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                />
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
                      <Shield className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                        Security check
                      </h3>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                        Solve this quick check to continue.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={regenerateCaptcha}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white"
                    aria-label="Generate a new security check"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
                  <div className="flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-mono text-lg font-bold text-zinc-950 dark:bg-zinc-950 dark:text-white">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={captchaAnswer}
                    onChange={(e) =>
                      setCaptchaAnswer(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="Answer"
                    aria-label="Security check answer"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-bold text-zinc-950 outline-none transition placeholder:font-normal placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {captchaError && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{captchaError}</span>
                  </div>
                )}
              </div>

              <button
                id="btn-join-submit"
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3.5 text-xs font-bold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-white/20"
              >
                <KeyRound className="h-4 w-4" />
                Join class
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Valid class code
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                        Enter the code shared by your class representative.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Public classes
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                        You can join immediately when the class is public.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Private classes
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                        Your join request is reviewed before you get access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}
      {activeTab === 'create' && (
        <section id="create-card" className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <Plus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                    Create a class
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Set up a shared space for your class, course, or study group.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="input-create-name"
                  className="mb-2 block text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Class name
                </label>

                <input
                  id="input-create-name"
                  type="text"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  placeholder="e.g. MTH 102 — Mathematics"
                  autoComplete="off"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label
                  htmlFor="input-create-description"
                  className="mb-2 block text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Description
                </label>

                <textarea
                  id="input-create-description"
                  value={classDescriptionInput}
                  onChange={(e) => setClassDescriptionInput(e.target.value)}
                  placeholder="What is this class for?"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                />
              </div>

              <div id="input-create-visibility">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Visibility
                  </label>

                  <span className="text-[11px] font-medium text-zinc-400">
                    Choose who can join
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setClassVisibilityInput('public')}
                    className={`rounded-xl border p-4 text-left transition ${
                      classVisibilityInput === 'public'
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Globe2 className="mt-0.5 h-4 w-4 shrink-0" />

                      <div>
                        <p className="text-xs font-bold">Public</p>
                        <p
                          className={`mt-1 text-[11px] leading-5 ${
                            classVisibilityInput === 'public'
                              ? 'text-zinc-300 dark:text-zinc-600'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          Anyone with the code can join the class.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassVisibilityInput('private')}
                    className={`rounded-xl border p-4 text-left transition ${
                      classVisibilityInput === 'private'
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />

                      <div>
                        <p className="text-xs font-bold">Private</p>
                        <p
                          className={`mt-1 text-[11px] leading-5 ${
                            classVisibilityInput === 'private'
                              ? 'text-zinc-300 dark:text-zinc-600'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          Join requests require approval.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
                  <LockKeyhole className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-zinc-950 dark:text-white">
                    Your class code
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    Your class code will be generated automatically using the
                    THESDEL- prefix.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
                      <Shield className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                        Security check
                      </h3>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                        Solve this quick check to create your class.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={regenerateCaptcha}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-white hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-white"
                    aria-label="Generate a new security check"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
                  <div className="flex min-h-12 items-center justify-center rounded-xl bg-white px-4 font-mono text-lg font-bold text-zinc-950 dark:bg-zinc-950 dark:text-white">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={captchaAnswer}
                    onChange={(e) =>
                      setCaptchaAnswer(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="Answer"
                    aria-label="Security check answer"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-bold text-zinc-950 outline-none transition placeholder:font-normal placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {captchaError && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{captchaError}</span>
                  </div>
                )}
              </div>

              <button
                id="btn-create-submit"
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3.5 text-xs font-bold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-white/20"
              >
                <Plus className="h-4 w-4" />
                Create class
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </section>
      )}
    </asside>
  );
}
               