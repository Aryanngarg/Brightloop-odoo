-- Brightloop starter schema for one company's workspace.
-- Run this in Supabase Dashboard > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'user' check (role in ('admin', 'developer', 'user')),
  plan_tier text not null default 'Normal' check (plan_tier in ('Pro', 'Normal')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid()
$$;

create table if not exists public.subscriptions (
  id text primary key,
  customer text not null,
  email text not null,
  plan text not null check (plan in ('Starter', 'Professional', 'Business', 'Enterprise')),
  cycle text not null check (cycle in ('Monthly', 'Yearly', 'Weekly', 'Daily')),
  amount numeric(12,2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  base_date date not null default current_date,
  next_billing date,
  status text not null default 'Active' check (status in ('Active', 'Trial', 'Past due', 'Cancelled')),
  created_by uuid not null default auth.uid() references auth.users(id)
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.subscriptions to authenticated;

drop policy if exists "Read own profile or admins read all" on public.profiles;
create policy "Read own profile or admins read all" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles
  for update to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users read subscriptions" on public.subscriptions;
create policy "Authenticated users read subscriptions" on public.subscriptions
  for select to authenticated using (true);

drop policy if exists "Admins create subscriptions" on public.subscriptions;
create policy "Admins create subscriptions" on public.subscriptions
  for insert to authenticated with check (public.current_user_role() = 'admin');

drop policy if exists "Admins update subscriptions" on public.subscriptions;
create policy "Admins update subscriptions" on public.subscriptions
  for update to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "Admins delete subscriptions" on public.subscriptions;
create policy "Admins delete subscriptions" on public.subscriptions
  for delete to authenticated using (public.current_user_role() = 'admin');

-- After signing up, promote your own account to admin by running this once:
-- update public.profiles set role = 'admin' where email = 'you@example.com';
