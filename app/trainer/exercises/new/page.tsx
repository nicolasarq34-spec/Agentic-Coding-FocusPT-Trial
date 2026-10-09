import { Suspense } from "react";
import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { RequireRole } from "@/components/require-role";
import { createExercise } from "../actions";
import { ExerciseForm } from "../exercise-form";

export const metadata: Metadata = {
  title: "New exercise · Coach Lab",
};

// The form is the same for every trainer, so the whole page is sent instantly.
// <RequireRole> checks who's asking in the background and sends a client away.
// createExercise checks again when the form is saved.
export default function NewExercisePage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-6 sm:px-6">
      <Suspense>
        <RequireRole role="trainer" />
      </Suspense>
      <AppHeader />
      <BackLink href="/trainer/exercises">Exercises</BackLink>
      <h1 className="mt-2 font-display text-heading-1">New exercise</h1>
      <div className="mt-8">
        <ExerciseForm action={createExercise} submitLabel="Save exercise" pendingLabel="Saving…" />
      </div>
    </main>
  );
}
