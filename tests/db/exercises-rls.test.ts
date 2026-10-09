import { describe, expect, it } from "vitest";
import { newClient, signUp } from "./helpers";

// Exercises belong to one trainer. Nobody else can see or change them.

describe("exercises", () => {
  it("lets a trainer add an exercise and see it", async () => {
    const tara = await signUp("trainer", "Test Trainer A");

    const { error } = await tara.client.from("exercises").insert({ name: "Back squat" });
    expect(error).toBeNull();

    const { data } = await tara.client.from("exercises").select("name, trainer_id");
    expect(data).toEqual([{ name: "Back squat", trainer_id: tara.userId }]);
  });

  it("hides one trainer's exercises from another trainer", async () => {
    const tara = await signUp("trainer", "Test Trainer B");
    const theo = await signUp("trainer", "Test Trainer C");
    await tara.client.from("exercises").insert({ name: "Bench press" });

    const { data } = await theo.client.from("exercises").select("id");
    expect(data).toEqual([]);
  });

  it("doesn't let another trainer rename someone else's exercise", async () => {
    const tara = await signUp("trainer", "Test Trainer D");
    const theo = await signUp("trainer", "Test Trainer E");
    const { data: exercise } = await tara.client.from("exercises").insert({ name: "Deadlift" }).select("id").single();

    await theo.client.from("exercises").update({ name: "Hacked" }).eq("id", exercise!.id);

    const { data } = await tara.client.from("exercises").select("name").eq("id", exercise!.id).single();
    expect(data?.name).toBe("Deadlift");
  });

  it("doesn't let a client add an exercise", async () => {
    const cleo = await signUp("client", "Test Client A");

    const { error } = await cleo.client.from("exercises").insert({ name: "Sneaky curl" });
    expect(error?.code).toBe("42501"); // Postgres code for "a security rule said no"
  });

  it("shows nothing to someone who isn't logged in", async () => {
    const tara = await signUp("trainer", "Test Trainer F");
    await tara.client.from("exercises").insert({ name: "Pull-up" });

    const { data } = await newClient().from("exercises").select("id");
    expect(data).toEqual([]);
  });

  it("rejects the same name twice for one trainer, even in different case", async () => {
    const tara = await signUp("trainer", "Test Trainer G");
    await tara.client.from("exercises").insert({ name: "Overhead press" });

    const { error } = await tara.client.from("exercises").insert({ name: "overhead press" });
    expect(error?.code).toBe("23505"); // Postgres code for "unique rule broken"
  });

  it("rejects a video link that isn't a web address", async () => {
    const tara = await signUp("trainer", "Test Trainer H");

    const { error } = await tara.client.from("exercises").insert({ name: "Lunge", video_url: "not a link" });
    expect(error?.code).toBe("23514"); // Postgres code for "a check rule broken"
  });
});
