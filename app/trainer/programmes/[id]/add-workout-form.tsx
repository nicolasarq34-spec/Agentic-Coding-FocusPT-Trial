"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import type { WorkoutFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormError, fieldAria } from "@/components/form-field";

type Props = {
  action: (prevState: WorkoutFormState, formData: FormData) => Promise<WorkoutFormState>;
  // Suggested week: the programme's last week, so adding "day 3" after "day 1" needs no typing.
  defaultWeek: number;
};

export const DAYS = [1, 2, 3, 4, 5, 6, 7];

export function AddWorkoutForm({ action, defaultWeek }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.errors ?? {};
  const values = state.fields ?? { week: String(defaultWeek), day: "", name: "" };

  return (
    // savedAt in the key: after each save the form is rebuilt, so day and name start empty again.
    <form
      key={`${state.savedAt}-${JSON.stringify(values)}`}
      action={formAction}
      noValidate
      className="space-y-4 rounded-md border border-border bg-card p-4 sm:p-6"
    >
      <h2 className="font-display text-heading-2">Add a workout</h2>
      <div className="grid gap-4 sm:grid-cols-[6rem_8rem_1fr]">
        <Field label="Week" name="week" error={errors.week}>
          <Input
            id="week"
            name="week"
            type="number"
            inputMode="numeric"
            min={1}
            max={52}
            defaultValue={values.week}
            {...fieldAria("week", errors.week)}
          />
        </Field>
        <Field label="Day" name="day" error={errors.day}>
          {/* A native <select>: the phone shows its own picker, and keyboards and screen readers just work. */}
          <select
            id="day"
            name="day"
            defaultValue={values.day}
            className="h-10 w-full rounded-full border border-input bg-card px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive pointer-coarse:h-12"
            {...fieldAria("day", errors.day)}
          >
            <option value="" disabled>
              Choose
            </option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                Day {day}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Name (optional)" name="name">
          <Input id="name" name="name" placeholder="Lower body" defaultValue={values.name} autoComplete="off" />
        </Field>
      </div>
      <FormError message={state.formError} />
      <Button type="submit" disabled={pending}>
        <Plus aria-hidden />
        {pending ? "Adding…" : "Add workout"}
      </Button>
    </form>
  );
}
