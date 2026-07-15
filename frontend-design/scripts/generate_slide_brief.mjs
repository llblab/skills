#!/usr/bin/env node
/** Generate a slide, presentation, or section-layout brief. */

import { pathToFileURL } from "node:url";
import { loadCsv, pick, rowText, score, tokenize } from "./_catalog.mjs";

function parseArgs(args) {
  let position;
  let total;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--position") {
      position = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else if (args[index] === "--total") {
      total = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0) throw new Error("Usage: generate_slide_brief.mjs <query> [--position <n>] [--total <n>]");
  return { query: query.join(" "), position, total };
}

function top(name, query) {
  const ranked = loadCsv(name).map((row) => [score(query, rowText(row)), row]).sort((left, right) => right[0] - left[0]);
  return ranked.length > 0 && ranked[0][0] > 0 ? ranked[0][1] : undefined;
}

function value(row, ...keys) {
  return pick(row, ...keys) || "—";
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const query = tokenize(options.query);
  const strategy = top("slide-strategies.csv", query);
  const layout = top("slide-layouts.csv", query);
  const logic = top("slide-layout-logic.csv", query);
  const copy = top("slide-copy.csv", query);
  const color = top("slide-color-logic.csv", query);
  const typography = top("slide-typography.csv", query);
  const chart = top("slide-charts.csv", query);
  const background = top("slide-backgrounds.csv", query);
  const lines = [`# Slide / Section Brief: ${options.query}`, ""];
  if (options.position && options.total) {
    const breakpoints = new Set([Math.max(1, Math.floor(options.total / 3)), Math.max(1, Math.floor(options.total * 2 / 3))]);
    lines.push(`- Position: ${options.position}/${options.total}`, `- Pattern break candidate: ${breakpoints.has(options.position) ? "yes" : "no"}`);
  }
  lines.push(
    `- Strategy: ${value(strategy, "strategy_name")} — ${value(strategy, "goal")}`,
    `- Layout: ${value(layout, "layout_name")} — ${value(layout, "use_case")}`,
    `- Logic: ${value(logic, "layout_pattern")} / ${value(logic, "direction")} / visual weight ${value(logic, "visual_weight")}`,
    `- Copy formula: ${value(copy, "formula_name")} — ${value(copy, "example_template")}`,
    `- Color: bg ${value(color, "background")}, text ${value(color, "text_color")}, accent ${value(color, "accent_usage")}`,
    `- Typography: primary ${value(typography, "primary_size")}, secondary ${value(typography, "secondary_size")}, line-height ${value(typography, "line_height")}`,
    `- Chart if needed: ${value(chart, "chart_type")} — ${value(chart, "when_to_use")}`,
    `- Background: ${value(background, "image_category")} with ${value(background, "overlay_style")} overlay, text ${value(background, "text_placement")}`,
    "", "## Rules", "",
    "- One idea per slide/viewport.",
    "- Prefer direct labels and large readable type.",
    "- Pattern breaks are useful around one-third and two-thirds of a long sequence.",
    "- Charts need labels, not just visual shape.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
