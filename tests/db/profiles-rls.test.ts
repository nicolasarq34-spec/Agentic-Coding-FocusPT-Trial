import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Every test signs up brand-new fake users, so tests never depend on each other
// or on seed data. The database's own rules (RLS) are what we're checking.

function newClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

async function signUp(role: string, name: string) {
  const client = newClient();
  const email = `test-${role}-${crypto.randomUUID()}@example.com`;
  const { data, error } = await client.auth.signUp({
    email,
    password: "test-password-123",
    options: { data: { role, name } },
  });
  return { client, userId: data.user?.id, error };
}

describe("profiles", () => {
  it("creates a profile with the chosen role and name at sign-up", async () => {
    const { client, userId, error } = await signUp("trainer", "Test Trainer");
    expect(error).toBeNull();

    const { data } = await client.from("profiles").select("role, name").eq("id", userId!).single();
    expect(data).toEqual({ role: "trainer", name: "Test Trainer" });
  });

  it("rejects a sign-up with a role that isn't trainer or client", async () => {
    const { error } = await signUp("admin", "Sneaky Admin");
    expect(error).not.toBeNull();
  });

  it("lets a user see only their own profile", async () => {
    const alice = await signUp("client", "Test Client A");
    const bob = await signUp("client", "Test Client B");

    const { data } = await alice.client.from("profiles").select("id").eq("id", bob.userId!);
    expect(data).toEqual([]);
  });

  it("doesn't let a client change their role to trainer", async () => {
    const { client, userId } = await signUp("client", "Test Client C");

    await client.from("profiles").update({ role: "trainer" }).eq("id", userId!);

    const { data } = await client.from("profiles").select("role").eq("id", userId!).single();
    expect(data?.role).toBe("client");
  });

  it("shows nothing to someone who isn't logged in", async () => {
    await signUp("client", "Test Client D");

    const { data } = await newClient().from("profiles").select("id");
    expect(data).toEqual([]);
  });
});
