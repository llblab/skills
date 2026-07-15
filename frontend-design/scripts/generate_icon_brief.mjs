#!/usr/bin/env node
/** Generate icon guidance from local style and library data. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let style = "";
  let limit = 6;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--style") {
      style = args[index + 1] ?? "";
      index += 1;
    } else if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_icon_brief.mjs <query> [--style <style>] [-n <limit>]");
  return { query, style, limit };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const search = [...options.query, ...(options.style ? [options.style] : [])].join(" ");
  const compact = rankCsv("icon-styles.csv", search, 3);
  const generated = rankCsv("icon-generation-styles.csv", search, 3);
  const icons = rankCsv("icon-library-map.csv", search, options.limit);
  const lines = [`# Icon Brief: ${options.query.join(" ")}`, ""];
  if (compact.length > 0 || generated.length > 0) {
    lines.push("## Style Candidates", "");
    for (const row of compact) lines.push(`### ${pick(row, "style")}`, mdBullet("Best for", pick(row, "best_for")), mdBullet("Stroke", pick(row, "stroke")), mdBullet("Fill", pick(row, "fill")), mdBullet("Checks", pick(row, "checks")), "");
    for (const row of generated) {
      const name = pick(row, "name");
      if (compact.some((candidate) => name.toLowerCase() === pick(candidate, "style").toLowerCase())) continue;
      lines.push(`### ${name}`, mdBullet("Description", pick(row, "description")), mdBullet("Stroke", pick(row, "stroke_width")), mdBullet("Fill", pick(row, "fill")), mdBullet("Best for", pick(row, "best_for")), mdBullet("Keywords", pick(row, "keywords")), "");
    }
  }
  if (icons.length > 0) {
    lines.push("## Icon Candidates", "");
    for (const row of icons) lines.push(`### ${pick(row, "Icon Name")}`, mdBullet("Category", pick(row, "Category")), mdBullet("Keywords", pick(row, "Keywords")), mdBullet("Library", pick(row, "Library")), mdBullet("Usage", pick(row, "Usage")), mdBullet("Best for", pick(row, "Best For")), "");
  }
  lines.push("## Rules", "", "- Keep stroke width, corner style, fill mode, and metaphor family consistent.", "- Use currentColor for inline SVG when possible.", "- Test icons at 16px, 24px, and 48px.", "- Functional icon-only controls need accessible names; decorative icons stay silent.");
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
