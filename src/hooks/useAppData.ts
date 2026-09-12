import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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

  // ------------------------------------------------------------------
  // 1. ONE entry query — my classes + my memberships in two batched calls
  // ------------------------------------------------------------------
  const membershipQuery = useQuery<{
    classIds: string[];
    membershipRows: any[];
    classRows: any[];
  }>({
    queryKey: ['myMembership', userId],
    queryFn: async () => {
      if (!userId) {
        return { classIds: [], membershipRows: [], classRows: [] };
      }

      // My approved/pending memberships
      const { data: myMemberships, error: memErr } = await supabase
        .from('class_members')
        .select('class_id, role, status, user_id')
        .eq('user_id', userId);

      if (memErr) throw memErr;

      const memberClassIds = (myMemberships || []).map(
        (m) => m.class_id
      );

      // Classes I own (in case I own classes without a class_members row)
      const { data: ownedClasses, error: ownErr } = await supabase
        .from('classes')
        .select('id')
        .eq('owner_id', userId);

      if (ownErr) throw ownErr;

      const ownedClassIds = (ownedClasses || []).map((c) => c.id);

      // Union of class ids I'm connected to
      const classIds = Array.from(
        new Set([...memberClassIds, ...ownedClassIds])
      );

      if (classIds.length === 0) {
        return { classIds: [], membershipRows: [], classRows: [] };
      }

      // ONE batched call for classes
      const { data: classRows, error: classErr } = await supabase
        .from('classes')
        .select('id, name, code, owner_id, description, visibility')
        .in('id', classIds);

      if (classErr) throw classErr;

      // ONE batched call for members of those classes
      const { data: membershipRows, error: allMemErr } = await supabase
        .from('class_members')
        .select('class_id, user_id, role, status')
        .in('class_id', classIds);

      if (allMemErr) throw allMemErr;

      return {
        classIds,
        membershipRows: membershipRows || [],
        classRows: classRows || [],
      };
    },
    enabled,
  });

  const classIds = membershipQuery.data?.classIds ?? [];

  // ------------------------------------------------------------------
  // 2. classes — derived in memory from the batched results
  // ------------------------------------------------------------------
  const classes = useMemo<ClassGroup[]>(() => {
    const data = membershipQuery.data;
    if (!data) return [];

    const { membershipRows, classRows } = data;

    return classRows.map((cls: any) => {
      const rows = membershipRows.filter(
        (m: any) => m.class_id === cls.id
      );

      const assistantIds = rows
        .filter(
          (m: any) =>
            m.role === 'assistant' && m.status === 'approved'
        )
        .map((m: any) => m.user_id);

      const memberIds = rows
        .filter(
          (m: any) => m.role === 'member' && m.status === 'approved'
        )
        .map((m: any) => m.user_id);

      const pendingMemberIds = rows
        .filter((m: any) => m.status === 'pending')
        .map((m: any) => m.user_id);

      return {
        id: cls.id,
        name: cls.name,
        code: cls.code,
        ownerId: cls.owner_id,
        assistantIds,
        memberIds,
        pendingMemberIds,
        description: cls.description || undefined,
        visibility: cls.visibility || 'public',
      };
    });
  }, [membershipQuery.data]);

  // ------------------------------------------------------------------
  // 3. memberNamesMap — derived from the batched memberships
  // ------------------------------------------------------------------
  const memberIdsToFetch = useMemo(() => {
    const data = membershipQuery.data;
    if (!data) return [];
    const set = new Set<string>();
    for (const m of data.membershipRows) {
      set.add(m.user_id);
    }
    return Array.from(set);
  }, [membershipQuery.data]);

  const memberProfilesQuery = useQuery<Record<string, string>>({
    queryKey: ['memberProfiles', memberIdsToFetch.sort().join(',')],
    queryFn: async () => {
      if (memberIdsToFetch.length === 0) return {};
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', memberIdsToFetch);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const p of data || []) {
        map[p.id] = p.name;
      }
      return map;
    },
    enabled: enabled && memberIdsToFetch.length > 0,
  });

  // ------------------------------------------------------------------
  // 4. timetable — scoped to my classIds
  // ------------------------------------------------------------------
  const timetableQuery = useQuery<TimetableEntry[]>({
    queryKey: ['timetable', classIds.sort().join(',')],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('timetable')
        .select(
          'id, class_id, subject, day_of_week, start_time, end_time, duration_minutes, venue, original_venue, venue_changed_at, is_cancelled, cancelled_at'
        )
        .in('class_id', classIds);
      if (error) throw error;
      return (data || []).map((e: any) => ({
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
    enabled: enabled && classIds.length > 0,
  });

  // ------------------------------------------------------------------
  // 5. attendanceLogs — already scoped to user, add a sane limit
  // ------------------------------------------------------------------
  const attendanceLogsQuery = useQuery<AttendanceLog[]>({
    queryKey: ['attendanceLogs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('attendance_logs')
        .select(
          'id, class_id, timetable_entry_id, date, status, timestamp'
        )
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []).map((l: any) => ({
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

  // ------------------------------------------------------------------
  // 6. updates — scoped to my classIds, newest 100
  // ------------------------------------------------------------------
  const updatesQuery = useQuery<ClassUpdate[]>({
    queryKey: ['updates', classIds.sort().join(',')],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('updates')
        .select(
          'id, class_id, user_id, user_name, type, description, timestamp'
        )
        .in('class_id', classIds)
        .order('timestamp', { ascending: false })
        .limit(100);
      if (error) throw error;

      return (data || []).map((u: any) => ({
        id: u.id,
        classId: u.class_id,
        userId: u.user_id || undefined,
        userName: u.user_name,
        type: u.type as any,
        description: u.description,
        timestamp: u.timestamp,
      }));
    },
    enabled: enabled && classIds.length > 0,
  });

  // ------------------------------------------------------------------
  // 7. pendingRemovals — scoped to my classIds
  // ------------------------------------------------------------------
  const pendingRemovalsQuery = useQuery<PendingRemoval[]>({
    queryKey: ['pendingRemovals', classIds.sort().join(',')],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('pending_removals')
        .select(
          'id, class_id, user_id, requested_by, created_at'
        )
        .in('class_id', classIds);
      if (error) throw error;
      return (data || []).map((pr: any) => ({
        id: pr.id,
        classId: pr.class_id,
        userId: pr.user_id,
        requestedBy: pr.requested_by,
        createdAt: pr.created_at,
      }));
    },
    enabled: enabled && classIds.length > 0,
  });

  return {
    classes,
    timetable: timetableQuery.data ?? [],
    attendanceLogs: attendanceLogsQuery.data ?? [],
    updates: updatesQuery.data ?? [],
    pendingRemovals: pendingRemovalsQuery.data ?? [],
    memberNamesMap: memberProfilesQuery.data ?? {},
  };
}