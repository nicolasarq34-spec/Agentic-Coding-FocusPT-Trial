import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BackLink } from "@/components/back-link";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import { updateProgramme } from "../../actions";
import { ProgrammeForm } from "../../programme-form";

export const metadata: Metadata = {
  title: "Edit programme · Coach Lab",
};

export default function EditProgrammePage({ params }: PageProps<"/trainer/programmes/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-6 sm:px-6">
      <AppHeader />
      <Suspense fallback={<BackLink href="/trainer/programmes">Programmes</BackLink>}>
        <BackToProgramme params={params} />
      </Suspense>
      <h1 className="mt-2 font-display text-heading-1">Edit programme</h1>
      <Suspense fallback={<div aria-hidden className="mt-8 h-64 animate-pulse rounded-md bg-muted" />}>
        <EditProgramme params={params} />
      </Suspense>
    </main>
  );
}

async function EditProgramme({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("trainer");
  const { id } = await params;

  const supabase = await createClient();
  const { data: programme } = await supabase
    .from("programmes")
    .select("id, name, description")
    .eq("id", id)
    .maybeSingle();

  // Another trainer's programme looks exactly like one that doesn't exist: RLS hides it.
  if (!programme) notFound();

  return (
    <div className="mt-8">
      <ProgrammeForm
        action={updateProgramme.bind(null, programme.id)}
        cancelHref={`/trainer/programmes/${programme.id}`}
        initial={{ name: programme.name, description: programme.description ?? "" }}
        submitLabel="Save changes"
        pendingLabel="Saving…"
      />
    </div>
  );
}

// "‹ Programme", back to the programme page. The id comes from the address, which is only known per request.
async function BackToProgramme({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BackLink href={`/trainer/programmes/${id}`}>Programme</BackLink>;
}
