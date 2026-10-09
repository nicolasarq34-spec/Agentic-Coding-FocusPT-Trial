import { parseWholeNumber } from "./parse-number";

export type WorkoutInput = {
  week: string;
  day: string;
  name: string;
};

export type WorkoutField = keyof WorkoutInput;

export type WorkoutResult =
  | { ok: true; data: { week: number; day: number; name: string | null } }
  | { ok: false; errors: Partial<Record<WorkoutField, string>> };

// Checks the "add workout" form. Week 1–52 (a year is plenty); day 1–7, Monday first.
export function validateWorkout(input: WorkoutInput): WorkoutResult {
  const week = parseWholeNumber(input.week, 1, 52);
  const day = parseWholeNumber(input.day, 1, 7);
  const name = input.name.trim() || null;
  const errors: Partial<Record<WorkoutField, string>> = {};

  if (week === null) errors.week = "Enter a week from 1 to 52.";
  if (day === null) errors.day = "Choose a day.";

  if (week === null || day === null) return { ok: false, errors };
  return { ok: true, data: { week, day, name } };
}
