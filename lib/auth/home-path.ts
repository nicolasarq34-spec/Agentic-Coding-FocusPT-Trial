import type { Database } from "@/lib/supabase/types";

export type Role = Database["public"]["Enums"]["user_role"];

// Where each kind of person lands after logging in.
export function homePathForRole(role: Role): "/trainer" | "/client" {
  return role === "trainer" ? "/trainer" : "/client";
}
