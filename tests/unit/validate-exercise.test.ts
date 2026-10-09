import { describe, expect, it } from "vitest";
import { validateExercise } from "@/lib/exercises/validate-exercise";

const valid = { name: "Back squat", description: "Bar on upper back, sit between the heels.", videoUrl: "https://youtube.com/watch?v=abc" };

describe("validateExercise", () => {
  it("accepts a complete form and tidies the spaces", () => {
    const result = validateExercise({ name: "  Back squat ", description: " Keep the chest up. ", videoUrl: " https://youtube.com/watch?v=abc " });
    expect(result).toEqual({
      ok: true,
      data: { name: "Back squat", description: "Keep the chest up.", video_url: "https://youtube.com/watch?v=abc" },
    });
  });

  it("accepts just a name, storing the empty extras as nothing", () => {
    const result = validateExercise({ name: "Plank", description: "  ", videoUrl: "" });
    expect(result).toEqual({ ok: true, data: { name: "Plank", description: null, video_url: null } });
  });

  it("asks for a name when it's empty or only spaces", () => {
    const result = validateExercise({ ...valid, name: "   " });
    expect(result).toMatchObject({ ok: false, errors: { name: "Enter a name." } });
  });

  it("rejects a video link that isn't a web address", () => {
    const result = validateExercise({ ...valid, videoUrl: "youtube.com/watch?v=abc" });
    expect(result).toMatchObject({
      ok: false,
      errors: { videoUrl: "Paste the full link, starting with https://" },
    });
  });

  it("rejects links that aren't http or https", () => {
    const result = validateExercise({ ...valid, videoUrl: "javascript:alert(1)" });
    expect(result).toMatchObject({ ok: false, errors: { videoUrl: "Paste the full link, starting with https://" } });
  });

  it("reports every problem at once", () => {
    const result = validateExercise({ name: "", description: "", videoUrl: "nope" });
    expect(result).toEqual({
      ok: false,
      errors: { name: "Enter a name.", videoUrl: "Paste the full link, starting with https://" },
    });
  });
});
