-- Member-owned practice sessions and personalized learning plans.
-- Access is mediated by Clerk-authenticated server routes using the service role.

create table if not exists public.member_practice_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  question_count smallint not null check (question_count between 1 and 30),
  timer_minutes smallint not null default 0 check (timer_minutes between 0 and 240),
  filters jsonb not null default '{}'::jsonb check (jsonb_typeof(filters) = 'object'),
  problem_ids jsonb not null check (
    jsonb_typeof(problem_ids) = 'array'
    and jsonb_array_length(problem_ids) between 1 and 30
  ),
  created_at timestamptz not null default now()
);

create index if not exists member_practice_sessions_profile_created_idx
  on public.member_practice_sessions (profile_id, created_at desc);

create table if not exists public.member_personalized_roadmaps (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  primary_path text not null check (primary_path in ('DSA-focused', 'Development-focused', 'Balanced')),
  total_weeks smallint not null check (total_weeks between 1 and 104),
  total_hours integer not null check (total_hours between 1 and 20000),
  quiz_answers jsonb not null check (jsonb_typeof(quiz_answers) = 'object'),
  generated_plan jsonb not null check (jsonb_typeof(generated_plan) = 'object'),
  completed_phases integer[] not null default '{}'::integer[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(completed_phases) <= 12)
);

create index if not exists member_personalized_roadmaps_profile_updated_idx
  on public.member_personalized_roadmaps (profile_id, updated_at desc);

alter table public.member_practice_sessions enable row level security;
alter table public.member_personalized_roadmaps enable row level security;

revoke all on public.member_practice_sessions from public, anon, authenticated;
revoke all on public.member_personalized_roadmaps from public, anon, authenticated;
grant all on public.member_practice_sessions to service_role;
grant all on public.member_personalized_roadmaps to service_role;

-- Clerk deletion anonymizes the internal profile row instead of deleting it.
-- Remove these new member-owned records when that anonymization occurs.
create or replace function public.cleanup_member_learning_data_on_clerk_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.clerk_user_id is not null and new.clerk_user_id is null then
    delete from public.member_practice_sessions where profile_id = old.id;
    delete from public.member_personalized_roadmaps where profile_id = old.id;
  end if;
  return new;
end;
$$;

revoke all on function public.cleanup_member_learning_data_on_clerk_delete() from public, anon, authenticated;

drop trigger if exists cleanup_member_learning_data_on_clerk_delete on public.profiles;
create trigger cleanup_member_learning_data_on_clerk_delete
  after update of clerk_user_id on public.profiles
  for each row
  execute function public.cleanup_member_learning_data_on_clerk_delete();
