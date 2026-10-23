-- Server-owned presence and member lesson notebook data.
-- Clerk is the only identity provider; API routes resolve profile_id from the
-- authenticated Clerk user and use the service role server-side.

create table if not exists public.member_presence (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen_at timestamptz not null default now()
);

create index if not exists member_presence_last_seen_idx
  on public.member_presence (last_seen_at desc);

create or replace function public.list_active_member_presence(p_since timestamptz, p_limit integer default 100)
returns table (active_count bigint, handle text, display_name text, image_url text)
language sql
stable
set search_path = public
as $$
  with active_members as (
    select profiles.handle,
           profiles.display_name,
           coalesce(profile_details.image_url, '') as image_url,
           member_presence.last_seen_at
      from public.member_presence
      join public.profiles on profiles.id = member_presence.profile_id
      left join public.profile_details on profile_details.profile_id = profiles.id
     where member_presence.last_seen_at >= p_since
       and profiles.clerk_user_id is not null
  )
  select count(*) over ()::bigint,
         active_members.handle,
         active_members.display_name,
         active_members.image_url
    from active_members
   order by active_members.last_seen_at desc, active_members.handle asc
   limit least(greatest(coalesce(p_limit, 100), 1), 100);
$$;

create table if not exists public.learning_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  notebook_name text not null default 'DSA'
    check (char_length(notebook_name) between 1 and 80),
  lesson_key text not null check (char_length(lesson_key) between 1 and 160),
  title text not null check (char_length(title) between 1 and 120),
  content text not null default '' check (char_length(content) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learning_notes_profile_notebook_updated_idx
  on public.learning_notes (profile_id, notebook_name, updated_at desc);

create table if not exists public.learning_bookmarks (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lesson_key text not null check (char_length(lesson_key) between 1 and 160),
  created_at timestamptz not null default now(),
  primary key (profile_id, lesson_key)
);

-- Clerk deletion keeps a non-identifying profile tombstone for other app areas.
-- Remove this migration's account-owned rows when the webhook detaches identity.
create or replace function public.cleanup_deleted_member_learning_data()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.member_presence where profile_id = new.id;
  delete from public.learning_notes where profile_id = new.id;
  delete from public.learning_bookmarks where profile_id = new.id;
  return new;
end;
$$;

revoke all on function public.cleanup_deleted_member_learning_data() from public, anon, authenticated;
grant execute on function public.cleanup_deleted_member_learning_data() to service_role;

drop trigger if exists cleanup_deleted_member_learning_data on public.profiles;
create trigger cleanup_deleted_member_learning_data
  after update of clerk_user_id on public.profiles
  for each row
  when (old.clerk_user_id is not null and new.clerk_user_id is null)
  execute function public.cleanup_deleted_member_learning_data();

alter table public.member_presence enable row level security;
alter table public.learning_notes enable row level security;
alter table public.learning_bookmarks enable row level security;

revoke all on public.member_presence, public.learning_notes,
  public.learning_bookmarks from anon, authenticated;
grant all on public.member_presence, public.learning_notes,
  public.learning_bookmarks to service_role;
revoke all on function public.list_active_member_presence(timestamptz, integer)
  from public, anon, authenticated;
grant execute on function public.list_active_member_presence(timestamptz, integer)
  to service_role;
