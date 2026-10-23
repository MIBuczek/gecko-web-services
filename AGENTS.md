# AGENTS.md

Guidance for agents and contributors working in this repository. It records how the project
is actually built, tested, and styled today, so changes land consistent with the code around
them.

## Project

`gecko-web-services` is an Angular single-page application: the public marketing site plus a
small admin area and a login panel. Stack:

- Angular 17.3 with NgModules (not standalone components)
- TypeScript 5.4, Firebase (`@angular/fire`), `ng-recaptcha`
- Jest 29 with `jest-preset-angular` 14 for tests
- SCSS for styles

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact dependency versions from `package-lock.json`. Use this rather than `npm install` for a reproducible tree. |
| `npm start` | Dev server on `http://localhost:4200`. Binds `0.0.0.0` with `--poll 500`. |
| `npm test` | Run the Jest suite. Coverage is on by default; add `-- --coverage=false` for a faster run. |
| `npm run test:watch` | Jest in watch mode. |
| `npm run lint` | `ng lint` over the Angular ESLint config. |
| `npm run build` | Production build into `dist/gecko-web-services`. |
| `npm run isready` | Lint, build, then deploy to Firebase Hosting. Requires Firebase credentials; do not run it to validate a change. |

The `pre-commit` hook runs `npm run lint`, so lint must pass before a commit lands.

## Layout

```
src/app/
  components/    Shared presentational components (footer, loader, modals, ...)
  modules/       Feature areas, each a lazy-loaded NgModule
  services/      Injectable services, provided in root
  models/        Interfaces and enums
  guards/        Route guards
  pipes/         Standalone pipes
  classes/       Shared classes
  utilities/     Helpers and constants
  text-content/  Copy for the marketing pages
```

Feature areas live under `modules/` and are loaded lazily from the route table in
`src/app/app.module.ts`. Routing uses hash URLs (`useHash: true`). Admin routes are protected
by `guards/admin/admin.guard.ts`.

## Imports

`tsconfig.json` sets `baseUrl: "src"` with path aliases. Import through the alias, not a
relative climb:

```ts
import { AuthService } from "app/services/auth/auth.service";
import { IAdminEmail } from "app/models/email-message";
import { MainComponent } from "modules/admin/main/main.component";
```

Available aliases: `app/*`, `components/*`, `guards/*`, `services/*`, `models/*`,
`modules/*`, `utilities/*`, `classes/*`, `pipes/*`, `text-content/*`, `assets/*`,
`environments/*`. `jest.config.ts` mirrors this map, so an alias must be added in both files
to work in tests.

## TypeScript

Compilation is strict, and a few flags change what code is allowed:

- `strict` — no implicit `any`, strict null checks
- `noImplicitOverride` — overrides need the `override` keyword
- `noPropertyAccessFromIndexSignature` — index-signature access uses brackets
- `noImplicitReturns` — every code path returns
- `noFallthroughCasesInSwitch` — each `switch` case exits
- `strictTemplates` — template type checking is on, so template expressions must type-check

`resolveJsonModule` is enabled, which is how components read the version from
`package.json`.

## Angular conventions

- **Modules over standalone.** Components are declared in an `NgModule`. The one standalone
  artifact is `pipes/form-error-message.pipe.ts`.
- **OnPush on presentational components.** Set
  `changeDetection: ChangeDetectionStrategy.OnPush` and drive updates from signals.
- **Signals for local state.** Use `signal`, `computed`, and `WritableSignal` rather than
  plain mutable fields.
- **Required inputs** are declared as `@Input({ required: true })`.
- **`styleUrl`** (singular) on newer components, `styleUrls` on older ones. Prefer `styleUrl`.
- **Template and style files** sit beside the component, named `*.component.html` and
  `*.component.scss`.
- **Services** are `@Injectable({ providedIn: "root" })`.

## Testing

Specs live beside the unit under test as `<name>.spec.ts` and are run by Jest.

Naming follows the existing suite: the `describe` is named after the unit, and each `it`
reads as an assertion rather than a `should` phrase.

```ts
describe("LoginMainComponent", () => {
  it("is the form invalid when empty", () => { /* ... */ });
  it("is login not called when the form is invalid", () => { /* ... */ });
});
```

The creation test varies in wording across the suite (`should create`, `should be created`,
`should create the app`). Match the specs already in the file you are editing.

For a component with collaborators, prefer a small `buildComponent` helper that configures
the `TestBed` and returns the fixture plus typed mocks, over repeating the setup in every
test. See `src/app/modules/admin/main/main.component.spec.ts`.

`TestBed` cannot be reconfigured mid-test, so tests that need a different provider setup go
in their own `describe` block with their own `beforeEach`.

Workflow for a change: write the spec first, then the implementation, then run `npm test`
and `npm run lint` before committing.

## Commits

Subjects follow `<type> : <subject>`, with a space before the colon:

```
feat : add recaptcha security
bug : fix styles on admin
test : add unit tests for components without coverage
doc : update project dependencies
```

Types in use: `feat`, `bug`, `fix`, `test`, `doc`. Lowercase subject, no trailing period.

## Formatting

There is no Prettier configuration, so follow `.editorconfig`: 2-space indentation, a final
newline, and no trailing whitespace. Match the surrounding file's existing style for anything
it does not cover.

## Known constraints

- The production build has size budgets that currently warn (initial bundle and the main
  component stylesheet). A build that prints these warnings still succeeds.
- `npm run build` also reports two CSS selector warnings from Bootstrap's
  `.form-floating>~label`. These are pre-existing and unrelated to application code.
- The test run logs `TypeError: this.modalRef.close is not a function` from
  `ModalCardDetailsComponent.hideCard`. The `modal-card-details` spec stubs `MatDialogRef` as
  `{ card: ... }` with no `close` method, so clicking the button hits it. The suite still
  passes; the error surfaces through Angular's error handler. It is pre-existing, not a
  symptom of your change.
- `Dockerfile` pins `node:16.17.0-alpine` and exposes port 3000 while the dev server listens
  on 4200. The repository declares no `engines` field.
- `npm run docker:serve` invokes `docker-compose`, the Compose v1 binary, which is no longer
  present on current Docker installs (they ship `docker compose`). Use `docker compose up`
  directly, or update the script.
- The `build_and_preview` workflow runs on `pull_request` with `actions/checkout@v2` and no
  explicit `ref`, so it tests the merge of the PR into its base branch rather than the PR head.
  Test totals in CI can therefore differ from a local run on the branch tip. Compare against
  the merged tree before assuming a discrepancy.
- The Firebase Hosting preview workflow fails at its deploy step for a permissions reason
  unrelated to code changes; `npm run build` and `npm test` pass in the same run.

## Scope of this document

It covers the build, test, and style conventions above. It does not document every service or
module in the app; read the relevant source before changing a feature area.
