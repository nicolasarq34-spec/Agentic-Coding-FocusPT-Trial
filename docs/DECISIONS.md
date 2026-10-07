# Decisions

Technical decisions and why we made them. Newest at the bottom.

## 2026-10-07 · Project setup

- **Created the app with `create-next-app` in a subfolder, then moved it up.** npm project names can't contain spaces or capitals, and the folder is called `Agentic Workspace`.
- **`typecheck` runs `next typegen` before `tsc`.** Next.js 16 generates some types (like `LayoutProps`) into `.next/`. Without `typegen` the check fails whenever `.next/` is missing.
- **`@types/node` upgraded from 20 to 24.** It should match the Node version we actually run (24), and Vitest 5 requires it.
- **Vitest without React Testing Library for now.** We only test pure functions (`/lib/progress`) so far. Add component-testing packages when we first need them.
- **Playwright with Chromium only, on a desktop and a phone screen.** Clients use phones; one browser engine keeps the download small. Add Firefox/WebKit later if needed.
- **Did not approve npm's blocked install script for `unrs-resolver`.** Lint works without it. Revisit only if something breaks.
