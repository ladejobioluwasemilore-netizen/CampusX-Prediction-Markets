-- CampusX accounts setup (version 2) — safe to run again over a partial setup.
-- Where: your project -> SQL Editor -> New query -> paste everything below -> Run.

-- 1. One row per registered account.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  campus text,
  department text,
  level text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'SUSPENDED')),
  admin_user_id text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
alter table public.profiles add column if not exists email text;

-- 2. Who is an administrator. Only this table grants admin rights.
create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'trader')),
  primary key (user_id, role)
);

-- 3. Approved administrator emails. Your project already had an older version
--    of this table, so the missing column is added instead of failing.
create table if not exists public.admin_access_assignments (
  email text primary key,
  admin_user_id text,
  role_label text
);
alter table public.admin_access_assignments add column if not exists role_label text;

insert into public.admin_access_assignments (email, admin_user_id, role_label) values
  ('progjossytech@gmail.com',    'Jossy08',    'CEO & Front-end Developer'),
  ('emailux10@gmail.com',        'Digimide00', 'Senior Back-end Developer'),
  ('amusafarid@gmail.com',       'Farid10',    'Financial Expert'),
  ('shinaayomiawwal@gmail.com',  'Awwa_1',     'Product Manager'),
  ('rachealkumapayi@gmail.com',  'Honey13',    'PR Manager'),
  ('mohd.yusuph08@gmail.com',    'Yusuph24',   'Sport Market Analyst')
on conflict do nothing;

update public.admin_access_assignments a
set role_label = v.role_label
from (values
  ('progjossytech@gmail.com',    'CEO & Front-end Developer'),
  ('emailux10@gmail.com',        'Senior Back-end Developer'),
  ('amusafarid@gmail.com',       'Financial Expert'),
  ('shinaayomiawwal@gmail.com',  'Product Manager'),
  ('rachealkumapayi@gmail.com',  'PR Manager'),
  ('mohd.yusuph08@gmail.com',    'Sport Market Analyst')
) as v(email, role_label)
where lower(a.email) = v.email and a.role_label is null;

-- 4. Is the signed-in user an administrator? (Used by the rules below.)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles r
    where r.user_id = auth.uid() and r.role = 'admin'
  );
$$;

-- 5. Create the account row when someone signs up, and make them an
--    administrator when their approved email is confirmed.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.admin_access_assignments%rowtype;
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name);

  insert into public.user_roles (user_id, role)
  values (new.id, 'trader')
  on conflict do nothing;

  select * into a
  from public.admin_access_assignments
  where lower(email) = lower(new.email)
  limit 1;

  if found and new.email_confirmed_at is not null then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict do nothing;

    update public.profiles
    set admin_user_id = a.admin_user_id
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists campusx_on_auth_user_insert on auth.users;
create trigger campusx_on_auth_user_insert
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists campusx_on_auth_user_update on auth.users;
create trigger campusx_on_auth_user_update
after update of email_confirmed_at on auth.users
for each row execute function public.handle_new_user();

-- 6. People may edit only their personal details from the site. Their email,
--    account status and admin ID can only be changed by the functions here.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.id := old.id;
    new.email := old.email;
    new.status := old.status;
    new.admin_user_id := old.admin_user_id;
    new.created_at := old.created_at;
    new.last_login_at := old.last_login_at;
  end if;
  return new;
end;
$$;

drop trigger if exists campusx_profiles_protect on public.profiles;
create trigger campusx_profiles_protect
before update on public.profiles
for each row execute function public.protect_profile_columns();

-- 7. Called by the site after a successful sign-in / sign-up.
create or replace function public.record_login()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set last_login_at = now() where id = auth.uid();
$$;

-- 8. Deactivate / reactivate an account. Administrators only.
create or replace function public.admin_set_user_status(target uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access is required';
  end if;
  if new_status not in ('ACTIVE', 'SUSPENDED') then
    raise exception 'Unknown account status';
  end if;
  if exists (select 1 from public.user_roles where user_id = target and role = 'admin') then
    raise exception 'Administrator accounts cannot be deactivated';
  end if;
  update public.profiles set status = new_status where id = target;
end;
$$;

-- 9. Permanently delete an account. Administrators only.
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access is required';
  end if;
  if exists (select 1 from public.user_roles where user_id = target and role = 'admin') then
    raise exception 'Administrator accounts cannot be deleted';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke execute on function public.record_login() from public, anon;
revoke execute on function public.admin_set_user_status(uuid, text) from public, anon;
revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.record_login() to authenticated;
grant execute on function public.admin_set_user_status(uuid, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;
grant execute on function public.is_admin() to authenticated, anon;

-- 10. Access rules: people see and edit only their own account row;
--     administrators see every row.
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.admin_access_assignments enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "user_roles_select_own_or_admin" on public.user_roles;
create policy "user_roles_select_own_or_admin" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- 11. Bring any accounts that already exist up to date.
insert into public.profiles (id, email, full_name)
select u.id, lower(u.email), coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(u.email, ''), '@', 1))
from auth.users u
on conflict (id) do nothing;

update public.profiles p set email = lower(u.email)
from auth.users u
where u.id = p.id and p.email is distinct from lower(u.email);

insert into public.user_roles (user_id, role)
select u.id, 'trader' from auth.users u
on conflict do nothing;

insert into public.user_roles (user_id, role)
select u.id, 'admin'
from auth.users u
join public.admin_access_assignments a on lower(a.email) = lower(u.email)
where u.email_confirmed_at is not null
on conflict do nothing;

-- 12. Shows the approved admin emails so you can check the list.
select email, admin_user_id, role_label from public.admin_access_assignments order by email;
