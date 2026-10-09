import { requireRole } from "@/lib/auth/current-profile";
import type { Role } from "@/lib/auth/home-path";

// For pages whose content doesn't depend on who's logged in (like an empty form),
// but that still belong to one role. Shows nothing; sends anyone else away.
// Put it inside <Suspense>, because it reads the login cookie.
export async function RequireRole({ role }: { role: Role }) {
  await requireRole(role);
  return null;
}
