-- Exercises: a trainer's own library of moves (name, optional description and video link).
-- Programmes (feature 3) are built from these. Each exercise belongs to exactly one trainer.

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  -- Filled in automatically with whoever is logged in, so the app never has to send it.
  trainer_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  description text,
  -- Optional, but when present it must be a web address.
  video_url text check (video_url ~ '^https?://'),
  created_at timestamptz not null default now()
);

-- One trainer can't have two exercises with the same name ("Back squat" and "back squat").
-- A unique index on lower(name) compares names ignoring capital letters.
create unique index exercises_trainer_id_name_key on public.exercises (trainer_id, lower(name));

alter table public.exercises enable row level security;

-- `using` decides which existing rows you can see or touch.
-- `with check` decides what a new or changed row is allowed to look like.

create policy "Trainers can see their own exercises"
  on public.exercises for select
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can add exercises to their own library"
  on public.exercises for insert
  to authenticated
  with check (
    trainer_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer')
  );

-- Both checks: you can only edit your own rows, and you can't hand one to another trainer.
create policy "Trainers can edit their own exercises"
  on public.exercises for update
  to authenticated
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- No delete policy on purpose: once programmes use exercises, deleting one needs a decision.
-- Clients will get read access in feature 5, for the exercises in their own programme.
