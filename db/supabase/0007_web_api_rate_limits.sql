-- Shared per-actor rate-limit state for web API routes running on serverless hosts.
create table if not exists public.web_api_rate_limit_state (
  bucket_key text primary key check (bucket_key ~ '^[0-9a-f]{64}$'),
  window_start bigint not null,
  request_count integer not null check (request_count >= 1),
  updated_at timestamptz not null default now()
);

alter table public.web_api_rate_limit_state enable row level security;
revoke all on public.web_api_rate_limit_state from anon, authenticated;
grant all on public.web_api_rate_limit_state to service_role;

create or replace function public.consume_web_api_rate_limit(
  p_bucket_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start bigint;
  v_request_count integer;
  v_recorded_window bigint;
begin
  if p_bucket_key !~ '^[0-9a-f]{64}$'
     or p_max_requests < 1 or p_max_requests > 10000
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid API rate-limit parameters';
  end if;

  v_window_start := floor(extract(epoch from clock_timestamp()) / p_window_seconds)::bigint * p_window_seconds;

  insert into public.web_api_rate_limit_state (bucket_key, window_start, request_count, updated_at)
  values (p_bucket_key, v_window_start, 1, clock_timestamp())
  on conflict (bucket_key) do update
    set window_start = case
          when web_api_rate_limit_state.window_start <> v_window_start then v_window_start
          else web_api_rate_limit_state.window_start
        end,
        request_count = case
          when web_api_rate_limit_state.window_start <> v_window_start then 1
          when web_api_rate_limit_state.request_count < p_max_requests then web_api_rate_limit_state.request_count + 1
          else web_api_rate_limit_state.request_count
        end,
        updated_at = clock_timestamp()
  returning request_count, window_start into v_request_count, v_recorded_window;

  return v_recorded_window = v_window_start and v_request_count <= p_max_requests;
end;
$$;

revoke all on function public.consume_web_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_web_api_rate_limit(text, integer, integer) to service_role;
