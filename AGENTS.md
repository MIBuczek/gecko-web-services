# AGENTS.md

Guidance for agents and contributors working in this repository. It records how the project
is actually built, tested, and styled today, so changes land consistent with the code around
them.

## Project

`gecko-web-services` is an Angular single-page application: the public marketing site plus a
small admin area and a login panel. Stack:

- Angular 20.3 with standalone components and `bootstrapApplication`
- TypeScript 5.8, Firebase (`@angular/fire`), a self-hosted reCAPTCHA loader
- Jest 30 with `jest-preset-angular` 17 for tests
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
| `npm run measure` | Compare the built payload against `scripts/payload-baseline.json`. Run after `npm run build`. |
| `npm run measure:update` | Rewrite the baseline from the current `dist/`. Use when a size change is intended. |
| `npm run isready` | Lint, build, then deploy to Firebase Hosting. Requires Firebase credentials; do not run it to validate a change. |

The `pre-commit` hook runs `npm run lint`, so lint must pass before a commit lands.

## Layout

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
`src/app/app.routes.ts`. Routing uses hash URLs (`withHashLocation()`). Admin routes are
protected by `guards/admin/admin.guard.ts`.

There is no `app.module.ts`. `src/main.ts` calls `bootstrapApplication(AppComponent, appConfig)`;
`src/app/app.config.ts` holds every root provider. `modules/translate-lang/` is the one
remaining NgModule: it wraps `TranslateModule.forRoot()` with the HTTP loader and is pulled in
through `importProvidersFrom`. It disappears when `@ngx-translate/core` moves to v18, which
ships a standalone `TranslatePipe` and `provideTranslateService`.

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

- **Standalone everywhere.** Every component, directive and pipe is standalone, and
  `@angular-eslint/prefer-standalone` is enforced at error level. A component lists what its
  template uses in `imports` rather than relying on a shared `NgModule`. Import the specific
  symbol (`NgIf`, `NgFor`, `DatePipe`, ...) rather than `CommonModule`, unless most of the
  template needs it.
  - **Signals are the default reactivity primitive.** State is a `signal`, derived state is
    `computed`, and a component that must accept a value while still tracking an upstream source
    uses `linkedSignal`. Services expose state as a `readonly` signal created with
    `.asReadonly()`, not as a `BehaviorSubject`/`Observable` pair.
  - **Avoid RxJS except at a library boundary.** Nothing in `src/` imports an operator from
    `rxjs`; async work is `async`/`await` over promises. The only two places `rxjs` is still
    referenced are bridges to APIs that only expose an Observable:
    `toSignal(user(this.auth))` in `auth.service.ts` (AngularFire's `user()`), and
    `firstValueFrom(dialogRef.afterClosed())` in `admin/main.component.ts` (Angular Material).
    Keep each conversion local to the call site and leave a comment naming the library, so the
    next reader does not try to remove it.
  - **Do not reach for `AsyncPipe`.** A template reads a signal by calling it (`loaderStatus()`,
    `submitStatus()`); the pipe is gone from every template and from every `imports` array.
  - **`TranslateModule` is imported directly** by any standalone component whose template uses
    the `translate` pipe. `@ngx-translate/core` v15's `TranslatePipe` is not standalone, so the
    NgModule is the only way to get it until v18.
- **Tests import the component, they do not declare it.** A spec for a standalone component
  puts it in `imports: [XComponent]`. Listing it under `declarations` fails with
  "is marked as standalone and can't be declared in any NgModule".
- **`inject()` over constructor parameter injection.** Declare dependencies as field
  initialisers, `private readonly auth = inject(AuthService)`, and keep the constructor for
  logic only. `@angular-eslint/prefer-inject` is enforced at error level. Constructor
  parameters cannot be used at all: they would re-introduce the lint error.
- **Read injection tokens with the generic form.** `inject<IModalData>(MAT_DIALOG_DATA)` is
  how a component pulls `MAT_DIALOG_DATA`; the `@Inject(...)` decorator is gone. The generic
  argument is required, not optional: `MAT_DIALOG_DATA` is declared as `any`, so without it
  the data field loses its type. The schematic emits exactly this form.
- **Field initialisers run before the constructor body**, and in declaration order. Logic that
  used to run in the constructor still works, because every `inject()` field above it has
  already been assigned by the time the body runs.
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

## Workflow for a change

Work spec-first. The suite is the specification, so a change starts as a failing test.

1. **Write the spec.** Add or extend the `<name>.spec.ts` beside the unit. Describe the
   behaviour you are about to add, not the implementation: assert on observable output,
   emitted events, or rendered DOM.
2. **Write the test.** Run `npm test` and confirm the new test fails for the expected reason.
   A test that passes before the implementation is written is not testing the change.
3. **Implement.** Make the smallest change that turns the test green. Keep the diff scoped to
   the issue; note anything you find but do not fix rather than widening the change.
4. **Verify.** Run `npm test` and `npm run lint`. Run `npm run build` when the change touches
   templates, styles, or dependencies, since `strictTemplates` and the size budgets only
   surface there.
5. **Commit.** Follow the subject format below. State what changed and why; reference the
   issue.

Run the full suite, not a single file, before committing. Jest gives each spec file its own
`TestBed`, so the risk is not cross-file leakage: it is that changing shared code breaks a spec
you were not looking at. A component's spec can also be declared in more than one file.

## Commits

Subjects follow `<type> : <subject>`, with a space before the colon:

```
feat : add recaptcha security
bug : fix styles on admin
test : add unit tests for components without coverage
doc : update project dependencies
```

Types in use: `feat`, `bug`, `fix`, `test`, `doc`. Lowercase subject, no trailing period.

## Versioning

The `version` field in `package.json` is bumped in **every** pull request, by one **minor**
release. It is part of the change, not a separate chore: bump it in the same commit as the
work, so the version that ships is always visible in the diff.

```
2.0.0  ->  2.1.0  ->  2.2.0  ->  ...
```

Use `npm version <x.y.0> --no-git-tag-version` so `package.json` and both `version` fields in
`package-lock.json` stay in step. Do not hand-edit either file, and do not let npm 11 rewrite
the lockfile — see the npm 10 constraint below. The version is displayed in the admin view
(`main.component.ts` reads it from `package.json`).

Patch and major bumps are reserved for releases cut from `develop` into `main`, which are the
only place a tag is created.

## Formatting

There is no Prettier configuration, so follow `.editorconfig`: 2-space indentation, a final
newline, and no trailing whitespace. Match the surrounding file's existing style for anything
it does not cover.

## Known constraints

- The production build has size budgets that currently warn (initial bundle and the main
  component stylesheet). A build that prints these warnings still succeeds.
- **Angular's size budgets do not count fonts.** `budgets` sums chunk assets, and webfonts are
  emitted as assets, so no budget type (`all`, `any`, `initial`, …) can fail the build when the
  font payload grows. Fonts were the largest category in `dist` at the Phase 0 baseline
  (1,022,976 B of 2,405,328 B); Phase 2 cut them to 307,172 B, leaving JavaScript largest.
  `npm run measure` covers them; `angular.json` cannot. See `docs/css-payload.md`.
- The stylesheet has its own budget, `{ "type": "bundle", "name": "styles" }` in `angular.json`.
  It was verified by temporarily setting a 1 kB limit and observing the build fail — a budget
  that does not match a chunk name is silently ignored, so check that it fires before trusting it.
- `npm run build` also reports two CSS selector warnings from Bootstrap's
  `.form-floating>~label`. These are pre-existing and unrelated to application code.
- The test run logs `TypeError: this.modalRef.close is not a function` from
  `ModalCardDetailsComponent.hideCard`. The `modal-card-details` spec stubs `MatDialogRef` as
  `{ card: ... }` with no `close` method, so clicking the button hits it. The suite still
  passes; the error surfaces through Angular's error handler. It is pre-existing, not a
  symptom of your change.
- `Dockerfile` builds on `node:22-alpine`, exposes 4200 to match the dev server, and installs
  with `npm ci` against the committed lockfile. `.nvmrc` and an `engines` field pin Node to
  `^20.19.0 || ^22.12.0 || >=24.0.0` (the range Angular 20 supports).
- `@angular/fire` 17.1.0 changed `provideFirebaseApp` / `provideDatabase` / `provideAuth` from
  returning `ModuleWithProviders` to `EnvironmentProviders`. They must therefore sit in
  `providers:`, not `imports:`; Angular throws `TypeError: ... is not assignable to type
  'any[] | Type<any> | ModuleWithProviders<{}>'` at compile time otherwise. The `^17.0.1` range
  in `package.json` permits the bump, so this surfaces on any `npm update`.
- `npm run docker:serve` invokes `docker-compose`, the Compose v1 binary, which is no longer
  present on current Docker installs (they ship `docker compose`). Use `docker compose up`
  directly, or update the script.
- The `build_and_preview` workflow runs on `pull_request` with `actions/checkout@v4` and no
  explicit `ref`, so it tests the merge of the PR into its base branch rather than the PR head.
  Test totals in CI can therefore differ from a local run on the branch tip. Compare against
  the merged tree before assuming a discrepancy.
- The default branch is `main`, but feature work targets `develop`. GitHub only auto-closes
  issues from a `Closes #n` / `Fixes #n` keyword when the PR merges into the **default**
  branch. A PR based on `develop` will merge without closing its issue, so close the issue by
  hand. Do not treat the keyword as a guarantee.
- The Firebase Hosting preview workflow fails at its deploy step for a permissions reason
  unrelated to code changes; `npm run build` and `npm test` pass in the same run.
- `@ngx-translate/core` must stay on **15.x** while `ngx-translate-testing` is 7.0.0. Core 16
  and 17 removed `TranslateFakeCompiler` and `FakeMissingTranslationHandler`; core 18 removed
  `TranslateModule` as well, replacing it with `provideTranslateService`. `ngx-translate-testing`
  7.0.0 imports all three at module load and declares `imports: [TranslateModule]`, so on core
  >=16 the 10 specs that use it fail with `Cannot read properties of undefined (reading
  'ngModule')` or `TranslateFakeCompiler is not a constructor`. Core 15 still satisfies
  Angular 18's peer range (`>=16.0.0`), so it is the correct version until the translate stack
  is migrated to the provider API as its own change. The issue's version table lists core 18
  for this step; that is not installable alongside the current test tooling. Confirmed again at
  Angular 19: installing core 18 fails all 10 specs with `Cannot read properties of undefined
  (reading 'forRoot')` / `(reading 'ngModule')`.
- Angular 19's `ng update` migration adds `standalone: false` to every NgModule-declared
  component, but it also reindents the whole `@Component({...})` block to 4 spaces. This repo
  uses 2 spaces and has no Prettier config, so the raw migration output produces a large
  whitespace-only diff. Re-apply the `standalone: false` line by hand at the existing
  indentation instead of accepting the schematic's formatting.
- `@angular-eslint` 19 enables `@angular-eslint/prefer-standalone` at error level in
  `plugin:@angular-eslint/recommended`. It was turned off while the app was NgModule-based and
  is now re-enabled, because every component is standalone. Lint is the machine check that no
  component was missed.
- Angular 19 declares a `zone.js ~0.15.0` peer (Angular 18 declared `~0.14.10`) and
  `build-angular@19` requires TypeScript `>=5.5 <5.9`. The issue's table places both in Step 4,
  but they move here: `ng update` bumped zone.js to 0.15.1 and TypeScript to 5.8.3.
- `@typescript-eslint` must be on **8.x** from Step 3 onward. `@angular-eslint` 19.8.1 accepts
  `utils ^7.11.0 || ^8.0.0`, but TypeScript moves to 5.8.3 at this step and the 7.x line
  officially supports only `<5.6`, so lint prints "You are currently running a version of
  TypeScript which is not officially supported". Version 8.72.0 supports `>=4.8.4 <6.1.0` and
  removes the warning. The plugin, parser and the transitive `utils` are all pinned to 8.72.0.
- The initial-bundle budget was raised to `maximumWarning: 1.05mb` / `maximumError: 1.2mb`
  (from 500kb / 1mb) in Step 3. Angular 19 pushed the initial bundle to ~1015 kB, over the old
  1 MB error threshold; Angular 20 is ~1.13 MB raw (~246 kB transfer) and still passes. Before
  raising it, two reductions were applied: the unused
  `FIREBASE_OPTIONS` provider from `@angular/fire/compat` was removed from `app.module.ts`
  (nothing injects it, but it pulled the compat layer into the initial bundle, ~8 kB), and
  FontAwesome's `all.css` was measured. FontAwesome's `all.css` accounts for ~76 kB of the
  302 kB `styles` bundle and only ~20 icons are used; switching to the tree-shaken
  `FontAwesomeModule` API is the largest remaining win and is not yet done.
- `FIREBASE_OPTIONS` from `@angular/fire/compat` was a leftover from the pre-`provideX`
  API. Nothing in `src/` injects it and no `AngularFire*` service is used, so it was removed.
  If a future change needs the compat API, add it back together with the provider.
- `package-lock.json` must be written by **npm 10**, not npm 11, while CI does not pin Node. The
  workflows (`.github/workflows/firebase-hosting-*.yml`) use `actions/checkout` + `npm ci` with
  no `setup-node`, so they run on the runner's default npm (10.x), while a local Node 24
  provides npm 11. npm 11 rewrites the nested `chokidar`/`readdirp` entries under each Angular
  package, and npm 10 then rejects the lockfile with `Missing: chokidar@4.0.3 from lock file` /
  `Missing: readdirp@4.1.2 from lock file` — a `npm ci` failure in CI that passes locally. After
  any dependency change, regenerate with `npx npm@10 install --package-lock-only` and confirm
  `npx npm@10 ci --dry-run` succeeds. The durable fix is to pin Node in the workflows.
- Angular 18 removed `HttpClientModule` in favour of `provideHttpClient()`. The `ng update`
  schematic rewrites both call sites (`app.module.ts`, `translate-lang.module.ts`) and emits
  poorly formatted output; reformat by hand. The app has no `HTTP_INTERCEPTORS`, so
  `withInterceptorsFromDi()` is a no-op today but preserves behaviour if one is added.
- Angular 20 uses the `@angular/build:application` builder. The `use-application-builder`
  migration changes the emitted layout to `<base>/browser/`, but `firebase.json` publishes
  `dist/gecko-web-services` directly. `outputPath` is therefore pinned to
  `{ "base": "dist/gecko-web-services", "browser": "" }` so `index.html` stays at the root
  `firebase.json` expects. Changing the builder without this pin silently deploys nothing.
- Jest 30 hardcodes `node` into the CommonJS export conditions
  (`['require','module-sync','node','default', ...envConditions]`), and jest runs the
  TypeScript sources through CommonJS. `@firebase/auth` lists `node` before `browser` in its
  export map, so it resolves to `dist/node/index.js`, which calls the global `fetch` that jsdom
  does not provide: 9 suites fail with `ReferenceError: fetch is not defined`.
  `testEnvironmentOptions.customExportConditions` cannot override the hardcoded `node`, so
  `resolver.js` re-resolves only `firebase`, `@firebase/*` and `rxfire/*` with
  `conditions: ['browser', 'require', 'default']` and defers everything else to Jest's default
  resolver. Keep `require` before any `import` condition: `rxfire/*` ships ESM under `import`
  and CJS under `require`, and picking the ESM entry fails with "Must use import to load ES
  Module".
- Angular 20 stopped emitting the deprecated `ng-reflect-*` debug attributes unless
  `provideNgReflectAttributes()` is provided. `setup-jest.ts` registers it globally in a
  `beforeEach`. The import must come *after* `setupZoneTestEnv()` so `zone.js/testing` is
  registered before `@angular/core/testing` loads; importing it at the top of the file breaks
  `fakeAsync()` with "zone-testing.js is needed for the fakeAsync() test helper".
- `jest-preset-angular` 17 removed the `jest-preset-angular/setup-jest` entry point. The setup
  file now imports `setupZoneTestEnv` from `jest-preset-angular/setup-env/zone` and calls it.
- `@angular-eslint` 20 enables `@angular-eslint/prefer-inject` at error level in
  `plugin:@angular-eslint/recommended`. It was turned off while the app used constructor
  injection and is now re-enabled; the 31 sites were converted with
  `ng generate @angular/core:inject-migration`. The schematic emits its own formatting — it
  collapses a long `@angular/core` import onto one 131-character line and appends a blank line
  where the constructor used to be. Tidy both by hand, and put `inject` in the import in
  case-insensitive alphabetical order to match the rest of the repo.
- **PostCSS runs over the global stylesheet only.** Angular reads `postcss.config.json` /
  `.postcssrc.json` in `global-styles.js`; component styles go through
  `component-stylesheets.js` and are never passed to PostCSS. PurgeCSS therefore cannot touch
  a component's `:host` rules, and `--bs-*` variables read from
  `notification.component.scss` are safe by construction. Do not expect a PostCSS plugin to
  apply to `*.component.scss`.
- **A PurgeCSS safelist entry must be a real `RegExp`.** A string is compared with `===`, so
  `{ "standard": ["/^fa-/"] }` matches the literal selector `/^fa-/` and safelists nothing —
  silently, with no warning. `.postcssrc.json` is JSON and cannot express a `RegExp`, so
  pattern safelists live in `purgecss.config.js`. Only its **named-export** form
  (`exports.safelist = ...`) reaches the plugin; `module.exports = {...}` is swallowed by the
  ESM/CJS interop. The plugin package is `@fullhuman/postcss-purgecss` (`postcss-purgecss` is a
  different, deprecated package), and Angular rejects any plugin where `plugin.postcss !== true`.
- **PurgeCSS keeps custom properties unless `variables: true`.** The option defaults to off and
  is off here, so every `--bs-*` definition survives. Turning it on would drop 168 definitions
  and break the notification banners silently — `var(--bs-x, fallback)` hides the loss — so add
  `variables: [/^--bs-/]` in the same commit if it is ever enabled. Note that
  `--bs-*-100` / `--bs-*-300` do not exist in Bootstrap 5.3; the fallbacks that reference them
  were already dead code.
- **Do not safelist `/^fa-/`.** All 28 FontAwesome names appear as string literals, so the
  default extractor finds every one. The pattern re-admits all 2,541 icon rules and takes the
  stylesheet from ~8.9 kB to ~28.8 kB gzip. `purgecss.config.js` explains this in place.
- **Phase 1's failure mode is visual, not test-visible.** The suite passed while the stylesheet
  changed by 82%, so green tests prove nothing here. Verify by comparing rendered output —
  `docs/css-payload.md` records the Chromium comparison that was used (186 template classes ×
  47 computed properties, plus the three notification banners).
- The `styles` bundle budget in `angular.json` was lowered to `65kb` warning / `100kb` error in
  Phase 1 (from `345kb` / `360kb`), matching the ~58 kB the purged stylesheet reports. The old
  values were large enough that re-adding all of Bootstrap would have passed unnoticed. A
  `bundle` budget matches on chunk name; one that does not match is silently ignored, so
  confirm it fires before trusting it.
- **PostCSS runs before esbuild resolves `url()`.** This is what lets a plugin suppress an
  emitted asset: remove a `url()` from a declaration and the file is never written to `dist`.
  Phase 2 uses it to drop the FontAwesome `.ttf` sources (`tools/postcss-woff2-only`), taking
  the font payload from 1,022,976 B to 307,172 B with no `dist` rewriting and no post-build
  step. If you ever need to stop an asset being emitted, do it here rather than deleting from
  `dist` afterwards.
- **Angular resolves PostCSS plugins by bare specifier only.** It calls `require(pluginName)`
  with no relative-path handling, so `"./tools/my-plugin.cjs"` in `.postcssrc.json` fails with
  `Cannot find module`. A local plugin must be a `file:` dev dependency so its name resolves
  through `node_modules`. `npm ci` recreates that symlink, so CI is fine — but a plugin that
  works from a warm `node_modules` can still fail on a clean checkout if it is not declared.
- **Angular cannot filter font formats, and its budgets cannot see fonts.** No build option
  drops a `truetype` source, and webfonts are emitted as assets, not chunks, so no `budgets`
  entry fails the build when the font payload grows. That is why `scripts/measure-payload.js`
  exists. Fonts are the second-largest category in `dist` after JavaScript.
- **The `.ttf` files are dead weight, but `fa-brands` is not droppable.** Every FontAwesome
  `@font-face` lists `woff2` before `truetype` and every supported browser takes the `woff2`, so
  the TTFs were never fetched. But #28's "only one icon uses each family" is wrong for brands:
  nine brand icons (`fa-angular`, `fa-react`, `fa-node`, `fa-git-alt`, `fa-figma`,
  `fa-bootstrap`, `fa-google`, `fa-github`, `fa-microsoft`) render through
  `tech_icon.const.ts`, and none has a solid equivalent. Only `fa-regular` (one icon,
  `fa-square-check`) is reducible, and doing so visibly changes the success notification.
    Check the icon maps (`$fa-icons` vs `$fa-brand-icons`) before assuming a family is unused.
  - **RxJS is gone from application code; do not reintroduce it as a stream.** The service and
    component layer was migrated to signals, `async`/`await` and direct DOM listeners
    (`window.addEventListener("scroll", ...)` replacing `fromEvent`). The `| async` pipe was
    removed from every template. Two bridges remain and are deliberate:
    `toSignal(user(this.auth))` in `auth.service.ts` and
    `firstValueFrom(dialogRef.afterClosed())` in `admin/main.component.ts`, because
    `@angular/fire`'s `user()` and Angular Material's `afterClosed()` expose only Observables.
    Converting either to a promise/stream of your own would lose the source's cancellation and
    change behaviour; keep the bridge at the call site.
  - **`ScrollService` owns a real `scroll` listener.** It adds one bound handler in the
    constructor and removes the same reference in `ngOnDestroy`, so a second subscription cannot
    leak. If you add another window listener, bind it once the same way rather than creating an
    inline arrow per call.
  - **`adminGuard` is `async`, not Observable-returning.** It awaits
    `AuthService.whenReady()` (Firebase `authStateReady()`) before reading the
    `currentUser` signal, so it does not deny access while the persisted session is still being
    restored. Do not read the signal without that await.

## Scope of this document

It covers the build, test, and style conventions above. It does not document every service or
module in the app; read the relevant source before changing a feature area.
