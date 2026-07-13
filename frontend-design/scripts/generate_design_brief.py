#!/usr/bin/env python3
"""Synthesize one coherent frontend direction from the local design catalog.

The output selects one connected direction rather than dumping unrelated candidates.
Catalog matches remain evidence; the brief owns the final decision chain.

Usage:
  python scripts/generate_design_brief.py "crypto analytics dashboard"
  python scripts/generate_design_brief.py "luxury hotel booking" -n 3
"""

from __future__ import annotations

import argparse
from pathlib import Path

from _catalog import expand_query, pick, rank_csv


def joined(*values: str) -> str:
    return " ".join(value for value in values if value)


def first_sentence(value: str) -> str:
    for separator in (";", "."):
        if separator in value:
            return value.split(separator, 1)[0].strip()
    return value.strip()


def first_move(value: str) -> str:
    for separator in (",", ";", "+"):
        if separator in value:
            return value.split(separator, 1)[0].strip()
    return value.strip()


def bullet(label: str, value: str) -> str:
    return f"- **{label}:** {value}"


def require(value: str, fallback: str) -> str:
    return value.strip() or fallback


def infer_surface(query: set[str]) -> str:
    if query & {"landing", "homepage", "marketing", "conversion", "signup", "waitlist", "pricing", "hero"}:
        return "Landing / marketing surface"
    if query & {"dashboard", "analytics", "metrics", "monitoring", "admin", "report", "kpi"}:
        return "Dashboard / operational surface"
    if query & {"form", "checkout", "onboarding", "flow", "wizard"}:
        return "Form / task flow"
    if query & {"slide", "slides", "presentation", "deck", "pitch"}:
        return "Presentation / narrative surface"
    if query & {"component", "button", "dialog", "modal", "table", "card", "navigation"}:
        return "Component / reusable interface surface"
    return "Product interface surface"


def synthesize(query_text: str, alternatives: int) -> str:
    query = expand_query(query_text)
    query_set = set(query)
    surface = infer_surface(query_set)

    compact_product = (rank_csv("product-patterns.csv", query_text, 1) or [{}])[0]
    product_name = require(pick(compact_product, "product_category"), "General digital product")
    extended_query = joined(query_text, product_name, pick(compact_product, "visual_bias"), pick(compact_product, "pattern_bias"))
    extended_product = (rank_csv("product-ui-patterns.csv", extended_query, 1) or [{}])[0]
    reasoning = (rank_csv("product-reasoning.csv", extended_query, 1) or [{}])[0]

    style_query = joined(
        query_text,
        product_name,
        pick(compact_product, "visual_bias"),
        pick(extended_product, "Primary Style Recommendation"),
        pick(reasoning, "Style_Priority"),
    )
    style_candidates = rank_csv("style-matrix.csv", style_query, max(2, alternatives + 1))
    chosen_style = style_candidates[0] if style_candidates else {}
    style_name = require(pick(chosen_style, "style"), "Project-native minimalism")
    alternative_pool = [
        row for row in rank_csv("style-matrix.csv", query_text, max(4, alternatives + 2))
        if pick(row, "style") != style_name
    ]

    palette_query = joined(query_text, product_name, pick(reasoning, "Color_Mood"), style_name)
    palette = (rank_csv("product-color-palettes.csv", palette_query, 1) or [{}])[0]
    type_query = joined(query_text, product_name, style_name, "readable accessible")
    typography = (rank_csv("typography-pairings.csv", type_query, 1) or [{}])[0]

    wants_landing = bool(query_set & {"landing", "homepage", "marketing", "conversion", "signup", "waitlist", "pricing", "hero"})
    wants_chart = bool(query_set & {"trend", "time", "comparison", "compare", "categories", "distribution", "relationship", "correlation", "flow", "funnel", "geography", "map", "forecast"})
    landing = (rank_csv("landing-patterns.csv", extended_query, 1) or [{}])[0] if wants_landing else {}
    chart = (rank_csv("chart-selection.csv", extended_query, 1) or [{}])[0] if wants_chart else {}
    ux = rank_csv("ux-guidelines.csv", joined(query_text, surface, product_name, "accessibility responsive interaction"), 4)

    if landing:
        pattern_value = pick(landing, "Pattern Name")
    elif surface == "Dashboard / operational surface":
        pattern_value = pick(reasoning, "Recommended_Pattern") or pick(compact_product, "pattern_bias")
    else:
        pattern_value = pick(compact_product, "pattern_bias") or pick(reasoning, "Recommended_Pattern")
    pattern = require(pattern_value, "Task-first structure with progressive disclosure")
    core_moves = require(pick(chosen_style, "core_moves"), "clear hierarchy, deliberate spacing, one restrained accent")
    memory_hook = f"Use {first_move(core_moves).lower()} as the repeated visual signature without competing with the primary task."
    product_must = require(pick(compact_product, "must_have"), "clear primary action, complete states, recoverable errors")
    product_avoid = require(pick(compact_product, "avoid"), "generic decoration without product meaning")
    style_avoid = require(pick(chosen_style, "avoid"), "effects that reduce readability or task clarity")
    key_considerations = require(pick(extended_product, "Key Considerations"), product_must)
    anti_patterns = require(pick(reasoning, "Anti_Patterns"), joined(product_avoid, style_avoid))

    primary = require(pick(palette, "Primary"), "existing project primary token")
    accent = require(pick(palette, "Accent"), "existing project accent token")
    background = require(pick(palette, "Background"), "existing project background token")
    foreground = require(pick(palette, "Foreground"), "existing project foreground token")
    heading_font = require(pick(typography, "Heading Font"), "existing project heading family")
    body_font = require(pick(typography, "Body Font"), "existing project body family")
    type_mood = require(pick(typography, "Mood/Style Keywords"), pick(reasoning, "Typography_Mood") or "readable and product-appropriate")

    lines = [
        f"# Frontend Design Brief: {query_text}",
        "",
        "## Context Assumptions",
        "",
        bullet("Product fit", product_name),
        bullet("Surface", surface),
        bullet("User outcome", f"Complete the primary {product_name.lower()} task with clear status, next action, and recovery."),
        bullet("Constraint", "Preserve the project's framework, brand assets, component primitives, and naming unless the task explicitly replaces them."),
        "",
        "## Chosen Direction",
        "",
        bullet("Direction", style_name),
        bullet("Surface pattern", pattern),
        bullet("Memory hook", memory_hook),
        bullet("Why it fits", f"{key_considerations} The direction supports {surface.lower()} without separating visual identity from operational clarity."),
        "",
        "## Design Decision Chain",
        "",
        bullet("Product → structure", f"Use {pattern}; prioritize {product_must}."),
        bullet("Structure → hierarchy", "Lead with current status or primary promise, then the main action, proof/context, details, and recovery paths."),
        bullet("Hierarchy → art direction", f"Express {style_name} through {core_moves}."),
        bullet("Art direction → palette", f"Background {background}; foreground {foreground}; primary {primary}; accent {accent}. Map these to semantic roles before component styling."),
        bullet("Art direction → typography", f"Use {heading_font} for display/heading emphasis and {body_font} for sustained reading; target a {type_mood} voice."),
        bullet("System → interaction", "Reuse semantic tokens and finite variants; keep focus, loading, disabled, selected, error, empty, and success states consistent."),
        "",
        "## Component and State Contract",
        "",
        "- Keep one dominant action per decision region; separate destructive actions spatially and semantically.",
        "- Use semantic elements, visible labels, keyboard-complete behavior, visible focus, and non-color state indicators.",
        "- Cover default, hover, pressed, focus, disabled, loading, selected, empty, error, success, long-content, and overflow states where relevant.",
        "- Tokenize repeated color, spacing, radius, elevation, and motion decisions; keep one-off artwork local.",
        "",
        "## Responsive Behavior",
        "",
        "- Start from the compact task order; preserve the primary action and status before adding desktop density.",
        "- Stack or reflow regions by priority rather than shrinking the desktop composition.",
        "- Test 320–390px, tablet, laptop, and wide layouts with long/localized content and touch-only input.",
    ]

    if chart:
        lines.extend([
            "",
            "## Data Display Decision",
            "",
            bullet("Chart", require(pick(chart, "Best Chart Type"), "Directly labeled chart appropriate to the decision")),
            bullet("Use when", require(pick(chart, "When to Use"), "the chart answers a specific user question")),
            bullet("Avoid when", require(pick(chart, "When NOT to Use"), "a number, table, or sentence communicates the answer more directly")),
        ])

    rejected = alternative_pool[:alternatives]
    if rejected:
        lines.extend(["", "## Rejected Alternatives", ""])
        for row in rejected:
            name = require(pick(row, "style"), "Unnamed alternative")
            moves = require(pick(row, "core_moves"), "a different visual language")
            lines.append(f"- **{name}:** Its {moves.lower()} can support a different emphasis, but {style_name} better prioritizes {product_must} for this surface.")

    lines.extend([
        "",
        "## Risks and Anti-Patterns",
        "",
        f"- Avoid {anti_patterns}.",
        "- Do not introduce a second visual metaphor, unrelated accent palette, or ornamental motion system.",
    ])
    if not style_avoid.lower().startswith("none"):
        lines.append(f"- Avoid {style_avoid}.")
    if ux:
        for row in ux:
            issue = require(joined(pick(row, "Category"), pick(row, "Issue")), "Relevant UX risk")
            action = require(pick(row, "Do"), first_sentence(pick(row, "Description")) or "validate explicitly")
            lines.append(f"- **{issue}:** {action}.")

    lines.extend([
        "",
        "## Validation Plan",
        "",
        "- Run project-native type, lint, and test checks plus the targeted frontend heuristic validator.",
        "- Render the changed surface at representative compact and desktop widths.",
        "- Inspect keyboard focus, touch targets, contrast, reduced motion, loading/error/empty states, overflow, and long content.",
        "- Compare the render against the chosen direction, memory hook, hierarchy, and token/component contracts; correct visible drift before handoff.",
        "- Record screenshots or equivalent visual evidence when rendering tools are available; state the limitation when they are not.",
    ])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Synthesize one connected frontend design direction")
    parser.add_argument("query", nargs="+", help="Product/interface description")
    parser.add_argument("-n", "--alternatives", type=int, default=2, help="Rejected alternatives to explain")
    parser.add_argument("-o", "--output", help="Write brief to file")
    args = parser.parse_args()
    result = synthesize(" ".join(args.query), max(0, args.alternatives))
    if args.output:
        Path(args.output).write_text(result + "\n", encoding="utf-8")
    else:
        print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
