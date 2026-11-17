-- Upload first, then submit. A submitted directory is immutable to the learner;
-- returned/rejected evidence can be removed, but revisions use a new submission.
-- These policies do not delete existing files or change private read access.
alter policy "Upload own evidence" on storage.objects
with check (
  bucket_id = 'cad-submissions'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-[a-zA-Z0-9._-]{1,100}$'
  and not exists (
    select 1 from public.project_submissions s
    where s.user_id = (select auth.uid())
      and s.id::text = split_part(name, '/', 2)
  )
);

alter policy "Remove own evidence" on storage.objects
using (
  bucket_id = 'cad-submissions'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and not exists (
    select 1 from public.project_submissions s
    where s.user_id = (select auth.uid())
      and s.id::text = split_part(name, '/', 2)
      and s.status in ('needs_review', 'approved')
  )
);

-- Require the same 2–8 distinct, already-uploaded files as the learner UI.
-- A forged path cannot cause a service-role reviewer request to sign another
-- learner's object. Project 1 remains exclusively server assessed.
alter policy "Submit owned project for review" on public.project_submissions
with check (
  (select auth.uid()) = user_id
  and project_id between 2 and 5
  and status = 'needs_review'
  and reviewer_id is null and score is null and reviewed_at is null
  and cardinality(evidence_paths) between 2 and 8
  and cardinality(evidence_paths) = (select count(distinct evidence_path) from unnest(evidence_paths) as evidence_path)
  and not exists (
    select 1 from unnest(evidence_paths) as evidence_path
    where evidence_path is null
      or evidence_path !~ ('^' || user_id::text || '/' || id::text || '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}-[a-zA-Z0-9._-]{1,100}$')
      or not exists (
        select 1 from storage.objects o
        where o.bucket_id = 'cad-submissions' and o.name = evidence_path
      )
  )
);
