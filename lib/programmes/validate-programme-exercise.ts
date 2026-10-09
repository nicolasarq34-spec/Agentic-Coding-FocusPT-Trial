import { parseWeight, parseWholeNumber } from "./parse-number";

export type ProgrammeExerciseInput = {
  exerciseId: string;
  sets: string;
  reps: string;
  weight: string;
};

export type ProgrammeExerciseField = keyof ProgrammeExerciseInput;

// `data` uses the database's column names, so it can go straight into an insert or update.
export type ProgrammeExerciseResult =
  | {
      ok: true;
      data: { exercise_id: string; target_sets: number; target_reps: number; target_weight: number | null };
    }
  | { ok: false; errors: Partial<Record<ProgrammeExerciseField, string>> };

// Checks one exercise in a workout: which exercise, and its target sets × reps @ weight.
// An empty weight means bodyweight (pull-ups, planks), so it's allowed and stored as null.
export function validateProgrammeExercise(input: ProgrammeExerciseInput): ProgrammeExerciseResult {
  const exerciseId = input.exerciseId.trim();
  const sets = parseWholeNumber(input.sets, 1, 9);
  const reps = parseWholeNumber(input.reps, 1, 99);
  const weightText = input.weight.trim();
  const weight = weightText ? parseWeight(weightText) : null;
  const errors: Partial<Record<ProgrammeExerciseField, string>> = {};

  if (!exerciseId) errors.exerciseId = "Choose an exercise.";
  if (sets === null) errors.sets = "Enter a whole number from 1 to 9.";
  if (reps === null) errors.reps = "Enter a whole number from 1 to 99.";
  if (weightText && weight === null) errors.weight = "Enter kg like 80 or 82.5, or leave empty for bodyweight.";

  if (!exerciseId || sets === null || reps === null || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { exercise_id: exerciseId, target_sets: sets, target_reps: reps, target_weight: weight } };
}
