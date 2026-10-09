import { Suspense } from "react";
import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { RequireRole } from "@/components/require-role";
import { createProgramme } from "../actions";
import { ProgrammeForm } from "../programme-form";

export const metadata: Metadata = {
  title: "New programme · Coach Lab",
};

// An empty form is the same for every trainer, so the page is sent instantly; <RequireRole> checks behind it.
export default function NewProgrammePage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-6 sm:px-6">
      <Suspense>
        <RequireRole role="trainer" />
      </Suspense>
      <AppHeader />
      <BackLink href="/trainer/programmes">Programmes</BackLink>
      <h1 className="mt-2 font-display text-heading-1">New programme</h1>
      <p className="mt-2 text-muted-foreground">Name it first. You’ll add weeks and workouts next.</p>
      <div className="mt-8">
        <ProgrammeForm action={createProgramme} cancelHref="/trainer/programmes" submitLabel="Create programme" pendingLabel="Creating…" />
      </div>
    </main>
  );
}
