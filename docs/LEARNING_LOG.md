# Learning log

What was built, what was learned, what's next. Newest at the bottom.

## 2026-10-07 · Session 1: setting up the workshop

- **Built:** installed Node.js, Docker Desktop and WSL; created the Next.js project; connected it to GitHub; added `typecheck`, `test` (Vitest) and `test:e2e` (Playwright) commands.
- **Learned:** git is a save-game system (commit = snapshot, push = upload to GitHub). Every command ends with an exit code (0 = success). A check is only useful if you've seen it fail.
- **Learned:** debugging means reading the first line of the error and finding what the thing depends on. Docker hung because WSL was missing; `npx` was blocked by a Windows script setting; npm refused Vitest because two packages wanted different versions of the Node types.
- **Learned:** write the test first, watch it fail, then write the code (`bestWeight` in `lib/progress`).
- **Next:** feature 1, sign-up and log-in with a trainer or client role (Supabase Auth).
