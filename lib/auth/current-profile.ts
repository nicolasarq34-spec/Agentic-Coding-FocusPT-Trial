import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole, type Role } from "@/lib/auth/home-path";

// The one place pages ask "who is logged in?". Returns their profile, or null when nobody is.
// getClaims() checks the login token is genuine; Row Level Security then only lets us read our own row.
export async function getCurrentProfile() {
  // Only answer this for a real, live request. Supabase checks the token's expiry against the clock,
  // and Next.js won't let pages read the clock while preparing them ahead of time.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase.from("profiles").select("id, role, name").eq("id", userId).maybeSingle();
  return profile;
}

// For pages that belong to one role. Logged out → /login; the other role → their own home.
export async function requireRole(role: Role) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== role) redirect(homePathForRole(profile.role));
  return profile;
}
