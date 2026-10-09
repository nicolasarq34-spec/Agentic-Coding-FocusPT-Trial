import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/current-profile";

export const metadata: Metadata = {
  title: "Your clients · Coach Lab",
};

// The header is the same for everyone, so Next.js sends it instantly.
// The greeting depends on who's logged in, so it waits behind <Suspense> and streams in.
export default function TrainerHomePage() {
  return (
    <main className="mx-auto w-full max-w-app px-4 py-6 sm:px-6 lg:px-8">
      <AppHeader />
      <Suspense fallback={<div aria-hidden className="mt-8 h-10 w-56 animate-pulse rounded-full bg-muted" />}>
        <TrainerHome />
      </Suspense>
    </main>
  );
}

async function TrainerHome() {
  const profile = await requireRole("trainer");

  return (
    <>
      <h1 className="mt-8 font-display text-heading-1">Hi, {profile.name}</h1>
      <nav aria-label="Trainer tools" className="mt-6">
        <Link href="/trainer/exercises" className={buttonVariants({ variant: "outline" })}>
          <Dumbbell aria-hidden />
          Exercise library
        </Link>
      </nav>
      <section className="mt-10 space-y-4">
        <h2 className="font-display text-heading-2">Your clients</h2>
        <EmptyState title="No clients yet">
          When clients join you, they appear here with their last workout.
        </EmptyState>
      </section>
    </>
  );
}
