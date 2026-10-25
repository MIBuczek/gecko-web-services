# CSS and font payload

Issue #28. This records the production payload as it stands, so later phases can show what
they actually saved instead of estimating it.

- **Phase 0** recorded the baseline and added the regression guard.
- **Phase 1** purged Bootstrap and trimmed the stylesheet. See [Phase 1](#phase-1--purge-bootstrap).
- **Phase 2** (fonts) is not started.

## How to measure

```bash
npm run build
npm run measure          # compare against scripts/payload-baseline.json
npm run measure:update   # rewrite the baseline after an intended change
```

`npm run measure` fails the command when a category exceeds the committed baseline by more
than 8%, and warns past 3%. Lowering the baseline is how a phase locks in its win.

## Baseline

The Phase 0 baseline, measured on `develop` at Angular 20.3.34 from a clean `npm run build`.
Phase 1 lowered the CSS figure; the current numbers live in `scripts/payload-baseline.json`,
and the per-phase results are under [Phase 1](#phase-1--purge-bootstrap).

| Category | Files | Raw | Gzip |
| --- | ---: | ---: | ---: |
| JavaScript | 9 | 845,661 B | 248,373 B |
| CSS | 1 | 330,454 B | 52,996 B |
| **Fonts** | 8 | **1,022,976 B** | 634,981 B |
| Images | 5 | 125,146 B | 66,477 B |
| Other | 5 | 81,091 B | 16,287 B |
| **Total** | 28 | **2,405,328 B** | — |

Transfer-weighted total: **1,465,778 B**. Fonts and images are counted raw, since they are
already compressed and gzipping them would flatter the number.

The stylesheet is `styles-*.css`: 330,454 B raw / 52,996 B gzip.

## What this changes about the plan in #28

The numbers confirm the two phases and the order they are in, with two corrections.

**Fonts are the largest category in `dist`** — 1,022,976 B, or 43% of everything shipped, to
render 21 icons. That is larger than every line of JavaScript and CSS combined in transfer
terms, and it is the single biggest win available.

**Angular's size budgets cannot see fonts at all.** The budget schema
(`@angular/build/src/builders/application/schema.json`) accepts `all`, `allScript`, `any`,
`anyScript`, `anyComponentStyle`, `bundle` and `initial`. The calculator
(`utils/bundle-calculator.js`) sums *chunk* assets, and webfonts are emitted as assets, not
chunks. Confirmed by measurement: a `type: "all"` budget reports 1.18 MB against a `dist` of
2.29 MB. No budget type can fail the build when the font payload grows. That is why
`scripts/measure-payload.js` exists rather than a fourth `budgets` entry.

**`type: "bundle"` with `name: "styles"` does work** for the stylesheet, and is now configured
in `angular.json`. It was verified by setting a deliberately tiny budget and observing the
build fail.

**The whole `package.json` ships to the browser.** `main.component.ts` imports it for `name`
and `version`, and the bundler includes the entire file — `scripts`, `dependencies` and all of
`devDependencies` — because a JSON import is not tree-shaken. Measured in
`chunk-*.js`: 1,863 B raw / 752 B gzip to supply two short strings, and it exposes the
dependency list and npm scripts publicly. Worth folding into a phase in #28; it is small in
bytes but larger than anything else on this list per unit of value.

## Targets

Set from the phases in #28, not from an arbitrary threshold.

| Metric | Baseline | Target | Reached by |
| --- | ---: | ---: | --- |
| css gzip | 52,996 B | 20,000 B | Phase 1 — purge Bootstrap |
| font payload | 1,022,976 B | 320,000 B | Phase 2 — drop the TTF files |
| total transfer | 1,465,778 B | 700,000 B | Phases 1 + 2 |

The targets are reported by `npm run measure` but not enforced: a phase cannot pass its own
goal before it lands. Each phase lowers the baseline to its measured result, which is what
makes the win permanent.

## Phase 1 — Purge Bootstrap

PurgeCSS runs over the **global** stylesheet only. Angular applies `postcss.config.json` /
`.postcssrc.json` through `global-styles.js`; component styles take a separate path
(`component-stylesheets.js`) and are never passed to PostCSS. That is the single most useful
thing to know here: a component's `:host` rules cannot be purged, so a mistake is confined to
`styles.scss` and its imports.

Measured on a clean build:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| css raw | 330,454 B | 58,081 B | −82% |
| css gzip | 52,996 B | 8,879 B | **−83%** |
| total transfer | 1,465,778 B | 1,421,624 B | −3% |

The target was 20,000 B gzip; the result is 8,879 B. The stylesheet is now 257 rules, down
from 4,490.

### Configuration

`postcss` and `@fullhuman/postcss-purgecss` are dev dependencies, and `.postcssrc.json` names
the plugin. Two details cost real time and are easy to get wrong:

- The package is `@fullhuman/postcss-purgecss`. The similarly named `postcss-purgecss` is a
  different, deprecated package.
- Angular `require`s the plugin and rejects anything where `plugin.postcss !== true`. This
  package satisfies that, but only through the CommonJS interop — `typeof plugin === "function"`
  is not enough to assume it will work.

### The safelists in #28 do not do what they look like they do

#28 asks for pattern safelists (`/^fa-/`, `/^mat-/`, `/^cdk-/`, `/^ng-/`). Three findings:

**A string safelist is a silent no-op.** PurgeCSS compares a string entry with `===`, so
`{ "standard": ["/^fa-/"] }` matches the literal selector `/^fa-/`, which never exists. It
needs a real `RegExp`. Since JSON cannot hold one, `.postcssrc.json` cannot safelist by
pattern at all. `purgecss.config.js` exists for exactly this reason, and only its
**named-export** form reaches the options — `module.exports = {...}` is wrapped by the
plugin's ESM/CJS interop and dropped.

**Safelisting `/^fa-/` would break the target.** Icons are found by extraction already: all 28
names appear as string literals (`tech-icon.const.ts`, templates), so the default extractor
finds every one, with zero missing and zero extra. Adding `/^fa-/` re-admits all 2,541
FontAwesome rules and takes the stylesheet from 8,879 B to 28,784 B gzip — over the phase's own
20,000 B goal. It is therefore **not** in `purgecss.config.js`.

**`/^mat-/`, `/^cdk-/` and `/^ng-/` are kept, but they match nothing.** The global stylesheet
contains zero selectors with those prefixes, and component styles are not purged. They are
insurance, not a fix, and cost nothing today.

### The `--bs-*` risk does not materialize

#28 flags this as the one place a purge fails silently, because
`var(--bs-success-bg-subtle, var(--bs-success-100))` hides a missing variable. Two corrections:

**`--bs-*-100` and `--bs-*-300` never existed.** They are not in Bootstrap 5.3, and not in the
built stylesheet. The fallback chain was already dead code; the `-bg-subtle`, `-border-subtle`
and `-text-emphasis` properties are the real ones.

**Custom properties are only removed when `variables: true`**, which is off by default and
stays off here. Every `--bs-*` definition is retained. Enabling it would drop 168 definitions
and *would* break the banners — `var(--bs-x, fallback)` swallows the loss — so if it is ever
turned on, `variables: [/^--bs-/]` must be added in the same commit. That note is in
`purgecss.config.js`.

Verified in Chromium, not by reading CSS: the three notification banners resolve to identical
colours before and after, and all 186 classes the templates actually use produce **zero**
computed-style differences across 47 properties.

## Known warnings

Two pre-existing budget warnings are unchanged by this work and are not Phase 0's to fix:

- The initial bundle is 1.13 MB against a 1.05 MB warning / 1.2 MB error budget.
- `main.component.scss` is 6.25 kB against a 5 kB warning / 10 kB error budget.
