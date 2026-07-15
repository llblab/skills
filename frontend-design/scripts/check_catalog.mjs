#!/usr/bin/env node
/** Validate frontend-design catalog contracts and generator smoke paths. */

import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { DATA, parseCsvTable } from "./_catalog.mjs";
import { synthesize } from "./generate_design_brief.mjs";

const ROOT = resolve(DATA, "..");
const SCRIPTS = resolve(ROOT, "scripts");

const SCHEMAS = {
  "app-interface-guidelines.csv": ["Category", "Issue", "Keywords", "Description", "Do", "Don't", "Severity"],
  "banner-specs.csv": ["surface", "type", "size", "aspect_ratio", "safe_zone"],
  "chart-selection.csv": ["Data Type", "Keywords", "Best Chart Type", "When to Use", "When NOT to Use", "Accessibility Grade"],
  "color-psychology.csv": ["color", "signals", "common_fit", "caution", "pairings"],
  "copy-formulas.csv": ["formula", "use_for", "structure", "template", "emotion"],
  "icon-generation-styles.csv": ["name", "description", "stroke_width", "fill", "best_for", "keywords"],
  "icon-library-map.csv": ["Category", "Icon Name", "Keywords", "Library", "Usage", "Best For"],
  "icon-styles.csv": ["style", "best_for", "stroke", "fill", "checks"],
  "identity-deliverables.csv": ["Deliverable", "Category", "Keywords", "Description", "File Format"],
  "identity-industries.csv": ["Industry", "Keywords", "CIP Style", "Primary Colors", "Typography", "Key Deliverables"],
  "identity-mockup-contexts.csv": ["Context Name", "Category", "Keywords", "Scene Description", "Lighting", "Environment"],
  "identity-styles.csv": ["Style Name", "Category", "Keywords", "Description", "Primary Colors", "Typography"],
  "landing-patterns.csv": ["Pattern Name", "Keywords", "Section Order", "Primary CTA Placement", "Conversion Optimization"],
  "logo-color-palettes.csv": ["Palette Name", "Category", "Keywords", "Primary Hex", "Secondary Hex", "Accent Hex"],
  "logo-industries.csv": ["Industry", "Keywords", "Recommended Styles", "Primary Colors", "Typography", "Common Symbols"],
  "logo-styles.csv": ["Style Name", "Category", "Keywords", "Primary Colors", "Typography", "Best For", "Avoid For"],
  "product-color-palettes.csv": ["Product Type", "Primary", "On Primary", "Secondary", "On Secondary", "Accent", "On Accent", "Background", "Foreground", "Card", "Card Foreground", "Muted", "Muted Foreground", "Border", "Destructive", "On Destructive", "Ring"],
  "product-patterns.csv": ["product_category", "pattern_bias", "visual_bias", "must_have", "avoid"],
  "product-reasoning.csv": ["UI_Category", "Recommended_Pattern", "Style_Priority", "Color_Mood", "Typography_Mood", "Decision_Rules", "Anti_Patterns"],
  "product-ui-patterns.csv": ["Product Type", "Keywords", "Primary Style Recommendation", "Secondary Styles", "Landing Page Pattern", "Dashboard Style (if applicable)", "Color Palette Focus", "Key Considerations"],
  "slide-backgrounds.csv": ["slide_type", "image_category", "overlay_style", "text_placement", "search_keywords"],
  "slide-charts.csv": ["chart_type", "keywords", "best_for", "data_type", "when_to_use", "when_to_avoid", "accessibility_notes"],
  "slide-color-logic.csv": ["emotion", "background", "text_color", "accent_usage", "card_style"],
  "slide-copy.csv": ["formula_name", "keywords", "components", "use_case", "example_template", "emotion_trigger", "slide_type"],
  "slide-layout-logic.csv": ["goal", "emotion", "layout_pattern", "direction", "visual_weight", "break_pattern"],
  "slide-layouts.csv": ["layout_name", "keywords", "use_case", "content_zones", "visual_weight", "cta_placement"],
  "slide-strategies.csv": ["strategy_name", "keywords", "structure", "goal", "audience", "tone", "narrative_arc"],
  "slide-typography.csv": ["content_type", "primary_size", "secondary_size", "weight_contrast", "line_height"],
  "style-catalog.csv": ["Style Category", "Type", "Keywords", "Primary Colors", "Effects & Animation", "Best For", "Do Not Use For", "Accessibility", "Implementation Checklist"],
  "style-matrix.csv": ["style", "use_for", "core_moves", "avoid", "implementation_checks"],
  "terminology.csv": ["canonical", "kind", "aliases", "definition", "notes"],
  "typography-pairings.csv": ["Font Pairing Name", "Category", "Heading Font", "Body Font", "Mood/Style Keywords", "Best For"],
  "ux-guidelines.csv": ["Category", "Issue", "Platform", "Description", "Do", "Don't", "Severity"],
};

const REQUIRED_VALUES = {
  "app-interface-guidelines.csv": ["Category", "Issue", "Keywords"],
  "banner-specs.csv": ["surface", "type", "size"],
  "chart-selection.csv": ["Data Type", "Keywords", "Best Chart Type"],
  "color-psychology.csv": ["color", "signals"],
  "copy-formulas.csv": ["formula", "use_for", "structure"],
  "icon-generation-styles.csv": ["name", "description", "keywords"],
  "icon-library-map.csv": ["Category", "Icon Name", "Keywords", "Library"],
  "icon-styles.csv": ["style", "best_for"],
  "identity-deliverables.csv": ["Deliverable", "Category", "Keywords"],
  "identity-industries.csv": ["Industry", "Keywords", "CIP Style"],
  "identity-mockup-contexts.csv": ["Context Name", "Category", "Keywords"],
  "identity-styles.csv": ["Style Name", "Category", "Keywords"],
  "landing-patterns.csv": ["Pattern Name", "Keywords", "Section Order"],
  "logo-color-palettes.csv": ["Palette Name", "Category", "Keywords"],
  "logo-industries.csv": ["Industry", "Keywords", "Recommended Styles"],
  "logo-styles.csv": ["Style Name", "Category", "Keywords"],
  "product-color-palettes.csv": ["Product Type", "Primary", "Background", "Foreground"],
  "product-patterns.csv": ["product_category", "pattern_bias", "visual_bias"],
  "product-reasoning.csv": ["UI_Category", "Recommended_Pattern", "Style_Priority"],
  "product-ui-patterns.csv": ["Product Type", "Keywords", "Primary Style Recommendation"],
  "slide-backgrounds.csv": ["slide_type", "image_category"],
  "slide-charts.csv": ["chart_type", "keywords", "best_for"],
  "slide-color-logic.csv": ["emotion", "background", "text_color"],
  "slide-copy.csv": ["formula_name", "keywords", "components"],
  "slide-layout-logic.csv": ["goal", "layout_pattern", "direction"],
  "slide-layouts.csv": ["layout_name", "keywords", "use_case"],
  "slide-strategies.csv": ["strategy_name", "keywords", "structure"],
  "slide-typography.csv": ["content_type", "primary_size", "secondary_size"],
  "style-catalog.csv": ["Style Category", "Type", "Keywords"],
  "style-matrix.csv": ["style", "use_for", "core_moves"],
  "terminology.csv": ["canonical", "kind", "definition"],
  "typography-pairings.csv": ["Font Pairing Name", "Category", "Heading Font", "Body Font"],
  "ux-guidelines.csv": ["Category", "Issue", "Description", "Do", "Don't", "Severity"],
};

const MAX_ROW_FAILURES_PER_CATALOG = 5;

const SYNTHESIS_CASES = [
  ["healthcare dashboard", ["**Product fit:** Healthcare", "**Context signals:** high-stakes, data-dense", "## Information Presentation Contract", "**Presentation mode:** Operational", "## Decision Ledger", "**Next:**"], []],
  ["modern app", ["**Product fit:** General digital product", "**Direction:** Flat Functional", "**Confidence:** Low", "**Presentation mode:** Exploratory"], []],
  ["playful finance dashboard", ["**Product fit:** Finance", "**Context signals:** high-stakes, data-dense, playful", "professional, clean voice", "**Presentation mode:** Operational"], ["target a playful"]],
  ["luxury hotel booking", ["## Rejected Alternatives", "Choose it only if", "**Presentation mode:** Transactional"], []],
];

const SMOKE_CASES = {
  "generate_banner_brief.mjs": [["linkedin", "header", "product launch"], "# Banner Brief"],
  "generate_chart_brief.mjs": [["analytics", "trend"], "# Chart Brief"],
  "generate_component_brief.mjs": [["dialog", "--context", "mobile destructive confirmation"], "# Component Brief"],
  "generate_copy_formula.mjs": [["landing", "conversion"], "# UI / Landing Copy"],
  "generate_design_brief.mjs": [["crypto", "analytics", "dashboard"], "## Chosen Direction"],
  "generate_icon_brief.mjs": [["dashboard", "settings"], "# Icon Brief"],
  "generate_identity_brief.mjs": [["finance"], "# Identity Package Brief"],
  "generate_logo_brief.mjs": [["fintech"], "# Logo Brief"],
  "generate_palette_brief.mjs": [["healthcare", "dashboard"], "# Palette Brief"],
  "generate_slide_brief.mjs": [["investor", "pitch", "traction"], "# Slide / Section Brief"],
  "generate_tokens.mjs": [["--starter"], ":root"],
  "generate_typography_brief.mjs": [["healthcare", "dashboard"], "# Typography Brief"],
  "generate_ux_checklist.mjs": [["mobile", "form", "accessibility"], "# UX Checklist"],
};

function difference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

export function validateCatalogTable(name, requiredColumns, requiredValues, headers, rows) {
  const errors = [];
  const headerSet = new Set(headers);
  const missing = requiredColumns.filter((column) => !headerSet.has(column));
  if (missing.length > 0) return [`data/${name}: missing required columns: ${missing.join(", ")}`];
  if (rows.length === 0) return [`data/${name}: catalog has no rows`];
  const rowErrors = [];
  rows.forEach((row, index) => {
    const empty = requiredValues.filter((column) => !(row[column] ?? "").trim());
    if (empty.length > 0) rowErrors.push(`data/${name}:${index + 2}: empty routing-critical values: ${empty.join(", ")}`);
  });
  errors.push(...rowErrors.slice(0, MAX_ROW_FAILURES_PER_CATALOG));
  if (rowErrors.length > MAX_ROW_FAILURES_PER_CATALOG) errors.push(`data/${name}: ${rowErrors.length - MAX_ROW_FAILURES_PER_CATALOG} additional row failures suppressed`);
  return errors;
}

export function checkCatalogs(errors) {
  const actual = new Set(readdirSync(DATA).filter((name) => name.endsWith(".csv")));
  const expected = new Set(Object.keys(SCHEMAS));
  const valueContracts = new Set(Object.keys(REQUIRED_VALUES));
  for (const name of difference(expected, actual)) errors.push(`missing catalog: data/${name}`);
  for (const name of difference(actual, expected)) errors.push(`unregistered catalog: data/${name}; add a schema contract before use`);
  for (const name of difference(expected, valueContracts)) errors.push(`data/${name}: missing required-value contract`);
  for (const name of difference(valueContracts, expected)) errors.push(`data/${name}: required-value contract has no schema`);
  for (const [name, requiredColumns] of Object.entries(SCHEMAS)) {
    const requiredValues = REQUIRED_VALUES[name] ?? [];
    const invalidValues = requiredValues.filter((column) => !requiredColumns.includes(column));
    if (invalidValues.length > 0) errors.push(`data/${name}: value requirements are not required columns: ${invalidValues.join(", ")}`);
    if (!actual.has(name)) continue;
    const { headers, rows } = parseCsvTable(readFileSync(resolve(DATA, name), "utf8"));
    errors.push(...validateCatalogTable(name, requiredColumns, requiredValues, headers, rows));
  }
}

export function checkGenerators(errors) {
  const actual = new Set(readdirSync(SCRIPTS).filter((name) => /^generate_.*\.mjs$/.test(name)));
  const expected = new Set(Object.keys(SMOKE_CASES));
  for (const name of difference(actual, expected)) errors.push(`missing smoke case for scripts/${name}`);
  for (const name of difference(expected, actual)) errors.push(`missing generator: scripts/${name}`);
  for (const [name, [args, marker]] of Object.entries(SMOKE_CASES)) {
    if (!actual.has(name)) continue;
    const result = spawnSync("node", [resolve(SCRIPTS, name), ...args], { cwd: ROOT, encoding: "utf8", timeout: 15_000 });
    if (result.error?.code === "ETIMEDOUT") {
      errors.push(`scripts/${name}: smoke test timed out`);
      continue;
    }
    if (result.status !== 0) {
      const detail = (result.stderr || result.stdout || "").trim().split(/\r?\n/).filter(Boolean);
      errors.push(`scripts/${name}: smoke test failed: ${detail.at(-1) ?? `exit ${result.status}`}`);
      continue;
    }
    if (!result.stdout.includes(marker)) errors.push(`scripts/${name}: smoke output missing marker '${marker}'`);
    if (!result.stdout.trim()) errors.push(`scripts/${name}: smoke output is empty`);
  }
}

export function checkValidatorContracts(errors) {
  const optionalEmpty = validateCatalogTable("fixture.csv", ["id", "optional"], ["id"], ["id", "optional"], [{ id: "one", optional: "" }]);
  if (optionalEmpty.length > 0) errors.push("catalog validator contract: optional row values must remain optional");
  const missingColumn = validateCatalogTable("fixture.csv", ["id", "required"], ["id"], ["id"], [{ id: "one" }]);
  if (missingColumn.length !== 1 || !missingColumn[0].includes("missing required columns: required")) errors.push("catalog validator contract: missing-column failure lost focus");
  const noisyRows = Array.from({ length: 8 }, () => ({ id: "" }));
  const focused = validateCatalogTable("fixture.csv", ["id"], ["id"], ["id"], noisyRows);
  if (focused.length !== MAX_ROW_FAILURES_PER_CATALOG + 1 || !focused.at(-1).includes("additional row failures suppressed")) errors.push("catalog validator contract: repeated row failures are not bounded");
}

export function checkSynthesis(errors) {
  for (const [query, required, forbidden] of SYNTHESIS_CASES) {
    const result = synthesize(query, 3);
    for (const marker of required) {
      if (!result.includes(marker)) errors.push(`design synthesis '${query}': missing evidence marker '${marker}'`);
    }
    for (const marker of forbidden) {
      if (result.includes(marker)) errors.push(`design synthesis '${query}': retained conflicting marker '${marker}'`);
    }
  }
}

export function main() {
  const errors = [];
  checkCatalogs(errors);
  checkGenerators(errors);
  checkValidatorContracts(errors);
  checkSynthesis(errors);
  console.log(`Checked ${Object.keys(SCHEMAS).length} catalog contracts and ${Object.keys(SMOKE_CASES).length} generator smoke paths`);
  if (errors.length > 0) {
    for (const error of errors) console.log(`ERROR: ${error}`);
    console.log(`Catalog check failed with ${errors.length} error(s)`);
    return 1;
  }
  console.log("Catalog check passed");
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
