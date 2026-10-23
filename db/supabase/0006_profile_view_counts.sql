create table if not exists public.profile_view_counts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  view_count bigint not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.profile_view_counts enable row level security;
revoke all on public.profile_view_counts from anon, authenticated;
grant all on public.profile_view_counts to service_role;

create or replace function public.increment_profile_view_count(target_profile_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count bigint;
begin
  insert into public.profile_view_counts (profile_id, view_count, updated_at)
  values (target_profile_id, 1, now())
  on conflict (profile_id) do update
    set view_count = public.profile_view_counts.view_count + 1,
        updated_at = now()
  returning view_count into updated_count;

  return updated_count;
end;
$$;

revoke all on function public.increment_profile_view_count(uuid) from public, anon, authenticated;
grant execute on function public.increment_profile_view_count(uuid) to service_role;
