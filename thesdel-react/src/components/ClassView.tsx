import React, { useState } from 'react';
import { Users, Shield, Plus, Key, LogIn, AlertCircle, Trash2, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { ClassGroup, User, Role, PendingRemoval } from '../types';

interface ClassViewProps {
  classes: ClassGroup[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onJoinClass: (code: string) => void;
  onCreateClass: (name: string) => Promise<string>;
  onPromoteToAssistant: (classId: string, memberId: string) => void;
  onDemoteToMember: (classId: string, assistantId: string) => void;
  onDeleteClass: (classId: string) => void;
  currentUser: User;
  currentUserRole: Role;
  pendingRemovals: PendingRemoval[];
  onRequestMemberRemoval: (classId: string, memberId: string) => void;
  onRemoveMemberInstantly: (classId: string, memberId: string) => void;
  onApproveMemberRemoval: (classId: string, memberId: string) => void;
  onRejectMemberRemoval: (classId: string, memberId: string) => void;
  onUpdateClassCode: (classId: string) => Promise<string>;
  memberNamesMap: Record<string, string>;
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
  currentUser,
  currentUserRole,
  pendingRemovals,
  onRequestMemberRemoval,
  onRemoveMemberInstantly,
  onApproveMemberRemoval,
  onRejectMemberRemoval,
  onUpdateClassCode,
  memberNamesMap,
}: ClassViewProps) {
  // Navigation tabs inside Class screen
  const [activeTab, setActiveTab] = useState<'details' | 'join' | 'create'>('details');

  // Input states
  const [joinCode, setJoinCode] = useState('');
  const [classNameInput, setClassNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Bot protection captcha state (prevents automated joining / creation)
  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const regenerateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  // Selected class
  const activeClass = classes.find((c) => c.id === activeClassId);

  // Get name of member from map or defaults
  const getMemberName = (id: string) => {
    if (id === currentUser.id) return `${currentUser.name} (You)`;
    if (memberNamesMap && memberNamesMap[id]) return memberNamesMap[id];
    if (id === 'user_rep_1') return 'Sarah Collins';
    if (id === 'user_asst_1') return 'John Doe';
    if (id === 'user_2') return 'Alice Johnson';
    if (id === 'user_3') return 'Bob Miller';
    return `Student (${id.substring(0, 8)})`;
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setCaptchaError('');

    if (!joinCode.trim()) {
      setErrorMessage('Please enter a class code.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError('Incorrect security answer. Please try again.');
      regenerateCaptcha();
      return;
    }

    const code = joinCode.trim().toUpperCase();
    onJoinClass(code);
    setJoinCode('');
    setCaptchaAnswer('');
    regenerateCaptcha();
    setActiveTab('details');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setCaptchaError('');

    if (!classNameInput.trim()) {
      setErrorMessage('Class name is required.');
      return;
    }

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError('Incorrect security answer. Please try again.');
      regenerateCaptcha();
      return;
    }

    try {
      // Call create handler which auto-generates the code on server/db
      const code = await onCreateClass(classNameInput.trim());
      setSuccessMessage(`Class "${classNameInput.trim()}" created successfully with unique code: ${code}`);
      setClassNameInput('');
      setCaptchaAnswer('');
      regenerateCaptcha();
      setActiveTab('details');
    } catch (err) {
      setErrorMessage('An error occurred while creating the class group.');
    }
  };

  const handleDelete = () => {
    if (!activeClass) return;
    if (currentUserRole !== 'representative') {
      alert('Forbidden: Only Class Representatives can delete classes.');
      return;
    }

    if (confirm(`CRITICAL ACTION: Are you sure you want to permanently delete the class "${activeClass.name}"? This will delete the timetable entries.`)) {
      onDeleteClass(activeClass.id);
      setSuccessMessage('Class was successfully deleted.');
    }
  };

  const handleRegenerateCode = async () => {
    if (!activeClass) return;
    if (confirm("Are you sure you want to regenerate and change the Class Code? Any student trying to join using the old code will no longer be able to do so.")) {
      try {
        setIsRegenerating(true);
        const newCode = await onUpdateClassCode(activeClass.id);
        setSuccessMessage(`Class code successfully changed to: ${newCode}`);
      } catch (err) {
        setErrorMessage("Failed to change class code.");
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6" id="class-view-container">
      {/* Sub-navigation Menu */}
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

      {/* Info Status messages */}
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Screen 1: Details of Active Class */}
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
              {/* Class list side rail */}
              <div className="space-y-3" id="class-sidebar-list">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Select Active Class
                </h3>
                <div className="space-y-1.5" id="class-switching-list">
                  {classes.map((cls) => {
                    const isSelected = cls.id === activeClassId;
                    const userIsOwner = cls.ownerId === currentUser.id;
                    const userIsAssistant = cls.assistantIds.includes(currentUser.id);
                    
                    let roleBadge = 'Member';
                    if (userIsOwner) roleBadge = 'Rep';
                    else if (userIsAssistant) roleBadge = 'Asst';

                    return (
                      <button
                        key={cls.id}
                        id={`select-class-btn-${cls.id}`}
                        onClick={() => onSelectClass(cls.id)}
                        className={`w-full text-left p-3 border transition-colors flex items-center justify-between rounded-none cursor-pointer ${
                          isSelected
                            ? 'border-zinc-900 dark:border-zinc-750 bg-zinc-900 dark:bg-zinc-800 text-white'
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="block text-xs font-mono font-bold">{cls.code}</span>
                          <span className="block text-xs truncate font-sans">{cls.name}</span>
                        </div>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                          isSelected ? 'border-zinc-700 dark:border-zinc-600 bg-zinc-800 dark:bg-zinc-700 text-zinc-300 dark:text-zinc-200' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {roleBadge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class details main view */}
              <div className="lg:col-span-2 space-y-6" id="class-main-details">
                {activeClass ? (
                  <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 space-y-6 rounded-none">
                    
                    {/* Pending Removals Panel (Approval Flow for Admin/Rep) */}
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

                    {/* Header */}
                    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500">Class Group Details</span>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 mt-1">
                          {activeClass.name}
                        </h2>
                      </div>
                      <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950 font-mono text-center shrink-0 relative">
                        <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Class Code</span>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                          <span className="text-base font-bold tracking-wider text-zinc-900 dark:text-zinc-100">{activeClass.code}</span>
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
                    </div>

                    {/* Members List */}
                    <div className="space-y-3" id="class-members-section">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        Members & Roster ({activeClass.memberIds.length + 1} enrolled)
                      </h3>

                      <div className="border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800" id="members-list">
                        {/* Owner / Representative Row */}
                        <div className="p-3 flex items-center justify-between text-xs font-mono bg-zinc-50 dark:bg-zinc-950">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-405" />
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{getMemberName(activeClass.ownerId)}</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                            Representative (Owner)
                          </span>
                        </div>

                        {/* Assistants Row */}
                        {activeClass.assistantIds.map((asstId) => (
                          <div key={asstId} className="p-3 flex items-center justify-between text-xs font-mono">
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{getMemberName(asstId)}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
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
                                    Remove Assistant
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Standard Members Rows */}
                        {activeClass.memberIds
                          .filter((id) => id !== activeClass.ownerId && !activeClass.assistantIds.includes(id))
                          .map((memId) => {
                            const isPending = pendingRemovals.some(pr => pr.classId === activeClass.id && pr.userId === memId);
                            return (
                              <div key={memId} className="p-3 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-650 dark:text-zinc-300">{getMemberName(memId)}</span>
                                  {isPending && (
                                    <span className="text-[9px] font-mono uppercase px-1 py-0.2 bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border border-amber-250 dark:border-amber-900/40 animate-pulse">
                                      Pending Removal
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Student Member</span>
                                  
                                  {/* Representative Instant Actions */}
                                  {currentUserRole === 'representative' && (
                                    <>
                                      <button
                                        id={`promote-btn-${memId}`}
                                        onClick={() => onPromoteToAssistant(activeClass.id, memId)}
                                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-100 dark:border-blue-900/40 hover:border-blue-200 dark:hover:border-blue-650 px-1.5 py-0.5 cursor-pointer bg-blue-50 dark:bg-blue-950/20"
                                      >
                                        Promote to Assistant
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
                                        Remove Member
                                      </button>
                                    </>
                                  )}

                                  {/* Assistant Request Action (Places in pending removals) */}
                                  {currentUserRole === 'assistant' && !isPending && (
                                    <button
                                      id={`request-remove-btn-${memId}`}
                                      onClick={() => {
                                        if (confirm(`Send request to Class Representative to remove student ${getMemberName(memId)}?`)) {
                                          onRequestMemberRemoval(activeClass.id, memId);
                                          alert('Removal request sent to Class Representative for final approval.');
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

                    {/* Representative Administration Tools */}
                    {currentUserRole === 'representative' && activeClass.ownerId === currentUser.id && (
                      <div className="border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-4 rounded-none space-y-2" id="owner-admin-tools">
                        <h4 className="text-xs font-mono font-bold text-red-800 dark:text-red-400 flex items-center gap-1.5 uppercase">
                          <ShieldAlert className="w-4 h-4 text-red-700 dark:text-red-400" />
                          Danger Zone
                        </h4>
                        <p className="text-[11px] text-red-700 dark:text-red-400 font-sans leading-relaxed">
                          As the Representative who created this class group, you have full ownership. You can permanently delete the class group and all of its scheduled timetable entries from Thesdel.
                        </p>
                        <button
                          id="btn-delete-class"
                          onClick={handleDelete}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs border border-red-600 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Class Group
                        </button>
                      </div>
                    )}

                    {/* Assistant / Representative limitations disclaimer */}
                    {currentUserRole === 'assistant' && (
                      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-zinc-600 dark:text-zinc-400 text-xs rounded-none space-y-1">
                        <span className="block font-bold uppercase text-zinc-800 dark:text-zinc-200">🔒 Assistant Access Boundaries</span>
                        <span className="block">
                          As an Assistant, you can update the timetable and log venue changes. You cannot manage member promotion/demotion, change class ownership, or delete the class group. Member removal requests go to the "pending list" for admin approval.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-400 dark:text-zinc-500 font-mono text-xs">
                    Please select a class from the list to view its roster.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 2: Join Class */}
      {activeTab === 'join' && (
        <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 max-w-md mx-auto rounded-none space-y-4" id="join-card">
          <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-bold text-lg tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              Join a Class Group
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Get the unique class code from your Representative to sync timetables instantly.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">Enter Class Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  id="input-join-code"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="THESDEL-XXXXXXXXXX"
                  className="w-full border border-zinc-200 dark:border-zinc-800 pl-9 pr-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none uppercase text-xs font-mono font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Human Verification (Against bots) */}
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2 rounded-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 font-mono">🤖 Human Verification Check</span>
                <button 
                  type="button" 
                  onClick={regenerateCaptcha} 
                  className="text-[9px] underline text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-mono"
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
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-colors"
            >
              Join Class Group
            </button>
          </form>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono space-y-1">
            <span className="block font-bold">Class code requirements:</span>
            <span className="block">• Unique format begins with THESDEL-</span>
            <span className="block">• Followed by 10 alphanumeric characters only</span>
            <span className="block">• Only live, created class codes are saved to database</span>
          </div>
        </div>
      )}

      {/* Screen 3: Create Class */}
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
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                placeholder="e.g. Mechanical Engineering Year 3"
                className="w-full border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-600 rounded-none text-xs font-sans"
              />
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 space-y-1 font-sans text-zinc-500 text-[11px] leading-relaxed">
              <span className="block font-bold text-zinc-700 dark:text-zinc-300 uppercase font-mono text-[9px] tracking-wider">🔒 Auto-Generated Class Code</span>
              <span>
                To ensure perfect uniqueness, the platform will auto-generate a secure 10-character code beginning with <strong className="font-mono text-zinc-800 dark:text-zinc-200">THESDEL-</strong> (consisting of upper/lower case letters and numbers only) when this class is saved to the database.
              </span>
            </div>

            {/* Human Verification (Against bots) */}
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2 rounded-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 font-mono">🤖 Human Verification Check</span>
                <button 
                  type="button" 
                  onClick={regenerateCaptcha} 
                  className="text-[9px] underline text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-mono"
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
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono font-bold text-xs uppercase cursor-pointer transition-colors"
            >
              Create Class Group
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
