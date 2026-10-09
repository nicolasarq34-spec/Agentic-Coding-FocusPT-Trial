"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  // removeWorkout with the programme and workout ids pre-filled.
  action: () => Promise<void>;
  label: string; // "Week 1 · Day 1 · Lower body", for the screen-reader name and the question
  exerciseCount: number;
};

// A tiny form, so it works like any other Server Action. It asks first when the workout has exercises,
// because removing the workout removes them too and there's no undo.
export function RemoveWorkoutButton({ action, label, exerciseCount }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const what = exerciseCount === 1 ? "its exercise" : `its ${exerciseCount} exercises`;
        if (exerciseCount > 0 && !window.confirm(`Remove ${label} and ${what}?`)) event.preventDefault();
      }}
    >
      <Button type="submit" variant="ghost" size="icon" aria-label={`Remove ${label}`}>
        <Trash2 aria-hidden />
      </Button>
    </form>
  );
}
