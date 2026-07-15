#!/usr/bin/env node
/** Generate typography pairing guidance. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

const FIELDS = [
  ["Category", "Category"], ["Heading", "Heading Font"], ["Body", "Body Font"],
  ["Mood", "Mood/Style Keywords"], ["Best for", "Best For"], ["Google Fonts", "Google Fonts URL"],
  ["CSS import", "CSS Import"], ["Tailwind config", "Tailwind Config"], ["Scale", "Type Scale"],
  ["Weights", "Recommended Weights"], ["Accessibility", "Accessibility Notes"],
];

function parseArgs(args) {
  let limit = 4;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_typography_brief.mjs <query> [-n <limit>]");
  return { query: query.join(" "), limit };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const lines = [`# Typography Brief: ${options.query}`, ""];
  for (const row of rankCsv("typography-pairings.csv", options.query, options.limit)) {
    lines.push(`## ${pick(row, "Font Pairing Name")}`);
    for (const [label, key] of FIELDS) {
      const value = pick(row, key);
      if (value) lines.push(mdBullet(label, value));
    }
    lines.push("");
  }
  lines.push(
    "## Rules", "",
    "- Body text starts at readable size before personality.",
    "- Use tabular numerals for metrics, prices, timers, and tables.",
    "- Control line length: prose around 65-75ch, mobile 35-60ch.",
    "- If fonts are constrained, create character through scale, weight, rhythm, tracking, and contrast.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
