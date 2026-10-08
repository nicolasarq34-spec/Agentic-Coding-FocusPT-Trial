"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type SignUpState } from "../actions";
import { OptionRow } from "@/components/option-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/validate-sign-up";

const roles = [
  { id: "trainer", label: "I'm a trainer", description: "Build programmes and follow your clients" },
  { id: "client", label: "I'm a client", description: "See today's workout and log your sets" },
];

export function SignUpForm() {
  // state: what the server sent back. formAction: what the form calls. pending: true while waiting.
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(signUp, {});
  const errors = state.errors ?? {};

  return (
    // noValidate: our own messages instead of the browser's pop-ups, so errors look the same everywhere.
    // key: when the server sends back what was typed, React builds a fresh form filled with it,
    // because inputs only accept their starting value (defaultValue) once.
    <form key={JSON.stringify(state.fields ?? {})} action={formAction} noValidate className="space-y-6">
      <fieldset className="space-y-2" aria-describedby={errors.role ? "role-error" : undefined}>
        <legend className="mb-3 text-label">Who are you?</legend>
        {roles.map((option) => (
          <OptionRow
            key={option.id}
            name="role"
            value={option.id}
            description={option.description}
            defaultChecked={state.fields?.role === option.id}
          >
            {option.label}
          </OptionRow>
        ))}
        <FieldError id="role-error" message={errors.role} />
      </fieldset>

      <Field label="Name" name="name" error={errors.name}>
        <Input id="name" name="name" autoComplete="name" defaultValue={state.fields?.name} {...invalid("name", errors.name)} />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={state.fields?.email}
          {...invalid("email", errors.email)}
        />
      </Field>

      <Field label="Password" name="password" error={errors.password} hint={`At least ${MIN_PASSWORD_LENGTH} characters`}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          {...invalid("password", errors.password, true)}
        />
      </Field>

      {state.formError && (
        <p role="alert" className="rounded-sm bg-destructive/10 px-4 py-3 text-body-small text-destructive">
          {state.formError}
        </p>
      )}

      <div className="space-y-4">
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-body-small text-muted-foreground">
          Have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}

// Links an input to its hint and error, so screen readers read them with the field.
function invalid(name: string, error: string | undefined, hasHint = false) {
  const describedBy = [hasHint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": describedBy || undefined };
}

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="text-body-small text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-body-small text-destructive">
      {message}
    </p>
  );
}
