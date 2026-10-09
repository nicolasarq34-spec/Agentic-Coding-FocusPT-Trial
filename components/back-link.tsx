import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// The small "‹ Exercises" link above a page title, back to the page one level up.
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-6 inline-flex items-center gap-1 text-body-small text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="size-4" aria-hidden />
      {children}
    </Link>
  );
}
