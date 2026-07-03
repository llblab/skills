#!/usr/bin/env python3
"""Generate a portable frontend design brief from the skill's local data catalog.

Usage:
  python scripts/generate_design_brief.py "crypto analytics dashboard"
  python scripts/generate_design_brief.py "luxury hotel booking" -n 4
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from math import log
from _catalog import expand_query

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def tokens(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_+-]+", text.lower())


def row_text(row: dict[str, object]) -> str:
    parts: list[str] = []
    for value in row.values():
        if isinstance(value, list):
            parts.extend(str(item) for item in value)
        elif value is not None:
            parts.append(str(value))
    return " ".join(parts)


def score(query: list[str], row: dict[str, str]) -> float:
    words = tokens(row_text(row))
    if not words:
        return 0.0
    counts: dict[str, int] = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    norm = 1 + log(len(words) + 1)
    value = 0.0
    for term in query:
        value += counts.get(term, 0) / norm
        value += sum(0.2 / norm for word in counts if term in word and term != word)
    return value


def load_csv(name: str) -> list[dict[str, str]]:
    path = DATA / name
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def top(name: str, query: list[str], limit: int) -> list[dict[str, str]]:
    ranked = sorted(((score(query, row), row) for row in load_csv(name)), key=lambda item: item[0], reverse=True)
    return [row for value, row in ranked[:limit] if value > 0]


def first(row: dict[str, str], *keys: str) -> str:
    for key in keys:
        if row.get(key):
            return row[key]
    return ""


def bullet(label: str, value: str) -> str:
    return f"- **{label}:** {value}" if value else f"- **{label}:** —"


def section(lines: list[str], title: str) -> None:
    lines.extend([f"## {title}", ""])


def brief(query_text: str, limit: int) -> str:
    query = expand_query(query_text)
    terminology = top("terminology.csv", query, 2)
    compact_products = top("product-patterns.csv", query, 2)
    extended_products = top("product-ui-patterns.csv", query, 2)
    reasoning = top("product-reasoning.csv", query, 2)
    compact_styles = top("style-matrix.csv", query, limit)
    extended_styles = top("style-catalog.csv", query, min(limit, 3))
    palettes = top("product-color-palettes.csv", query, 2)
    typography = top("typography-pairings.csv", query, 2)
    ux = top("ux-guidelines.csv", query, 3)
    query_set = set(query)
    wants_landing = bool(query_set & {"landing", "marketing", "conversion", "signup", "waitlist", "hero", "sales", "pricing"})
    wants_chart = bool(query_set & {"dashboard", "analytics", "chart", "data", "metrics", "report", "monitoring", "kpi"})
    charts = top("chart-selection.csv", query, 2) if wants_chart else []
    landing = top("landing-patterns.csv", query, 2) if wants_landing else []
    lines = [f"# Frontend Design Brief: {query_text}", ""]
    if terminology:
        section(lines, "Terminology")
        for row in terminology:
            lines.append(f"### {first(row, 'canonical')}")
            lines.append(bullet("Kind", first(row, "kind")))
            lines.append(bullet("Aliases", first(row, "aliases")))
            lines.append(bullet("Definition", first(row, "definition")))
            lines.append(bullet("Notes", first(row, "notes")))
            lines.append("")
    if compact_products or extended_products or reasoning:
        section(lines, "Product Routing")
        for row in compact_products:
            lines.append(f"### {row.get('product_category')}")
            lines.append(bullet("Pattern bias", row.get("pattern_bias", "")))
            lines.append(bullet("Visual bias", row.get("visual_bias", "")))
            lines.append(bullet("Must have", row.get("must_have", "")))
            lines.append(bullet("Avoid", row.get("avoid", "")))
            lines.append("")
        for row in extended_products[:1]:
            lines.append(f"### Extended: {first(row, 'Product Type')}")
            lines.append(bullet("Primary style", first(row, "Primary Style Recommendation")))
            lines.append(bullet("Secondary styles", first(row, "Secondary Styles")))
            lines.append(bullet("Landing pattern", first(row, "Landing Page Pattern")))
            lines.append(bullet("Dashboard style", first(row, "Dashboard Style (if applicable)")))
            lines.append(bullet("UX priorities", first(row, "UX Priorities", "UX Priority")))
            lines.append("")
        for row in reasoning[:1]:
            lines.append(f"### Reasoning: {first(row, 'UI_Category')}")
            lines.append(bullet("Recommended pattern", first(row, "Recommended_Pattern")))
            lines.append(bullet("Style priority", first(row, "Style_Priority")))
            lines.append(bullet("Color mood", first(row, "Color_Mood")))
            lines.append(bullet("Typography mood", first(row, "Typography_Mood")))
            lines.append(bullet("Anti-patterns", first(row, "Anti_Patterns")))
            lines.append("")
    if compact_styles or extended_styles:
        section(lines, "Style Candidates")
        for row in compact_styles:
            lines.append(f"### {row.get('style')}")
            lines.append(bullet("Use for", row.get("use_for", "")))
            lines.append(bullet("Core moves", row.get("core_moves", "")))
            lines.append(bullet("Avoid", row.get("avoid", "")))
            lines.append(bullet("Implementation checks", row.get("implementation_checks", "")))
            lines.append("")
        for row in extended_styles[:1]:
            lines.append(f"### Extended: {first(row, 'Style Category')}")
            lines.append(bullet("Primary colors", first(row, "Primary Colors")))
            lines.append(bullet("Effects", first(row, "Effects & Animation")))
            lines.append(bullet("Best for", first(row, "Best For")))
            lines.append(bullet("Do not use for", first(row, "Do Not Use For")))
            lines.append("")
    if palettes or typography:
        section(lines, "Palette and Typography")
        for row in palettes:
            lines.append(f"### Palette: {first(row, 'Product Type')}")
            lines.append(bullet("Primary", first(row, "Primary")))
            lines.append(bullet("Secondary", first(row, "Secondary")))
            lines.append(bullet("Accent", first(row, "Accent")))
            lines.append(bullet("Background", first(row, "Background", "Surface")))
            lines.append("")
        for row in typography:
            lines.append(f"### Type: {first(row, 'Font Pairing Name')}")
            lines.append(bullet("Heading", first(row, "Heading Font")))
            lines.append(bullet("Body", first(row, "Body Font")))
            lines.append(bullet("Mood", first(row, "Mood/Style Keywords")))
            lines.append(bullet("Best for", first(row, "Best For")))
            lines.append("")
    if landing or charts or ux:
        section(lines, "Surface and UX Hints")
        for row in landing[:1]:
            lines.append(f"### Landing: {first(row, 'Pattern Name')}")
            lines.append(bullet("Section order", first(row, "Section Order")))
            lines.append(bullet("CTA placement", first(row, "Primary CTA Placement")))
            lines.append(bullet("Conversion", first(row, "Conversion Optimization")))
            lines.append("")
        for row in charts[:1]:
            lines.append(f"### Chart: {first(row, 'Best Chart Type')}")
            lines.append(bullet("Data type", first(row, "Data Type")))
            lines.append(bullet("When to use", first(row, "When to Use")))
            lines.append(bullet("Avoid", first(row, "When NOT to Use")))
            lines.append("")
        for row in ux:
            lines.append(f"### UX: {first(row, 'Category')} / {first(row, 'Issue')}")
            lines.append(bullet("Do", first(row, "Do")))
            lines.append(bullet("Don't", first(row, "Don't")))
            lines.append("")
    section(lines, "Implementation Floor")
    lines.extend([
        "- Define semantic color roles: background, foreground, surface, border, primary, accent, danger, warning, success, focus.",
        "- Design states: default, hover, active, focus, disabled, loading, selected, error, empty.",
        "- Verify keyboard access, visible focus, contrast, responsive behavior, reduced motion, loading/error/empty states.",
        "- Use project-native files, naming, and styling conventions.",
    ])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate frontend design brief")
    parser.add_argument("query", nargs="+", help="Product/interface description")
    parser.add_argument("-n", "--limit", type=int, default=3)
    parser.add_argument("-o", "--output", help="Write brief to file")
    args = parser.parse_args()
    result = brief(" ".join(args.query), args.limit)
    if args.output:
        Path(args.output).write_text(result + "\n", encoding="utf-8")
    else:
        print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
