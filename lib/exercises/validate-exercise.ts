export type ExerciseInput = {
  name: string;
  description: string;
  videoUrl: string;
};

export type ExerciseField = keyof ExerciseInput;

// `data` uses the database's column names, so it can go straight into an insert or update.
export type ExerciseResult =
  | { ok: true; data: { name: string; description: string | null; video_url: string | null } }
  | { ok: false; errors: Partial<Record<ExerciseField, string>> };

// Checks the exercise form before it reaches the database.
// The database has the same rules as a safety net; this gives friendly messages next to each field.
export function validateExercise(input: ExerciseInput): ExerciseResult {
  const name = input.name.trim();
  const description = input.description.trim() || null;
  const videoUrl = input.videoUrl.trim() || null;
  const errors: Partial<Record<ExerciseField, string>> = {};

  if (!name) errors.name = "Enter a name.";
  if (videoUrl && !isWebAddress(videoUrl)) errors.videoUrl = "Paste the full link, starting with https://";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, description, video_url: videoUrl } };
}

// Only http(s) links, so a "link" can't be something like javascript:... that runs code when clicked.
function isWebAddress(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
