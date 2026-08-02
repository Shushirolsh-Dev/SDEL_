import React, { useState } from 'react';
import { User, ClassGroup } from '../types';
import { Eye, EyeOff, UserCheck, CheckCircle2, Award, LogOut, Settings } from 'lucide-react';
import { trackClick } from '../utils/tracker';

interface ProfileViewProps {
  currentUser: User;
  joinedClasses: ClassGroup[];
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

export default function ProfileView({
  currentUser,
  joinedClasses,
  onLogout,
  onOpenSettings,
}: ProfileViewProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const getMaskedValue = (value: string) => {
    if (!value) return '';
    const atIdx = value.indexOf('@');
    if (atIdx === -1) {
      if (value.length <= 4) return '****';
      return value.slice(0, 3) + '****' + value.slice(-3);
    }
    const name = value.substring(0, atIdx);
    const domain = value.substring(atIdx);
    if (name.length <= 2) return '***' + domain;
    return name.charAt(0) + '***' + name.charAt(name.length - 1) + domain;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-view-container">
      {/* 1. Account Identity */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-none space-y-6" id="profile-identity">
        <div className="border-b border-zinc-150 dark:border-zinc-800 pb-4 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            Student Profile Identity
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-950 px-2 py-1 border border-zinc-200/50 dark:border-zinc-800">
              Enrolled
            </span>
            {onOpenSettings && (
              <button
                id="btn-open-settings"
                onClick={() => {
                  trackClick('Button: Open Settings');
                  onOpenSettings();
                }}
                className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="Settings & Privacy"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar / Badge */}
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center font-mono text-xl font-bold text-zinc-700 dark:text-zinc-300 rounded-none relative">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            {currentUser.role === 'representative' && (
              <span className="absolute -bottom-1 -right-1 bg-zinc-950 text-white border border-zinc-800 text-[9px] px-1 font-sans rounded-none" title="Class Representative">
                REP
              </span>
            )}
            {currentUser.role === 'assistant' && (
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white border border-blue-800 text-[9px] px-1 font-sans rounded-none" title="Assistant">
                ASST
              </span>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
                {currentUser.name || 'Student Account'}
              </h2>
              {/* Role Badges */}
              {currentUser.role === 'representative' && (
                <span className="inline-flex items-center gap-1 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-zinc-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Rep (Verified)
                </span>
              )}
              {currentUser.role === 'assistant' && (
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-blue-700">
                  <Award className="w-3 h-3" /> Assistant (Verified)
                </span>
              )}
              {currentUser.role !== 'representative' && currentUser.role !== 'assistant' && (
                <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-medium uppercase px-2 py-0.5 border border-zinc-200 dark:border-zinc-800">
                  Member
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Standard secure login profile. Group membership, verification badges, and classroom rosters are synchronized.
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-150 dark:border-zinc-850 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase text-[9px] font-bold block tracking-wider">Registered Email</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 dark:text-zinc-100 font-sans text-sm font-semibold">
                {showEmail ? currentUser.email : getMaskedValue(currentUser.email)}
              </span>
              <button
                type="button"
                onClick={() => setShowEmail(!showEmail)}
                className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {currentUser.phone && (
            <div className="space-y-1">
              <span className="text-zinc-400 dark:text-zinc-500 uppercase text-[9px] font-bold block tracking-wider">Login Phone Number</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold">
                  {showPhone ? currentUser.phone : getMaskedValue(currentUser.phone)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase text-[9px] font-bold block tracking-wider">Enrolled Groups</span>
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold font-sans block">
              {joinedClasses.length} {joinedClasses.length === 1 ? 'Academic Group' : 'Academic Groups'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Logout Action block */}
      <div className="flex justify-end pt-2" id="logout-footer">
        <button
          onClick={() => {
            trackClick('Button: Log Out');
            if (onLogout) {
              onLogout();
            }
          }}
          className="px-5 py-2.5 border border-zinc-250 dark:border-zinc-800 hover:border-zinc-800 dark:hover:border-zinc-300 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout of Account
        </button>
      </div>
    </div>
  );
}
