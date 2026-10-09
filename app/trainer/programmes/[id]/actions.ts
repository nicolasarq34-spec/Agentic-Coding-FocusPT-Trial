"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import { validateWorkout, type WorkoutField, type WorkoutInput } from "@/lib/programmes/validate-workout";

// Actions used on the programme page (/trainer/programmes/[id]).

export type WorkoutFormState = {
  errors?: Partial<Record<WorkoutField, string>>;
  formError?: string;
  fields?: WorkoutInput;
  // Changes after every successful save, so the form can empty itself for the next workout.
  savedAt?: number;
};

const DUPLICATE = "23505";

// The programme page pre-fills programmeId with .bind.
export async function addWorkout(
  programmeId: string,
  _prevState: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  await requireRole("trainer");

  const fields: WorkoutInput = {
    week: formData.get("week")?.toString() ?? "",
    day: formData.get("day")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
  };
  const result = validateWorkout(fields);
  if (!result.ok) return { errors: result.errors, fields };

  const supabase = await createClient();
  // RLS refuses this (an error, not silence) if the programme isn't the trainer's own.
  const { error } = await supabase.from("programme_workouts").insert({ programme_id: programmeId, ...result.data });

  if (error?.code === DUPLICATE) {
    return { errors: { day: `Week ${result.data.week} already has a day ${result.data.day} workout.` }, fields };
  }
  if (error) {
    console.error("adding workout failed:", error.code, error.message);
    return { formError: "Something went wrong on our side. Please try again.", fields };
  }

  // We stay on the same page, so tell Next.js its data changed and it should show the new workout.
  revalidatePath(`/trainer/programmes/${programmeId}`);
  // Keep the week (the next workout is usually in the same week); clear day and name.
  return { fields: { week: fields.week, day: "", name: "" }, savedAt: Date.now() };
}

// Removing a workout also removes its exercises (on delete cascade in the database).
export async function removeWorkout(programmeId: string, workoutId: string): Promise<void> {
  await requireRole("trainer");

  const supabase = await createClient();
  const { error } = await supabase.from("programme_workouts").delete().eq("id", workoutId);
  if (error) throw error;

  revalidatePath(`/trainer/programmes/${programmeId}`);
}
