-- Additional server-controlled assessment integrity and reviewer membership
create unique index if not exists quiz_results_unique_version on public.quiz_results(user_id,lesson_id,assessment_version);
create table if not exists public.reviewer_memberships (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('reviewer','admin')),
 created_at timestamptz not null default now()
);
alter table public.reviewer_memberships enable row level security;
revoke all on public.reviewer_memberships from anon,authenticated;
grant select on public.reviewer_memberships to service_role;
create index if not exists project_reviews_reviewer_idx on public.project_reviews(reviewer_id);
create index if not exists project_submissions_reviewer_idx on public.project_submissions(reviewer_id);
-- Allow users to delete mistakenly uploaded private evidence and recover space.
create policy "Remove own evidence" on storage.objects for delete to authenticated
 using (bucket_id='cad-submissions' and (storage.foldername(name))[1]=(select auth.uid())::text);
