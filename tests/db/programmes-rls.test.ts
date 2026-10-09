import { describe, expect, it } from "vitest";
import { newClient, signUp } from "./helpers";

// A programme belongs to one trainer, and so does everything inside it (workouts and their exercises).
// Nobody else can see or change any of it.

// Builds a tiny programme for a trainer: one exercise, one workout (week 1, day 1), one exercise in it.
async function buildProgramme(trainer: Awaited<ReturnType<typeof signUp>>) {
  const { data: exercise } = await trainer.client
    .from("exercises")
    .insert({ name: "Back squat" })
    .select("id")
    .single();
  const { data: programme } = await trainer.client
    .from("programmes")
    .insert({ name: "Strength block" })
    .select("id")
    .single();
  const { data: workout } = await trainer.client
    .from("programme_workouts")
    .insert({ programme_id: programme!.id, week: 1, day: 1, name: "Lower body" })
    .select("id")
    .single();
  const { data: item } = await trainer.client
    .from("programme_exercises")
    .insert({ workout_id: workout!.id, exercise_id: exercise!.id, position: 1, target_sets: 3, target_reps: 5, target_weight: 80 })
    .select("id")
    .single();
  return { exerciseId: exercise!.id, programmeId: programme!.id, workoutId: workout!.id, itemId: item!.id };
}

describe("programmes", () => {
  it("lets a trainer build a programme and see all of it", async () => {
    const tara = await signUp("trainer", "Test Trainer A");
    await buildProgramme(tara);

    const { data } = await tara.client
      .from("programmes")
      .select("name, trainer_id, programme_workouts(week, day, programme_exercises(target_sets, target_reps, target_weight))");
    expect(data).toEqual([
      {
        name: "Strength block",
        trainer_id: tara.userId,
        programme_workouts: [{ week: 1, day: 1, programme_exercises: [{ target_sets: 3, target_reps: 5, target_weight: 80 }] }],
      },
    ]);
  });

  it("hides a trainer's programme, workouts and exercises from another trainer", async () => {
    const tara = await signUp("trainer", "Test Trainer B");
    const theo = await signUp("trainer", "Test Trainer C");
    await buildProgramme(tara);

    expect((await theo.client.from("programmes").select("id")).data).toEqual([]);
    expect((await theo.client.from("programme_workouts").select("id")).data).toEqual([]);
    expect((await theo.client.from("programme_exercises").select("id")).data).toEqual([]);
  });

  it("doesn't let another trainer change or remove anything inside someone else's programme", async () => {
    const tara = await signUp("trainer", "Test Trainer D");
    const theo = await signUp("trainer", "Test Trainer E");
    const { programmeId, workoutId, itemId } = await buildProgramme(tara);

    await theo.client.from("programmes").update({ name: "Hacked" }).eq("id", programmeId);
    await theo.client.from("programme_exercises").update({ target_reps: 99 }).eq("id", itemId);
    await theo.client.from("programme_workouts").delete().eq("id", workoutId);

    const { data } = await tara.client
      .from("programmes")
      .select("name, programme_workouts(programme_exercises(target_reps))")
      .eq("id", programmeId)
      .single();
    expect(data).toEqual({ name: "Strength block", programme_workouts: [{ programme_exercises: [{ target_reps: 5 }] }] });
  });

  it("doesn't let another trainer add a workout to someone else's programme", async () => {
    const tara = await signUp("trainer", "Test Trainer F");
    const theo = await signUp("trainer", "Test Trainer G");
    const { programmeId } = await buildProgramme(tara);

    const { error } = await theo.client.from("programme_workouts").insert({ programme_id: programmeId, week: 2, day: 1 });
    expect(error?.code).toBe("42501"); // Postgres code for "a security rule said no"
  });

  it("doesn't let a trainer put another trainer's exercise in their workout", async () => {
    const tara = await signUp("trainer", "Test Trainer H");
    const theo = await signUp("trainer", "Test Trainer I");
    const { exerciseId: tarasExercise } = await buildProgramme(tara);
    const { workoutId: theosWorkout } = await buildProgramme(theo);

    const { error } = await theo.client
      .from("programme_exercises")
      .insert({ workout_id: theosWorkout, exercise_id: tarasExercise, position: 2, target_sets: 3, target_reps: 5 });
    expect(error?.code).toBe("42501");
  });

  it("doesn't let a client create a programme", async () => {
    const cleo = await signUp("client", "Test Client A");

    const { error } = await cleo.client.from("programmes").insert({ name: "Sneaky plan" });
    expect(error?.code).toBe("42501");
  });

  it("shows nothing to someone who isn't logged in", async () => {
    const tara = await signUp("trainer", "Test Trainer J");
    await buildProgramme(tara);

    const anonymous = newClient();
    expect((await anonymous.from("programmes").select("id")).data).toEqual([]);
    expect((await anonymous.from("programme_workouts").select("id")).data).toEqual([]);
    expect((await anonymous.from("programme_exercises").select("id")).data).toEqual([]);
  });

  it("allows only one workout per day of a week", async () => {
    const tara = await signUp("trainer", "Test Trainer K");
    const { programmeId } = await buildProgramme(tara);

    const { error } = await tara.client.from("programme_workouts").insert({ programme_id: programmeId, week: 1, day: 1 });
    expect(error?.code).toBe("23505"); // Postgres code for "unique rule broken"
  });

  it("rejects a day outside 1–7 and zero sets", async () => {
    const tara = await signUp("trainer", "Test Trainer L");
    const { programmeId, workoutId, exerciseId } = await buildProgramme(tara);

    const badDay = await tara.client.from("programme_workouts").insert({ programme_id: programmeId, week: 1, day: 8 });
    expect(badDay.error?.code).toBe("23514"); // Postgres code for "a check rule broken"

    const noSets = await tara.client
      .from("programme_exercises")
      .insert({ workout_id: workoutId, exercise_id: exerciseId, position: 2, target_sets: 0, target_reps: 5 });
    expect(noSets.error?.code).toBe("23514");
  });

  it("removes a workout's exercises when the workout is removed", async () => {
    const tara = await signUp("trainer", "Test Trainer M");
    const { workoutId } = await buildProgramme(tara);

    const { error } = await tara.client.from("programme_workouts").delete().eq("id", workoutId);
    expect(error).toBeNull();
    expect((await tara.client.from("programme_exercises").select("id")).data).toEqual([]);
  });
});
