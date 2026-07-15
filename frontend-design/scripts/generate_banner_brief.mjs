#!/usr/bin/env node
/** Generate a frontend banner or hero brief from local specs. */

import { pathToFileURL } from "node:url";
import { loadCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let style = "";
  let cta = "";
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--style") {
      style = args[index + 1] ?? "";
      index += 1;
    } else if (args[index] === "--cta") {
      cta = args[index + 1] ?? "";
      index += 1;
    } else positional.push(args[index]);
  }
  if (positional.length < 3) throw new Error("Usage: generate_banner_brief.mjs <surface> <type> <message...> [--style <style>] [--cta <cta>]");
  return { surface: positional[0], type: positional[1], message: positional.slice(2).join(" "), style, cta };
}

function findSpec(surface, type) {
  const rows = loadCsv("banner-specs.csv");
  const surfaceQuery = surface.toLowerCase();
  const typeQuery = type.toLowerCase();
  return rows.find((row) => row.surface.toLowerCase().includes(surfaceQuery) && (row.type.toLowerCase().includes(typeQuery) || row.surface.toLowerCase().includes(typeQuery)))
    ?? rows.find((row) => row.surface.toLowerCase().includes(surfaceQuery));
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const row = findSpec(options.surface, options.type);
  if (!row) {
    console.log("No matching banner spec found");
    return 1;
  }
  const lines = [
    `# Banner Brief: ${options.message}`, "",
    `- Surface: ${row.surface} / ${row.type}`,
    `- Size: ${row.size} (${row.aspect_ratio})`,
    `- Safe zone: ${row.safe_zone}`,
    `- Notes: ${row.notes}`,
  ];
  if (options.style) lines.push(`- Art direction: ${options.style}`);
  if (options.cta) lines.push(`- CTA: ${options.cta}`);
  lines.push(
    "", "## Design Rules", "",
    "- One dominant message.",
    "- One CTA when the banner is interactive or ad-like.",
    "- Keep essential text inside the safe zone.",
    "- Max two type families unless the concept requires more.",
    "- Preserve legibility at target display size and thumbnail size.",
    "- Treat platform crop as composition, not simple scaling.",
  );
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
