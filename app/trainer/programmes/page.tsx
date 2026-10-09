import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Programmes · Coach Lab",
};

// Same shape as the exercise list: title and button are sent instantly, the list streams in.
export default function ProgrammesPage() {
  return (
    <main className="mx-auto w-full max-w-app px-4 py-6 sm:px-6 lg:px-8">
      <AppHeader />
      <BackLink href="/trainer">Home</BackLink>
      {/* flex-wrap: on a narrow phone the button moves under the title instead of running off the screen. */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-heading-1">Programmes</h1>
        <Link href="/trainer/programmes/new" className={buttonVariants()}>
          <Plus aria-hidden />
          New programme
        </Link>
      </div>
      <Suspense fallback={<div aria-hidden className="mt-8 h-48 animate-pulse rounded-md bg-muted" />}>
        <ProgrammeList />
      </Suspense>
    </main>
  );
}

async function ProgrammeList() {
  await requireRole("trainer");
  const supabase = await createClient();
  // programme_workouts(count) asks the database to count each programme's workouts in the same query.
  const { data: programmes, error } = await supabase
    .from("programmes")
    .select("id, name, description, programme_workouts(count)")
    .order("name");

  if (error) throw error;

  if (programmes.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState title="No programmes yet">
          Create one, then fill it with weeks of workouts from your exercise library.
        </EmptyState>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
      {programmes.map((programme) => {
        const workouts = programme.programme_workouts[0]?.count ?? 0;
        return (
          <li key={programme.id} className="hover:bg-muted/50">
            {/* For now a programme opens its edit form. Step 4 adds the programme page with its weeks. */}
            <Link
              href={`/trainer/programmes/${programme.id}/edit`}
              className="flex items-center gap-2 px-4 py-3 outline-none focus-visible:bg-muted pointer-coarse:py-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{programme.name}</span>
                <span className="block truncate text-body-small text-muted-foreground">
                  {workouts === 0 ? "No workouts yet" : workouts === 1 ? "1 workout" : `${workouts} workouts`}
                  {programme.description && ` · ${programme.description}`}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
