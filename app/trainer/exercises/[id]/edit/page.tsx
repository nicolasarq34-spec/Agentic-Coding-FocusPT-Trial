import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import { updateExercise } from "../../actions";
import { ExerciseForm } from "../../exercise-form";

export const metadata: Metadata = {
  title: "Edit exercise · Coach Lab",
};

// [id] in the folder name makes this a dynamic route: one page for every exercise.
// /trainer/exercises/abc-123/edit arrives here with params.id = "abc-123".
export default function EditExercisePage({ params }: PageProps<"/trainer/exercises/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-6 sm:px-6">
      <AppHeader />
      <BackLink href="/trainer/exercises">Exercises</BackLink>
      <h1 className="mt-2 font-display text-heading-1">Edit exercise</h1>
      <Suspense fallback={<div aria-hidden className="mt-8 h-80 animate-pulse rounded-md bg-muted" />}>
        <EditExercise params={params} />
      </Suspense>
    </main>
  );
}

async function EditExercise({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("trainer");
  const { id } = await params;

  const supabase = await createClient();
  const { data: exercise } = await supabase
    .from("exercises")
    .select("id, name, description, video_url")
    .eq("id", id)
    .maybeSingle();

  // Another trainer's exercise looks exactly like one that doesn't exist: RLS hides it.
  // A made-up id (not even the right format) also lands here, as an error with no data.
  if (!exercise) notFound();

  return (
    <div className="mt-8">
      <ExerciseForm
        // .bind "pre-fills" the first argument (the id), leaving the two the form passes in.
        action={updateExercise.bind(null, exercise.id)}
        initial={{ name: exercise.name, description: exercise.description ?? "", videoUrl: exercise.video_url ?? "" }}
        submitLabel="Save changes"
        pendingLabel="Saving…"
      />
    </div>
  );
}
