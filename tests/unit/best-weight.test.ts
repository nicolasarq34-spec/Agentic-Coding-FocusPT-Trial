import { describe, expect, it } from "vitest";
import { bestWeight } from "@/lib/progress/best-weight";

describe("bestWeight", () => {
  it("returns the heaviest weight lifted", () => {
    const sets = [
      { reps: 8, weight: 60 },
      { reps: 5, weight: 80 },
      { reps: 6, weight: 70 },
    ];
    expect(bestWeight(sets)).toBe(80);
  });

  it("ignores sets where no reps were done", () => {
    const sets = [
      { reps: 5, weight: 80 },
      { reps: 0, weight: 100 },
    ];
    expect(bestWeight(sets)).toBe(80);
  });

  it("returns null when there are no sets", () => {
    expect(bestWeight([])).toBeNull();
  });
});
