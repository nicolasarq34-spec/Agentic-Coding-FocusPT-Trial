import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Shared by every database test. Each test signs up brand-new fake users, so tests never
// depend on each other or on seed data. The database's own rules (RLS) are what we're checking.

export function newClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function signUp(role: string, name: string) {
  const client = newClient();
  const email = `test-${role}-${crypto.randomUUID()}@example.com`;
  const { data, error } = await client.auth.signUp({
    email,
    password: "test-password-123",
    options: { data: { role, name } },
  });
  return { client, userId: data.user?.id, error };
}
