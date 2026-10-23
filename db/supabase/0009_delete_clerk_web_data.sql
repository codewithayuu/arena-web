-- Erase web-owned member data after Clerk account deletion. Keep the internal
-- profile UUID as a non-identifying tombstone for foreign keys owned by other
-- app areas (including contest records).
create or replace function public.delete_clerk_web_data(
  p_clerk_user_id text,
  p_profile_id uuid,
  p_profile_handle text,
  p_rate_limit_keys text[] default array[]::text[]
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
begin
  if p_clerk_user_id is null or p_clerk_user_id !~ '^user_[A-Za-z0-9_-]{1,250}$' then
    raise exception 'Invalid Clerk user identity';
  end if;

  select id into v_profile_id
    from public.profiles
   where clerk_user_id = p_clerk_user_id
      or (id = p_profile_id
          and clerk_user_id is null
          and handle = p_profile_handle
          and display_name = 'Deleted member')
   order by case when clerk_user_id = p_clerk_user_id then 0 else 1 end
   limit 1
   for update;

  if v_profile_id is null then
    return false;
  end if;

  delete from public.profile_details where profile_id = v_profile_id;
  delete from public.profile_platform_accounts where profile_id = v_profile_id;
  delete from public.topic_favorites where profile_id = v_profile_id;
  delete from public.topic_list_activity where profile_id = v_profile_id;
  delete from public.topic_list_claps where profile_id = v_profile_id;
  delete from public.topic_list_checkins where profile_id = v_profile_id;
  delete from public.topic_suggestions where profile_id = v_profile_id;
  delete from public.learning_progress where profile_id = v_profile_id;
  delete from public.lesson_progress where user_id = v_profile_id;
  delete from public.profile_view_counts where profile_id = v_profile_id;

  delete from public.web_api_rate_limit_state
   where bucket_key = any(coalesce(p_rate_limit_keys, array[]::text[]));

  update public.profiles
     set clerk_user_id = null,
         handle = 'deleted_' || replace(v_profile_id::text, '-', ''),
         display_name = 'Deleted member'
   where id = v_profile_id;

  return true;
end;
$$;

revoke all on function public.delete_clerk_web_data(text, uuid, text, text[]) from public, anon, authenticated;
grant execute on function public.delete_clerk_web_data(text, uuid, text, text[]) to service_role;
