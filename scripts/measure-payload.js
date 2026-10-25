#!/usr/bin/env node
/**
 * Measures the production payload against a committed baseline.
 *
 * Angular's size budgets sum chunk assets, so they cannot see anything emitted
 * as an asset -- which includes the FontAwesome webfonts, the largest category
 * in `dist`. This script records every category, compares against
 * `scripts/payload-baseline.json`, and fails on regression.
 *
 * Usage:
 *   node scripts/measure-payload.js            # compare against baseline
 *   node scripts/measure-payload.js --update   # rewrite the baseline
 *   node scripts/measure-payload.js --json     # machine-readable output
 *
 * Run `npm run build` first; the script reads `dist/`.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const DIST = path.join(__dirname, "..", "dist", "gecko-web-services");
const BASELINE_PATH = path.join(__dirname, "payload-baseline.json");

// Regression guard: a committed baseline plus a tolerance. The tolerance keeps
// normal drift (a dependency bump, a new component) from failing the build while
// still catching real growth. Lowering the baseline is how a phase locks in its
// win -- see docs/css-payload.md.
const TOLERANCE = { warn: 0.03, error: 0.08 };

// Goals from issue #28, reached by lowering the baseline in the phase that
// achieves them. Reported for visibility; not enforced here, because a phase
// cannot pass its own goal before it lands.
const TARGETS = {
  cssGzip: 20_000, // Phase 1: purge Bootstrap
  fonts: 320_000, // Phase 2: drop the TTF files
  totalGzip: 700_000, // Phases 1 + 2 together
};

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (!entry.name.endsWith(".map")) {
      out.push(full);
    }
  }
  return out;
}

function categorize(file) {
  if (/\.(ttf|woff2?|eot|otf)$/i.test(file)) return "fonts";
  if (file.endsWith(".css")) return "css";
  if (file.endsWith(".js")) return "js";
  if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(file)) return "images";
  return "other";
}

function measure() {
  if (!fs.existsSync(DIST)) {
    console.error(`error: ${DIST} not found. Run "npm run build" first.`);
    process.exit(2);
  }

  const totals = {};
  let rawTotal = 0;
  let transferTotal = 0;

  for (const file of walk(DIST)) {
    const buf = fs.readFileSync(file);
    const kind = categorize(file);

    // Text transfers compressed. Fonts and images are already compressed, so
    // counting their gzip size would flatter the transfer figure; count them raw.
    const precompressed = kind === "fonts" || kind === "images";
    const gzip = zlib.gzipSync(buf, { level: 9 }).length;
    const transfer = precompressed ? buf.length : gzip;

    totals[kind] = totals[kind] || { raw: 0, gzip: 0, transfer: 0, files: 0 };
    totals[kind].raw += buf.length;
    totals[kind].gzip += gzip;
    totals[kind].transfer += transfer;
    totals[kind].files += 1;

    rawTotal += buf.length;
    transferTotal += transfer;
  }

  return {
    totals,
    cssGzip: totals.css ? totals.css.gzip : 0,
    fonts: totals.fonts ? totals.fonts.raw : 0,
    totalGzip: transferTotal,
    rawTotal,
  };
}

function fmt(bytes) {
  return `${bytes.toLocaleString("en-US")} B`;
}

function check(result, baseline) {
  const failures = [];
  const warnings = [];

  if (!baseline) {
    warnings.push("no baseline found; run with --update to record one");
    return { failures, warnings };
  }

  const compare = (label, current, previous) => {
    const warnAt = Math.round(previous * (1 + TOLERANCE.warn));
    const errorAt = Math.round(previous * (1 + TOLERANCE.error));
    const delta = current - previous;
    const pct = previous ? ((delta / previous) * 100).toFixed(1) : "n/a";

    if (current > errorAt) {
      failures.push(
        `${label} is ${fmt(current)}, over the regression limit of ${fmt(errorAt)} ` +
          `(${delta >= 0 ? "+" : ""}${fmt(delta)}, ${pct}% vs baseline)`
      );
    } else if (current > warnAt) {
      warnings.push(`${label} is ${fmt(current)}, up ${fmt(delta)} (${pct}%) vs baseline`);
    }
  };

  compare("css gzip", result.cssGzip, baseline.cssGzip);
  compare("font payload", result.fonts, baseline.fonts);
  compare("total transfer", result.totalGzip, baseline.totalGzip);

  return { failures, warnings };
}

function report(result) {
  console.log("\n  Production payload\n");
  console.log(`  ${"category".padEnd(10)} ${"files".padStart(6)} ${"raw".padStart(14)} ${"transfer".padStart(14)}`);
  console.log(`  ${"-".repeat(46)}`);
  for (const kind of ["js", "css", "fonts", "images", "other"]) {
    const t = result.totals[kind];
    if (!t) continue;
    console.log(`  ${kind.padEnd(10)} ${String(t.files).padStart(6)} ${fmt(t.raw).padStart(14)} ${fmt(t.transfer).padStart(14)}`);
  }
  console.log(`  ${"-".repeat(46)}`);
  console.log(`  ${"total".padEnd(10)} ${"".padStart(6)} ${fmt(result.rawTotal).padStart(14)}`);
  console.log(`\n  css gzip       ${fmt(result.cssGzip)}`);
  console.log(`  font payload   ${fmt(result.fonts)}  (transferred as-is; not compressed further)`);
  console.log(`  total transfer ${fmt(result.totalGzip)}`);

  console.log(`\n  Targets from #28\n`);
  const goal = (label, current, target) => {
    const pct = ((current / target - 1) * 100).toFixed(0);
    const state = current <= target ? "met" : `${pct}% over`;
    console.log(`  ${label.padEnd(15)} ${fmt(current).padStart(14)}  ->  ${fmt(target).padStart(14)}   ${state}`);
  };
  goal("css gzip", result.cssGzip, TARGETS.cssGzip);
  goal("font payload", result.fonts, TARGETS.fonts);
  goal("total transfer", result.totalGzip, TARGETS.totalGzip);
  console.log("");
}

function main() {
  const args = process.argv.slice(2);
  const result = measure();

  if (args.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
    if (!args.includes("--update")) {
      const baseline = fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) : null;
      const { failures } = check(result, baseline);
      process.exit(failures.length ? 1 : 0);
    }
    return;
  }

  report(result);

  if (args.includes("--update")) {
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(result, null, 2) + "\n");
    console.log(`  baseline written to ${path.relative(process.cwd(), BASELINE_PATH)}\n`);
    return;
  }

  const baseline = fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) : null;
  const { failures, warnings } = check(result, baseline);

  for (const w of warnings) console.log(`  warning: ${w}`);
  for (const f of failures) console.error(`  error: ${f}`);

  if (failures.length) {
    console.error(`\n  ${failures.length} budget failure(s).\n`);
    process.exit(1);
  }
  console.log("  All payload budgets pass.\n");
}

main();
