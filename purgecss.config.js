/**
 * PurgeCSS safelist for the global stylesheet.
 *
 * This file exists because a safelist needs real RegExp objects and
 * `.postcssrc.json` is JSON. PurgeCSS compares a *string* entry with `===`, so
 * `"/^fa-/"` matches nothing -- silently, with no warning. Verified against
 * purgecss@8: `{standard: ["/^fa-/"]}` keeps nothing, `{standard: [/^fa-/]}`
 * keeps every match. A JSON config therefore cannot safelist by pattern.
 *
 * The plugin loads this from `process.cwd()`, and only the named-export form
 * works: `module.exports = {...}` is wrapped by the ESM/CJS interop in
 * @fullhuman/postcss-purgecss and never reaches the options.
 */
exports.safelist = {
  // Runtime-injected classes. Measured: the global stylesheet contains zero
  // `.mat-`, `.cdk-` and `.ng-` selectors, and Angular does not run PostCSS
  // over component styles, so nothing is at risk today. Kept as insurance for
  // the day a global rule references one.
  standard: [/^mat-/, /^cdk-/, /^ng-/],
};

// No `safelist.variables` entry, deliberately. PurgeCSS removes unused custom
// properties only when `variables: true`, which is not set here, so every
// `--bs-*` definition is retained and the notification banners keep resolving.
// Enabling that option would drop 168 definitions and break them silently --
// `var(--bs-x, fallback)` swallows the loss. If it is ever enabled, add
// `variables: [/^--bs-/]` here in the same commit.
