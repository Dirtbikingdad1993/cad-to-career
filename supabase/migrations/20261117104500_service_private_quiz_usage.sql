-- Trusted Edge Functions call security-invoker RPCs using service_role;
-- granting table SELECT without schema USAGE is insufficient in PostgreSQL.
grant usage on schema app_private to service_role;
revoke all on schema app_private from public, anon, authenticated;
