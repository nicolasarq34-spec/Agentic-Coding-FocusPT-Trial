"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import { validateExercise, type ExerciseField, type ExerciseInput } from "@/lib/exercises/validate-exercise";

// What the exercise form gets back when something needs fixing.
// `fields` sends back what the trainer typed, so the form keeps it.
export type ExerciseFormState = {
  errors?: Partial<Record<ExerciseField, string>>;
  formError?: string;
  fields?: ExerciseInput;
};

// Postgres error code for "this would break a unique rule": here, a name the trainer already uses.
const DUPLICATE = "23505";

export async function createExercise(_prevState: ExerciseFormState, formData: FormData): Promise<ExerciseFormState> {
  // A Server Action can be called by anyone who finds it, so it checks who's asking, like a page does.
  await requireRole("trainer");

  const fields = readForm(formData);
  const result = validateExercise(fields);
  if (!result.ok) return { errors: result.errors, fields };

  const supabase = await createClient();
  // No trainer_id: the database fills it in with whoever is logged in.
  const { error } = await supabase.from("exercises").insert(result.data);

  if (error) return saveFailed(error, "adding", result.data.name, fields);

  redirect("/trainer/exercises");
}

// The edit page "pre-fills" the id with .bind, so the form calls this with the same two arguments as createExercise.
export async function updateExercise(
  id: string,
  _prevState: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  await requireRole("trainer");

  const fields = readForm(formData);
  const result = validateExercise(fields);
  if (!result.ok) return { errors: result.errors, fields };

  const supabase = await createClient();
  // RLS only lets a trainer update their own rows. For anyone else's id, nothing is updated
  // and no error is raised, so we ask for the updated row back to tell the difference.
  const { data, error } = await supabase.from("exercises").update(result.data).eq("id", id).select("id");

  if (error) return saveFailed(error, "updating", result.data.name, fields);
  if (data.length === 0) {
    return { formError: "This exercise doesn’t exist any more, or isn’t yours.", fields };
  }

  redirect("/trainer/exercises");
}

// Turns a database error into what the form shows: a name message for a duplicate, otherwise a general one.
function saveFailed(
  error: { code: string; message: string },
  action: "adding" | "updating",
  name: string,
  fields: ExerciseInput,
): ExerciseFormState {
  if (error.code === DUPLICATE) {
    return { errors: { name: `You already have an exercise called “${name}”.` }, fields };
  }
  console.error(`${action} exercise failed:`, error.code, error.message);
  return { formError: "Something went wrong on our side. Please try again.", fields };
}

function readForm(formData: FormData): ExerciseInput {
  return {
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    videoUrl: formData.get("videoUrl")?.toString() ?? "",
  };
}
