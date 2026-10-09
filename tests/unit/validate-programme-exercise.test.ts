import { describe, expect, it } from "vitest";
import { validateProgrammeExercise } from "@/lib/programmes/validate-programme-exercise";

const valid = { exerciseId: "6f1c0d2e-0000-4000-a000-000000000001", sets: "3", reps: "5", weight: "80" };

describe("validateProgrammeExercise", () => {
  it("turns the form's text into numbers, using the database's column names", () => {
    expect(validateProgrammeExercise(valid)).toEqual({
      ok: true,
      data: { exercise_id: valid.exerciseId, target_sets: 3, target_reps: 5, target_weight: 80 },
    });
  });

  it("stores an empty weight as nothing (bodyweight)", () => {
    const result = validateProgrammeExercise({ ...valid, weight: " " });
    expect(result).toMatchObject({ ok: true, data: { target_weight: null } });
  });

  it("accepts a decimal weight written with a point or a comma", () => {
    expect(validateProgrammeExercise({ ...valid, weight: "82.5" })).toMatchObject({ data: { target_weight: 82.5 } });
    expect(validateProgrammeExercise({ ...valid, weight: "82,5" })).toMatchObject({ data: { target_weight: 82.5 } });
  });


  it("accepts the largest targets: 9 sets, 99 reps, 999.99 kg", () => {
    const result = validateProgrammeExercise({ ...valid, sets: "9", reps: "99", weight: "999.99" });
    expect(result).toMatchObject({ ok: true, data: { target_sets: 9, target_reps: 99, target_weight: 999.99 } });
  });

  it("asks to choose an exercise", () => {
    const result = validateProgrammeExercise({ ...valid, exerciseId: "" });
    expect(result).toEqual({ ok: false, errors: { exerciseId: "Choose an exercise." } });
  });

  it.each(["", "0", "2.5", "three", "10"])("rejects sets %j", (sets) => {
    const result = validateProgrammeExercise({ ...valid, sets });
    expect(result).toEqual({ ok: false, errors: { sets: "Enter a whole number from 1 to 9." } });
  });

  it.each(["", "0", "-5", "100"])("rejects reps %j", (reps) => {
    const result = validateProgrammeExercise({ ...valid, reps });
    expect(result).toEqual({ ok: false, errors: { reps: "Enter a whole number from 1 to 99." } });
  });

  it.each(["-10", "heavy", "82.555", "1000"])("rejects weight %j", (weight) => {
    const result = validateProgrammeExercise({ ...valid, weight });
    expect(result).toEqual({ ok: false, errors: { weight: "Enter kg like 80 or 82.5, or leave empty for bodyweight." } });
  });

  it("reports every problem at once", () => {
    const result = validateProgrammeExercise({ exerciseId: "", sets: "", reps: "", weight: "x" });
    expect(result).toMatchObject({ ok: false });
    expect(Object.keys(result.ok ? {} : result.errors).sort()).toEqual(["exerciseId", "reps", "sets", "weight"]);
  });
});
