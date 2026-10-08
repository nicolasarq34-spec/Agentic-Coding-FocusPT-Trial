import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { homePathForRole } from "@/lib/auth/home-path";

// For log-in and sign-up: someone already logged in goes to their home instead.
// Shows nothing. Put it inside <Suspense>, because it reads the login cookie.
export async function SendHomeIfLoggedIn() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));
  return null;
}
