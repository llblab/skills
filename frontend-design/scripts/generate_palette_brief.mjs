#!/usr/bin/env node
/** Generate palette guidance from product palettes and color psychology. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

const PALETTE_FIELDS = [
  ["Primary", "Primary"], ["On primary", "On Primary"], ["Secondary", "Secondary"], ["On secondary", "On Secondary"],
  ["Accent", "Accent"], ["On accent", "On Accent"], ["Background", "Background"], ["Foreground", "Foreground"],
  ["Muted", "Muted"], ["Border", "Border"], ["Success", "Success"], ["Warning", "Warning"], ["Error", "Error"], ["Info", "Info"],
];

function parseArgs(args) {
  const query = [];
  const colors = [];
  let readingColors = false;
  for (const argument of args) {
    if (argument === "--colors") readingColors = true;
    else if (readingColors) colors.push(argument);
    else query.push(argument);
  }
  if (query.length === 0) throw new Error("Usage: generate_palette_brief.mjs <query> [--colors <color...>]");
  return { query: query.join(" "), colors };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const palettes = rankCsv("product-color-palettes.csv", options.query, 4);
  const psychology = [];
  for (const color of options.colors.length > 0 ? options.colors : options.query.split(" ")) psychology.push(...rankCsv("color-psychology.csv", color, 1));
  const seen = new Set();
  const uniquePsychology = psychology.filter((row) => {
    const color = pick(row, "color");
    if (seen.has(color)) return false;
    seen.add(color);
    return true;
  });
  const lines = [`# Palette Brief: ${options.query}`, ""];
  if (palettes.length > 0) {
    lines.push("## Product Palette Candidates", "");
    for (const row of palettes) {
      lines.push(`### ${pick(row, "Product Type")}`);
      for (const [label, key] of PALETTE_FIELDS) {
        const value = pick(row, key);
        if (value) lines.push(mdBullet(label, value));
      }
      lines.push("");
    }
  }
  if (uniquePsychology.length > 0) {
    lines.push("## Color Psychology", "");
    for (const row of uniquePsychology) {
      lines.push(
        `### ${pick(row, "color")}`,
        mdBullet("Signals", pick(row, "signals")),
        mdBullet("Common fit", pick(row, "common_fit")),
        mdBullet("Caution", pick(row, "caution")),
        mdBullet("Pairings", pick(row, "pairings")),
        "",
      );
    }
  }
  lines.push(
    "## Rules", "",
    "- Define semantic roles before painting components.",
    "- Check contrast for primary text, muted text, borders, and focus rings.",
    "- Reserve strong color for action, status, or brand memory.",
    "- Do not rely on color alone for state or severity.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
