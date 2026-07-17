import React, { useState, useEffect } from 'react';
import AdminApp from '../admin/AdminApp';
import {
  INITIAL_USER,
  INITIAL_CLASSES,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_UPDATES,
  INITIAL_PREFERENCES,
  SIMULATED_TODAY,
} from './mockData';
import { User, ClassGroup, TimetableEntry, AttendanceLog, ClassUpdate, NotificationPreferences, Role, PendingRemoval } from './types';
import HomeView from './components/HomeView';
import TimetableView from './components/TimetableView';
import AttendanceView from './components/AttendanceView';
import ClassView from './components/ClassView';
import ProfileView from './components/ProfileView';
import LandingView from './components/LandingView';
import ReminderSettingsView from './components/ReminderSettingsView';
import { Calendar, CheckCircle2, Clock, Shield, User as UserIcon, BookOpen, Layers, Terminal } from 'lucide-react';
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
  // --- 1. Load Initial State from Cache (Indexed/LocalStorage) or Defaults ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return getCached(CACHE_KEYS.LOGGED_IN, false);
  });

  const [user, setUser] = useState<User>(() => {
    return getCached(CACHE_KEYS.USER, INITIAL_USER);
  });

  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    return getCached(CACHE_KEYS.CLASSES, INITIAL_CLASSES);
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    return getCached(CACHE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    return getCached(CACHE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  });

  const [updates, setUpdates] = useState<ClassUpdate[]>(() => {
    return getCached(CACHE_KEYS.UPDATES, INITIAL_UPDATES);
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => {
    return getCached(CACHE_KEYS.PREFERENCES, INITIAL_PREFERENCES);
  });

  const [activeClassId, setActiveClassId] = useState<string>(() => {
    const saved = localStorage.getItem('thesdel_active_class_id');
    return saved ? saved : 'class_swe301';
  });

  const [simulatedTime, setSimulatedTime] = useState<string>(() => {
    const saved = localStorage.getItem('thesdel_simulated_time');
    return saved ? saved : '10:45';
  });

  const [currentView, setCurrentView] = useState<'home' | 'timetable' | 'attendance' | 'class' | 'profile' | 'reminders'>('home');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const [theme, setTheme] = useState<'system' | 'dark'>(() => {
    return getCached<'system' | 'dark'>('thesdel_theme', 'system');
  });

  const [pendingRemovals, setPendingRemovals] = useState<PendingRemoval[]>(() => {
    return getCached(CACHE_KEYS.PENDING_REMOVALS, []);
  });

  const [memberNamesMap, setMemberNamesMap] = useState<Record<string, string>>(() => {
    return getCached<Record<string, string>>('thesdel_member_names_map', {});
  });

  // Unique UUID helper
  const genUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // --- 2. Live Data Sync on Connection Status Changes ---
  const fetchAppData = async (userId: string) => {
    if (!navigator.onLine) return;

    try {
      console.log('[App] Fetching live data from Supabase for user:', userId);
      
      // 1. Fetch user profile
      let { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileErr || !profile) {
        // If profile is missing in DB during sync/refresh, attempt to insert it
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const metadata = authUser.user_metadata || {};
          const fallbackName = metadata.name || authUser.email?.split('@')[0] || 'User';
          const fallbackRole = metadata.role || 'member';
          const fallbackPhone = metadata.phone || '';

          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: fallbackName,
              email: authUser.email || '',
              role: fallbackRole,
              phone: fallbackPhone,
              plan: 'free',
            })
            .select()
            .single();

          if (!insertError && insertedProfile) {
            profile = insertedProfile;
            profileErr = null;
          }
        }
      }
        
      if (!profileErr && profile) {
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
      
      // 2. Fetch classes
      const { data: classesData, error: classesErr } = await supabase
        .from('classes')
        .select('*');
        
      if (!classesErr && classesData) {
        const formattedClasses: ClassGroup[] = [];
        for (const cls of classesData) {
          const { data: membersData } = await supabase
            .from('class_members')
            .select('*')
            .eq('class_id', cls.id);
            
          const assistantIds = (membersData || [])
            .filter((m) => m.role === 'assistant')
            .map((m) => m.user_id);
            
          const memberIds = (membersData || [])
            .filter((m) => m.role === 'member')
            .map((m) => m.user_id);
            
          formattedClasses.push({
            id: cls.id,
            name: cls.name,
            code: cls.code,
            ownerId: cls.owner_id,
            assistantIds,
            memberIds,
          });
        }
        
        setClasses(formattedClasses);
        setCached(CACHE_KEYS.CLASSES, formattedClasses);
      }
      
      // 3. Fetch timetable
      const { data: timetableData, error: timetableErr } = await supabase
        .from('timetable')
        .select('*');
        
      if (!timetableErr && timetableData) {
        const formattedTimetable: TimetableEntry[] = timetableData.map((e) => ({
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
        setTimetable(formattedTimetable);
        setCached(CACHE_KEYS.TIMETABLE, formattedTimetable);
      }
      
      // 4. Fetch attendance logs
      const { data: logsData, error: logsErr } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', userId);
        
      if (!logsErr && logsData) {
        const formattedLogs: AttendanceLog[] = logsData.map((l) => ({
          id: l.id,
          classId: l.class_id,
          timetableEntryId: l.timetable_entry_id,
          date: l.date,
          status: l.status as any,
          timestamp: l.timestamp,
        }));
        setAttendanceLogs(formattedLogs);
        setCached(CACHE_KEYS.ATTENDANCE, formattedLogs);
      }
      
      // 5. Fetch updates
      const { data: updatesData, error: updatesErr } = await supabase
        .from('updates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (!updatesErr && updatesData) {
        const formattedUpdates: ClassUpdate[] = updatesData.map((u) => ({
          id: u.id,
          classId: u.class_id,
          userId: u.user_id || undefined,
          userName: u.user_name,
          type: u.type as any,
          description: u.description,
          timestamp: u.timestamp,
        }));
        setUpdates(formattedUpdates);
        setCached(CACHE_KEYS.UPDATES, formattedUpdates);
      }

      // 6. Fetch pending removals
      const { data: pendingRemovalsData, error: prErr } = await supabase
        .from('pending_removals')
        .select('*');
      if (!prErr && pendingRemovalsData) {
        const formattedPRs: PendingRemoval[] = pendingRemovalsData.map((pr) => ({
          id: pr.id,
          classId: pr.class_id,
          userId: pr.user_id,
          requestedBy: pr.requested_by,
          createdAt: pr.created_at,
        }));
        setPendingRemovals(formattedPRs);
        setCached(CACHE_KEYS.PENDING_REMOVALS, formattedPRs);
      }

      // 7. Fetch all profiles to populate user names beautifully
      const { data: profilesData, error: profilesErr } = await supabase
        .from('profiles')
        .select('id, name');
      if (!profilesErr && profilesData) {
        const profileMap: Record<string, string> = {};
        for (const p of profilesData) {
          profileMap[p.id] = p.name;
        }
        setMemberNamesMap(profileMap);
        setCached('thesdel_member_names_map', profileMap);
      }
      
    } catch (err) {
      console.error('[App] Error in fetchAppData:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setIsLoggedIn(true);
        setCached(CACHE_KEYS.LOGGED_IN, true);
        await fetchAppData(data.session.user.id);
      } else {
        const cachedLoggedIn = getCached(CACHE_KEYS.LOGGED_IN, false);
        if (cachedLoggedIn) {
          setIsLoggedIn(true);
          const cachedUser = getCached<User | null>(CACHE_KEYS.USER, null);
          if (cachedUser) {
            setUser(cachedUser);
            await fetchAppData(cachedUser.id);
          }
        }
      }
    };
    checkSession();
  }, [isLoggedIn]);

  useEffect(() => {
    setPendingSyncCount(getOfflineQueue().length);

    const handleOnline = async () => {
      console.log('[App] Online state detected. Syncing...');
      await processOfflineQueue((count) => setPendingSyncCount(count));
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        await fetchAppData(session.data.session.user.id);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Sync preference state changes to cache
  useEffect(() => {
    setCached(CACHE_KEYS.PREFERENCES, notificationPrefs);
  }, [notificationPrefs]);

  useEffect(() => {
    localStorage.setItem('thesdel_active_class_id', activeClassId);
  }, [activeClassId]);

  useEffect(() => {
    localStorage.setItem('thesdel_simulated_time', simulatedTime);
  }, [simulatedTime]);

  // Apply dark/light theme
  useEffect(() => {
    setCached('thesdel_theme', theme);
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
    await fetchAppData(loggedInUser.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCached(CACHE_KEYS.LOGGED_IN, false);
    localStorage.removeItem('thesdel_logged_in');
    localStorage.removeItem(CACHE_KEYS.USER);
    localStorage.removeItem(CACHE_KEYS.CLASSES);
    localStorage.removeItem(CACHE_KEYS.TIMETABLE);
    localStorage.removeItem(CACHE_KEYS.ATTENDANCE);
    localStorage.removeItem(CACHE_KEYS.UPDATES);
  };

  // --- 3. Synchronize Active User Role with Class Membership ---
  const activeClass = classes.find((c) => c.id === activeClassId);

  const getActiveUserRoleInClass = (): Role => {
    if (!activeClass) return 'member';
    if (activeClass.ownerId === user.id) return 'representative';
    if (activeClass.assistantIds.includes(user.id)) return 'assistant';
    return 'member';
  };

  const currentUserRole = getActiveUserRoleInClass();

  const userJoinedClasses = classes.filter(
    (c) => c.memberIds.includes(user.id) || c.ownerId === user.id || c.assistantIds.includes(user.id)
  );

  useEffect(() => {
    if (userJoinedClasses.length > 0 && !userJoinedClasses.some((c) => c.id === activeClassId)) {
      setActiveClassId(userJoinedClasses[0].id);
    }
  }, [classes, userJoinedClasses, activeClassId]);

  // --- 4. State Actions & Handlers ---

  // Create Class
  const handleCreateClass = async (name: string): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    let isUnique = false;
    
    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `THESDEL-${randomPart}`;
      
      // Check database to ensure uniqueness
      const { data } = await supabase
        .from('classes')
        .select('code')
        .eq('code', code)
        .maybeSingle();
        
      if (!data) {
        // Also check memory state to be robust in offline/simulated scenarios
        const localConflict = classes.some((c) => c.code === code);
        if (!localConflict) {
          isUnique = true;
        }
      }
    }

    const newId = genUUID();
    const newClass: ClassGroup = {
      id: newId,
      name,
      code,
      ownerId: user.id,
      assistantIds: [],
      memberIds: [],
    };

    const nextClasses = [...classes, newClass];
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);
    setActiveClassId(newId);

    // Log the update
    const updateId = genUUID();
    const newUpdate: ClassUpdate = {
      id: updateId,
      classId: newId,
      userId: user.id,
      userName: user.name,
      type: 'entry_added',
      description: `Class "${name}" was created by representative ${user.name} with unique code: ${code}`,
      timestamp: new Date().toISOString(),
    };
    const nextUpdates = [newUpdate, ...updates];
    setUpdates(nextUpdates);
    setCached(CACHE_KEYS.UPDATES, nextUpdates);

    // Sync to Supabase
    enqueueOfflineAction('create_class', { id: newId, name, code, ownerId: user.id }, (count) =>
      setPendingSyncCount(count)
    );

    return code;
  };

  // Join Class
  const handleJoinClass = async (code: string) => {
    // 1. Check if already in class locally
    const localTarget = classes.find((c) => c.code === code);
    if (localTarget) {
      if (localTarget.memberIds.includes(user.id) || localTarget.ownerId === user.id || localTarget.assistantIds.includes(user.id)) {
        alert(`Info: You are already in this class (${localTarget.name}).`);
        setActiveClassId(localTarget.id);
        return;
      }
    }

    // 2. Fetch the class from Supabase to ensure it is live and registered
    const { data: dbClass, error: dbErr } = await supabase
      .from('classes')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (dbErr || !dbClass) {
      alert(`Error: Class code "${code}" not found. Only when a class is created shall the code work and be saved to the database for students to join.`);
      return;
    }

    // 3. Fetch current members of that class to format correctly
    const { data: membersData } = await supabase
      .from('class_members')
      .select('*')
      .eq('class_id', dbClass.id);

    const assistantIds = (membersData || [])
      .filter((m) => m.role === 'assistant')
      .map((m) => m.user_id);
      
    const memberIds = (membersData || [])
      .filter((m) => m.role === 'member')
      .map((m) => m.user_id);

    // Add current user as member
    const updatedMemberIds = [...memberIds, user.id];

    const joinedClass: ClassGroup = {
      id: dbClass.id,
      name: dbClass.name,
      code: dbClass.code,
      ownerId: dbClass.owner_id,
      assistantIds,
      memberIds: updatedMemberIds,
    };

    const nextClasses = [...classes.filter((c) => c.id !== dbClass.id), joinedClass];
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);
    setActiveClassId(dbClass.id);

    // Sync to Supabase
    enqueueOfflineAction('join_class', { classId: dbClass.id, userId: user.id }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Assistant requests member removal
  const handleRequestMemberRemoval = (classId: string, memberId: string) => {
    const removalId = genUUID();
    const newRemoval: PendingRemoval = {
      id: removalId,
      classId,
      userId: memberId,
      requestedBy: user.id,
      createdAt: new Date().toISOString(),
    };
    
    const nextRemovals = [...pendingRemovals, newRemoval];
    setPendingRemovals(nextRemovals);
    setCached(CACHE_KEYS.PENDING_REMOVALS, nextRemovals);
    
    enqueueOfflineAction('request_member_removal', { classId, memberId, requestedBy: user.id }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Representative removes member instantly
  const handleRemoveMemberInstantly = (classId: string, memberId: string) => {
    const nextClasses = classes.map((c) => {
      if (c.id === classId) {
        return {
          ...c,
          memberIds: c.memberIds.filter((id) => id !== memberId),
          assistantIds: c.assistantIds.filter((id) => id !== memberId),
        };
      }
      return c;
    });
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);
    
    enqueueOfflineAction('remove_member_instantly', { classId, memberId }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Representative approves pending removal (approved by admin)
  const handleApproveMemberRemoval = (classId: string, memberId: string) => {
    // Remove member from local class state
    const nextClasses = classes.map((c) => {
      if (c.id === classId) {
        return {
          ...c,
          memberIds: c.memberIds.filter((id) => id !== memberId),
          assistantIds: c.assistantIds.filter((id) => id !== memberId),
        };
      }
      return c;
    });
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);
    
    // Remove from pending list
    const nextRemovals = pendingRemovals.filter(
      (pr) => !(pr.classId === classId && pr.userId === memberId)
    );
    setPendingRemovals(nextRemovals);
    setCached(CACHE_KEYS.PENDING_REMOVALS, nextRemovals);
    
    enqueueOfflineAction('approve_member_removal', { classId, memberId }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Representative rejects pending removal
  const handleRejectMemberRemoval = (classId: string, memberId: string) => {
    const nextRemovals = pendingRemovals.filter(
      (pr) => !(pr.classId === classId && pr.userId === memberId)
    );
    setPendingRemovals(nextRemovals);
    setCached(CACHE_KEYS.PENDING_REMOVALS, nextRemovals);
    
    enqueueOfflineAction('reject_member_removal', { classId, memberId }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Representative changes the class code
  const handleUpdateClassCode = async (classId: string): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCode = '';
    let isUnique = false;
    
    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newCode = `THESDEL-${randomPart}`;
      
      // Check database to ensure uniqueness
      const { data } = await supabase
        .from('classes')
        .select('code')
        .eq('code', newCode)
        .maybeSingle();
        
      if (!data) {
        const localConflict = classes.some((c) => c.code === newCode);
        if (!localConflict) {
          isUnique = true;
        }
      }
    }
    
    const nextClasses = classes.map((c) => {
      if (c.id === classId) {
        return { ...c, code: newCode };
      }
      return c;
    });
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);
    
    enqueueOfflineAction('change_class_code', { classId, newCode }, (count) =>
      setPendingSyncCount(count)
    );
    
    return newCode;
  };

  // Mark Attendance
  const handleMarkAttendance = (entryId: string, date: string) => {
    const existingLog = attendanceLogs.find((l) => l.timetableEntryId === entryId && l.date === date);
    if (existingLog) return;

    const newLogId = genUUID();
    const newLog: AttendanceLog = {
      id: newLogId,
      classId: activeClassId,
      timetableEntryId: entryId,
      date,
      status: 'attended',
      timestamp: new Date().toISOString(),
    };

    const nextLogs = [...attendanceLogs, newLog];
    setAttendanceLogs(nextLogs);
    setCached(CACHE_KEYS.ATTENDANCE, nextLogs);

    // Sync to Supabase
    enqueueOfflineAction(
      'mark_attendance',
      { id: newLogId, classId: activeClassId, timetableEntryId: entryId, date, status: 'attended', userId: user.id },
      (count) => setPendingSyncCount(count)
    );
  };

  // Add Timetable Entry
  const handleAddTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const newId = genUUID();
    const newEntry: TimetableEntry = {
      id: newId,
      ...entry,
    };

    const nextTimetable = [...timetable, newEntry];
    setTimetable(nextTimetable);
    setCached(CACHE_KEYS.TIMETABLE, nextTimetable);

    // Log update
    const updateId = genUUID();
    const newUpdate: ClassUpdate = {
      id: updateId,
      classId: activeClassId,
      userId: user.id,
      userName: user.name,
      type: 'entry_added',
      description: `Added timetable schedule: ${entry.subject} on ${
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][entry.dayOfWeek - 1]
      }s at ${entry.startTime}.`,
      timestamp: new Date().toISOString(),
    };
    const nextUpdates = [newUpdate, ...updates];
    setUpdates(nextUpdates);
    setCached(CACHE_KEYS.UPDATES, nextUpdates);

    // Sync to Supabase
    enqueueOfflineAction(
      'add_timetable',
      {
        id: newId,
        classId: activeClassId,
        subject: entry.subject,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        durationMinutes: entry.durationMinutes,
        venue: entry.venue,
      },
      (count) => setPendingSyncCount(count)
    );
  };

  // Edit Timetable Entry
  const handleEditTimetableEntry = (id: string, updatedFields: Partial<TimetableEntry>) => {
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    let changesDescription = '';
    const updatedWithMetadata = { ...updatedFields };

    if (updatedFields.venue && updatedFields.venue !== entry.venue) {
      updatedWithMetadata.originalVenue = entry.venue;
      updatedWithMetadata.venueChangedAt = new Date().toISOString();
      changesDescription += `${entry.subject} room was moved from ${entry.venue} to ${updatedFields.venue}. `;
    }

    if (updatedFields.isCancelled !== undefined && updatedFields.isCancelled !== entry.isCancelled) {
      if (updatedFields.isCancelled) {
        updatedWithMetadata.cancelledAt = new Date().toISOString();
        changesDescription += `${entry.subject} class schedule is officially CANCELLED (Streak Safe). `;
      } else {
        changesDescription += `${entry.subject} class cancellation has been reverted. `;
      }
    }

    const nextTimetable = timetable.map((e) => {
      if (e.id === id) {
        return { ...e, ...updatedWithMetadata };
      }
      return e;
    });

    setTimetable(nextTimetable);
    setCached(CACHE_KEYS.TIMETABLE, nextTimetable);

    if (changesDescription) {
      const updateId = genUUID();
      const newUpdate: ClassUpdate = {
        id: updateId,
        classId: activeClassId,
        userId: user.id,
        userName: user.name,
        type: updatedFields.isCancelled ? 'cancellation' : 'venue_change',
        description: changesDescription,
        timestamp: new Date().toISOString(),
      };
      const nextUpdates = [newUpdate, ...updates];
      setUpdates(nextUpdates);
      setCached(CACHE_KEYS.UPDATES, nextUpdates);
    }

    // Sync to Supabase
    enqueueOfflineAction('edit_timetable', { id, ...updatedWithMetadata }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Delete Timetable Entry
  const handleDeleteTimetableEntry = (id: string) => {
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    const nextTimetable = timetable.filter((e) => e.id !== id);
    setTimetable(nextTimetable);
    setCached(CACHE_KEYS.TIMETABLE, nextTimetable);

    // Log update
    const updateId = genUUID();
    const newUpdate: ClassUpdate = {
      id: updateId,
      classId: activeClassId,
      userId: user.id,
      userName: user.name,
      type: 'entry_deleted',
      description: `Schedule for ${entry.subject} was permanently removed from timetable.`,
      timestamp: new Date().toISOString(),
    };
    const nextUpdates = [newUpdate, ...updates];
    setUpdates(nextUpdates);
    setCached(CACHE_KEYS.UPDATES, nextUpdates);

    // Sync to Supabase
    enqueueOfflineAction('delete_timetable', { id }, (count) => setPendingSyncCount(count));
  };

  // Promote Member to Assistant
  const handlePromoteToAssistant = (classId: string, memberId: string) => {
    const nextClasses = classes.map((c) => {
      if (c.id === classId) {
        const filteredMembers = c.memberIds.filter((id) => id !== memberId);
        return {
          ...c,
          memberIds: filteredMembers,
          assistantIds: [...c.assistantIds, memberId],
        };
      }
      return c;
    });

    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);

    // Sync to Supabase
    enqueueOfflineAction('promote_member', { classId, memberId }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Demote Assistant to Member
  const handleDemoteToMember = (classId: string, assistantId: string) => {
    const nextClasses = classes.map((c) => {
      if (c.id === classId) {
        const filteredAssts = c.assistantIds.filter((id) => id !== assistantId);
        return {
          ...c,
          assistantIds: filteredAssts,
          memberIds: [...c.memberIds, assistantId],
        };
      }
      return c;
    });

    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);

    // Sync to Supabase
    enqueueOfflineAction('demote_assistant', { classId, assistantId }, (count) =>
      setPendingSyncCount(count)
    );
  };

  // Delete Class Group
  const handleDeleteClass = (classId: string) => {
    const nextClasses = classes.filter((c) => c.id !== classId);
    setClasses(nextClasses);
    setCached(CACHE_KEYS.CLASSES, nextClasses);

    const nextTimetable = timetable.filter((entry) => entry.classId !== classId);
    setTimetable(nextTimetable);
    setCached(CACHE_KEYS.TIMETABLE, nextTimetable);

    const nextLogs = attendanceLogs.filter((log) => log.classId !== classId);
    setAttendanceLogs(nextLogs);
    setCached(CACHE_KEYS.ATTENDANCE, nextLogs);

    // Sync to Supabase
    enqueueOfflineAction('delete_class', { classId }, (count) => setPendingSyncCount(count));
  };

  // Update Notification Preferences (Sync in Local Storage Cache only)
  const handleUpdatePrefs = (updatedPrefs: Partial<NotificationPreferences>) => {
    setNotificationPrefs((prev) => ({ ...prev, ...updatedPrefs }));
  };

  // Reset local state (For debugging, removes all keys)
  const handleResetApp = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setClasses(INITIAL_CLASSES);
    setTimetable(INITIAL_TIMETABLE);
    setAttendanceLogs(INITIAL_ATTENDANCE);
    setUpdates(INITIAL_UPDATES);
    setNotificationPrefs(INITIAL_PREFERENCES);
    setActiveClassId('class_swe301');
    setSimulatedTime('10:45');
    setCurrentView('home');
    setIsLoggedIn(false);
  };

  // Disabled mock switcher handlers
  const handleDevRoleOverride = (targetRole: Role) => {
    alert('Bypass override disabled. Please register or sign in as a live user.');
  };

  // --- 5. Render active view module ---
  const renderViewContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            timetable={timetable}
            attendanceLogs={attendanceLogs}
            joinedClasses={userJoinedClasses}
            currentSimulatedTime={simulatedTime}
            updates={updates.filter((u) => u.classId === activeClassId)}
            onMarkAttendance={handleMarkAttendance}
            userRole={currentUserRole}
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
          />
        );
      case 'profile':
        return (
          <ProfileView
            currentUser={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              setCached(CACHE_KEYS.USER, updated);
              enqueueOfflineAction('update_profile', {
                id: user.id,
                name: updated.name,
                phone: updated.phone,
                plan: updated.plan,
                whatsappNumber: updated.whatsappNumber,
              }, (count) => setPendingSyncCount(count));
            }}
            joinedClasses={userJoinedClasses}
            notificationPrefs={notificationPrefs}
            onUpdatePrefs={handleUpdatePrefs}
            onResetApp={handleResetApp}
            simulatedTime={simulatedTime}
            onUpdateSimulatedTime={setSimulatedTime}
            currentUserRole={currentUserRole}
            onUpdateRole={handleDevRoleOverride}
            onLogout={handleLogout}
            onNavigate={setCurrentView}
            theme={theme}
            onUpdateTheme={setTheme}
          />
        );
      case 'reminders':
        return (
          <ReminderSettingsView
            currentUser={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              setCached(CACHE_KEYS.USER, updated);
              enqueueOfflineAction('update_profile', {
                id: user.id,
                name: updated.name,
                phone: updated.phone,
                plan: updated.plan,
                whatsappNumber: updated.whatsappNumber,
              }, (count) => setPendingSyncCount(count));
            }}
            onBack={() => setCurrentView('profile')}
            onUpgradeClick={(targetPlan) => {
              setCurrentView('profile');
              setTimeout(() => {
                const upgradeBtn = document.querySelector(`[id="plan-and-reminders-section"]`);
                if (upgradeBtn) {
                  upgradeBtn.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin')) {
    return <AdminApp />;
  }

  if (!isLoggedIn) {
    return <LandingView onLoginSuccess={handleLoginSuccess} classesCount={classes.length} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col font-sans" id="thesdel-root">
      {/* 1. Header Navigation Bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30" id="thesdel-header">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <BookOpen className="w-5 h-5 text-zinc-950 dark:text-zinc-50 shrink-0" />
            <span className="font-mono text-base font-bold tracking-wider text-zinc-950 dark:text-zinc-100">THESDEL</span>
          </div>

          {/* Quick Active Status Pill with Pending Offline Actions Counter */}
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

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-28">
        {renderViewContent()}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 fixed bottom-0 left-0 right-0 h-16 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe" id="thesdel-bottom-nav">
        <nav className="max-w-4xl mx-auto grid grid-cols-5 h-full">
          <button
            id="nav-home"
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
            }`}
          >
            <Clock className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">Today</span>
          </button>
          
          <button
            id="nav-timetable"
            onClick={() => setCurrentView('timetable')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              currentView === 'timetable' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
            }`}
          >
            <Calendar className={`w-5 h-5 ${currentView === 'timetable' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">Timetable</span>
          </button>

          <button
            id="nav-attendance"
            onClick={() => setCurrentView('attendance')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              currentView === 'attendance' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
            }`}
          >
            <CheckCircle2 className={`w-5 h-5 ${currentView === 'attendance' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">Attendance</span>
          </button>

          <button
            id="nav-class"
            onClick={() => setCurrentView('class')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              currentView === 'class' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
            }`}
          >
            <Layers className={`w-5 h-5 ${currentView === 'class' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">Class</span>
          </button>

          <button
            id="nav-profile"
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              currentView === 'profile' || currentView === 'reminders' ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350'
            }`}
          >
            <UserIcon className={`w-5 h-5 ${currentView === 'profile' || currentView === 'reminders' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
