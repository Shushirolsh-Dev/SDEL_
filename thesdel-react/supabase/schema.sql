-- Supabase SQL Schema for Thesdel App

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'member' check (role in ('member', 'assistant', 'representative')),
  phone text,
  plan text not null default 'free' check (plan in ('free', 'basic', 'premium')),
  whatsapp_number text,
  is_reminder_number_locked boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- CLASSES TABLE
create table if not exists public.classes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text not null unique,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for classes
alter table public.classes enable row level security;

-- CLASS MEMBERS TABLE
create table if not exists public.class_members (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('member', 'assistant')),
  created_at timestamp with time zone default now(),
  unique(class_id, user_id)
);

-- Enable RLS for class_members
alter table public.class_members enable row level security;

-- TIMETABLE TABLE
create table if not exists public.timetable (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  subject text not null,
  day_of_week integer not null check (day_of_week between 1 and 7),
  start_time text not null, -- "HH:MM"
  end_time text not null, -- "HH:MM"
  duration_minutes integer not null,
  venue text not null,
  original_venue text,
  venue_changed_at timestamp with time zone,
  is_cancelled boolean not null default false,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS for timetable
alter table public.timetable enable row level security;

-- ATTENDANCE LOGS TABLE
create table if not exists public.attendance_logs (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  timetable_entry_id uuid references public.timetable(id) on delete cascade not null,
  date text not null, -- "YYYY-MM-DD"
  status text not null check (status in ('attended', 'missed')),
  user_id uuid references public.profiles(id) on delete cascade not null,
  timestamp timestamp with time zone default now(),
  unique(timetable_entry_id, date, user_id)
);

-- Enable RLS for attendance_logs
alter table public.attendance_logs enable row level security;

-- UPDATES / ANNOUNCEMENTS TABLE
create table if not exists public.updates (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete null,
  user_name text not null,
  type text not null check (type in ('venue_change', 'cancellation', 'entry_added', 'entry_edited', 'entry_deleted')),
  description text not null,
  timestamp timestamp with time zone default now()
);

-- Enable RLS for updates
alter table public.updates enable row level security;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- PROFILES Policies
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- CLASSES Policies
create policy "Classes are viewable by all authenticated users"
  on public.classes for select
  to authenticated
  using (true);

create policy "Authenticated users can create classes"
  on public.classes for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "Only class owners can update classes"
  on public.classes for update
  to authenticated
  using (owner_id = auth.uid());

create policy "Only class owners can delete classes"
  on public.classes for delete
  to authenticated
  using (owner_id = auth.uid());

-- CLASS_MEMBERS Policies
create policy "Members list viewable by class members"
  on public.class_members for select
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and (owner_id = auth.uid() or exists (
        select 1 from public.class_members cm where cm.class_id = id and cm.user_id = auth.uid()
      ))
    )
  );

create policy "Users can join classes as a member"
  on public.class_members for insert
  to authenticated
  with check (user_id = auth.uid() and role = 'member');

create policy "Only class owners can update memberships"
  on public.class_members for update
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and owner_id = auth.uid()
    )
  );

create policy "Users can leave classes or owners can remove members"
  on public.class_members for delete
  to authenticated
  using (
    user_id = auth.uid() OR
    exists (
      select 1 from public.classes
      where id = class_id and owner_id = auth.uid()
    )
  );

-- TIMETABLE Policies
create policy "Timetable entries viewable by class members and owner"
  on public.timetable for select
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and (owner_id = auth.uid() or exists (
        select 1 from public.class_members cm where cm.class_id = id and cm.user_id = auth.uid()
      ))
    )
  );

create policy "Timetable modifications by representative"
  on public.timetable for all
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and owner_id = auth.uid()
    ) OR
    exists (
      select 1 from public.class_members
      where class_id = class_id and user_id = auth.uid() and role = 'assistant'
    )
  );

-- ATTENDANCE_LOGS Policies
create policy "Users can view their own attendance logs"
  on public.attendance_logs for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can log their own attendance if in class"
  on public.attendance_logs for insert
  to authenticated
  with check (
    user_id = auth.uid() AND
    (
      exists (
        select 1 from public.classes
        where id = class_id and owner_id = auth.uid()
      ) OR
      exists (
        select 1 from public.class_members
        where class_id = class_id and user_id = auth.uid()
      )
    )
  );

create policy "Users can modify their own attendance logs"
  on public.attendance_logs for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own attendance logs"
  on public.attendance_logs for delete
  to authenticated
  using (user_id = auth.uid());

-- UPDATES Policies
create policy "Class updates viewable by members and owner"
  on public.updates for select
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and (owner_id = auth.uid() or exists (
        select 1 from public.class_members cm where cm.class_id = id and cm.user_id = auth.uid()
      ))
    )
  );

create policy "Updates posted by representative or assistant"
  on public.updates for insert
  to authenticated
  with check (
    user_id = auth.uid() AND (
      exists (
        select 1 from public.classes
        where id = class_id and owner_id = auth.uid()
      ) OR
      exists (
        select 1 from public.class_members
        where class_id = class_id and user_id = auth.uid() and role = 'assistant'
      )
    )
  );


-- ==========================================
-- AUTOMATION TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger to copy newly registered auth.users into profiles automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, phone, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'member'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to prevent regular users from changing crucial profile fields
create or replace function public.check_profile_updates()
returns trigger as $$
begin
  -- Regular users cannot change their own role, plan, or locked state from the client
  if (OLD.role <> NEW.role) then
    raise exception 'Changing role directly is forbidden.';
  end if;
  if (OLD.plan <> NEW.plan) then
    raise exception 'Changing subscription plan directly is forbidden.';
  end if;
  if (OLD.is_reminder_number_locked <> NEW.is_reminder_number_locked) then
    raise exception 'Changing reminder lock status is forbidden.';
  end if;
  if (OLD.is_reminder_number_locked = true and OLD.whatsapp_number <> NEW.whatsapp_number) then
    raise exception 'Locked WhatsApp reminder number cannot be updated.';
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create or replace trigger enforce_profile_limits
  before update on public.profiles
  for each row execute procedure public.check_profile_updates();


-- PENDING REMOVALS TABLE
create table if not exists public.pending_removals (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  requested_by uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(class_id, user_id)
);

-- Enable RLS for pending_removals
alter table public.pending_removals enable row level security;

-- PENDING REMOVALS Policies
create policy "Pending removals are viewable by class members"
  on public.pending_removals for select
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and (owner_id = auth.uid() or exists (
        select 1 from public.class_members cm where cm.class_id = id and cm.user_id = auth.uid()
      ))
    )
  );

create policy "Assistants can request member removal"
  on public.pending_removals for insert
  to authenticated
  with check (
    exists (
      select 1 from public.class_members
      where class_id = class_id and user_id = auth.uid() and role = 'assistant'
    )
  );

create policy "Only class owners can manage pending removals"
  on public.pending_removals for delete
  to authenticated
  using (
    exists (
      select 1 from public.classes
      where id = class_id and owner_id = auth.uid()
    )
  );


-- ==========================================
-- SUBSCRIPTION PRICING TABLE (USD BASE)
-- ==========================================

create table if not exists public.subscription_prices (
  plan text primary key check (plan in ('basic', 'premium')),
  price_usd numeric(10,2) not null,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.subscription_prices enable row level security;

-- Insert default prices if not exists
insert into public.subscription_prices (plan, price_usd)
values 
  ('basic', 1.00),
  ('premium', 3.00)
on conflict (plan) do nothing;

-- Pricing select policy (anyone can read the prices)
create policy "Prices are viewable by everyone"
  on public.subscription_prices for select
  to authenticated, anon
  using (true);


