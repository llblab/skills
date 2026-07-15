#!/usr/bin/env node
/** Framework-light heuristic frontend design validator. */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const EXTS = new Set([".html", ".css", ".scss", ".sass", ".js", ".jsx", ".ts", ".tsx", ".svelte", ".vue", ".astro"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".svelte-kit", ".next", "coverage"]);
const CHECKS = [
  ["raw-hex", /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g, "Raw hex color found; prefer existing tokens/variables for repeated semantic values."],
  ["important", /!important\b/g, "!important found; check cascade/token/component boundary."],
  ["outline-none", /outline\s*:\s*none|outline-none/g, "Focus outline removed; ensure visible focus replacement."],
  ["fixed-px-width", /width\s*:\s*\d{3,}px|min-width\s*:\s*\d{3,}px/g, "Large fixed width may break responsive layout."],
  ["placeholder", /placeholder\s*=|::placeholder/g, "Placeholder usage found; verify a visible/persistent label exists."],
  ["img-alt", /<img\b(?![^>]*\balt=)/gi, "Image without alt attribute."],
  ["button-type", /<button\b(?![^>]*\btype=)/gi, "Button without explicit type; forms may submit accidentally."],
];
const GLOBAL_CHECKS = [
  ["reduced-motion", "prefers-reduced-motion", "No reduced-motion handling found in scanned files."],
  ["focus-visible", "focus-visible", "No focus-visible styling found in scanned files."],
];

function walk(path, result) {
  const metadata = statSync(path);
  if (metadata.isFile()) {
    if (EXTS.has(extname(path))) result.push(normalize(path));
    return;
  }
  if (!metadata.isDirectory()) return;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    walk(join(path, entry.name), result);
  }
}

export function files(paths) {
  const result = [];
  for (const path of paths) {
    try {
      walk(path, result);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  return [...new Set(result)].sort();
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function parseArgs(args) {
  let maximum = 80;
  const paths = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--max") {
      maximum = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else paths.push(args[index]);
  }
  if (paths.length === 0 || !Number.isInteger(maximum)) throw new Error("Usage: validate_frontend_design.mjs <path...> [--max <findings>]");
  return { paths, maximum };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const scanned = files(options.paths);
  if (scanned.length === 0) {
    console.log("Heuristic evidence unavailable: scanned 0 frontend files");
    console.log("Check the input paths and supported extensions; no validation was performed.");
    return 2;
  }
  const findings = [];
  const corpus = [];
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (const path of scanned) {
    let text;
    try {
      text = decoder.decode(readFileSync(path));
    } catch (error) {
      if (error instanceof TypeError) continue;
      throw error;
    }
    corpus.push(text);
    for (const [code, pattern, message] of CHECKS) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) findings.push([path, lineNumber(text, match.index), code, message]);
    }
  }
  const joined = corpus.join("\n");
  for (const [code, needle, message] of GLOBAL_CHECKS) {
    if (!joined.includes(needle)) findings.push(["<global>", 0, code, message]);
  }
  console.log(`Heuristic evidence: scanned ${scanned.length} frontend files`);
  if (findings.length === 0) {
    console.log("No heuristic findings; this does not replace framework checks or visual review.");
    return 0;
  }
  for (const [path, line, code, message] of findings.slice(0, options.maximum)) console.log(`${line ? `${path}:${line}` : path}: [${code}] ${message}`);
  const remaining = findings.length - options.maximum;
  if (remaining > 0) console.log(`... ${remaining} more findings`);
  console.log("Heuristic findings require review; confirm them with project checks and rendered behavior.");
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
