export type ProgrammeInput = {
  name: string;
  description: string;
};

export type ProgrammeField = keyof ProgrammeInput;

export type ProgrammeResult =
  | { ok: true; data: { name: string; description: string | null } }
  | { ok: false; errors: Partial<Record<ProgrammeField, string>> };

// Checks the programme form. The database has the same rule (a name is required) as a safety net.
export function validateProgramme(input: ProgrammeInput): ProgrammeResult {
  const name = input.name.trim();
  const description = input.description.trim() || null;

  if (!name) return { ok: false, errors: { name: "Enter a name." } };
  return { ok: true, data: { name, description } };
}
