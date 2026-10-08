import type { Metadata } from "next";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your account · Coach Lab",
};

export default function SignUpPage() {
  return (
    <main className="mx-auto w-full max-w-reading px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-display text-label text-primary">Coach Lab</p>
      <h1 className="mt-2 font-display text-heading-1">Create your account</h1>
      <p className="mt-2 text-muted-foreground">Trainers build programmes. Clients follow them and log their sets.</p>
      <div className="mt-8">
        <SignUpForm />
      </div>
    </main>
  );
}
