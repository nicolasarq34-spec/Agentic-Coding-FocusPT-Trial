import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

// Supabase for server code: pages, layouts and Server Actions.
// It acts as whoever is logged in, by reading their login cookies,
// so Row Level Security applies to every query.
// Create a new one per request; never share one between visitors.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Pages can't set cookies, only Server Actions can. That's fine:
            // proxy.ts refreshes the login cookies before the page runs.
          }
        },
      },
    },
  );
}
