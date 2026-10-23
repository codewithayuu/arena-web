-- Aggregate the global learning leaderboard inside Postgres and return only the
-- requested top 20 rows to the web server.
drop function if exists public.get_topic_list_leaderboard(text, jsonb, jsonb);

create function public.get_topic_list_leaderboard(
  p_sort text,
  p_category_topic_ids jsonb,
  p_aura_constants jsonb,
  p_valid_item_keys jsonb
)
returns table (
  handle text,
  display_name text,
  active_days bigint,
  completions bigint,
  aura bigint,
  score numeric
)
language sql
security definer
set search_path = public
as $$
  with activity as (
    select a.profile_id, count(distinct a.activity_date)::bigint as active_days
      from public.topic_list_activity a
     group by a.profile_id
  ),
  valid_item_keys as (
    select item_key
      from jsonb_array_elements_text(coalesce(p_valid_item_keys, '[]'::jsonb)) item(item_key)
  ),
  progress as (
    select lp.profile_id,
           count(*) filter (where lp.status = 'completed')::bigint as completions,
           count(*) filter (where lp.status = 'started' and lp.item_key like 'topic:%')::bigint as practicing_topics,
           count(*) filter (where lp.status = 'completed' and lp.item_key like 'problem:%')::bigint as solved_problems,
           coalesce(
             array_agg(distinct substring(lp.item_key from 7))
               filter (where lp.status = 'completed' and lp.item_key like 'topic:%'),
             array[]::text[]
           ) as completed_topic_ids
      from public.learning_progress lp
      join valid_item_keys valid on valid.item_key = lp.item_key
     group by lp.profile_id
  ),
  category_aura as (
    select p.profile_id,
           coalesce(sum(
             case
               when round(100.0 * coverage.completed_count / nullif(coverage.total_count, 0))
                    >= coalesce((p_aura_constants ->> 'CATEGORY_GOLD_PERCENT')::integer, 90)
                 then coalesce((p_aura_constants ->> 'CATEGORY_BRONZE_POINTS')::bigint, 256)
                    + coalesce((p_aura_constants ->> 'CATEGORY_SILVER_POINTS')::bigint, 512)
                    + coalesce((p_aura_constants ->> 'CATEGORY_GOLD_POINTS')::bigint, 1024)
               when round(100.0 * coverage.completed_count / nullif(coverage.total_count, 0))
                    >= coalesce((p_aura_constants ->> 'CATEGORY_SILVER_PERCENT')::integer, 60)
                 then coalesce((p_aura_constants ->> 'CATEGORY_BRONZE_POINTS')::bigint, 256)
                    + coalesce((p_aura_constants ->> 'CATEGORY_SILVER_POINTS')::bigint, 512)
               when round(100.0 * coverage.completed_count / nullif(coverage.total_count, 0))
                    >= coalesce((p_aura_constants ->> 'CATEGORY_BRONZE_PERCENT')::integer, 35)
                 then coalesce((p_aura_constants ->> 'CATEGORY_BRONZE_POINTS')::bigint, 256)
               else 0
             end
           ), 0)::bigint as badge_aura
      from progress p
      cross join lateral jsonb_array_elements(coalesce(p_category_topic_ids, '[]'::jsonb)) category(topic_ids)
      cross join lateral (
        select count(*)::integer as total_count,
               count(*) filter (where p.completed_topic_ids @> array[topic.topic_id])::integer as completed_count
          from jsonb_array_elements_text(category.topic_ids) topic(topic_id)
      ) coverage
     group by p.profile_id
  ),
  checkin_aura as (
    select c.profile_id, coalesce(sum(c.points_awarded), 0)::bigint as checkin_points
      from public.topic_list_checkins c
     group by c.profile_id
  ),
  raw as (
    select profile.handle,
           profile.display_name,
           coalesce(activity.active_days, 0)::bigint as active_days,
           coalesce(progress.completions, 0)::bigint as completions,
           (
             coalesce(cardinality(progress.completed_topic_ids), 0)::bigint
               * coalesce((p_aura_constants ->> 'TOPIC_COMPLETED_POINTS')::bigint, 96)
             + coalesce(progress.practicing_topics, 0)::bigint
               * coalesce((p_aura_constants ->> 'TOPIC_STARTED_POINTS')::bigint, 16)
             + coalesce(progress.solved_problems, 0)::bigint
               * coalesce((p_aura_constants ->> 'PROBLEM_SOLVED_POINTS')::bigint, 32)
             + coalesce(category_aura.badge_aura, 0)::bigint
             + coalesce(checkin_aura.checkin_points, 0)::bigint
           )::bigint as aura
      from public.profiles profile
      left join activity on activity.profile_id = profile.id
      left join progress on progress.profile_id = profile.id
      left join category_aura on category_aura.profile_id = profile.id
      left join checkin_aura on checkin_aura.profile_id = profile.id
  ),
  maxima as (
    select max(raw.active_days) as max_active_days,
           max(raw.completions) as max_completions,
           max(raw.aura) as max_aura
      from raw
  ),
  scored as (
    select raw.*,
           round((
             case when maxima.max_active_days > 0 then raw.active_days::numeric / maxima.max_active_days else 0 end
             + case when maxima.max_completions > 0 then raw.completions::numeric / maxima.max_completions else 0 end
             + case when maxima.max_aura > 0 then raw.aura::numeric / maxima.max_aura else 0 end
           ) * 100 / 3, 1) as score
      from raw cross join maxima
  )
  select scored.handle, scored.display_name, scored.active_days, scored.completions, scored.aura, scored.score
    from scored
   order by
     case when p_sort = 'active_days' then scored.active_days end desc nulls last,
     case when p_sort = 'completions' then scored.completions end desc nulls last,
     case when p_sort = 'aura' then scored.aura end desc nulls last,
     case when p_sort = 'score' or p_sort not in ('active_days', 'completions', 'aura') then scored.score end desc nulls last,
     scored.aura desc,
     scored.completions desc,
     scored.active_days desc,
     coalesce(scored.handle, '') asc
   limit 20;
$$;

revoke all on function public.get_topic_list_leaderboard(text, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.get_topic_list_leaderboard(text, jsonb, jsonb, jsonb) to service_role;
