import { useQuery } from '@tanstack/react-query';
import {
  ClassGroup,
  TimetableEntry,
  AttendanceLog,
  ClassUpdate,
  PendingRemoval,
} from '../types';
import { supabase } from '../lib/supabase';

interface UseAppDataOptions {
  isLoggedIn: boolean;
  userId: string | undefined;
}

export function useAppData({
  isLoggedIn,
  userId,
}: UseAppDataOptions) {
  const enabled = isLoggedIn && !!userId;

  const classesQuery = useQuery<ClassGroup[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data: dbClasses, error } = await supabase
        .from('classes')
        .select('*');
      if (error) throw error;

      const formattedClasses: ClassGroup[] = [];
      for (const cls of dbClasses || []) {
        const { data: membersData } = await supabase
          .from('class_members')
          .select('*')
          .eq('class_id', cls.id);

        const assistantIds = (membersData || [])
          .filter(
            (m) =>
              m.role === 'assistant' && m.status === 'approved'
          )
          .map((m) => m.user_id);

        const memberIds = (membersData || [])
          .filter(
            (m) =>
              m.role === 'member' && m.status === 'approved'
          )
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
          visibility: cls.visibility || 'public',
        });
      }
      return formattedClasses;
    },
    enabled,
  });

  const timetableQuery = useQuery<TimetableEntry[]>({
    queryKey: ['timetable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetable')
        .select('*');
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
    enabled,
  });

  const attendanceLogsQuery = useQuery<AttendanceLog[]>({
    queryKey: ['attendanceLogs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', userId);
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
    enabled,
  });

  const updatesQuery = useQuery<ClassUpdate[]>({
    queryKey: ['updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;

      return (data || []).map((u) => ({
        id: u.id,
        classId: u.class_id,
        userId: u.user_id || undefined,
        userName: u.user_name,
        type: u.type as any,
        description: u.description,
        timestamp: u.timestamp,
      }));
    },
    enabled,
  });

  const pendingRemovalsQuery = useQuery<PendingRemoval[]>({
    queryKey: ['pendingRemovals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_removals')
        .select('*');
      if (error) throw error;
      return (data || []).map((pr) => ({
        id: pr.id,
        classId: pr.class_id,
        userId: pr.user_id,
        requestedBy: pr.requested_by,
        createdAt: pr.created_at,
      }));
    },
    enabled,
  });

  const memberNamesMapQuery = useQuery<Record<string, string>>({
    queryKey: ['memberNamesMap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name');
      if (error) throw error;
      const profileMap: Record<string, string> = {};
      for (const p of data || []) {
        profileMap[p.id] = p.name;
      }
      return profileMap;
    },
    enabled,
  });

  return {
    classes: classesQuery.data ?? [],
    timetable: timetableQuery.data ?? [],
    attendanceLogs: attendanceLogsQuery.data ?? [],
    updates: updatesQuery.data ?? [],
    pendingRemovals: pendingRemovalsQuery.data ?? [],
    memberNamesMap: memberNamesMapQuery.data ?? {},
  };
}