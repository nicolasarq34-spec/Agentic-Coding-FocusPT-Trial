import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/current-profile";
import { groupByWeek } from "@/lib/programmes/group-by-week";
import { createClient } from "@/lib/supabase/server";
import { addWorkout, removeWorkout } from "./actions";
import { AddWorkoutForm } from "./add-workout-form";
import { RemoveWorkoutButton } from "./remove-workout-button";

export const metadata: Metadata = {
  title: "Programme · Coach Lab",
};

// The programme page: its weeks, each week's workouts as cards, and a form to add a workout.
// Step 5 puts the exercises inside each card.
export default function ProgrammePage({ params }: PageProps<"/trainer/programmes/[id]">) {
  return (
    <main className="mx-auto w-full max-w-app px-4 py-6 sm:px-6 lg:px-8">
      <AppHeader />
      <BackLink href="/trainer/programmes">Programmes</BackLink>
      <Suspense fallback={<div aria-hidden className="mt-4 h-96 animate-pulse rounded-md bg-muted" />}>
        <Programme params={params} />
      </Suspense>
    </main>
  );
}

async function Programme({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("trainer");
  const { id } = await params;

  const supabase = await createClient();
  // One query for the programme, its workouts, and how many exercises each workout has.
  const { data: programme } = await supabase
    .from("programmes")
    .select("id, name, description, programme_workouts(id, week, day, name, programme_exercises(count))")
    .eq("id", id)
    .maybeSingle();

  // Another trainer's programme looks exactly like one that doesn't exist: RLS hides it.
  if (!programme) notFound();

  const weeks = groupByWeek(programme.programme_workouts);
  const lastWeek = weeks.at(-1)?.week ?? 1;

  return (
    <>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-heading-1">{programme.name}</h1>
          {programme.description && <p className="mt-2 max-w-reading text-muted-foreground">{programme.description}</p>}
        </div>
        <Link href={`/trainer/programmes/${programme.id}/edit`} className={buttonVariants({ variant: "outline" })}>
          <Pencil aria-hidden />
          Edit details
        </Link>
      </div>

      {weeks.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No workouts yet">Start with week 1: add the first workout below.</EmptyState>
        </div>
      ) : (
        weeks.map(({ week, workouts }) => (
          <section key={week} aria-labelledby={`week-${week}`} className="mt-10">
            <h2 id={`week-${week}`} className="font-display text-heading-2">
              Week {week}
            </h2>
            <ul className="mt-4 grid gap-4 lg:grid-cols-2">
              {workouts.map((workout) => {
                const exerciseCount = workout.programme_exercises[0]?.count ?? 0;
                const title = workout.name ? `Day ${workout.day} · ${workout.name}` : `Day ${workout.day}`;
                return (
                  <li key={workout.id} className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{title}</h3>
                      <RemoveWorkoutButton
                        action={removeWorkout.bind(null, programme.id, workout.id)}
                        label={`week ${week}, ${title}`}
                        exerciseCount={exerciseCount}
                      />
                    </div>
                    <p className="text-body-small text-muted-foreground">
                      {exerciseCount === 0
                        ? "No exercises yet"
                        : exerciseCount === 1
                          ? "1 exercise"
                          : `${exerciseCount} exercises`}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}

      <div className="mt-10 max-w-reading">
        <AddWorkoutForm action={addWorkout.bind(null, programme.id)} defaultWeek={lastWeek} />
      </div>
    </>
  );
}
