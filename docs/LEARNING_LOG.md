# Learning log

What was built, what was learned, what's next. Newest at the bottom.

## 2026-10-07 · Session 1: setting up the workshop

- **Built:** installed Node.js, Docker Desktop and WSL; created the Next.js project; connected it to GitHub; added `typecheck`, `test` (Vitest) and `test:e2e` (Playwright) commands.
- **Learned:** git is a save-game system (commit = snapshot, push = upload to GitHub). Every command ends with an exit code (0 = success). A check is only useful if you've seen it fail.
- **Learned:** debugging means reading the first line of the error and finding what the thing depends on. Docker hung because WSL was missing; `npx` was blocked by a Windows script setting; npm refused Vitest because two packages wanted different versions of the Node types.
- **Learned:** write the test first, watch it fail, then write the code (`bestWeight` in `lib/progress`).
- **Next:** feature 1, sign-up and log-in with a trainer or client role (Supabase Auth).

## 2026-10-07/08 · Session 2: design system

- **Built:** a design system on `feat/design-system`: FocusPT tokens reshaped dark-first after Pillowtalk and Future Pro, shadcn/ui pill buttons that grow for fingers and shrink for a mouse, an option row (trainer/client), two page widths, a `/design` style guide, and e2e tests for button sizes and the option row.
- **Learned:** design tokens are named values every component reads. Changing one file flipped the whole app to dark. Code generators (like `shadcn init`) overwrite your files, so commit first and read the diff after.
- **Learned:** debugging by checking each layer. Stale styles were the `.next` build cache (delete it, restart). The red hydration error was a browser extension (Bitdefender) adding attributes, proven by opening Incognito. The dev server stops when the app closes; start it with `npm run dev`.
- **Learned:** a test should be able to fail. My first button test would have passed even with touch sizing broken, so it was tightened to check 56px. References from real apps are evidence for *patterns*, not for brand.
- **Next:** feature 1, sign-up and log-in with Supabase Auth, using the option row for the role and adding input, label, card and alert components (pill inputs) as the form needs them.

## 2026-10-08 · Session 3: feature 1, sign-up and log-in

- **Built:** sign-up with a trainer/client choice, log-in, log-out, and a home page for each role, on `feat/auth`. Local Supabase in Docker, a `profiles` table with Row Level Security, seed data (1 trainer, 3 clients) and an end-to-end test of the whole flow.
- **Learned:** a migration is the database's history, written as SQL files; `db reset` replays them. Row Level Security means the database itself checks who's asking, so a bug in a page can't leak someone else's data. Secrets live in `.env.local`, never in git.
- **Learned:** Server Actions let a form call server code directly. A session cookie is how the app remembers you're logged in. With `cacheComponents`, a page is a static shell sent instantly plus logged-in parts streamed in behind `<Suspense>`.
- **Learned:** debugging again. A "1 issue" badge led to Supabase reading the clock; the fix came from the Next.js docs, and the server log proved it worked. A failing test isn't always a broken app: one matched Next.js's hidden route announcer, so the test was fixed, not the code.
- **Next:** open the pull request for `feat/auth` and merge it, then feature 2, the exercise library (clear context first).

## 2026-10-09 · Session 4: feature 2, exercise library

- **Built:** the exercise library on `feat/exercise-library`: an `exercises` table with Row Level Security, form validation, list, add and edit pages, a refactor, and an end-to-end test of the whole flow.
- **Learned:** tests can pass for the wrong reason. Two database tests passed before the table even existed because they only checked "some error happened"; now they check the exact Postgres error code. Breaking the code on purpose (`"Enter name."`) shows a test really guards something.
- **Learned:** debugging a "this doesn't exist" error. When the code is right (typecheck passes) but the running app disagrees, suspect something stale: a reload didn't help, restarting the dev server did. And in the e2e test, the log showed Playwright had found the hidden sign-up form's Name field, not ours.
- **Learned:** a terminal runs commands in a folder (`ENOENT` = no such file there), so open the project folder in VS Code. Diffs are read in the Source Control panel: click the file name, not "Open File". A refactor shows up as red copies turning into one green helper.
- **Next:** open the pull request for `feat/exercise-library` and merge it, then feature 3, the programme builder (clear context first). Delete for exercises gets decided there.
