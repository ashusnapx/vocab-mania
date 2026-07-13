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
  folder_settings jsonb default '{}'::jsonb,
  xp integer default 0,
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

create policy "Users can update own vault"
  on public.memory_vault for update
  using (auth.uid() = user_id);

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
-- HOMONYM PAIRS (static, seeded from docx)
-- ============================================================
create table public.homonym_pairs (
  id integer primary key,
  word1 text not null,
  pos1 text,
  meaning1 text,
  hindi1 text,
  word2 text not null,
  pos2 text,
  meaning2 text,
  hindi2 text,
  created_at timestamptz default now()
);

alter table public.homonym_pairs enable row level security;

create policy "Anyone can read homonym pairs"
  on public.homonym_pairs for select
  using (true);

-- ============================================================
-- HOMONYM QUESTIONS (static, seeded from docx)
-- ============================================================
create table public.homonym_questions (
  id integer primary key,
  question text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  answer text,
  pair_id integer references public.homonym_pairs(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.homonym_questions enable row level security;

create policy "Anyone can read homonym questions"
  on public.homonym_questions for select
  using (true);

-- ============================================================
-- USER HOMONYM PROGRESS
-- ============================================================
create table public.user_homonym_progress (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  pair_id integer references public.homonym_pairs(id) on delete cascade not null,
  status text default 'learning' check (status in ('learning', 'mastered', 'vaulted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, pair_id)
);

alter table public.user_homonym_progress enable row level security;

create policy "Users can view own homonym progress"
  on public.user_homonym_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own homonym progress"
  on public.user_homonym_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own homonym progress"
  on public.user_homonym_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own homonym progress"
  on public.user_homonym_progress for delete
  using (auth.uid() = user_id);

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
create index idx_homonym_questions_pair_id on public.homonym_questions(pair_id);
create index idx_user_homonym_progress_user_id on public.user_homonym_progress(user_id);
create index idx_user_homonym_progress_status on public.user_homonym_progress(user_id, status);

-- ============================================================
-- IDIOMS (static, seeded from docx)
-- ============================================================
create table public.idioms (
  id integer primary key,
  idiom text not null,
  meaning text not null,
  hindi text,
  type text,
  created_at timestamptz default now()
);

alter table public.idioms enable row level security;

create policy "Anyone can read idioms"
  on public.idioms for select
  using (true);

-- ============================================================
-- IDIOM QUESTIONS (static, seeded from docx)
-- ============================================================
create table public.idiom_questions (
  id integer primary key,
  question text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  answer text,
  idiom_id integer references public.idioms(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.idiom_questions enable row level security;

create policy "Anyone can read idiom questions"
  on public.idiom_questions for select
  using (true);

-- ============================================================
-- USER IDIOM PROGRESS
-- ============================================================
create table public.user_idiom_progress (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  idiom_id integer references public.idioms(id) on delete cascade not null,
  status text default 'learning' check (status in ('learning', 'mastered', 'vaulted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, idiom_id)
);

alter table public.user_idiom_progress enable row level security;

create policy "Users can view own idiom progress"
  on public.user_idiom_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own idiom progress"
  on public.user_idiom_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own idiom progress"
  on public.user_idiom_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own idiom progress"
  on public.user_idiom_progress for delete
  using (auth.uid() = user_id);

-- ============================================================
-- IDIOM INDEXES
-- ============================================================
create index idx_idiom_questions_idiom_id on public.idiom_questions(idiom_id);
create index idx_user_idiom_progress_user_id on public.user_idiom_progress(user_id);
create index idx_user_idiom_progress_status on public.user_idiom_progress(user_id, status);

-- ============================================================
-- XP TRANSACTIONS (gamification tracking)
-- ============================================================
create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  net_amount integer not null,
  reason text not null,
  metadata jsonb,
  created_at timestamptz default now() not null
);

alter table public.xp_transactions enable row level security;

create policy "Users can view own transactions"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

create index idx_xp_transactions_user_created on public.xp_transactions(user_id, created_at);

-- ============================================================
-- SECURE XP AWARD RPC
-- ============================================================
create or replace function public.award_user_xp(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  new_xp integer,
  net_awarded integer,
  cap_hit boolean
)
language plpgsql
security definer
as $$
declare
  v_xp_today integer;
  v_net_amount integer;
  v_current_xp integer;
begin
  -- 1. Get total net XP awarded in the last 24 hours
  select coalesce(sum(net_amount), 0)
  into v_xp_today
  from public.xp_transactions
  where user_id = p_user_id
    and created_at >= (now() - interval '24 hours');

  -- 2. Calculate net amount based on daily rolling soft caps:
  -- 0 - 300 XP today: 100% rewards
  -- 300 - 600 XP today: 50% rewards
  -- 600+ XP today: 25% rewards
  if v_xp_today >= 600 then
    v_net_amount := greatest(1, floor(p_amount * 0.25)::integer);
  elsif v_xp_today >= 300 then
    declare
      v_portion_full integer;
      v_portion_half integer;
    begin
      v_portion_full := greatest(0, 300 - v_xp_today);
      if p_amount > v_portion_full then
        v_portion_half := p_amount - v_portion_full;
        v_net_amount := v_portion_full + greatest(1, floor(v_portion_half * 0.5)::integer);
      else
        v_net_amount := p_amount;
      end if;
    end;
  else
    declare
      v_portion_full integer;
      v_portion_half integer;
    begin
      v_portion_full := greatest(0, 300 - v_xp_today);
      if p_amount > v_portion_full then
        v_portion_half := p_amount - v_portion_full;
        if (v_xp_today + v_portion_full + v_portion_half) > 600 then
          declare
            v_portion_quarter integer;
          begin
            v_portion_quarter := (v_xp_today + p_amount) - 600;
            v_portion_half := 300 - v_portion_quarter;
            v_net_amount := v_portion_full + floor(v_portion_half * 0.5)::integer + greatest(1, floor(v_portion_quarter * 0.25)::integer);
          end;
        else
          v_net_amount := v_portion_full + greatest(1, floor(v_portion_half * 0.5)::integer);
        end if;
      else
        v_net_amount := p_amount;
      end if;
    end;
  end if;

  if v_net_amount <= 0 then
    v_net_amount := 1;
  end if;

  -- 3. Log the transaction
  insert into public.xp_transactions (user_id, amount, net_amount, reason, metadata)
  values (p_user_id, p_amount, v_net_amount, p_reason, p_metadata);

  -- 4. Update profiles.xp
  update public.profiles
  set xp = coalesce(xp, 0) + v_net_amount,
      updated_at = now()
  where id = p_user_id
  returning xp into v_current_xp;

  -- 5. Return updated details
  return query
  select 
    v_current_xp as new_xp, 
    v_net_amount as net_awarded, 
    (v_net_amount < p_amount) as cap_hit;
end;
$$;


