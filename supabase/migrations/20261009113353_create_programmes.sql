-- Programmes: what a trainer plans for clients. Three levels, each inside the one above:
--   programmes          "Strength block"
--   programme_workouts  week 1, day 1, "Lower body"
--   programme_exercises Back squat, 3 sets × 5 reps @ 80 kg
-- Each programme belongs to one trainer; everything inside it belongs to that trainer too.

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  -- Filled in automatically with whoever is logged in, like exercises.
  trainer_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  description text,
  created_at timestamptz not null default now()
);

create table public.programme_workouts (
  id uuid primary key default gen_random_uuid(),
  -- `on delete cascade`: if a programme is ever deleted, its workouts go with it.
  programme_id uuid not null references public.programmes (id) on delete cascade,
  week integer not null check (week >= 1),
  day integer not null check (day between 1 and 7),
  name text, -- optional, e.g. "Lower body"
  -- One workout per day of a week. This also makes "week 1, day 1" a safe way to find a workout.
  unique (programme_id, week, day)
);

create table public.programme_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.programme_workouts (id) on delete cascade,
  -- `on delete restrict`: the database refuses to delete an exercise that a programme still uses.
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  position integer not null check (position >= 1), -- order inside the workout, 1 first
  target_sets integer not null check (target_sets >= 1),
  target_reps integer not null check (target_reps >= 1),
  -- Empty means bodyweight (pull-ups, planks). numeric(6, 2) allows up to 9999.99 kg, e.g. 82.5.
  target_weight numeric(6, 2) check (target_weight >= 0)
);

-- Postgres doesn't index foreign keys by itself; these keep "workouts of this programme" fast.
create index programme_exercises_workout_id_idx on public.programme_exercises (workout_id);
create index programme_exercises_exercise_id_idx on public.programme_exercises (exercise_id);

alter table public.programmes enable row level security;
alter table public.programme_workouts enable row level security;
alter table public.programme_exercises enable row level security;

-- programmes: the same rules as exercises.

create policy "Trainers can see their own programmes"
  on public.programmes for select
  to authenticated
  using (trainer_id = auth.uid());

create policy "Trainers can create programmes"
  on public.programmes for insert
  to authenticated
  with check (
    trainer_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer')
  );

create policy "Trainers can edit their own programmes"
  on public.programmes for update
  to authenticated
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- No delete policy for programmes yet: once they're assigned to clients (feature 4), deleting one needs a decision.

-- programme_workouts and programme_exercises have no trainer_id of their own.
-- Their policies ask "does the programme this row belongs to belong to me?"

create policy "Trainers can see workouts in their own programmes"
  on public.programme_workouts for select
  to authenticated
  using (exists (select 1 from public.programmes p where p.id = programme_id and p.trainer_id = auth.uid()));

create policy "Trainers can add workouts to their own programmes"
  on public.programme_workouts for insert
  to authenticated
  with check (exists (select 1 from public.programmes p where p.id = programme_id and p.trainer_id = auth.uid()));

create policy "Trainers can edit workouts in their own programmes"
  on public.programme_workouts for update
  to authenticated
  using (exists (select 1 from public.programmes p where p.id = programme_id and p.trainer_id = auth.uid()))
  with check (exists (select 1 from public.programmes p where p.id = programme_id and p.trainer_id = auth.uid()));

create policy "Trainers can remove workouts from their own programmes"
  on public.programme_workouts for delete
  to authenticated
  using (exists (select 1 from public.programmes p where p.id = programme_id and p.trainer_id = auth.uid()));

-- One level deeper: the workout's programme must be mine.
-- Adding or changing a row also checks the exercise is from my own library.

create policy "Trainers can see exercises in their own programmes"
  on public.programme_exercises for select
  to authenticated
  using (exists (
    select 1 from public.programme_workouts w
    join public.programmes p on p.id = w.programme_id
    where w.id = workout_id and p.trainer_id = auth.uid()
  ));

create policy "Trainers can add their own exercises to their own workouts"
  on public.programme_exercises for insert
  to authenticated
  with check (
    exists (
      select 1 from public.programme_workouts w
      join public.programmes p on p.id = w.programme_id
      where w.id = workout_id and p.trainer_id = auth.uid()
    )
    and exists (select 1 from public.exercises e where e.id = exercise_id and e.trainer_id = auth.uid())
  );

create policy "Trainers can edit exercises in their own workouts"
  on public.programme_exercises for update
  to authenticated
  using (exists (
    select 1 from public.programme_workouts w
    join public.programmes p on p.id = w.programme_id
    where w.id = workout_id and p.trainer_id = auth.uid()
  ))
  with check (
    exists (
      select 1 from public.programme_workouts w
      join public.programmes p on p.id = w.programme_id
      where w.id = workout_id and p.trainer_id = auth.uid()
    )
    and exists (select 1 from public.exercises e where e.id = exercise_id and e.trainer_id = auth.uid())
  );

create policy "Trainers can remove exercises from their own workouts"
  on public.programme_exercises for delete
  to authenticated
  using (exists (
    select 1 from public.programme_workouts w
    join public.programmes p on p.id = w.programme_id
    where w.id = workout_id and p.trainer_id = auth.uid()
  ));
