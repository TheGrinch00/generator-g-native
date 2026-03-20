#!/usr/bin/env node

/**
 * Thin CLI that runs the Yeoman generator with short commands.
 * Usage: g-native <subcommand> [options]
 * Example: g-native version  →  yo @thegrinch00/generator-g-native:version
 *
 * No changes to generator code; this just delegates to yo.
 */

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// yo prepends "generator-" when resolving, so use g-native so it finds @thegrinch00/generator-g-native
const GENERATOR = "@thegrinch00/g-native";

const subcommand = process.argv[2];

const help = `
  g-native – short CLI for ${GENERATOR}

  Usage:
    g-native <subcommand> [options]

  Examples:
    g-native version
    g-native app
    g-native pkg-core
    g-native page
    g-native comp

  Subcommands (same as generator names):
    app, version, pkg-core, pkg-ui, pkg-redux, pkg-translations,
    page, comp, form, model, slice, test-app

  Requires: yo and this package installed (e.g. npm i -g yo @thegrinch00/generator-g-native).
`;

if (!subcommand || subcommand === "-h" || subcommand === "--help") {
  console.log(help.trim());
  process.exit(subcommand === "--help" ? 0 : 1);
}

if (subcommand === "-v" || subcommand === "--version") {
  try {
    const pkgPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "package.json",
    );
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    console.log(pkg.version ?? "?");
  } catch {
    console.log("?");
  }
  process.exit(0);
}

const yoArgs = [`${GENERATOR}:${subcommand}`, ...process.argv.slice(3)];
const child = spawn("yo", yoArgs, {
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error("g-native: failed to run yo. Is yo installed? (npm i -g yo)");
  console.error(err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
