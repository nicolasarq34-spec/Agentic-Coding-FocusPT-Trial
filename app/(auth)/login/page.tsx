import { Suspense } from "react";
import type { Metadata } from "next";
import { LogInForm } from "./login-form";
import { SendHomeIfLoggedIn } from "@/components/send-home-if-logged-in";

export const metadata: Metadata = {
  title: "Log in · Coach Lab",
};

export default function LogInPage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-10 sm:px-6 sm:py-16">
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
