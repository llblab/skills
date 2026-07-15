#!/usr/bin/env node
/** Extract portable brand context from Markdown guidelines.
 *
 * Usage:
 *   node scripts/extract_brand_context.mjs docs/brand-guidelines.md
 *   node scripts/extract_brand_context.mjs docs/brand-guidelines.md --json
 */

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const SECTION_NAMES = ["voice", "tone", "personality", "messaging", "typography", "logo", "colors", "colour"];

export function extractSections(text) {
  const sections = new Map();
  let current = "overview";
  for (const line of text.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) current = heading[2].trim().toLowerCase();
    if (SECTION_NAMES.some((key) => current.includes(key))) {
      if (!sections.has(current)) sections.set(current, []);
      sections.get(current).push(line);
    }
  }
  return Object.fromEntries([...sections].map(([key, lines]) => [key, lines.join("\n").trim()]).filter(([, value]) => value));
}

export function extractFonts(text) {
  const patterns = [
    /font(?:-family)?\s*[:=]\s*[`'"]?([^`'"\n;]+)/gi,
    /--font-[a-z-]+\s*:\s*['"]?([^'";]+)/gi,
    /\b(?:Inter|Roboto|Arial|Helvetica|Georgia|Times|Montserrat|Poppins|Lora|Merriweather|JetBrains Mono|IBM Plex [A-Za-z]+|Space Grotesk|Manrope|Outfit)\b/gi,
  ];
  const fonts = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = (match[1] ?? match[0]).trim();
      if (value && !fonts.includes(value)) fonts.push(value);
    }
  }
  return fonts.slice(0, 12);
}

export function extract(path) {
  const text = readFileSync(path, "utf8");
  const colors = [...new Set(text.match(/#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g) ?? [])].sort();
  const prohibited = [...text.matchAll(/(?:avoid|forbidden|prohibited|never use)[:\s-]+([^\n]+)/gi)].slice(0, 20).map((match) => match[1].replace(/^[ -*`']+|[ -*`']+$/g, ""));
  return { source: path, colors, fonts: extractFonts(text), sections: extractSections(text), prohibited };
}

export function markdown(data) {
  const lines = ["# Brand Context", "", `Source: \`${data.source}\``, ""];
  if (data.colors.length > 0) lines.push("## Colors", "", data.colors.map((color) => `\`${color}\``).join(", "), "");
  if (data.fonts.length > 0) lines.push("## Typography", "", data.fonts.map((font) => `\`${font}\``).join(", "), "");
  if (data.prohibited.length > 0) lines.push("## Avoid", "", ...data.prohibited.map((item) => `- ${item}`), "");
  if (Object.keys(data.sections).length > 0) {
    lines.push("## Relevant Sections", "");
    for (const [name, content] of Object.entries(data.sections)) {
      let excerpt = String(content).replace(/\s+/g, " ").trim();
      if (excerpt.length > 500) excerpt = `${excerpt.slice(0, 497)}...`;
      lines.push(`### ${name}`, excerpt, "");
    }
  }
  return lines.join("\n");
}

export function main(args = process.argv.slice(2)) {
  const json = args.includes("--json");
  const files = args.filter((argument) => argument !== "--json");
  if (files.length !== 1) {
    console.error("Usage: extract_brand_context.mjs <brand-guidelines.md> [--json]");
    return 2;
  }
  try {
    const data = extract(files[0]);
    console.log(json ? JSON.stringify(data, null, 2) : markdown(data));
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
