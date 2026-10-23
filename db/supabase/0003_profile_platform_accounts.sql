-- Verified external coding profiles belong to the Clerk-linked Supabase profile.
create table if not exists public.profile_platform_accounts (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('codeforces', 'leetcode')),
  handle text not null check (char_length(handle) between 1 and 100),
  total_questions_solved integer check (total_questions_solved is null or total_questions_solved >= 0),
  current_rating integer check (current_rating is null or current_rating >= 0),
  max_rating integer check (max_rating is null or max_rating >= 0),
  rank text check (rank is null or char_length(rank) <= 100),
  verified_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, platform)
);

alter table public.profile_platform_accounts enable row level security;
revoke all on public.profile_platform_accounts from anon, authenticated;
grant all on public.profile_platform_accounts to service_role;
