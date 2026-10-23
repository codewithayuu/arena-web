-- Account scoped topic-list state and community data.

create table if not exists public.topic_favorites (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('topic', 'problem')),
  item_key text not null check (char_length(item_key) between 1 and 160),
  created_at timestamptz not null default now(),
  primary key (profile_id, item_type, item_key)
);

create table if not exists public.topic_list_activity (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null,
  event_type text not null check (event_type in ('visit', 'topic_completed', 'problem_solved')),
  item_key text not null default '' check (char_length(item_key) <= 160),
  created_at timestamptz not null default now(),
  primary key (profile_id, activity_date, event_type, item_key)
);

create table if not exists public.topic_list_claps (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  topic_key text not null check (char_length(topic_key) between 1 and 160),
  clap_count integer not null default 0 check (clap_count between 0 and 999),
  updated_at timestamptz not null default now(),
  primary key (profile_id, topic_key)
);

create table if not exists public.topic_list_checkins (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  points_awarded integer not null default 0 check (points_awarded between 0 and 1000),
  created_at timestamptz not null default now(),
  primary key (profile_id, checkin_date)
);

create table if not exists public.topic_suggestions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  topic_id text not null check (char_length(topic_id) between 1 and 160),
  suggestion_type text not null check (suggestion_type in ('resource', 'template', 'problem')),
  title text not null check (char_length(title) between 3 and 180),
  description text not null default '' check (char_length(description) <= 2000),
  url text not null default '' check (char_length(url) <= 2048),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null
);

create index if not exists topic_suggestions_queue_idx
  on public.topic_suggestions (status, created_at desc);
create index if not exists topic_list_activity_profile_date_idx
  on public.topic_list_activity (profile_id, activity_date desc);
create index if not exists topic_favorites_community_lookup_idx
  on public.topic_favorites (item_type, item_key, profile_id);
create index if not exists learning_progress_community_lookup_idx
  on public.learning_progress (item_key, status, profile_id);

alter table public.topic_favorites enable row level security;
alter table public.topic_list_activity enable row level security;
alter table public.topic_list_claps enable row level security;
alter table public.topic_list_checkins enable row level security;
alter table public.topic_suggestions enable row level security;

revoke all on public.topic_favorites, public.topic_list_activity,
  public.topic_list_claps, public.topic_list_checkins, public.topic_suggestions
  from anon, authenticated;
grant all on public.topic_favorites, public.topic_list_activity,
  public.topic_list_claps, public.topic_list_checkins, public.topic_suggestions
  to service_role;

create or replace function public.increment_topic_list_clap(p_profile_id uuid, p_topic_key text)
returns table (user_clap_count integer, total_claps bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.topic_list_claps (profile_id, topic_key, clap_count, updated_at)
  values (p_profile_id, p_topic_key, 1, now())
  on conflict (profile_id, topic_key)
  do update set clap_count = least(topic_list_claps.clap_count + 1, 999), updated_at = now();

  return query
    select c.clap_count,
           (select coalesce(sum(all_claps.clap_count), 0)::bigint
              from public.topic_list_claps all_claps
             where all_claps.topic_key = p_topic_key)
      from public.topic_list_claps c
     where c.profile_id = p_profile_id and c.topic_key = p_topic_key;
end;
$$;

create or replace function public.claim_topic_list_checkin(p_profile_id uuid)
returns table (claimed boolean, current_streak integer, best_streak integer, total_checkins integer, points_awarded integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_inserted integer;
  v_current integer := 0;
  v_best integer := 0;
  v_total integer := 0;
  v_points integer := 0;
begin
  insert into public.topic_list_checkins (profile_id, checkin_date)
  values (p_profile_id, v_today)
  on conflict do nothing;
  get diagnostics v_inserted = row_count;

  select count(*)::integer into v_total
    from public.topic_list_checkins c
   where c.profile_id = p_profile_id;

  with dates as (
    select checkin_date,
           row_number() over (order by checkin_date desc) as seq
      from public.topic_list_checkins
     where profile_id = p_profile_id
  ),
  streak_groups as (
    select checkin_date, checkin_date + seq::integer as grp
      from dates
  ),
  streak_counts as (
    select count(*)::integer as streak
      from streak_groups
     group by grp
  )
  select coalesce(max(streak), 0)::integer into v_best
    from streak_counts;

  with recent as (
    select checkin_date,
           row_number() over (order by checkin_date desc) as seq
      from public.topic_list_checkins
     where profile_id = p_profile_id
       and checkin_date >= v_today - 1
  )
  select count(*)::integer into v_current
    from recent
   where checkin_date = v_today - (seq::integer - 1);

  if v_inserted = 1 then
    v_points := 25 + (5 * v_current);
    update public.topic_list_checkins
       set points_awarded = v_points
     where profile_id = p_profile_id and checkin_date = v_today;
  else
    select c.points_awarded into v_points
      from public.topic_list_checkins c
     where c.profile_id = p_profile_id and c.checkin_date = v_today;
  end if;

  return query select (v_inserted = 1), v_current, v_best, v_total, coalesce(v_points, 0);
end;
$$;

revoke all on function public.increment_topic_list_clap(uuid, text) from public, anon, authenticated;
revoke all on function public.claim_topic_list_checkin(uuid) from public, anon, authenticated;
grant execute on function public.increment_topic_list_clap(uuid, text) to service_role;
grant execute on function public.claim_topic_list_checkin(uuid) to service_role;

create or replace view public.topic_list_community_stats as
with topic_ids as (
  select substring(item_key from 7) as topic_id
    from public.learning_progress
   where item_key like 'topic:%' and status in ('started', 'completed')
  union
  select item_key as topic_id
    from public.topic_favorites
   where item_type = 'topic'
)
select ids.topic_id,
       (count(distinct p.profile_id) filter (where p.status = 'started'))::integer as practicing_count,
       (count(distinct p.profile_id) filter (where p.status = 'completed'))::integer as completed_count,
       count(distinct f.profile_id)::integer as favourite_count
  from topic_ids ids
  left join public.learning_progress p
    on p.item_key = 'topic:' || ids.topic_id and p.status in ('started', 'completed')
  left join public.topic_favorites f
    on f.item_type = 'topic' and f.item_key = ids.topic_id
 group by ids.topic_id;

create or replace view public.problem_community_stats as
with problem_ids as (
  select substring(item_key from 9) as problem_id
    from public.learning_progress
   where item_key like 'problem:%' and status = 'completed'
  union
  select item_key as problem_id
    from public.topic_favorites
   where item_type = 'problem'
)
select ids.problem_id,
       (count(distinct p.profile_id) filter (where p.status = 'completed'))::integer as solve_count,
       count(distinct f.profile_id)::integer as favorite_count
  from problem_ids ids
  left join public.learning_progress p
    on p.item_key = 'problem:' || ids.problem_id and p.status = 'completed'
  left join public.topic_favorites f
    on f.item_type = 'problem' and f.item_key = ids.problem_id
 group by ids.problem_id;

create or replace view public.topic_list_viewer_leaderboard as
select p.handle,
       p.display_name,
       count(distinct a.activity_date)::integer as active_days,
       max(a.activity_date) as last_active_date
  from public.topic_list_activity a
  join public.profiles p on p.id = a.profile_id
 where a.event_type in ('visit', 'topic_completed', 'problem_solved')
 group by p.id, p.handle, p.display_name;

create or replace view public.topic_list_clap_totals as
select topic_key, coalesce(sum(clap_count), 0)::bigint as total_claps
  from public.topic_list_claps
 group by topic_key;

grant select on public.topic_list_community_stats, public.topic_list_viewer_leaderboard,
  public.topic_list_clap_totals, public.problem_community_stats to service_role;
