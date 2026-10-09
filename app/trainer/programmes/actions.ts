"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import { validateProgramme, type ProgrammeField, type ProgrammeInput } from "@/lib/programmes/validate-programme";

// What the programme form gets back when something needs fixing. Same shape as the exercise form.
export type ProgrammeFormState = {
  errors?: Partial<Record<ProgrammeField, string>>;
  formError?: string;
  fields?: ProgrammeInput;
};

export async function createProgramme(_prevState: ProgrammeFormState, formData: FormData): Promise<ProgrammeFormState> {
  await requireRole("trainer");

  const fields = readForm(formData);
  const result = validateProgramme(fields);
  if (!result.ok) return { errors: result.errors, fields };

  const supabase = await createClient();
  // No trainer_id: the database fills it in with whoever is logged in.
  const { error } = await supabase.from("programmes").insert(result.data);

  if (error) return saveFailed(error, "adding", fields);

  redirect("/trainer/programmes");
}

// The edit page pre-fills the id with .bind, like updateExercise.
export async function updateProgramme(
  id: string,
  _prevState: ProgrammeFormState,
  formData: FormData,
): Promise<ProgrammeFormState> {
  await requireRole("trainer");

  const fields = readForm(formData);
  const result = validateProgramme(fields);
  if (!result.ok) return { errors: result.errors, fields };

  const supabase = await createClient();
  // RLS silently skips other trainers' rows, so ask for the updated row back to know it worked.
  const { data, error } = await supabase.from("programmes").update(result.data).eq("id", id).select("id");

  if (error) return saveFailed(error, "updating", fields);
  if (data.length === 0) {
    return { formError: "This programme doesn’t exist any more, or isn’t yours.", fields };
  }

  redirect("/trainer/programmes");
}

// Programme names don't have to be unique, so any database error is a problem on our side.
function saveFailed(
  error: { code: string; message: string },
  action: "adding" | "updating",
  fields: ProgrammeInput,
): ProgrammeFormState {
  console.error(`${action} programme failed:`, error.code, error.message);
  return { formError: "Something went wrong on our side. Please try again.", fields };
}

function readForm(formData: FormData): ProgrammeInput {
  return {
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
  };
}
