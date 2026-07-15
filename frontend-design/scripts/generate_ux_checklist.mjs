#!/usr/bin/env node
/** Generate a targeted UX checklist from detailed UX matrices. */

import { pathToFileURL } from "node:url";
import { pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let severity = "";
  let limit = 12;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--severity") {
      severity = args[index + 1] ?? "";
      index += 1;
    } else if (argument === "-n" || argument === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(argument);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_ux_checklist.mjs <query> [--severity <value>] [-n <limit>]");
  return { query: query.join(" "), severity, limit };
}

function emit(rows, title, severity) {
  const filtered = rows.filter((row) => !severity || pick(row, "Severity").toLowerCase().includes(severity.toLowerCase()));
  if (filtered.length === 0) return [];
  const lines = [`## ${title}`, ""];
  for (const row of filtered) {
    const label = [pick(row, "Category"), pick(row, "Issue")].filter(Boolean).join(" / ");
    lines.push(`- [ ] **${label}**`);
    const fields = [["Description", "Description"], ["Do", "Do"], ["Don't", "Don't"], ["Severity", "Severity"]];
    for (const [fieldLabel, key] of fields) {
      const value = pick(row, key);
      if (value) lines.push(`  - ${fieldLabel}: ${value}`);
    }
  }
  lines.push("");
  return lines;
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const lines = [`# UX Checklist: ${options.query}`, ""];
  lines.push(...emit(rankCsv("ux-guidelines.csv", options.query, options.limit), "UX Guidelines", options.severity));
  lines.push(...emit(rankCsv("app-interface-guidelines.csv", options.query, Math.max(4, Math.floor(options.limit / 2))), "App Interface Guidelines", options.severity));
  lines.push(
    "## Universal Floor", "",
    "- [ ] Keyboard path works for the full flow.",
    "- [ ] Focus is visible and logical.",
    "- [ ] Contrast is checked for text, controls, borders, focus, and status.",
    "- [ ] Mobile width has no accidental horizontal scroll.",
    "- [ ] Loading, empty, error, disabled, and success states exist.",
    "- [ ] Motion respects reduced-motion preferences.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
