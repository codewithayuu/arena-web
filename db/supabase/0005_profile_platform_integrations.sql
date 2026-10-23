alter table public.profile_platform_accounts
  drop constraint if exists profile_platform_accounts_platform_check;

alter table public.profile_platform_accounts
  add constraint profile_platform_accounts_platform_check
  check (platform in (
    'codeforces', 'leetcode', 'codechef', 'atcoder', 'geeksforgeeks',
    'codestudio', 'interviewbit', 'hackerrank', 'github'
  ));

alter table public.profile_platform_accounts
  add column if not exists profile_stats jsonb not null default '{}'::jsonb;
