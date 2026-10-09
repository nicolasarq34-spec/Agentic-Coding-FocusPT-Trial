"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ProgrammeFormState } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormError, fieldAria } from "@/components/form-field";
import type { ProgrammeInput } from "@/lib/programmes/validate-programme";

type Props = {
  // Which Server Action saves the form: creating a programme, or editing one.
  action: (prevState: ProgrammeFormState, formData: FormData) => Promise<ProgrammeFormState>;
  initial?: ProgrammeInput;
  // Where Cancel goes: the list when creating, the programme itself when editing.
  cancelHref: string;
  submitLabel: string;
  pendingLabel: string;
};

const empty: ProgrammeInput = { name: "", description: "" };

// Same pattern as ExerciseForm: our own error messages, and `key` refills the form after an error.
export function ProgrammeForm({ action, initial = empty, cancelHref, submitLabel, pendingLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.errors ?? {};
  const values = state.fields ?? initial;

  return (
    <form key={JSON.stringify(values)} action={formAction} noValidate className="space-y-6">
      <Field label="Name" name="name" error={errors.name} hint="For example “Beginner strength” or “Marathon prep”.">
        <Input id="name" name="name" defaultValue={values.name} autoComplete="off" {...fieldAria("name", errors.name, true)} />
      </Field>

      <Field label="Description (optional)" name="description" hint="Who it’s for and what it builds.">
        <Textarea
          id="description"
          name="description"
          defaultValue={values.description}
          {...fieldAria("description", undefined, true)}
        />
      </Field>

      <FormError message={state.formError} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost", size: "lg" })}>
          Cancel
        </Link>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
