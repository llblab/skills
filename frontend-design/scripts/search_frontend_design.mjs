#!/usr/bin/env node
/** Search frontend-design references and CSV data with dependency-free Node ESM.
 *
 * Usage:
 *   node scripts/search_frontend_design.mjs dashboard
 *   node scripts/search_frontend_design.mjs "trust finance" --data-only
 *   node scripts/search_frontend_design.mjs motion --refs-only -n 8
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { DATA, REFS, expandQuery, loadCsv, tokenize } from "./_catalog.mjs";

const ROOT = resolve(DATA, "..");

function parseArgs(args) {
  let limit = 6;
  let refsOnly = false;
  let dataOnly = false;
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "-n" || argument === "--limit") {
      limit = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else if (argument === "--refs-only") {
      refsOnly = true;
    } else if (argument === "--data-only") {
      dataOnly = true;
    } else {
      query.push(argument);
    }
  }
  if (query.length === 0 || !Number.isInteger(limit)) throw new Error("Usage: search_frontend_design.mjs <query> [-n <limit>] [--refs-only|--data-only]");
  return { query: query.join(" "), limit, refsOnly, dataOnly };
}

function searchScore(query, text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;
  const counts = new Map();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  const norm = 1 + Math.log(tokens.length + 1);
  let value = 0;
  for (const term of query) {
    value += (counts.get(term) ?? 0) / norm;
    for (const token of counts.keys()) {
      if (term !== token && token.includes(term)) value += 0.25 / norm;
    }
  }
  return value;
}

function referenceChunks() {
  const chunks = [];
  for (const name of readdirSync(REFS).filter((entry) => entry.endsWith(".md")).sort()) {
    const text = readFileSync(resolve(REFS, name), "utf8");
    let currentTitle = name;
    let current = [];
    for (const line of text.split(/\r?\n/)) {
      if (line.startsWith("## ") && current.length > 0) {
        chunks.push({ source: relative(ROOT, resolve(REFS, name)), title: currentTitle, text: current.join("\n").trim() });
        current = [];
      }
      if (line.startsWith("#")) currentTitle = line.replace(/^#+\s*/, "").trim() || currentTitle;
      current.push(line);
    }
    if (current.length > 0) chunks.push({ source: relative(ROOT, resolve(REFS, name)), title: currentTitle, text: current.join("\n").trim() });
  }
  return chunks;
}

function formatRow(row) {
  return Object.entries(row).filter(([, value]) => value != null).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join(" | ");
}

function dataRows() {
  const rows = [];
  for (const name of readdirSync(DATA).filter((entry) => entry.endsWith(".csv")).sort()) {
    loadCsv(name).forEach((row, index) => {
      const title = row.canonical || row.style || row.product_category || row["Product Type"] || row["Style Category"] || row["Pattern Name"] || `row ${index + 1}`;
      rows.push({ source: `data/${basename(name)}`, title, text: formatRow(row) });
    });
  }
  return rows;
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const query = expandQuery(options.query);
  const documents = [];
  if (!options.dataOnly) documents.push(...referenceChunks());
  if (!options.refsOnly) documents.push(...dataRows());
  const ranked = documents.map((document) => [searchScore(query, `${document.text} ${document.title}`), document]).sort((left, right) => right[0] - left[0]);
  const lines = [];
  let shown = 0;
  for (const [value, document] of ranked) {
    if (value <= 0) continue;
    let excerpt = document.text.replace(/\s+/g, " ").trim();
    if (excerpt.length > 520) excerpt = `${excerpt.slice(0, 517)}...`;
    lines.push(`## ${document.title}`, `Source: ${document.source} | score=${value.toFixed(3)}`, excerpt, "");
    shown += 1;
    if (shown >= options.limit) break;
  }
  if (shown === 0) lines.push("No matches");
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
