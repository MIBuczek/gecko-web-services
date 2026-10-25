# Standalone component migration — step-by-step plan

Target: move the app from NgModule-based components to standalone components and
`bootstrapApplication`. Base branch `develop` at `513201c` (after PR #31).

Every step below was exercised against a scratch worktree on `origin/develop`
(see [Verification log](#verification-log)). The build, the 155-test suite and a
headless Chromium render were run at the riskiest points; results are recorded so
the plan does not rest on assumptions.

## Current state (verified)

- Angular **20.3.34**, Material **20.2.14**, `@angular/build:application` builder.
- Entry point `src/main.ts` uses `platformBrowserDynamic().bootstrapModule(AppModule)`.
- **8 NgModules**: `app.module.ts`, `components/components.module.ts`, and one each
  for `admin`, `login`, `main`, `not-found`, `privacy-policy`, `translate-lang`.
- **18 components**, **7 services** (all `providedIn: "root"`), **1 guard** (already
  a `CanActivateFn`), **1 pipe** (`FormErrorMessagePipe`, already `standalone: true`).
- Every component currently carries `standalone: false`.
- `.eslintrc.json` turns off `@angular-eslint/prefer-standalone` and
  `@angular-eslint/prefer-inject`.

### Two constraints that shape the order

1. **`@ngx-translate/core` v15 is NgModule-only.** Its `TranslatePipe` is declared
   `ɵpipe<TranslatePipe, "translate", false>` — the `false` means *not* standalone,
   and v15 ships no `provideTranslateService`. Every template that uses `| translate`
   (13 of 17 templates, 38 usages) therefore needs `TranslateModule` in its imports.
   A standalone component **can** import an NgModule, so this works — it just means
   `TranslateModule` stays in the picture until the dependency is upgraded.
2. **Converting a component to standalone breaks any spec that declares it.** Angular
   throws `"X" is marked as standalone and can't be declared in any NgModule`.
   `footer.component.spec.ts` declares three components; `main` and
   `breadcrumbs`-adjacent specs declare two. Each conversion must move its component
   from `declarations` to `imports` in *every* spec that names it.

## Target end state

```
src/main.ts                     bootstrapApplication(AppComponent, appConfig)
src/app/app.component.ts        standalone, imports: [RouterOutlet]
src/app/app.config.ts           NEW — ApplicationConfig with all providers
src/app/app.routes.ts           NEW — routes moved out of app.module.ts
src/app/components/*            standalone (no components.module.ts)
src/app/modules/*/main/*        standalone; module files deleted
src/app/modules/translate-lang/ keep as-is (NgModule that provides translations)
```

`TranslateLangModule` is deliberately **not** deleted. It is the single place that
calls `TranslateModule.forRoot()` with the HTTP loader; five modules import it today.
After `bootstrapApplication` it becomes reachable through
`importProvidersFrom(TranslateLangModule)` in `appConfig` (verified to typecheck), or
it can be inlined into `app.config.ts` in a later cleanup. Removing it is optional and
out of scope for a first migration.

## Step-by-step plan

The order is chosen so that each step is independently shippable and the app builds
and tests green at every commit. Do the leaf components first: they have no custom
children, so their `imports` arrays are small and their specs are single-component.

### Phase 0 — groundwork (no behaviour change)

**Step 0.1 — add the `appConfig` shell and routes file.**
Create `src/app/app.routes.ts` with the `routes` array moved verbatim from
`app.module.ts` (including `withHashLocation()` at the `provideRouter` call site,
not in the array). Create `src/app/app.config.ts`:

```ts
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { environment } from "environments/environment";
import { TranslateLangModule } from "app/modules/translate-lang/translate-lang.module";
import { routes } from "app/app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    importProvidersFrom(TranslateLangModule),
  ],
};
```

Note: `ApplicationConfig` has **no `imports` property** in Angular 20. Passing
`TranslateModule.forRoot(...)` via `imports` fails to compile (`TS2353`); use
`importProvidersFrom` in `providers`, which was verified.

Nothing imports `app.config.ts` yet, so this commit changes no runtime behaviour.
Guard: `npm run build` and `npm test` still green.

**Step 0.2 — re-enable `prefer-standalone` in lint, scoped off for now.**
Leave `.eslintrc.json` alone for the moment. The rule is re-enabled in Phase 4 once
no `standalone: false` remains, so it acts as the completion check rather than
producing a large temporary diff.

### Phase 1 — leaf components (one commit each, or grouped)

Convert in dependency order, leaves first. For each component:

1. Set `standalone: true`.
2. Add an `imports` array containing exactly what its template needs.
3. Move it from `declarations` to `imports` in every spec that declares it.

The per-component `imports` needs (derived from the templates):

| Component | template uses | `imports` |
|---|---|---|
| `notification` | `ngSwitch`, `ngSwitchCase`, `ngSwitchDefault`, `ngClass` | `NgSwitch, NgSwitchCase, NgSwitchDefault, NgClass` |
| `scroll-top` | — | `[]` |
| `loader` | `async` | `CommonModule` (`AsyncPipe`) |
| `service-card` | `*ngIf` | `CommonModule` |
| `cookie` | `*ngIf`, `translate` | `CommonModule, TranslateModule` |
| `copy-rights` | `*ngIf`, `translate` | `CommonModule, TranslateModule` |
| `navigation` | `*ngIf`, `translate` | `CommonModule, TranslateModule` |
| `breadcrumbs` | `*ngFor`, `*ngIf`, `ngClass`, `translate`, `async` | `CommonModule, TranslateModule` |
| `modal-email-details` | `*ngIf` | `CommonModule` |
| `modal-card-details` | `*ngFor`, `translate` | `CommonModule, TranslateModule` |
| `error-message` | `*ngFor`, `*ngIf`, `formErrorMessage` | `CommonModule, FormErrorMessagePipe` |
| `footer` | `*ngIf`, `translate`, `async`, `[formGroup]`, `formControlName`, `<app-error-message>`, `<app-notification>` | `CommonModule, ReactiveFormsModule, TranslateModule, ErrorMessageComponent, NotificationComponent` |

Two ordering rules fall out of this table:

- `notification` before `footer` (footer imports it).
- `error-message` before `footer`.

Everything else is independent.

**Step 1.x — for each converted component, update its spec.** The mechanical change is
`declarations: [X]` → `imports: [X]`. `notification.component.spec.ts` and
`copy-rights.component.spec.ts` were converted this way and pass.

**Step 1.last — delete `components/components.module.ts`** once every component it
declares is standalone, and remove it from the `imports` of `app.module.ts`,
`main.module.ts`, `login.module.ts`, `admin.module.ts`, `not-found.module.ts`,
`privacy-policy.module.ts`.

Verified: with `notification` converted to standalone and still wired into
`ComponentsModule` via `imports` + `exports`, an unconverted `FooterComponent`
renders it fine and both specs pass. A partially converted module is a valid
intermediate state, so this phase can be split across several commits.

### Phase 2 — feature components

The five routed components (`main`, `login`, `admin`, `not-found`, `privacy-policy`)
each need:

| Component | extra `imports` beyond `CommonModule` |
|---|---|
| `modules/main/main` | `TranslateModule`, `BreadcrumbsComponent`, `CookieComponent`, `CopyRightsComponent`, `FooterComponent`, `LoaderComponent`, `NavigationComponent`, `ScrollTopComponent`, `ServiceCardComponent` |
| `modules/privacy-policy/main` | `TranslateModule`, `BreadcrumbsComponent`, `CookieComponent`, `CopyRightsComponent`, `NavigationComponent`, `ScrollTopComponent` |
| `modules/not-found/main` | `TranslateModule`, `BreadcrumbsComponent`, `CopyRightsComponent`, `NavigationComponent` |
| `modules/login/main` | `ReactiveFormsModule`, `ErrorMessageComponent`, `NotificationComponent` |
| `modules/admin/main` | `NotificationComponent` |

`modules/main/main` also injects `MatDialog` and opens `ModalCardDetailsComponent`.
`MatDialog` is `providedIn: "root"` in Material 20, so no provider change is needed;
the component only needs the dialog target in `imports` (it is opened imperatively,
not referenced in the template).

Then **replace each `*.module.ts` with route entries**. Each feature module is just
`{ path: "", component: MainComponent }`. Convert them to lazy `loadComponent`:

```ts
// app.routes.ts
{
  path: "main-page",
  loadComponent: () =>
    import("modules/main/main/main.component").then((m) => m.MainComponent),
  data: { breadcrumbs: ["main-page"] },
},
```

Delete the five `*.module.ts` files. `app.module.ts` becomes unused by this point.

Specs for these components declare two components in `main.component.spec.ts`
(`MainComponent, ModalCardDetailsComponent`) — move both to `imports`. Several specs
import `{ routes } from "app/app.module"`; update those to `app/app.routes`.

### Phase 3 — bootstrap

**Step 3.1 — convert `AppComponent`.** `imports: [RouterOutlet]`, `standalone: true`.
Update `app.component.spec.ts`: `imports: [AppComponent, RouterModule]` (was
`imports: [RouterModule], declarations: [AppComponent]`).

**Step 3.2 — switch `main.ts` to `bootstrapApplication`:**

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { environment } from "environments/environment";
import { enableProdMode } from "@angular/core";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

**Step 3.3 — delete `app.module.ts`.** Do this in the same commit as 3.2, because the
orphaned module still declares the now-standalone `AppComponent` and, while Angular's
build silently ignores an unreachable module, leaving it in place is a trap for the
next reader. `tsc --noEmit` does not flag it either.

Verified: this exact bootstrap change builds (exit 0) and a headless Chromium load of
the built output renders `app-root`, `app-navigation`, `app-footer`, `app-cookie`,
`app-breadcrumbs` and `app-scroll-top`, with `ng-version="20.3.34"` and no application
console errors.

### Phase 4 — cleanup and guardrails

1. **Delete `src/app/modules/translate-lang/translate-lang.module.ts`** only if
   `importProvidersFrom(TranslateLangModule)` was inlined into `app.config.ts`.
   Otherwise keep it. This is optional.
2. **Re-enable `@angular-eslint/prefer-standalone`** in `.eslintrc.json` (remove the
   `"off"` entry). Run `npm run lint` — this is the machine check that no component
   was missed.
3. **`prefer-inject` stays off.** 20+ constructor-injected dependencies would each need
   rewriting to `inject()`; that is a separate, behaviour-neutral refactor. Note it in
   `AGENTS.md` as deliberate.
4. **Remove `CUSTOM_ELEMENTS_SCHEMA`.** It exists only because `index.html` contains a
   non-Angular `<policy-directive>` element. The schema is applied in `app.module.ts`,
   `login.module.ts` and three specs. Verified: deleting all five occurrences keeps the
   build at exit 0 and the suite at 155/155. Do it after `app.module.ts` is gone.
5. **Fix the latent bug in `form-error-message.pipe.ts` line 31.** The `maxlength`
   branch reads `${formErrorMessageConst[currentLang]}[key]}` — the closing bracket is
   in the wrong place, so it interpolates the whole language object followed by the
   literal `[key]}` instead of the message for that key. Should be
   `[currentLang][key]`. This is pre-existing and unrelated to standalone, but it sits
   in a file this migration touches.
6. **Update `AGENTS.md`.** Its "Modules over standalone" rule (line ~84) and the
   `standalone: false` migration notes (lines ~229–237) become wrong. Rewrite them to
   describe the standalone conventions and the `prefer-inject` exemption.

### Phase 5 — optional: upgrade `@ngx-translate/core`

Not required for the migration, but it is what lets `TranslateModule` disappear from
every `imports` array. `@ngx-translate/core` **18.0.0** ships `provideTranslateService`,
`provideTranslateLoader` and a standalone `TranslatePipe` (three `standalone: true`
declarations in its bundle). Peer range is `@angular/core >=18`, so it is compatible
with Angular 20. Upgrading would replace the table's `TranslateModule` entries with
`TranslatePipe` and remove `TranslateLangModule` entirely. Treat as a separate PR.

## Risks and mitigations

| Risk | Why | Mitigation |
|---|---|---|
| Spec failures from `declarations` | Angular rejects a standalone component in `declarations` | Move to `imports` in every spec that names it; grep `declarations:` before each commit |
| `TranslatePipe` not standalone (v15) | 38 template usages | Import `TranslateModule` (an NgModule) into standalone components; upgrade to v18 later |
| `ApplicationConfig.imports` | Does not exist in Angular 20 | Use `importProvidersFrom` in `providers` |
| Orphaned `app.module.ts` | Build silently ignores it | Delete it in the same commit as the bootstrap swap |
| Lazy route regressions | `loadChildren` → `loadComponent` | Keep the same `path` and `data`; verify each route in the browser |
| `CUSTOM_ELEMENTS_SCHEMA` | Hides `<policy-directive>` | Removable; verified build + tests green without it |

## Verification commands

```bash
npm run lint
npm run build
npm test -- --watch=false
```

Per-phase browser check: serve `dist/gecko-web-services` and confirm the six shell
components render on `/`, and that `/main-page`, `/login`, `/privacy-policy` and an
unknown path (404) each resolve to their lazy chunk.

## Verification log

All commands run in a scratch worktree on `origin/develop` (`513201c`), Node/npm from
the repo lockfile, `npm ci` first.

| Check | Result |
|---|---|
| `notification` → standalone, spec `declarations`→`imports` | 7/7 pass |
| `copy-rights` → standalone, imports `TranslateModule` | 3/3 pass — proves a standalone component can import the NgModule |
| `notification` standalone inside unconverted `ComponentsModule` | `footer` + `notification` specs 19/19 pass; `npm run build` exit 0 |
| Full `bootstrapApplication` + `app.config.ts` + `app.routes.ts` | build exit 0; suite 153/155 (only `app.component.spec.ts` fails, as predicted) |
| The exact `app.config.ts` printed in Step 0.1 | build exit 0; Chromium renders all six shell components + `GECKO` text |
| `app.component.spec.ts` fixed to `imports` | 2/2 pass |
| Headless Chromium on built output | `app-root`, `app-navigation`, `app-footer`, `app-cookie`, `app-breadcrumbs`, `app-scroll-top` all rendered; `ng-version="20.3.34"`; no app console errors |
| `CUSTOM_ELEMENTS_SCHEMA` removed from all 5 files | build exit 0; suite 155/155 |
| `importProvidersFrom(TranslateModule.forRoot(...))` typecheck | clean |
| `ApplicationConfig.imports` | `TS2353` — confirmed unavailable |
| `@ngx-translate/core` v18 bundle | 3 × `standalone: true`; `provideTranslateService` exported |

## Suggested PR breakdown

1. **PR A** — Phase 0 (config shell) + Phase 1 (leaf components, module deleted).
2. **PR B** — Phase 2 (feature components + `loadComponent` routes).
3. **PR C** — Phase 3 (standalone bootstrap, `app.module.ts` deleted).
4. **PR D** — Phase 4 (lint rule on, schema removed, pipe fix, docs).
5. **PR E** *(optional)* — Phase 5 (ngx-translate 18).
