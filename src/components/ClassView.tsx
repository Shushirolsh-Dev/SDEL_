import React, { useState, useEffect } from 'react';
import { Users, Shield, Plus, Key, LogIn, AlertCircle, Trash2, ShieldAlert, Check, RefreshCw, Award, HelpCircle, LogOut, Crown, UserCog, UserCheck, UserX, Crown as CrownIcon } from 'lucide-react';
import { ClassGroup, User, Role, PendingRemoval } from '../types';
import { trackClick } from '../utils/tracker';

interface ClassViewProps {
  classes: ClassGroup[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onJoinClass: (code: string) => void;
  onCreateClass: (name: string, description: string, visibility: 'public' | 'private') => Promise<string>;
  onPromoteToAssistant: (classId: string, memberId: string) => void;
  onDemoteToMember: (classId: string, assistantId: string) => void;
  onDeleteClass: (classId: string) => void;
  onLeaveClass: (classId: string) => void;
  onTransferOwnership?: (classId: string, newOwnerId: string) => Promise<void>;
  currentUser: User;
  currentUserRole: Role;
  pendingRemovals: PendingRemoval[];
  onRequestMemberRemoval: (classId: string, memberId: string) => void;
  onRemoveMemberInstantly: (classId: string, memberId: string) => void;
  onApproveMemberRemoval: (classId: string, memberId: string) => void;
  onRejectMemberRemoval: (classId: string, memberId: string) => void;
  onUpdateClassCode: (classId: string) => Promise<string>;
  memberNamesMap: Record<string, string>;
  onApproveJoinRequest?: (classId: string, userId: string) => Promise<void>;
  onRejectJoinRequest?: (classId: string, userId: string) => Promise<void>;
}

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
  const [activeTab, setActiveTab] = useState<'details' | 'join' | 'create'>('details');
  const [joinCode, setJoinCode] = useState('');
  const [classNameInput, setClassNameInput] = useState('');
  const [classDescriptionInput, setClassDescriptionInput] = useState('');
  const [classVisibilityInput, setClassVisibilityInput] = useState<'public' | 'private'>('public');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [processingJoinId, setProcessingJoinId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [leavingClassId, setLeavingClassId] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);

  const loadingMessages = [
    'Creating Class... Hold on',
    'Setting up your classroom...',
    'Almost there...',
    'Securing your class code...',
    'Finalizing your workspace...',
    'Hang tight, we\'re almost done...',
    'Preparing your class dashboard...',
    'Just a moment longer...'
  ];

  const joinMessages = [
    'Checking class code...',
    'Verifying your access...',
    'Securing your enrollment...',
    'Adding you to the roster...',
    'Almost there...',
    'Success! Welcome to the class!'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCreating) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setLoadingMessage(loadingMessages[loadingMessageIndex]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isCreating, loadingMessageIndex, loadingMessages]);

  useEffect(() => {
    if (isJoining) {
      let index = 0;
      const interval = setInterval(() => {
        setJoinMessage(joinMessages[index % joinMessages.length]);
        index++;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isJoining]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
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
    if (id === currentUser.id) return `${currentUser.name} (You)`;
    if (memberNamesMap && memberNamesMap[id]) return memberNamesMap[id];
    return `Student (${id.substring(0, 8)})`;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setCaptchaError('');

    if (!joinCode.trim()) {
      showToast('error', 'Please enter a class code.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError('Incorrect security answer. Please try again.');
      regenerateCaptcha();
      return;
    }

    trackClick('Button: Join Class Code Submit');
    
    setIsJoining(true);
    setJoinMessage('Checking class code...');

    try {
      onJoinClass(joinCode.trim());
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
    setErrorMessage('');
    setSuccessMessage('');
    setCaptchaError('');

    if (!classNameInput.trim()) {
      showToast('error', 'Class name is required.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError('Incorrect security answer. Please try again.');
      regenerateCaptcha();
      return;
    }

    setIsCreating(true);
    setLoadingMessage(loadingMessages[0]);

    try {
      trackClick('Button: Create Class Submit');
      const code = await onCreateClass(
        classNameInput.trim(),
        classDescriptionInput.trim(),
        classVisibilityInput
      );
      showToast('success', `Class "${classNameInput.trim()}" created successfully with code: ${code}`);
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

  const handleLeaveClass = (classId: string, className: string) => {
    // Check if user is the owner (representative)
    const activeClass = classes.find(c => c.id === classId);
    if (activeClass && activeClass.ownerId === currentUser.id) {
      // If there are assistants, show transfer modal
      if (activeClass.assistantIds.length > 0) {
        setShowTransferModal(true);
        return;
      } else {
        showToast('error', 'You are the class representative. You must delete the class or promote someone to assistant first.');
        return;
      }
    }
    
    if (!confirm(`Are you sure you want to leave "${className}"? You will lose access to this class and its timetable.`)) return;
    
    setLeavingClassId(classId);
    try {
      trackClick('Button: Leave Class');
      onLeaveClass(classId);
      showToast('success', `You have left "${className}".`);
      if (activeClassId === classId && classes.length > 1) {
        const remaining = classes.filter(c => c.id !== classId);
        if (remaining.length > 0) {
          onSelectClass(remaining[0].id);
        }
      }
    } catch (err) {
      showToast('error', 'Failed to leave class. Please try again.');
    } finally {
      setLeavingClassId(null);
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedTransferId || !activeClass || !onTransferOwnership) return;
    
    try {
      await onTransferOwnership(activeClass.id, selectedTransferId);
      setShowTransferModal(false);
      setSelectedTransferId(null);
      showToast('success', 'Ownership transferred successfully.');
    } catch (err) {
      showToast('error', 'Failed to transfer ownership. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!activeClass) return;
    if (currentUserRole !== 'representative') {
      showToast('error', 'Only Class Representatives can delete classes.');
      return;
    }

    if (confirm(`CRITICAL ACTION: Are you sure you want to permanently delete the class "${activeClass.name}"? This will delete the timetable entries.`)) {
      trackClick('Button: Delete Class Success');
      onDeleteClass(activeClass.id);
      showToast('success', 'Class was successfully deleted.');
    }
  };

  const handleRegenerateCode = async () => {
    if (!activeClass) return;
    if (confirm("Are you sure you want to regenerate and change the Class Code? Any student trying to join using the old code will no longer be able to do so.")) {
      try {
        setIsRegenerating(true);
        trackClick('Button: Regenerate Class Code');
        const newCode = await onUpdateClassCode(activeClass.id);
        showToast('success', `Class code successfully changed to: ${newCode}`);
      } catch (err) {
        showToast('error', 'Failed to change class code.');
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const handleApproveJoin = async (userId: string) => {
    if (!activeClass || !onApproveJoinRequest) return;
    setProcessingJoinId(userId);
    try {
      trackClick('Button: Approve Class Member Join');
      await onApproveJoinRequest(activeClass.id, userId);
      showToast('success', 'Student joining request approved!');
    } catch (err: any) {
      showToast('error', `Failed to approve member: ${err.message || err}`);
    } finally {
      setProcessingJoinId(null);
    }
  };

  const handleRejectJoin = async (userId: string) => {
    if (!activeClass || !onRejectJoinRequest) return;
    if (!confirm('Are you sure you want to deny and reject this student request?')) return;
    setProcessingJoinId(userId);
    try {
      trackClick('Button: Reject Class Member Join');
      await onRejectJoinRequest(activeClass.id, userId);
      showToast('success', 'Student joining request denied.');
    } catch (err: any) {
      showToast('error', `Failed to reject member: ${err.message || err}`);
    } finally {
      setProcessingJoinId(null);
    }
  };

  const isUserAdminOrAssistantOfActiveClass = activeClass && (
    activeClass.ownerId === currentUser.id || activeClass.assistantIds.includes(currentUser.id)
  );

  return (
    <div className="space-y-6" id="class-view-container">
      {/* Transfer Modal */}
      {showTransferModal && activeClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <CrownIcon className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Transfer Ownership</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              You are the class representative. To leave this class, you must transfer ownership to one of the assistants below.
            </p>
            <div className="space-y-2 mb-4">
              {activeClass.assistantIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedTransferId(id)}
                  className={`w-full text-left p-3 border transition-all flex items-center justify-between ${
                    selectedTransferId === id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{getMemberName(id)}</span>
                  </div>
                  {selectedTransferId === id && (
                    <Check className="w-4 h-4 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTransferOwnership}
                disabled={!selectedTransferId}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transfer & Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{loadingMessage}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">Please wait while we set up your classroom...</p>
          </div>
        </div>
      )}

      {isJoining && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{joinMessage}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">Please wait while we enroll you...</p>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 max-w-sm w-full border shadow-lg transition-all animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50' 
            : toast.type === 'info'
            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
        }`}>
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'info' ? (
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                toast.type === 'success' ? 'text-emerald-800 dark:text-emerald-300' : 
                toast.type === 'info' ? 'text-blue-800 dark:text-blue-300' :
                'text-red-800 dark:text-red-300'
              }`}>
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono" id="class-subnav">
        <button
          onClick={() => { setActiveTab('details'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`px-4 py-2 border-b-2 -mb-[2px] cursor-pointer font-bold ${
            activeTab === 'details' ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-205'
          }`}
        >
          My Classes
        </button>
        <button
          id="tab-join-class"
          onClick={() => { setActiveTab('join'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`px-4 py-2 border-b-2 -mb-[2px] cursor-pointer font-bold ${
            activeTab === 'join' ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-205'
          }`}
        >
          Join with Code
        </button>
        <button
          id="tab-create-class"
          onClick={() => { setActiveTab('create'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`px-4 py-2 border-b-2 -mb-[2px] cursor-pointer font-bold ${
            activeTab === 'create' ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : 'border-transparent text-zinc-500 dark:text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-205'
          }`}
        >
          Create New Class
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="space-y-6" id="details-section">
          {classes.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4 rounded-none">
              <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">You are not a member of any class group yet.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('join')}
                  className="px-4 py-2 text-xs font-mono font-bold bg-zinc-900 dark:bg-zinc-800 text-white cursor-pointer"
                >
                  Join Class
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 text-xs font-mono font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Create Class
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="class-layout-grid">
              <div className="space-y-3" id="class-sidebar-list">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Select Active Class
                  </h3>
                </div>
                <div className="space-y-1.5" id="class-switching-list">
                  {classes.map((cls) => {
                    const isSelected = cls.id === activeClassId;
                    const userIsOwner = cls.ownerId === currentUser.id;
                    const userIsAssistant = cls.assistantIds.includes(currentUser.id);
                    const isLeaving = leavingClassId === cls.id;
                    
                    let roleBadge = 'Member';
                    let badgeColor = 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400';
                    if (userIsOwner) {
                      roleBadge = 'Rep';
                      badgeColor = 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400';
                    } else if (userIsAssistant) {
                      roleBadge = 'Asst';
                      badgeColor = 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400';
                    }

                    return (
                      <div key={cls.id} className="flex items-center gap-1">
                        <button
                          id={`select-class-btn-${cls.id}`}
                          onClick={() => onSelectClass(cls.id)}
                          className={`flex-1 text-left p-3 border transition-colors flex items-center justify-between rounded-none cursor-pointer ${
                            isSelected
                              ? 'border-zinc-900 dark:border-zinc-750 bg-zinc-900 dark:bg-zinc-800 text-white'
                              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="block text-xs font-mono font-bold">{cls.code}</span>
                            <span className="block text-xs truncate font-sans">{cls.name}</span>
                          </div>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${badgeColor}`}>
                            {roleBadge}
                          </span>
                        </button>
                        {!userIsOwner && (
                          <button
                            onClick={() => handleLeaveClass(cls.id, cls.name)}
                            disabled={isLeaving}
                            className={`p-2 border transition-colors rounded-none cursor-pointer ${
                              isSelected
                                ? 'border-zinc-900 dark:border-zinc-750 bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700'
                                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400'
                            }`}
                            title="Leave this class"
                          >
                            <LogOut className={`w-4 h-4 ${isLeaving ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6" id="class-main-details">
                {activeClass ? (
                  <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 space-y-6 rounded-none">
                    
                    {isUserAdminOrAssistantOfActiveClass && activeClass.pendingMemberIds && activeClass.pendingMemberIds.length > 0 && (
                      <div className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-none space-y-3" id="pending-join-requests-panel">
                        <h4 className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <Shield className="w-4 h-4 text-indigo-650" />
                          Pending Classroom Join Requests ({activeClass.pendingMemberIds.length})
                        </h4>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                          The following student(s) requested to enroll in this Private classroom group. Approve or deny their access using the controls below:
                        </p>
                        <div className="divide-y divide-indigo-150 dark:divide-indigo-900/40 border border-indigo-200 dark:border-indigo-900/40">
                          {activeClass.pendingMemberIds.map((userId) => {
                            const isProcessing = processingJoinId === userId;
                            return (
                              <div key={userId} className="p-3 flex items-center justify-between text-xs font-mono bg-white dark:bg-zinc-900">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{getMemberName(userId)}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApproveJoin(userId)}
                                    disabled={isProcessing}
                                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[10px] uppercase cursor-pointer disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectJoin(userId)}
                                    disabled={isProcessing}
                                    className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[10px] uppercase cursor-pointer disabled:opacity-50"
                                  >
                                    Deny
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {currentUserRole === 'representative' && activeClass.ownerId === currentUser.id && pendingRemovals.filter(pr => pr.classId === activeClass.id).length > 0 && (
                      <div className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-none space-y-3" id="pending-removals-panel">
                        <h4 className="text-xs font-mono font-bold text-amber-805 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                          <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-450" />
                          Pending Member Removals (Action Required)
                        </h4>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-sans leading-relaxed">
                          The following removal requests were initiated by class assistants. As the Class Representative, you must approve these pending requests before students are permanently removed.
                        </p>
                        <div className="divide-y divide-amber-100 dark:divide-amber-900/40 border border-amber-200 dark:border-amber-900/40">
                          {pendingRemovals.filter(pr => pr.classId === activeClass.id).map((pr) => (
                            <div key={pr.id} className="p-3 flex items-center justify-between text-xs font-mono bg-white dark:bg-zinc-900">
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{getMemberName(pr.userId)}</span>
                                <span className="text-[10px] text-zinc-450">Requested by: {getMemberName(pr.requestedBy)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onApproveMemberRemoval(activeClass.id, pr.userId)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Approve Removal
                                </button>
                                <button
                                  onClick={() => onRejectMemberRemoval(activeClass.id, pr.userId)}
                                  className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[10px] uppercase cursor-pointer"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500">Class Group Details</span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border ${
                            activeClass.visibility === 'private'
                              ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                              : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                          }`}>
                            {activeClass.visibility || 'public'} Classroom
                          </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
                          {activeClass.name}
                        </h2>
                        {activeClass.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed max-w-xl">
                            {activeClass.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 font-mono text-center shrink-0 relative">
                          <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Class Code</span>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            <span className="text-base font-bold tracking-wider text-zinc-900 dark:text-zinc-100">{activeClass.code}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(activeClass.code);
                                showToast('success', 'Class code copied to clipboard!');
                              }}
                              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
                              title="Copy class code"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                            {currentUserRole === 'representative' && activeClass.ownerId === currentUser.id && (
                              <button
                                onClick={handleRegenerateCode}
                                disabled={isRegenerating}
                                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors"
                                title="Regenerate Class Code"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>
                        {currentUserRole !== 'representative' && (
                          <button
                            onClick={() => handleLeaveClass(activeClass.id, activeClass.name)}
                            className="px-3 py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 font-mono text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Leave
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3" id="class-members-section">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        Members & Roster ({activeClass.memberIds.length + activeClass.assistantIds.length + 1} enrolled)
                      </h3>

                      <div className="border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800" id="members-list">
                        
                        <div className="p-3 flex items-center justify-between text-xs font-mono bg-zinc-50 dark:bg-zinc-950">
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{getMemberName(activeClass.ownerId)}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                            Representative
                          </span>
                        </div>

                        {activeClass.assistantIds.map((asstId) => (
                          <div key={asstId} className="p-3 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <UserCog className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{getMemberName(asstId)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                                Assistant
                              </span>
                              {currentUserRole === 'representative' && (
                                <>
                                  <button
                                    id={`demote-btn-${asstId}`}
                                    onClick={() => onDemoteToMember(activeClass.id, asstId)}
                                    className="text-[10px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 cursor-pointer bg-zinc-50 dark:bg-zinc-900"
                                  >
                                    Demote
                                  </button>
                                  <button
                                    id={`remove-asst-btn-${asstId}`}
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to instantly remove ${getMemberName(asstId)} from this class group?`)) {
                                        onRemoveMemberInstantly(activeClass.id, asstId);
                                      }
                                    }}
                                    className="text-[10px] text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-100 dark:border-red-900/40 hover:border-red-200 dark:hover:border-red-650 px-1.5 py-0.5 cursor-pointer bg-red-50 dark:bg-red-950/20"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {activeClass.memberIds
                          .filter((id) => id !== activeClass.ownerId && !activeClass.assistantIds.includes(id))
                          .map((memId) => {
                            const isPending = pendingRemovals.some(pr => pr.classId === activeClass.id && pr.userId === memId);
                            return (
                              <div key={memId} className="p-3 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                                  <span className="text-zinc-650 dark:text-zinc-300">{getMemberName(memId)}</span>
                                  {isPending && (
                                    <span className="text-[9px] font-mono uppercase px-1 py-0.2 bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border border-amber-250 dark:border-amber-900/40 animate-pulse">
                                      Pending Removal
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Member</span>
                                  
                                  {currentUserRole === 'representative' && (
                                    <>
                                      <button
                                        id={`promote-btn-${memId}`}
                                        onClick={() => onPromoteToAssistant(activeClass.id, memId)}
                                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-100 dark:border-blue-900/40 hover:border-blue-200 dark:hover:border-blue-650 px-1.5 py-0.5 cursor-pointer bg-blue-50 dark:bg-blue-950/20"
                                      >
                                        Promote
                                      </button>
                                      <button
                                        id={`remove-inst-btn-${memId}`}
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to instantly remove ${getMemberName(memId)}?`)) {
                                            onRemoveMemberInstantly(activeClass.id, memId);
                                          }
                                        }}
                                        className="text-[10px] text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-100 dark:border-red-900/40 hover:border-red-200 dark:hover:border-red-650 px-1.5 py-0.5 cursor-pointer bg-red-50 dark:bg-red-950/20"
                                      >
                                        Remove
                                      </button>
                                    </>
                                  )}

                                  {currentUserRole === 'assistant' && !isPending && (
                                    <button
                                      id={`request-remove-btn-${memId}`}
                                      onClick={() => {
                                        if (confirm(`Send request to Class Representative to remove student ${getMemberName(memId)}?`)) {
                                          onRequestMemberRemoval(activeClass.id, memId);
                                          showToast('success', 'Removal request sent to Class Representative for final approval.');
                                        }
                                      }}
                                      className="text-[10px] text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 border border-amber-100 dark:border-amber-900/40 hover:border-amber-200 dark:hover:border-amber-650 px-1.5 py-0.5 cursor-pointer bg-amber-50 dark:bg-amber-950/20"
                                    >
                                      Request Removal
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {currentUserRole === 'representative' && activeClass.ownerId === currentUser.id && (
                      <div className="border border-red-200 dark:border-red-900/40 bg-red-50/10 dark:bg-red-950/5 p-4 rounded-none space-y-3" id="rep-admin-panel">
                        <h4 className="text-xs font-mono font-bold text-red-800 dark:text-red-400 flex items-center gap-1.5 uppercase">
                          <Trash2 className="w-4 h-4" />
                          Danger Zone
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                          <p className="text-zinc-500 dark:text-zinc-400 font-sans">
                            As the Class Representative, you have full ownership. You can permanently delete this classroom and all of its scheduled timetable entries from Thesdel.
                          </p>
                          <button
                            id="btn-delete-class"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer shrink-0"
                          >
                            Delete Classroom
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-sans italic text-center py-12">
                    Select a class group from the list to view roster and details.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'join' && (
        <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 max-w-md mx-auto rounded-none space-y-4" id="join-card">
          <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-bold text-lg tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Join Class Group
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Enter your class code to join.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Enter Class Code</label>
              <input
                id="input-join-code"
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter your class code"
                className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs"
              />
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2 rounded-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 font-mono">🤖 Human Verification Check</span>
                <button 
                  type="button" 
                  onClick={regenerateCaptcha} 
                  className="text-[9px] underline text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-205 font-mono"
                >
                  Regenerate
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                Solve the security challenge below to verify you are not an automated form bot.
              </p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-800 font-mono font-bold text-sm text-zinc-800 dark:text-zinc-200 select-none tracking-widest">
                  {captchaNum1} + {captchaNum2} = ?
                </div>
                <input
                  type="number"
                  required
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Answer"
                  className="w-24 border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 font-bold focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 text-xs font-mono text-center"
                />
              </div>
              {captchaError && (
                <p className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold">
                  ⚠️ {captchaError}
                </p>
              )}
            </div>

            <button
              id="btn-join-submit"
              type="submit"
              disabled={isJoining}
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Joining...' : 'Join Class Group'}
            </button>
          </form>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono space-y-1">
            <span className="block font-bold">Class code requirements:</span>
            <span className="block">• A valid code must be 10 characters</span>
            <span className="block">• Public classes join instantly without approval</span>
            <span className="block">• Private classes require approval from the representative or assistant</span>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 max-w-md mx-auto rounded-none space-y-4" id="create-card">
          <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-bold text-lg tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Create Class Group
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Establish a new workspace and become the designated Class Representative.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Class Name</label>
              <input
                id="input-create-name"
                type="text"
                required
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                placeholder="e.g. Mechanical Engineering Year 3"
                className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Description</label>
              <textarea
                id="input-create-description"
                value={classDescriptionInput}
                onChange={(e) => setClassDescriptionInput(e.target.value)}
                placeholder="e.g. Class of Shege."
                className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-sans h-20 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Visibility Mode</label>
              <select
                id="input-create-visibility"
                value={classVisibilityInput}
                onChange={(e) => setClassVisibilityInput(e.target.value as 'public' | 'private')}
                className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-mono cursor-pointer"
              >
                <option value="public">Public (Anyone can join with code instantly)</option>
                <option value="private">Private (Requires representative or assistant approval)</option>
              </select>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 space-y-1 font-sans text-zinc-500 text-[11px] leading-relaxed">
              <span className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase font-mono text-[9px] tracking-wider">🔒 Auto-Generated Class Code</span>
              <span>
                To ensure perfect uniqueness, the platform will auto-generate a secure 10-character code beginning with <strong className="font-mono text-zinc-800 dark:text-zinc-200">THESDEL-</strong> (consisting of upper/lower case letters and numbers only) when this class is saved to the database.
              </span>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2 rounded-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 font-mono">🤖 Human Verification Check</span>
                <button 
                  type="button" 
                  onClick={regenerateCaptcha} 
                  className="text-[9px] underline text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-205 font-mono"
                >
                  Regenerate
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
                Solve the security challenge below to verify you are not an automated form bot.
              </p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-800 font-mono font-bold text-sm text-zinc-800 dark:text-zinc-200 select-none tracking-widest">
                  {captchaNum1} + {captchaNum2} = ?
                </div>
                <input
                  type="number"
                  required
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Answer"
                  className="w-24 border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 font-bold focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 text-xs font-mono text-center"
                />
              </div>
              {captchaError && (
                <p className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold">
                  ⚠️ {captchaError}
                </p>
              )}
            </div>

            <button
              id="btn-create-submit"
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Class Group'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
