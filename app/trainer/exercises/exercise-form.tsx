"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ExerciseFormState } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormError, fieldAria } from "@/components/form-field";
import type { ExerciseInput } from "@/lib/exercises/validate-exercise";

type Props = {
  // Which Server Action saves the form: adding a new exercise, or (later) editing one.
  action: (prevState: ExerciseFormState, formData: FormData) => Promise<ExerciseFormState>;
  // What the fields start with: empty for a new exercise, the saved values when editing.
  initial?: ExerciseInput;
  submitLabel: string;
  pendingLabel: string;
};

const empty: ExerciseInput = { name: "", description: "", videoUrl: "" };

export function ExerciseForm({ action, initial = empty, submitLabel, pendingLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.errors ?? {};
  // After an error, show what the trainer typed; otherwise the starting values.
  const values = state.fields ?? initial;

  return (
    // Same pattern as the sign-up form: our own error messages, and `key` refills the form after an error.
    <form key={JSON.stringify(values)} action={formAction} noValidate className="space-y-6">
      <Field label="Name" name="name" error={errors.name}>
        <Input id="name" name="name" defaultValue={values.name} autoComplete="off" {...fieldAria("name", errors.name)} />
      </Field>

      <Field label="Description (optional)" name="description" hint="Cues your client should remember.">
        <Textarea
          id="description"
          name="description"
          defaultValue={values.description}
          {...fieldAria("description", undefined, true)}
        />
      </Field>

      <Field label="Video link (optional)" name="videoUrl" error={errors.videoUrl} hint="A YouTube or Vimeo link showing the movement.">
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          defaultValue={values.videoUrl}
          {...fieldAria("videoUrl", errors.videoUrl, true)}
        />
      </Field>

      <FormError message={state.formError} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/trainer/exercises" className={buttonVariants({ variant: "ghost", size: "lg" })}>
          Cancel
        </Link>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
