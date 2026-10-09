import { describe, expect, it } from "vitest";
import { validateWorkout } from "@/lib/programmes/validate-workout";

describe("validateWorkout", () => {
  it("turns the form's text into numbers and tidies the name", () => {
    const result = validateWorkout({ week: "2", day: "3", name: " Lower body " });
    expect(result).toEqual({ ok: true, data: { week: 2, day: 3, name: "Lower body" } });
  });

  it("stores an empty name as nothing", () => {
    const result = validateWorkout({ week: "1", day: "1", name: "" });
    expect(result).toEqual({ ok: true, data: { week: 1, day: 1, name: null } });
  });

  it.each(["", "0", "-1", "1.5", "two", "100"])("rejects week %j", (week) => {
    const result = validateWorkout({ week, day: "1", name: "" });
    expect(result).toEqual({ ok: false, errors: { week: "Enter a week from 1 to 52." } });
  });

  it.each(["", "0", "8", "Monday"])("rejects day %j", (day) => {
    const result = validateWorkout({ week: "1", day, name: "" });
    expect(result).toEqual({ ok: false, errors: { day: "Choose a day." } });
  });
});
