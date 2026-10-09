// The database gives a flat list of workouts; the programme page shows them under "Week 1", "Week 2"...
// Generic (<T>) so whatever else a workout carries (name, exercises) comes along untouched.
export function groupByWeek<T extends { week: number; day: number }>(workouts: T[]): { week: number; workouts: T[] }[] {
  const sorted = [...workouts].sort((a, b) => a.week - b.week || a.day - b.day);
  const weeks: { week: number; workouts: T[] }[] = [];

  for (const workout of sorted) {
    const last = weeks.at(-1);
    if (last?.week === workout.week) last.workouts.push(workout);
    else weeks.push({ week: workout.week, workouts: [workout] });
  }
  return weeks;
}
