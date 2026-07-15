#!/usr/bin/env node
/** Shared dependency-free helpers for frontend-design scripts. */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DATA = resolve(ROOT, "data");
export const REFS = resolve(ROOT, "references");

export function tokenize(text) {
  return String(text).toLowerCase().match(/[a-zA-Z0-9_+-]+/g) ?? [];
}

export function parseCsvTable(text) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      record.push(field);
      field = "";
    } else if (character === "\n") {
      record.push(field.endsWith("\r") ? field.slice(0, -1) : field);
      records.push(record);
      record = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field.length > 0 || record.length > 0) {
    record.push(field.endsWith("\r") ? field.slice(0, -1) : field);
    records.push(record);
  }
  if (quoted) throw new Error("CSV contains an unterminated quoted field");
  if (records.length === 0) return { headers: [], rows: [] };
  const [headers, ...rawRows] = records;
  const rows = rawRows.filter((row) => row.some((value) => value.length > 0)).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
  return { headers, rows };
}

export function parseCsv(text) {
  return parseCsvTable(text).rows;
}

export function loadCsv(name) {
  try {
    return parseCsv(readFileSync(resolve(DATA, name), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

export function terminologyRows() {
  return loadCsv("terminology.csv");
}

export function expandQuery(text) {
  const raw = String(text).toLowerCase();
  const expanded = tokenize(raw);
  for (const row of terminologyRows()) {
    const canonical = row.canonical ?? "";
    const aliases = (row.aliases ?? "").split(";").map((item) => item.trim()).filter(Boolean);
    if ([canonical, ...aliases].some((name) => name && raw.includes(name.toLowerCase()))) {
      expanded.push(...tokenize(canonical));
      for (const alias of aliases) expanded.push(...tokenize(alias));
    }
  }
  return [...new Set(expanded)];
}

export function stringify(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(stringify).join(" ");
  return String(value);
}

export function rowText(row) {
  return Object.values(row).map(stringify).join(" ");
}

export function score(query, text) {
  const words = tokenize(text);
  if (words.length === 0) return 0;
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  const norm = 1 + Math.log(words.length + 1);
  let value = 0;
  for (const term of query) {
    value += (counts.get(term) ?? 0) / norm;
    for (const word of counts.keys()) {
      if (term !== word && word.includes(term)) value += 0.2 / norm;
    }
  }
  return value;
}

export function rankCsvScored(name, queryText, limit = 5) {
  const query = expandQuery(Array.isArray(queryText) ? queryText.join(" ") : queryText);
  return loadCsv(name)
    .map((row) => [score(query, rowText(row)), row])
    .sort((left, right) => right[0] - left[0])
    .slice(0, limit)
    .filter(([value]) => value > 0);
}

export function rankCsv(name, queryText, limit = 5) {
  return rankCsvScored(name, queryText, limit).map(([, row]) => row);
}

export function pick(row, ...keys) {
  if (!row) return "";
  for (const key of keys) {
    if (row[key]) return row[key];
  }
  return "";
}

export function mdBullet(label, value) {
  return value ? `- **${label}:** ${value}` : `- **${label}:** —`;
}

export function printRows(title, rows, fields) {
  const lines = [];
  if (rows.length > 0) {
    lines.push(`## ${title}`, "");
    for (const row of rows) {
      lines.push(`### ${pick(row, fields[0][1]) || title}`);
      for (const [label, key] of fields.slice(1)) lines.push(mdBullet(label, pick(row, key)));
      lines.push("");
    }
  }
  return lines;
}
