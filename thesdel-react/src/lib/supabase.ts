import { createClient } from '@supabase/supabase-js';
import { User, ClassGroup, TimetableEntry, AttendanceLog, ClassUpdate, NotificationPreferences } from '../types';

// 🔥 HARDCODED SUPABASE CREDENTIALS - Replace these with your actual values
const supabaseUrl = 'https://lgfyrlfjoazedwymjpfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface OfflineAction {
  id: string;
  type:
    | 'create_class'
    | 'join_class'
    | 'add_timetable'
    | 'edit_timetable'
    | 'delete_timetable'
    | 'mark_attendance'
    | 'update_profile'
    | 'promote_member'
    | 'demote_assistant'
    | 'delete_class'
    | 'update_notification_preferences'
    | 'change_class_code'
    | 'request_member_removal'
    | 'approve_member_removal'
    | 'reject_member_removal'
    | 'remove_member_instantly';
  payload: any;
  timestamp: string;
}

// CACHE KEYS
export const CACHE_KEYS = {
  USER: 'thesdel_cache_user',
  CLASSES: 'thesdel_cache_classes',
  TIMETABLE: 'thesdel_cache_timetable',
  ATTENDANCE: 'thesdel_cache_attendance',
  UPDATES: 'thesdel_cache_updates',
  PREFERENCES: 'thesdel_cache_preferences',
  QUEUE: 'thesdel_sync_queue',
  LOGGED_IN: 'thesdel_logged_in',
  PENDING_REMOVALS: 'thesdel_cache_pending_removals',
};

// --- Caching Helpers ---
export function getCached<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Error reading cache:', e);
    return defaultValue;
  }
}

export function setCached<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing cache:', e);
  }
}

// --- Sync Queue State Management ---
export function getOfflineQueue(): OfflineAction[] {
  return getCached<OfflineAction[]>(CACHE_KEYS.QUEUE, []);
}

export function saveOfflineQueue(queue: OfflineAction[]): void {
  setCached<OfflineAction[]>(CACHE_KEYS.QUEUE, queue);
}

// Add an action to the queue and optimistically attempt execution
export async function enqueueOfflineAction(
  type: OfflineAction['type'],
  payload: any,
  onQueueChange?: (pendingCount: number) => void
): Promise<void> {
  const action: OfflineAction = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  const queue = getOfflineQueue();
  queue.push(action);
  saveOfflineQueue(queue);
  if (onQueueChange) onQueueChange(queue.length);

  // Attempt to sync immediately if online
  if (navigator.onLine) {
    await processOfflineQueue(onQueueChange);
  }
}

// Sequentially process the queue
export async function processOfflineQueue(
  onQueueChange?: (pendingCount: number) => void
): Promise<void> {
  if (!navigator.onLine) return;

  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`[SyncEngine] Processing ${queue.length} offline actions...`);
  const remaining: OfflineAction[] = [];

  for (const action of queue) {
    try {
      await executeAction(action);
    } catch (err) {
      console.error(`[SyncEngine] Action ${action.type} failed, keeping in queue:`, err);
      remaining.push(action);
    }
  }

  saveOfflineQueue(remaining);
  if (onQueueChange) onQueueChange(remaining.length);
}

// Map queue action type to actual Supabase client operation
async function executeAction(action: OfflineAction): Promise<void> {
  const { type, payload } = action;

  switch (type) {
    case 'update_profile': {
      const { id, name, phone, plan, whatsappNumber } = payload;
      const { error } = await supabase
        .from('profiles')
        .update({ name, phone, plan, whatsapp_number: whatsappNumber })
        .eq('id', id);
      if (error) throw error;
      break;
    }

    case 'create_class': {
      const { id, name, code, ownerId } = payload;
      const { error: classErr } = await supabase
        .from('classes')
        .insert([{ id, name, code, owner_id: ownerId }]);
      if (classErr) throw classErr;
      break;
    }

    case 'join_class': {
      const { classId, userId } = payload;
      const { error } = await supabase
        .from('class_members')
        .insert([{ class_id: classId, user_id: userId, role: 'member' }]);
      if (error) throw error;
      break;
    }

    case 'add_timetable': {
      const { id, classId, subject, dayOfWeek, startTime, endTime, durationMinutes, venue } = payload;
      const { error } = await supabase.from('timetable').insert([
        {
          id,
          class_id: classId,
          subject,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: durationMinutes,
          venue,
        },
      ]);
      if (error) throw error;
      break;
    }

    case 'edit_timetable': {
      const { id, ...fields } = payload;
      // Map JS camelCase back to SQL snake_case
      const dbFields: any = {};
      if (fields.subject !== undefined) dbFields.subject = fields.subject;
      if (fields.dayOfWeek !== undefined) dbFields.day_of_week = fields.dayOfWeek;
      if (fields.startTime !== undefined) dbFields.start_time = fields.startTime;
      if (fields.endTime !== undefined) dbFields.end_time = fields.endTime;
      if (fields.durationMinutes !== undefined) dbFields.duration_minutes = fields.durationMinutes;
      if (fields.venue !== undefined) dbFields.venue = fields.venue;
      if (fields.originalVenue !== undefined) dbFields.original_venue = fields.originalVenue;
      if (fields.venueChangedAt !== undefined) dbFields.venue_changed_at = fields.venueChangedAt;
      if (fields.isCancelled !== undefined) dbFields.is_cancelled = fields.isCancelled;
      if (fields.cancelledAt !== undefined) dbFields.cancelled_at = fields.cancelledAt;

      const { error } = await supabase
        .from('timetable')
        .update(dbFields)
        .eq('id', id);
      if (error) throw error;
      break;
    }

    case 'delete_timetable': {
      const { id } = payload;
      const { error } = await supabase.from('timetable').delete().eq('id', id);
      if (error) throw error;
      break;
    }

    case 'mark_attendance': {
      const { id, classId, timetableEntryId, date, status, userId } = payload;
      const { error } = await supabase.from('attendance_logs').insert([
        {
          id,
          class_id: classId,
          timetable_entry_id: timetableEntryId,
          date,
          status,
          user_id: userId,
        },
      ]);
      if (error) throw error;
      break;
    }

    case 'promote_member': {
      const { classId, memberId } = payload;
      const { error } = await supabase
        .from('class_members')
        .update({ role: 'assistant' })
        .eq('class_id', classId)
        .eq('user_id', memberId);
      if (error) throw error;
      break;
    }

    case 'demote_assistant': {
      const { classId, assistantId } = payload;
      const { error } = await supabase
        .from('class_members')
        .update({ role: 'member' })
        .eq('class_id', classId)
        .eq('user_id', assistantId);
      if (error) throw error;
      break;
    }

    case 'delete_class': {
      const { classId } = payload;
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (error) throw error;
      break;
    }

    case 'change_class_code': {
      const { classId, newCode } = payload;
      const { error } = await supabase
        .from('classes')
        .update({ code: newCode })
        .eq('id', classId);
      if (error) throw error;
      break;
    }

    case 'request_member_removal': {
      const { classId, memberId, requestedBy } = payload;
      const { error } = await supabase
        .from('pending_removals')
        .insert([{ class_id: classId, user_id: memberId, requested_by: requestedBy }]);
      if (error) throw error;
      break;
    }

    case 'approve_member_removal': {
      const { classId, memberId } = payload;
      // 1. Delete from class_members
      const { error: err1 } = await supabase
        .from('class_members')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', memberId);
      if (err1) throw err1;

      // 2. Delete from pending_removals
      const { error: err2 } = await supabase
        .from('pending_removals')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', memberId);
      if (err2) throw err2;
      break;
    }

    case 'reject_member_removal': {
      const { classId, memberId } = payload;
      const { error } = await supabase
        .from('pending_removals')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', memberId);
      if (error) throw error;
      break;
    }

    case 'remove_member_instantly': {
      const { classId, memberId } = payload;
      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', memberId);
      if (error) throw error;
      break;
    }

    default:
      console.warn(`[SyncEngine] Unhandled action type: ${type}`);
  }
}

/**
 * Fetch dynamic subscription prices from the Supabase backend table.
 * Falls back to default USD prices (1.00 for basic, 3.00 for premium)
 * if database is offline or table is not created yet.
 */
export async function fetchBasePrices(): Promise<{ basic: number; premium: number }> {
  try {
    const { data, error } = await supabase
      .from('subscription_prices')
      .select('plan, price_usd');

    if (error || !data || data.length === 0) {
      console.log('[Supabase] Could not load subscription_prices table (using defaults):', error);
      return { basic: 1.00, premium: 3.00 };
    }

    const prices = { basic: 1.00, premium: 3.00 };
    data.forEach((row: any) => {
      if (row.plan === 'basic') prices.basic = parseFloat(row.price_usd);
      if (row.plan === 'premium') prices.premium = parseFloat(row.price_usd);
    });

    console.log('[Supabase] Dynamic prices loaded from backend:', prices);
    return prices;
  } catch (err) {
    console.warn('[Supabase] Error querying subscription_prices table (using defaults):', err);
    return { basic: 1.00, premium: 3.00 };
  }
}
