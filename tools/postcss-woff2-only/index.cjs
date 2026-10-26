"use strict";

// Drops the non-woff2 *file* sources from every `@font-face` that already offers
// `woff2`. Every browser in the support range takes the woff2 entry, so the TTF
// is never fetched -- but esbuild still resolves the `url()` and emits the file,
// which is 708 kB of the shipped payload. Removing the reference stops the
// emission, so nothing has to be deleted from `dist` afterwards.
//
// PostCSS runs before esbuild resolves `url()`, which is what makes this work.
//
// A `local()` source is kept: it names an installed font and emits no file, so
// dropping it would only remove a lookup shortcut. A face with no woff2 url is
// left untouched.
const WOFF2_URL = /^url\([^)]*\)\s*format\(\s*['"]?woff2/i;

module.exports = () => ({
  postcssPlugin: "postcss-woff2-only",
  Declaration(decl) {
    if (decl.prop !== "src") return;
    if (decl.parent?.type !== "atrule" || decl.parent.name !== "font-face") return;

    const sources = decl.value.split(",").map((part) => part.trim());
    if (!sources.some((s) => WOFF2_URL.test(s))) return;

    const kept = sources.filter((s) => !/^url\(/i.test(s) || WOFF2_URL.test(s));
    if (kept.length !== sources.length) decl.value = kept.join(", ");
  },
});
module.exports.postcss = true;
