#!/usr/bin/env node
/** Lookup persuasive UI, landing, and presentation copy formulas. */

import { pathToFileURL } from "node:url";
import { pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let limit = 2;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_copy_formula.mjs <query> [-n <limit>]");
  return { query: query.join(" "), limit };
}

function compactLines(rows) {
  return rows.flatMap((row) => [
    `## ${pick(row, "formula")}`,
    `Use for: ${pick(row, "use_for")}`,
    `Structure: ${pick(row, "structure")}`,
    `Template: ${pick(row, "template")}`,
    `Emotion: ${pick(row, "emotion")}`,
    "",
  ]);
}

function slideLines(rows) {
  return rows.flatMap((row) => [
    `## Slide: ${pick(row, "formula_name")}`,
    `Use case: ${pick(row, "use_case")}`,
    `Components: ${pick(row, "components")}`,
    `Template: ${pick(row, "example_template")}`,
    `Emotion: ${pick(row, "emotion_trigger")}`,
    `Slide type: ${pick(row, "slide_type")}`,
    "",
  ]);
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const compact = rankCsv("copy-formulas.csv", options.query, options.limit);
  const slides = rankCsv("slide-copy.csv", options.query, options.limit);
  if (compact.length === 0 && slides.length === 0) {
    console.log("No matching formula");
    return 1;
  }
  const lines = [];
  if (compact.length > 0) lines.push("# UI / Landing Copy", "", ...compactLines(compact));
  if (slides.length > 0) lines.push("# Presentation Copy", "", ...slideLines(slides));
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
