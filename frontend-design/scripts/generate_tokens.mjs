#!/usr/bin/env node
/** Generate CSS variables from token JSON or a starter preset. */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const STARTER = {
  primitive: {
    color: { "ink-950": "#11100d", "paper-50": "#faf7ef", "amber-500": "#f2a900", "red-600": "#dc2626", "green-600": "#16a34a" },
    space: { 1: "0.25rem", 2: "0.5rem", 4: "1rem", 6: "1.5rem", 8: "2rem" },
    radius: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem" },
    duration: { fast: "150ms", normal: "250ms", slow: "450ms" },
  },
  semantic: {
    color: {
      background: "var(--color-paper-50)", foreground: "var(--color-ink-950)", primary: "var(--color-amber-500)",
      danger: "var(--color-red-600)", success: "var(--color-green-600)", focus: "var(--color-amber-500)",
    },
    space: { component: "var(--space-4)", section: "var(--space-8)" },
  },
  component: {
    button: { bg: "var(--color-primary)", fg: "var(--color-foreground)", radius: "var(--radius-md)", duration: "var(--duration-fast)" },
    input: { border: "color-mix(in srgb, var(--color-foreground) 24%, transparent)", focus: "var(--color-focus)", radius: "var(--radius-md)" },
    card: { bg: "var(--color-background)", padding: "var(--space-component)", radius: "var(--radius-lg)" },
  },
};

export function flatten(prefix, value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => flatten([...prefix, key], child));
  }
  return [[`--${prefix.map((part) => String(part).replaceAll("_", "-")).join("-")}`, String(value)]];
}

export function css(tokens) {
  const lines = [];
  for (const section of ["primitive", "semantic", "component"]) {
    if (!(section in tokens)) continue;
    lines.push(`  /* ${section.toUpperCase()} */`);
    for (const [name, value] of flatten([], tokens[section])) lines.push(`  ${name}: ${value};`);
    lines.push("");
  }
  return `:root {\n${lines.join("\n").trimEnd()}\n}\n`;
}

function parseArgs(args) {
  let starter = false;
  let output = "";
  let file = "";
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--starter") starter = true;
    else if (args[index] === "-o" || args[index] === "--output") {
      output = args[index + 1] ?? "";
      index += 1;
    } else if (!file) file = args[index];
    else throw new Error("Usage: generate_tokens.mjs [file.json | --starter] [-o <output.css>]");
  }
  if (!starter && !file) throw new Error("provide a token JSON file or --starter");
  return { starter, output, file };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
    const data = options.starter ? STARTER : JSON.parse(readFileSync(options.file, "utf8"));
    const result = css(data);
    if (options.output) writeFileSync(options.output, result, "utf8");
    else process.stdout.write(result);
    return 0;
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
