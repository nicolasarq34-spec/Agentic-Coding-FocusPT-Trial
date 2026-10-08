# Decisions

Technical decisions and why we made them. Newest at the bottom.

## 2026-10-07 · Project setup

- **Created the app with `create-next-app` in a subfolder, then moved it up.** npm project names can't contain spaces or capitals, and the folder is called `Agentic Workspace`.
- **`typecheck` runs `next typegen` before `tsc`.** Next.js 16 generates some types (like `LayoutProps`) into `.next/`. Without `typegen` the check fails whenever `.next/` is missing.
- **`@types/node` upgraded from 20 to 24.** It should match the Node version we actually run (24), and Vitest 5 requires it.
- **Vitest without React Testing Library for now.** We only test pure functions (`/lib/progress`) so far. Add component-testing packages when we first need them.
- **Playwright with Chromium only, on a desktop and a phone screen.** Clients use phones; one browser engine keeps the download small. Add Firefox/WebKit later if needed.
- **Did not approve npm's blocked install script for `unrs-resolver`.** Lint works without it. Revisit only if something breaks.

## 2026-10-07/08 · Design system

- **A small design system before feature 1.** Sign-up and log-in need buttons, inputs and cards. Building them once from shared tokens keeps every later screen consistent. Living style guide: `/design`.
- **shadcn/ui for components.** It copies component code into `components/ui/`, so we own and edit it (e.g. pill shape and touch sizes in `button.tsx`). Add a component only when a feature needs it.
- **Tokens start from the FocusPT design system**: teal brand hue, ink and surface neutrals, Space Grotesk for headings and Inter for reading, the FocusPT type scale and spacing steps. Each token in `app/globals.css` names its FocusPT source. Values FocusPT lacks (`muted`, raised card, chart colours) are marked "not in FocusPT".
- **Shape and mood taken from Pillowtalk and Future Pro (Mobbin references), consciously diverging from FocusPT.** Dark-first, pill buttons and inputs, soft cards (radius 12/20/28px), bigger headings. We borrowed *patterns*, not brand: kept teal instead of Pillowtalk's lime (FocusPT says "no neon"), and kept Space Grotesk instead of Future's serif.
- **Dark-first, light kept for later.** Dark is the default for everyone; the light set lives under `[data-theme="light"]`, ready for a toggle. The phone's status bar and native controls are told the page is dark (`viewport` in `app/layout.tsx`).
- **Sizes follow the pointer, not the screen width.** `pointer-coarse:` (finger) makes buttons and option rows 44–56px tall; with a mouse they're 32–44px. A screen width can't tell an iPad from a small laptop; the pointer type can. An e2e test guards this.
- **Two page widths:** `max-w-reading` (640px) for client screens and forms, `max-w-app` (1200px) for trainer screens. Trainers mostly use laptops, clients mostly phones.
- **Option row is a styled radio button** (decided in feature 1). A hidden `<input type="radio">` inside a `<label>`; the row styles itself from it with `has-checked:`. The browser gives us one-at-a-time selection, arrow keys, screen-reader announcements ("radio button, 1 of 2") and the value in the form, with no React state.
- **Patterns saved for later features:** one-question-per-screen onboarding with a progress bar; Future's big workout-logging tiles (Weight / Reps / Record) for feature 5; bottom tab bar on phones, sidebar on desktop.

## 2026-10-08 · Feature 1: sign-up and log-in

- **Local Supabase first, in Docker.** We build against a database on this computer (`npx supabase start`) and add the cloud project (EU region) when we deploy. Mistakes stay local, `db reset` rebuilds everything in seconds, and nothing costs money.
- **The role lives in `profiles`, created by a database trigger.** Sign-up sends the role and name as metadata; `handle_new_user()` turns them into a profile row. The app never inserts profiles itself, so every account has one, and an invalid role makes the whole sign-up fail.
- **The role is an enum (`user_role`)**, so the database only accepts `trainer` or `client`, and TypeScript gets the same two values from the generated types.
- **No insert, update or delete policies on `profiles` yet.** Row Level Security lets people read their own row (and trainers their clients' rows). Nobody can change their role or name for now. We'll add a narrow update policy when there's an "edit profile" screen.
- **Client ↔ trainer link waits for feature 4.** `trainer_id` exists but stays empty, in sign-up and in the seed.
- **Three layers of protection.** `proxy.ts` (Next.js 16's new name for `middleware.ts`) refreshes the login cookie and sends logged-out visitors to `/login`: a quick first check. Each page then checks the role with `requireRole()` (`lib/auth/current-profile.ts`). Row Level Security protects the data itself, even if a page forgets to check.
- **One place answers "who is logged in?"**: `getCurrentProfile()` in `lib/auth/current-profile.ts`. It uses `getClaims()`, which checks the login token is genuine, never only what the cookie says.
- **Pages that read the login sit inside `<Suspense>`, and `getCurrentProfile()` calls `await connection()` first.** We use `cacheComponents`, so Next.js sends each page's static part instantly and streams in the logged-in part. Supabase checks token expiry against the clock, which Next.js forbids while preparing pages ahead of time; `connection()` marks it as live-request-only.
- **Log-in and sign-up send logged-in people home**, and `/` has no page of its own: it redirects to `/login` or the role's home.
- **Log-in gives the same error for an unknown email and a wrong password**, so the form can't be used to find out who has an account.
- **Option row stays a radio button, not `aria-pressed` buttons** (revisited in step 4). The form gets the chosen role for free, and screen readers announce it as a choice of one.
- **Seed users are inserted into `auth.users` + `auth.identities`**, the same way Supabase Auth creates them, so the trigger builds their profiles. One shared dev-only password, written in `supabase/seed.sql`. Fake people with `@example.com` emails only.
