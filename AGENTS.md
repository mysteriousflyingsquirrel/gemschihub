# AGENTS.md

## Project Context
- Frontend: React + TypeScript + Vite PWA at repo root.
- Backend: Firebase Cloud Functions in `functions/`.
- Package manager: npm.

## Default Engineering Workflow
1. Work from a GitHub issue.
2. Plan before implementation.
3. Implement only approved scope.
4. Open a PR with `Closes #<issue>`.
5. Keep docs in sync with behavior changes.

## Label Model
- Type: `type:feature`, `type:bug`, `type:chore`
- Status: `status:needs-plan`, `status:awaiting-clarification`, `status:planned`,
  `status:approved-for-implementation`, `status:in-implementation`,
  `status:in-review`, `status:done`

## Quality Gates
- Run `npm run build` for final verification.
- Keep new lint warnings/errors out of changed files.
- Do not commit generated build artifacts.

## Automation
- Issue labeler enforces initial type/status labels.
- PR merge workflow sets linked issues to `status:done`.
# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a React + TypeScript PWA (Vite) for a badminton team. It has two deployment units:

- **Frontend** (root `/`) — React 18, Vite 5, Tailwind CSS 3, PWA via `vite-plugin-pwa`
- **Cloud Functions** (`/functions`) — Firebase Cloud Functions v2 (Node 20, TypeScript)

Backend services are entirely Firebase-hosted (Firestore, Auth, Storage, FCM). The frontend has fallback Firebase credentials in `src/firebase/firebaseConfig.ts` and a committed `.env.development`, so it connects to the live project without any additional `.env` setup.

### Running services

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on `localhost:5173` |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | ESLint (`--max-warnings 0`); pre-existing errors exist in the codebase |
| `cd functions && npm run build` | Compile Cloud Functions TypeScript |

### Lint / test / build notes

- **Lint** (`npm run lint`): The project has pre-existing ESLint errors (mostly `@typescript-eslint/no-explicit-any` and `prefer-const`). New code should not introduce additional warnings.
- **TypeScript** (`npx tsc --noEmit`): Passes cleanly.
- **Build** (`npm run build`): Runs `tsc && vite build`; completes successfully.
- There are no automated test suites (no test runner configured).
- The `functions/` directory requires Node 20 per `engines` field but installs fine on Node 22 with a non-blocking warning.

### Package manager

Uses **npm** (lockfile: `package-lock.json`). Both root and `functions/` have separate `package.json` + `package-lock.json`.

### Environment variables

`.env.development` is committed with Firebase credentials. `.env.example` documents the expected keys. No secrets setup is required for local development.
