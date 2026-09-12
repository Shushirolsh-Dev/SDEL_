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

      const { data: myMemberships, error: memErr } = await supabase
        .from('class_members')
        .select('class_id, role, status, user_id')
        .eq('user_id', userId);

      if (memErr) throw memErr;

      const memberClassIds = (myMemberships || []).map(
        (m) => m.class_id
      );

      const { data: ownedClasses, error: ownErr } = await supabase
        .from('classes')
        .select('id')
        .eq('owner_id', userId);

      if (ownErr) throw ownErr;

      const ownedClassIds = (ownedClasses || []).map((c) => c.id);

      const classIds = Array.from(
        new Set([...memberClassIds, ...ownedClassIds])
      );

      if (classIds.length === 0) {
        return { classIds: [], membershipRows: [], classRows: [] };
      }

      const { data: classRows, error: classErr } = await supabase
        .from('classes')
        .select('id, name, code, owner_id, description, visibility')
        .in('id', classIds);

      if (classErr) throw classErr;

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

  const memberIdsToFetch = useMemo(() => {
    const data = membershipQuery.data;
    if (!data) return [];
    const set = new Set<string>();
    for (const m of data.membershipRows) {
      set.add(m.user_id);
    }
    for (const c of data.classRows) {
      if (c.owner_id) set.add(c.owner_id);
    }
    return Array.from(set);
  }, [membershipQuery.data]);

  const memberProfilesQuery = useQuery<Record<string, string>>({
    queryKey: [
      'memberProfiles',
      memberIdsToFetch.slice().sort().join(','),
    ],
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

  const memberNamesMap = memberProfilesQuery.data ?? {};

  const classes = useMemo<any[]>(() => {
    const data = membershipQuery.data;
    if (!data) return [];

    const { membershipRows, classRows } = data;

    // ─── DEBUG ALERT ───
    alert(
      'DEBUG rows=' +
        membershipRows.length +
        ' classes=' +
        classRows.length +
        ' names=' +
        Object.keys(memberNamesMap).length
    );

    return classRows.map((cls: any) => {
      const rows = membershipRows.filter(
        (m: any) => m.class_id === cls.id
      );

      const ownerName =
        memberNamesMap[cls.owner_id] || 'Representative';

      const approvedAssistants = rows.filter(
        (m: any) =>
          m.role === 'assistant' && m.status === 'approved'
      );
      const approvedMembers = rows.filter(
        (m: any) => m.role === 'member' && m.status === 'approved'
      );
      const pendingRows = rows.filter(
        (m: any) => m.status === 'pending'
      );

      const assistantIds = approvedAssistants.map(
        (m: any) => m.user_id
      );
      const memberIds = approvedMembers.map((m: any) => m.user_id);
      const pendingMemberIds = pendingRows.map(
        (m: any) => m.user_id
      );

      const members = [
        {
          id: cls.owner_id,
          name: ownerName,
          role: 'representative',
          status: 'approved',
        },
        ...approvedAssistants.map((m: any) => ({
          id: m.user_id,
          name: memberNamesMap[m.user_id] || 'Assistant',
          role: 'assistant',
          status: 'approved',
        })),
        ...approvedMembers.map((m: any) => ({
          id: m.user_id,
          name: memberNamesMap[m.user_id] || 'Member',
          role: 'member',
          status: 'approved',
        })),
        ...pendingRows.map((m: any) => ({
          id: m.user_id,
          name: memberNamesMap[m.user_id] || 'Pending',
          role: m.role || 'member',
          status: 'pending',
        })),
      ];

      return {
        id: cls.id,
        name: cls.name,
        code: cls.code,
        ownerId: cls.owner_id,
        assistantIds,
        memberIds,
        pendingMemberIds,
        members,
        description: cls.description || undefined,
        visibility: cls.visibility || 'public',
      };
    });
  }, [membershipQuery.data, memberNamesMap]);

  const timetableQuery = useQuery<TimetableEntry[]>({
    queryKey: ['timetable', classIds.slice().sort().join(',')],
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

  const updatesQuery = useQuery<ClassUpdate[]>({
    queryKey: ['updates', classIds.slice().sort().join(',')],
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

  const pendingRemovalsQuery = useQuery<PendingRemoval[]>({
    queryKey: ['pendingRemovals', classIds.slice().sort().join(',')],
    queryFn: async () => {
      if (classIds.length === 0) return [];
      const { data, error } = await supabase
        .from('pending_removals')
        .select('id, class_id, user_id, requested_by, created_at')
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
    classes: classes as ClassGroup[],
    timetable: timetableQuery.data ?? [],
    attendanceLogs: attendanceLogsQuery.data ?? [],
    updates: updatesQuery.data ?? [],
    pendingRemovals: pendingRemovalsQuery.data ?? [],
    memberNamesMap,
  };
}