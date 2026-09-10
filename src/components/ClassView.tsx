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
      className: string;
    }
  | {
      type: 'delete';
      classId: string;
      className: string;
    }
  | {
      type: 'regenerate';
      classId: string;
      className: string;
    }
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

const ClassView: React.FC<ClassViewProps> = ({
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
}) => {
  const [activeTab, setActiveTab] = useState<
    'details' | 'join' | 'create'
  >('details');

  const [joinCode, setJoinCode] = useState('');
  const [classNameInput, setClassNameInput] = useState('');
  const [classDescriptionInput, setClassDescriptionInput] = useState('');
  const [classVisibilityInput, setClassVisibilityInput] = useState<
    'public' | 'private'
  >('private');

  const [captchaNum1, setCaptchaNum1] = useState(() =>
    Math.floor(Math.random() * 9) + 1
  );
  const [captchaNum2, setCaptchaNum2] = useState(() =>
    Math.floor(Math.random() * 9) + 1
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

  const [leavingClassId, setLeavingClassId] = useState<string | null>(null);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState('');

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!loadingMessage) return;

    const timer = window.setTimeout(() => {
      setLoadingMessage('');
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [loadingMessage]);

  useEffect(() => {
    if (!joinMessage) return;

    const timer = window.setTimeout(() => {
      setJoinMessage('');
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [joinMessage]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copiedCode) return;

    const timer = window.setTimeout(() => {
      setCopiedCode(false);
    }, 1800);

    return () => window.clearTimeout(timer);
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

  const activeClass = classes.find(
    (classItem) => classItem.id === activeClassId
  );

  const getMemberName = (memberId: string) => {
    return (
      memberNamesMap[memberId] ||
      (memberId === currentUser.id ? currentUser.name : 'Student')
    );
  };

  const resetMessages = () => {
    setCaptchaError('');
    setJoinMessage('');
    setToast(null);
  };

  const handleJoin = async () => {
    resetMessages();

    if (!joinCode.trim()) {
      setJoinMessage('Enter a class code.');
      return;
    }

    if (Number(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setCaptchaError('Incorrect answer.');
      regenerateCaptcha();
      return;
    }

    setIsJoining(true);
    setLoadingMessage('Joining class...');

    try {
      await Promise.resolve(onJoinClass(joinCode.trim().toUpperCase()));
      setJoinCode('');
      setCaptchaAnswer('');
      regenerateCaptcha();
      showToast('success', 'Join request submitted.');
    } catch (error) {
      setJoinMessage(
        error instanceof Error ? error.message : 'Unable to join class.'
      );
    } finally {
      setIsJoining(false);
      setLoadingMessage('');
    }
  };

  const handleCreate = async () => {
    resetMessages();

    if (!classNameInput.trim()) {
      setJoinMessage('Enter a class name.');
      return;
    }

    if (Number(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setCaptchaError('Incorrect answer.');
      regenerateCaptcha();
      return;
    }

    setIsCreating(true);
    setLoadingMessage('Creating class...');

    try {
      const createdClassCode = await onCreateClass(
        classNameInput.trim(),
        classDescriptionInput.trim(),
        classVisibilityInput
      );

      setClassNameInput('');
      setClassDescriptionInput('');
      setClassVisibilityInput('private');
      setCaptchaAnswer('');
      regenerateCaptcha();

      showToast(
        'success',
        createdClassCode
          ? `Class created. Code: ${createdClassCode}`
          : 'Class created successfully.'
      );

      setActiveTab('details');
    } catch (error) {
      setJoinMessage(
        error instanceof Error ? error.message : 'Unable to create class.'
      );
    } finally {
      setIsCreating(false);
      setLoadingMessage('');
    }
  };

  const requestLeaveClass = (classItem: ClassGroup) => {
    setConfirmAction({
      type: 'leave',
      classId: classItem.id,
      className: classItem.name,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const action = confirmAction;
    setConfirmAction(null);

    if (action.type === 'leave') {
      setLeavingClassId(action.classId);

      try {
        const targetClass = classes.find(
          (classItem) => classItem.id === action.classId
        );

        const isOwner =
          targetClass?.ownerId === currentUser.id ||
          targetClass?.representativeId === currentUser.id;

        const assistants =
          targetClass?.members?.filter(
            (member: any) =>
              member.id !== currentUser.id &&
              (member.role === 'assistant' ||
                member.role === 'admin' ||
                member.role === 'representative')
          ) || [];

        if (isOwner && assistants.length > 0 && onTransferOwnership) {
          setSelectedTransferId(assistants[0].id);
          setShowTransferModal(true);
        } else {
          onLeaveClass(action.classId);
          showToast('success', 'You left the class.');
        }
      } finally {
        setLeavingClassId(null);
      }

      return;
    }

    if (action.type === 'delete') {
      onDeleteClass(action.classId);
      showToast('success', 'Class deleted.');
      return;
    }

    if (action.type === 'regenerate') {
      await handleRegenerateCode(action.classId);
      return;
    }

    if (action.type === 'remove-member') {
      onRemoveMemberInstantly(action.classId, action.memberId);
      showToast('success', `${action.memberName} was removed.`);
      return;
    }

    if (action.type === 'request-removal') {
      onRequestMemberRemoval(action.classId, action.memberId);
      showToast('info', 'Removal request submitted.');
      return;
    }

    if (action.type === 'reject-join') {
      await handleRejectJoin(action.classId, action.userId);
    }
  };

  const handleDelete = (classItem: ClassGroup) => {
    setConfirmAction({
      type: 'delete',
      classId: classItem.id,
      className: classItem.name,
    });
  };

  const handleRegenerateCode = async (classId: string) => {
    setIsRegenerating(true);
    setLoadingMessage('Generating new class code...');

    try {
      const newCode = await onUpdateClassCode(classId);

      showToast(
        'success',
        newCode ? `New class code: ${newCode}` : 'Class code updated.'
      );
    } catch (error) {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Unable to regenerate class code.'
      );
    } finally {
      setIsRegenerating(false);
      setLoadingMessage('');
    }
  };

  const handleApproveJoin = async (
    classId: string,
    userId: string
  ) => {
    if (!onApproveJoinRequest) return;

    setProcessingJoinId(userId);

    try {
      await onApproveJoinRequest(classId, userId);
      showToast('success', 'Join request approved.');
    } catch (error) {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Unable to approve join request.'
      );
    } finally {
      setProcessingJoinId(null);
    }
  };

  const handleRejectJoin = async (
    classId: string,
    userId: string
  ) => {
    if (!onRejectJoinRequest) return;

    setProcessingJoinId(userId);

    try {
      await onRejectJoinRequest(classId, userId);
      showToast('success', 'Join request rejected.');
    } catch (error) {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Unable to reject join request.'
      );
    } finally {
      setProcessingJoinId(null);
    }
  };

  const copyClassCode = async (code?: string) => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      trackClick('class_code_copy');
    } catch {
      showToast('error', 'Unable to copy class code.');
    }
  };

  const isUserAdminOrAssistantOfActiveClass =
    activeClass &&
    (activeClass.ownerId === currentUser.id ||
      activeClass.representativeId === currentUser.id ||
      currentUserRole === 'admin' ||
      currentUserRole === 'assistant');

  const pendingRemovalCount = pendingRemovals.filter(
    (request) => request.classId === activeClassId
  ).length;
  return (
    <div className="relative min-h-full bg-white text-zinc-950 dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Class spaces
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Your classes
            </h1>

            <p className="mt-1 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
              Manage your class spaces, members, access and class codes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('details');
                trackClick('class_details_tab');
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'details'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              My classes
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                regenerateCaptcha();
                trackClick('class_create_tab');
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === 'create'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-black'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              Create class
            </button>
          </div>
        </div>

        {activeTab === 'details' && (
          <section id="details-section" className="space-y-5">
            {classes.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                  <Users className="h-5 w-5 text-zinc-500" />
                </div>

                <h2 className="text-base font-black">
                  No classes yet
                </h2>

                <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                  Join an existing class with a class code or create a new
                  class space.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('join');
                      regenerateCaptcha();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Join a class
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('create');
                      regenerateCaptcha();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
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
                      onClick={() => {
                        setActiveTab('join');
                        regenerateCaptcha();
                        trackClick('join_another_class');
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      Join another class
                      <ChevronRight className="ml-auto h-3.5 w-3.5" />
                    </button>
                  </div>
                </aside>

                {/* Active class */}
                <div className="min-w-0 space-y-5">
                  {activeClass ? (
                    <>
                      {/* Class overview */}
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
                                  activeClass.representativeId ===
                                    currentUser.id) && (
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

                        {/* Class code */}
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
                                onClick={() =>
                                  copyClassCode(activeClass.code)
                                }
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

                      {/* Join requests */}
                      {((activeClass as any).joinRequests?.length || 0) >
                        0 &&
                        isUserAdminOrAssistantOfActiveClass && (
                          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="mb-4 flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <UserPlus className="h-4 w-4 text-zinc-500" />
                                  <h3 className="text-sm font-black">
                                    Join requests
                                  </h3>
                                </div>

                                <p className="mt-1 text-xs text-zinc-400">
                                  Review students waiting to enter this class.
                                </p>
                              </div>

                              <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                                {(activeClass as any).joinRequests?.length}
                              </span>
                            </div>

                            <div className="space-y-2">
                              {(activeClass as any).joinRequests.map(
                                (request: any) => {
                                  const userId =
                                    request.userId ||
                                    request.id ||
                                    request.studentId;

                                  const userName =
                                    request.userName ||
                                    request.name ||
                                    getMemberName(userId);

                                  const processing =
                                    processingJoinId === userId;

                                  return (
                                    <div
                                      key={userId}
                                      className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                      <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                                          {String(userName)
                                            .charAt(0)
                                            .toUpperCase()}
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
                                            handleApproveJoin(
                                              activeClass.id,
                                              userId
                                            )
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
                                            setConfirmAction({
                                              type: 'reject-join',
                                              classId: activeClass.id,
                                              userId,
                                                                                            userName,
                                            })
                                          }
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                        >
                                          <X className="h-3 w-3" />
                                          Deny
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pending member removals */}
                        {pendingRemovalCount > 0 &&
                          isUserAdminOrAssistantOfActiveClass && (
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
                                  .filter(
                                    (request) =>
                                      request.classId === activeClass.id
                                  )
                                  .map((request) => {
                                    const memberName = getMemberName(
                                      request.memberId
                                    );

                                    return (
                                      <div
                                        key={`${request.classId}-${request.memberId}`}
                                        className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                                      >
                                        <div className="flex min-w-0 items-center gap-3">
                                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                                            {memberName
                                              .charAt(0)
                                              .toUpperCase()}
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
                                            onClick={() => {
                                              onApproveMemberRemoval(
                                                activeClass.id,
                                                request.memberId
                                              );
                                              showToast(
                                                'success',
                                                'Removal approved.'
                                              );
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-2 text-[10px] font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                          >
                                            <Check className="h-3 w-3" />
                                            Approve
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              onRejectMemberRemoval(
                                                activeClass.id,
                                                request.memberId
                                              );
                                              showToast(
                                                'info',
                                                'Removal request rejected.'
                                              );
                                            }}
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

                        {/* Members */}
                        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                          <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-zinc-500" />
                                  <h3 className="text-sm font-black">
                                    Members
                                  </h3>
                                </div>

                                <p className="mt-1 text-xs text-zinc-400">
                                  Students currently inside this class.
                                </p>
                              </div>

                              <span className="text-xs font-black text-zinc-400">
                                {activeClass.members?.length || 0}
                              </span>
                            </div>
                          </div>

                          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {(activeClass.members || []).map(
                              (member: any) => {
                                const memberId = member.id;
                                const memberName =
                                  member.name ||
                                  member.fullName ||
                                  getMemberName(memberId);

                                const memberRole =
                                  member.role ||
                                  (memberId === activeClass.ownerId
                                    ? 'owner'
                                    : 'member');

                                const isCurrentUser =
                                  memberId === currentUser.id;

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
                                        {memberName
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="truncate text-xs font-black">
                                            {memberName}
                                          </p>

                                          {isCurrentUser && (
                                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                                              You
                                            </span>
                                          )}
                                        </div>

                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-400">
                                          {memberRole === 'owner' ||
                                          isOwner ? (
                                            <>
                                              <Crown className="h-3 w-3" />
                                              Representative
                                            </>
                                          ) : memberRole === 'assistant' ||
                                            memberRole === 'admin' ? (
                                            <>
                                              <UserCog className="h-3 w-3" />
                                              Assistant
                                            </>
                                          ) : (
                                            <>
                                              <UserCheck className="h-3 w-3" />
                                              Member
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {canManageMember &&
                                      !isCurrentUser &&
                                      !isOwner && (
                                        <div className="flex flex-wrap items-center gap-2">
                                          {memberRole === 'assistant' ||
                                          memberRole === 'admin' ? (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                onDemoteToMember(
                                                  activeClass.id,
                                                  memberId
                                                );
                                                showToast(
                                                  'success',
                                                  `${memberName} is now a member.`
                                                );
                                              }}
                                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                            >
                                              <UserCheck className="h-3 w-3" />
                                              Demote
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                onPromoteToAssistant(
                                                  activeClass.id,
                                                  memberId
                                                );
                                                showToast(
                                                  'success',
                                                  `${memberName} is now an assistant.`
                                                );
                                              }}
                                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                            >
                                              <UserCog className="h-3 w-3" />
                                              Make assistant
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            onClick={() =>
                                              setConfirmAction({
                                                type: 'remove-member',
                                                classId: activeClass.id,
                                                memberId,
                                                memberName,
                                              })
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                            Remove
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
                                            setConfirmAction({
                                              type: 'request-removal',
                                              classId: activeClass.id,
                                              memberId,
                                              memberName,
                                            })
                                          }
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[10px] font-black text-zinc-500 transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                                        >
                                          <ShieldAlert className="h-3 w-3" />
                                          Request removal
                                        </button>
                                      )}
                                  </div>
                                );
                              }
                            )}

                            {(!activeClass.members ||
                              activeClass.members.length === 0) && (
                              <div className="p-8 text-center">
                                <Users className="mx-auto h-5 w-5 text-zinc-400" />
                                <p className="mt-2 text-xs font-bold text-zinc-500">
                                  No members yet.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      {/* Class management */}
                      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-zinc-500" />
                            <h3 className="text-sm font-black">
                              Class management
                            </h3>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            Manage access, ownership, and this class.
                          </p>
                        </div>

                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {currentUser.id === activeClass.ownerId && (
                            <>
                              <div className="flex items-center justify-between gap-4 px-5 py-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold">
                                    Class code
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-500">
                                    Regenerate the code if it has been shared
                                    too widely.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      type: 'regenerate',
                                      classId: activeClass.id,
                                      className: activeClass.name,
                                    })
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
                                      Give another administrator ownership of
                                      this class.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTransferId('');
                                      setShowTransferModal(true);
                                    }}
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
                              <p className="text-sm font-bold">
                                Leave class
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                Remove yourself from this class.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                requestLeaveClass(
                                  activeClass.id,
                                  activeClass.name
                                )
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

                          {currentUser.id === activeClass.ownerId && (
                            <div className="flex items-center justify-between gap-4 bg-zinc-50 px-5 py-4 dark:bg-zinc-900/40">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                  Delete class
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  Permanently remove this class and its
                                  membership.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({
                                    type: 'delete',
                                    classId: activeClass.id,
                                    className: activeClass.name,
                                  })
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
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'join' && (
              <section
                id="join-section"
                className="mx-auto max-w-2xl space-y-5"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    Join class
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Enter a class code
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Use the code provided by the class owner or representative.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                    <KeyRound className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                  </div>

                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">
                    Class code
                  </label>

                  <input
                    value={joinCode}
                    onChange={(event) =>
                      setJoinCode(event.target.value.toUpperCase())
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleJoin();
                      }
                    }}
                    placeholder="Enter class code"
                    autoComplete="off"
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-black tracking-[0.18em] outline-none transition placeholder:font-medium placeholder:tracking-normal focus:border-zinc-950 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
                  />

                  <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-zinc-500" />
                      <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                        Verification
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-bold">
                      Solve: {captchaNum1} + {captchaNum2} = ?
                    </p>

                    <input
                      value={captchaAnswer}
                      onChange={(event) => {
                        setCaptchaAnswer(event.target.value);
                        setCaptchaError('');
                      }}
                      inputMode="numeric"
                      placeholder="Answer"
                      className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:font-medium focus:border-zinc-950 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
                    />

                    {captchaError && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {captchaError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={regenerateCaptcha}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-black text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      New question
                    </button>
                  </div>

                  {joinMessage && (
                    <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      {joinMessage}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {isJoining ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join class
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}
            {activeTab === 'create' && (
              <section
                id="create-section"
                className="mx-auto max-w-2xl space-y-5"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    Create class
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Create a new class
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Set up a space for your class, department, or study group.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">
                        Class name
                      </label>
                      <input
                        value={classNameInput}
                        onChange={(event) =>
                          setClassNameInput(event.target.value)
                        }
                        placeholder="e.g. MTH 102"
                        className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition placeholder:font-medium focus:border-zinc-950 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">
                        Description
                      </label>
                      <textarea
                        value={classDescriptionInput}
                        onChange={(event) =>
                          setClassDescriptionInput(event.target.value)
                        }
                        rows={4}
                        placeholder="What is this class for?"
                        className="mt-2 w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">
                        Visibility
                      </label>

                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() =>
                            setClassVisibilityInput('public')
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            classVisibilityInput === 'public'
                              ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900'
                              : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Globe2 className="h-4 w-4 text-zinc-500" />
                            <span className="text-sm font-black">Public</span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-zinc-500">
                            Anyone with the class code can request to join.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setClassVisibilityInput('private')
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            classVisibilityInput === 'private'
                              ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900'
                              : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LockKeyhole className="h-4 w-4 text-zinc-500" />
                            <span className="text-sm font-black">Private</span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-zinc-500">
                            Only people you approve can join this class.
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-zinc-500" />
                        <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                          Verification
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-bold">
                        Solve: {captchaNum1} + {captchaNum2} = ?
                      </p>

                      <input
                        value={captchaAnswer}
                        onChange={(event) => {
                          setCaptchaAnswer(event.target.value);
                          setCaptchaError('');
                        }}
                        inputMode="numeric"
                        placeholder="Answer"
                        className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:font-medium focus:border-zinc-950 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
                      />

                      {captchaError && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {captchaError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={regenerateCaptcha}
                        className="mt-3 inline-flex items-center gap-2 text-xs font-black text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        New question
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreate}
                      disabled={isCreating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create class
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

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
                    ? 'Creating class'
                    : isJoining
                    ? 'Joining class'
                    : 'Updating class'}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {loadingMessage || 'Please wait...'}
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
                <p className="text-sm font-black">Transfer ownership</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Select an assistant to become the new owner.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
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
                    const selected = selectedTransferId === member.id;

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setSelectedTransferId(member.id)}
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
                onClick={() => setShowTransferModal(false)}
                className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!selectedTransferId}
                onClick={async () => {
                  if (!selectedTransferId || !onTransferOwnership) return;

                  try {
                    await onTransferOwnership(
                      activeClass.id,
                      selectedTransferId
                    );
                    setShowTransferModal(false);
                    setSelectedTransferId('');
                    showToast('success', 'Ownership transferred.');
                  } catch {
                    showToast(
                      'error',
                      'Unable to transfer ownership.'
                    );
                  }
                }}
                className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Transfer
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
                  ? 'Delete class?'
                  : confirmAction.type === 'regenerate'
                  ? 'Regenerate class code?'
                  : confirmAction.type === 'reject-join'
                  ? 'Reject join request?'
                  : confirmAction.type === 'remove-member'
                  ? 'Remove member?'
                  : 'Request member removal?'}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {confirmAction.type === 'delete'
                  ? `This will permanently delete "${confirmAction.className}". This action cannot be undone.`
                  : confirmAction.type === 'regenerate'
                  ? `The current code for "${confirmAction.className}" will stop working and a new code will be generated.`
                  : confirmAction.type === 'reject-join'
                  ? `${confirmAction.userName}'s request to join this class will be rejected.`
                  : confirmAction.type === 'remove-member'
                  ? `${confirmAction.memberName} will be removed from this class.`
                  : `${confirmAction.memberName} will receive a removal request for this class.`}
              </p>
            </div>

            <div className="flex gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-black text-white transition ${
                  confirmAction.type === 'delete' ||
                  confirmAction.type === 'remove-member' ||
                  confirmAction.type === 'reject-join'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
                }`}
              >
                {confirmAction.type === 'delete'
                  ? 'Delete'
                  : confirmAction.type === 'regenerate'
                  ? 'Regenerate'
                  : confirmAction.type === 'reject-join'
                  ? 'Reject'
                  : confirmAction.type === 'remove-member'
                  ? 'Remove'
                  : 'Request removal'}
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
              onClick={() => setToast(null)}
              className="shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassView;