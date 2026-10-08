import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { homePathForRole } from "@/lib/auth/home-path";

// "/" has no page of its own: it sends you where you belong.
// Reading the login cookie must happen inside <Suspense> (because of cacheComponents in next.config.ts).
export default function Home() {
  return (
    <Suspense>
      <SendToHome />
    </Suspense>
  );
}

// Returns `never` because redirect() always stops here and never shows anything.
async function SendToHome(): Promise<never> {
  const profile = await getCurrentProfile();
  redirect(profile ? homePathForRole(profile.role) : "/login");
}
