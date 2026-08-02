import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminApp from '../admin/AdminApp';
import { INITIAL_UPDATES, INITIAL_USER } from './mockData';
import { User, ClassGroup, TimetableEntry, AttendanceLog, ClassUpdate, Role, PendingRemoval } from './types';
import HomeView from './components/HomeView';
import TimetableView from './components/TimetableView';
import AttendanceView from './components/AttendanceView';
import ClassView from './components/ClassView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import LandingView from './components/LandingView';
import NotificationsView from './components/NotificationsView';
import { trackPageView, trackClick } from './utils/tracker';
import { Calendar, CheckCircle2, Clock, Shield, User as UserIcon, BookOpen, Layers, Terminal } from 'lucide-react';
import { useAppStore } from './lib/store';
import {
  supabase,
  getCached,
  setCached,
  CACHE_KEYS,
  enqueueOfflineAction,
  processOfflineQueue,
  getOfflineQueue,
} from './lib/supabase';

export default function App() {
  const queryClient = useQueryClient();
  const { theme, setTheme, currentView, setView, activeClassId, setActiveClassId } = useAppStore();

  const [profileSubTab, setProfileSubTab] = useState<'identity' | 'settings'>('identity');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return getCached(CACHE_KEYS.LOGGED_IN, false);
  });

  const [user, setUser] = useState<User | null>(() => {
    return getCached<User | null>(CACHE_KEYS.USER, null);
  });

  const [simulatedTime, setSimulatedTime] = useState<string>(() => {
    const saved = localStorage.getItem('thesdel_simulated_time');
    return saved ? saved : '10:45';
  });

  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isDevSwitcherExpanded, setIsDevSwitcherExpanded] = useState<boolean>(true);

  // Floating Preview Switcher dragging state
  const [switcherPosition, setSwitcherPosition] = useState({ x: 0, y: 0 });
  const [isDraggingSwitcher, setIsDraggingSwitcher] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    trackPageView(currentView);
  }, [currentView]);

  const handleSwitcherMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDraggingSwitcher(true);
    setDragStartPoint({
      x: e.clientX - switcherPosition.x,
      y: e.clientY - switcherPosition.y
    });
  };

  const handleSwitcherTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDraggingSwitcher(true);
    const touch = e.touches[0];
    setDragStartPoint({
      x: touch.clientX - switcherPosition.x,
      y: touch.clientY - switcherPosition.y
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingSwitcher) return;
      setSwitcherPosition({
        x: e.clientX - dragStartPoint.x,
        y: e.clientY - dragStartPoint.y
      });
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDraggingSwitcher) return;
      const touch = e.touches[0];
      setSwitcherPosition({
        x: touch.clientX - dragStartPoint.x,
        y: touch.clientY - dragStartPoint.y
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingSwitcher(false);
    };

    if (isDraggingSwitcher) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDraggingSwitcher, dragStartPoint, switcherPosition]);

  // --- TANSTACK QUERY DATA FETCHES ---
  const { data: classes = [] } = useQuery<ClassGroup[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data: dbClasses, error } = await supabase.from('classes').select('*');
      if (error) throw error;

      const formattedClasses: ClassGroup[] = [];
      for (const cls of (dbClasses || [])) {
        const { data: membersData } = await supabase
          .from('class_members')
          .select('*')
          .eq('class_id', cls.id);

        const assistantIds = (membersData || [])
          .filter((m) => m.role === 'assistant' && m.status === 'approved')
          .map((m) => m.user_id);

        const memberIds = (membersData || [])
          .filter((m) => m.role === 'member' && m.status === 'approved')
          .map((m) => m.user_id);

        const pendingMemberIds = (membersData || [])
          .filter((m) => m.status === 'pending')
          .map((m) => m.user_id);

        formattedClasses.push({
          id: cls.id,
          name: cls.name,
          code: cls.code,
          ownerId: cls.owner_id,
          assistantIds,
          memberIds,
          pendingMemberIds,
          description: cls.description || undefined,
          visibility: cls.visibility || 'public'
        });
      }
      return formattedClasses;
    },
    enabled: isLoggedIn && !!user?.id,
  });

  const { data: timetable = [] } = useQuery<TimetableEntry[]>({
    queryKey: ['timetable'],
    queryFn: async () => {
      const { data, error } = await supabase.from('timetable').select('*');
      if (error) throw error;
      return (data || []).map((e) => ({
        id: e.id,
        classId: e.class_id,
        subject: e.subject,
        dayOfWeek: e.day_of_week,
        startTime: e.start_time,
        endTime: e.end_time,
        durationMinutes: e.duration_minutes,
        venue: e.venue,
        originalVenue: e.original_venue || undefined,
        venueChangedAt: e.venue_changed_at || undefined,
        isCancelled: e.is_cancelled,
        cancelledAt: e.cancelled_at || undefined,
      }));
    },
    enabled: isLoggedIn && !!user?.id,
  });

  const { data: attendanceLogs = [] } = useQuery<AttendanceLog[]>({
    queryKey: ['attendanceLogs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []).map((l) => ({
        id: l.id,
        classId: l.class_id,
        timetableEntryId: l.timetable_entry_id,
        date: l.date,
        status: l.status as any,
        timestamp: l.timestamp,
      }));
    },
    enabled: isLoggedIn && !!user?.id,
  });

  const { data: updates = [] } = useQuery<ClassUpdate[]>({
    queryKey: ['updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;

      const formatted = (data || []).map((u) => ({
        id: u.id,
        classId: u.class_id,
        userId: u.user_id || undefined,
        userName: u.user_name,
        type: u.type as any,
        description: u.description,
        timestamp: u.timestamp,
      }));

      // Merge with demo updates assets securely
      const demoItems = INITIAL_UPDATES.filter(
        demoItem => !formatted.some(fu => fu.id === demoItem.id)
      );
      return [...demoItems, ...formatted];
    },
    enabled: isLoggedIn && !!user?.id,
  });

  const { data: pendingRemovals = [] } = useQuery<PendingRemoval[]>({
    queryKey: ['pendingRemovals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pending_removals').select('*');
      if (error) throw error;
      return (data || []).map((pr) => ({
        id: pr.id,
        classId: pr.class_id,
        userId: pr.user_id,
        requestedBy: pr.requested_by,
        createdAt: pr.created_at,
      }));
    },
    enabled: isLoggedIn && !!user?.id,
  });

  const { data: memberNamesMap = {} } = useQuery<Record<string, string>>({
    queryKey: ['memberNamesMap'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id, name');
      if (error) throw error;
      const profileMap: Record<string, string> = {};
      for (const p of (data || [])) {
        profileMap[p.id] = p.name;
      }
      return profileMap;
    },
    enabled: isLoggedIn && !!user?.id,
  });

  // Unique UUID helper
  const genUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Live session loading helper
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
          const cachedLoggedIn = getCached(CACHE_KEYS.LOGGED_IN, false);
          if (cachedLoggedIn) {
            setIsLoggedIn(true);
            const cachedUser = getCached<User | null>(CACHE_KEYS.USER, null);
            if (cachedUser) {
              setUser(cachedUser);
            }
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
      console.log('[App] Online state detected. Syncing...');
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

  // Apply dark/light theme
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
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
    try {
      trackClick('Button: Log Out');
    } catch (e) {
      console.error(e);
    }
    await supabase.auth.signOut().catch(console.error);
    setIsLoggedIn(false);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.origin + '/';
  };

  // --- Role helper inside class group ---
  const getActiveUserRoleInClass = (): Role => {
    if (!user) return 'member';
    if (user.role === 'admin' || user.role === 'investor') return user.role;
    const activeClass = classes.find((c) => c.id === activeClassId);
    if (!activeClass) return 'member';
    if (activeClass.ownerId === user.id) return 'representative';
    if (activeClass.assistantIds.includes(user.id)) return 'assistant';
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
    if (userJoinedClasses.length > 0 && !userJoinedClasses.some((c) => c.id === activeClassId)) {
      setActiveClassId(userJoinedClasses[0].id);
    }
  }, [classes, userJoinedClasses, activeClassId, setActiveClassId]);

  // --- ACTIONS & HANDLERS ---
  const handleClassRepBroadcast = async (classId: string, description: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const newUpdate = {
        class_id: classId,
        user_id: user.id,
        user_name: `${user.name} (Class Representative)`,
        type: 'entry_added',
        description,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.from('updates').insert([newUpdate]);
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['updates'] });
      return true;
    } catch (err) {
      console.error('[App] Failed to post class rep broadcast:', err);
      return false;
    }
  };

  const handleCreateClass = async (name: string, description: string, visibility: 'public' | 'private'): Promise<string> => {
    if (!user) return '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = randomPart;

      const { data } = await supabase
        .from('classes')
        .select('code')
        .eq('code', code)
        .maybeSingle();

      if (!data) {
        isUnique = true;
      }
    }

    const newId = genUUID();
    const { error } = await supabase.from('classes').insert({
      id: newId,
      name,
      code,
      owner_id: user.id,
      description,
      visibility
    });
    if (error) throw error;

    // Log the update
    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: newId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_added',
      description: `Class "${name}" was created by representative ${user.name} with unique code: ${code}`,
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
    setActiveClassId(newId);

    return code;
  };

  const handleJoinClass = async (code: string) => {
    if (!user) return;

    // Fetch class details
    const { data: dbClass, error: dbErr } = await supabase
      .from('classes')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (dbErr || !dbClass) {
      alert(`Error: Class code "${code}" not found.`);
      return;
    }

    // Check if already member
    const { data: existingMember } = await supabase
      .from('class_members')
      .select('*')
      .eq('class_id', dbClass.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingMember) {
      alert(`Info: You have already requested to join or are already a member of this class.`);
      setActiveClassId(dbClass.id);
      return;
    }

    const isPrivate = dbClass.visibility === 'private';
    const initialStatus = isPrivate ? 'pending' : 'approved';

    const { error: joinErr } = await supabase
      .from('class_members')
      .insert({
        class_id: dbClass.id,
        user_id: user.id,
        role: 'member',
        status: initialStatus
      });

    if (joinErr) {
      alert(`Error joining class: ${joinErr.message}`);
      return;
    }

    if (isPrivate) {
      alert(`This classroom group is Private. Your enrollment request has been submitted. You will gain access once approved by a representative or assistant.`);
    } else {
      alert(`Successfully enrolled in class "${dbClass.name}"!`);
      setActiveClassId(dbClass.id);
    }

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleApproveJoinRequest = async (classId: string, userId: string) => {
    const { error } = await supabase
      .from('class_members')
      .update({ status: 'approved' })
      .eq('class_id', classId)
      .eq('user_id', userId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleRejectJoinRequest = async (classId: string, userId: string) => {
    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', userId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleRequestMemberRemoval = async (classId: string, memberId: string) => {
    if (!user) return;
    const { error } = await supabase.from('pending_removals').insert({
      id: genUUID(),
      class_id: classId,
      user_id: memberId,
      requested_by: user.id,
      created_at: new Date().toISOString(),
    });
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['pendingRemovals'] });
  };

  const handleRemoveMemberInstantly = async (classId: string, memberId: string) => {
    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleApproveMemberRemoval = async (classId: string, memberId: string) => {
    const { error: delMember } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (delMember) throw delMember;

    const { error: delPR } = await supabase
      .from('pending_removals')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (delPR) throw delPR;

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.invalidateQueries({ queryKey: ['pendingRemovals'] });
  };

  const handleRejectMemberRemoval = async (classId: string, memberId: string) => {
    const { error } = await supabase
      .from('pending_removals')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['pendingRemovals'] });
  };

  const handleUpdateClassCode = async (classId: string): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCode = '';
    let isUnique = false;

    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newCode = randomPart;

      const { data } = await supabase
        .from('classes')
        .select('code')
        .eq('code', newCode)
        .maybeSingle();

      if (!data) {
        isUnique = true;
      }
    }

    const { error } = await supabase
      .from('classes')
      .update({ code: newCode })
      .eq('id', classId);
    if (error) throw error;

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    return newCode;
  };

  const handleMarkAttendance = async (entryId: string, date: string) => {
    if (!user) return;
    const newLogId = genUUID();
    const { error } = await supabase.from('attendance_logs').insert({
      id: newLogId,
      class_id: activeClassId,
      timetable_entry_id: entryId,
      user_id: user.id,
      date,
      status: 'attended',
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['attendanceLogs', user.id] });
  };

  const handleAddTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>) => {
    if (!user) return;
    const newId = genUUID();
    const { error } = await supabase.from('timetable').insert({
      id: newId,
      class_id: activeClassId,
      subject: entry.subject,
      day_of_week: entry.dayOfWeek,
      start_time: entry.startTime,
      end_time: entry.endTime,
      duration_minutes: entry.durationMinutes,
      venue: entry.venue,
    });
    if (error) throw error;

    // Log update
    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: activeClassId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_added',
      description: `Added timetable schedule: ${entry.subject} on ${
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][entry.dayOfWeek - 1]
      }s at ${entry.startTime}.`,
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
  };

  const handleEditTimetableEntry = async (id: string, updatedFields: Partial<TimetableEntry>) => {
    if (!user) return;
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    let changesDescription = '';
    const updatedWithMetadata: any = {};

    if (updatedFields.subject) updatedWithMetadata.subject = updatedFields.subject;
    if (updatedFields.startTime) updatedWithMetadata.start_time = updatedFields.startTime;
    if (updatedFields.endTime) updatedWithMetadata.end_time = updatedFields.endTime;
    if (updatedFields.durationMinutes) updatedWithMetadata.duration_minutes = updatedFields.durationMinutes;
    if (updatedFields.dayOfWeek) updatedWithMetadata.day_of_week = updatedFields.dayOfWeek;

    if (updatedFields.venue && updatedFields.venue !== entry.venue) {
      updatedWithMetadata.venue = updatedFields.venue;
      updatedWithMetadata.original_venue = entry.venue;
      updatedWithMetadata.venue_changed_at = new Date().toISOString();
      changesDescription += `${entry.subject} room was moved from ${entry.venue} to ${updatedFields.venue}. `;
    }

    if (updatedFields.isCancelled !== undefined && updatedFields.isCancelled !== entry.isCancelled) {
      updatedWithMetadata.is_cancelled = updatedFields.isCancelled;
      if (updatedFields.isCancelled) {
        updatedWithMetadata.cancelled_at = new Date().toISOString();
        changesDescription += `${entry.subject} class schedule is officially CANCELLED (Streak Safe). `;
      } else {
        changesDescription += `${entry.subject} class cancellation has been reverted. `;
      }
    }

    const { error } = await supabase
      .from('timetable')
      .update(updatedWithMetadata)
      .eq('id', id);
    if (error) throw error;

    if (changesDescription) {
      const updateId = genUUID();
      await supabase.from('updates').insert({
        id: updateId,
        class_id: activeClassId,
        user_id: user.id,
        user_name: user.name,
        type: updatedFields.isCancelled ? 'cancellation' : 'venue_change',
        description: changesDescription,
        timestamp: new Date().toISOString(),
      });
    }

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
  };

  const handleDeleteTimetableEntry = async (id: string) => {
    if (!user) return;
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    const { error } = await supabase.from('timetable').delete().eq('id', id);
    if (error) throw error;

    // Log update
    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: activeClassId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_deleted',
      description: `Schedule for ${entry.subject} was permanently removed from timetable.`,
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
  };

  const handleTrackAdEvent = async (adId: string, eventType: 'view' | 'click') => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('ad_analytics')
        .insert({
          ad_id: adId,
          user_id: user.id,
          event_type: eventType,
        });
      if (error) throw error;
      console.log(`[Ad Analytics] Logged ${eventType} for ad ${adId}`);
    } catch (err) {
      console.warn('[Ad Analytics] Failed to log ad event:', err);
    }
  };

  const handlePromoteToAssistant = async (classId: string, memberId: string) => {
    const { error } = await supabase
      .from('class_members')
      .update({ role: 'assistant' })
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleDemoteToMember = async (classId: string, assistantId: string) => {
    const { error } = await supabase
      .from('class_members')
      .update({ role: 'member' })
      .eq('class_id', classId)
      .eq('user_id', assistantId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleDeleteClass = async (classId: string) => {
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['attendanceLogs'] });
  };

  const handleDevRoleOverride = (targetRole: Role) => {
    if (!user) return;
    console.log('[App] Switching preview role to:', targetRole);

    let targetName = user.name;
    let targetEmail = user.email;

    if (targetRole === 'admin') {
      targetName = 'Philip Jonathan (Admin)';
      targetEmail = 'philipjonathanpeter24@gmail.com';
    } else if (targetRole === 'investor') {
      targetName = 'Efe Omowole (Investor)';
      targetEmail = 'efe.investor@thesdel.com';
    } else if (targetRole === 'representative') {
      targetName = 'Thesdel Class Rep';
    } else if (targetRole === 'assistant') {
      targetName = 'Thesdel Assistant';
    } else {
      targetName = 'Thesdel Member';
    }

    const updatedUser: User = {
      ...user,
      name: targetName,
      email: targetEmail,
      role: targetRole,
    };

    setUser(updatedUser);
    setCached(CACHE_KEYS.USER, updatedUser);
  };

  // --- RENDER COMPONENT WRAPPERS ---
  const renderViewContent = () => {
    if (!user) return null;

    switch (currentView) {
      case 'home':
        return (
          <HomeView
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
            onForceRefresh={async () => {
              await queryClient.invalidateQueries({ queryKey: ['updates'] });
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

  const isInsideAdmin = window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin');

  if (!isLoggedIn || !user) {
    return <LandingView onLoginSuccess={handleLoginSuccess} classesCount={classes.length} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col font-sans" id="thesdel-root">
      {isInsideAdmin ? (
        <AdminApp />
      ) : (
        <>
          {/* Header Navigation Bar */}
          <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30" id="thesdel-header">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                <BookOpen className="w-5 h-5 text-zinc-950 dark:text-zinc-50 shrink-0" />
                <span className="font-mono text-base font-bold tracking-wider text-zinc-950 dark:text-zinc-100">THESDEL</span>
              </div>

              {/* Active Sync Status Indicator */}
              <div className="flex items-center gap-3">
                {pendingSyncCount > 0 ? (
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono border border-amber-200 dark:border-amber-950/40 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    <span className="hidden sm:inline">PENDING SYNC:</span> <span>{pendingSyncCount}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono border border-emerald-200 dark:border-emerald-950/40 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>SYNCED</span>
                  </div>
                )}
                {((user.role as string) === 'admin' || (user.role as string) === 'investor') && (
                  <button
                    onClick={() => {
                      window.location.hash = '#/admin';
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono border border-zinc-900 bg-zinc-950 hover:bg-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-2.5 py-1 text-white transition-all cursor-pointer font-bold"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Console</span>
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-xs font-mono border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-950">
                  <Shield className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">{currentUserRole}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-28">
            {renderViewContent()}
          </main>

          {/* Bottom Navigation Bar */}
          <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 fixed bottom-0 left-0 right-0 h-16 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe" id="thesdel-bottom-nav">
            <nav className="max-w-4xl mx-auto grid grid-cols-5 h-full">
              <button
                id="nav-home"
                onClick={() => { trackClick('Nav: Today'); setView('home'); }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
                }`}
              >
                <Clock className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider">Today</span>
              </button>

              <button
                id="nav-timetable"
                onClick={() => { trackClick('Nav: Timetable'); setView('timetable'); }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'timetable' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
                }`}
              >
                <Calendar className={`w-5 h-5 ${currentView === 'timetable' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider">Timetable</span>
              </button>

              <button
                id="nav-attendance"
                onClick={() => { trackClick('Nav: Attendance'); setView('attendance'); }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'attendance' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${currentView === 'attendance' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider">Attendance</span>
              </button>

              <button
                id="nav-class"
                onClick={() => { trackClick('Nav: Class'); setView('class'); }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'class' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
                }`}
              >
                <Layers className={`w-5 h-5 ${currentView === 'class' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider">Class</span>
              </button>

              <button
                id="nav-profile"
                onClick={() => { trackClick('Nav: Profile'); setView('profile'); }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'profile' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
                }`}
              >
                <UserIcon className={`w-5 h-5 ${currentView === 'profile' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider">Profile</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
