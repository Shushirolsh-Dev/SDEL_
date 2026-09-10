import React, { useEffect, useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  KeyRound,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Settings2,
} from 'lucide-react';
import { ClassGroup, User, Role, PendingRemoval } from '../types';
import { trackClick } from '../utils/tracker';

import ClassSidebar from './ClassSidebar';
import ClassOverview from './ClassOverview';
import ClassRequests from './ClassRequests';
import ClassMembersCard from './ClassMembersCard';
import ClassManagementCard from './ClassManagementCard';
import ClassModals from './ClassModals';

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
  const [processingJoinId, setProcessingJoinId] = useState<
    string | null
  >(null);
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
  const [selectedTransferId, setSelectedTransferId] = useState('');

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!loadingMessage) return;
    const timer = window.setTimeout(() => setLoadingMessage(''), 2500);
    return () => window.clearTimeout(timer);
  }, [loadingMessage]);

  useEffect(() => {
    if (!joinMessage) return;
    const timer = window.setTimeout(() => setJoinMessage(''), 3500);
    return () => window.clearTimeout(timer);
  }, [joinMessage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copiedCode) return;
    const timer = window.setTimeout(() => setCopiedCode(false), 1800);
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
        error instanceof Error
          ? error.message
          : 'Unable to create class.'
      );
    } finally {
      setIsCreating(false);
      setLoadingMessage('');
    }
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

  const requestLeaveClass = (classId: string, className: string) => {
    setConfirmAction({ type: 'leave', classId, className });
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

                <h2 className="text-base font-black">No classes yet</h2>

                <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                  Join an existing class with a class code or create a
                  new class space.
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
                <ClassSidebar
                  classes={classes}
                  activeClassId={activeClassId}
                  onSelectClass={onSelectClass}
                  onJoinAnother={() => {
                    setActiveTab('join');
                    regenerateCaptcha();
                    trackClick('join_another_class');
                  }}
                />

                <div className="min-w-0 space-y-5">
                  {activeClass && (
                    <>
                      <ClassOverview
                        activeClass={activeClass}
                        currentUser={currentUser}
                        copiedCode={copiedCode}
                        onCopyCode={copyClassCode}
                      />

                      {isUserAdminOrAssistantOfActiveClass && (
                        <ClassRequests
                          activeClass={activeClass}
                          pendingRemovals={pendingRemovals}
                          pendingRemovalCount={pendingRemovalCount}
                          processingJoinId={processingJoinId}
                          getMemberName={getMemberName}
                          onApproveJoin={handleApproveJoin}
                          onRejectJoinRequest={(
                            classId,
                            userId,
                            userName
                          ) =>
                            setConfirmAction({
                              type: 'reject-join',
                              classId,
                              userId,
                              userName,
                            })
                          }
                          onApproveRemoval={(classId, memberId) => {
                            onApproveMemberRemoval(classId, memberId);
                            showToast('success', 'Removal approved.');
                          }}
                          onRejectRemoval={(classId, memberId) => {
                            onRejectMemberRemoval(classId, memberId);
                            showToast(
                              'info',
                              'Removal request rejected.'
                            );
                          }}
                        />
                      )}

                      <ClassMembersCard
                        activeClass={activeClass}
                        currentUser={currentUser}
                        currentUserRole={currentUserRole}
                        getMemberName={getMemberName}
                        onPromote={(classId, memberId, memberName) => {
                          onPromoteToAssistant(classId, memberId);
                          showToast(
                            'success',
                            `${memberName} is now an assistant.`
                          );
                        }}
                        onDemote={(classId, memberId, memberName) => {
                          onDemoteToMember(classId, memberId);
                          showToast(
                            'success',
                            `${memberName} is now a member.`
                          );
                        }}
                                                  })
                        }
                        onRequestRemoval={(
                          classId,
                          memberId,
                          memberName
                        ) =>
                          setConfirmAction({
                            type: 'request-removal',
                            classId,
                            memberId,
                            memberName,
                          })
                        }
                      />

                      <ClassManagementCard
                        activeClass={activeClass}
                        currentUser={currentUser}
                        leavingClassId={leavingClassId}
                        onRegenerateClick={(classId, className) =>
                          setConfirmAction({
                            type: 'regenerate',
                            classId,
                            className,
                          })
                        }
                        onTransferClick={() => {
                          setSelectedTransferId('');
                          setShowTransferModal(true);
                        }}
                        onLeaveClick={requestLeaveClass}
                        onDeleteClick={(classId, className) =>
                          setConfirmAction({
                            type: 'delete',
                            classId,
                            className,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            )}
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
                Use the code provided by the class owner or
                representative.
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
                Set up a space for your class, department, or study
                group.
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
                        <Globe2Icon />
                        <span className="text-sm font-black">
                          Public
                        </span>
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
                        <LockKeyholeIcon />
                        <span className="text-sm font-black">
                          Private
                        </span>
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

      <ClassModals
        isCreating={isCreating}
        isJoining={isJoining}
        isRegenerating={isRegenerating}
        loadingMessage={loadingMessage}
        showTransferModal={showTransferModal}
        activeClass={activeClass}
        currentUser={currentUser}
        selectedTransferId={selectedTransferId}
        getMemberName={getMemberName}
        onSelectTransfer={setSelectedTransferId}
        onCloseTransfer={() => setShowTransferModal(false)}
        onConfirmTransfer={async () => {
          if (!selectedTransferId || !onTransferOwnership || !activeClass)
            return;

          try {
            await onTransferOwnership(
              activeClass.id,
              selectedTransferId
            );
            setShowTransferModal(false);
            setSelectedTransferId('');
            showToast('success', 'Ownership transferred.');
          } catch {
            showToast('error', 'Unable to transfer ownership.');
          }
        }}
        confirmAction={confirmAction}
        onCancelConfirm={() => setConfirmAction(null)}
        onConfirmAction={handleConfirmAction}
        toast={toast}
        onDismissToast={() => setToast(null)}
      />
    </div>
  );
};

/* Small inline icon wrappers so this file doesn't need extra imports
   beyond what's already used above. Keeps parity with the original
   lucide icons. */
const Globe2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-zinc-500"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const LockKeyholeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-zinc-500"
  >
    <circle cx="12" cy="16" r="1" />
    <rect x="3" y="10" width="18" height="12" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);

export default ClassView;