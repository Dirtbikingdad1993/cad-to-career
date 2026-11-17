-- CAD to Career: official exam materials and answers stay in unexposed schema.
-- Do NOT add assessment answers to a public repository or browser bundle.
create table if not exists app_private.assessment_questions (
  question_key text primary key,
  assessment_version text not null,
  lesson_id integer not null check(lesson_id between 1 and 20),
  prompt text not null check(length(prompt) between 20 and 1000),
  options jsonb not null check (jsonb_typeof(options)='array' and jsonb_array_length(options)=3),
  correct_index integer not null check(correct_index between 0 and 2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists assessment_questions_lesson_version
 on app_private.assessment_questions(assessment_version, lesson_id, question_key);

create table if not exists app_private.quiz_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 assessment_version text not null,
 lesson_id integer not null check(lesson_id between 1 and 20),
 responses jsonb not null,
 score integer not null check(score between 0 and 100),
 passed boolean not null,
 created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_rate_limit
 on app_private.quiz_attempts(user_id, assessment_version, lesson_id, created_at desc);
alter table app_private.assessment_questions enable row level security;
alter table app_private.quiz_attempts enable row level security;
revoke all on app_private.assessment_questions, app_private.quiz_attempts from public, anon, authenticated;
grant select on app_private.assessment_questions to service_role;
grant select, insert on app_private.quiz_attempts to service_role;

-- Only trusted Edge Functions (service-role) may call these.
-- Not SECURITY DEFINER. Correct keys never go to the browser.
create or replace function public.cad_list_private_quiz(p_lesson_id integer)
returns jsonb
language plpgsql security invoker set search_path=''
as $$
declare result jsonb;
begin
 if p_lesson_id not between 1 and 20 then
  raise exception 'Invalid lesson' using errcode='22023';
 end if;
 select coalesce(jsonb_agg(
  jsonb_build_object('key',q.question_key,'question',q.prompt,'options',q.options)
  order by q.question_key),'[]'::jsonb)
 into result
 from app_private.assessment_questions q
 where q.assessment_version='foundations-v2-private' and q.active and q.lesson_id=p_lesson_id;
 if jsonb_array_length(result)<>3 then
  raise exception 'Official questions unavailable' using errcode='22023';
 end if;
 return result;
end;
$$;
revoke all on function public.cad_list_private_quiz(integer) from public, anon, authenticated;
grant execute on function public.cad_list_private_quiz(integer) to service_role;

create or replace function public.cad_grade_private_quiz(
 p_user_id uuid, p_lesson_id integer, p_responses jsonb
)
returns jsonb
language plpgsql security invoker set search_path=''
as $$
declare
 version text:='foundations-v2-private';
 attempt_count integer;
 matched integer;
 correct integer;
 score integer;
 passed boolean;
begin
 if p_user_id is null or p_lesson_id not between 1 and 20
    or p_responses is null or jsonb_typeof(p_responses)<>'array'
    or jsonb_array_length(p_responses)<>3 then
  raise exception 'Invalid official quiz attempt' using errcode='22023';
 end if;
 if exists(
  select 1 from jsonb_array_elements(p_responses) item
  where jsonb_typeof(item)<>'object'
     or jsonb_typeof(item->'choice')<>'number'
     or (item->>'choice') !~ '^[012]$'
     or coalesce(item->>'key','') !~ '^L(0[1-9]|1[0-9]|20)-Q[1-3]$'
 ) then raise exception 'Invalid response format' using errcode='22023'; end if;

 -- Serialize attempts per learner/lesson to enforce limits under concurrency.
 perform pg_catalog.pg_advisory_xact_lock(
  pg_catalog.hashtext(p_user_id::text),
  p_lesson_id
 );
 select count(*) into attempt_count
 from app_private.quiz_attempts
 where user_id=p_user_id and assessment_version=version and lesson_id=p_lesson_id
 and created_at > now()-interval '24 hours';
 if attempt_count>=5 then
  raise exception 'Daily official quiz attempt limit reached' using errcode='P0001';
 end if;

 select count(*),coalesce(sum(
    case when (item->>'choice')::integer = q.correct_index then 1 else 0 end
 ),0)
 into matched,correct
 from jsonb_array_elements(p_responses) item
 join app_private.assessment_questions q
   on q.question_key=item->>'key'
   and q.lesson_id=p_lesson_id and q.assessment_version=version and q.active;
 if matched<>3
   or (select count(distinct item->>'key') from jsonb_array_elements(p_responses) item)<>3
 then raise exception 'Responses do not match the assessment' using errcode='22023';
 end if;
 score:=round(correct*100.0/3);
 passed:=score>=80;

 insert into app_private.quiz_attempts(user_id,assessment_version,lesson_id,responses,score,passed)
 values(p_user_id,version,p_lesson_id,p_responses,score,passed);
 insert into public.quiz_results(user_id,lesson_id,assessment_version,score,passed,taken_at)
 values(p_user_id,p_lesson_id,version,score,passed,now())
 on conflict(user_id,lesson_id,assessment_version)
 do update set
  score=greatest(public.quiz_results.score,excluded.score),
  passed=public.quiz_results.passed or excluded.passed,
  taken_at=now();

 return jsonb_build_object('score',score,'passed',passed,'verified',true,
   'remainingToday',4-attempt_count);
end;
$$;
revoke all on function public.cad_grade_private_quiz(uuid,integer,jsonb) from public, anon, authenticated;
grant execute on function public.cad_grade_private_quiz(uuid,integer,jsonb) to service_role;
