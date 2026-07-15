#!/usr/bin/env node
/** Synthesize one coherent frontend direction from the local design catalog. */

import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { expandQuery, loadCsv, pick, rankCsv, rankCsvScored, rowText, score } from "./_catalog.mjs";

function joined(...values) {
  return values.filter(Boolean).join(" ");
}

function firstSentence(value) {
  for (const separator of [";", "."]) {
    if (value.includes(separator)) return value.split(separator, 1)[0].trim();
  }
  return value.trim();
}

function firstMove(value) {
  for (const separator of [",", ";", "+"]) {
    if (value.includes(separator)) return value.split(separator, 1)[0].trim();
  }
  return value.trim();
}

function bullet(label, value) {
  return `- **${label}:** ${value}`;
}

function required(value, fallback) {
  return value.trim() || fallback;
}

function intersects(values, candidates) {
  return [...candidates].some((candidate) => values.has(candidate));
}

function inferSurface(query) {
  if (intersects(query, new Set(["landing", "homepage", "marketing", "conversion", "signup", "waitlist", "pricing", "hero"]))) return "Landing / marketing surface";
  if (intersects(query, new Set(["dashboard", "analytics", "metrics", "monitoring", "admin", "report", "kpi"]))) return "Dashboard / operational surface";
  if (intersects(query, new Set(["booking", "checkout", "form", "onboarding", "order", "payment", "purchase", "reservation", "flow", "wizard"]))) return "Form / task flow";
  if (intersects(query, new Set(["slide", "slides", "presentation", "deck", "pitch"]))) return "Presentation / narrative surface";
  if (intersects(query, new Set(["component", "button", "dialog", "modal", "table", "card", "navigation"]))) return "Component / reusable interface surface";
  return "Product interface surface";
}

function presentationContract(surface, query) {
  if (surface === "Dashboard / operational surface" && intersects(query, new Set(["analytics", "compare", "comparison", "distribution", "metrics", "report", "trend"]))) {
    return {
      mode: "Analytical",
      question: "What changed, compared with what, and which evidence explains the material difference?",
      firstScan: "scope and timeframe → material result or delta → comparison → explanation → drilldown or action",
      persistent: "active filters, baseline, units, timeframe, freshness, and uncertainty",
    };
  }
  if (surface === "Dashboard / operational surface") return {
    mode: "Operational",
    question: "What needs attention now, why does it matter, and what action or recovery is available?",
    firstScan: "orientation → status and exceptions → impact → owner or action → supporting detail",
    persistent: "scope, severity, freshness, ownership, active filters, and recovery state",
  };
  if (surface === "Form / task flow") return {
    mode: "Transactional",
    question: "What am I committing to, what input or consequence matters, and how can I correct or recover?",
    firstScan: "goal and consequence → required input → validation → commitment → confirmation",
    persistent: "progress, entered state, cost or risk, validation, and cancel or back path",
  };
  if (surface === "Landing / marketing surface" || surface === "Presentation / narrative surface") return {
    mode: "Narrative",
    question: "What should the audience understand or believe, what proves it, and what should happen next?",
    firstScan: "primary claim → mechanism or benefit → evidence → boundary or risk → action",
    persistent: "audience context, claim continuity, proof, and current narrative position",
  };
  if (surface === "Component / reusable interface surface") return {
    mode: "Reference",
    question: "What does this component do, what state is it in, and how should a user operate or interpret it?",
    firstScan: "identity → current value or state → primary operation → feedback → supporting detail",
    persistent: "label, state, scope, affordance, and error or recovery context",
  };
  return {
    mode: "Exploratory",
    question: "What options or information exist, how do they differ, and how can the user narrow or act?",
    firstScan: "orientation → available dimensions → current selection → differentiators → detail or action",
    persistent: "scope, selection, filters, comparison criteria, and return context",
  };
}

const SIGNALS = [
  ["high-stakes", new Set(["banking", "crypto", "finance", "fintech", "government", "healthcare", "legal", "medical", "money", "public", "security"])],
  ["data-dense", new Set(["admin", "analytics", "dashboard", "data", "metrics", "monitoring", "operations", "report", "table"])],
  ["conversion", new Set(["booking", "checkout", "conversion", "landing", "lead", "pricing", "signup", "waitlist"])],
  ["expressive", new Set(["creative", "entertainment", "experimental", "game", "gaming", "immersive", "portfolio", "storytelling"])],
  ["luxury", new Set(["hospitality", "luxury", "premium", "refined"] )],
  ["playful", new Set(["children", "education", "friendly", "kids", "playful"] )],
];
const NOISE_TERMS = new Set(["clear", "design", "interface", "product", "surface", "system", "with"]);

function contextSignals(query) {
  return SIGNALS.filter(([, terms]) => intersects(query, terms)).map(([label]) => label);
}

function matchingTerms(query, text, limit = 4) {
  const vocabulary = new Set(expandQuery(text));
  return [...new Set(query.filter((term) => term.length > 3 && !NOISE_TERMS.has(term) && vocabulary.has(term)))].sort().slice(0, limit);
}

function assessProducts(queryText) {
  const query = expandQuery(queryText);
  return loadCsv("product-patterns.csv").map((row) => {
    const lexical = score(query, rowText(row));
    const identity = score(query, pick(row, "product_category"));
    return { row, total: lexical + 2 * identity, lexical, identity };
  }).sort((left, right) => right.total - left.total);
}

function bestContextRow(name, contextText, identityQueryText, ...identityKeys) {
  const context = expandQuery(contextText);
  const identityQuery = expandQuery(identityQueryText);
  return loadCsv(name).map((row) => {
    const identityText = identityKeys.map((key) => pick(row, key)).filter(Boolean).join(" ");
    return [score(context, rowText(row)) + 4 * score(identityQuery, identityText), row];
  }).sort((left, right) => right[0] - left[0])[0]?.[1] ?? {};
}

function assessStyles(styleQuery, contextQuery, limit) {
  const context = expandQuery(contextQuery);
  return rankCsvScored("style-matrix.csv", styleQuery, 100).map(([lexical, row]) => {
    const fitText = joined(pick(row, "use_for"), pick(row, "core_moves"));
    const avoidText = pick(row, "avoid");
    const noConflict = avoidText.trim().toLowerCase().startsWith("none");
    const contextualFit = score(context, fitText);
    const conflict = noConflict ? 0 : score(context, avoidText);
    return {
      row,
      total: lexical + 0.8 * contextualFit - 1.4 * conflict,
      lexical,
      contextualFit,
      conflict,
      fitTerms: matchingTerms(context, fitText),
      conflictTerms: noConflict ? [] : matchingTerms(context, avoidText),
    };
  }).sort((left, right) => right.total - left.total).slice(0, limit);
}

function relativeMargin(candidates) {
  if (candidates.length < 2) return 0;
  return (candidates[0].total - candidates[1].total) / Math.max(Math.abs(candidates[0].total), 0.1);
}

function confidenceNote(products, styles) {
  const productMargin = relativeMargin(products);
  const styleMargin = relativeMargin(styles);
  const product = products[0];
  const chosen = styles[0];
  const runner = styles[1];
  const chosenName = required(pick(chosen?.row, "style"), "the chosen direction");
  const runnerName = required(pick(runner?.row, "style"), "the nearest alternative");
  if (!product || product.total < 0.1 || (product.identity === 0 && product.total < 0.35) || productMargin < 0.08) return `Low — product context remains ambiguous; treat ${chosenName} as provisional and validate it against project evidence.`;
  if (!chosen || !runner) return `Low — catalog evidence is sparse; treat ${chosenName} as provisional.`;
  if (chosen.conflictTerms.length > 0) return `Low — ${chosenName} conflicts with ${chosen.conflictTerms.join(", ")}; compare it directly with ${runnerName}.`;
  if (styleMargin >= 0.3) return `High — ${chosenName} has materially stronger contextual support than ${runnerName}.`;
  if (styleMargin >= 0.12) return `Medium — ${chosenName} leads, but ${runnerName} remains plausible if project evidence changes the emphasis.`;
  return `Low — ${chosenName} and ${runnerName} remain close; use their fit and failure modes as the discriminator.`;
}

export function synthesize(queryText, alternatives) {
  const query = expandQuery(queryText);
  const querySet = new Set(query);
  const surface = inferSurface(querySet);
  const presentation = presentationContract(surface, querySet);
  const productAssessments = assessProducts(queryText);
  const productAssessment = productAssessments[0];
  const productSupported = productAssessment && (productAssessment.identity > 0 || productAssessment.total >= 0.35);
  const compactProduct = productSupported ? productAssessment.row : {};
  const productName = required(pick(compactProduct, "product_category"), "General digital product");
  const productMust = required(pick(compactProduct, "must_have"), "clear primary action, complete states, recoverable errors");
  const productAvoid = required(pick(compactProduct, "avoid"), "generic decoration without product meaning");
  const extendedQuery = joined(queryText, productName, pick(compactProduct, "visual_bias"), pick(compactProduct, "pattern_bias"));
  const extendedProduct = productSupported ? bestContextRow("product-ui-patterns.csv", extendedQuery, productName, "Product Type", "Keywords") : {};
  const reasoning = productSupported ? bestContextRow("product-reasoning.csv", extendedQuery, productName, "UI_Category") : {};
  const keyConsiderations = required(pick(extendedProduct, "Key Considerations"), productMust);
  const signals = contextSignals(querySet);
  const styleQuery = joined(queryText, productName, pick(compactProduct, "visual_bias"), pick(extendedProduct, "Primary Style Recommendation"), pick(reasoning, "Style_Priority"));
  const contextQuery = joined(queryText, productName, surface, productMust, keyConsiderations, signals.join(" "));
  let styleAssessments = assessStyles(styleQuery, contextQuery, Math.max(4, alternatives + 2));
  if (!productSupported) {
    const baseline = styleAssessments.findIndex((candidate) => pick(candidate.row, "style") === "Flat Functional");
    if (baseline > 0) styleAssessments = [styleAssessments[baseline], ...styleAssessments.slice(0, baseline), ...styleAssessments.slice(baseline + 1)];
  }
  const chosenAssessment = styleAssessments[0];
  const chosenStyle = chosenAssessment?.row ?? {};
  const styleName = required(pick(chosenStyle, "style"), "Project-native minimalism");
  const alternativePool = styleAssessments.slice(1).filter((candidate) => pick(candidate.row, "style") !== styleName);
  const paletteQuery = joined(queryText, productName, pick(reasoning, "Color_Mood"), styleName);
  const palette = rankCsv("product-color-palettes.csv", paletteQuery, 1)[0] ?? {};
  const typeQuery = signals.includes("high-stakes")
    ? joined(productName, surface, styleName, "professional readable accessible trustworthy")
    : joined(queryText, productName, styleName, "readable accessible");
  const typography = rankCsv("typography-pairings.csv", typeQuery, 1)[0] ?? {};
  const wantsLanding = intersects(querySet, new Set(["landing", "homepage", "marketing", "conversion", "signup", "waitlist", "pricing", "hero"]));
  const wantsChart = intersects(querySet, new Set(["trend", "time", "comparison", "compare", "categories", "distribution", "relationship", "correlation", "flow", "funnel", "geography", "map", "forecast"]));
  const landing = wantsLanding ? rankCsv("landing-patterns.csv", extendedQuery, 1)[0] ?? {} : {};
  const chart = wantsChart ? rankCsv("chart-selection.csv", extendedQuery, 1)[0] ?? {} : {};
  const ux = rankCsv("ux-guidelines.csv", joined(queryText, surface, productName, "accessibility responsive interaction"), 4);
  let patternValue;
  if (Object.keys(landing).length > 0) patternValue = pick(landing, "Pattern Name");
  else if (surface === "Dashboard / operational surface") patternValue = pick(extendedProduct, "Dashboard Style (if applicable)") || pick(reasoning, "Recommended_Pattern") || pick(compactProduct, "pattern_bias");
  else patternValue = pick(compactProduct, "pattern_bias") || pick(reasoning, "Recommended_Pattern");
  const pattern = required(patternValue ?? "", "Task-first structure with progressive disclosure");
  const coreMoves = required(pick(chosenStyle, "core_moves"), "clear hierarchy, deliberate spacing, one restrained accent");
  const memoryHook = `Use ${firstMove(coreMoves).toLowerCase()} as the repeated visual signature without competing with the primary task.`;
  const styleAvoid = required(pick(chosenStyle, "avoid"), "effects that reduce readability or task clarity");
  const antiPatterns = required(pick(reasoning, "Anti_Patterns"), joined(productAvoid, styleAvoid));
  const primary = required(pick(palette, "Primary"), "existing project primary token");
  const accent = required(pick(palette, "Accent"), "existing project accent token");
  const background = required(pick(palette, "Background"), "existing project background token");
  const foreground = required(pick(palette, "Foreground"), "existing project foreground token");
  const headingFont = required(pick(typography, "Heading Font"), "existing project heading family");
  const bodyFont = required(pick(typography, "Body Font"), "existing project body family");
  const typeMood = required(pick(typography, "Mood/Style Keywords"), pick(reasoning, "Typography_Mood") || "readable and product-appropriate");
  const fitEvidence = chosenAssessment?.fitTerms.length ? chosenAssessment.fitTerms.join(", ") : "catalog product and surface recommendations";
  const conflictEvidence = chosenAssessment?.conflictTerms.length ? `Catalog caution overlaps: ${chosenAssessment.conflictTerms.join(", ")}.` : "No direct overlap with the chosen style's catalog cautions.";
  const confidence = confidenceNote(productAssessments, styleAssessments);
  const lines = [
    `# Frontend Design Brief: ${queryText}`, "", "## Context Assumptions", "",
    bullet("Product fit", productName), bullet("Surface", surface),
    bullet("User outcome", `Complete the primary ${productName.toLowerCase()} task with clear status, next action, and recovery.`),
    bullet("Constraint", "Preserve the project's framework, brand assets, component primitives, and naming unless the task explicitly replaces them."),
    "", "## Decision Evidence", "",
    bullet("Catalog basis", `${productName}; ${surface}; required behavior: ${productMust}.`),
    bullet("Context signals", signals.length ? signals.join(", ") : "No specialized pressure inferred; project evidence should supply missing context."),
    bullet("Direction fit", `${styleName} matches ${fitEvidence}.`),
    bullet("Conflict scan", conflictEvidence),
    bullet("Confidence", confidence),
    "", "## Information Presentation Contract", "",
    bullet("User question", presentation.question),
    bullet("Presentation mode", presentation.mode),
    bullet("First scan", presentation.firstScan),
    bullet("Persistent context", presentation.persistent),
    bullet("Evidence and uncertainty", "Keep source, timeframe, freshness, comparison baseline, missing data, and confidence near the claim or decision they affect."),
    bullet("Disclosure", "Keep decision-driving status, risk, evidence, action, and recovery visible; defer exhaustive history and secondary metadata."),
    "", "## Chosen Direction", "", bullet("Direction", styleName), bullet("Surface pattern", pattern), bullet("Memory hook", memoryHook),
    bullet("Why it fits", `${keyConsiderations} The direction supports ${surface.toLowerCase()} without separating visual identity from information clarity.`),
    "", "## Decision Ledger", "",
    bullet("Context", `${productName}; ${surface}; prioritize ${productMust}.`),
    bullet("Information", `${presentation.mode}; ${presentation.firstScan}; use ${pattern}.`),
    bullet("Direction", `${styleName}; ${memoryHook.charAt(0).toLowerCase()}${memoryHook.slice(1)}`),
    bullet("UX/layout", "Preserve semantic task order, complete states, and recovery; define useful minimum/preferred/maximum sizes plus explicit wrap, overflow, and phase-change behavior."),
    bullet("System", `Express ${styleName} through ${coreMoves}; map palette, type, spacing, component, state, and motion decisions to semantic tokens and finite variants.`),
    bullet("Proof", "Run project-native checks, then verify comprehension, intrinsic behavior, states, and visual direction in representative rendered contexts."),
    bullet("Next", "Resolve the first ledger stage that project evidence leaves unsupported before implementing downstream polish."),
    "", "## Visual System Implications", "",
    bullet("Palette", `Background ${background}; foreground ${foreground}; primary ${primary}; accent ${accent}. Map these to semantic roles before component styling.`),
    bullet("Typography", `Use ${headingFont} for display/heading emphasis and ${bodyFont} for sustained reading; target a ${typeMood} voice.`),
    "", "## Component and State Contract", "",
    "- Keep one dominant action per decision region; separate destructive actions spatially and semantically.",
    "- Use semantic elements, visible labels, keyboard-complete behavior, visible focus, and non-color state indicators.",
    "- Cover default, hover, pressed, focus, disabled, loading, selected, empty, error, success, long-content, and overflow states where relevant.",
    "- Tokenize repeated color, spacing, radius, elevation, and motion decisions; keep one-off artwork local.",
    "", "## Intrinsic Layout Behavior", "",
    "- Start from content, container, and task order; define useful minimum, preferred, and maximum sizes for important regions.",
    "- Decide what flows, stays fixed, wraps, overflows, or triggers a semantic phase change; let reusable components respond to their containers.",
    "- Test the narrowest supported context, intermediate widths, narrow and wide component containers, zoom, and long/localized content.",
  ];
  if (Object.keys(chart).length > 0) lines.push("", "## Data Display Decision", "", bullet("Chart", required(pick(chart, "Best Chart Type"), "Directly labeled chart appropriate to the decision")), bullet("Use when", required(pick(chart, "When to Use"), "the chart answers a specific user question")), bullet("Avoid when", required(pick(chart, "When NOT to Use"), "a number, table, or sentence communicates the answer more directly")));
  const rejected = alternativePool.slice(0, alternatives);
  if (rejected.length > 0) {
    lines.push("", "## Rejected Alternatives", "");
    for (const candidate of rejected) {
      const row = candidate.row;
      const name = required(pick(row, "style"), "Unnamed alternative");
      const moves = required(pick(row, "core_moves"), "a different visual language");
      if (candidate.conflictTerms.length > 0) lines.push(`- **${name}:** Rejected because its catalog cautions overlap ${candidate.conflictTerms.join(", ")} in this context. Reconsider only if project evidence removes that conflict.`);
      else {
        const fit = candidate.fitTerms.length ? candidate.fitTerms.join(", ") : "a weaker catalog match";
        lines.push(`- **${name}:** It supports ${fit}, but trails ${styleName} on the combined product and surface evidence. Choose it only if ${firstMove(moves).toLowerCase()} matters more than ${firstMove(coreMoves).toLowerCase()}.`);
      }
    }
  }
  lines.push("", "## Risks and Anti-Patterns", "", `- Avoid ${antiPatterns}.`, "- Do not introduce a second visual metaphor, unrelated accent palette, or ornamental motion system.");
  if (!styleAvoid.toLowerCase().startsWith("none")) lines.push(`- Avoid ${styleAvoid}.`);
  for (const row of ux) {
    const issue = required(joined(pick(row, "Category"), pick(row, "Issue")), "Relevant UX risk");
    const action = required(pick(row, "Do"), firstSentence(pick(row, "Description")) || "validate explicitly");
    lines.push(`- **${issue}:** ${action}.`);
  }
  lines.push("", "## Validation Plan", "", "- Run project-native type, lint, and test checks plus the targeted frontend heuristic validator.", "- Render the narrowest supported, intermediate, desktop/wide, and relevant component-container contexts.", "- Verify in a five-second scan that a reviewer can identify orientation, primary status or claim, governing question, next action, and recovery without designer explanation.", "- Inspect comparison alignment, disclosure, evidence, timeframe, freshness, uncertainty, keyboard focus, touch targets, contrast, reduced motion, loading/empty/partial/stale/error states, overflow, and localized long content.", "- Compare the render against the presentation contract, chosen direction, memory hook, intrinsic layout, and component contracts; correct the strongest comprehension or craft drift before handoff.", "- Record screenshots or equivalent comprehension and visual evidence when rendering tools are available; state the limitation when they are not.");
  return lines.join("\n");
}

function parseArgs(args) {
  let alternatives = 2;
  let output = "";
  const query = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "-n" || args[index] === "--alternatives") {
      alternatives = Number.parseInt(args[index + 1], 10);
      index += 1;
    } else if (args[index] === "-o" || args[index] === "--output") {
      output = args[index + 1] ?? "";
      index += 1;
    } else query.push(args[index]);
  }
  if (query.length === 0 || !Number.isInteger(alternatives)) throw new Error("Usage: generate_design_brief.mjs <query> [-n <alternatives>] [-o <output>]");
  return { query: query.join(" "), alternatives: Math.max(0, alternatives), output };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
    const result = synthesize(options.query, options.alternatives);
    if (options.output) writeFileSync(options.output, `${result}\n`, "utf8");
    else console.log(result);
    return 0;
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
