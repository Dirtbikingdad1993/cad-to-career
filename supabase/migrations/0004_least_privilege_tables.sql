-- Tighten privileges: Supabase default grants in public may otherwise
-- give authenticated roles broad table privileges even while RLS denies rows.
-- This is defense-in-depth; all official assessment writes stay server-side.
revoke all privileges on table
  public.student_profiles, public.exercise_confirmations,
  public.quiz_results, public.project_submissions, public.project_reviews,
  public.certificates, public.cloud_workspaces, public.reviewer_memberships
from public, anon, authenticated;

grant select, insert, update on public.student_profiles to authenticated;
grant select, insert, update on public.exercise_confirmations to authenticated;
grant select on public.quiz_results to authenticated;
grant select, insert on public.project_submissions to authenticated;
grant select on public.project_reviews to authenticated;
grant select on public.certificates to authenticated;
grant select, insert, update on public.cloud_workspaces to authenticated;
-- reviewer_memberships intentionally has NO authenticated grants.

-- Reduce future mistakes from default privileges on new public tables.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated, public;
