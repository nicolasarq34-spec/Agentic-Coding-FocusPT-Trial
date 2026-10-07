export type LoggedSet = {
  reps: number;
  weight: number;
};

/** Heaviest weight in sets where at least one rep was done, or null if none. */
export function bestWeight(sets: LoggedSet[]): number | null {
  const completed = sets.filter((set) => set.reps > 0);
  if (completed.length === 0) return null;
  return Math.max(...completed.map((set) => set.weight));
}
