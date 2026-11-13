-- Reviewer decisions must be atomic to avoid simultaneous/conflicting
-- approvals. Function is callable ONLY by the trusted service_role.
-- Client students and anonymous visitors have no EXECUTE permission.
create or replace function public.cad_finish_review(
  p_submission_id uuid,
  p_reviewer_id uuid,
  p_verdict text,
  p_score integer,
  p_feedback text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $body$
declare
  submission public.project_submissions%rowtype;
  required_score integer;
begin
  if p_verdict not in ('approved','changes_requested','rejected')
    or p_score is null or p_score < 0 or p_score > 100
  then raise exception 'Invalid review decision or score' using errcode='22023';
  end if;
  if not exists (select 1 from public.reviewer_memberships where user_id=p_reviewer_id)
  then raise exception 'Reviewer membership required' using errcode='42501';
  end if;
  select * into submission
    from public.project_submissions
    where id=p_submission_id for update;
  if not found or submission.project_id not between 2 and 5
     or submission.status <> 'needs_review'
  then raise exception 'Submission is not reviewable' using errcode='22023';
  end if;
  if submission.user_id = p_reviewer_id
  then raise exception 'Reviewer cannot approve own work' using errcode='42501';
  end if;
  required_score := case when submission.project_id=5 then 85 else 80 end;
  if p_verdict='approved' and p_score < required_score
  then raise exception 'Score below approval threshold' using errcode='22023';
  end if;
  insert into public.project_reviews(submission_id, reviewer_id, score, verdict, rubric, feedback)
  values (p_submission_id,p_reviewer_id,p_score,p_verdict,'{"version":"rubric-v1"}'::jsonb,left(coalesce(p_feedback,''),2500));
  update public.project_submissions
  set status=p_verdict, score=p_score,
      reviewed_at=now(), reviewer_id=p_reviewer_id
  where id=p_submission_id;
  return jsonb_build_object(
    'id',p_submission_id, 'verdict',p_verdict, 'score',p_score,
    'reviewer_id',p_reviewer_id);
end
$body$;

revoke all on function public.cad_finish_review(uuid,uuid,text,integer,text)
  from public, anon, authenticated;
grant execute on function public.cad_finish_review(uuid,uuid,text,integer,text)
  to service_role;
