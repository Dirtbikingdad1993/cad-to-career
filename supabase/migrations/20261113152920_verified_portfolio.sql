-- Portfolio text and image choices are learner-authored; approval is never stored here.
-- Only the portfolio Edge Function may access these tables. It authenticates owners
-- for edits and derives all public verification from existing assessment records.
create table public.portfolio_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  public_id uuid not null unique default gen_random_uuid(),
  display_name text not null default '' check (char_length(display_name) <= 80),
  headline text not null default '' check (char_length(headline) <= 120),
  bio text not null default '' check (char_length(bio) <= 2000),
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.portfolio_entries (
  submission_id uuid primary key references public.project_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  summary text not null default '' check (char_length(summary) <= 1200),
  design_process text not null default '' check (char_length(design_process) <= 1200),
  tools text not null default '' check (char_length(tools) <= 150),
  cover_path text check (cover_path is null or char_length(cover_path) <= 500),
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
create index portfolio_entries_owner_idx on public.portfolio_entries(user_id);

alter table public.portfolio_profiles enable row level security;
alter table public.portfolio_entries enable row level security;
revoke all on public.portfolio_profiles, public.portfolio_entries from public, anon, authenticated;
grant select, insert, update, delete on public.portfolio_profiles, public.portfolio_entries to service_role;
-- Default deny: neither signed-in browsers nor anonymous callers can access
-- these tables directly. The function only returns a minimal opted-in projection.
