import { Suspense } from "react";
import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { EmptyState } from "@/components/empty-state";
import { requireRole } from "@/lib/auth/current-profile";

export const metadata: Metadata = {
  title: "Today · Coach Lab",
};

// Same shape as the trainer home: instant header, greeting streams in once we know who you are.
export default function ClientHomePage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-6 sm:px-6">
      <AppHeader />
      <Suspense fallback={<div aria-hidden className="mt-8 h-10 w-56 animate-pulse rounded-full bg-muted" />}>
        <ClientHome />
      </Suspense>
    </main>
  );
}

async function ClientHome() {
  const profile = await requireRole("client");

  return (
    <>
      <h1 className="mt-8 font-display text-heading-1">Hi, {profile.name}</h1>
      <section className="mt-10 space-y-4">
        <h2 className="font-display text-heading-2">Today</h2>
        <EmptyState title="No programme assigned yet">
          When your trainer assigns one, today’s workout appears here.
        </EmptyState>
      </section>
    </>
  );
}
