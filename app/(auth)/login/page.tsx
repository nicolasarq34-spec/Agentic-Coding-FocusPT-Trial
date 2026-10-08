import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogInForm } from "./login-form";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { homePathForRole } from "@/lib/auth/home-path";

export const metadata: Metadata = {
  title: "Log in · Coach Lab",
};

export default function LogInPage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-10 sm:px-6 sm:py-16">
      {/* Already logged in? Go home instead. Inside <Suspense> because it reads the login cookie. */}
      <Suspense>
        <SendHomeIfLoggedIn />
      </Suspense>
      <p className="font-display text-label text-primary">Coach Lab</p>
      <h1 className="mt-2 font-display text-heading-1">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Log in to see your programmes and workouts.</p>
      <div className="mt-8">
        <LogInForm />
      </div>
    </main>
  );
}

// Shows nothing. Its only job is to redirect someone who is already logged in.
async function SendHomeIfLoggedIn() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));
  return null;
}
