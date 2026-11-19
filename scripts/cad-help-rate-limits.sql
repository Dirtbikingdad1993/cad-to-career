-- CAD to Career AI tutor: durable per-user quotas. Run once as project SQL admin.
-- The Edge Function calls this as the Supabase server key after verifying user JWT.
-- No browser role can read quota rows or call the privileged function.
create schema if not exists app_private;
create table if not exists app_private.cad_help_quota (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_utc date not null,
  count_today integer not null check (count_today >= 0),
  minute_bucket timestamptz not null,
  count_minute integer not null check (count_minute >= 0),
  primary key (user_id, day_utc)
);
alter table app_private.cad_help_quota enable row level security;
revoke all on app_private.cad_help_quota from public, anon, authenticated;

create or replace function public.claim_cad_help_quota(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare latest_count integer;
begin
  if p_user_id is null or not exists (select 1 from auth.users where id = p_user_id and email_confirmed_at is not null) then
    return false;
  end if;
  insert into app_private.cad_help_quota(user_id, day_utc, count_today, minute_bucket, count_minute)
  values (p_user_id, (now() at time zone 'UTC')::date, 1, date_trunc('minute',now()), 1)
  on conflict (user_id, day_utc) do update
    set count_today = app_private.cad_help_quota.count_today + 1,
        minute_bucket = excluded.minute_bucket,
        count_minute = case when app_private.cad_help_quota.minute_bucket = excluded.minute_bucket
                            then app_private.cad_help_quota.count_minute + 1 else 1 end
    where app_private.cad_help_quota.count_today < 20
      and (app_private.cad_help_quota.minute_bucket < excluded.minute_bucket
           or app_private.cad_help_quota.count_minute < 4)
  returning count_today into latest_count;
  return latest_count is not null;
end;
$$;
revoke all on function public.claim_cad_help_quota(uuid) from public, anon, authenticated;
grant execute on function public.claim_cad_help_quota(uuid) to service_role;
comment on function public.claim_cad_help_quota(uuid) is 'Atomic per-verified-account rate limit: 4 questions/minute and 20/day; server key only.';
