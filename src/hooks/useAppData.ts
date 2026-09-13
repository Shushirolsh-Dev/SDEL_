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
  const enabled = Boolean(isLoggedIn && userId);

  /*
   * ------------------------------------------------------------
   * CLASSES + MEMBERS
   * ------------------------------------------------------------
   */
  const classesQuery = useQuery({
    queryKey: ['classes', userId],

    queryFn: async () => {
      if (!userId) {
        return {
          classIds: [],
          classRows: [],
          membershipRows: [],
        };
      }

      const { data: myMemberships, error: membershipError } =
        await supabase
          .from('class_members')
          .select('class_id')
          .eq('user_id', userId);

      if (membershipError) {
        throw membershipError;
      }

      const { data: ownedClasses, error: ownedClassesError } =
        await supabase
          .from('classes')
          .select('id')
          .eq('owner_id', userId);

      if (ownedClassesError) {
        throw ownedClassesError;
      }

      const memberClassIds = (myMemberships || []).map(
        (row) => row.class_id
      );

      const ownedClassIds = (ownedClasses || []).map(
        (row) => row.id
      );

      const classIds = Array.from(
        new Set([...memberClassIds, ...ownedClassIds])
      );

      if (classIds.length === 0) {
        return {
          classIds: [],
          classRows: [],
          membershipRows: [],
        };
      }

      const { data: classRows, error: classError } =
        await supabase
          .from('classes')
          .select(
            'id, name, code, owner_id, description, visibility'
          )
          .in('id', classIds);

      if (classError) {
        throw classError;
      }

      const { data: membershipRows, error: membersError } =
        await supabase
          .from('class_members')
          .select(
            'class_id, user_id, role, status'
          )
          .in('class_id', classIds);

      if (membersError) {
        throw membersError;
      }

      return {
        classIds,
        classRows: classRows || [],
        membershipRows: membershipRows || [],
      };
    },

    enabled,
    staleTime: 0,
    refetchOnMount: true,
  });

  const classIds = classesQuery.data?.classIds ?? [];

  /*
   * ------------------------------------------------------------
   * MEMBER PROFILE NAMES
   * ------------------------------------------------------------
   */
  const memberIdsToFetch = useMemo(() => {
    const data = classesQuery.data;

    if (!data) {
      return [];
    }

    const ids = new Set<string>();

    for (const membership of data.membershipRows) {
      if (membership.user_id) {
        ids.add(membership.user_id);
      }
    }

    for (const classRow of data.classRows) {
      if (classRow.owner_id) {
        ids.add(classRow.owner_id);
      }
    }

    return Array.from(ids).sort();
  }, [classesQuery.data]);

  const memberProfilesQuery = useQuery<Record<string, string>>({
    queryKey: ['memberProfiles', memberIdsToFetch],

    queryFn: async () => {
      if (memberIdsToFetch.length === 0) {
        return {};
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', memberIdsToFetch);

      if (error) {
        throw error;
      }

      const names: Record<string, string> = {};

      for (const profile of data || []) {
        names[profile.id] = profile.name;
      }

      return names;
    },

    enabled: enabled && memberIdsToFetch.length > 0,
    staleTime: 0,
    refetchOnMount: true,
  });

  const memberNamesMap = memberProfilesQuery.data ?? {};

  /*
   * ------------------------------------------------------------
   * BUILD CLASS OBJECTS
   * ------------------------------------------------------------
   */
  const classes = useMemo<ClassGroup[]>(() => {
    const data = classesQuery.data;

    if (!data) {
      return [];
    }

    const { classRows, membershipRows } = data;

    return classRows.map((classRow: any) => {
      const rows = membershipRows.filter(
        (membership: any) =>
          membership.class_id === classRow.id
      );

      const ownerName =
        memberNamesMap[classRow.owner_id] ||
        'Representative';

      const approvedAssistants = rows.filter(
        (membership: any) =>
          membership.role === 'assistant' &&
          membership.status === 'approved'
      );

      const approvedMembers = rows.filter(
        (membership: any) =>
          membership.role === 'member' &&
          membership.status === 'approved'
      );

      const pendingMembers = rows.filter(
        (membership: any) =>
          membership.status === 'pending'
      );

      const assistantIds = approvedAssistants.map(
        (membership: any) => membership.user_id
      );

      const memberIds = approvedMembers.map(
        (membership: any) => membership.user_id
      );

      const pendingMemberIds = pendingMembers.map(
        (membership: any) => membership.user_id
      );

      const members = [
        {
          id: classRow.owner_id,
          name: ownerName,
          role: 'representative',
          status: 'approved',
        },

        ...approvedAssistants.map((membership: any) => ({
          id: membership.user_id,
          name:
            memberNamesMap[membership.user_id] ||
            'Assistant',
          role: 'assistant',
          status: 'approved',
        })),

        ...approvedMembers.map((membership: any) => ({
          id: membership.user_id,
          name:
            memberNamesMap[membership.user_id] ||
            'Member',
          role: 'member',
          status: 'approved',
        })),

        ...pendingMembers.map((membership: any) => ({
          id: membership.user_id,
          name:
            memberNamesMap[membership.user_id] ||
            'Pending',
          role: membership.role || 'member',
          status: 'pending',
        })),
      ];

      return {
        id: classRow.id,
        name: classRow.name,
        code: classRow.code,
        ownerId: classRow.owner_id,
        assistantIds,
        memberIds,
        pendingMemberIds,
        members,
        description:
          classRow.description || undefined,
        visibility:
          classRow.visibility || 'public',
      };
    });
  }, [classesQuery.data, memberNamesMap]);

  /*
   * ------------------------------------------------------------
   * TIMETABLE
   * ------------------------------------------------------------
   */
  const timetableQuery = useQuery<TimetableEntry[]>({
    queryKey: ['timetable', classIds],

    queryFn: async () => {
      if (classIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('timetable')
        .select(
          'id, class_id, subject, day_of_week, start_time, end_time, duration_minutes, venue, original_venue, venue_changed_at, is_cancelled, cancelled_at'
        )
        .in('class_id', classIds);

      if (error) {
        throw error;
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        classId: entry.class_id,
        subject: entry.subject,
        dayOfWeek: entry.day_of_week,
        startTime: entry.start_time,
        endTime: entry.end_time,
        durationMinutes: entry.duration_minutes,
        venue: entry.venue,
        originalVenue:
          entry.original_venue || undefined,
        venueChangedAt:
          entry.venue_changed_at || undefined,
        isCancelled: entry.is_cancelled,
        cancelledAt:
          entry.cancelled_at || undefined,
      }));
    },

    enabled: enabled && classIds.length > 0,
  });

  /*
   * ------------------------------------------------------------
   * ATTENDANCE
   * ------------------------------------------------------------
   */
  const attendanceLogsQuery =
    useQuery<AttendanceLog[]>({
      queryKey: ['attendanceLogs', userId],

      queryFn: async () => {
        if (!userId) {
          return [];
        }

        const { data, error } = await supabase
          .from('attendance_logs')
          .select(
            'id, class_id, timetable_entry_id, date, status, timestamp'
          )
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(500);

        if (error) {
          throw error;
        }

        return (data || []).map((log: any) => ({
          id: log.id,
          classId: log.class_id,
          timetableEntryId: log.timetable_entry_id,
          date: log.date,
          status: log.status as any,
          timestamp: log.timestamp,
        }));
      },

      enabled,
    });

  /*
   * ------------------------------------------------------------
   * CLASS UPDATES
   * ------------------------------------------------------------
   */
  const updatesQuery = useQuery<ClassUpdate[]>({
    queryKey: ['updates', classIds],

    queryFn: async () => {
      if (classIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('updates')
        .select(
          'id, class_id, user_id, user_name, type, description, timestamp'
        )
        .in('class_id', classIds)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return (data || []).map((update: any) => ({
        id: update.id,
        classId: update.class_id,
        userId: update.user_id || undefined,
        userName: update.user_name,
        type: update.type as any,
        description: update.description,
        timestamp: update.timestamp,
      }));
    },

    enabled: enabled && classIds.length > 0,
  });

  /*
   * ------------------------------------------------------------
   * PENDING REMOVALS
   * ------------------------------------------------------------
   */
  const pendingRemovalsQuery =
    useQuery<PendingRemoval[]>({
      queryKey: ['pendingRemovals', classIds],

      queryFn: async () => {
        if (classIds.length === 0) {
          return [];
        }

        const { data, error } = await supabase
          .from('pending_removals')
          .select(
            'id, class_id, user_id, requested_by, created_at'
          )
          .in('class_id', classIds);

        if (error) {
          throw error;
        }

        return (data || []).map((removal: any) => ({
          id: removal.id,
          classId: removal.class_id,
          userId: removal.user_id,
          requestedBy: removal.requested_by,
          createdAt: removal.created_at,
        }));
      },

      enabled: enabled && classIds.length > 0,
    });

  /*
   * ------------------------------------------------------------
   * RETURN APP DATA
   * ------------------------------------------------------------
   */
  return {
    classes,
    timetable: timetableQuery.data ?? [],
    attendanceLogs: attendanceLogsQuery.data ?? [],
    updates: updatesQuery.data ?? [],
    pendingRemovals:
      pendingRemovalsQuery.data ?? [],
    memberNamesMap,
  };
}

Only the debugging "alert(...)" was removed. No class logic, query, membership filtering, or UI behavior was changed.