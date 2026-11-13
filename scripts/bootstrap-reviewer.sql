-- CAD to Career: ONE-TIME reviewer bootstrap from Supabase SQL Editor.
-- Must be executed by an existing Supabase project administrator.
-- Use a REAL email belonging to an already confirmed CAD to Career account.
-- NEVER put a personal email in a committed migration or grant based on
-- user_metadata. Students have no access to this table or this statement.
do $bootstrap$
declare
  verified_owner_email text := 'REPLACE_WITH_VERIFIED_OWNER_EMAIL';
  owner_id uuid;
begin
  if verified_owner_email = 'REPLACE_WITH_VERIFIED_OWNER_EMAIL'
     or position('@' in verified_owner_email)=0
  then
    raise exception 'Set verified_owner_email to the actual verified CAD to Career account email before running';
  end if;
  select id into owner_id from auth.users
   where lower(email)=lower(verified_owner_email)
     and email_confirmed_at is not null;
  if owner_id is null then
    raise exception 'No email-confirmed CAD to Career user matches that address. Register, verify, then retry.';
  end if;
  insert into public.reviewer_memberships (user_id, role)
  values (owner_id, 'admin')
  on conflict (user_id) do update set role='admin';
  raise notice 'Authorized reviewer admin granted to a confirmed account (user UUID: %)',owner_id;
end $bootstrap$;
-- Verify after running:
-- select rm.role, u.email_confirmed_at is not null as email_confirmed
-- from public.reviewer_memberships rm
-- join auth.users u on u.id = rm.user_id;
