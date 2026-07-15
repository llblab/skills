#!/usr/bin/env node
/** Generate a component implementation brief. */

import { pathToFileURL } from "node:url";
import { mdBullet, pick, rankCsv } from "./_catalog.mjs";

const COMPONENTS = {
  button: {
    anatomy: "leading icon → label → trailing icon/loading",
    variants: "primary, secondary, outline, ghost, link, destructive",
    states: "default, hover, active, focus, disabled, loading",
    a11y: "Use <button>; explicit type in forms; icon-only buttons need accessible names; loading prevents duplicate submit.",
    content: "Keep label stable and action-oriented; preserve width during loading when possible.",
  },
  input: {
    anatomy: "label → control → helper/error text",
    variants: "text, textarea, select/combobox, checkbox, radio, switch",
    states: "default, hover, focus, error, disabled, read-only, loading",
    a11y: "Visible label, semantic input type, autocomplete, associated error text.",
    content: "Placeholder is example text, not the label; preserve entered value on errors.",
  },
  card: {
    anatomy: "header → title/meta → content → footer/actions",
    variants: "default, elevated, outline, interactive, metric, pricing, avatar",
    states: "default, hover, focus, selected, disabled, loading, empty",
    a11y: "Clickable card has one clear action and keyboard focus; avoid nested competing targets.",
    content: "Use consistent padding and hierarchy; handle long titles and missing media.",
  },
  dialog: {
    anatomy: "overlay → panel → title/description → content → actions",
    variants: "modal, alert, drawer/sheet, popover-like contextual panel",
    states: "opening, open, closing, loading, error, destructive confirmation",
    a11y: "Trap focus, expose title, restore focus on close, support Escape/close affordance.",
    content: "Keep primary and cancel actions distinct; scroll long content predictably.",
  },
  table: {
    anatomy: "toolbar/filters → header → rows → pagination/status → bulk action bar",
    variants: "simple, sortable, filterable, selectable, virtualized, comparison",
    states: "loading, empty, filtered-empty, error, selected, hover, focus, stale",
    a11y: "Header scopes, keyboard row/action access, non-color status indicators.",
    content: "Align numeric columns; manage horizontal overflow intentionally; preserve filters/back state.",
  },
  navigation: {
    anatomy: "brand → primary nav → secondary/actions → current state",
    variants: "top bar, sidebar, tabs, bottom nav, breadcrumbs, command/search nav",
    states: "active, hover, focus, collapsed, expanded, disabled, pending count",
    a11y: "Current page exposed; keyboard traversal logical; labels for icon nav.",
    content: "Top-level items are stable and few; back behavior preserves state.",
  },
};

const CUSTOM = {
  anatomy: "define regions/slots before styling",
  variants: "list finite variants based on product need",
  states: "default, hover, active, focus, disabled, loading, error, empty as applicable",
  a11y: "choose semantic element/role, label, keyboard behavior, focus behavior",
  content: "test long, missing, loading, and localized content",
};

function closest(name) {
  const lowered = name.toLowerCase();
  for (const [key, value] of Object.entries(COMPONENTS)) {
    if (key.includes(lowered) || lowered.includes(key)) return [key, value];
  }
  return ["custom", CUSTOM];
}

function parseArgs(args) {
  let context = "";
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--context") {
      context = args[index + 1] ?? "";
      index += 1;
    } else positional.push(args[index]);
  }
  if (positional.length !== 1) throw new Error("Usage: generate_component_brief.mjs <component> [--context <context>]");
  return { component: positional[0], context };
}

export function main(args = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const [key, spec] = closest(options.component);
  const query = [options.component, options.context].filter(Boolean).join(" ");
  const ux = rankCsv("ux-guidelines.csv", query, 5);
  const lines = [
    `# Component Brief: ${options.component}`, "",
    `- **Matched pattern:** ${key}`,
    mdBullet("Anatomy", spec.anatomy),
    mdBullet("Variants", spec.variants),
    mdBullet("States", spec.states),
    mdBullet("Accessibility", spec.a11y),
    mdBullet("Content behavior", spec.content),
    "", "## State Matrix", "",
    ...spec.states.split(", ").map((state) => `- [ ] ${state}: visual treatment, interaction behavior, accessibility semantics`),
    "", "## Information Presentation", "",
    "- Name the user question this component answers and the decision or action that follows.",
    "- Preserve a scan order of identity or label → current value/state → primary operation → feedback/evidence → supporting detail or recovery.",
    "- Keep material status, uncertainty, risk, freshness, and errors adjacent to the value or action they affect.",
    "- Choose list, table, timeline, definition layout, or split view when those relationships communicate better than independent cards.",
  ];
  if (ux.length > 0) {
    lines.push("", "## Relevant UX Checks", "");
    for (const row of ux) lines.push(`- **${pick(row, "Category")} / ${pick(row, "Issue")}** — Do: ${pick(row, "Do")} | Don't: ${pick(row, "Don't")}`);
  }
  lines.push("", "## Implementation Rules", "", "- Use project-native component and styling conventions.", "- Tokenize repeated semantic values and component contracts.", "- Define intrinsic minimum/preferred/maximum sizes, wrapping, overflow, and semantic phase changes; test narrow and wide containers with long content.");
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
