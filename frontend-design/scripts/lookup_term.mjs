#!/usr/bin/env node
/** Lookup canonical frontend-design terminology.
 *
 * Usage:
 *   node scripts/lookup_term.mjs neubrutalism
 *   node scripts/lookup_term.mjs "soft ui"
 */

import { pathToFileURL } from "node:url";
import { loadCsv, mdBullet, pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let limit = 5;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else {
      query.push(args[index]);
    }
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: lookup_term.mjs <query> [-n <limit>]");
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
  const normalized = options.query.toLowerCase();
  const allRows = loadCsv("terminology.csv");
  const exact = allRows.filter((row) => {
    const names = [pick(row, "canonical"), ...pick(row, "aliases").split(";").map((item) => item.trim()).filter(Boolean)];
    return names.some((name) => name.toLowerCase() === normalized);
  });
  const rows = exact.length > 0 ? exact : rankCsv("terminology.csv", options.query, options.limit);
  if (rows.length === 0) {
    console.log("No matching term");
    return 1;
  }
  const lines = [`# Terminology Lookup: ${options.query}`, ""];
  for (const row of rows) {
    lines.push(
      `## ${pick(row, "canonical")}`,
      mdBullet("Kind", pick(row, "kind")),
      mdBullet("Aliases", pick(row, "aliases")),
      mdBullet("Definition", pick(row, "definition")),
      mdBullet("Notes", pick(row, "notes")),
      "",
    );
  }
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
