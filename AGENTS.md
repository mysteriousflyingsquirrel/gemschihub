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
