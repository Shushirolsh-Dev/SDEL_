import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import {
  User,
  ClassGroup,
  TimetableEntry,
  Role,
} from '../types';
import type { AppStrings } from '../i18n/types.app';

const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface UseAppHandlersOptions {
  user: User | null;
  classes: ClassGroup[];
  timetable: TimetableEntry[];
  memberNamesMap: Record<string, string>;
  activeClassId: string;
  userJoinedClasses: ClassGroup[];
  strings: AppStrings;
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'info'
  ) => void;
  setActiveClassId: (id: string) => void;
}

export function useAppHandlers({
  user,
  classes,
  timetable,
  memberNamesMap,
  activeClassId,
  userJoinedClasses,
  strings,
  showToast,
  setActiveClassId,
}: UseAppHandlersOptions) {
  const queryClient = useQueryClient();

  const handleClassRepBroadcast = async (
    classId: string,
    description: string
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const newUpdate = {
        class_id: classId,
        user_id: user.id,
        user_name: `${user.name} (${strings.broadcast.classRepMarker})`,
        type: 'entry_added',
        description,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('updates')
        .insert([newUpdate]);
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['updates'] });
      return true;
    } catch (err) {
      console.error('[App] Failed to post class rep broadcast:', err);
      return false;
    }
  };

  const handleCreateClass = async (
    name: string,
    description: string,
    visibility: 'public' | 'private'
  ): Promise<string> => {
    if (!user) return '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(
          Math.floor(Math.random() * chars.length)
        );
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
      visibility,
    });
    if (error) throw error;

    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: newId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_added',
      description: strings.broadcast.classCreated(
        name,
        user.name,
        code
      ),
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
    setActiveClassId(newId);

    return code;
  };

  const handleJoinClass = async (code: string) => {
    if (!user) return;

    const { data: dbClass, error: dbErr } = await supabase
      .from('classes')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (dbErr || !dbClass) {
      showToast(strings.toast.classCodeNotFound(code), 'error');
      return;
    }

    const { data: existingMember } = await supabase
      .from('class_members')
      .select('*')
      .eq('class_id', dbClass.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingMember) {
      showToast(strings.toast.alreadyJoined, 'info');
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
        status: initialStatus,
      });

    if (joinErr) {
      showToast(
        strings.toast.errorJoining(joinErr.message),
        'error'
      );
      return;
    }

    if (isPrivate) {
      showToast(strings.toast.requestSubmitted, 'info');
    } else {
      showToast(
        strings.toast.enrolledSuccess(dbClass.name),
        'success'
      );
      setActiveClassId(dbClass.id);
    }

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
  };

  const handleApproveJoinRequest = async (
    classId: string,
    userId: string
  ) => {
    const { error } = await supabase
      .from('class_members')
      .update({ status: 'approved' })
      .eq('class_id', classId)
      .eq('user_id', userId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    showToast(strings.toast.joinApproved, 'success');
  };

  const handleRejectJoinRequest = async (
    classId: string,
    userId: string
  ) => {
    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', userId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    showToast(strings.toast.joinDenied, 'info');
  };

  const handleRequestMemberRemoval = async (
    classId: string,
    memberId: string
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from('pending_removals')
      .insert({
        id: genUUID(),
        class_id: classId,
        user_id: memberId,
        requested_by: user.id,
        created_at: new Date().toISOString(),
      });
    if (error) throw error;
    await queryClient.invalidateQueries({
      queryKey: ['pendingRemovals'],
    });
    showToast(strings.toast.removalRequestSent, 'info');
  };

  const handleRemoveMemberInstantly = async (
    classId: string,
    memberId: string
  ) => {
    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    showToast(strings.toast.memberRemoved, 'success');
  };

  const handleApproveMemberRemoval = async (
    classId: string,
    memberId: string
  ) => {
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
    await queryClient.invalidateQueries({
      queryKey: ['pendingRemovals'],
    });
    showToast(strings.toast.removalApproved, 'success');
  };

  const handleRejectMemberRemoval = async (
    classId: string,
    memberId: string
  ) => {
    const { error } = await supabase
      .from('pending_removals')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({
      queryKey: ['pendingRemovals'],
    });
    showToast(strings.toast.removalRejected, 'info');
  };

  const handleUpdateClassCode = async (
    classId: string
  ): Promise<string> => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCode = '';
    let isUnique = false;

    while (!isUnique) {
      let randomPart = '';
      for (let i = 0; i < 10; i++) {
        randomPart += chars.charAt(
          Math.floor(Math.random() * chars.length)
        );
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
    showToast(strings.toast.codeChanged(newCode), 'success');
    return newCode;
  };

  const handleMarkAttendance = async (
    entryId: string,
    date: string
  ) => {
    if (!user) return;
    const newLogId = genUUID();
    const { error } = await supabase
      .from('attendance_logs')
      .insert({
        id: newLogId,
        class_id: activeClassId,
        timetable_entry_id: entryId,
        user_id: user.id,
        date,
        status: 'attended',
        timestamp: new Date().toISOString(),
      });
    if (error) throw error;
    await queryClient.invalidateQueries({
      queryKey: ['attendanceLogs', user.id],
    });
    showToast(strings.toast.attendanceMarked, 'success');
  };

  const handleAddTimetableEntry = async (
    entry: Omit<TimetableEntry, 'id'>
  ) => {
    if (!user) return;
    const newId = genUUID();
    const { error } = await supabase
      .from('timetable')
      .insert({
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

    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: activeClassId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_added',
      description: strings.broadcast.entryAdded(
        entry.subject,
        strings.broadcast.dayNames[entry.dayOfWeek - 1],
        entry.startTime
      ),
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
    showToast(strings.toast.timetableAdded, 'success');
  };

  const handleEditTimetableEntry = async (
    id: string,
    updatedFields: Partial<TimetableEntry>
  ) => {
    if (!user) return;
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    let changesDescription = '';
    const updatedWithMetadata: any = {};

    if (updatedFields.subject)
      updatedWithMetadata.subject = updatedFields.subject;
    if (updatedFields.startTime)
      updatedWithMetadata.start_time = updatedFields.startTime;
    if (updatedFields.endTime)
      updatedWithMetadata.end_time = updatedFields.endTime;
    if (updatedFields.durationMinutes)
      updatedWithMetadata.duration_minutes =
        updatedFields.durationMinutes;
    if (updatedFields.dayOfWeek)
      updatedWithMetadata.day_of_week = updatedFields.dayOfWeek;

    if (
      updatedFields.venue &&
      updatedFields.venue !== entry.venue
    ) {
      updatedWithMetadata.venue = updatedFields.venue;
      updatedWithMetadata.original_venue = entry.venue;
      updatedWithMetadata.venue_changed_at =
        new Date().toISOString();
      changesDescription += strings.broadcast.venueChanged(
        entry.subject,
        entry.venue || '',
        updatedFields.venue
      );
    }

    if (
      updatedFields.isCancelled !== undefined &&
      updatedFields.isCancelled !== entry.isCancelled
    ) {
      updatedWithMetadata.is_cancelled = updatedFields.isCancelled;
      if (updatedFields.isCancelled) {
        updatedWithMetadata.cancelled_at =
          new Date().toISOString();
        changesDescription += strings.broadcast.classCancelled(
          entry.subject
        );
      } else {
        changesDescription +=
          strings.broadcast.cancellationReverted(entry.subject);
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
        type: updatedFields.isCancelled
          ? 'cancellation'
          : 'venue_change',
        description: changesDescription,
        timestamp: new Date().toISOString(),
      });
    }

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
    showToast(strings.toast.timetableUpdated, 'success');
  };

  const handleDeleteTimetableEntry = async (id: string) => {
    if (!user) return;
    const entry = timetable.find((e) => e.id === id);
    if (!entry) return;

    const { error } = await supabase
      .from('timetable')
      .delete()
      .eq('id', id);
    if (error) throw error;

    const updateId = genUUID();
    await supabase.from('updates').insert({
      id: updateId,
      class_id: activeClassId,
      user_id: user.id,
      user_name: user.name,
      type: 'entry_deleted',
      description: strings.broadcast.entryDeleted(entry.subject),
      timestamp: new Date().toISOString(),
    });

    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({ queryKey: ['updates'] });
    showToast(strings.toast.timetableDeleted, 'info');
  };

  const handleTrackAdEvent = async (
    adId: string,
    eventType: 'view' | 'click'
  ) => {
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

  const handlePromoteToAssistant = async (
    classId: string,
    memberId: string
  ) => {
    const { error } = await supabase
      .from('class_members')
      .update({ role: 'assistant' })
      .eq('class_id', classId)
      .eq('user_id', memberId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    showToast(strings.toast.memberPromoted, 'success');
  };

  const handleDemoteToMember = async (
    classId: string,
    assistantId: string
  ) => {
    const { error } = await supabase
      .from('class_members')
      .update({ role: 'member' })
      .eq('class_id', classId)
      .eq('user_id', assistantId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    showToast(strings.toast.assistantDemoted, 'info');
  };

  const handleDeleteClass = async (classId: string) => {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.invalidateQueries({ queryKey: ['timetable'] });
    await queryClient.invalidateQueries({
      queryKey: ['attendanceLogs'],
    });
    showToast(strings.toast.classDeleted, 'success');
  };

  const handleLeaveClass = async (classId: string) => {
    if (!user) {
      showToast(strings.toast.mustBeLoggedIn, 'error');
      return;
    }

    const activeClass = classes.find((c) => c.id === classId);
    if (activeClass && activeClass.ownerId === user.id) {
      if (activeClass.assistantIds.length === 0) {
        showToast(strings.toast.cannotLeaveAsRep, 'error');
        return;
      }

      const assistantName =
        memberNamesMap[activeClass.assistantIds[0]] ||
        'Assistant';
      if (activeClass.assistantIds.length === 1) {
        if (
          confirm(
            strings.confirm.transferOwnershipToOne(assistantName)
          )
        ) {
          await handleTransferOwnership(
            classId,
            activeClass.assistantIds[0]
          );
          return;
        }
        return;
      } else {
        showToast(
          strings.toast.selectAssistantToTransfer,
          'info'
        );
        return;
      }
    }

    const { error } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error leaving class:', error);
      showToast(strings.toast.leaveFailed, 'error');
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.refetchQueries({ queryKey: ['classes'] });

    if (activeClassId === classId) {
      const remaining = userJoinedClasses.filter(
        (c) => c.id !== classId
      );
      if (remaining.length > 0) {
        setActiveClassId(remaining[0].id);
      } else {
        setActiveClassId('');
      }
    }

    showToast(strings.toast.leftClass, 'success');
  };

  const handleTransferOwnership = async (
    classId: string,
    newOwnerId: string
  ) => {
    if (!user) return;

    const { error: updateError } = await supabase
      .from('classes')
      .update({ owner_id: newOwnerId })
      .eq('id', classId);

    if (updateError) {
      console.error('Error transferring ownership:', updateError);
      showToast(strings.toast.transferFailed, 'error');
      return;
    }

    const { error: roleError } = await supabase
      .from('class_members')
      .update({ role: 'representative' })
      .eq('class_id', classId)
      .eq('user_id', newOwnerId);

    if (roleError) {
      console.error('Error updating role:', roleError);
      showToast(strings.toast.roleUpdateFailed, 'error');
      return;
    }

    const { error: oldRoleError } = await supabase
      .from('class_members')
      .update({ role: 'member' })
      .eq('class_id', classId)
      .eq('user_id', user.id);

    if (oldRoleError) {
      console.error(
        'Error updating old owner role:',
        oldRoleError
      );
      showToast(strings.toast.roleUpdateFailedSelf, 'error');
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.refetchQueries({ queryKey: ['classes'] });

    const newOwnerName =
      memberNamesMap[newOwnerId] || 'Assistant';
    showToast(
      strings.toast.ownershipTransferred(newOwnerName),
      'success'
    );

    const { error: leaveError } = await supabase
      .from('class_members')
      .delete()
      .eq('class_id', classId)
      .eq('user_id', user.id);

    if (leaveError) {
      console.error(
        'Error leaving after transfer:',
        leaveError
      );
      showToast(strings.toast.leaveAfterTransferFailed, 'error');
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['classes'] });
    await queryClient.refetchQueries({ queryKey: ['classes'] });

    if (activeClassId === classId) {
      const remaining = userJoinedClasses.filter(
        (c) => c.id !== classId
      );
      if (remaining.length > 0) {
        setActiveClassId(remaining[0].id);
      } else {
        setActiveClassId('');
      }
    }

    showToast(strings.toast.leftAfterTransfer, 'success');
  };

  return {
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
  };
}