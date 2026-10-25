# CSS and font payload

Phase 0 of issue #28. This records the production payload as it stands, so later phases can
show what they actually saved instead of estimating it.

## How to measure

```bash
npm run build
npm run measure          # compare against scripts/payload-baseline.json
npm run measure:update   # rewrite the baseline after an intended change
```

`npm run measure` fails the command when a category exceeds the committed baseline by more
than 8%, and warns past 3%. Lowering the baseline is how a phase locks in its win.

## Baseline

Measured on `develop` at Angular 20.3.34, from a clean `npm run build`.

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

## Known warnings

Two pre-existing budget warnings are unchanged by this work and are not Phase 0's to fix:

- The initial bundle is 1.13 MB against a 1.05 MB warning / 1.2 MB error budget.
- `main.component.scss` is 6.25 kB against a 5 kB warning / 10 kB error budget.
