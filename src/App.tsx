import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AdminApp from '../admin/AdminApp';
import { User, Role } from './types';
import HomeView from './components/HomeView';
import TimetableView from './components/TimetableView';
import AttendanceView from './components/AttendanceView';
import ClassView from './components/ClassView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import LandingView from './components/LandingView';
import NotificationsView from './components/NotificationsView';
import AppHeader from './components/AppHeader';
import AppBottomNav from './components/AppBottomNav';
import AppToast from './components/AppToast';
import { trackPageView } from './utils/tracker';
import { useAppStore } from './lib/store';
import { getAppStrings } from './i18n/strings';
import { detectLocale } from './i18n/detect';
import { useAppData } from './hooks/useAppData';
import { useAppHandlers } from './hooks/useAppHandlers';
import {
  supabase,
  getCached,
  setCached,
  CACHE_KEYS,
  processOfflineQueue,
  getOfflineQueue,
} from './lib/supabase';

export default function App() {
  const queryClient = useQueryClient();
  const {
    theme,
    currentView,
    setView,
    activeClassId,
    setActiveClassId,
  } = useAppStore();

  const [locale, setLocale] = useState<string>(() => detectLocale());
  const strings = getAppStrings(locale);

  const handleChangeLocale = (next: string) => {
    setLocale(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('thesdel_locale', next);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    getCached(CACHE_KEYS.LOGGED_IN, false)
  );

  const [user, setUser] = useState<User | null>(() =>
    getCached<User | null>(CACHE_KEYS.USER, null)
  );

  const [simulatedTime, setSimulatedTime] = useState<string>(() => {
    const saved = localStorage.getItem('thesdel_simulated_time');
    return saved ? saved : '10:45';
  });

  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setToast({ message, type });
  };

  useEffect(() => {
    trackPageView(currentView);
  }, [currentView]);

  const {
    classes,
    timetable,
    attendanceLogs,
    updates,
    pendingRemovals,
    memberNamesMap,
  } = useAppData({
    isLoggedIn,
    userId: user?.id,
  });

  const fetchActiveProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && profile) {
        const u: User = {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          role: profile.role as Role,
          phone: profile.phone,
          plan: profile.plan as any,
          whatsappNumber: profile.whatsapp_number || undefined,
          isReminderNumberLocked: profile.is_reminder_number_locked,
        };
        setUser(u);
        setCached(CACHE_KEYS.USER, u);
      }
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.user) {
          setIsLoggedIn(true);
          setCached(CACHE_KEYS.LOGGED_IN, true);
          await fetchActiveProfile(data.session.user.id);
        } else {
          const cachedLoggedIn = getCached(
            CACHE_KEYS.LOGGED_IN,
            false
          );
          if (cachedLoggedIn) {
            setIsLoggedIn(true);
            const cachedUser = getCached<User | null>(
              CACHE_KEYS.USER,
              null
            );
            if (cachedUser) setUser(cachedUser);
          }
        }
      } catch (err) {
        console.warn('Exception checking session:', err);
      }
    };
    checkSession();
  }, [isLoggedIn]);

  useEffect(() => {
    setPendingSyncCount(getOfflineQueue().length);
    const handleOnline = async () => {
      try {
        await processOfflineQueue((count) => setPendingSyncCount(count));
        const session = await supabase.auth.getSession();
        if (session.data.session?.user) {
          await fetchActiveProfile(session.data.session.user.id);
          queryClient.invalidateQueries();
        }
      } catch (err) {
        console.warn('Error on online sync:', err);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [queryClient]);

  useEffect(() => {
    if (activeClassId) {
      localStorage.setItem('thesdel_active_class_id', activeClassId);
    }
  }, [activeClassId]);

  useEffect(() => {
    localStorage.setItem('thesdel_simulated_time', simulatedTime);
  }, [simulatedTime]);

  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme();

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, [theme]);

  const handleLoginSuccess = async (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setCached(CACHE_KEYS.LOGGED_IN, true);
    setCached(CACHE_KEYS.USER, loggedInUser);
    await fetchActiveProfile(loggedInUser.id);
    queryClient.invalidateQueries();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(console.error);
    setIsLoggedIn(false);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.origin + '/';
  };

  const getActiveUserRoleInClass = (): Role => {
    if (!user) return 'member';
    if (user.role === 'admin' || user.role === 'investor')
      return user.role;
    const activeClass = classes.find((c) => c.id === activeClassId);
    if (!activeClass) return 'member';
    if (activeClass.ownerId === user.id) return 'representative';
    if (activeClass.assistantIds.includes(user.id))
      return 'assistant';
    return 'member';
  };

  const currentUserRole = getActiveUserRoleInClass();

  const userJoinedClasses = classes.filter(
    (c) =>
      !user ||
      user.role === 'admin' ||
      user.role === 'investor' ||
      c.memberIds.includes(user.id) ||
      c.ownerId === user.id ||
      c.assistantIds.includes(user.id)
  );

  useEffect(() => {
    if (
      userJoinedClasses.length > 0 &&
      !userJoinedClasses.some((c) => c.id === activeClassId)
    ) {
      setActiveClassId(userJoinedClasses[0].id);
    }
  }, [classes, userJoinedClasses, activeClassId, setActiveClassId]);

  const {
    handleClassRepBroadcast,
    handleCreateClass,
    handleJoinClass,
    handleApproveJoinRequest,
    handleRejectJoinRequest,
    handleRequestMemberRemoval,
    handleRemoveMemberInstantly,
    handleApproveMemberRemoval,
    handleRejectMemberRemoval,
    handleUpdateClassCode,
    handleMarkAttendance,
    handleAddTimetableEntry,
    handleEditTimetableEntry,
    handleDeleteTimetableEntry,
    handleTrackAdEvent,
    handlePromoteToAssistant,
    handleDemoteToMember,
    handleDeleteClass,
    handleLeaveClass,
    handleTransferOwnership,
  } = useAppHandlers({
    user,
    classes,
    timetable,
    memberNamesMap,
    activeClassId,
    userJoinedClasses,
    strings,
    showToast,
    setActiveClassId,
  });

  const renderViewContent = () => {
    if (!user) return null;

    switch (currentView) {
      case 'home':
        return (
          <HomeView
            currentUser={user}
            timetable={timetable}
            attendanceLogs={attendanceLogs}
            joinedClasses={userJoinedClasses}
            currentSimulatedTime={simulatedTime}
            updates={updates.filter(
              (u) =>
                u.classId === activeClassId ||
                u.classId === 'global' ||
                u.classId === 'class_reps' ||
                u.classId === 'region_north' ||
                u.classId === 'region_south' ||
                u.classId === 'country_all'
            )}
            onMarkAttendance={handleMarkAttendance}
            userRole={currentUserRole}
            activeClassId={activeClassId}
            onAddBroadcast={handleClassRepBroadcast}
            onNavigateToNotifications={() => setView('notifications')}
            onForceRefresh={async () => {
              await queryClient.invalidateQueries();
            }}
            onTrackAdEvent={handleTrackAdEvent}
          />
        );
      case 'timetable':
        return (
          <TimetableView
            timetable={timetable}
            joinedClasses={userJoinedClasses}
            activeClassId={activeClassId}
            onAddEntry={handleAddTimetableEntry}
            onEditEntry={handleEditTimetableEntry}
            onDeleteEntry={handleDeleteTimetableEntry}
            currentUserRole={currentUserRole}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            timetable={timetable}
            attendanceLogs={attendanceLogs}
            joinedClasses={userJoinedClasses}
            currentSimulatedTime={simulatedTime}
          />
        );
      case 'class':
        return (
          <ClassView
            classes={userJoinedClasses}
            activeClassId={activeClassId}
            onSelectClass={setActiveClassId}
            onJoinClass={handleJoinClass}
            onCreateClass={handleCreateClass}
            onPromoteToAssistant={handlePromoteToAssistant}
            onDemoteToMember={handleDemoteToMember}
            onDeleteClass={handleDeleteClass}
            onLeaveClass={handleLeaveClass}
            onTransferOwnership={handleTransferOwnership}
            currentUser={user}
            currentUserRole={currentUserRole}
            pendingRemovals={pendingRemovals}
            onRequestMemberRemoval={handleRequestMemberRemoval}
            onRemoveMemberInstantly={handleRemoveMemberInstantly}
            onApproveMemberRemoval={handleApproveMemberRemoval}
            onRejectMemberRemoval={handleRejectMemberRemoval}
            onUpdateClassCode={handleUpdateClassCode}
            memberNamesMap={memberNamesMap}
            onApproveJoinRequest={handleApproveJoinRequest}
            onRejectJoinRequest={handleRejectJoinRequest}
          />
        );
      case 'profile':
        return (
          <ProfileView
            currentUser={user}
            joinedClasses={userJoinedClasses}
            strings={strings.profile}
            onLogout={handleLogout}
            onOpenSettings={() => setView('settings')}
          />
        );
      case 'settings':
        return (
          <SettingsView
            currentUser={user}
            classes={classes}
            onBack={() => setView('profile')}
            locale={locale}
            onChangeLocale={handleChangeLocale}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            updates={updates.filter(
              (u) =>
                u.classId === activeClassId ||
                u.classId === 'global' ||
                u.classId === 'class_reps' ||
                u.classId === 'region_north' ||
                u.classId === 'region_south' ||
                u.classId === 'country_all'
            )}
            strings={strings.notifications}
            onForceRefresh={async () => {
              await queryClient.invalidateQueries({
                queryKey: ['updates'],
              });
            }}
            onClose={() => setView('home')}
            userRole={currentUserRole}
            activeClassId={activeClassId}
            onAddBroadcast={handleClassRepBroadcast}
          />
        );
      default:
        return null;
    }
  };

  const isInsideAdmin =
    window.location.pathname.startsWith('/admin') ||
    window.location.hash.startsWith('#/admin');

  if (!isLoggedIn || !user) {
    return (
      <LandingView
        onLoginSuccess={handleLoginSuccess}
        classesCount={classes.length}
        locale={locale}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col font-sans"
      id="thesdel-root"
    >
      {toast && (
        <AppToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isInsideAdmin ? (
        <AdminApp />
      ) : (
        <>
          <AppHeader
            user={user}
            currentUserRole={currentUserRole}
            pendingSyncCount={pendingSyncCount}
            strings={strings.header}
            onGoHome={() => setView('home')}
          />

          <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-28">
            {renderViewContent()}
          </main>

          <AppBottomNav
            currentView={currentView}
            strings={strings.nav}
            onNavigate={setView}
          />
        </>
      )}
    </div>
  );
}