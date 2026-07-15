#!/usr/bin/env node
/** Generate chart and data-visualization guidance. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

const CHART_FIELDS = [
  ["Data type", "Data Type"], ["Secondary", "Secondary Options"], ["Use when", "When to Use"],
  ["Avoid when", "When NOT to Use"], ["Volume", "Data Volume Threshold"], ["Color", "Color Guidance"],
  ["Accessibility", "Accessibility Grade"], ["Interaction", "Interaction Pattern"],
];

function parseArgs(args) {
  let limit = 3;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_chart_brief.mjs <query> [-n <limit>]");
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
  const charts = rankCsv("chart-selection.csv", options.query, options.limit);
  const slides = rankCsv("slide-charts.csv", options.query, Math.min(options.limit, 2));
  const lines = [`# Chart Brief: ${options.query}`, ""];
  if (charts.length > 0) {
    lines.push("## Chart Candidates", "");
    for (const row of charts) {
      lines.push(`### ${pick(row, "Best Chart Type")}`);
      for (const [label, key] of CHART_FIELDS) {
        const value = pick(row, key);
        if (value) lines.push(mdBullet(label, value));
      }
      lines.push("");
    }
  }
  if (slides.length > 0) {
    lines.push("## Presentation Chart Fit", "");
    for (const row of slides) {
      lines.push(
        `### ${pick(row, "chart_type")}`,
        mdBullet("Best for", pick(row, "best_for")),
        mdBullet("Data type", pick(row, "data_type")),
        mdBullet("Use", pick(row, "when_to_use")),
        mdBullet("Avoid", pick(row, "when_to_avoid")),
        mdBullet("Max categories", pick(row, "max_categories")),
        "",
      );
    }
  }
  lines.push(
    "## Rules", "",
    "- Start from the question the user must answer.",
    "- Label important values directly where possible.",
    "- Do not rely on color alone; use text, position, shape, or icons.",
    "- Preserve truthful scales and label truncation/log scales explicitly.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
