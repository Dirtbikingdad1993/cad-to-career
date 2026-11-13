-- Per-student practice workspace; values in this table are not trusted for credentials.
create table if not exists public.cloud_workspaces (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint workspace_payload_object check(jsonb_typeof(payload)='object'),
 constraint workspace_payload_limit check(octet_length(payload::text) <= 1048576)
);
alter table public.cloud_workspaces enable row level security;
create policy "Students read only own workspace" on public.cloud_workspaces
 for select to authenticated using ((select auth.uid()) = user_id);
create policy "Students create only own workspace" on public.cloud_workspaces
 for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Students update only own workspace" on public.cloud_workspaces
 for update to authenticated using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);
grant select,insert,update on public.cloud_workspaces to authenticated;
revoke all on public.cloud_workspaces from anon;
-- The date is controlled by database, not client, and allows sync ordering.
create or replace function public.set_workspace_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function public.set_workspace_updated_at() from public, anon, authenticated;
drop trigger if exists cloud_workspaces_timestamp on public.cloud_workspaces;
create trigger cloud_workspaces_timestamp before update on public.cloud_workspaces
for each row execute function public.set_workspace_updated_at();
