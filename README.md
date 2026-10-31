# Gecko Web Services

The public marketing site for Gecko Web Services, plus a small admin area and a login panel.

Live at **https://gecko-web-services.web.app/#/main-page**

## Stack

| | |
| --- | --- |
| Framework | Angular 22, standalone components and `bootstrapApplication` |
| Language | TypeScript 6.0 |
| Backend | Firebase Realtime Database and Firebase Auth (the plain `firebase` SDK — `@angular/fire` is not used) |
| Tests | Jest 30 with `jest-preset-angular` 17 |
| Styles | SCSS |
| Node | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` (see `.nvmrc`) |

## Getting started

```bash
npm ci          # install exact versions from the lockfile
npm start       # dev server on http://localhost:4200
```

`npm ci` is preferred over `npm install` so the dependency tree matches the lockfile exactly.

The app is bilingual (Polish and English) with translations in `src/assets/i18n/`. It uses
hash-based routing, so the admin area is reached at `/#/admin` rather than `/admin`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server on `http://localhost:4200`. Binds `0.0.0.0` with `--poll 500`. |
| `npm test` | Run the Jest suite. Coverage is on by default; add `-- --coverage=false` for a faster run. |
| `npm run test:watch` | Jest in watch mode. |
| `npm run lint` | `ng lint` over the Angular ESLint config. |
| `npm run build` | Production build into `dist/gecko-web-services`. |
| `npm run measure` | Compare the built payload against `scripts/payload-baseline.json`. Run after `npm run build`. |
| `npm run measure:update` | Rewrite the baseline from the current `dist/`. Use when a size change is intended. |
| `npm run isready` | Lint, build, then deploy to Firebase Hosting. Requires Firebase credentials; do not run it to validate a change. |

The `pre-commit` hook runs `npm run lint`, so lint must pass before a commit lands.

## Project layout

```
src/app/
  components/    Shared presentational components (footer, loader, modals, ...)
  modules/       Feature areas, each a lazy-loaded standalone component
  services/      Injectable services, provided in root
  models/        Interfaces and enums
  guards/        Route guards
  pipes/         Standalone pipes
  classes/       Shared classes
  utilities/     Helpers and constants
  text-content/  Copy for the marketing pages
```

Feature areas live under `modules/` and are loaded lazily from the route table in
`src/app/app.routes.ts`. Admin routes are protected by `guards/admin/admin.guard.ts`.

There is no `app.module.ts`. `src/main.ts` calls `bootstrapApplication(AppComponent, appConfig)`,
and `src/app/app.config.ts` holds every root provider.

## Deployment

Pushing to `main` triggers `.github/workflows/firebase-hosting-merge.yml`, which builds, runs the
test suite, and deploys to the live Firebase Hosting channel. Pull requests get a temporary
preview channel instead.

## Contributing

Development happens on `develop`, not `main`. Feature work branches off `develop` and is merged
back into it; `main` receives releases cut from `develop`.

Two conventions worth knowing before your first pull request:

- **Every pull request bumps the version** in `package.json` by one minor release, in the same
  commit as the work. Use `npm version <x.y.0> --no-git-tag-version`, and write the lockfile with
  **npm 10** — npm 11 produces a lockfile that CI rejects.
- **Specs live beside the unit** as `<name>.spec.ts`. The `describe` block is named after the unit
  and each `it` reads as an assertion rather than starting with "should".

`AGENTS.md` documents the rest of the conventions: commands, import aliases, Angular style, and
the known constraints.
