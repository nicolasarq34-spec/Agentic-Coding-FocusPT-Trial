import { describe, expect, it } from "vitest";
import { validateProgramme } from "@/lib/programmes/validate-programme";

describe("validateProgramme", () => {
  it("accepts a name and description, tidying the spaces", () => {
    const result = validateProgramme({ name: "  Strength block ", description: " Four weeks. " });
    expect(result).toEqual({ ok: true, data: { name: "Strength block", description: "Four weeks." } });
  });

  it("stores an empty description as nothing", () => {
    const result = validateProgramme({ name: "Strength block", description: "   " });
    expect(result).toEqual({ ok: true, data: { name: "Strength block", description: null } });
  });

  it("asks for a name when it's empty or only spaces", () => {
    const result = validateProgramme({ name: "  ", description: "" });
    expect(result).toEqual({ ok: false, errors: { name: "Enter a name." } });
  });
});
