import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Play, Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Exercises · Coach Lab",
};

// Title and "Add exercise" are the same for every trainer, so they're sent instantly.
// The list depends on who's logged in, so it streams in behind <Suspense>.
export default function ExercisesPage() {
  return (
    <main className="mx-auto w-full max-w-app px-4 py-6 sm:px-6 lg:px-8">
      <AppHeader />
      <BackLink href="/trainer">Home</BackLink>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="font-display text-heading-1">Exercises</h1>
        <Link href="/trainer/exercises/new" className={buttonVariants()}>
          <Plus aria-hidden />
          Add exercise
        </Link>
      </div>
      <Suspense fallback={<div aria-hidden className="mt-8 h-48 animate-pulse rounded-md bg-muted" />}>
        <ExerciseList />
      </Suspense>
    </main>
  );
}

async function ExerciseList() {
  await requireRole("trainer");
  const supabase = await createClient();
  // No "where trainer_id = me" needed: Row Level Security only returns this trainer's exercises.
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("id, name, description, video_url")
    .order("name");

  if (error) throw error;

  if (exercises.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState title="No exercises yet">
          Add the moves you coach most. You’ll build programmes from them.
        </EmptyState>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
      {exercises.map((exercise) => (
        <li key={exercise.id} className="flex items-center gap-2 pr-3 hover:bg-muted/50">
          <Link
            href={`/trainer/exercises/${exercise.id}/edit`}
            className="min-w-0 flex-1 px-4 py-3 outline-none focus-visible:bg-muted pointer-coarse:py-4"
          >
            <span className="block font-medium">{exercise.name}</span>
            {exercise.description && (
              <span className="block truncate text-body-small text-muted-foreground">{exercise.description}</span>
            )}
          </Link>
          {exercise.video_url && (
            // A separate link (links can't sit inside links). Opens in a new tab so the list stays put.
            <a
              href={exercise.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              aria-label={`Watch video for ${exercise.name} (opens in a new tab)`}
            >
              <Play aria-hidden />
              Video
            </a>
          )}
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </li>
      ))}
    </ul>
  );
}
