-- ============================================================
-- VOCAB MANIA — Database Schema
-- Supabase / PostgreSQL
-- ============================================================
-- UUID v7 is generated application-side via src/lib/id.ts
-- All id columns are plain uuid with NO default generation.

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  auth_provider text default 'email' check (auth_provider in ('email', 'google')),
  onboarding_completed boolean default false,
  daily_goal integer default 10 check (daily_goal between 5 and 50),
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, auth_provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    case
      when new.raw_user_meta_data->>'provider' = 'google' then 'google'
      else 'email'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- WORDS (static vocabulary database)
-- ============================================================
create table public.words (
  id text primary key,
  word text not null,
  pronunciation text,
  part_of_speech text check (part_of_speech in ('noun', 'verb', 'adjective', 'adverb')),
  meaning text not null,
  hindi_meaning text,
  example text,
  synonyms text[] default '{}',
  antonyms text[] default '{}',
  root text,
  category text check (category in ('emotions', 'actions', 'descriptions', 'academic', 'social', 'legal', 'economy', 'nature')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  frequency integer check (frequency between 1 and 5),
  years_asked integer[] default '{}',
  created_at timestamptz default now()
);

alter table public.words enable row level security;

create policy "Anyone can read words"
  on public.words for select
  using (true);

-- ============================================================
-- USER PROGRESS (per-word SRS data)
-- ============================================================
create table public.user_progress (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id text references public.words(id) on delete cascade not null,
  status text default 'new' check (status in ('new', 'learning', 'reviewing', 'mastered')),
  ease_factor real default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  times_correct integer default 0,
  times_incorrect integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, word_id)
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- ============================================================
-- MEMORY VAULT
-- ============================================================
create table public.memory_vault (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id text references public.words(id) on delete cascade not null,
  added_at timestamptz default now(),
  unique(user_id, word_id)
);

alter table public.memory_vault enable row level security;

create policy "Users can view own vault"
  on public.memory_vault for select
  using (auth.uid() = user_id);

create policy "Users can add to own vault"
  on public.memory_vault for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own vault"
  on public.memory_vault for delete
  using (auth.uid() = user_id);

-- ============================================================
-- LEARNING SESSIONS
-- ============================================================
create table public.learning_sessions (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  session_type text default 'learn' check (session_type in ('learn', 'review')),
  words_seen integer default 0,
  words_correct integer default 0,
  words_incorrect integer default 0,
  duration_seconds integer default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.learning_sessions enable row level security;

create policy "Users can view own sessions"
  on public.learning_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.learning_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.learning_sessions for update
  using (auth.uid() = user_id);

-- ============================================================
-- SESSION WORDS (individual card interactions)
-- ============================================================
create table public.session_words (
  id uuid primary key,
  session_id uuid references public.learning_sessions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id text references public.words(id) on delete cascade not null,
  action text check (action in ('know', 'dont_know', 'vault')),
  response_time_ms integer,
  created_at timestamptz default now()
);

alter table public.session_words enable row level security;

create policy "Users can view own session words"
  on public.session_words for select
  using (auth.uid() = user_id);

create policy "Users can insert own session words"
  on public.session_words for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_word_id on public.user_progress(word_id);
create index idx_user_progress_next_review on public.user_progress(user_id, next_review_at);
create index idx_user_progress_status on public.user_progress(user_id, status);
create index idx_memory_vault_user_id on public.memory_vault(user_id);
create index idx_learning_sessions_user_id on public.learning_sessions(user_id);
create index idx_session_words_session_id on public.session_words(session_id);
create index idx_words_category on public.words(category);
create index idx_words_difficulty on public.words(difficulty);
create index idx_words_frequency on public.words(frequency);
