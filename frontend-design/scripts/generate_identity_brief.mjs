#!/usr/bin/env node
/** Generate identity package and CIP deliverable guidance. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

function parseArgs(args) {
  let limit = 4;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: generate_identity_brief.mjs <query> [-n <limit>]");
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
  const deliverables = rankCsv("identity-deliverables.csv", options.query, options.limit);
  const industries = rankCsv("identity-industries.csv", options.query, 2);
  const styles = rankCsv("identity-styles.csv", options.query, 2);
  const mockups = rankCsv("identity-mockup-contexts.csv", options.query, 2);
  const lines = [`# Identity Package Brief: ${options.query}`, ""];
  if (industries.length > 0) {
    lines.push("## Industry Direction", "");
    for (const row of industries) lines.push(`### ${pick(row, "Industry")}`, mdBullet("CIP style", pick(row, "CIP Style")), mdBullet("Primary colors", pick(row, "Primary Colors")), mdBullet("Typography", pick(row, "Typography")), mdBullet("Key deliverables", pick(row, "Key Deliverables")), "");
  }
  if (styles.length > 0) {
    lines.push("## Identity Styles", "");
    for (const row of styles) lines.push(`### ${pick(row, "Style Name")}`, mdBullet("Description", pick(row, "Description")), mdBullet("Colors", pick(row, "Primary Colors")), mdBullet("Typography", pick(row, "Typography")), mdBullet("Materials", pick(row, "Materials")), "");
  }
  if (deliverables.length > 0) {
    lines.push("## Deliverables", "");
    for (const row of deliverables) lines.push(`### ${pick(row, "Deliverable")}`, mdBullet("Category", pick(row, "Category")), mdBullet("Description", pick(row, "Description")), mdBullet("Dimensions", pick(row, "Dimensions")), mdBullet("Format", pick(row, "File Format")), mdBullet("Logo placement", pick(row, "Logo Placement")), "");
  }
  if (mockups.length > 0) {
    lines.push("## Mockup Contexts", "");
    for (const row of mockups) lines.push(`### ${pick(row, "Context Name")}`, mdBullet("Scene", pick(row, "Scene Description")), mdBullet("Lighting", pick(row, "Lighting")), mdBullet("Environment", pick(row, "Environment")), mdBullet("Props", pick(row, "Props")), "");
  }
  lines.push("## Handoff Rules", "", "- Include logo variants, palette, typography, and usage rules.", "- Specify dimensions, file formats, material/finish assumptions, and production constraints.", "- Separate digital assets, print assets, source files, and exports.", "- Keep naming and versioning stable for approvals.");
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
