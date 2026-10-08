import { logOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

// The top of every logged-in page: the app name and a way out.
// Log out is a tiny form, so it works even before the page's JavaScript has loaded.
export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <p className="font-display text-label text-primary">Coach Lab</p>
      <form action={logOut}>
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </header>
  );
}
