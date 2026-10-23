alter table public.profile_platform_accounts
  add column if not exists last_synced_at timestamptz,
  add column if not exists sync_attempted_at timestamptz,
  add column if not exists sync_error text check (sync_error is null or char_length(sync_error) <= 200);

create index if not exists profile_platform_accounts_sync_due_idx
  on public.profile_platform_accounts (sync_attempted_at nulls first, profile_id, platform);
