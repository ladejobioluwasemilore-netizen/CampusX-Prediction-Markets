-- Run once in the SQL Editor of the EXISTING CampusX account project.
-- Requires campusx-setup.sql (profiles, user_roles and is_admin) already installed.
begin;

create table if not exists public.markets (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.markets to authenticated;
grant all on public.markets to service_role;
alter table public.markets enable row level security;

drop policy if exists campusx_markets_read on public.markets;
create policy campusx_markets_read on public.markets for select to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and status = 'ACTIVE'));
drop policy if exists campusx_markets_insert on public.markets;
create policy campusx_markets_insert on public.markets for insert to authenticated
with check (public.is_admin() and exists (select 1 from public.profiles where id = auth.uid() and status = 'ACTIVE'));
drop policy if exists campusx_markets_update on public.markets;
create policy campusx_markets_update on public.markets for update to authenticated
using (public.is_admin() and exists (select 1 from public.profiles where id = auth.uid() and status = 'ACTIVE'))
with check (public.is_admin() and exists (select 1 from public.profiles where id = auth.uid() and status = 'ACTIVE'));

-- Older account setup versions omitted these Data API grants.
grant select on public.profiles, public.user_roles to authenticated;
revoke update on public.profiles from authenticated;
grant all on public.profiles, public.user_roles, public.admin_access_assignments to service_role;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists campus text;
alter table public.profiles add column if not exists department text;
alter table public.profiles add column if not exists level text;
grant update (full_name, phone, campus, department, level) on public.profiles to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'markets') then
    alter publication supabase_realtime add table public.markets;
  end if;
end $$;
commit;