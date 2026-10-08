"use client";

import { useActionState } from "react";
import Link from "next/link";
import { logIn, type LogInState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormError, fieldAria } from "@/components/form-field";

export function LogInForm() {
  const [state, formAction, pending] = useActionState<LogInState, FormData>(logIn, {});
  const errors = state.errors ?? {};

  return (
    // Same pattern as the sign-up form: our own messages, and the email is kept after an error.
    <form key={state.email ?? ""} action={formAction} noValidate className="space-y-6">
      <Field label="Email" name="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={state.email}
          {...fieldAria("email", errors.email)}
        />
      </Field>

      <Field label="Password" name="password" error={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          {...fieldAria("password", errors.password)}
        />
      </Field>

      <FormError message={state.formError} />

      <div className="space-y-4">
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
        <p className="text-center text-body-small text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
