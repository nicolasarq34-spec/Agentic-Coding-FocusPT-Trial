import type { Role } from "@/lib/auth/home-path";

export type SignUpInput = {
  role: string | null;
  name: string;
  email: string;
  password: string;
};

export type SignUpField = keyof SignUpInput;

export type SignUpResult =
  | { ok: true; data: { role: Role; name: string; email: string; password: string } }
  | { ok: false; errors: Partial<Record<SignUpField, string>> };

export const MIN_PASSWORD_LENGTH = 8;

// Checks the sign-up form before we ask Supabase to create the account.
// Returns every problem at once, in words a person can act on.
export function validateSignUp(input: SignUpInput): SignUpResult {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const role: Role | null = input.role === "trainer" || input.role === "client" ? input.role : null;
  const errors: Partial<Record<SignUpField, string>> = {};

  if (!role) errors.role = "Choose trainer or client.";
  if (!name) errors.name = "Enter your name.";
  // A light check (something@something.something). Supabase does the real one.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email, like name@example.com.";
  if (input.password.length < MIN_PASSWORD_LENGTH) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;

  if (!role || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { role, name, email, password: input.password } };
}
