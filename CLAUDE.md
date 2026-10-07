# CLAUDE.md

This file gives Claude Code context about this project. It is loaded automatically at the start of every session.

## Project overview

**Coach Lab** is a learning project. Nicolas is building a small coaching app to learn agentic coding with Claude Code, so he can later build the real FocusPT MVP well.

**Two goals, in this order:**
1. **Learning:** Nicolas understands how to work with a coding agent: planning, small steps, reading changes, testing, committing, deploying, recovering from mistakes.
2. **A working app:** a simple coaching tool where a trainer delivers programmes and clients log workouts so progress can be tracked.

If the two goals conflict, learning wins. A slower step that Nicolas understands beats a fast one he doesn't.

**This is not FocusPT.** It is a sandbox. Nothing here is a product decision, and it doesn't need to match the FocusPT research or MVP scope. Code may be reused later if it's good, but that's a bonus.

**Users:**
- **Trainer:** creates exercises and programmes, assigns them to clients, looks at client progress.
- **Client:** sees today's workout, logs what they actually did, sees their own progress.

**Features (build in this order, one at a time):**
1. Sign-up / log-in with a trainer or client role
2. Exercise library (name, optional description and video link)
3. Programme builder: a programme has weeks → workouts → exercises with target sets, reps and weight
4. Assign a programme to a client
5. Client view: "today's workout", log actual sets / reps / weight, mark the workout done
6. Progress: per-exercise chart over time (e.g. best weight on squat), workout completion rate
7. Trainer dashboard: list of clients with last workout date and completion rate

**Out of scope (on purpose):** payments, messaging/chat, booking, nutrition, native mobile apps, notifications, multiple trainers per business. If Nicolas asks for one of these, remind him once that it's out of scope, then do it if he still wants to.

## Tech stack

The same stack planned for the FocusPT MVP, so the learning carries over:

- **Next.js** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** + **shadcn/ui**, mobile-first (clients log workouts on their phones)
- **Supabase**: Postgres database, Auth, Row Level Security. EU region.
- **Vercel** for hosting
- **Recharts** for progress charts
- **Vitest** for unit tests, **Playwright** for one or two end-to-end flows
- English UI for now (Finnish later is a good learning exercise in i18n)

## Project structure

```
/app
  /(auth)            Log-in and sign-up pages
  /trainer           Trainer pages: exercises, programmes, clients, dashboard
  /client            Client pages: today, history, progress
/components          Reusable UI (shadcn/ui lives in /components/ui)
/lib
  /supabase          Supabase clients (server / browser) and typed queries
  /progress          Progress calculations (pure functions, easy to test)
/supabase
  /migrations        SQL migrations, the source of truth for the database
  seed.sql           Fake demo data: 1 trainer, 3 clients, 1 programme
/tests               Vitest and Playwright tests
/docs
  LEARNING_LOG.md    What Nicolas learned each session
  DECISIONS.md       Technical decisions and why
```

**Data model (keep it this simple):**
`profiles` (id, role: trainer | client, name, trainer_id for clients) → `exercises` → `programmes` → `programme_workouts` (week, day) → `programme_exercises` (target sets, reps, weight) → `assignments` (client ↔ programme, start date) → `workout_logs` → `set_logs` (actual reps, weight).

## Common commands

```bash
npm install                 # install dependencies
npm run dev                 # run the app at http://localhost:3000
npm run lint                # check code style
npm run typecheck           # check TypeScript types
npm run test                # unit tests
npm run test:e2e            # end-to-end tests

npx supabase start                      # local database (needs Docker Desktop)
npx supabase migration new <name>       # new database change
npx supabase db reset                   # rebuild local DB + load seed data
npx supabase gen types typescript --local > lib/supabase/types.ts

git status                  # what changed
git diff                    # see the exact changes
git log --oneline -10       # recent commits
```

Before saying a step is done: run `lint`, `typecheck` and `test`, fix what fails, and show the app running if it's a visible change.

## Conventions

- **One feature per branch:** `feat/exercise-library`, `fix/log-weight-rounding`.
- **Small commits** with clear messages (`feat: add exercise list page`). Commit after every working step so mistakes are easy to undo.
- **TypeScript strict**, no `any` without a comment explaining why.
- **Naming:** files `kebab-case`, components `PascalCase`, database `snake_case`.
- **Row Level Security on every table.** Clients see only their own data; trainers see only their own clients. Add a test for this whenever a table is added.
- **Database changes only through migrations**, never by clicking in the Supabase dashboard.
- **Progress maths lives in `/lib/progress` as pure functions** with unit tests.
- **Fake data only** in seeds and tests. No real client data, ever.
- **Never commit secrets.** Use `.env.local` (git-ignored); keep `.env.example` with variable names only.

## Notes for Claude

**Teaching mode (the most important section)**
- Nicolas is a UX/interaction designer learning to build with a coding agent. He is not a trained developer.
- **Plan before code.** For every feature: propose a short plan (what files, what database changes, how to test it), wait for his OK, then build.
- **Small steps.** Change a few files at a time, not twenty. Stop after each step so he can look at it.
- **Explain as you go, briefly.** After each step: what you changed, why, and one concept worth learning (e.g. "this is a migration, it's how the database schema changes safely"). Define jargon the first time it appears.
- **Make him look.** Point him to `git diff` or the file to read, and to the page in the browser to check. Ask him to try the feature himself before moving on.
- **Show the agentic workflow, not just the code.** When useful, mention the Claude Code habit behind what you're doing: using plan mode for bigger changes, clearing context between features, asking Claude to write tests first, reviewing a diff before committing, turning a repeated task into a custom slash command.
- **Let mistakes happen safely.** If something breaks, walk through how to debug it (read the error, find the cause, fix, test) instead of silently fixing it.
- **End each session** by adding 3–5 bullet points to `docs/LEARNING_LOG.md`: what was built, what was learned, what's next.

**Design**
- Design matters to Nicolas. Keep the UI clean and calm, mobile-first, with good empty states ("No programme assigned yet").
- When a layout choice isn't obvious, offer two options instead of guessing.

**Things to avoid**
- Don't install heavy libraries or paid services without asking.
- Don't over-engineer: no microservices, state-management libraries, or complex abstractions. Plain Next.js + Supabase is enough.
- Don't build several features at once, even if it would be faster.
- Don't touch anything outside this project folder.
