# Thesdel Security & Authorization Model

This document outlines the security architecture designed for the Thesdel application. By treating the client browser as an untrusted environment, we enforce all access controls, validation checks, and operational permissions directly inside PostgreSQL using Row Level Security (RLS), constraints, and trigger functions.

---

## 🛡️ Core Security Architecture

1. **No Frontend Secrets**: All requests made from the browser use the standard public anonymous key (`VITE_SUPABASE_ANON_KEY`). No administrative keys (like `service_role`) are embedded, requested, or exposed.
2. **Server-Side Identity Verification**: Instead of relying on a role or ID passed from the frontend, queries use the cryptographically validated `auth.uid()` function supplied directly by Supabase Auth headers.
3. **Optimistic Updates with Persistent Queueing**: The application supports offline operations by applying modifications to state and cache locally, then queueing them. When online, these operations are processed sequentially and validated by PostgreSQL. If any client-side exploit attempts to bypass checks, PostgreSQL blocks the insertion/modification.

---

## 🗃️ Database Table Enforcements & Policies

### 1. Profiles Table (`public.profiles`)
- **Self-Update Only**: Users can only edit fields on their own profile row (`auth.uid() = id`).
- **Immutable Fields**: A pre-update trigger (`check_profile_updates`) prevents regular users from manually changing their `role`, `plan`, or `is_reminder_number_locked` fields.
- **WhatsApp Lock**: If `is_reminder_number_locked` is set to `true`, any update attempting to alter the `whatsapp_number` will raise a SQL exception on the server.

### 2. Classes Table (`public.classes`)
- **Strict Ownership**: Only the representative who created the class (`owner_id = auth.uid()`) can modify class parameters or delete the class entirely.
- **Access Isolation**: Select operations are permitted only if the authenticated user is the owner (`owner_id = auth.uid()`) or has a valid membership row in the `class_members` table for that class.

### 3. Class Members Table (`public.class_members`)
- **No Role Escalation**: Users can only join classes with a default role of `'member'`. Escalations to `'assistant'` must be performed by the class representative.
- **Leave and Evict**: A user can delete their own membership (leaving the class), or the representative can delete any membership row (removing/evicting a student).

### 4. Timetable Table (`public.timetable`)
- **Class Representative or Assistant Only**: Users can only perform INSERT, UPDATE, or DELETE on a class timetable if they are verified on the server as the class `owner_id` or as an enrolled assistant.

### 5. Attendance Logs Table (`public.attendance_logs`)
- **Class Membership Required**: Users can only create attendance logs if they are active members of the target class, preventing bypasses or logging attendance for unsubscribed classes.
- **No Proxy Marking**: The log's `user_id` is validated against `auth.uid()`. It is impossible for a student to edit or log attendance on behalf of another student.

---

## 🧪 Security Validation Matrix

The following scenarios are fully guarded by PostgreSQL constraints and policies:

| Threat Scenario | Client-Side Check | Database Security Control | Result |
|---|---|---|---|
| User modifies local state to change role to "representative" | UI shows rep controls | DB blocks any write to `timetable` or other restricted tables because `auth.uid()` does not match `classes.owner_id` | **Blocked** |
| User updates their own profile to set `plan = 'premium'` | UI updates subscription | `check_profile_updates` Postgres trigger aborts transaction with "Changing subscription plan directly is forbidden" | **Blocked** |
| User logs attendance for another student's ID | UI shows logged | `attendance_logs` insert policy checks `with check (user_id = auth.uid())`. Transaction fails. | **Blocked** |
| User changes a locked WhatsApp reminder number | UI shows input field | `check_profile_updates` trigger aborts if `is_reminder_number_locked` is true and `whatsapp_number` differs. | **Blocked** |
| User queries timetables of classes they haven't joined | Client-side lists empty | `timetable` select policy checks class membership. Return count is empty. | **Blocked** |
