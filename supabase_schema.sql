-- ============================================================
-- MindBridge — Complete Supabase Schema
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  language text default 'en',
  onboarding_done boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────
-- MOOD CHECK-INS
-- ──────────────────────────────────────────
create table if not exists mood_checkins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mood integer not null check (mood >= 1 and mood <= 5),
  emotions text[] default '{}',
  note text default '',
  created_at timestamptz default now()
);

create index if not exists idx_mood_checkins_user_id on mood_checkins(user_id);
create index if not exists idx_mood_checkins_created_at on mood_checkins(created_at desc);

-- ──────────────────────────────────────────
-- JOURNAL ENTRIES
-- ──────────────────────────────────────────
create table if not exists journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  mood integer check (mood >= 1 and mood <= 5),
  prompt text default '',
  ai_reflection text default '',
  created_at timestamptz default now()
);

create index if not exists idx_journal_entries_user_id on journal_entries(user_id);
create index if not exists idx_journal_entries_created_at on journal_entries(created_at desc);

-- ──────────────────────────────────────────
-- CHAT SESSIONS
-- ──────────────────────────────────────────
create table if not exists chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  messages jsonb not null default '[]',
  summary text default '',
  created_at timestamptz default now()
);

create index if not exists idx_chat_sessions_user_id on chat_sessions(user_id);

-- ──────────────────────────────────────────
-- BURNOUT ASSESSMENTS
-- ──────────────────────────────────────────
create table if not exists burnout_assessments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  answers jsonb not null,
  score integer not null,
  level text not null,
  created_at timestamptz default now()
);

create index if not exists idx_burnout_assessments_user_id on burnout_assessments(user_id);

-- ──────────────────────────────────────────
-- SAFETY PLANS
-- ──────────────────────────────────────────
create table if not exists safety_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  coping_strategies text default '',
  trusted_people text default '',
  safe_environment text default '',
  reasons_to_live text default '',
  updated_at timestamptz default now()
);

create unique index if not exists idx_safety_plans_user_id on safety_plans(user_id);

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- All users can only access their own data
-- ──────────────────────────────────────────
alter table profiles enable row level security;
alter table mood_checkins enable row level security;
alter table journal_entries enable row level security;
alter table chat_sessions enable row level security;
alter table burnout_assessments enable row level security;
alter table safety_plans enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Mood checkins policies
create policy "Users can view own checkins" on mood_checkins for select using (auth.uid() = user_id);
create policy "Users can insert own checkins" on mood_checkins for insert with check (auth.uid() = user_id);
create policy "Users can delete own checkins" on mood_checkins for delete using (auth.uid() = user_id);

-- Journal entries policies
create policy "Users can view own journal" on journal_entries for select using (auth.uid() = user_id);
create policy "Users can insert own journal" on journal_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own journal" on journal_entries for delete using (auth.uid() = user_id);

-- Chat sessions policies
create policy "Users can view own chats" on chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own chats" on chat_sessions for insert with check (auth.uid() = user_id);

-- Burnout policies
create policy "Users can view own burnout" on burnout_assessments for select using (auth.uid() = user_id);
create policy "Users can insert own burnout" on burnout_assessments for insert with check (auth.uid() = user_id);

-- Safety plan policies
create policy "Users can view own safety plan" on safety_plans for select using (auth.uid() = user_id);
create policy "Users can upsert own safety plan" on safety_plans for insert with check (auth.uid() = user_id);
create policy "Users can update own safety plan" on safety_plans for update using (auth.uid() = user_id);

-- ──────────────────────────────────────────
-- Enable Google & Apple OAuth in Supabase
-- (Do this in: Authentication → Providers)
-- ──────────────────────────────────────────
-- Google: paste your Google OAuth client ID + secret
-- Apple: paste your Apple Service ID + key

-- ✅ Schema setup complete!
