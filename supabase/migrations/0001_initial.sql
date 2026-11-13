-- CAD to Career: initial secure data model (not applied until Supabase provisioned).
-- Production migrations require review and tests in a staging database.
begin;
create extension if not exists pgcrypto;

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  handle text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handle_format check (handle is null or handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  constraint name_length check (char_length(display_name)<=80)
);
create table if not exists public.exercise_confirmations (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check(lesson_id between 1 and 20),
  confirmed_at timestamptz not null default now(),
  primary key(user_id,lesson_id)
);
-- Results written exclusively by a trusted assessment service, never by a browser.
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id integer not null check(lesson_id between 1 and 20),
  assessment_version text not null,
  score integer not null check(score between 0 and 100),
  passed boolean not null,
  taken_at timestamptz not null default now()
);
create index if not exists quiz_results_user_lesson_idx on public.quiz_results(user_id,lesson_id,taken_at desc);

create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id integer not null check(project_id between 1 and 5),
  status text not null default 'needs_review' check(status in ('needs_review','approved','changes_requested','rejected')),
  submitted_notes text not null default '' check(char_length(submitted_notes)<=12000),
  evidence_paths text[] not null default '{}'::text[],
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references auth.users(id),
  score integer check(score between 0 and 100),
  constraint approved_requires_score check(status <> 'approved' or score is not null)
);
create index if not exists project_submissions_user_idx on public.project_submissions(user_id,submitted_at desc);

-- No direct client write access. The reviewer service must look up role in
-- private reviewer membership records, then perform a transaction.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;
create table if not exists app_private.reviewers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on app_private.reviewers from public, anon, authenticated;

create table if not exists public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.project_submissions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id),
  score integer not null check(score between 0 and 100),
  verdict text not null check(verdict in ('approved','changes_requested','rejected')),
  rubric jsonb not null default '{}'::jsonb,
  feedback text not null default '',
  reviewed_at timestamptz not null default now()
);
create index if not exists reviews_by_submission_idx on public.project_reviews(submission_id);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_code text not null default 'cad-foundations',
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  public_name text not null check(char_length(public_name) between 1 and 80),
  unique(user_id,program_code)
);
create index if not exists cert_issued_idx on public.certificates(issued_at desc);

-- Enable RLS on every API-exposed table. Default deny.
alter table public.student_profiles enable row level security;
alter table public.exercise_confirmations enable row level security;
alter table public.quiz_results enable row level security;
alter table public.project_submissions enable row level security;
alter table public.project_reviews enable row level security;
alter table public.certificates enable row level security;

create policy "Read own or opted-in profiles" on public.student_profiles
 for select to authenticated using ((select auth.uid())=user_id or is_public);
create policy "Create own profile" on public.student_profiles
 for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Edit own profile" on public.student_profiles
 for update to authenticated using ((select auth.uid())=user_id)
 with check ((select auth.uid())=user_id);
create policy "Read own lesson confirmations" on public.exercise_confirmations
 for select to authenticated using ((select auth.uid())=user_id);
create policy "Confirm own lesson exercise" on public.exercise_confirmations
 for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own lesson exercise" on public.exercise_confirmations
 for update to authenticated using ((select auth.uid())=user_id)
 with check ((select auth.uid())=user_id);
create policy "Read own quiz results" on public.quiz_results
 for select to authenticated using ((select auth.uid())=user_id);
create policy "Read own project submissions" on public.project_submissions
 for select to authenticated using ((select auth.uid())=user_id);
-- Advanced submissions can be uploaded to the needs_review queue only;
-- no client update is possible, including status/score/reviewer fields.
create policy "Submit owned project for review" on public.project_submissions
 for insert to authenticated with check (
   (select auth.uid())=user_id and status='needs_review'
   and reviewer_id is null and score is null and reviewed_at is null
 );
create policy "Read own submission review" on public.project_reviews
 for select to authenticated
 using(exists(select 1 from public.project_submissions s
              where s.id=submission_id and s.user_id=(select auth.uid())));
create policy "Read own certificate" on public.certificates
 for select to authenticated using ((select auth.uid())=user_id);
-- No INSERT/UPDATE/DELETE policies on server-grade or certificate tables.

-- Grant narrowly scoped data API table access; RLS still restricts rows.
grant select,insert,update on public.student_profiles to authenticated;
grant select,insert,update on public.exercise_confirmations to authenticated;
grant select on public.quiz_results to authenticated;
grant select,insert on public.project_submissions to authenticated;
grant select on public.project_reviews to authenticated;
grant select on public.certificates to authenticated;
revoke all on public.student_profiles, public.exercise_confirmations, public.quiz_results,
  public.project_submissions, public.project_reviews, public.certificates from anon;

-- Submissions storage bucket is private. A signed-in user can only store
-- assets beneath "<user-uuid>/<submission-uuid>/...".
insert into storage.buckets(id,name,public,file_size_limit)
values('cad-submissions','cad-submissions',false,52428800)
on conflict(id) do nothing;

create policy "Upload own evidence" on storage.objects for insert to authenticated
with check (
 bucket_id='cad-submissions'
 and (storage.foldername(name))[1]=(select auth.uid())::text
 and array_length(storage.foldername(name),1)>=2
);
create policy "Read own evidence" on storage.objects for select to authenticated
using(bucket_id='cad-submissions'
 and (storage.foldername(name))[1]=(select auth.uid())::text);
-- A trusted backend must validate file signatures, sizes, and evidence ownership.
commit;
