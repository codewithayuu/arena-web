-- Private signup profile fields collected during Clerk account creation.
-- The web API accesses this table with the server-only Supabase service role.

alter table public.profile_details
  add column if not exists signup_username text,
  add column if not exists enrollment_number text,
  add column if not exists institution_name text,
  add column if not exists academic_program text,
  add column if not exists year_of_study smallint,
  add column if not exists gender text,
  add column if not exists mobile_number text,
  add column if not exists signup_profile_synced_at timestamptz;

alter table public.profile_details
  add constraint profile_details_signup_username_length
    check (signup_username is null or char_length(signup_username) between 1 and 100),
  add constraint profile_details_enrollment_number_length
    check (enrollment_number is null or char_length(btrim(enrollment_number)) between 1 and 80),
  add constraint profile_details_institution_name_length
    check (institution_name is null or char_length(institution_name) <= 200),
  add constraint profile_details_academic_program_length
    check (academic_program is null or char_length(btrim(academic_program)) between 1 and 120),
  add constraint profile_details_year_of_study_range
    check (year_of_study is null or year_of_study between 1 and 6),
  add constraint profile_details_gender_values
    check (gender is null or gender in ('male', 'female')),
  add constraint profile_details_mobile_number_e164
    check (mobile_number is null or mobile_number ~ '^\+[1-9][0-9]{7,14}$');

comment on column public.profile_details.enrollment_number is
  'Self-reported enrollment identifier; private and not identity-verified.';
comment on column public.profile_details.mobile_number is
  'Self-reported E.164 mobile number; no SMS verification is implied.';
comment on column public.profile_details.gender is
  'Optional self-reported gender value; null means not provided.';
comment on column public.profile_details.signup_profile_synced_at is
  'Set once when validated Clerk signup metadata has been copied into the private profile row.';
