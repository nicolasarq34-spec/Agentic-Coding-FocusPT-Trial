import { describe, expect, it } from "vitest";
import { groupByWeek } from "@/lib/programmes/group-by-week";

describe("groupByWeek", () => {
  it("puts workouts under their week, weeks and days in order", () => {
    const workouts = [
      { id: "c", week: 2, day: 1 },
      { id: "b", week: 1, day: 3 },
      { id: "a", week: 1, day: 1 },
    ];
    expect(groupByWeek(workouts)).toEqual([
      { week: 1, workouts: [{ id: "a", week: 1, day: 1 }, { id: "b", week: 1, day: 3 }] },
      { week: 2, workouts: [{ id: "c", week: 2, day: 1 }] },
    ]);
  });

  it("skips weeks with no workouts instead of showing them empty", () => {
    const weeks = groupByWeek([{ week: 1, day: 1 }, { week: 3, day: 1 }]);
    expect(weeks.map((w) => w.week)).toEqual([1, 3]);
  });

  it("returns nothing for a programme with no workouts", () => {
    expect(groupByWeek([])).toEqual([]);
  });

  it("keeps everything else about each workout", () => {
    const [week] = groupByWeek([{ week: 1, day: 2, name: "Lower body", extra: [1, 2] }]);
    expect(week.workouts[0]).toEqual({ week: 1, day: 2, name: "Lower body", extra: [1, 2] });
  });
});
