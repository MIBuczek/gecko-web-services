# CSS and font payload

Issue #28. This records the production payload as it stands, so later phases can show what
they actually saved instead of estimating it.

- **Phase 0** recorded the baseline and added the regression guard.
- **Phase 1** purged Bootstrap and trimmed the stylesheet. See [Phase 1](#phase-1--purge-bootstrap).
- **Phase 2** dropped the TTF fonts. See [Phase 2](#phase-2--trim-fontawesome-webfonts).

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

After Phase 2 the CSS goal and the font goal are both met. Total transfer sits at
**705,709 B**, 0.8% over the 700,000 B goal — the remaining gap and what would close it are
in [the note below](#the-remaining-1).

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

## Phase 2 — Trim FontAwesome webfonts

The whole win is one idea: **the TTF files are never fetched, but esbuild still emits them.**
Every FontAwesome `@font-face` lists `woff2` first and `truetype` second. Every browser in the
support range (`.browserslistrc`: Chrome, Firefox, Edge, Safari, iOS Safari, Firefox ESR) takes
the `woff2` entry, so the `.ttf` is dead weight — 708,152 B of the 1,022,976 B font payload.
Removing the `truetype` source from the declaration stops esbuild from resolving that `url()`,
so the file is never written to `dist`. Nothing needs deleting afterwards.

Result: **1,022,976 B → 307,172 B**, against a 320,000 B target. The goal is met.

### Configuration

A second PostCSS plugin, `postcss-woff2-only`, sits alongside PurgeCSS in `.postcssrc.json`:

```json
{
  "plugins": {
    "postcss-woff2-only": {},
    "@fullhuman/postcss-purgecss": { "content": ["src/**/*.html", "src/**/*.ts"] }
  }
}
```

It lives in `tools/postcss-woff2-only/` and is wired in as a `file:` dev dependency. For any
`@font-face` whose `src` offers both `woff2` and something else, it keeps the `woff2` sources
and drops the rest; a face with no `woff2` source is left untouched.

**Why PostCSS and not a build step.** Angular runs PostCSS *before* esbuild resolves `url()`
(`stylesheet-plugin-factory.js` calls the processor, then returns the result as a `css` loader
result). So editing the declaration is enough to suppress the asset — no `dist` rewriting, no
`assets` exclusion, no post-build script.

**Why a `file:` dependency.** Angular loads plugins with
`require(pluginName)` against the plugin name from the config, with no relative-path handling.
`"./tools/postcss-woff2-only/index.cjs"` fails with `Cannot find module`. A bare specifier
resolves normally, and `file:tools/postcss-woff2-only` makes it resolvable while keeping the
source in the repo. Verified that `npm ci` recreates the `node_modules` symlink from a clean
tree, which is what CI does.

### Verification

The change is provably surgical, checked four ways:

- **CSS diff.** Removing the ten `truetype` sources from the pre-change stylesheet produces a
  byte-identical match to the post-change stylesheet. Nothing else moved.
- **No stale references.** No `truetype` or `.ttf` string remains anywhere in `dist`.
- **Rendering.** All 25 icons the app uses (16 solid, 1 regular, 9 brands, driven off the real
  template classes and `tech_icon.const.ts`) render in Chromium with non-zero width and the
  expected `content` glyph.
- **What the browser actually fetches.** A request log over a real page load shows exactly
  three font files requested — `fa-solid-900`, `fa-regular-400`, `fa-brands-400`, all
  `.woff2` — and **zero** `.ttf` requests. The `.woff2` content hashes are unchanged from
  before the change, so the bytes served are the same bytes.

### The corrections to #28's second bullet

#28's next bullet — *"Consider dropping `fa-regular` and `fa-brands`. Only one icon uses each.
Converting both to solid variants removes those two families entirely and lands near 156 kB.
This needs two template edits and touches two spec assertions."* — does not hold up. Each claim
was checked against the tree:

- **`fa-regular`: one icon, yes.** `notification.component.html` uses `fa-regular fa-square-check`
  for the success variant, and nothing else uses the family.
- **`fa-brands`: nine icons, not one.** `tech_icon.const.ts` renders `fa-angular`, `fa-react`,
  `fa-node`, `fa-git-alt`, `fa-figma`, `fa-bootstrap`, `fa-google`, `fa-github` and
  `fa-microsoft` through one `*ngFor`. There is no single brand icon.
- **"Converting both to solid variants" is impossible for brands.** None of those nine names
  exists in `$fa-icons`; they are all in `$fa-brand-icons` only. There is no solid glyph to
  convert to. Brand marks are also *supposed* to be brand marks — a solid `fa-github` would be
  a different picture, not a cheaper one.
- **No spec assertion touches either family.** Searching the specs for `fa-regular`,
  `fa-brands` and `fa-square-check` returns nothing. The notification spec asserts the icon
  element exists and that the default case carries `fa-circle-info`; it never names the success
  icon. So "touches two spec assertions" is not accurate either.

### The remaining 1%

Total transfer is **705,709 B** against the 700,000 B goal, 0.8% over. The CSS and font goals
are both met; this one is not, and the shortfall is small enough to state precisely.

`fa-square-check` *does* exist in solid (`styles: [solid, regular]` in FA's own metadata), so
the `fa-regular` family can genuinely be dropped: change the one class in
`notification.component.html`, remove the family, and save 25,472 B. That lands the total at
~680 kB and meets the goal.

It is not done here because it is a **visible change** — the success notification's outline
tick becomes a filled tick — and #28 presents it as a costless mechanical swap. That is a
product decision, not a payload decision, and it should be made deliberately rather than
folded into a "drop the TTF files" commit. Everything needed to decide is above; the edit
itself is one line plus a rebuild.

One further 4,796 B is available: `fa-v4compatibility.woff2` is emitted but never requested
(only the unused `FontAwesome` v4 family references it). PurgeCSS keeps `@font-face` rules, so
it survives. Not worth special-casing for 4.7 kB, and recorded here only so the number is not
mysterious.

## Known warnings

Two pre-existing budget warnings are unchanged by this work and are not Phase 0's to fix:

- The initial bundle is 1.13 MB against a 1.05 MB warning / 1.2 MB error budget.
- `main.component.scss` is 6.25 kB against a 5 kB warning / 10 kB error budget.
