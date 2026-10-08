-- Profiles: one row per person who signs up, holding their role and name.
-- Supabase Auth keeps the email and password in its own auth.users table;
-- this table adds what our app needs to know about them.

-- An enum allows only these values, and becomes 'trainer' | 'client' in TypeScript.
create type public.user_role as enum ('trainer', 'client');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  name text not null check (length(trim(name)) > 0),
  -- A client's trainer. Stays empty until feature 4 (assigning programmes).
  trainer_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Row Level Security: with it on, nobody can read or change a row
-- unless a policy below says they may.
alter table public.profiles enable row level security;

create policy "People can see their own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Trainers can see their clients' profiles"
  on public.profiles for select
  to authenticated
  using (trainer_id = auth.uid());

-- No insert, update or delete policies on purpose: profiles are created by the
-- trigger below, and nobody can change their own role.

-- When Supabase Auth creates a user, create their profile from the sign-up form's
-- role and name. `security definer` lets it insert even though RLS blocks people from doing so.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role, name)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    new.raw_user_meta_data ->> 'name'
  );
  return new;
end;
$$;

-- If the insert fails (e.g. role is 'admin' or name is missing), the whole sign-up fails.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
