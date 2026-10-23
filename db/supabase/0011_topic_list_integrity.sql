-- Explicit skipped-topic state and single-use profile verification challenges.
alter table public.learning_progress
  drop constraint if exists learning_progress_status_check;

alter table public.learning_progress
  add constraint learning_progress_status_check
  check (status in ('started', 'completed', 'skipped', 'not_started'));

create table if not exists public.profile_platform_verification_challenges (
  nonce text primary key check (char_length(nonce) = 32),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  clerk_user_id text not null check (char_length(clerk_user_id) between 1 and 255),
  platform text not null check (platform in ('codeforces', 'leetcode', 'codechef', 'atcoder', 'hackerrank')),
  handle text not null check (char_length(handle) between 1 and 100),
  challenge_code text not null check (char_length(challenge_code) = 10),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  check (expires_at > created_at)
);

create index if not exists profile_platform_challenges_expiry_idx
  on public.profile_platform_verification_challenges (expires_at)
  where consumed_at is null;

alter table public.profile_platform_verification_challenges enable row level security;
revoke all on public.profile_platform_verification_challenges from anon, authenticated;
grant all on public.profile_platform_verification_challenges to service_role;

create or replace function public.complete_profile_platform_verification(
  p_nonce text,
  p_clerk_user_id text,
  p_profile_id uuid,
  p_platform text,
  p_handle text,
  p_challenge_code text,
  p_total_questions_solved integer,
  p_current_rating integer,
  p_max_rating integer,
  p_rank text,
  p_profile_stats jsonb,
  p_verified_at timestamptz
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_challenge public.profile_platform_verification_challenges%rowtype;
begin
  select * into v_challenge
    from public.profile_platform_verification_challenges
   where nonce = p_nonce
   for update;

  if not found
     or v_challenge.consumed_at is not null
     or v_challenge.expires_at <= now()
     or v_challenge.clerk_user_id <> p_clerk_user_id
     or v_challenge.profile_id <> p_profile_id
     or v_challenge.platform <> p_platform
     or lower(v_challenge.handle) <> lower(p_handle)
     or v_challenge.challenge_code <> p_challenge_code then
    raise exception using errcode = 'P0001', message = 'verification_challenge_invalid_or_used';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_platform || ':' || lower(p_handle), 0));
  perform pg_advisory_xact_lock(hashtextextended(p_profile_id::text || ':' || p_platform, 1));

  if exists (
    select 1 from public.profile_platform_accounts a
     where a.platform = p_platform
       and lower(a.handle) = lower(p_handle)
       and a.profile_id <> p_profile_id
  ) then
    raise exception using errcode = '23505', message = 'platform_handle_already_linked';
  end if;

  update public.profile_platform_verification_challenges
     set consumed_at = now()
   where nonce = p_nonce;

  insert into public.profile_platform_accounts (
    profile_id, platform, handle, total_questions_solved, current_rating,
    max_rating, rank, profile_stats, verified_at, last_synced_at,
    sync_attempted_at, sync_error, updated_at
  ) values (
    p_profile_id, p_platform, p_handle, p_total_questions_solved, p_current_rating,
    p_max_rating, p_rank, coalesce(p_profile_stats, '{}'::jsonb), p_verified_at,
    p_verified_at, null, null, p_verified_at
  )
  on conflict (profile_id, platform) do update set
    handle = excluded.handle,
    total_questions_solved = excluded.total_questions_solved,
    current_rating = excluded.current_rating,
    max_rating = excluded.max_rating,
    rank = excluded.rank,
    profile_stats = excluded.profile_stats,
    verified_at = excluded.verified_at,
    last_synced_at = excluded.last_synced_at,
    sync_attempted_at = excluded.sync_attempted_at,
    sync_error = excluded.sync_error,
    updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.complete_profile_platform_verification(
  text, text, uuid, text, text, text, integer, integer, integer, text, jsonb, timestamptz
) from public, anon, authenticated;
grant execute on function public.complete_profile_platform_verification(
  text, text, uuid, text, text, text, integer, integer, integer, text, jsonb, timestamptz
) to service_role;
