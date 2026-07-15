#!/usr/bin/env node
/** Check WCAG contrast ratio for two hex colors.
 *
 * Usage:
 *   node scripts/contrast_check.mjs '#111827' '#ffffff'
 *   node scripts/contrast_check.mjs '#777' '#fff' --large
 */

import { pathToFileURL } from "node:url";

export function parseHex(value) {
  let raw = String(value).trim().replace(/^#/, "");
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) throw new Error(`Invalid hex color: ${value}`);
  if (raw.length === 3) raw = [...raw].map((character) => character.repeat(2)).join("");
  return [0, 2, 4].map((offset) => Number.parseInt(raw.slice(offset, offset + 2), 16));
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function luminance(rgb) {
  const [red, green, blue] = rgb.map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function ratio(foreground, background) {
  const first = luminance(parseHex(foreground));
  const second = luminance(parseHex(background));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function main(args = process.argv.slice(2)) {
  const largeIndex = args.indexOf("--large");
  const large = largeIndex !== -1;
  const colors = args.filter((argument) => argument !== "--large");
  if (colors.length !== 2) {
    console.error("Usage: contrast_check.mjs <foreground> <background> [--large]");
    return 2;
  }
  try {
    const value = ratio(colors[0], colors[1]);
    const aaThreshold = large ? 3 : 4.5;
    const aaaThreshold = large ? 4.5 : 7;
    console.log(`Contrast: ${value.toFixed(2)}:1`);
    console.log(`UI components AA (3:1): ${value >= 3 ? "PASS" : "FAIL"}`);
    console.log(`Text AA (${aaThreshold}:1): ${value >= aaThreshold ? "PASS" : "FAIL"}`);
    console.log(`Text AAA (${aaaThreshold}:1): ${value >= aaaThreshold ? "PASS" : "FAIL"}`);
    return value >= aaThreshold ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
