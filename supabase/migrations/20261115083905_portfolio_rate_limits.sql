-- Fixed-window, database-backed quotas. Public requests share one conservative
-- ceiling because arbitrary client IP headers cannot be trusted for identity.
-- Authenticated operations also get a separate quota per verified account.
create table public.portfolio_public_quota (
  id smallint primary key default 1 check (id = 1),
  window_started_at timestamptz not null,
  hits integer not null check (hits between 1 and 601)
);
create table public.portfolio_user_quota (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null,
  hits integer not null check (hits between 1 and 61)
);
alter table public.portfolio_public_quota enable row level security;
alter table public.portfolio_user_quota enable row level security;
revoke all on public.portfolio_public_quota, public.portfolio_user_quota from public, anon, authenticated;
grant select, insert, update on public.portfolio_public_quota, public.portfolio_user_quota to service_role;

create function public.cad_portfolio_public_quota()
returns boolean language plpgsql security invoker set search_path = '' as $body$
declare v_now timestamptz := clock_timestamp(); v_hits integer;
begin
  insert into public.portfolio_public_quota as q(id, window_started_at, hits)
  values (1, v_now, 1)
  on conflict(id) do update set
    window_started_at = case when q.window_started_at <= v_now - interval '1 minute' then v_now else q.window_started_at end,
    hits = case when q.window_started_at <= v_now - interval '1 minute' then 1 else least(q.hits + 1, 601) end
  returning hits into v_hits;
  return v_hits <= 600;
end
$body$;

create function public.cad_portfolio_user_quota(p_user_id uuid)
returns boolean language plpgsql security invoker set search_path = '' as $body$
declare v_now timestamptz := clock_timestamp(); v_hits integer;
begin
  if p_user_id is null then return false; end if;
  insert into public.portfolio_user_quota as q(user_id, window_started_at, hits)
  values (p_user_id, v_now, 1)
  on conflict(user_id) do update set
    window_started_at = case when q.window_started_at <= v_now - interval '1 minute' then v_now else q.window_started_at end,
    hits = case when q.window_started_at <= v_now - interval '1 minute' then 1 else least(q.hits + 1, 61) end
  returning hits into v_hits;
  return v_hits <= 60;
end
$body$;
revoke all on function public.cad_portfolio_public_quota() from public, anon, authenticated;
revoke all on function public.cad_portfolio_user_quota(uuid) from public, anon, authenticated;
grant execute on function public.cad_portfolio_public_quota() to service_role;
grant execute on function public.cad_portfolio_user_quota(uuid) to service_role;
