import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js runs this before every request that matches `config.matcher` below.
// (Next.js 16 renamed this file from middleware.ts to proxy.ts.)
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Every page, but not Next.js's own files or images (they don't need a login check).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
