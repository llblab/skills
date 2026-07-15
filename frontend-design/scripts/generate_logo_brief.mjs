#!/usr/bin/env node
/** Generate logo and mark guidance without image generation. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let name = "";
  let limit = 3;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--name") {
      name = args[index + 1] ?? "";
      index += 1;
    } else if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_logo_brief.mjs <query> [--name <name>] [-n <limit>]");
  return { query: query.join(" "), name, limit };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const styles = rankCsv("logo-styles.csv", options.query, options.limit);
  const colors = rankCsv("logo-color-palettes.csv", options.query, options.limit);
  const industries = rankCsv("logo-industries.csv", options.query, 2);
  const lines = [`# Logo Brief: ${options.name || options.query}`, ""];
  if (industries.length > 0) {
    lines.push("## Industry Fit", "");
    for (const row of industries) lines.push(`### ${pick(row, "Industry")}`, mdBullet("Recommended styles", pick(row, "Recommended Styles")), mdBullet("Primary colors", pick(row, "Primary Colors")), mdBullet("Typography", pick(row, "Typography")), mdBullet("Symbols", pick(row, "Common Symbols")), mdBullet("Mood", pick(row, "Mood")), "");
  }
  if (styles.length > 0) {
    lines.push("## Style Candidates", "");
    for (const row of styles) lines.push(`### ${pick(row, "Style Name")}`, mdBullet("Category", pick(row, "Category")), mdBullet("Keywords", pick(row, "Keywords")), mdBullet("Colors", pick(row, "Primary Colors")), mdBullet("Typography", pick(row, "Typography")), mdBullet("Effects", pick(row, "Effects")), mdBullet("Best for", pick(row, "Best For")), "");
  }
  if (colors.length > 0) {
    lines.push("## Palette Candidates", "");
    for (const row of colors) lines.push(`### ${pick(row, "Palette Name")}`, mdBullet("Category", pick(row, "Category")), mdBullet("Primary", pick(row, "Primary Hex")), mdBullet("Secondary", pick(row, "Secondary Hex")), mdBullet("Accent", pick(row, "Accent Hex")), mdBullet("Background", pick(row, "Background Hex")), "");
  }
  lines.push("## Logo Requirements", "", "- Works in one color and reversed color.", "- Recognizable at favicon/app-icon size.", "- Clear silhouette and simple geometry.", "- Horizontal, stacked, icon-only, and monochrome variants considered.", "- No tiny details, unlicensed type, distorted marks, or decoration that fails at small size.");
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
