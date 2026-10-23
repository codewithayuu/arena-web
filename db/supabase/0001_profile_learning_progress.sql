-- Clerk-owned member profile fields and self-reported learning progress.
-- Apply this migration to the Supabase project before enabling the API routes.

create table if not exists public.profile_details (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 80),
  second_name text not null default '' check (char_length(second_name) <= 80),
  bio text not null default '' check (char_length(bio) <= 500),
  country text not null default '' check (char_length(country) <= 100),
  college text not null default '' check (char_length(college) <= 200),
  degree text not null default '' check (char_length(degree) <= 120),
  branch text not null default '' check (char_length(branch) <= 120),
  image_url text not null default '' check (char_length(image_url) <= 2048),
  year_of_graduation integer not null default 0 check (year_of_graduation between 0 and 2200),
  job_preference integer not null default 0 check (job_preference between 0 and 10),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_key text not null check (char_length(item_key) between 1 and 160),
  status text not null check (status in ('started', 'completed', 'not_started')),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (profile_id, item_key),
  check ((status = 'completed') = (completed_at is not null))
);

alter table public.profile_details enable row level security;
alter table public.learning_progress enable row level security;

revoke all on public.profile_details from anon, authenticated;
revoke all on public.learning_progress from anon, authenticated;
grant all on public.profile_details to service_role;
grant all on public.learning_progress to service_role;
